// "Exemple de diagnostic" en flux : trois cartes reliees par un trait anime (frein, processus, pilote).
// Les valeurs sont celles de l'exemple deja present sur la page et restent marquees comme illustratives.
const ICONES = [
  // frein : triangle d'alerte
  "M12 4 3 20h18L12 4zM12 10v5M12 18v.5",
  // processus : horloge
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2",
  // pilote : cible
  "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 11.5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z",
];

function Connecteur() {
  return (
    <div aria-hidden className="flex items-center justify-center py-1 md:px-1 md:py-0">
      <svg viewBox="0 0 60 24" className="h-6 w-14 rotate-90 md:rotate-0" fill="none">
        <line x1="2" y1="12" x2="50" y2="12" stroke="var(--indigo)" strokeOpacity="0.5" strokeWidth="1.5" strokeDasharray="3 5" className="cl-flux-dash" />
        <path d="M46 6l8 6-8 6" stroke="var(--indigo)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <circle r="2.6" cy="12" fill="var(--indigo)" className="cl-flux-point" />
      </svg>
    </div>
  );
}

export function FluxDiagnostic({ lignes }: { lignes: { label: string; valeur: string }[] }) {
  return (
    <section className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Exemple de diagnostic</p>
        <span className="rounded-full border border-[var(--ligne)] px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wide text-[var(--texte-mute)]">
          Illustratif
        </span>
      </div>
      <div className="mt-5 flex flex-col md:flex-row md:items-stretch">
        {lignes.map((l, i) => {
          const dernier = i === lignes.length - 1;
          return (
            <div key={l.label} className="contents">
              <div
                className={`cl-revele flex flex-1 flex-col gap-3 rounded-2xl border p-4 ${
                  dernier
                    ? "border-[oklch(62%_0.19_250_/_0.45)] bg-[var(--indigo-soft)]"
                    : "border-[var(--ligne)] bg-[var(--fond)]"
                }`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    dernier ? "bg-[var(--indigo)] text-white" : "bg-[var(--encre)] text-[var(--fond)]"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d={ICONES[i] ?? ICONES[0]} />
                  </svg>
                </span>
                <span className="text-[12px] leading-snug text-[var(--texte-mute)]">{l.label}</span>
                <span
                  className={`font-[family-name:var(--font-display)] text-[16px] font-semibold leading-tight ${
                    dernier ? "text-[oklch(45%_0.19_250)]" : ""
                  }`}
                >
                  {l.valeur}
                </span>
              </div>
              {!dernier && <Connecteur />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
