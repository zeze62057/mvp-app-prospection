// Fabrique la vidéo : audio (voix + silences), image (scènes HTML enregistrées par Playwright), assemblage, sous-titres.
//   node build.mjs
// Prérequis : sortie/narration.json et sortie/voix/*.mp3 (node voix.mjs). Durée d'enregistrement : environ celle de la vidéo.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { construireLigneDeTemps, versSrt, LEAD, GAP_PHRASE, GAP_SCENE, TAIL } from "./timeline.mjs";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const dossier = path.dirname(fileURLToPath(import.meta.url));
const sortie = path.join(dossier, "sortie");
const narration = JSON.parse(fs.readFileSync(path.join(sortie, "narration.json"), "utf8"));
const TL = construireLigneDeTemps(narration);
console.log(`Durée prévue : ${(TL.total / 60).toFixed(2)} min (${TL.total.toFixed(1)} s), ${TL.phrases.length} phrases, ${TL.scenes.length} scènes.`);

// 1. Audio : voix et silences, dans l'ordre exact de la ligne de temps.
const entrees = [];
const noeuds = [];
const silence = (s) => {
  entrees.push("-f", "lavfi", "-t", String(s), "-i", "anullsrc=r=44100:cl=mono");
  noeuds.push(entrees.filter((x) => x === "-i").length - 1);
};
const fichier = (f) => {
  entrees.push("-i", path.join("voix", f));
  noeuds.push(entrees.filter((x) => x === "-i").length - 1);
};
silence(LEAD);
narration.forEach((s, si) => {
  s.phrases.forEach((p, k) => {
    fichier(p.fichier);
    const derniere = k === s.phrases.length - 1;
    if (!(derniere && si === narration.length - 1)) silence(derniere ? GAP_SCENE : GAP_PHRASE);
  });
});
silence(TAIL);
const filtre =
  noeuds.map((n, i) => `[${n}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=mono[a${i}]`).join(";") +
  ";" +
  noeuds.map((_, i) => `[a${i}]`).join("") +
  `concat=n=${noeuds.length}:v=0:a=1[sortie]`;
fs.writeFileSync(path.join(sortie, "filtre-audio.txt"), filtre);
console.log("Assemblage de l'audio...");
execFileSync(ffmpeg, ["-y", "-v", "error", ...entrees, "-filter_complex_script", "filtre-audio.txt", "-map", "[sortie]", "-c:a", "libmp3lame", "-b:a", "192k", "audio.mp3"], { cwd: sortie, stdio: "inherit" });
const duree = (f) => {
  try {
    execFileSync(ffmpeg, ["-i", f], { stdio: "pipe" });
  } catch (e) {
    const m = /Duration: (\d+):(\d+):(\d+\.\d+)/.exec(String(e.stderr));
    return m ? Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) : 0;
  }
  return 0;
};
const dureeAudio = duree(path.join(sortie, "audio.mp3"));
console.log(`Audio : ${dureeAudio.toFixed(1)} s (ligne de temps : ${TL.total.toFixed(1)} s, écart ${(dureeAudio - TL.total).toFixed(2)} s)`);

// 2. Sous-titres
fs.writeFileSync(path.join(sortie, "sous-titres.srt"), versSrt(TL), "utf8");

// 3. Image : les scènes HTML sont servies localement et enregistrées en temps réel.
const TYPES = { ".html": "text/html; charset=utf-8", ".mjs": "text/javascript", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".css": "text/css" };
const serveur = http.createServer((req, res) => {
  const chemin = path.join(dossier, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!chemin.startsWith(dossier) || !fs.existsSync(chemin) || fs.statSync(chemin).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(chemin)] ?? "application/octet-stream" });
  fs.createReadStream(chemin).pipe(res);
});
await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
const port = serveur.address().port;

const dossierVideo = path.join(sortie, "enregistrement");
fs.rmSync(dossierVideo, { recursive: true, force: true });
fs.mkdirSync(dossierVideo, { recursive: true });
console.log(`Enregistrement des scènes (environ ${(TL.total / 60).toFixed(1)} min, ne ferme rien)...`);
const nav = await chromium.launch();
const contexte = await nav.newContext({ viewport: { width: 1920, height: 1080 }, recordVideo: { dir: dossierVideo, size: { width: 1920, height: 1080 } } });
const page = await contexte.newPage();
const tPage = Date.now();
const erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));
await page.goto(`http://127.0.0.1:${port}/scenes/index.html`);
await page.waitForFunction("window.__pret === true", null, { timeout: 60000 });
await page.waitForTimeout(800);
const tGo = Date.now();
await page.evaluate("window.__go()");
await page.waitForFunction("window.__fini === true", null, { timeout: (TL.total + 60) * 1000, polling: 1000 });
await page.waitForTimeout(500);
const video = page.video();
await contexte.close();
const webm = await video.path();
await nav.close();
serveur.close();
const decalage = (tGo - tPage) / 1000;
console.log(`Enregistré. Décalage de départ : ${decalage.toFixed(2)} s. ${erreurs.length ? "ERREURS : " + erreurs.join(" | ") : "Aucune erreur JavaScript."}`);

// 4. Assemblage final
const mp4 = path.join(sortie, "presentation-vivier-chatllow.mp4");
console.log("Assemblage de la vidéo...");
execFileSync(
  ffmpeg,
  ["-y", "-v", "error", "-ss", decalage.toFixed(3), "-i", webm, "-i", path.join(sortie, "audio.mp3"), "-map", "0:v:0", "-map", "1:a:0", "-t", TL.total.toFixed(2), "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", mp4],
  { stdio: "inherit" }
);
const octets = fs.statSync(mp4).size;
console.log(`TERMINÉ : ${mp4} (${(octets / 1048576).toFixed(1)} Mo, ${(duree(mp4) / 60).toFixed(2)} min)`);
