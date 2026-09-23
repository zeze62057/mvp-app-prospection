import Link from "next/link";
import { couleurAvatar } from "@/lib/avatar";

const MEDAILLE = ["🥇", "🥈", "🥉"];

// Classement par points a vie (likes recus), deja calcule par
// stats_communaute (migration 0031). Top 4, pas de nouvelle requete.
export function CarteClassement({
  espaceSlug,
  classement,
}: {
  espaceSlug: string;
  classement: { id: string; pseudo: string; points: number }[];
}) {
  if (classement.length === 0) return null;

  return (
    <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="font-display text-[13px] font-bold">Top membres actifs</div>
        <Link href={`/${espaceSlug}/membres`} className="font-mono text-[11px] font-bold text-[var(--sarcelle)]">
          Voir tout →
        </Link>
      </div>
      {classement.map((m, i) => (
        <div key={m.id} className="flex items-center gap-2.5 py-1.5">
          <span className="w-4 shrink-0 text-center text-[13px]">
            {MEDAILLE[i] ?? <span className="font-mono text-[11px] font-bold text-[var(--texte-mute)]">{i + 1}</span>}
          </span>
          <div className="h-7 w-7 flex-shrink-0 rounded-full" style={{ background: couleurAvatar(m.id) }} />
          <span className="flex-1 truncate text-xs font-bold">{m.pseudo}</span>
          <span className="font-mono text-[11px] font-bold text-[var(--corail)]">{m.points} pts</span>
        </div>
      ))}
    </div>
  );
}
