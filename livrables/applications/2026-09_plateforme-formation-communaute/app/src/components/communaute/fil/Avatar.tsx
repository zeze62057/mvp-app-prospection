import { couleurAvatar } from "@/lib/avatar";

// Avatar d'un membre : sa photo si elle existe (lot photo de profil), sinon un
// cercle colore deterministe avec son initiale.
export function Avatar({
  id,
  pseudo,
  taille = 36,
  urlPhoto = null,
}: {
  id: string;
  pseudo: string;
  taille?: number;
  urlPhoto?: string | null;
}) {
  const style = { width: taille, height: taille };
  if (urlPhoto) {
    // eslint-disable-next-line @next/next/no-img-element -- lien temporaire signe, pas d'optimisation possible
    return <img src={urlPhoto} alt="" style={style} className="flex-shrink-0 rounded-full object-cover" />;
  }
  return (
    <div
      aria-hidden="true"
      style={{ ...style, background: couleurAvatar(id), fontSize: Math.round(taille * 0.42) }}
      className="flex flex-shrink-0 items-center justify-center rounded-full font-display font-bold uppercase text-[var(--sur-encre)]"
    >
      {pseudo.trim().charAt(0) || "?"}
    </div>
  );
}
