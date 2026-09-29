// Test de bout en bout : demarre le serveur, appelle l'audit, verifie journal et interrupteur d'urgence.
import assert from "node:assert";
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

rmSync("journal.log", { force: true });
const c = new Client({ name: "test", version: "0" });
await c.connect(new StdioClientTransport({ command: "node", args: ["server.mjs"] }));

const outils = (await c.listTools()).tools.map((t) => t.name);
assert.deepEqual(outils.sort(), ["auditer_code_plateforme", "n8n_lire_execution", "n8n_lire_workflow", "n8n_lister_executions", "n8n_lister_workflows"]);

const r = await c.callTool({ name: "auditer_code_plateforme", arguments: {} });
assert(!r.isError, "audit en erreur");
const audit = JSON.parse(r.content[0].text);
console.log(`audit: ${audit.total} constat(s)`);
for (const k of audit.constats) console.log(`- [${k.severite}] ${k.regle} ${k.fichier}:${k.ligne}`);

assert(readFileSync("journal.log", "utf8").includes('"outil":"auditer_code_plateforme"'), "journal vide");

writeFileSync("REVOQUE", "");
const rev = await c.callTool({ name: "auditer_code_plateforme", arguments: {} });
rmSync("REVOQUE");
assert(rev.isError && /revoque/i.test(rev.content[0].text), "interrupteur d'urgence inactif");
assert(!existsSync("REVOQUE"));
console.log("OK: outils, journal, interrupteur d'urgence");
await c.close();
