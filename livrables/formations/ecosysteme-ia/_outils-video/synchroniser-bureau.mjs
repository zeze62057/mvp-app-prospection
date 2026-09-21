// Range sur le Bureau de Zezé tout ce qu'il faut pour enregistrer, chapitre par chapitre :
//
//   Bureau\Diapositives Vivier IA\<Module - Section>\<Chapitre N>\
//       Diapositives.pptx, Script.md, Enregistrement.md, Plan des diapositives.md
//
// plus, a la racine du dossier : les outils, le site de demonstration, le suivi et un LISEZ-MOI.
// Ce sont des COPIES : la source reste dans le projet (diapositives.json et 01-script.md).
//
//   node synchroniser-bureau.mjs                       tous les chapitres + outils + ressources + suivi
//   node synchroniser-bureau.mjs <dossier-du-chapitre>  un seul chapitre (utilise par terminer-chapitre.mjs)
//
// Un chapitre est range grace a la cle "bureau" de son diapositives.json :
//   "bureau": { "dossier": "Module 1 - Section 2 - La Méthode", "nom": "Chapitre 1" }
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const outils = path.dirname(fileURLToPath(import.meta.url));
const racine = path.resolve(outils, "..");
const bureau = execFileSync("powershell", ["-NoProfile", "-Command", "[Environment]::GetFolderPath('Desktop')"], { encoding: "utf8" }).trim();
const cible = path.join(bureau, "Diapositives Vivier IA");

function copier(src, dst) {
  try {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    return true;
  } catch (e) {
    console.log(`  Copie impossible (${e.code}), le fichier est peut-être ouvert : ${dst}`);
    return false;
  }
}

function chapitre(dossier) {
  const jsonChemin = path.join(dossier, "diapositives.json");
  if (!fs.existsSync(jsonChemin)) return false;
  const spec = JSON.parse(fs.readFileSync(jsonChemin, "utf8").replace(/\{\{t\d+\}\}/g, "0:00"));
  if (!spec.bureau) {
    console.log(`  Pas de clé "bureau" dans ${jsonChemin} : chapitre ignoré.`);
    return false;
  }
  const d = path.join(cible, spec.bureau.dossier, spec.bureau.nom);
  const fichiers = [
    [spec.sortie, "Diapositives.pptx"],
    ["01-script.md", "Script.md"],
    ["03-enregistrement-et-mise-en-ligne.md", "Enregistrement.md"],
    ["02-diapositives.md", "Plan des diapositives.md"],
  ];
  let ok = true;
  for (const [src, dst] of fichiers) {
    const s = path.join(dossier, src);
    if (fs.existsSync(s)) ok = copier(s, path.join(d, dst)) && ok;
  }
  console.log(`${ok ? "OK" : "PARTIEL"} : ${path.join(spec.bureau.dossier, spec.bureau.nom)}`);
  return ok;
}

const arg = process.argv[2];
if (arg) {
  chapitre(path.resolve(arg));
  process.exit(0);
}

// Tous les chapitres : <module>/videos/<section>/chapitre-N
let n = 0;
for (const mod of fs.readdirSync(racine).filter((m) => fs.existsSync(path.join(racine, m, "videos")))) {
  const videos = path.join(racine, mod, "videos");
  for (const section of fs.readdirSync(videos).sort()) {
    const sd = path.join(videos, section);
    if (!fs.statSync(sd).isDirectory()) continue;
    for (const c of fs.readdirSync(sd).filter((x) => /^chapitre-\d+$/.test(x)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))) {
      if (chapitre(path.join(sd, c))) n++;
    }
  }
}

// Outils (sans node_modules ni images de controle), site de demonstration, suivi.
const exclut = (s) => !/[\\/]node_modules([\\/]|$)/.test(s) && !/[\\/]rendu([\\/]|$)/.test(s);
fs.cpSync(outils, path.join(cible, "_Outils (copie de consultation)"), { recursive: true, filter: exclut });
fs.cpSync(path.join(racine, "_ressources-demo"), path.join(cible, "_Site de démonstration"), { recursive: true });
copier(path.join(racine, "SUIVI-VIDEOS.md"), path.join(cible, "Suivi des vidéos.md"));

const lisezMoi = `DIAPOSITIVES VIVIER IA : ce qu'il y a dans ce dossier
======================================================

AUCUNE VIDEO ne se trouve ici : les videos sont a enregistrer par vous.
Ce dossier contient tout ce qu'il faut pour les enregistrer.

Un dossier par chapitre, range par module et section :
  Diapositives.pptx          les diapositives animees (a passer en mode diaporama, avec les clics)
  Script.md                  le script a lire, minute par minute, avec les points a valider AVANT d'enregistrer
  Enregistrement.md          la checklist (la veille, juste avant, pendant), la verification des secrets, la fiche a coller sur la plateforme
  Plan des diapositives.md   le texte exact de chaque diapositive et ce qui apparait a chaque clic

Autres elements :
  _Site de démonstration     le petit site d'artisan fictif utilise dans certaines demonstrations (copiez-le, ne le modifiez pas)
  _Outils (copie de consultation)   les outils qui fabriquent tout cela. C'est une COPIE pour lecture : la version qui fonctionne est dans le projet Jarvis
  Suivi des vidéos.md        l'etat de chaque chapitre (a faire, script pret, enregistre, en ligne)

IMPORTANT
- Tout ce qui est ici est une copie. Pour changer une diapositive ou un script, demandez-le a Claude : il modifie le projet puis regenere ce dossier.
- Une modification faite directement dans un fichier de ce dossier sera perdue a la prochaine mise a jour.
- Ouvrez d'abord la section "Points a valider" de chaque Script.md : ce sont des decisions qui vous reviennent.
`;
fs.writeFileSync(path.join(cible, "LISEZ-MOI.txt"), lisezMoi, "utf8");
console.log(`\n${n} chapitre(s) rangé(s) dans ${cible}`);
