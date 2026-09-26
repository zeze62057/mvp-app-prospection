import type { CSSProperties } from "react";

export function AnneauProgression({ pct }: { pct: number }) {
  const rayon = 27;
  const circonference = 2 * Math.PI * rayon;
  const decalage = circonference * (1 - pct / 100);

  return (
    <div className="flex items-center gap-4">
      <svg width="64" height="64" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={rayon} fill="none" stroke="var(--ligne)" strokeWidth="7" />
        {/* L'anneau se remplit de 0 a sa valeur (animation CSS, voir globals.css). La valeur finale reste
            posee dans strokeDashoffset : sans animation, le trait est deja au bon endroit. */}
        <circle
          className="anim-anneau"
          style={{ "--circ": circonference, "--decalage": decalage } as CSSProperties}
          cx="32"
          cy="32"
          r={rayon}
          fill="none"
          stroke="var(--sarcelle)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circonference}
          strokeDashoffset={decalage}
          transform="rotate(-90 32 32)"
        />
      </svg>
      <div>
        <div className="font-display text-[15px] font-extrabold">{pct}%</div>
        <div className="mt-0.5 text-[11px] text-[var(--texte-mute)]">progression totale</div>
      </div>
    </div>
  );
}
