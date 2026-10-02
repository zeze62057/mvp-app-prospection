// Test de voix : UNE seule phrase courte avec la voix clonée, pour l'écouter avant de générer toute la narration.
//   node voix-test.mjs
// La clé et l'identifiant viennent de .env.local et ne sont jamais affichés.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dossier = path.dirname(fileURLToPath(import.meta.url));
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

// node voix-test.mjs [nom-du-fichier] : le nom évite d'écraser un test précédent.
const nomFichier = process.argv[2] ?? "test-voix.mp3";
const texte = "Bienvenue chez Vivier Academies. Le vivier des talents IA francophones.";
const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voix}?output_format=mp3_44100_128`, {
  method: "POST",
  headers: { "xi-api-key": cle, "Content-Type": "application/json" },
  body: JSON.stringify({
    text: texte,
    model_id: "eleven_multilingual_v2",
    voice_settings: { stability: 0.6, similarity_boost: 0.8, style: 0.1, use_speaker_boost: true },
  }),
});
if (!r.ok) {
  const corps = await r.text();
  let detail = corps.slice(0, 300);
  try {
    const j = JSON.parse(corps);
    detail = j?.detail?.message ?? j?.detail?.status ?? JSON.stringify(j.detail ?? j).slice(0, 300);
  } catch {}
  console.log(`Refusé par ElevenLabs (HTTP ${r.status}) : ${detail}`);
  process.exit(2);
}
fs.mkdirSync(path.join(dossier, "sortie"), { recursive: true });
const fichier = path.join(dossier, "sortie", nomFichier);
fs.writeFileSync(fichier, Buffer.from(await r.arrayBuffer()));
console.log(`OK : ${fs.statSync(fichier).size} octets pour ${texte.length} caractères -> ${fichier}`);
