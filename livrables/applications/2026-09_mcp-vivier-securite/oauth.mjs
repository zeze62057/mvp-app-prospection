// Serveur d'autorisation OAuth 2.1 (PKCE) pour le MCP, avec Google comme identite.
// Une seule personne passe : l'adresse ALLOWED_EMAIL, verifiee par Google.
// Jetons en memoire : un redemarrage du serveur les revoque tous (voulu, voir README).
import { createHash, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";
import { InvalidTokenError } from "@modelcontextprotocol/sdk/server/auth/errors.js";
import { journaliser } from "./outils.mjs";

const rnd = () => randomBytes(32).toString("base64url");
const hash = (t) => createHash("sha256").update(t).digest("hex"); // on ne garde jamais un jeton en clair
const MAX_CLIENTS = 50;
const TTL = { code: 5 * 60e3, attente: 10 * 60e3, acces: 60 * 60e3, refresh: 30 * 24 * 3600e3 };
export const SCOPE = "mcp:read";

export function creerFournisseur({ baseUrl, googleId, googleSecret, emailAutorise, googleAuthUrl, googleTokenUrl, fichierRevoque }) {
  const clients = new Map(), attente = new Map(), codes = new Map(), acces = new Map(), refresh = new Map();
  const purger = (...cartes) => { for (const m of cartes) for (const [k, v] of m) if (v.exp < Date.now()) m.delete(k); };
  const revoque = () => process.env.MCP_REVOQUE === "1" || existsSync(fichierRevoque);
  const callbackUri = new URL("/google/callback", baseUrl).href;

  function emettre(clientId, resource) {
    const a = rnd(), r = rnd();
    acces.set(hash(a), { clientId, exp: Date.now() + TTL.acces });
    refresh.set(hash(r), { clientId, exp: Date.now() + TTL.refresh, resource });
    return { access_token: a, token_type: "Bearer", expires_in: TTL.acces / 1000, refresh_token: r, scope: SCOPE };
  }

  const fournisseur = {
    clientsStore: {
      getClient: (id) => clients.get(id),
      registerClient: (c) => {
        if (clients.size >= MAX_CLIENTS) throw new Error("Trop de clients enregistres");
        clients.set(c.client_id, c);
        return c;
      },
    },

    async authorize(client, params, res) {
      purger(attente);
      if (!emailAutorise) return res.status(503).send("Liste blanche vide : acces ferme.");
      if (revoque()) return res.status(503).send("Acces revoque.");
      const sid = rnd();
      attente.set(sid, { client, params, exp: Date.now() + TTL.attente });
      const u = new URL(googleAuthUrl);
      u.search = new URLSearchParams({
        client_id: googleId, redirect_uri: callbackUri, response_type: "code",
        scope: "openid email", state: sid, prompt: "select_account", login_hint: emailAutorise,
      }).toString();
      res.redirect(u.href);
    },

    // GET /google/callback : Google renvoie ici. On verifie qui s'est connecte, puis on rend la main a Cowork.
    async callback(req, res) {
      purger(attente);
      const p = attente.get(String(req.query.state));
      attente.delete(String(req.query.state));
      if (!p) return res.status(400).send("Demande expiree ou inconnue.");
      const retour = (params) => {
        const u = new URL(p.params.redirectUri);
        for (const [k, v] of Object.entries({ ...params, state: p.params.state })) if (v) u.searchParams.set(k, v);
        res.redirect(u.href);
      };
      try {
        if (req.query.error || !req.query.code) return retour({ error: "access_denied" });
        const r = await fetch(googleTokenUrl, {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code: String(req.query.code), client_id: googleId, client_secret: googleSecret,
            redirect_uri: callbackUri, grant_type: "authorization_code",
          }),
        });
        if (!r.ok) throw new Error(`google ${r.status}`);
        // id_token recu directement de Google en HTTPS avec notre secret : la signature n'a pas besoin d'etre reverifiee (OIDC 3.1.3.7).
        const idt = JSON.parse(Buffer.from((await r.json()).id_token.split(".")[1], "base64url").toString());
        const ok = idt.aud === googleId && /^(https:\/\/)?accounts\.google\.com$/.test(idt.iss) &&
          idt.exp * 1000 > Date.now() && idt.email_verified === true &&
          String(idt.email).toLowerCase() === emailAutorise && !revoque();
        if (!ok) {
          journaliser("oauth", {}, "refuse: compte non autorise");
          return res.status(403).send("Compte non autorise.");
        }
        const code = rnd();
        codes.set(code, { clientId: p.client.client_id, challenge: p.params.codeChallenge, redirectUri: p.params.redirectUri, resource: p.params.resource, exp: Date.now() + TTL.code });
        journaliser("oauth", {}, "ok: code emis");
        retour({ code });
      } catch (e) {
        journaliser("oauth", {}, "erreur: echange Google");
        retour({ error: "server_error" });
      }
    },

    async challengeForAuthorizationCode(client, code) {
      const c = codes.get(code);
      if (!c || c.clientId !== client.client_id || c.exp < Date.now()) throw new Error("Code invalide");
      return c.challenge;
    },

    async exchangeAuthorizationCode(client, code, _verifier, redirectUri) {
      const c = codes.get(code);
      codes.delete(code); // usage unique
      if (!c || c.clientId !== client.client_id || c.exp < Date.now()) throw new Error("Code invalide");
      if (redirectUri && redirectUri !== c.redirectUri) throw new Error("redirect_uri different");
      if (revoque()) throw new Error("Acces revoque");
      return emettre(client.client_id, c.resource);
    },

    async exchangeRefreshToken(client, jeton) {
      const r = refresh.get(hash(jeton));
      refresh.delete(hash(jeton)); // rotation : l'ancien jeton meurt
      if (!r || r.clientId !== client.client_id || r.exp < Date.now() || revoque()) throw new Error("Jeton de renouvellement invalide");
      return emettre(client.client_id, r.resource);
    },

    async verifyAccessToken(jeton) {
      const a = acces.get(hash(jeton));
      if (!a || a.exp < Date.now()) throw new InvalidTokenError("Jeton invalide ou expire");
      if (revoque()) throw new InvalidTokenError("Acces revoque");
      return { token: jeton, clientId: a.clientId, scopes: [SCOPE], expiresAt: Math.floor(a.exp / 1000) };
    },

    async revokeToken(_client, { token }) {
      acces.delete(hash(token));
      refresh.delete(hash(token));
    },
  };
  return fournisseur;
}
