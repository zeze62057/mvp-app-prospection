// Mesure la VRAIE durée de chaque phrase (lue par ffmpeg dans le fichier audio) et la écrit dans sortie/narration.json.
// À lancer après voix.mjs : la taille du fichier ne donne qu'une estimation, qui dérive de plusieurs secondes sur 51 phrases.
//   node mesurer.mjs
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const dossier = path.dirname(fileURLToPath(import.meta.url));
const fichierNarration = path.join(dossier, "sortie", "narration.json");
const narration = JSON.parse(fs.readFileSync(fichierNarration, "utf8"));

// Durée RÉELLEMENT décodée (et non celle déclarée dans l'en-tête du MP3, plus longue du silence d'encodage :
// l'écart s'additionne sur 51 phrases et décale l'image de plusieurs secondes).
function dureeReelle(f) {
  const r = execFileSync(ffmpeg, ["-v", "error", "-nostats", "-progress", "pipe:1", "-i", f, "-f", "null", "-"], { encoding: "utf8" });
  const t = [...r.matchAll(/out_time_us=(\d+)/g)].map((m) => Number(m[1]));
  if (!t.length) throw new Error(`Durée illisible : ${f}`);
  return Math.max(...t) / 1e6;
}

let ecartMax = 0;
let total = 0;
for (const s of narration) {
  for (const p of s.phrases) {
    const reel = dureeReelle(path.join(dossier, "sortie", "voix", p.fichier));
    ecartMax = Math.max(ecartMax, Math.abs(reel - p.duree));
    p.duree = Number(reel.toFixed(2));
    total += p.duree;
  }
}
fs.writeFileSync(fichierNarration, JSON.stringify(narration, null, 2));
console.log(`Durées mesurées : voix seule ${(total / 60).toFixed(2)} min, plus grand écart avec l'estimation ${ecartMax.toFixed(2)} s.`);
