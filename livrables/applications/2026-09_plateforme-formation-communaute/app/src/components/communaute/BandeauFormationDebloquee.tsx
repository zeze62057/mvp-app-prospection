import Link from "next/link";

// Remplace « Débloque la formation complète » pour un élève qui a déjà payé : bienvenue, point de
// reprise réel (prochain chapitre ouvrable non terminé) et bouton pour continuer.
// Les chiffres viennent de la progression de l'élève, rien n'est inventé.
export function BandeauFormationDebloquee({
  pseudo,
  espaceSlug,
  faites,
  total,
  prochain,
}: {
  pseudo: string;
  espaceSlug: string;
  faites: number;
  total: number;
  prochain: { id: string; titre: string } | null;
}) {
  const pct = total > 0 ? Math.round((faites / total) * 100) : 0;
  const commence = faites > 0;
  const href = prochain ? `/${espaceSlug}/formation/${prochain.id}` : `/${espaceSlug}/formation`;

  return (
    <div className="relative mb-[18px] overflow-hidden rounded-[16px] bg-gradient-to-br from-[var(--encre)] via-[var(--encre-2)] to-[var(--sarcelle)] p-6 text-[var(--sur-encre)] shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      {/* Décor : cercles et trait corail, purement graphiques. */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[rgba(255,255,255,0.07)]" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-16 h-36 w-36 rounded-full border-[14px] border-[rgba(255,255,255,0.06)]" />
      <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-[var(--corail)]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--corail)] px-2.5 py-1 font-mono text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--encre)]">
            ✓ Formation débloquée
          </span>
          <b className="font-display mt-3 block text-[19px] font-extrabold leading-tight">
            {commence ? `Bon retour, ${pseudo}` : `Bienvenue, ${pseudo}`}
          </b>
          <p className="mt-1 text-[12.5px] text-[var(--sur-encre-mute)]">
            {prochain
              ? `${commence ? "Reprends" : "Commence"} par : ${prochain.titre}`
              : "Tout le contenu disponible est terminé. Les nouveaux chapitres arrivent bientôt."}
          </p>
          {total > 0 && (
            <div className="mt-3 max-w-xs">
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="text-[var(--sur-encre-mute)]">
                  {faites} chapitre{faites > 1 ? "s" : ""} sur {total}
                </span>
                <b className="font-mono text-[var(--corail)]">{pct} %</b>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct}
                aria-label="Avancement dans la formation"
                className="mt-1 h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.2)]"
              >
                <div className="h-full rounded-full bg-[var(--corail)]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>
        <Link
          href={href}
          className="shrink-0 self-start whitespace-nowrap rounded-[10px] bg-[var(--corail)] px-5 py-3 text-[13px] font-extrabold text-[var(--encre)] transition-transform hover:-translate-y-0.5 sm:self-center"
        >
          {commence ? "Continuer ma formation" : "Commencer la formation"} →
        </Link>
      </div>
    </div>
  );
}
