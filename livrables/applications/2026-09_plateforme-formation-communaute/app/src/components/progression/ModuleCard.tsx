import Link from "next/link";
import { marquerSectionTerminee } from "@/app/(membre)/[espace]/progression/actions";
import type { Section } from "@/types/membre";

// Aucun verrou : l'eleve ouvre les sections dans l'ordre qu'il veut. La progression
// (barre, compteur, coches) reste affichee, elle ne bloque plus rien.
export function ModuleCard({
  espaceSlug,
  titre,
  sections,
  sectionsTerminees,
}: {
  espaceSlug: string;
  titre: string;
  sections: Section[];
  sectionsTerminees: Set<string>;
}) {
  const total = sections.length;
  const faites = sections.filter((s) => sectionsTerminees.has(s.id)).length;
  const pct = total > 0 ? Math.round((faites / total) * 100) : 0;

  return (
    <div className="mb-3.5 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-6 py-[22px]">
      <div className="mb-3.5 flex items-center justify-between gap-3">
        <span className="font-display text-[15.5px] font-bold">{titre}</span>
        <span className="shrink-0 font-mono text-[13px] font-bold text-[var(--sarcelle)]">
          {faites} / {total} sections
        </span>
      </div>

      <div className="mb-3.5 h-2 overflow-hidden rounded-full bg-[var(--fond)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--sarcelle)] to-[var(--sarcelle-light)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="flex flex-col">
        {sections.map((s) => {
          const terminee = sectionsTerminees.has(s.id);
          const lisible = s.a_contenu || !!s.video_path;
          return (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--ligne)] py-2.5 first:border-t-0"
            >
              <span
                aria-label={terminee ? "Terminée" : "À faire"}
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  terminee
                    ? "bg-[var(--sarcelle)] text-[var(--sur-encre)]"
                    : "border border-[var(--ligne)] text-transparent"
                }`}
              >
                ✓
              </span>
              <span
                className={`min-w-0 flex-1 basis-40 text-[13.5px] ${
                  terminee ? "text-[var(--texte-mute)]" : "font-semibold"
                }`}
              >
                {s.titre}
              </span>
              <span className="flex shrink-0 items-center gap-4 text-xs font-bold">
                {lisible && (
                  <Link
                    href={`/${espaceSlug}/formation/${s.id}`}
                    className="text-[var(--corail)] underline"
                  >
                    {terminee ? "Relire" : "Lire"}
                  </Link>
                )}
                {!terminee && (
                  <form action={marquerSectionTerminee.bind(null, espaceSlug, s.id)}>
                    <button type="submit" className="text-[var(--sarcelle)] underline">
                      Marquer comme terminée
                    </button>
                  </form>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
