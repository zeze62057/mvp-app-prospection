// Jeu d'icones lineaires (24 x 24, trait), dessine pour l'espace client. Aucune dependance.
const CHEMINS = {
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z",
  dossier: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
  cible: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z M12 12h.01",
  graphique: "M5 20V11 M12 20V4 M19 20v-6 M3 20h18",
  document: "M7 3h7l5 5v13H7V3Z M14 3v5h5 M10 13h6 M10 17h6",
  bibliotheque: "M4 5h4v14H4V5Z M10 5h4v14h-4V5Z M16.5 6.5l3.5 1-3 12-3.500-1",
  reglages:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M12 3v2.500 M12 18.500V21 M3 12h2.500 M18.500 12H21 M5.600 5.600l1.800 1.800 M16.600 16.600l1.800 1.800 M18.400 5.600l-1.800 1.800 M7.400 16.600l-1.800 1.800",
  transformation: "M4 12a8 8 0 0 1 14-5.300L20 9 M20 4v5h-5 M20 12a8 8 0 0 1-14 5.300L4 15 M4 20v-5h5",
  automatisation: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M12 2v3 M12 19v3 M2 12h3 M19 12h3",
  data: "M4 4v16h16 M8 16v-5 M12 16V8 M16 16v-3",
  relation: "M4 5h16v11H9l-5 4V5Z",
  equipe: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M3 20a6 6 0 0 1 12 0 M16.500 5.500a3 3 0 0 1 0 5.500 M18 20a6 6 0 0 0-2.500-5",
  finance: "M12 3v18 M16 7.500C16 6 14.200 5 12 5S8 6 8 7.500 9.800 10 12 10s4 1 4 2.500S14.200 15 12 15s-4-1-4-2.500",
  ampoule: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.500V15h8v-1.500A6 6 0 0 0 12 3Z",
  calendrier: "M5 5h14v15H5V5Z M5 10h14 M9 3v4 M15 3v4",
  bouclier: "M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6l8-3Z M9 12l2 2 4-4",
  comparaison: "M4 6h16 M4 12h10 M4 18h6",
  fichier: "M7 3h7l5 5v13H7V3Z M14 3v5h5",
  trombone: "M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.500 3.500 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7",
  envoyer: "M22 2 11 13 M22 2l-7 20-4-9-9-4 20-7Z",
} as const;

export type NomIcone = keyof typeof CHEMINS;

export function Icone({ nom, className = "h-[18px] w-[18px]" }: { nom: NomIcone; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden
    >
      <path d={CHEMINS[nom]} />
    </svg>
  );
}
