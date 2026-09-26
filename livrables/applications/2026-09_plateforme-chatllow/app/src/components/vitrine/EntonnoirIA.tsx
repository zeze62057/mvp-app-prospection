// Schema de la banniere : de nombreux cas d'usage possibles (points estompes) convergent vers un seul
// pilote prioritaire (point lumineux). Illustre le titre "en premier". Aucun chiffre, aucune donnee : pur schema.
// Coordonnees deterministes (pas de Math.random) pour que le rendu serveur et client soient identiques.
const CIBLE = { x: 236, y: 130 };
const POINTS = Array.from({ length: 26 }, (_, i) => ({
  x: 58 + ((i * 47) % 108),
  y: 34 + ((i * 89) % 200),
  r: 1.5 + (i % 3) * 0.7,
  d: (i % 7) * 0.45,
}));
const ELUS = [2, 7, 11, 16, 21];

export function EntonnoirIA({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Schéma : de nombreux cas d'usage possibles convergent vers un seul pilote prioritaire"
      viewBox="0 0 300 260"
      fill="none"
      className={className}
    >
      <defs>
        <radialGradient id="halo-cible" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(78% 0.13 250)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(78% 0.13 250)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {POINTS.map((p, i) =>
        i % 3 === 0 || ELUS.includes(i) ? (
          <line
            key={`l${i}`}
            x1={p.x}
            y1={p.y}
            x2={CIBLE.x}
            y2={CIBLE.y}
            stroke={ELUS.includes(i) ? "oklch(78% 0.13 250)" : "#ffffff"}
            strokeOpacity={ELUS.includes(i) ? 0.55 : 0.09}
            strokeWidth="1"
            strokeDasharray={ELUS.includes(i) ? "3 6" : undefined}
            className={ELUS.includes(i) ? "cl-flux-dash" : undefined}
          />
        ) : null
      )}

      {POINTS.map((p, i) => (
        <circle
          key={`p${i}`}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill="#ffffff"
          fillOpacity="0.4"
          className="cl-scintille"
          style={{ animationDelay: `${p.d}s` }}
        />
      ))}

      <circle cx={CIBLE.x} cy={CIBLE.y} r="46" fill="url(#halo-cible)" />
      <circle cx={CIBLE.x} cy={CIBLE.y} r="30" stroke="oklch(78% 0.13 250)" strokeOpacity="0.4" strokeWidth="1" className="cl-onde" />
      <circle cx={CIBLE.x} cy={CIBLE.y} r="20" stroke="oklch(78% 0.13 250)" strokeOpacity="0.6" strokeWidth="1.2" />
      <circle cx={CIBLE.x} cy={CIBLE.y} r="9" fill="oklch(80% 0.13 250)" />
      <circle cx={CIBLE.x} cy={CIBLE.y} r="3.2" fill="#10131f" />

      <text x="40" y="16" fill="#ffffff" fillOpacity="0.5" fontSize="10" letterSpacing="0.6" style={{ fontFamily: "var(--font-mono), monospace" }}>
        CAS D&apos;USAGE POSSIBLES
      </text>
      <text x={CIBLE.x} y="186" textAnchor="middle" fill="oklch(85% 0.1 250)" fontSize="10" letterSpacing="0.6" style={{ fontFamily: "var(--font-mono), monospace" }}>
        PREMIER PILOTE
      </text>
    </svg>
  );
}
