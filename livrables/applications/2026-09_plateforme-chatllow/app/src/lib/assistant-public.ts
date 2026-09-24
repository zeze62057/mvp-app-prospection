// Constantes de l'assistant utilisables cote navigateur. Les consignes du modele (SYSTEME) restent dans
// lib/assistant.ts, importe seulement par le serveur : elles ne partent jamais chez le client.

export const LIMITE_MESSAGES_PAR_JOUR = 30; // messages d'un client sur 24 h glissantes
export const LONGUEUR_MAX_MESSAGE = 2000; // caracteres par message

// Expertises affichees dans la barre laterale, validees par Zeze. Chacune ouvre une question dans le chat.
export const EXPERTISES = [
  "Stratégie & Transformation",
  "Automatisation des processus",
  "Data & Business Intelligence",
  "Marketing & Relation client",
  "RH & Talent Management",
  "Finance & Performance",
];

export const questionExpertise = (domaine: string) =>
  `Comment l'IA peut-elle m'aider dans le domaine suivant : ${domaine.toLowerCase()} ? Par où commencer ?`;

export const SUGGESTIONS = [
  "Identifier des cas d'usage IA pour mon secteur",
  "Créer un plan d'intégration sur 3 mois",
  "Analyser la faisabilité d'un projet IA",
  "Obtenir un benchmark des solutions existantes",
];

export const PASTILLES: { libelle: string; question: string }[] = [
  { libelle: "Stratégie IA", question: "Comment définir une stratégie IA pour mon entreprise ?" },
  { libelle: "Automatisation", question: "Quels processus de mon entreprise puis-je automatiser avec l'IA ?" },
  { libelle: "Analyse de données", question: "Comment utiliser l'IA pour analyser les données de mon entreprise ?" },
  { libelle: "Cas d'usage", question: "Quels cas d'usage de l'IA sont les plus pertinents pour commencer ?" },
  { libelle: "Plan d'action", question: "Pouvez-vous m'aider à construire un plan d'action pour intégrer l'IA ?" },
];
