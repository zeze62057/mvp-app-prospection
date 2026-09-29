// Point d'entree local (stdio) : Claude Desktop, Claude Code. Pas Cowork (voir http.mjs).
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { creerServeur } from "./outils.mjs";

await creerServeur().connect(new StdioServerTransport());
