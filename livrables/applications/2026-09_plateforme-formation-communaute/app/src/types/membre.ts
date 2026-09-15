export type StatutAdhesion = "en_attente" | "approuve" | "refuse";

export type Profil = {
  id: string;
  pseudo: string;
  role: "membre" | "admin";
  created_at: string;
};

export type Adhesion = {
  id: string;
  profil_id: string;
  espace_id: string;
  statut: StatutAdhesion;
  created_at: string;
  traite_at: string | null;
};

export type TagPost = "victoire" | "question" | "annonce";

export type Post = {
  id: string;
  espace_id: string;
  auteur_id: string;
  contenu: string;
  tag: TagPost;
  created_at: string;
};

export function niveauDepuisPoints(points: number): string {
  if (points >= 200) return "Niveau 5";
  if (points >= 80) return "Niveau 4";
  if (points >= 30) return "Niveau 3";
  if (points >= 10) return "Niveau 2";
  return "Niveau 1";
}
