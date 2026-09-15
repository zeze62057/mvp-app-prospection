import { marquerSectionTerminee } from "@/app/(membre)/[espace]/progression/actions";
import type { Section } from "@/types/membre";

export function ModuleCard({
  espaceSlug,
  titre,
  sections,
  sectionsTerminees,
  verrouille,
}: {
  espaceSlug: string;
  titre: string;
  sections: Section[];
  sectionsTerminees: Set<string>;
  verrouille: boolean;
}) {
  const total = sections.length;
  const faites = sections.filter((s) => sectionsTerminees.has(s.id)).length;
  const pct = total > 0 ? Math.round((faites / total) * 100) : 0;
  const indexCourant = sections.findIndex((s) => !sectionsTerminees.has(s.id));

  return (
    <div className="mb-3.5 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-6 py-[22px]">
      <div className="mb-3.5 flex items-center justify-between">
        <span className="font-display text-[15.5px] font-bold">{titre}</span>
        {verrouille ? (
          <span className="font-mono text-[13px] text-[var(--texte-mute)]">
            🔒 debloque a la fin du module precedent
          </span>
        ) : (
          <span className="font-mono text-[13px] font-bold text-[var(--sarcelle)]">
            {faites} / {total} sections
          </span>
        )}
      </div>

      <div className="mb-3.5 h-2 overflow-hidden rounded-full bg-[var(--fond)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--sarcelle)] to-[var(--sarcelle-light)]"
          style={{ width: `${verrouille ? 0 : pct}%` }}
        />
      </div>

      {verrouille ? (
        <p className="text-xs text-[var(--texte-mute)]">
          Termine le module precedent pour debloquer celui-ci automatiquement.
        </p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            {sections.map((s, i) => (
              <div
                key={s.id}
                className={`h-[5px] flex-1 rounded-full ${
                  sectionsTerminees.has(s.id)
                    ? "bg-[var(--sarcelle)]"
                    : i === indexCourant
                      ? "bg-[var(--corail)]"
                      : "bg-[var(--fond)]"
                }`}
              />
            ))}
          </div>
          {indexCourant !== -1 && (
            <form action={marquerSectionTerminee.bind(null, espaceSlug, sections[indexCourant].id)}>
              <button type="submit" className="mt-2 text-xs font-bold text-[var(--sarcelle)] underline">
                Marquer &quot;{sections[indexCourant].titre}&quot; comme terminee
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
