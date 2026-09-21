// Ecrit 02-diapositives.md et 03-enregistrement-et-mise-en-ligne.md d'un chapitre a partir de son
// diapositives.json et de son 01-script.md (heures, duree estimee).
//
//   node generer-fiches.mjs <chemin/diapositives.json>
//
// Cles optionnelles du JSON, en plus de "diapositives" :
//   "fiche"       : { "description": "...", "points": ["...", ...] }   (fiche a coller sur la plateforme)
//   "preparation" : ["...", ...]    (a faire la veille, en plus du standard)
//   "avant"       : ["...", ...]    (juste avant d'enregistrer, en plus du standard)
//   "pendant"     : ["...", ...]    (pendant l'enregistrement, en plus du standard)
//   "apres"       : ["...", ...]    (apres l'enregistrement : nettoyage, suppressions)
//   "secrets"     : ["...", ...]    (ce qui ne doit pas apparaitre a l'ecran, en plus du standard)
//   "entre"       : ["...", ...]    (passages a l'ecran sans diapositive, ex. la demonstration)
//   "aVerifier"   : ["...", ...]    (points d'interface ou de contenu a revoir le jour de l'enregistrement)
import fs from "node:fs";
import path from "node:path";

const jsonChemin = path.resolve(process.argv[2] ?? "");
if (!process.argv[2] || !fs.existsSync(jsonChemin)) {
  console.error("Usage : node generer-fiches.mjs <chemin/diapositives.json>");
  process.exit(1);
}
const dossier = path.dirname(jsonChemin);
const script = fs.readFileSync(path.join(dossier, "01-script.md"), "utf8");
const heures = [...script.matchAll(/^\| (\d+:\d\d) \|/gm)].map((m) => m[1]);
const spec = JSON.parse(fs.readFileSync(jsonChemin, "utf8").replace(/\{\{t(\d+)\}\}/g, (_, n) => heures[n - 1] ?? "?:??"));
const dureeM = script.match(/Durée estimée : (\d+):(\d\d)\*\*/);
const duree = dureeM ? `${Number(dureeM[1])} min ${Number(dureeM[2])} s` : "à calculer";

const net = (t) => String(t ?? "").replace(/\*/g, "").replace(/\\n|\n/g, " ").replace(/\s+/g, " ").trim();
const cellule = (t) => net(t).replace(/\|/g, "\\|");
const points = (l) => (l ?? []).map((x) => `- ${x}`).join("\n");

// --- texte exact et animation de chaque diapositive, selon son type ---
function texteExact(d) {
  switch (d.type) {
    case "titre":
      return `${casse(net(d.surtitre)).replace(/^Vivier ia/, "Vivier IA")}. Objectif : ${net(d.objectif).replace(/^Objectif : /, "")} Plan : ${(d.pastilles ?? []).map((p, i) => `${i + 1}. ${net(p)}`).join(" ")}`;
    case "flux":
      return (d.rangees ?? []).map((r) => `**${net(r.etiquette)}** : ${r.boites.map((b) => net(typeof b === "string" ? b : b.t)).join(", ")}`).join(" ") + (d.phrase ? ` ${net(d.phrase)}` : "");
    case "cartes":
      return (d.cartes ?? []).map((c, i) => `${i + 1}. ${net(c.titre)} : ${net(c.texte)}${c.code ? ` (${(Array.isArray(c.code) ? c.code : [c.code]).map(net).join(" ")})` : ""}`).join(" ");
    case "avant-apres":
      return `${d.intro ? net(d.intro) + " " : ""}**${net(d.avant.etiquette)}** : ${net(d.avant.titre)}, ${net(d.avant.texte)} **${net(d.apres.etiquette)}** : ${net(d.apres.titre)}, ${net(d.apres.texte)}`;
    case "commandes":
      return (d.lignes ?? []).map((l, i) => `${i + 1}. ${net(l.etiquette)}${l.commande ? ` : \`${l.commande.replace(/`/g, "'")}\`` : ""}${l.detail ? ` : ${net(l.detail)}` : ""}`).join(" ");
    case "points":
      return `${net(d.titre)} ${(d.points ?? []).map(net).join(" ")}${d.final ? ` **${net(d.final)}**` : ""}`;
    case "enonce":
      return `${net(d.enonce)}${d.appui ? " " + net(d.appui) : ""}`;
    default:
      return "";
  }
}
const casse = (s) => (s === s.toUpperCase() && s.length > 1 ? s[0] + s.slice(1).toLowerCase() : s);
function titreDiapo(d) {
  if (d.type === "titre") return net(d.titre);
  if (d.type === "enonce") return casse(net(d.surtitre ?? "Message clé"));
  return casse(net(d.titre ?? d.surtitre));
}
function animation(d) {
  switch (d.type) {
    case "titre": return { txt: "Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles", clics: 0 };
    case "flux": {
      const n = (d.rangees?.length > 1 ? 1 : 0) + (d.phrase ? 1 : 0);
      const parts = [];
      let k = 1;
      if (d.rangees?.length > 1) parts.push(`Clic ${k++} : « ${net(d.rangees[1].etiquette)} »`);
      if (d.phrase) parts.push(`Clic ${k++} : la phrase finale`);
      return { txt: `La ligne « ${net(d.rangees[0].etiquette)} » visible.${parts.length ? " " + parts.join(". ") : ""}`, clics: n };
    }
    case "cartes": return { txt: `Un clic par carte (${d.cartes.length} clics)`, clics: d.cartes.length };
    case "avant-apres": return { txt: `Clic 1 : « ${net(d.avant.etiquette)} ». Clic 2 : « ${net(d.apres.etiquette)} »`, clics: 2 };
    case "commandes": return { txt: `Un clic par ligne (${d.lignes.length} clics)`, clics: d.lignes.length };
    case "points": {
      const n = (d.points?.length ?? 0) + (d.final ? 1 : 0);
      return { txt: `Le titre seul à l'ouverture, puis un clic par point${d.final ? " et un clic pour la prochaine vidéo" : ""} (${n} clics)`, clics: n };
    }
    case "enonce": return { txt: `La phrase seule à l'ouverture${d.appui ? ", puis un clic pour le texte d'appui" : ""}`, clics: d.appui ? 1 : 0 };
    default: return { txt: "", clics: 0 };
  }
}

// --- 02-diapositives.md ---
const lignes = [];
let totalClics = 0;
spec.diapositives.forEach((d, i) => {
  const moment = (d.notes ?? "").match(/Moments? du script : (\d+:\d\d)/)?.[1] ?? "?";
  const a = animation(d);
  totalClics += a.clics;
  lignes.push({ n: i + 1, moment, titre: titreDiapo(d), texte: texteExact(d), anim: a.txt });
});
const md2 = `# Diapositives : ${net(spec.titre)}

${spec.diapositives.length} diapositives. Elles servent d'ouverture, de repères et de récapitulatif${(spec.entre ?? []).length ? " : une partie de la vidéo se passe à l'écran, sans diapositive" : ""}. Les numéros suivent le script (\`01-script.md\`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
${lignes.map((l) => `| ${l.n} | ${l.moment} | ${cellule(l.titre)} | ${cellule(l.texte)} |`).join("\n")}
${(spec.entre ?? []).length ? "\n" + points(spec.entre) + "\n" : ""}
## Fichier PowerPoint

- **Fichier** : \`${spec.sortie}\`, dans ce dossier. Produit par l'outil commun \`livrables/formations/ecosysteme-ia/_outils-video/\` à partir de \`diapositives.json\` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le \`.pptx\`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le \`README.md\` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
${lignes.map((l) => `  | ${l.n} ${cellule(l.titre).slice(0, 40)} | ${cellule(l.anim)} |`).join("\n")}

  ${totalClics} clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des ${spec.diapositives.length} diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
${(spec.aVerifier ?? []).length ? "- **À vérifier le jour de l'enregistrement** :\n" + (spec.aVerifier).map((x) => `  - ${x}`).join("\n") + "\n" : ""}`;
fs.writeFileSync(path.join(dossier, "02-diapositives.md"), md2, "utf8");

// --- 03-enregistrement-et-mise-en-ligne.md ---
const f = spec.fiche ?? { description: "", points: [] };
const md3 = `# Enregistrement et mise en ligne : ${net(spec.titre)}

${net(spec.sujet).replace(/^Vivier IA, /, "").replace(/^./, (c) => c.toUpperCase())}. Voir \`01-script.md\` et \`02-diapositives.md\`.

## 1. Checklist d'enregistrement

**La veille**
- Lire le script une fois à voix haute, chronomètre en main. Corriger le débit réel par rapport aux 140 mots par minute prévus.
- Tester le diaporama en mode présentation, avec les clics : \`${spec.sortie}\`, ${totalClics} clics en tout.
- **Valider les points de la section 2 du script** avant d'enregistrer.
${points(spec.preparation)}

**Juste avant**
- Couper les notifications (assistant de concentration de Windows), fermer les onglets et applications inutiles.
- Écran en 1920 par 1080, bureau propre.
- Son : casque ou micro de qualité, pièce calme, test de une minute réécouté avant de commencer.
${points(spec.avant)}

**Pendant**
- Dire à l'oral ce que vous faites avant de le faire.
- Si une démonstration échoue en direct, poursuivez si l'échec est instructif, sinon coupez et reprenez.
${points(spec.pendant)}
${(spec.apres ?? []).length ? "\n**Après l'enregistrement**\n" + points(spec.apres) + "\n" : ""}
## 2. Vérification des secrets, avant de lancer l'enregistrement

Rien de ceci ne doit apparaître à l'écran :
- une clé d'API, un mot de passe ou un jeton, y compris ceux de Chatllow, de Chariow ou d'un client ;
- un fichier \`.env\` ouvert dans l'éditeur ;
- votre adresse e-mail ou votre nom d'utilisateur dans un chemin de dossier ;
- une donnée client réelle, dans un onglet, un fichier récent ou le presse-papiers.
${points(spec.secrets)}

Vérifiez aussi la barre d'onglets du navigateur, les favoris et l'historique du terminal.

## 3. Quel outil pour enregistrer

**Attention : l'outil d'enregistrement intégré à la plateforme ne convient pas pour une voix off.** Il capture l'écran et le son du système, mais pas le micro. Enregistrez avec un logiciel qui capte le micro (OBS Studio est gratuit), puis envoyez le fichier sur la plateforme.

Enregistrez tout l'écran en une seule prise. Le montage se limite aux coupures d'attente.

## 4. Fiche à coller sur la plateforme

**Titre** : ${net(spec.titre)}

**Description** : ${f.description}

**Points clés**
${points(f.points)}

**Durée** : à renseigner après l'enregistrement (estimation : ${duree} avant montage).

## 5. Mise en ligne, guidée en direct

Cette étape se fait avec Claude, une étape à la fois. Ne la déroulez pas seul.

L'état des lieux de la plateforme, les deux limites de taille à lever avant le premier envoi réel, le choix « section ou chapitre » et les sept étapes prévues sont décrits dans \`livrables/formations/ecosysteme-ia/2026-09_vivier-ia-module-1/videos/01-fondations/chapitre-1/03-enregistrement-et-mise-en-ligne.md\` (section 5). Ils valent aussi pour cette vidéo. Le chantier d'envoi direct est cadré dans \`livrables/applications/2026-09_plateforme-formation-communaute/CADRAGE-ENVOI-VIDEOS.md\`.

Le passage du chapitre à \`en ligne\` dans \`SUIVI-VIDEOS.md\` reste une attestation de Zézé.
`;
fs.writeFileSync(path.join(dossier, "03-enregistrement-et-mise-en-ligne.md"), md3.replace(/\n{3,}/g, "\n\n"), "utf8");
console.log(`Fiches écrites : ${spec.diapositives.length} diapositives, ${totalClics} clics, durée ${duree}`);
