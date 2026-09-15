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

export type Post = {
  id: string;
  espace_id: string;
  auteur_id: string;
  contenu: string;
  created_at: string;
};
