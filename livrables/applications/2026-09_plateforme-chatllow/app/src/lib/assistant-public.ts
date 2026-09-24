// Constantes de l'assistant utilisables cote navigateur. Les consignes du modele (SYSTEME) restent dans
// lib/assistant.ts, importe seulement par le serveur : elles ne partent jamais chez le client.

import type { NomIcone } from "@/components/Icone";

export const LIMITE_MESSAGES_PAR_JOUR = 30; // messages d'un client sur 24 h glissantes
export const LONGUEUR_MAX_MESSAGE = 2000; // caracteres par message

// Expertises affichees dans la barre laterale, validees par Zeze. Chacune ouvre une question dans le chat.
export const EXPERTISES: { libelle: string; icone: NomIcone }[] = [
  { libelle: "Stratégie & Transformation", icone: "transformation" },
  { libelle: "Automatisation des processus", icone: "automatisation" },
  { libelle: "Data & Business Intelligence", icone: "data" },
  { libelle: "Marketing & Relation client", icone: "relation" },
  { libelle: "RH & Talent Management", icone: "equipe" },
  { libelle: "Finance & Performance", icone: "finance" },
];

export const questionExpertise = (domaine: string) =>
  `Comment l'IA peut-elle m'aider dans le domaine suivant : ${domaine.toLowerCase()} ? Par où commencer ?`;

export const SUGGESTIONS: { texte: string; icone: NomIcone; teinte: string }[] = [
  { texte: "Identifier des cas d'usage IA pour mon secteur", icone: "ampoule", teinte: "bg-[rgba(34,160,110,0.14)] text-[#157a52]" },
  { texte: "Créer un plan d'intégration sur 3 mois", icone: "calendrier", teinte: "bg-[rgba(34,160,110,0.14)] text-[#157a52]" },
  { texte: "Analyser la faisabilité d'un projet IA", icone: "bouclier", teinte: "bg-[var(--indigo-soft)] text-[oklch(45%_0.19_250)]" },
  { texte: "Obtenir un benchmark des solutions existantes", icone: "comparaison", teinte: "bg-[rgba(200,60,160,0.12)] text-[#a1287f]" },
];

export const PASTILLES: { libelle: string; question: string; icone: NomIcone }[] = [
  { libelle: "Stratégie IA", icone: "cible", question: "Comment définir une stratégie IA pour mon entreprise ?" },
  { libelle: "Automatisation", icone: "automatisation", question: "Quels processus de mon entreprise puis-je automatiser avec l'IA ?" },
  { libelle: "Analyse de données", icone: "graphique", question: "Comment utiliser l'IA pour analyser les données de mon entreprise ?" },
  { libelle: "Cas d'usage", icone: "ampoule", question: "Quels cas d'usage de l'IA sont les plus pertinents pour commencer ?" },
  { libelle: "Plan d'action", icone: "calendrier", question: "Pouvez-vous m'aider à construire un plan d'action pour intégrer l'IA ?" },
];
