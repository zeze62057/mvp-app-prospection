// Ligne de temps de la vidéo : UNE seule source pour l'audio (build.mjs) et l'image (scenes/index.html).
// Chaque phrase commence quand la précédente finit, plus une respiration ; les scènes sont séparées par une pause plus longue.
export const LEAD = 1.2; // silence avant la première phrase (fondu d'ouverture)
export const GAP_PHRASE = 0.35; // respiration entre deux phrases d'une même scène
export const GAP_SCENE = 0.9; // pause entre deux scènes
export const TAIL = 3.0; // carte de fin après la dernière phrase

// narration = contenu de sortie/narration.json. Renvoie scènes et phrases avec leurs dates (en secondes).
export function construireLigneDeTemps(narration) {
  let t = LEAD;
  const scenes = [];
  const phrases = [];
  narration.forEach((s, si) => {
    const debutScene = t;
    const scene = { index: si, titre: s.titre, debut: debutScene, fin: 0, phrases: [] };
    s.phrases.forEach((p, k) => {
      const derniere = k === s.phrases.length - 1;
      const phrase = { scene: si, rang: k, texte: p.texte, fichier: p.fichier, duree: p.duree, debut: t, fin: t + p.duree };
      scene.phrases.push(phrase);
      phrases.push(phrase);
      t += p.duree + (derniere ? (si === narration.length - 1 ? 0 : GAP_SCENE) : GAP_PHRASE);
    });
    scene.fin = t;
    scenes.push(scene);
  });
  return { scenes, phrases, total: t + TAIL };
}

// Sous-titres SRT, à partir de la même ligne de temps.
export function versSrt(ligneDeTemps) {
  const f = (s) => {
    const ms = Math.round(s * 1000);
    const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
    const sec = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
    return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, "0")}`;
  };
  return ligneDeTemps.phrases.map((p, i) => `${i + 1}\n${f(p.debut)} --> ${f(p.fin)}\n${p.texte}\n`).join("\n");
}
