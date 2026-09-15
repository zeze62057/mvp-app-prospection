// Le concept central de Vivier Academies : un "espace" est une formation
// autonome (contenu + communaute gratuite + communaute payante + progression).
// Voir CADRAGE.md section 0. Ne jamais coder un espace precis en dur (par
// exemple "vivier-ia") dans la logique : tout doit passer par ce type et par
// le slug charge depuis la base de donnees.

export type Espace = {
  id: string;
  slug: string; // ex: "vivier-ia", "batisseur-pro" — utilise dans l'URL
  nom: string; // ex: "Vivier IA"
  tagline: string;
  prix: number; // en GNF, modifiable par un admin (voir CADRAGE.md section 6)
  devise: string; // "GNF"
  actif: boolean;
};
