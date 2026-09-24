import { couleurAvatar } from "@/lib/avatar";

// Photo de profil (lien temporaire deja signe par urlsAvatars) ou, sans photo, l'initiale sur la
// couleur deterministe du membre. Composant serveur, sans dependance.
export function AvatarAdmin({
  id,
  pseudo,
  url,
  taille = 32,
}: {
  id: string;
  pseudo: string;
  url?: string | null;
  taille?: number;
}) {
  return (
    <span
      aria-hidden
      className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-cover bg-center font-display text-[12px] font-bold uppercase text-white"
      style={{
        width: taille,
        height: taille,
        background: url ? undefined : couleurAvatar(id),
        backgroundImage: url ? `url(${url})` : undefined,
      }}
    >
      {url ? "" : pseudo.charAt(0) || "?"}
    </span>
  );
}
