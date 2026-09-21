// Calcule les minutes du script parle d'un chapitre (01-script.md) a partir des mots reellement ecrits.
//
//   node minuter-script.mjs <chemin/01-script.md>
//
// Le tableau du script a quatre colonnes : | {{t1}} | Ce que vous dites | Ce qu'on voit | Action |
// - la colonne « Ce que vous dites » est comptee en mots, a 140 mots par minute ;
// - le temps de manipulation a l'ecran s'ecrit « ⏱ +30 s » dans la colonne « Action » ;
// - chaque {{tN}} est remplace par l'heure de debut (m:ss), et {{duree_estimee}} par le total.
// Le calcul se fait sur les mots ecrits, jamais au jugé. 140 mots par minute est une hypothese a
// corriger apres le premier enregistrement.
import fs from "node:fs";

const fichier = process.argv[2];
if (!fichier || !fs.existsSync(fichier)) {
  console.error("Usage : node minuter-script.mjs <chemin/01-script.md>");
  process.exit(1);
}
const RYTHME = 140;
const format = (s) => {
  const t = Math.round(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

let cumul = 0;
let mots = 0;
let manip = 0;
let lignes = 0;
const sortie = fs.readFileSync(fichier, "utf8").split("\n").map((l) => {
  // La premiere cellule est soit {{tN}} (premier calcul), soit une heure deja calculee (m:ss) : la commande
  // peut donc etre relancee apres chaque retouche du script. Les marqueurs ⏱ restent visibles dans la
  // colonne « Action » : ils disent a Zézé combien de temps la manipulation prend.
  const m = l.match(/^\| (\{\{t\d+\}\}|\d+:\d\d) \| (.*?) \| (.*?) \| (.*?) \|\s*$/);
  if (!m) return l;
  lignes++;
  const n = m[2].trim().split(/\s+/).length;
  const s = Number((m[4].match(/⏱ \+(\d+) s/) ?? [0, 0])[1]);
  const debut = cumul;
  cumul += (n / RYTHME) * 60 + s;
  mots += n;
  manip += s;
  return l.replace(m[1], format(debut));
});
let texte = sortie.join("\n");
const resume = `**${mots} mots prononcés**, soit environ ${(mots / RYTHME).toFixed(1).replace(".", ",")} minutes de voix, plus ${manip} secondes de manipulation à l'écran. **Durée estimée : ${format(cumul)}**, avant coupes au montage.`;
texte = texte.includes("{{duree_estimee}}")
  ? texte.replace("{{duree_estimee}}", resume)
  : texte.replace(/\*\*\d+ mots prononcés\*\*[^\n]*avant coupes au montage\./, resume);
fs.writeFileSync(fichier, texte, "utf8");
console.log(`${lignes} passages | ${mots} mots | ${manip} s de manipulation | total ${format(cumul)} (${(cumul / 60).toFixed(1)} min)`);
