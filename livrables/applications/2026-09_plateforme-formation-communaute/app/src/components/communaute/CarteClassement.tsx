import { couleurAvatar } from "@/lib/avatar";

// Classement par points a vie (likes recus), deja calcule par
// stats_communaute (migration 0031). Top 4, pas de nouvelle requete.
export function CarteClassement({
  classement,
}: {
  classement: { id: string; pseudo: string; points: number }[];
}) {
  if (classement.length === 0) return null;

  return (
    <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
      <div className="font-display mb-3.5 text-[13px] font-bold">Classement</div>
      {classement.map((m, i) => (
        <div key={m.id} className="flex items-center gap-2.5 py-1.5">
          <span className="w-4 shrink-0 font-mono text-[11px] font-bold text-[var(--texte-mute)]">
            {i + 1}
          </span>
          <div className="h-7 w-7 flex-shrink-0 rounded-full" style={{ background: couleurAvatar(m.id) }} />
          <span className="flex-1 truncate text-xs font-bold">{m.pseudo}</span>
          <span className="font-mono text-[11px] font-bold text-[var(--corail)]">{m.points} pts</span>
        </div>
      ))}
    </div>
  );
}
