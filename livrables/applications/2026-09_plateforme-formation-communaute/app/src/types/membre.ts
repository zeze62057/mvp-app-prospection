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
  tag: TagPost; // historique : le fil utilise categorie_id (migration 0026)
  zone: ZonePost;
  magnet_texte: string | null;
  created_at: string;
  titre: string | null;
  epingle: boolean;
  image_path: string | null;
  categorie_id: string | null;
  modifie_le: string | null; // renseigne quand le titre ou le texte change (migration 0033)
  video_url: string | null; // lien externe (YouTube...), jamais de fichier video televerse (migration 0044)
  fichier_path: string | null;
  fichier_nom: string | null;
  lien_url: string | null;
};

export type TypeReaction = "like" | "coeur" | "rire";

// Categorie de post, geree par l'admin, propre a un espace (migration 0026).
export type CategoriePost = {
  id: string;
  espace_id: string;
  libelle: string;
  emoji: string;
  ordre: number;
};

export type Commentaire = {
  id: string;
  post_id: string;
  auteur_id: string;
  contenu: string;
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

// Devoirs, remises et badges attribues a la main (migration 0043). Les badges
// automatiques (premier module, serie de jours, formation terminee) ne sont pas
// stockes : calcules depuis la progression deja en base.
export type Devoir = {
  id: string;
  espace_id: string;
  module_id: string;
  titre: string;
  consigne: string;
  date_limite: string;
  created_at: string;
};

export type DevoirRemise = {
  id: string;
  devoir_id: string;
  profil_id: string;
  texte: string | null;
  fichier_path: string | null;
  rendu_at: string;
  note: number | null;
  commentaire: string | null;
  note_le: string | null;
};

export type BadgeManuel = {
  id: string;
  espace_id: string;
  profil_id: string;
  libelle: string;
  emoji: string;
  created_at: string;
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


// Notification (migration 0029) : creee par des triggers, jamais par le client.
export type TypeNotification =
  | "like"
  | "commentaire"
  | "message"
  | "mention"
  | "demande_adhesion" // a un admin : quelqu'un demande a rejoindre (migration 0037)
  | "adhesion_approuvee"; // au membre : sa demande est acceptee

export type NotificationMembre = {
  id: string;
  profil_id: string;
  acteur_id: string;
  espace_id: string;
  type: TypeNotification;
  post_id: string | null;
  lu: boolean;
  created_at: string;
};

// Retour de la fonction stats_communaute (migration 0031) : compteurs et
// classement par points a vie, reserves aux membres de l'espace.
export type StatsCommunaute = {
  nb_membres: number;
  nb_eleves: number;
  classement: { id: string; pseudo: string; points: number }[];
  eleves: { id: string; pseudo: string }[];
};

// Message prive entre deux membres d'un meme espace (migration 0030).
export type MessagePrive = {
  id: string;
  espace_id: string;
  expediteur_id: string;
  destinataire_id: string;
  contenu: string;
  lu_at: string | null;
  created_at: string;
};
