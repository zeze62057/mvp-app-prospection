// Point d'entree distant (HTTPS via Railway) : c'est celui que Cowork utilise.
// Sans jeton OAuth valide, rien ne repond. Lecture seule, comme la version locale.
import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { getOAuthProtectedResourceMetadataUrl, mcpAuthRouter } from "@modelcontextprotocol/sdk/server/auth/router.js";
import { requireBearerAuth } from "@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { creerServeur } from "./outils.mjs";
import { creerFournisseur, SCOPE } from "./oauth.mjs";

const env = process.env;
const manquantes = ["BASE_URL", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "ALLOWED_EMAIL"].filter((k) => !env[k]);
if (manquantes.length) { console.error(`Demarrage refuse, variables manquantes : ${manquantes.join(", ")}`); process.exit(1); }

const baseUrl = new URL(env.BASE_URL);
if (baseUrl.protocol !== "https:" && baseUrl.hostname !== "localhost") {
  console.error("Demarrage refuse : BASE_URL doit etre en https (sauf localhost)."); process.exit(1);
}

const provider = creerFournisseur({
  baseUrl, googleId: env.GOOGLE_CLIENT_ID, googleSecret: env.GOOGLE_CLIENT_SECRET,
  emailAutorise: env.ALLOWED_EMAIL.trim().toLowerCase(),
  googleAuthUrl: env.GOOGLE_AUTH_URL ?? "https://accounts.google.com/o/oauth2/v2/auth",
  googleTokenUrl: env.GOOGLE_TOKEN_URL ?? "https://oauth2.googleapis.com/token",
  fichierRevoque: join(dirname(fileURLToPath(import.meta.url)), "REVOQUE"),
});

const urlMcp = new URL("/mcp", baseUrl);
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1); // Railway termine le TLS devant nous

app.use(mcpAuthRouter({
  provider, issuerUrl: baseUrl, resourceServerUrl: urlMcp,
  scopesSupported: [SCOPE], resourceName: "MCP Vivier securite",
}));
app.get("/google/callback", (req, res) => provider.callback(req, res));
app.get("/sante", (_req, res) => res.type("text").send("ok"));

const auth = requireBearerAuth({
  verifier: provider, requiredScopes: [SCOPE],
  resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(urlMcp),
});

// Sans etat : un serveur et un transport neufs par requete.
app.post("/mcp", auth, express.json({ limit: "100kb" }), async (req, res) => {
  const server = creerServeur();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});
app.all("/mcp", (_req, res) => res.status(405).json({ error: "Methode non autorisee" }));

app.listen(Number(env.PORT ?? 3000), () => console.error(`MCP distant en ecoute sur ${env.PORT ?? 3000}`));
