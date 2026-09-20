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
export type ZonePost = "gratuite" | "payante";

export type Post = {
  id: string;
  espace_id: string;
  auteur_id: string;
  contenu: string;
  tag: TagPost;
  zone: ZonePost;
  magnet_texte: string | null;
  created_at: string;
};

export type AccesPayant = {
  id: string;
  profil_id: string;
  espace_id: string;
  actif: boolean;
  est_expert: boolean;
  paye_at: string;
};

export type CandidatureExpert = {
  id: string;
  profil_id: string;
  espace_id: string;
  statut: StatutAdhesion;
  created_at: string;
};

export type Module = {
  id: string;
  espace_id: string;
  ordre: number;
  titre: string;
};

export type Section = {
  id: string;
  module_id: string;
  ordre: number;
  titre: string;
  video_path: string | null;
  a_contenu: boolean; // true si la section a un texte de lecon (voir migration 0023)
  contenu?: string | null; // texte Markdown de la lecon, charge uniquement par la page de lecon
};

export type StatutPaiement = "en_attente" | "confirme" | "echoue";

export type Paiement = {
  id: string;
  profil_id: string;
  espace_id: string;
  montant: number;
  devise: string;
  statut: StatutPaiement;
  reference_chariow: string | null;
  created_at: string;
  confirme_at: string | null;
};

export type CategoriePrompt = "fondations" | "methode" | "quotidien" | "business" | "n8n";

export type Prompt = {
  id: string;
  espace_id: string;
  categorie: CategoriePrompt;
  titre: string;
  contenu: string;
  ordre: number;
};

export type TypeRessource = "lien" | "fichier";

export type Ressource = {
  id: string;
  espace_id: string;
  type: TypeRessource;
  titre: string;
  description: string;
  url: string | null;
  chemin_storage: string | null;
  ordre: number;
  created_at: string;
};

export type TermeGlossaire = {
  id: string;
  espace_id: string;
  terme: string;
  definition: string;
  ordre: number;
};

export type Masterclass = {
  id: string;
  espace_id: string;
  titre: string;
  description: string;
  date_heure: string;
  lien: string;
  created_at: string;
};

export type InscriptionMasterclass = {
  id: string;
  masterclass_id: string;
  profil_id: string;
  created_at: string;
};

export type CreneauRdv = {
  id: string;
  espace_id: string;
  date_heure: string;
  lien: string;
  reserve_par: string | null;
  created_at: string;
};

export type StatutContenu = "brouillon" | "publie";

export type Contenu = {
  id: string;
  espace_id: string;
  titre: string;
  corps: string;
  statut: StatutContenu;
  created_at: string;
};

export type Temoignage = {
  id: string;
  profil_id: string;
  espace_id: string;
  note: number;
  texte: string;
  autorise_partage: boolean;
  created_at: string;
};

export function niveauDepuisPoints(points: number): string {
  if (points >= 200) return "Niveau 5";
  if (points >= 80) return "Niveau 4";
  if (points >= 30) return "Niveau 3";
  if (points >= 10) return "Niveau 2";
  return "Niveau 1";
}
