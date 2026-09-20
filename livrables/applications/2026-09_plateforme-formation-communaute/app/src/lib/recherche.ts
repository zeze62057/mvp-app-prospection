// Recherche de texte dans le fil (titre et contenu des posts). Fichier sans dependance,
// pour rester testable seul.
//
// Le terme saisi ne doit jamais etre interprete comme un motif : `%` et `_` sont des jokers
// de LIKE, et PostgREST transforme `*` en `%`. On echappe donc les deux premiers, on retire
// `*` (aucun moyen fiable de le chercher litteralement), puis on met le motif entre guillemets
// pour que virgules et parentheses ne cassent pas le filtre `.or()`.

const LONGUEUR_MAX = 80;
const LONGUEUR_MIN = 2;

// Terme nettoye, ou null s'il est trop court pour etre une vraie recherche. Accepte `unknown`
// car un parametre d'URL repete (?q=a&q=b) arrive sous forme de tableau.
export function nettoyerTerme(brut: unknown): string | null {
  if (typeof brut !== "string" || !brut) return null;
  const terme = brut
    .replace(/[\u0000-\u001f\u007f*]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, LONGUEUR_MAX)
    .trim();
  return terme.length >= LONGUEUR_MIN ? terme : null;
}

// Valeur a passer a `.ilike()` dans un filtre `.or()` : "*terme*" echappe et entre guillemets.
export function motifIlike(terme: string): string {
  const pourLike = terme.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
  const pourPostgrest = pourLike.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"*${pourPostgrest}*"`;
}

// Filtre `.or()` complet : le terme dans le titre ou dans le contenu.
export function filtreRecherche(terme: string): string {
  const motif = motifIlike(terme);
  return `titre.ilike.${motif},contenu.ilike.${motif}`;
}
