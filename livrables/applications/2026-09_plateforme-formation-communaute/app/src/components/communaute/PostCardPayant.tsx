import { voterPayant } from "@/app/(membre)/[espace]/communaute-payante/actions";
import { couleurAvatar } from "@/lib/avatar";
import { niveauDepuisPoints, type Post } from "@/types/membre";

function tempsEcoule(dateIso: string): string {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const heures = Math.floor(diffMs / 3_600_000);
  if (heures < 1) return "a l'instant";
  if (heures < 24) return `il y a ${heures}h`;
  return `il y a ${Math.floor(heures / 24)}j`;
}

export function PostCardPayant({
  espaceSlug,
  post,
  auteurPseudo,
  auteurRole,
  auteurPoints,
  estExpert,
  nbLikes,
  aLike,
}: {
  espaceSlug: string;
  post: Post;
  auteurPseudo: string;
  auteurRole: "membre" | "admin";
  auteurPoints: number;
  estExpert: boolean;
  nbLikes: number;
  aLike: boolean;
}) {
  return (
    <div className="mb-3.5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
      <div className="mb-2.5 flex items-center gap-2.5">
        <div
          className="h-7 w-7 flex-shrink-0 rounded-full"
          style={{ background: couleurAvatar(post.auteur_id) }}
        />
        <span className="text-[12.5px] font-bold">{auteurPseudo}</span>
        {estExpert ? (
          <span className="rounded-[5px] bg-[var(--corail)] px-1.5 py-px font-mono text-[9.5px] font-bold text-[var(--encre)]">
            ★ Expert
          </span>
        ) : (
          <span className="rounded-[5px] bg-[rgba(43,140,130,0.1)] px-1.5 py-px font-mono text-[9.5px] text-[var(--sarcelle)]">
            {auteurRole === "admin" ? "Admin" : niveauDepuisPoints(auteurPoints)}
          </span>
        )}
        <span className="font-mono text-[10.5px] text-[var(--texte-mute)]">
          {tempsEcoule(post.created_at)}
        </span>
      </div>

      <p className="mb-3 text-[13.5px] leading-[1.55] text-[var(--texte)]">{post.contenu}</p>

      {post.magnet_texte && (
        <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-[var(--corail)] px-2 py-1 font-mono text-[9px] font-bold text-[var(--encre)]">
          🧲 {post.magnet_texte}
        </div>
      )}

      <div className="flex gap-[18px] font-mono text-[11.5px] text-[var(--texte-mute)]">
        <form action={voterPayant.bind(null, espaceSlug, post.id)}>
          <button
            type="submit"
            className={aLike ? "font-bold text-[var(--corail)]" : ""}
          >
            {aLike ? "♥" : "♡"} {nbLikes}
          </button>
        </form>
        <span>💬 0 commentaires</span>
      </div>
    </div>
  );
}
