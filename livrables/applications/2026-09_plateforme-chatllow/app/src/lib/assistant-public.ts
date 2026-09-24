// Contenus affiches par le tableau de bord de l'espace client. Aucune connexion a un service d'IA :
// l'assistant est un apercu (voir ApercuChat). `href: null` = element affiche grise « bientot ».

import type { NomIcone } from "@/components/Icone";

export const EXPERTISES: { libelle: string; icone: NomIcone }[] = [
  { libelle: "Stratégie & Transformation", icone: "transformation" },
  { libelle: "Automatisation des processus", icone: "automatisation" },
  { libelle: "Data & Business Intelligence", icone: "data" },
  { libelle: "Marketing & Relation client", icone: "relation" },
  { libelle: "RH & Talent Management", icone: "equipe" },
  { libelle: "Finance & Performance", icone: "finance" },
];

export const SUGGESTIONS: { texte: string; icone: NomIcone; teinte: string; href: string | null }[] = [
  { texte: "Identifier des cas d'usage IA pour mon secteur", icone: "ampoule", teinte: "bg-[rgba(34,160,110,0.14)] text-[#157a52]", href: "/diagnostic" },
  { texte: "Créer un plan d'intégration sur 3 mois", icone: "calendrier", teinte: "bg-[rgba(34,160,110,0.14)] text-[#157a52]", href: null },
  { texte: "Analyser la faisabilité d'un projet IA", icone: "bouclier", teinte: "bg-[var(--indigo-soft)] text-[oklch(45%_0.19_250)]", href: null },
  { texte: "Obtenir un benchmark des solutions existantes", icone: "comparaison", teinte: "bg-[rgba(200,60,160,0.12)] text-[#a1287f]", href: null },
];

export const PASTILLES: { libelle: string; icone: NomIcone; href: string | null }[] = [
  { libelle: "Stratégie IA", icone: "cible", href: "/espace-client?section=strategie" },
  { libelle: "Automatisation", icone: "automatisation", href: null },
  { libelle: "Analyse de données", icone: "graphique", href: "/espace-client?section=analyses" },
  { libelle: "Cas d'usage", icone: "ampoule", href: "/diagnostic" },
  { libelle: "Plan d'action", icone: "calendrier", href: "/espace-client?section=projets" },
];
