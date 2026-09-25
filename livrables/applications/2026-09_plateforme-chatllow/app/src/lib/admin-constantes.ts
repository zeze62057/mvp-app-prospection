// Constantes de l'administration Chatllow, sans dependance serveur : utilisables aussi cote navigateur.

export const CATEGORIES_LIVRABLE = [
  { id: "strategie", libelle: "Stratégie IA" },
  { id: "analyse", libelle: "Analyses & Rapports" },
  { id: "documentation", libelle: "Documentation" },
  { id: "ressource", libelle: "Ressources" },
] as const;

export const STATUTS_PROJET = [
  { id: "a_venir", libelle: "À venir" },
  { id: "en_cours", libelle: "En cours" },
  { id: "termine", libelle: "Terminé" },
] as const;

// Formats acceptes pour les livrables : documents et images courants. Pas de HTML, SVG ni executable.
export const EXTENSIONS_AUTORISEES = ["pdf", "docx", "doc", "xlsx", "xls", "pptx", "ppt", "csv", "txt", "md", "png", "jpg", "jpeg", "zip"];
export const TAILLE_MAX_LIVRABLE = 50 * 1024 * 1024; // 50 Mo, aligne sur la limite du bucket
