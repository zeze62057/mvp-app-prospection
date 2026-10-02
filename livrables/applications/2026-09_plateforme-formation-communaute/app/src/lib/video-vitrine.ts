// Vidéo de présentation de la vitrine d'un espace. Hébergée dans un bucket PUBLIC de Supabase Storage
// (la vitrine est publique, la vidéo aussi) ; la vignette est un fichier du site, dans public/.
// Une seule vidéo pour l'instant : celle de Vivier Academies (qui présente aussi Chatllow).

export const BUCKET_VITRINE = "vitrine-media";

export type ChapitreVideo = { t: number; titre: string };

export type VideoVitrine = {
  src: string;
  sousTitres: string;
  vignette: string;
  duree: string;
  titre: string;
  chapitres: ChapitreVideo[];
};

// Instants (en secondes) où chaque partie commence dans la vidéo, mesurés sur la ligne de temps de la vidéo
// (video-presentation/timeline.mjs). À refaire si la vidéo est remontée.
const CHAPITRES_VIVIER: ChapitreVideo[] = [
  { t: 0, titre: "Bienvenue" },
  { t: 25, titre: "Le fondateur" },
  { t: 62, titre: "La plateforme" },
  { t: 98, titre: "La bibliothèque de prompts" },
  { t: 145, titre: "Les cinq modules" },
  { t: 203, titre: "La méthode" },
  { t: 238, titre: "Chatllow, le cabinet de conseil" },
  { t: 291, titre: "Par où commencer" },
];

const VIDEOS: Record<string, Omit<VideoVitrine, "src" | "sousTitres"> & { fichier: string; fichierSousTitres: string }> = {
  "vivier-ia": {
    fichier: "presentation-vivier-chatllow.mp4",
    fichierSousTitres: "presentation-vivier-chatllow.fr.vtt",
    vignette: "/vitrines/vivier-ia/video-vignette.jpg",
    duree: "5:20",
    titre: "Découvre Vivier Academies en cinq minutes",
    chapitres: CHAPITRES_VIVIER,
  },
};

// Renvoie la vidéo de l'espace, ou null s'il n'en a pas (ou si l'adresse de Supabase est absente).
export function videoVitrine(slug: string): VideoVitrine | null {
  const { fichier, fichierSousTitres, ...reste } = VIDEOS[slug] ?? ({} as (typeof VIDEOS)[string]);
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!fichier || !base) return null;
  const dossier = `${base.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET_VITRINE}`;
  return { ...reste, src: `${dossier}/${fichier}`, sousTitres: `${dossier}/${fichierSousTitres}` };
}

export function formaterTemps(secondes: number): string {
  const s = Math.max(0, Math.floor(secondes));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
