// Le concept central de Vivier Academies : un "espace" est une formation
// autonome (contenu + communaute gratuite + communaute payante + progression).
// Voir CADRAGE.md section 0. Ne jamais coder un espace precis en dur (par
// exemple "vivier-ia") dans la logique : tout doit passer par ce type et par
// le slug charge depuis la base de donnees.

// Contenu marketing de la vitrine : donnee par espace, jamais du JSX code en
// dur par nom d'espace (voir CADRAGE.md section 0). Champs optionnels : un
// espace sans encore de contenu vitrine affiche simplement ces sections en
// moins, plutot que de planter.
export type ContenuVitrine = {
  hero_kicker?: string;
  hero_titre?: string; // "*mot*" = accent italique, "\n" = saut de ligne
  hero_sous_titre?: string;
  terminal_titre?: string;
  terminal_lignes?: string[];
  terminal_lien?: string;
  fondateur_tag?: string;
  fondateur_lede?: string;
  fondateur_paragraphes?: string[]; // "**mot**" = gras
  offre_texte?: string; // "**mot**" = gras
};

export type Espace = {
  id: string;
  slug: string; // ex: "vivier-ia", "batisseur-pro" — utilise dans l'URL
  nom: string; // ex: "Vivier IA"
  tagline: string;
  prix: number; // en GNF, modifiable par un admin (voir CADRAGE.md section 6)
  devise: string; // "GNF"
  actif: boolean;
  contenu_vitrine: ContenuVitrine;
};
