// Modules interactifs et fiches PDF de la formation (fichiers dans app/modules-interactifs/,
// hors public/ : ils ne sortent que par la route /api/modules-interactifs/[fichier], qui
// verifie l'acces payant). Ajoutes sans modification des fichiers d'origine.
//
// Le numero du module interactif est celui du fichier. Pour Vivier IA, les modules 1 a 5
// correspondent aux modules 1 a 5 de la base (modules.ordre). Le module 6 (cybersecurite)
// n'a pas de module en base : il s'affiche en carte a part sur la page Formation.

export const ESPACE_MODULES_INTERACTIFS = "vivier-ia";
export const NUMERO_MODULE_SANS_BASE = 6;

export const TITRES_MODULES_INTERACTIFS: Record<number, string> = {
  1: "Devenez architecte et validateur avec Claude Code",
  2: "Maîtrisez n8n",
  3: "De l'opportunité IA à votre première vente",
  4: "Sécurité et conformité IA",
  5: "Prospection et Lemlist",
  6: "Cybersécurité IA en 5 points",
};

export function numeroModuleInteractif(valeur: string): number | null {
  if (!/^[1-6]$/.test(valeur)) return null;
  return Number(valeur);
}

// Liste blanche stricte : aucun chemin construit a partir de la saisie.
export function fichierModuleInteractif(nom: string): { chemin: string; type: string } | null {
  const m = /^(module|fiche-module)-([1-6])\.(html|pdf)$/.exec(nom);
  if (!m) return null;
  const [, prefixe, , extension] = m;
  if ((prefixe === "module") !== (extension === "html")) return null;
  return {
    chemin: nom,
    type: extension === "html" ? "text/html; charset=utf-8" : "application/pdf",
  };
}
