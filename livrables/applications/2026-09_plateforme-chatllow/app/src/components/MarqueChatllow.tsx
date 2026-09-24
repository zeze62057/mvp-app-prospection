export function MarqueChatllow({ taille = 24, sombre = false }: { taille?: number; sombre?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="shrink-0" style={{ width: taille, height: taille }} aria-hidden>
      <rect x="4" y="4" width="40" height="40" rx="13" fill={sombre ? "#ffffff" : "#14161F"} opacity={sombre ? 0.3 : 0.14} />
      <rect x="20" y="20" width="40" height="40" rx="13" fill="oklch(62% 0.19 250)" />
    </svg>
  );
}
