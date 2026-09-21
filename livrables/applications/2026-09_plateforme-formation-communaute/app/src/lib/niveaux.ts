// Niveaux d'un espace (migration 0036). Partie logique, sans dependance, pour rester testable
// seule. Le calcul du niveau de l'utilisateur connecte, lui, vit dans la base (niveau_actuel) :
// c'est elle qui verrouille les masterclass. Ici on ne fait que l'affichage, avec les memes seuils.

export type NiveauConfig = { niveau: number; libelle: string; points_requis: number };

// Seuils historiques, utilises tant qu'un espace n'a rien regle. Doivent rester identiques a ceux
// de niveau_actuel dans la migration 0036.
export const NIVEAUX_PAR_DEFAUT: NiveauConfig[] = [
  { niveau: 1, libelle: "Niveau 1", points_requis: 0 },
  { niveau: 2, libelle: "Niveau 2", points_requis: 10 },
  { niveau: 3, libelle: "Niveau 3", points_requis: 30 },
  { niveau: 4, libelle: "Niveau 4", points_requis: 80 },
  { niveau: 5, libelle: "Niveau 5", points_requis: 200 },
];

export const NIVEAU_MAX = 9;
export const LIBELLE_MAX = 30;

// Le niveau atteint : le plus haut dont les points requis sont atteints, sinon le premier.
export function niveauDe(points: number, niveaux: NiveauConfig[]): NiveauConfig {
  const tries = [...niveaux].sort((a, b) => a.niveau - b.niveau);
  let atteint = tries[0] ?? NIVEAUX_PAR_DEFAUT[0];
  for (const n of tries) {
    if (points >= n.points_requis) atteint = n;
  }
  return atteint;
}

// Ce qu'on affiche a cote d'un pseudo : "Admin" pour un admin, sinon le libelle du niveau.
export function libelleNiveau(points: number, role: string, niveaux: NiveauConfig[]): string {
  return role === "admin" ? "Admin" : niveauDe(points, niveaux).libelle;
}

export function prochainNiveau(points: number, niveaux: NiveauConfig[]): NiveauConfig | null {
  const actuel = niveauDe(points, niveaux);
  return [...niveaux].sort((a, b) => a.niveau - b.niveau).find((n) => n.niveau > actuel.niveau) ?? null;
}

export function libelleDuNiveau(niveau: number, niveaux: NiveauConfig[]): string {
  return niveaux.find((n) => n.niveau === niveau)?.libelle ?? `Niveau ${niveau}`;
}

export function niveauMaximum(niveaux: NiveauConfig[]): number {
  return niveaux.reduce((max, n) => Math.max(max, n.niveau), 1);
}

// Reglage saisi par l'admin : libelle_1..9 et points_1..9. Une ligne dont le libelle est vide
// n'existe pas ; les niveaux utilises doivent se suivre a partir de 1 sans trou. Le niveau 1 vaut
// toujours 0 point (tout membre l'a) et les points augmentent strictement.
export function lireNiveauxSaisis(
  lire: (cle: string) => string
): { niveaux: NiveauConfig[]; erreur: null } | { niveaux: null; erreur: string } {
  const niveaux: NiveauConfig[] = [];
  let vide = false;
  for (let n = 1; n <= NIVEAU_MAX; n++) {
    const libelle = lire(`libelle_${n}`).trim().replace(/\s+/g, " ");
    const brut = lire(`points_${n}`).trim();
    if (!libelle && !brut) {
      vide = true;
      continue;
    }
    if (vide) return { niveaux: null, erreur: "Les niveaux doivent se suivre, sans ligne vide au milieu." };
    if (!libelle) return { niveaux: null, erreur: `Le niveau ${n} n'a pas de nom.` };
    if (libelle.length > LIBELLE_MAX) {
      return { niveaux: null, erreur: `Le nom du niveau ${n} est limité à ${LIBELLE_MAX} caractères.` };
    }
    if (!/^\d{1,6}$/.test(brut)) {
      return { niveaux: null, erreur: `Les points du niveau ${n} doivent être un nombre entier positif.` };
    }
    niveaux.push({ niveau: n, libelle, points_requis: Number(brut) });
  }

  if (niveaux.length === 0) return { niveaux: null, erreur: "Renseigne au moins le niveau 1." };
  if (niveaux[0].points_requis !== 0) {
    return { niveaux: null, erreur: "Le niveau 1 doit valoir 0 point : tout le monde l'a en arrivant." };
  }
  for (let i = 1; i < niveaux.length; i++) {
    if (niveaux[i].points_requis <= niveaux[i - 1].points_requis) {
      return {
        niveaux: null,
        erreur: `Les points doivent augmenter : le niveau ${niveaux[i].niveau} doit demander plus que le niveau ${niveaux[i - 1].niveau}.`,
      };
    }
  }
  const noms = new Set(niveaux.map((n) => n.libelle.toLowerCase()));
  if (noms.size !== niveaux.length) {
    return { niveaux: null, erreur: "Deux niveaux ne peuvent pas porter le même nom." };
  }
  return { niveaux, erreur: null };
}
