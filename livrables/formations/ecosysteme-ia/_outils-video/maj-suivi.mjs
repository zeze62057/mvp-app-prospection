// Met a jour la ligne d'un chapitre dans SUIVI-VIDEOS.md : etat « script prêt », date du jour, duree estimee
// (lue dans 01-script.md) et notes.
//
//   node maj-suivi.mjs <dossier-du-chapitre> "notes"
//
// Le dossier doit etre de la forme <module>/videos/<section>/chapitre-N : la section est retrouvee par la ligne
// « Source : `<module>/<section>.md` » du suivi. Le chapitre est retrouve par « | Chapitre N : ».
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dossier = path.resolve(process.argv[2] ?? "");
const notes = process.argv[3] ?? "";
const m = dossier.replaceAll("\\", "/").match(/([^/]+)\/videos\/([^/]+)\/chapitre-(\d+)$/);
if (!m) {
  console.error("Usage : node maj-suivi.mjs <module>/videos/<section>/chapitre-N \"notes\"");
  process.exit(1);
}
const [, mod, section, n] = m;
const suivi = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "SUIVI-VIDEOS.md");
const script = fs.readFileSync(path.join(dossier, "01-script.md"), "utf8");
const d = script.match(/Durée estimée : (\d+:\d\d)\*\*/)?.[1] ?? "?";
const aujourdhui = new Date().toISOString().slice(0, 10);

const lignes = fs.readFileSync(suivi, "utf8").split("\n");
const debut = lignes.findIndex((l) => l.startsWith("Source :") && l.includes(`${mod}/${section}.md`));
if (debut < 0) {
  console.error(`Section introuvable dans le suivi : ${mod}/${section}.md`);
  process.exit(1);
}
let fait = false;
for (let i = debut + 1; i < lignes.length && !lignes[i].startsWith("### ") && !lignes[i].startsWith("## "); i++) {
  const r = lignes[i].match(new RegExp(`^\\| (Chapitre ${n} : [^|]*?) \\|`));
  if (r) {
    lignes[i] = `| ${r[1]} | script prêt | ${aujourdhui} | estimée ${d} | ${notes} |`;
    fait = true;
    break;
  }
}
if (!fait) {
  console.error(`Chapitre ${n} introuvable dans la section ${section}.`);
  process.exit(1);
}
fs.writeFileSync(suivi, lignes.join("\n"), "utf8");
console.log(`Suivi mis à jour : ${section}, chapitre ${n}, estimée ${d}`);
