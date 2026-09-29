// Test de bout en bout de la version distante, avec un FAUX Google local (aucun compte reel touche).
import assert from "node:assert";
import { spawn } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { rmSync, writeFileSync } from "node:fs";
import express from "express";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const GOOGLE_ID = "id-de-test", AUTORISE = "moi@example.com";
let emailConnecte = AUTORISE;

// Faux Google : /auth renvoie tout de suite un code, /token renvoie un id_token non signe.
const faux = express();
faux.get("/auth", (req, res) => { const u = new URL(req.query.redirect_uri); u.searchParams.set("code", "c"); u.searchParams.set("state", req.query.state); res.redirect(u.href); });
faux.post("/token", (_q, res) => {
  const p = Buffer.from(JSON.stringify({ aud: GOOGLE_ID, iss: "https://accounts.google.com", exp: Date.now() / 1000 + 300, email: emailConnecte, email_verified: true })).toString("base64url");
  res.json({ id_token: `x.${p}.y` });
});
const fauxSrv = await new Promise((r) => { const s = faux.listen(0, () => r(s)); });
const fauxUrl = `http://localhost:${fauxSrv.address().port}`;

const PORT = 3900 + Math.floor(Math.random() * 90), BASE = `http://localhost:${PORT}`;
rmSync("REVOQUE", { force: true });
const srv = spawn("node", ["http.mjs"], {
  env: { ...process.env, PORT, BASE_URL: BASE, GOOGLE_CLIENT_ID: GOOGLE_ID, GOOGLE_CLIENT_SECRET: "secret-de-test",
    ALLOWED_EMAIL: AUTORISE, GOOGLE_AUTH_URL: `${fauxUrl}/auth`, GOOGLE_TOKEN_URL: `${fauxUrl}/token`, JOURNAL_FILE: "journal-test.log" },
  stdio: ["ignore", "ignore", "inherit"],
});
const fin = async (code) => { srv.kill(); fauxSrv.close(); rmSync("journal-test.log", { force: true }); rmSync("REVOQUE", { force: true }); process.exit(code); };
try {
  for (let i = 0; i < 50; i++) { try { if ((await fetch(`${BASE}/sante`)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }

  // 1. Sans jeton : refus
  let r = await fetch(`${BASE}/mcp`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
  assert.equal(r.status, 401, "sans jeton doit donner 401");

  // 2. Enregistrement du client (comme Cowork)
  const cb = "http://localhost:9999/cb";
  const reg = await (await fetch(`${BASE}/register`, { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ redirect_uris: [cb], token_endpoint_auth_method: "none", grant_types: ["authorization_code", "refresh_token"], response_types: ["code"], client_name: "test" }) })).json();
  assert(reg.client_id, "enregistrement du client");

  // 3. Flux autorisation avec PKCE
  async function obtenirCode() {
    const verifier = randomBytes(32).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    const q = new URLSearchParams({ client_id: reg.client_id, redirect_uri: cb, response_type: "code", code_challenge: challenge, code_challenge_method: "S256", state: "xyz", scope: "mcp:read", resource: `${BASE}/mcp` });
    let loc = (await fetch(`${BASE}/authorize?${q}`, { redirect: "manual" })).headers.get("location");
    const g = await fetch(loc, { redirect: "manual" });              // faux Google
    const back = await fetch(g.headers.get("location"), { redirect: "manual" }); // notre /google/callback
    return { verifier, back };
  }

  // 4. Compte NON autorise : 403 et aucun code
  emailConnecte = "intrus@example.com";
  let t = await obtenirCode();
  assert.equal(t.back.status, 403, "intrus doit etre refuse");
  assert(!(t.back.headers.get("location") ?? "").includes("code="), "aucun code pour l'intrus");

  // 5. Compte autorise : code, puis jeton
  emailConnecte = AUTORISE;
  t = await obtenirCode();
  const codeUrl = new URL(t.back.headers.get("location"));
  assert.equal(codeUrl.searchParams.get("state"), "xyz");
  const tokRes = await fetch(`${BASE}/token`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code: codeUrl.searchParams.get("code"), code_verifier: t.verifier, client_id: reg.client_id, redirect_uri: cb, resource: `${BASE}/mcp` }) });
  const tok = await tokRes.json();
  assert(tok.access_token, `jeton attendu : ${JSON.stringify(tok)}`);

  // 6. Mauvais verifier PKCE : refuse
  t = await obtenirCode();
  const mauvais = await fetch(`${BASE}/token`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "authorization_code", code: new URL(t.back.headers.get("location")).searchParams.get("code"), code_verifier: "x".repeat(50), client_id: reg.client_id, redirect_uri: cb }) });
  assert.notEqual(mauvais.status, 200, "PKCE invalide doit etre refuse");

  // 7. Appel MCP avec le jeton : 5 outils
  const c = new Client({ name: "test", version: "0" });
  await c.connect(new StreamableHTTPClientTransport(new URL(`${BASE}/mcp`), { requestInit: { headers: { Authorization: `Bearer ${tok.access_token}` } } }));
  const noms = (await c.listTools()).tools.map((x) => x.name).sort();
  assert.equal(noms.length, 5); assert(noms.every((n) => n.startsWith("n8n_") || n === "auditer_code_plateforme"));
  // aucun outil d'ecriture
  assert(!noms.some((n) => /ecrire|supprimer|modifier|creer|appliquer|executer/.test(n)));
  await c.close();

  // 8. Interrupteur d'urgence : le meme jeton est refuse aussitot
  writeFileSync("REVOQUE", "");
  r = await fetch(`${BASE}/mcp`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${tok.access_token}` }, body: "{}" });
  assert.equal(r.status, 401, "jeton refuse apres REVOQUE");
  rmSync("REVOQUE");

  // 9. Jeton renouvele avec l'ancien : rotation
  const ref = await (await fetch(`${BASE}/token`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: tok.refresh_token, client_id: reg.client_id }) })).json();
  assert(ref.access_token && ref.access_token !== tok.access_token, "renouvellement");
  const rejeu = await fetch(`${BASE}/token`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: tok.refresh_token, client_id: reg.client_id }) });
  assert.notEqual(rejeu.status, 200, "ancien jeton de renouvellement doit mourir");

  console.log("OK: 401 sans jeton, intrus refuse, PKCE, 5 outils lecture seule, interrupteur d'urgence, rotation des jetons");
  await fin(0);
} catch (e) { console.error("ECHEC:", e.message); await fin(1); }
