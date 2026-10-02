// Génère la narration complète avec la voix clonée : une phrase = un fichier audio, avec le contexte de la
// phrase précédente et de la suivante (« request stitching ») pour garder un ton continu.
//   node voix.mjs            génère ce qui manque (une phrase déjà générée n'est JAMAIS refaite, donc aucun crédit gaspillé)
//   node voix.mjs --force    refait tout (consomme des crédits)
// Résultat : sortie/voix/phrase-001.mp3 ... et sortie/narration.json (scènes, phrases, durées).
// La clé et l'identifiant viennent de .env.local et ne sont jamais affichés.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dossier = path.dirname(fileURLToPath(import.meta.url));
const FORCE = process.argv.includes("--force");
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(dossier, ".env.local"), "utf8")
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

// Lecture du script : « ## Scène ... » puis les phrases, une par ligne, jusqu'au « --- ».
export function lireScript(texte) {
  const scenes = [];
  let courante = null;
  for (const ligne of texte.replace(/\r\n/g, "\n").split("\n")) {
    const s = /^## Scène (.+?) \((\d+:\d+) à (\d+:\d+)\)\s*$/.exec(ligne);
    if (s) {
      courante = { titre: s[1], phrases: [] };
      scenes.push(courante);
      continue;
    }
    if (/^---\s*$/.test(ligne) || /^## Plan visuel/.test(ligne)) {
      courante = null;
      continue;
    }
    if (courante && ligne.trim() && !ligne.startsWith("#") && !ligne.startsWith("|")) courante.phrases.push(ligne.trim());
  }
  return scenes.filter((s) => s.phrases.length);
}

const scenes = lireScript(fs.readFileSync(path.join(dossier, "01-script.md"), "utf8"));
const phrases = scenes.flatMap((s, si) => s.phrases.map((texte) => ({ scene: si, texte })));
const totalCaracteres = phrases.reduce((n, p) => n + p.texte.length, 0);
console.log(`${scenes.length} scènes, ${phrases.length} phrases, ${totalCaracteres} caractères.`);

fs.mkdirSync(path.join(dossier, "sortie", "voix"), { recursive: true });
const nom = (i) => path.join(dossier, "sortie", "voix", `phrase-${String(i + 1).padStart(3, "0")}.mp3`);

let generes = 0;
let reutilises = 0;
let caracteresUtilises = 0;
for (let i = 0; i < phrases.length; i++) {
  const fichier = nom(i);
  if (!FORCE && fs.existsSync(fichier) && fs.statSync(fichier).size > 2000) {
    reutilises++;
    continue;
  }
  const corps = {
    text: phrases[i].texte,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true },
  };
  if (i > 0) corps.previous_text = phrases[i - 1].texte;
  if (i < phrases.length - 1) corps.next_text = phrases[i + 1].texte;

  let ok = false;
  // Le réseau coupe parfois (délai de connexion dépassé) : plusieurs essais, avec des pauses de plus en plus longues.
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
        console.log(`Phrase ${i + 1} refusée (HTTP ${r.status}) : ${detail}`);
        if (r.status === 401 || r.status === 402 || r.status === 422) {
          console.log(`ARRÊT. ${generes} phrase(s) générée(s), reprise possible sans rien perdre.`);
          process.exit(2);
        }
        await new Promise((res) => setTimeout(res, 2000 * essai));
        continue;
      }
      fs.writeFileSync(fichier, Buffer.from(await r.arrayBuffer()));
      generes++;
      caracteresUtilises += phrases[i].texte.length;
      ok = true;
    } catch (e) {
      console.log(`Phrase ${i + 1}, essai ${essai} : ${e.cause?.code ?? e.message}`);
      await new Promise((res) => setTimeout(res, 4000 * essai));
    }
  }
  if (!ok) {
    console.log(`ARRÊT à la phrase ${i + 1}. ${generes} générée(s), reprise possible sans rien perdre.`);
    process.exit(3);
  }
  if ((generes + reutilises) % 10 === 0) console.log(`... ${generes + reutilises}/${phrases.length}`);
}

// MP3 à débit constant (128 kbit/s) : la durée se déduit de la taille du fichier.
const duree = (fichier) => ((fs.statSync(fichier).size * 8) / 128000);
const narration = scenes.map((s, si) => ({
  titre: s.titre,
  phrases: phrases
    .map((p, i) => ({ ...p, i }))
    .filter((p) => p.scene === si)
    .map((p) => ({ texte: p.texte, fichier: path.basename(nom(p.i)), duree: Number(duree(nom(p.i)).toFixed(2)) })),
}));
fs.writeFileSync(path.join(dossier, "sortie", "narration.json"), JSON.stringify(narration, null, 2));
const total = narration.flatMap((s) => s.phrases).reduce((n, p) => n + p.duree, 0);
console.log(`Terminé : ${generes} générée(s), ${reutilises} déjà faite(s), ${caracteresUtilises} caractères utilisés. Voix seule : ${(total / 60).toFixed(1)} min.`);
