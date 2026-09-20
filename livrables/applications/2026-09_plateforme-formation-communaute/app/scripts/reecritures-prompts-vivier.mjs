// Regles de nettoyage des prompts des fiches pratiques (modules 1 et 2 de Vivier IA).
// Utilisees par charger-prompts-vivier.mjs.
//
// Meme parti pris editorial que reecritures-vivier.mjs : l'eleve est le "tu",
// Chatllow, Longrich et Kora disparaissent des exemples, le workspace de Zeze aussi.
// On garde context/CONTEXT.md et context/HISTORY.md : c'est la convention de second
// brain que le cours enseigne, et les prompts existants de la bibliotheque l'emploient.

// { id, avant: "texte exact" | /motif/, apres, sur?: "titre" (sinon le contenu) }
export const REECRITURES_PROMPTS = [
  // Contenu
  { id: "P1", avant: "la base Notion \"Clients Chatllow\" via MCP", apres: "la base Notion \"Clients\" via MCP" },
  { id: "P2", avant: "à la base Supabase du projet Kora et montre-moi", apres: "à la base Supabase de mon projet de prospection et montre-moi" },
  { id: "P3", avant: "du workflow commercial Chatllow,", apres: "du workflow commercial d'un cabinet de conseil," },
  { id: "P4", avant: "sur les offres Chatllow.", apres: "sur les offres de mon entreprise." },
  { id: "P5", avant: "d'un système de support Chatllow avec 3 destinations", apres: "d'un système de support client avec 3 destinations" },
  { id: "P6", avant: "le suivi des distributeurs Longrich que je forme à l'IA.", apres: "le suivi des distributeurs que je forme à l'IA." },

  // Titres : plus clairs hors du contexte de la fiche
  { id: "T1", sur: "titre", avant: "Permissions", apres: "Cadrer les permissions de l'agent" },
  { id: "T2", sur: "titre", avant: "Instruction courte mais complète (petite tâche)", apres: "Petite tâche : une instruction courte mais complète" },
  { id: "T3", sur: "titre", avant: "Avant le gabarit : et la maquette ?", apres: "Partir d'une maquette déjà validée" },
  { id: "T4", sur: "titre", avant: "Le prompt Plan", apres: "Exemple : le prompt Plan" },
  { id: "T5", sur: "titre", avant: "Le prompt Validate", apres: "Exemple : le prompt Validate" },
  { id: "T6", sur: "titre", avant: "Lire le plan et corriger avant l'exécution", apres: "Corriger le plan avant l'exécution" },
];

// Prompts qu'on ne charge pas (titre contient, fichier exact).
export const EXCLUS = [
  // Propres au workspace de Zeze : ils citent ses dossiers, ses projets et ses conventions.
  { fichier: "03-maitriser-loutil-prompts", titre: "Cas réel tiré de ce workspace", raison: "cite les dossiers et projets du workspace de Zeze" },
  { fichier: "03-maitriser-loutil-prompts", titre: "Cas réel — générer le support de présentation du Module 1", raison: "cite les dossiers du workspace et le deck de Vivier IA" },
  // Doublons de prompts deja en bibliotheque (versions condensees chargees par la migration 0010).
  { fichier: "02-methode-prompts", titre: "Gabarit réutilisable", raison: "doublon de « Instruction complète (gabarit 4 éléments) »" },
  { fichier: "02-methode-prompts", titre: "Exemple de prompt de validation seul", raison: "doublon de « Valider un travail annoncé terminé »" },
];
