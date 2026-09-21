// Enchaine tout ce qui est mecanique pour un chapitre, en une commande :
//   1. minutage du script (01-script.md)
//   2. construction du PowerPoint (diapositives.json)
//   3. controle dans PowerPoint (effets, clics, alertes de mise en page) et export des images
//   4. planche d'apercu (rendu/planche.png)
//   5. ecriture de 02-diapositives.md et 03-enregistrement-et-mise-en-ligne.md
//   6. copie du PowerPoint sur le Bureau (cle "bureau" du JSON), si elle existe
//
//   node terminer-chapitre.mjs <dossier-du-chapitre>
//
// A relancer apres chaque retouche du script ou du JSON. Le contenu (script, diapositives) reste ecrit
// a la main : cet outil ne fait que les operations repetitives.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outils = path.dirname(fileURLToPath(import.meta.url));
const dossier = path.resolve(process.argv[2] ?? "");
const jsonChemin = path.join(dossier, "diapositives.json");
const scriptChemin = path.join(dossier, "01-script.md");
if (!process.argv[2] || !fs.existsSync(jsonChemin) || !fs.existsSync(scriptChemin)) {
  console.error("Usage : node terminer-chapitre.mjs <dossier-du-chapitre>  (il doit contenir 01-script.md et diapositives.json)");
  process.exit(1);
}
const spec = JSON.parse(fs.readFileSync(jsonChemin, "utf8").replace(/\{\{t\d+\}\}/g, "0:00"));
const pptx = path.join(dossier, spec.sortie);

const lancer = (titre, cmd, args) => {
  console.log(`\n=== ${titre}`);
  const sortie = execFileSync(cmd, args, { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  process.stdout.write(sortie);
  return sortie;
};

lancer("Minutage du script", "node", [path.join(outils, "minuter-script.mjs"), scriptChemin]);
lancer("Construction du PowerPoint", "node", [path.join(outils, "construire-pptx.mjs"), jsonChemin]);
const verif = lancer("Controle dans PowerPoint", "powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(outils, "verifier-pptx.ps1"), "-Fichier", pptx]);
lancer("Planche d'apercu", "node", [path.join(outils, "planche.mjs"), dossier]);
lancer("Fiches 02 et 03", "node", [path.join(outils, "generer-fiches.mjs"), jsonChemin]);

if (spec.bureau) {
  lancer("Copie sur le Bureau (diapositives, script, fiches)", "node", [path.join(outils, "synchroniser-bureau.mjs"), dossier]);
}

const alertes = verif.split("\n").filter((l) => l.includes("ALERTE"));
console.log(`\n=== Résumé : ${alertes.length} alerte(s) de mise en page. Regardez ${path.join(dossier, "rendu", "planche.png")}`);
