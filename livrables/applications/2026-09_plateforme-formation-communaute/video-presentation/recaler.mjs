// Recale l'image sur la voix à partir de l'enregistrement déjà fait (sans refaire les 5 minutes d'enregistrement).
//   node recaler.mjs <décalage-de-départ> <étirement> <retard>
// Exemple : node recaler.mjs 5.31 1.0109 0.28   -> coupe 5,31 s, étire le temps de 1,09 %, ajoute 0,28 s au début.
// Les valeurs viennent de verifier-calage.mjs (écarts mesurés sur le fichier final).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { construireLigneDeTemps } from "./timeline.mjs";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const dossier = path.dirname(fileURLToPath(import.meta.url));
const sortie = path.join(dossier, "sortie");
const [decalage, etirement, retard] = process.argv.slice(2).map(Number);
if ([decalage, etirement, retard].some((n) => Number.isNaN(n))) {
  console.log("Usage : node recaler.mjs <décalage> <étirement> <retard>");
  process.exit(1);
}
const webm = fs.readdirSync(path.join(sortie, "enregistrement")).find((f) => f.endsWith(".webm"));
const TL = construireLigneDeTemps(JSON.parse(fs.readFileSync(path.join(sortie, "narration.json"), "utf8")));
const mp4 = path.join(sortie, "presentation-vivier-chatllow.mp4");
execFileSync(
  ffmpeg,
  [
    "-y", "-v", "error",
    "-ss", decalage.toFixed(3), "-i", path.join(sortie, "enregistrement", webm),
    "-i", path.join(sortie, "audio.mp3"),
    "-map", "0:v:0", "-map", "1:a:0",
    "-vf", `setpts=${etirement}*PTS+${retard}/TB,fps=30`,
    "-t", TL.total.toFixed(2),
    "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", mp4,
  ],
  { stdio: "inherit" }
);
console.log(`Recalé : ${(fs.statSync(mp4).size / 1048576).toFixed(1)} Mo`);
