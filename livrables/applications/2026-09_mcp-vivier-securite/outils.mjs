// Outils MCP Vivier securite : diagnostic en LECTURE SEULE (n8n + audit du code).
// Aucun outil d'ecriture. Toute correction est une proposition que Zeze valide.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { appendFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { auditerCode } from "./audit.mjs";

const ICI = dirname(fileURLToPath(import.meta.url));
try { process.loadEnvFile(join(ICI, ".env")); } catch { /* pas de .env : variables du systeme (Railway) */ }

const APP_DIR = resolve(process.env.APP_DIR ?? join(ICI, "..", "2026-09_plateforme-formation-communaute", "app"));
const N8N_URL = (process.env.N8N_URL ?? "").replace(/\/$/, "");
const N8N_KEY = process.env.N8N_API_KEY ?? "";
const REVOQUE = join(ICI, "REVOQUE");   // present (ou MCP_REVOQUE=1) = plus aucun outil ne repond
const JOURNAL = process.env.JOURNAL_FILE ?? join(ICI, "journal.log");

const SECRET_KEY = /key|token|secret|password|authorization/i;
const masquer = (o) => JSON.parse(JSON.stringify(o ?? {}, (k, v) => (SECRET_KEY.test(k) ? "***" : v)));
// Retire tout ce qui ressemble a un secret d'un texte renvoye a Cowork.
export const nettoyer = (s) => String(s ?? "")
  .replace(/eyJ[\w-]{15,}\.[\w-]{15,}\.[\w-]{10,}/g, "[jwt]")
  .replace(/(sb_secret_|sk-ant-|sk-)[\w-]{10,}/g, "[cle]")
  .replace(/(postgres(?:ql)?:\/\/[^:\s/]+:)[^@\s]+@/g, "$1[mdp]@")
  .slice(0, 500);

// Journal JSON par ligne, aussi sur la sortie standard (Railway garde les logs).
export function journaliser(outil, args, resultat) {
  const ligne = JSON.stringify({ t: new Date().toISOString(), outil, args: masquer(args), resultat });
  try { appendFileSync(JOURNAL, ligne + "\n"); } catch { /* disque en lecture seule */ }
  if (process.env.JOURNAL_STDOUT === "1") console.error(ligne);
}

async function n8n(chemin) {
  if (!N8N_URL || !N8N_KEY) throw new Error("N8N_URL ou N8N_API_KEY manquant.");
  const r = await fetch(`${N8N_URL}/api/v1${chemin}`, { headers: { "X-N8N-API-KEY": N8N_KEY, accept: "application/json" } });
  if (!r.ok) throw new Error(`n8n a repondu ${r.status}`);
  return r.json();
}

// Un McpServer par connexion : les outils sont declares ici, une seule fois.
export function creerServeur() {
  const server = new McpServer({ name: "vivier-securite", version: "0.1.0" });

  // Enveloppe commune : interrupteur d'urgence + journal.
  function outil(nom, description, schema, fn) {
    server.registerTool(nom, { description, inputSchema: schema }, async (args) => {
      if (existsSync(REVOQUE) || process.env.MCP_REVOQUE === "1") {
        journaliser(nom, args, "refuse: acces revoque");
        return { isError: true, content: [{ type: "text", text: "Acces revoque par Zeze. Aucun outil disponible." }] };
      }
      try {
        const data = await fn(args);
        journaliser(nom, args, "ok");
        return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
      } catch (e) {
        journaliser(nom, args, `erreur: ${nettoyer(e.message)}`);
        return { isError: true, content: [{ type: "text", text: `Erreur: ${nettoyer(e.message)}` }] };
      }
    });
  }

  outil("n8n_lister_workflows", "Liste les workflows n8n (id, nom, actif, dates). Lecture seule.",
    {}, async () => (await n8n("/workflows?limit=100")).data.map((w) =>
      ({ id: w.id, nom: w.name, actif: w.active, modifie: w.updatedAt })));

  outil("n8n_lire_workflow", "Structure d'un workflow : noeuds et connexions, sans aucun identifiant ni valeur de credential.",
    { id: z.string().describe("Identifiant du workflow") },
    async ({ id }) => {
      const w = await n8n(`/workflows/${encodeURIComponent(id)}`);
      return {
        id: w.id, nom: w.name, actif: w.active,
        noeuds: w.nodes.map((n) => ({
          nom: n.name, type: n.type,
          credentials: Object.keys(n.credentials ?? {}), // types seulement, jamais les valeurs
          desactive: !!n.disabled,
        })),
        connexions: w.connections,
        workflowErreur: w.settings?.errorWorkflow ?? null,
      };
    });

  outil("n8n_lister_executions", "Liste les executions n8n recentes, filtrables par statut (error, success, waiting). Sans donnees d'execution.",
    { statut: z.enum(["error", "success", "waiting"]).optional(), workflowId: z.string().optional(), limite: z.number().int().min(1).max(50).default(20) },
    async ({ statut, workflowId, limite }) => {
      const q = new URLSearchParams({ limit: String(limite), includeData: "false" });
      if (statut) q.set("status", statut);
      if (workflowId) q.set("workflowId", workflowId);
      return (await n8n(`/executions?${q}`)).data.map((e) =>
        ({ id: e.id, workflowId: e.workflowId, statut: e.status, debut: e.startedAt, fin: e.stoppedAt, mode: e.mode }));
    });

  outil("n8n_lire_execution", "Cause d'echec d'une execution : noeud en erreur et message nettoye. Ne renvoie jamais les donnees traitees.",
    { id: z.string() },
    async ({ id }) => {
      const e = await n8n(`/executions/${encodeURIComponent(id)}?includeData=true`);
      const err = e.data?.resultData?.error;
      return {
        id: e.id, workflowId: e.workflowId, statut: e.status, debut: e.startedAt, fin: e.stoppedAt,
        noeudEnErreur: e.data?.resultData?.lastNodeExecuted ?? null,
        erreur: err ? nettoyer(err.message) : null,
      };
    });

  outil("auditer_code_plateforme", "Audit statique du code de la plateforme Vivier Academies : secrets en clair, .env suivi par git, routes et actions serveur sans controle d'acces, comparaison de secret non constante, dependances vulnerables. Ne modifie rien, ne renvoie jamais une valeur de secret.",
    {}, async () => {
      const constats = auditerCode(APP_DIR);
      return { total: constats.length, constats };
    });

  return server;
}
