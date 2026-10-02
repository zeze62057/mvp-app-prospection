// Donne sa voix à la vidéo de présentation de la plateforme (11 scènes, 5 min, sans son à l'origine).
//   node presentation-plateforme/voix-scenes.mjs "<chemin de la vidéo source>" "<chemin du fichier de sortie .mp4>"
// Étapes : 1) une voix par scène (jamais refaite si elle existe : aucun crédit gaspillé), 2) mesure de la durée réellement décodée,
// 3) pose de chaque scène à l'instant exact où elle commence dans la vidéo, 4) assemblage dans un MP4. La source n'est jamais modifiée.
import fs from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpeg = require("ffmpeg-static");
const ici = path.dirname(fileURLToPath(import.meta.url));
const racine = path.resolve(ici, "..");
const sortie = path.join(racine, "sortie", "plateforme");
fs.mkdirSync(sortie, { recursive: true });

const [source, destination] = process.argv.slice(2);
if (!source || !destination) {
  console.log('Usage : node presentation-plateforme/voix-scenes.mjs "<vidéo source>" "<vidéo de sortie.mp4>"');
  process.exit(1);
}
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(racine, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i), l.slice(i + 1).trim()];
    })
);
const { ELEVENLABS_API_KEY: cle, ELEVENLABS_VOICE_ID: voix } = env;
if (!cle || !voix) {
  console.log("Clé ou identifiant de voix absent de .env.local.");
  process.exit(1);
}

// Lecture de narration.md : « ## Scène N (m:ss à m:ss) : titre » puis le texte.
const aSecondes = (s) => Number(s.split(":")[0]) * 60 + Number(s.split(":")[1]);
const scenes = [];
let courante = null;
for (const ligne of fs.readFileSync(path.join(ici, "narration.md"), "utf8").replace(/\r\n/g, "\n").split("\n")) {
  const m = /^## Scène (\d+) \((\d+:\d+) à (\d+:\d+)\)/.exec(ligne);
  if (m) {
    courante = { numero: Number(m[1]), debut: aSecondes(m[2]), fin: aSecondes(m[3]), lignes: [] };
    scenes.push(courante);
  } else if (courante && ligne.trim() && !ligne.startsWith("#")) courante.lignes.push(ligne.trim());
}
for (const s of scenes) s.texte = s.lignes.join(" ");
console.log(`${scenes.length} scènes, ${scenes.reduce((n, s) => n + s.texte.length, 0)} caractères.`);

// Instants exacts des changements de scène, mesurés dans la vidéo (les titres de narration.md sont arrondis à la seconde).
const CHANGEMENTS = [0, 22.06, 47.62, 80.06, 105.62, 140.06, 175.62, 204.06, 231.62, 262.06, 275.62, 300];
scenes.forEach((s, i) => {
  s.debut = CHANGEMENTS[i];
  s.fin = CHANGEMENTS[i + 1];
});

// 1. Une voix par scène, avec le contexte de la scène d'avant et d'après pour garder le même ton.
let generes = 0;
let caracteres = 0;
for (let i = 0; i < scenes.length; i++) {
  const f = path.join(sortie, `scene-${String(scenes[i].numero).padStart(2, "0")}.mp3`);
  scenes[i].fichier = f;
  if (fs.existsSync(f) && fs.statSync(f).size > 2000) continue;
  const corps = {
    text: scenes[i].texte,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true },
  };
  if (i > 0) corps.previous_text = scenes[i - 1].texte;
  if (i < scenes.length - 1) corps.next_text = scenes[i + 1].texte;
  let ok = false;
  for (let essai = 1; essai <= 8 && !ok; essai++) {
    try {
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voix}?output_format=mp3_44100_128`, {
        method: "POST",
        headers: { "xi-api-key": cle, "Content-Type": "application/json" },
        body: JSON.stringify(corps),
      });
      if (!r.ok) {
        const t = await r.text();
        let detail = t.slice(0, 200);
        try {
          const j = JSON.parse(t);
          detail = j?.detail?.message ?? j?.detail?.status ?? JSON.stringify(j.detail ?? j).slice(0, 200);
        } catch {}
        console.log(`Scène ${scenes[i].numero} refusée (HTTP ${r.status}) : ${detail}`);
        if ([401, 402, 422].includes(r.status)) {
          console.log(`ARRÊT. ${generes} scène(s) générée(s), reprise possible sans rien perdre.`);
          process.exit(2);
        }
        await new Promise((res) => setTimeout(res, 3000 * essai));
        continue;
      }
      fs.writeFileSync(f, Buffer.from(await r.arrayBuffer()));
      generes++;
      caracteres += scenes[i].texte.length;
      ok = true;
      console.log(`Scène ${scenes[i].numero} générée.`);
    } catch (e) {
      console.log(`Scène ${scenes[i].numero}, essai ${essai} : ${e.cause?.code ?? e.message}`);
      await new Promise((res) => setTimeout(res, 4000 * essai));
    }
  }
  if (!ok) {
    console.log(`ARRÊT à la scène ${scenes[i].numero}. Reprise possible sans rien perdre.`);
    process.exit(3);
  }
}
console.log(`Voix : ${generes} scène(s) générée(s), ${caracteres} caractères utilisés.`);

// 2. Durée réellement décodée de chaque scène.
function dureeDecodee(f) {
  const r = spawnSync(ffmpeg, ["-v", "error", "-nostats", "-progress", "pipe:1", "-i", f, "-f", "null", "-"], { encoding: "utf8" });
  const t = [...String(r.stdout).matchAll(/out_time_us=(\d+)/g)].map((m) => Number(m[1]));
  return Math.max(...t) / 1e6;
}
const DEPART = 0.7; // la voix démarre un peu après le début de la scène
const MARGE = 0.8; // et finit avant la fin de la scène
const rapport = [];
for (const s of scenes) {
  s.duree = dureeDecodee(s.fichier);
  const place = s.fin - s.debut - DEPART - MARGE;
  s.vitesse = s.duree > place ? Math.min(s.duree / place, 1.12) : 1;
  s.dureeFinale = s.duree / s.vitesse;
  const trop = s.dureeFinale > place + 0.05;
  rapport.push(`Scène ${String(s.numero).padStart(2)} : fenêtre ${place.toFixed(1)} s, voix ${s.duree.toFixed(1)} s${s.vitesse > 1 ? `, accélérée x${s.vitesse.toFixed(2)}` : ""}${trop ? "  <-- TROP LONG" : ""}`);
}
console.log(rapport.join("\n"));
const tropLongues = scenes.filter((s) => s.dureeFinale > s.fin - s.debut - DEPART - MARGE + 0.05);
if (tropLongues.length) {
  console.log(`ARRÊT : ${tropLongues.length} scène(s) trop longue(s) pour leur fenêtre. Il faut raccourcir leur texte.`);
  process.exit(4);
}

// 3. Piste audio : silence jusqu'au début de chaque scène, puis la voix.
const entrees = [];
const noeuds = [];
const ajouter = (args) => {
  entrees.push(...args);
  noeuds.push(entrees.filter((x) => x === "-i").length - 1);
};
let curseur = 0;
for (const s of scenes) {
  const debutVoix = s.debut + DEPART;
  if (debutVoix > curseur) ajouter(["-f", "lavfi", "-t", (debutVoix - curseur).toFixed(3), "-i", "anullsrc=r=44100:cl=mono"]);
  ajouter(["-i", s.fichier]);
  curseur = debutVoix + s.dureeFinale;
}
ajouter(["-f", "lavfi", "-t", Math.max(0.1, 300.5 - curseur).toFixed(3), "-i", "anullsrc=r=44100:cl=mono"]);
let numeroVoix = 0;
const filtres = noeuds.map((n, i) => {
  const est = entrees[0] && false;
  void est;
  return `[${n}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=mono[a${i}]`;
});
// Les entrées « voix » sont celles qui ne sont pas des silences : on applique la vitesse à la bonne scène.
const ordre = [];
{
  let c = 0;
  for (const s of scenes) {
    const debutVoix = s.debut + DEPART;
    if (debutVoix > c) ordre.push(null);
    ordre.push(s);
    c = debutVoix + s.dureeFinale;
  }
  ordre.push(null);
}
const filtresFinal = noeuds.map((n, i) => {
  const s = ordre[i];
  const vitesse = s && s.vitesse > 1 ? `,atempo=${s.vitesse.toFixed(4)}` : "";
  return `[${n}:a]aresample=44100,aformat=sample_fmts=fltp:channel_layouts=mono${vitesse}[a${i}]`;
});
void numeroVoix;
void filtres;
const graphe = filtresFinal.join(";") + ";" + noeuds.map((_, i) => `[a${i}]`).join("") + `concat=n=${noeuds.length}:v=0:a=1[sortie]`;
fs.writeFileSync(path.join(sortie, "filtre.txt"), graphe);
execFileSync(ffmpeg, ["-y", "-v", "error", ...entrees, "-filter_complex_script", path.join(sortie, "filtre.txt"), "-map", "[sortie]", "-t", "300", "-c:a", "libmp3lame", "-b:a", "192k", path.join(sortie, "voix-complete.mp3")], { stdio: "inherit" });

// 4. Assemblage : la vidéo d'origine (copie lue, jamais modifiée) + la voix, en MP4.
fs.mkdirSync(path.dirname(destination), { recursive: true });
execFileSync(
  ffmpeg,
  ["-y", "-v", "error", "-i", source, "-i", path.join(sortie, "voix-complete.mp3"), "-map", "0:v:0", "-map", "1:a:0", "-t", "300", "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", "30", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", destination],
  { stdio: "inherit" }
);
console.log(`TERMINÉ : ${destination} (${(fs.statSync(destination).size / 1048576).toFixed(1)} Mo)`);
