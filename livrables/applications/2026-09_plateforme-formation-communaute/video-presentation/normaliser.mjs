// Normalise le niveau sonore d'une vidéo à -16 LUFS (standard du web) sans toucher à l'image (flux vidéo copié tel quel).
// Deux passes : mesure, puis correction linéaire (pas de compression qui déformerait la voix). Crête limitée à -1,5 dBTP.
//   node normaliser.mjs <entrée.mp4> <sortie.mp4>
import { spawnSync, execFileSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const [entree, sortie] = process.argv.slice(2);
if (!entree || !sortie) {
  console.log("Usage : node normaliser.mjs <entrée.mp4> <sortie.mp4>");
  process.exit(1);
}
const CIBLE = "I=-16:TP=-1.5:LRA=11";

const mesure = spawnSync(ffmpeg, ["-hide_banner", "-i", entree, "-vn", "-af", `loudnorm=${CIBLE}:print_format=json`, "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 26 });
const json = /\{[^{}]*"input_i"[^{}]*\}/.exec(String(mesure.stderr));
if (!json) {
  console.log("Mesure impossible.");
  process.exit(2);
}
const m = JSON.parse(json[0]);
console.log(`Avant : ${m.input_i} LUFS, crête ${m.input_tp} dBTP, plage ${m.input_lra} LU`);
const filtre = `loudnorm=${CIBLE}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
execFileSync(ffmpeg, ["-y", "-v", "error", "-i", entree, "-map", "0:v:0", "-map", "0:a:0", "-c:v", "copy", "-af", filtre, "-ar", "44100", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", sortie], { stdio: "inherit" });

const apres = spawnSync(ffmpeg, ["-hide_banner", "-i", sortie, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 1 << 26 });
const resume = String(apres.stderr).split("Summary:")[1] ?? "";
const I = /I:\s+(-?[\d.]+) LUFS/.exec(resume)?.[1];
const pic = /Peak:\s+(-?[\d.]+) dBFS/.exec(resume)?.[1];
console.log(`Après : ${I} LUFS, crête ${pic} dBFS -> ${sortie}`);
