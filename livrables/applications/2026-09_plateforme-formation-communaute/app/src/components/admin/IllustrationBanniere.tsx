// Illustration de la banniere du tableau de bord : un ordinateur portable avec des barres de
// progression et une toque de diplome, aux couleurs de la charte Vivier (SVG a la main, sans image).
export function IllustrationBanniere({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 130" fill="none" aria-hidden className={className}>
      {/* ecran */}
      <rect x="30" y="38" width="110" height="68" rx="7" fill="#0d2b27" stroke="#5FC7B8" strokeWidth="3" />
      <rect x="40" y="48" width="90" height="48" rx="3" fill="#153f39" />
      {/* barres de progression */}
      <rect x="50" y="76" width="12" height="14" rx="2" fill="#5FC7B8" />
      <rect x="68" y="66" width="12" height="24" rx="2" fill="#5FC7B8" />
      <rect x="86" y="58" width="12" height="32" rx="2" fill="#2B8C82" />
      <rect x="104" y="54" width="12" height="36" rx="2" fill="#FF7A4D" />
      {/* base du portable */}
      <path d="M18 106h134l-7 10a6 6 0 0 1-5 2H30a6 6 0 0 1-5-2l-7-10z" fill="#5FC7B8" />
      <rect x="70" y="106" width="30" height="4" rx="2" fill="#2B8C82" />
      {/* toque de diplome */}
      <path d="M85 8 128 26 85 44 42 26 85 8z" fill="#FF7A4D" />
      <path d="M62 34v12c0 5 10 10 23 10s23-5 23-10V34l-23 10-23-10z" fill="#d9480f" />
      <path d="M128 26v20" stroke="#FFB59B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="128" cy="50" r="4" fill="#FFB59B" />
    </svg>
  );
}
