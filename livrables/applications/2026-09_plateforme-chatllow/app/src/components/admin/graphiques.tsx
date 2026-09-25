// Graphiques SVG rendus cote serveur (aucune bibliotheque). Toutes les valeurs viennent de vraies donnees.

export function Sparkline({ valeurs, couleur = "#34d399", className = "h-10 w-24" }: { valeurs: number[]; couleur?: string; className?: string }) {
  const n = valeurs.length;
  const max = Math.max(...valeurs, 1);
  const pts = valeurs.map((v, i) => `${n === 1 ? 50 : (i / (n - 1)) * 100},${36 - (v / max) * 32}`);
  const id = `sp-${couleur.replace(/[^a-z0-9]/gi, "")}-${n}`;
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={couleur} stopOpacity="0.35" />
          <stop offset="1" stopColor={couleur} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,40 ${pts.join(" ")} 100,40`} fill={`url(#${id})`} stroke="none" />
      <polyline points={pts.join(" ")} fill="none" stroke={couleur} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

// Courbe d'evolution : plusieurs series sur les memes jours, axe vertical gradue, libelles de dates espaces.
export function CourbeEvolution({
  jours,
  series,
}: {
  jours: string[];
  series: { nom: string; couleur: string; valeurs: number[] }[];
}) {
  const L = 640;
  const H = 230;
  const marge = { g: 34, d: 10, h: 14, b: 26 };
  const max = Math.max(...series.flatMap((s) => s.valeurs), 4);
  const haut = Math.ceil(max / 4) * 4;
  const x = (i: number) => marge.g + (jours.length <= 1 ? 0 : (i / (jours.length - 1)) * (L - marge.g - marge.d));
  const y = (v: number) => marge.h + (1 - v / haut) * (H - marge.h - marge.b);
  const graduations = [0, 1, 2, 3, 4].map((k) => (haut / 4) * k);
  const pas = Math.max(1, Math.ceil(jours.length / 6));

  return (
    <svg viewBox={`0 0 ${L} ${H}`} className="h-auto w-full" role="img" aria-label="Évolution sur la période">
      {graduations.map((g) => (
        <g key={g}>
          <line x1={marge.g} x2={L - marge.d} y1={y(g)} y2={y(g)} stroke="rgba(140,160,255,0.14)" />
          <text x={marge.g - 6} y={y(g) + 4} textAnchor="end" fontSize="10" fill="rgba(232,236,248,0.55)">{Math.round(g)}</text>
        </g>
      ))}
      {jours.map((j, i) =>
        i % pas === 0 ? (
          <text key={j} x={x(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="rgba(232,236,248,0.55)">{j}</text>
        ) : null
      )}
      {series.map((s) => {
        const pts = s.valeurs.map((v, i) => `${x(i)},${y(v)}`);
        const id = `ev-${s.nom.replace(/[^a-z0-9]/gi, "")}`;
        return (
          <g key={s.nom}>
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={s.couleur} stopOpacity="0.28" />
                <stop offset="1" stopColor={s.couleur} stopOpacity="0" />
              </linearGradient>
            </defs>
            <polyline points={`${x(0)},${y(0)} ${pts.join(" ")} ${x(s.valeurs.length - 1)},${y(0)}`} fill={`url(#${id})`} stroke="none" />
            <polyline points={pts.join(" ")} fill="none" stroke={s.couleur} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
            {s.valeurs.map((v, i) => (v > 0 ? <circle key={i} cx={x(i)} cy={y(v)} r="3" fill={s.couleur} /> : null))}
          </g>
        );
      })}
    </svg>
  );
}

// Anneau de progression (0 a 100).
export function Anneau({ pct, libelle, sous }: { pct: number; libelle: string; sous: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label={`${libelle} : ${p} %`}>
      <defs>
        <linearGradient id="anneau" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#7c8cff" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(140,160,255,0.16)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke="url(#anneau)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(p / 100) * c} ${c}`} transform="rotate(-90 60 60)" />
      <text x="60" y="58" textAnchor="middle" fontSize="26" fontWeight="600" fill="#e8ecf8">{libelle}</text>
      <text x="60" y="76" textAnchor="middle" fontSize="10" fill="rgba(232,236,248,0.6)">{sous}</text>
    </svg>
  );
}
