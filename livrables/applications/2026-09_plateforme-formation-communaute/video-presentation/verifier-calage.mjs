// Vérifie dans le fichier FINAL que l'image est calée sur la voix.
// Principe : la première phrase doit être entendue à LEAD secondes, et sa légende doit apparaître à la même seconde.
//   node verifier-calage.mjs
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { construireLigneDeTemps } from "./timeline.mjs";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const dossier = path.dirname(fileURLToPath(import.meta.url));
const mp4 = path.join(dossier, "sortie", "presentation-vivier-chatllow.mp4");
const TL = construireLigneDeTemps(JSON.parse(fs.readFileSync(path.join(dossier, "sortie", "narration.json"), "utf8")));

// ffmpeg écrit ses mesures sur la sortie d'erreur : on lit les deux canaux.
const sortie = (args) => {
  const r = spawnSync(ffmpeg, args, { encoding: "utf8", maxBuffer: 1 << 28 });
  return String(r.stdout ?? "") + String(r.stderr ?? "");
};

// Instants (dans le mp4) où chaque phrase commence côté VOIX : fins de silence détectées.
const detect = sortie(["-i", mp4, "-vn", "-af", "silencedetect=noise=-38dB:d=0.25", "-f", "null", "-"]);
const finsSilence = [...detect.matchAll(/silence_end: ([\d.]+)/g)].map((m) => Number(m[1]));
// Les phrases : la légende apparaît à phrase.debut - 0,05 s ; on compare au début de la voix.
const attendus = TL.phrases.map((p) => p.debut);
const ecarts = [];
for (const t of attendus.slice(0, TL.phrases.length)) {
  const voix = finsSilence.find((s) => Math.abs(s - t) < 1.5);
  if (voix !== undefined) ecarts.push(voix - t);
}
const moy = ecarts.reduce((a, b) => a + b, 0) / (ecarts.length || 1);
const max = Math.max(...ecarts.map(Math.abs), 0);
console.log(`Début des phrases côté voix mesuré pour ${ecarts.length}/${attendus.length} phrases.`);
console.log(`Écart voix contre ligne de temps : moyen ${moy.toFixed(2)} s, maximum ${max.toFixed(2)} s.`);

// Image : la scène Chatllow a un fond CLAIR, toutes les autres un fond sombre. Le passage sombre vers clair, puis clair vers sombre,
// est un repère net dans le fichier final, qu'on compare à la ligne de temps (le fondu dure 0,7 s : le milieu tombe à 0,35 s du début).
const stats = sortie(["-t", String(TL.total), "-i", mp4, "-vf", "fps=20,scale=96:54,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-", "-an", "-f", "null", "-"]);
const lumi = [...stats.matchAll(/pts_time:([\d.]+)\s+lavfi\.signalstats\.YAVG=([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
const seuil = (Math.min(...lumi.map(([, y]) => y)) + Math.max(...lumi.map(([, y]) => y))) / 2;
const chat = TL.scenes[6];
const montee = lumi.find(([t, y]) => t > chat.debut - 3 && y > seuil);
const descente = lumi.find(([t, y]) => t > chat.fin - 3 && t > (montee?.[0] ?? 0) + 5 && y < seuil);
const attMontee = chat.debut - 0.5 + 0.35;
const attDescente = chat.fin + 0.1 + 0.35;
console.log(`Fond clair de Chatllow : apparition mesurée ${montee ? montee[0].toFixed(2) : "?"} s, attendue ${attMontee.toFixed(2)} s, écart ${montee ? (montee[0] - attMontee).toFixed(2) : "?"} s.`);
console.log(`Retour au fond sombre : mesuré ${descente ? descente[0].toFixed(2) : "?"} s, attendu ${attDescente.toFixed(2)} s, écart ${descente ? (descente[0] - attDescente).toFixed(2) : "?"} s.`);
