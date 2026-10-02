// Liste les voix du compte ElevenLabs (nom, identifiant, type) avec la clé de .env.local.
// La clé n'est jamais affichée. Les identifiants de voix ne sont pas des secrets.
//   node lister-voix.mjs
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
if (!env.ELEVENLABS_API_KEY) {
  console.log("Clé absente de .env.local.");
  process.exit(1);
}

const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": env.ELEVENLABS_API_KEY } });
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
const { voices } = await r.json();
console.log(`${voices.length} voix trouvée(s) :`);
for (const v of voices) console.log(`- ${v.name} | ${v.voice_id} | ${v.category}`);
