// Assemble les images exportees par verifier-pptx.ps1 en UNE planche d'apercu (2 colonnes), pour
// controler un chapitre d'un seul coup d'oeil.
//
//   node planche.mjs <dossier-du-chapitre>      (lit <dossier>/rendu/Diapositive*.PNG, ecrit rendu/planche.png)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dossier = process.argv[2];
if (!dossier) {
  console.error("Usage : node planche.mjs <dossier-du-chapitre>");
  process.exit(1);
}
const rendu = path.join(dossier, "rendu");
const images = fs
  .readdirSync(rendu)
  .filter((f) => /^Diapositive\d+\.png$/i.test(f))
  .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
if (!images.length) {
  console.error("Aucune image dans " + rendu + ". Lancez d'abord verifier-pptx.ps1.");
  process.exit(1);
}
const L = 600, H = 338, ECART = 10, COLS = 2;
const lignes = Math.ceil(images.length / COLS);
const tuiles = await Promise.all(
  images.map(async (f, i) => ({
    input: await sharp(path.join(rendu, f)).resize(L, H).toBuffer(),
    left: (i % COLS) * (L + ECART),
    top: Math.floor(i / COLS) * (H + ECART),
  }))
);
await sharp({
  create: { width: COLS * L + (COLS - 1) * ECART, height: lignes * H + (lignes - 1) * ECART, channels: 3, background: "#ffffff" },
})
  .composite(tuiles)
  .png()
  .toFile(path.join(rendu, "planche.png"));
console.log(`Planche : ${path.join(rendu, "planche.png")} (${images.length} diapositives)`);
