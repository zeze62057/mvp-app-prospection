// Lien WhatsApp de support d'un espace (reglage admin, migration 0050). Null tant qu'aucun numero n'est
// configure : la page n'affiche alors aucun faux bouton actif.
export function lienWhatsApp(
  numero: string | null | undefined,
  message: string | null | undefined,
  nomEspace: string,
  pseudo?: string
): string | null {
  if (!numero) return null;
  const base = message?.trim() || `Bonjour, je n'arrive pas à payer la formation ${nomEspace}.`;
  const texte = pseudo ? `${base} (mon pseudo : ${pseudo})` : base;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texte)}`;
}
