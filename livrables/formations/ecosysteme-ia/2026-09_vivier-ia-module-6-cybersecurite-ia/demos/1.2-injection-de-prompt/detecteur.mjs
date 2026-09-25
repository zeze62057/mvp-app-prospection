// Cherche du contenu cache ou des phrases de type "ignore tes instructions" dans un fichier texte ou HTML.
// LECTURE SEULE : le fichier n'est jamais execute, aucun reseau.
// Usage : node detecteur.mjs <fichier>
// Limite : un fichier sans alerte n'est pas prouve sain. C'est une aide, pas une garantie.
import { readFileSync } from "node:fs";

const fichier = process.argv[2];
if (!fichier) {
  console.error("Usage : node detecteur.mjs <fichier>");
  process.exit(2);
}
const texte = readFileSync(fichier, "utf8");
const constats = [];
const ligneDe = (index) => texte.slice(0, index).split("\n").length;
const court = (s) => s.replace(/\s+/g, " ").trim().slice(0, 120);

// 1. Commentaires HTML
for (const m of texte.matchAll(/<!--([\s\S]*?)-->/g)) {
  constats.push({ type: "commentaire HTML", ligne: ligneDe(m.index), extrait: court(m[1]) });
}

// 2. Elements masques par leur style (invisibles pour un humain, lisibles par un agent)
const masque =
  /<(\w+)[^>]*style\s*=\s*"[^"]*(display\s*:\s*none|visibility\s*:\s*hidden|font-size\s*:\s*[01](px|pt|em|rem)?\b|opacity\s*:\s*0\b|color\s*:\s*(#fff\b|#ffffff\b|white\b)|left\s*:\s*-\d{3,})[^"]*"[^>]*>(?<contenu>[\s\S]*?)<\/\1>/gi;
for (const m of texte.matchAll(masque)) {
  constats.push({ type: "texte masque par le style", ligne: ligneDe(m.index), extrait: court(m.groups.contenu) });
}

// 3. Caracteres invisibles (largeur nulle)
const invisibles = texte.match(/[​-‏⁠﻿]/g);
if (invisibles) constats.push({ type: "caracteres invisibles", ligne: "-", extrait: `${invisibles.length} caractere(s) de largeur nulle` });

// 4. Phrases typiques d'une injection
const phrases = [
  [/ignore[rz]?\s+(toutes?\s+)?(les\s+|tes\s+|vos\s+)?(instructions?|consignes?)/i, "ordre d'ignorer les consignes"],
  [/ignore\s+(all\s+|the\s+|your\s+)?(previous|prior|above)\s+instructions?/i, "ordre d'ignorer les consignes (anglais)"],
  [/n'en parle[sz]?\s+pas\s+(a|à)\s+l'utilisateur|do not (tell|mention).{0,20}user/i, "ordre de cacher quelque chose a l'utilisateur"],
  [/(assistant|agent)\s+(ia|ai)\b.{0,40}(important|ignore|obeis|réponds|reponds)/i, "message adresse a l'IA"],
  [/system prompt|prompt syst[eè]me/i, "mention du prompt systeme"],
];
for (const [motif, nom] of phrases) {
  const m = motif.exec(texte);
  if (m) constats.push({ type: `phrase suspecte : ${nom}`, ligne: ligneDe(m.index), extrait: court(texte.slice(m.index, m.index + 120)) });
}

if (constats.length === 0) {
  console.log("Aucun signal trouve. Ce n'est PAS une preuve que le contenu est sain.");
  process.exit(0);
}
console.log(`${constats.length} signal(aux) dans ${fichier} :\n`);
for (const c of constats) console.log(`- ${c.type} (ligne ${c.ligne}) : "${c.extrait}"`);
console.log("\nNe donnez pas ce contenu a un agent qui a des accès sensibles avant de l'avoir nettoye ou relu.");
process.exit(1);
