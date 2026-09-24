// Mascotte originale de l'assistant Chatllow : dessin SVG aux couleurs du cabinet (encre, indigo).
export function MascotteRobot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 240" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="rb-corps" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4f7ff" />
          <stop offset="1" stopColor="#b9c6ee" />
        </linearGradient>
        <linearGradient id="rb-ecran" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f1430" />
          <stop offset="1" stopColor="#1b2350" />
        </linearGradient>
        <radialGradient id="rb-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="oklch(72% 0.17 250)" stopOpacity="0.55" />
          <stop offset="1" stopColor="oklch(72% 0.17 250)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="110" cy="120" r="110" fill="url(#rb-halo)" />
      {/* antenne */}
      <line x1="110" y1="32" x2="110" y2="56" stroke="#b9c6ee" strokeWidth="5" strokeLinecap="round" />
      <circle cx="110" cy="26" r="9" fill="oklch(72% 0.17 250)" />
      {/* oreilles */}
      <rect x="26" y="88" width="16" height="42" rx="8" fill="oklch(62% 0.19 250)" />
      <rect x="178" y="88" width="16" height="42" rx="8" fill="oklch(62% 0.19 250)" />
      {/* tete */}
      <rect x="40" y="52" width="140" height="112" rx="42" fill="url(#rb-corps)" />
      <rect x="54" y="68" width="112" height="80" rx="30" fill="url(#rb-ecran)" />
      {/* yeux et sourire */}
      <ellipse cx="88" cy="104" rx="11" ry="14" fill="oklch(85% 0.14 210)" />
      <ellipse cx="132" cy="104" rx="11" ry="14" fill="oklch(85% 0.14 210)" />
      <path d="M92 130c7 8 29 8 36 0" stroke="oklch(85% 0.14 210)" strokeWidth="5" strokeLinecap="round" />
      {/* corps */}
      <path d="M72 172h76c10 0 18 8 18 18v22c0 8-6 14-14 14H68c-8 0-14-6-14-14v-22c0-10 8-18 18-18Z" fill="url(#rb-corps)" />
      <circle cx="110" cy="198" r="11" fill="#0f1430" />
      <circle cx="110" cy="198" r="5" fill="oklch(72% 0.17 250)" />
    </svg>
  );
}
