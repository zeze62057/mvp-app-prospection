export type Question = {
  question: string;
  options: string[];
};

export const QUESTIONS: Question[] = [
  {
    question: "Quel est le principal frein à l'adoption de l'IA dans votre organisation ?",
    options: [
      "Manque de compréhension",
      "Résistance au changement",
      "Cas d'usage flous",
      "Contraintes réglementaires",
    ],
  },
  {
    question: "Combien de personnes utilisent déjà un outil IA au quotidien ?",
    options: ["Aucune", "Quelques pionniers isolés", "Une équipe entière", "Plusieurs départements"],
  },
  {
    question: "Quel processus interne consomme le plus de temps à faible valeur ajoutée ?",
    options: [
      "Reporting manuel",
      "Recherche d'information",
      "Rédaction de documents",
      "Coordination entre équipes",
    ],
  },
  {
    question: "Qui porterait ce pilote en interne si vous en lanciez un ?",
    options: [
      "Vous-même directement",
      "Une équipe métier volontaire",
      "La DSI",
      "Personne d'identifié pour l'instant",
    ],
  },
  {
    question: "Vos données sur ce processus sont-elles exploitables ?",
    options: [
      "Centralisées et propres",
      "Dispersées entre plusieurs outils",
      "En grande partie sur papier ou en silos",
      "Je ne sais pas",
    ],
  },
  {
    question: "Sous quel délai voulez-vous un résultat concret ?",
    options: ["Moins de 3 mois", "3 à 6 mois", "Plus de 6 mois", "Pas de délai précis"],
  },
  {
    question: "Un budget est-il déjà alloué pour ce type de projet ?",
    options: ["Déjà budgété", "En cours d'arbitrage", "Dépendra du cas présenté", "Non"],
  },
];
