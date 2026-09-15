import { voter } from "@/app/(membre)/[espace]/communaute/actions";
import { couleurAvatar } from "@/lib/avatar";
import { niveauDepuisPoints, type Post } from "@/types/membre";

const LIBELLE_TAG: Record<Post["tag"], string> = {
  victoire: "victoire",
  question: "question",
  annonce: "annonce",
};

const CLASSE_TAG: Record<Post["tag"], string> = {
  victoire: "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle)]",
  question: "bg-[rgba(255,122,77,0.12)] text-[var(--corail)]",
  annonce: "bg-[var(--encre)] text-[var(--sur-encre)]",
};

function tempsEcoule(dateIso: string): string {
  const diffMs = Date.now() - new Date(dateIso).getTime();
  const heures = Math.floor(diffMs / 3_600_000);
  if (heures < 1) return "a l'instant";
  if (heures < 24) return `il y a ${heures}h`;
  return `il y a ${Math.floor(heures / 24)}j`;
}

export function PostCard({
  espaceSlug,
  post,
  auteurPseudo,
  auteurRole,
  auteurPoints,
  nbVotes,
  aVote,
}: {
  espaceSlug: string;
  post: Post;
  auteurPseudo: string;
  auteurRole: "membre" | "admin";
  auteurPoints: number;
  nbVotes: number;
  aVote: boolean;
}) {
  return (
    <div className="mb-3.5 flex gap-4 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
      <form action={voter.bind(null, espaceSlug, post.id)}>
        <button
          type="submit"
          className={`flex w-9 flex-shrink-0 flex-col items-center gap-0.5 pt-0.5 ${
            aVote ? "text-[var(--sarcelle)]" : "text-[var(--texte-mute)]"
          }`}
        >
          <span className="text-[15px] leading-none">▲</span>
          <span className="font-mono text-[13px] font-bold">{nbVotes}</span>
        </button>
      </form>

      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2.5">
          <div
            className="h-[26px] w-[26px] flex-shrink-0 rounded-full"
            style={{ background: couleurAvatar(post.auteur_id) }}
          />
          <span className="text-[12.5px] font-bold">{auteurPseudo}</span>
          <span className="rounded-[5px] bg-[rgba(43,140,130,0.1)] px-1.5 py-px font-mono text-[9.5px] text-[var(--sarcelle)]">
            {auteurRole === "admin" ? "Admin" : niveauDepuisPoints(auteurPoints)}
          </span>
          <span className={`rounded-[5px] px-2 py-[3px] font-mono text-[9.5px] font-bold uppercase tracking-wide ${CLASSE_TAG[post.tag]}`}>
            {LIBELLE_TAG[post.tag]}
          </span>
          <span className="font-mono text-[10.5px] text-[var(--texte-mute)]">
            {tempsEcoule(post.created_at)}
          </span>
        </div>
        <p className="text-[13.5px] leading-[1.55] text-[var(--texte)]">{post.contenu}</p>
        <div className="mt-2.5 font-mono text-[11.5px] text-[var(--texte-mute)]">
          💬 0 commentaires
        </div>
      </div>
    </div>
  );
}
