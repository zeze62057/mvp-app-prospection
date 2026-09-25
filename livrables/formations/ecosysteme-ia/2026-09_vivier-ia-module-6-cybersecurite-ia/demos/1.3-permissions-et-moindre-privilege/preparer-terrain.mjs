// Demo 1.3 : fabrique un dossier d'essai avec de FAUX secrets pour tester des regles de permission.
// Tout est faux. Aucun reseau. Ne lancez jamais cet essai dans un vrai projet.
// Usage : node preparer-terrain.mjs [dossier]   (defaut : <dossier temporaire>/terrain-permissions)
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const cible = resolve(process.argv[2] ?? join(tmpdir(), "terrain-permissions"));
if (existsSync(cible) && !existsSync(join(cible, ".terrain-de-demo"))) {
  console.error(`Le dossier existe deja et n'est pas un terrain de demo : ${cible}`);
  process.exit(1);
}
rmSync(cible, { recursive: true, force: true });
for (const d of ["src", "docs", "secrets", ".claude"]) mkdirSync(join(cible, d), { recursive: true });

writeFileSync(join(cible, ".terrain-de-demo"), "Dossier cree par preparer-terrain.mjs. Supprimable.\n");
writeFileSync(join(cible, ".env"), "CLE_API=FAUX-sk-demo-2222222222222222\n");
writeFileSync(join(cible, "secrets", "cle.txt"), "MOT_DE_PASSE_BASE=FAUX-motdepasse-demo\n");
writeFileSync(join(cible, "src", "app.js"), 'console.log("bonjour");\n');
writeFileSync(join(cible, "docs", "notes.md"), "# Notes de demo\nUn fichier que l'agent a le droit de modifier.\n");
writeFileSync(join(cible, ".claude", "settings.json"), "{}\n");

console.log(`Terrain pret : ${cible}`);
console.log("Etape suivante : copiez reglages-corriges.json dans .claude/settings.json de ce terrain,");
console.log("puis lancez votre agent DANS ce dossier et suivez le README de la demo.");
