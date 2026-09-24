// Anneau de repartition en SVG a la main (meme principe que AnneauProgression).
// Couleurs limitees a celles deja de la charte (pas de palette arc-en-ciel
// inventee) : elles tournent si plus de formations que de couleurs.
const COULEURS = ["var(--sarcelle)", "var(--corail)", "var(--encre)", "var(--sarcelle-light)"];

export function AnneauRepartition({ segments }: { segments: { libelle: string; valeur: number }[] }) {
  const total = segments.reduce((s, seg) => s + seg.valeur, 0);
  const rayon = 46;
  const circonference = 2 * Math.PI * rayon;

  if (total === 0) {
    return <p className="py-10 text-center text-[12.5px] text-[var(--texte-mute)]">Aucun membre pour le moment.</p>;
  }

  const longueurs = segments.map((seg) => (seg.valeur / total) * circonference);
  const decalages = longueurs.reduce<number[]>((acc, longueur, i) => [...acc, (acc[i - 1] ?? 0) + longueur], []);

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Répartition des membres par formation">
        <circle cx="60" cy="60" r={rayon} fill="none" stroke="var(--fond)" strokeWidth="16" />
        {segments.map((seg, i) => {
          const longueur = longueurs[i];
          const decalage = decalages[i - 1] ?? 0;
          return (
            <circle
              key={seg.libelle}
              cx="60"
              cy="60"
              r={rayon}
              fill="none"
              stroke={COULEURS[i % COULEURS.length]}
              strokeWidth="16"
              strokeDasharray={`${longueur} ${circonference - longueur}`}
              strokeDashoffset={-decalage}
              transform="rotate(-90 60 60)"
            />
          );
        })}
        <text x="60" y="56" textAnchor="middle" fontSize="18" fontWeight="800" fill="var(--texte)" fontFamily="var(--font-display)">
          {segments.length}
        </text>
        <text x="60" y="72" textAnchor="middle" fontSize="9" fill="var(--texte-mute)" fontFamily="var(--font-mono)">
          formation{segments.length !== 1 ? "s" : ""}
        </text>
      </svg>
      <div className="flex flex-1 flex-col gap-1.5 text-[11.5px]">
        {segments.map((seg, i) => (
          <div key={seg.libelle} className="flex items-center gap-2">
            <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: COULEURS[i % COULEURS.length] }} />
            <span className="min-w-0 flex-1 truncate">{seg.libelle}</span>
            <span className="font-mono font-bold text-[var(--texte-mute)]">{Math.round((seg.valeur / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
