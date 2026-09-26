import Image from "next/image";
import type { CSSProperties } from "react";

// Bandeau photo de la communaute gratuite : version inversee du bandeau de la payante (photo a gauche,
// fond sombre, icones en ligne sous le texte). Texte generique : il sert tous les espaces.
const ATOUTS = [
  { titre: "Apprendre", icone: "M12 3 2 8l10 5 8-4v6h2V8L12 3zm-6 9v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4l-6 3-6-3z" },
  { titre: "Échanger", icone: "M4 4h16v11H8l-4 4V4zm4 4v2h8V8H8z" },
  { titre: "Booster", icone: "M12 2c3 2 5 5 5 9l2 3-3 1-1 3h-6l-1-3-3-1 2-3c0-4 2-7 5-9zm0 5a2 2 0 100 4 2 2 0 000-4z" },
];

const ETINCELLE = "M12 0 14 10 24 12 14 14 12 24 10 14 0 12 10 10Z";
const ETINCELLES = [
  { x: "47%", y: "5%", t: 18, d: "0s" },
  { x: "96%", y: "16%", t: 22, d: "1.2s" },
  { x: "60%", y: "88%", t: 16, d: "2.1s" },
];

export function BandeauGratuite({ espaceNom }: { espaceNom: string }) {
  return (
    <section
      className="anim-entree relative overflow-hidden rounded-3xl text-[var(--sur-encre)]"
      style={{
        background:
          "radial-gradient(circle at 100% 0%, rgba(95,199,184,0.32), transparent 45%), radial-gradient(circle at 30% 110%, rgba(255,122,77,0.22), transparent 45%), radial-gradient(rgba(234,245,242,0.1) 1.4px, transparent 1.4px) 0 0 / 22px 22px, linear-gradient(135deg, #113832, #0a1f1c)",
      }}
    >
      {/* Decor : la Cle de la marque en grand a droite, etincelles */}
      <svg aria-hidden className="pointer-events-none absolute -bottom-20 -right-16 hidden h-[360px] w-[360px] sm:block" viewBox="0 0 120 120" fill="none">
        <g className="anim-flotte">
          <circle cx="45" cy="75" r="22" stroke="#5FC7B8" strokeOpacity="0.16" strokeWidth="9" />
          <line x1="61" y1="59" x2="95" y2="25" stroke="#5FC7B8" strokeOpacity="0.16" strokeWidth="9" strokeLinecap="round" />
          <circle className="anim-lueur" cx="95" cy="25" r="9" fill="#FF7A4D" fillOpacity="0.5" />
        </g>
      </svg>
      {ETINCELLES.map((e, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 24 24"
          className="anim-scintille pointer-events-none absolute hidden md:block"
          style={{ left: e.x, top: e.y, width: e.t, height: e.t, animationDelay: e.d } as CSSProperties}
          fill={i % 2 ? "#FF7A4D" : "#5FC7B8"}
        >
          <path d={ETINCELLE} />
        </svg>
      ))}

      <div className="relative grid md:grid-cols-[0.8fr_1.2fr]">
        <div className="relative h-60 md:h-auto md:min-h-[320px]">
          <div className="pointer-events-none absolute -right-3.5 inset-y-4 hidden rounded-r-[150px] border-2 border-dashed border-[rgba(95,199,184,0.5)] md:block md:w-[calc(100%-0.5rem)]" />
          <div className="absolute inset-0 overflow-hidden rounded-b-[60px] bg-[#EEF1F0] md:rounded-b-none md:rounded-r-[140px]">
            <Image
              src="/zeze-bilivogui.jpg"
              alt="Zézé Bilivogui, expert agentic coding"
              fill
              priority
              sizes="(min-width: 768px) 300px, 100vw"
              className="origin-top scale-[1.16] object-cover object-[50%_10%]" /* la photo source a des marges blanches sur les cotes */
            />
          </div>
        </div>

        <div className="relative flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
          <p className="font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle-light)]">
            communauté gratuite · {espaceNom}
          </p>
          <h2 className="font-display mt-2 text-[28px] font-extrabold leading-[1.1] tracking-tight sm:text-[34px]">
            Bienvenue chez ceux qui construisent{" "}
            <span className="text-[var(--corail)]">leur avenir</span>
          </h2>
          <p className="mt-3.5 max-w-md text-[14px] leading-relaxed text-[var(--sur-encre-mute)]">
            Ici, tu apprends en public, tu poses tes questions et tu vois les autres avancer.
          </p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {ATOUTS.map((a, i) => (
              <li
                key={a.titre}
                className="anim-entree flex items-center gap-2.5 rounded-full border border-[rgba(234,245,242,0.16)] bg-[rgba(234,245,242,0.08)] py-1.5 pl-1.5 pr-4"
                style={{ "--d": `${300 + i * 110}ms` } as CSSProperties}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(95,199,184,0.2)]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#5FC7B8" aria-hidden>
                    <path d={a.icone} />
                  </svg>
                </span>
                <span className="text-[12.5px] font-bold">{a.titre}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
