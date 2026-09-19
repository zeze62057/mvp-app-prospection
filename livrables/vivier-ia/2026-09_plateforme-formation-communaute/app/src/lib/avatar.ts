// Couleur d'avatar deterministe (pas de vraie photo en V1) : le meme profil
// garde toujours la meme couleur, tiree de la palette de la marque.
const PALETTE = ["var(--sarcelle)", "var(--corail)", "var(--sarcelle-light)", "var(--encre-2)"];

export function couleurAvatar(id: string): string {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % PALETTE.length;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
