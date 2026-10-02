// Met en ligne la vidéo de présentation de la vitrine : crée (si besoin) le bucket PUBLIC « vitrine-media » dans Supabase Storage
// et y envoie la vidéo web et ses sous-titres. La clé vient de app/.env.local et n'est jamais affichée.
//   node publier-video.mjs
// Idempotent : relancer remplace les fichiers par les versions actuelles.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dossier = path.dirname(fileURLToPath(import.meta.url));
const lireEnv = (f) =>
  Object.fromEntries(
    fs
      .readFileSync(f, "utf8")
      .split(/\r?\n/)
      .filter((l) => /^[A-Z_]+=/.test(l))
      .map((l) => {
        const i = l.indexOf("=");
        return [l.slice(0, i), l.slice(i + 1).trim()];
      })
  );
const env = lireEnv(path.join(dossier, "..", "app", ".env.local"));
const base = (env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
const cle = env.SUPABASE_SERVICE_ROLE_KEY;
if (!base || !cle) {
  console.log("NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY absent de app/.env.local.");
  process.exit(1);
}
const BUCKET = "vitrine-media";
const entetes = { apikey: cle, Authorization: `Bearer ${cle}` };

// Sous-titres : SRT vers WebVTT (virgules des millisecondes remplacées par des points).
const srt = fs.readFileSync(path.join(dossier, "sortie", "sous-titres.srt"), "utf8").replace(/\r\n/g, "\n");
const vtt = "WEBVTT\n\n" + srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, "$1.$2");
fs.writeFileSync(path.join(dossier, "sortie", "presentation-vivier-chatllow.fr.vtt"), vtt, "utf8");

// 1. Bucket public (créé s'il n'existe pas).
const liste = await (await fetch(`${base}/storage/v1/bucket`, { headers: entetes })).json();
const existant = Array.isArray(liste) ? liste.find((b) => b.id === BUCKET) : null;
if (!existant) {
  const r = await fetch(`${base}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...entetes, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true, file_size_limit: 52428800, allowed_mime_types: ["video/mp4", "text/vtt", "image/jpeg"] }),
  });
  console.log(r.ok ? `Bucket « ${BUCKET} » créé (public).` : `Création du bucket refusée : ${r.status} ${await r.text()}`);
  if (!r.ok) process.exit(2);
} else {
  console.log(`Bucket « ${BUCKET} » déjà présent (public : ${existant.public}).`);
  if (!existant.public) {
    console.log("Le bucket existe mais n'est pas public : arrêt, rien envoyé.");
    process.exit(3);
  }
}

// 2. Envoi des fichiers.
const fichiers = [
  ["presentation-web.mp4", "presentation-vivier-chatllow.mp4", "video/mp4"],
  ["presentation-vivier-chatllow.fr.vtt", "presentation-vivier-chatllow.fr.vtt", "text/vtt"],
];
for (const [local, distant, type] of fichiers) {
  const contenu = fs.readFileSync(path.join(dossier, "sortie", local));
  const r = await fetch(`${base}/storage/v1/object/${BUCKET}/${distant}`, {
    method: "POST",
    headers: { ...entetes, "Content-Type": type, "x-upsert": "true", "cache-control": "max-age=3600" },
    body: contenu,
  });
  console.log(`${r.ok ? "Envoyé" : "REFUSÉ " + r.status + " " + (await r.text()).slice(0, 200)} : ${distant} (${(contenu.length / 1048576).toFixed(1)} Mo)`);
  if (!r.ok) process.exit(4);
}

// 3. Vérification publique : sans clé, avec demande d'une plage (comme un navigateur).
for (const [, distant] of fichiers) {
  const url = `${base}/storage/v1/object/public/${BUCKET}/${distant}`;
  const r = await fetch(url, { headers: { Range: "bytes=0-1023" } });
  console.log(`Public ${r.status} (${r.headers.get("content-type")}, CORS ${r.headers.get("access-control-allow-origin") ?? "absent"}) : ${distant}`);
}
