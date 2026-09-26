// La methode en frise : trois etapes reliees par une ligne qui se trace. Textes = ceux de la vitrine.
// Le seul chiffre affiche ("8 minutes") est deja annonce dans la banniere.
const ICONES = [
  // diagnostic : presse-papiers coche
  "M9 4h6v3H9zM7 5.5H6a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1h-1M9 14l2 2 4-4.5",
  // recommandation : cible
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z",
  // suivi : dossier
  "M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z",
];
const REPERES = ["8 minutes", "Un pilote concret", "Si vous signez"];

export function ParcoursMethode({ etapes }: { etapes: { titre: string; corps: string }[] }) {
  return (
    <div className="relative mt-8">
      {/* Ligne verticale (mobile) et horizontale (ordinateur) : fond pointille + trace qui se dessine */}
      <div aria-hidden className="absolute bottom-6 left-6 top-6 w-px -translate-x-1/2 md:hidden">
        <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(var(--ligne) 50%, transparent 50%)", backgroundSize: "1px 8px" }} />
        <div className="cl-trace-v absolute inset-0 bg-[var(--indigo)]" />
      </div>
      <div aria-hidden className="absolute left-[16.66%] right-[16.66%] top-6 hidden h-px md:block">
        <div className="h-full w-full" style={{ backgroundImage: "linear-gradient(90deg, var(--ligne) 50%, transparent 50%)", backgroundSize: "8px 1px" }} />
        <div className="cl-trace-h absolute inset-0 bg-[var(--indigo)]" />
      </div>

      <ol className="relative grid gap-8 md:grid-cols-3 md:gap-6">
        {etapes.map((e, i) => (
          <li
            key={e.titre}
            className="cl-revele flex gap-4 md:flex-col md:items-center md:text-center"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--indigo)] bg-[var(--fond-carte)] text-[var(--indigo)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={ICONES[i] ?? ICONES[0]} />
              </svg>
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--encre)] font-[family-name:var(--font-mono)] text-[10px] font-semibold text-[var(--fond)]">
                {i + 1}
              </span>
            </span>
            <div className="min-w-0">
              <div className="font-[family-name:var(--font-display)] text-[15.5px] font-semibold">{e.titre}</div>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--texte-mute)]">{e.corps}</p>
              <span className="mt-3 inline-block rounded-full bg-[var(--indigo-soft)] px-3 py-1 font-[family-name:var(--font-mono)] text-[10.5px] font-semibold uppercase tracking-wide text-[oklch(45%_0.19_250)]">
                {REPERES[i]}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
