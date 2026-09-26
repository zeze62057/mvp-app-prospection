import type { CSSProperties } from "react";
import { CompteurAnime } from "@/components/progression/CompteurAnime";
import { dateDuJourConakry, salutationConakry } from "@/lib/salutation";

// Cadre d'accueil de la communaute gratuite : carte sombre arrondie, pastilles de stats reelles a droite.
// Volontairement different du bandeau pleine largeur de la communaute payante.
export function AccueilGratuite({
  pseudo,
  nbMembres,
  nbEleves,
}: {
  pseudo: string;
  nbMembres: number;
  nbEleves: number;
}) {
  const pastilles = [
    { icone: "👥", nombre: nbMembres, libelle: nbMembres !== 1 ? "membres" : "membre" },
    { icone: "🎓", nombre: nbEleves, libelle: nbEleves !== 1 ? "élèves" : "élève" },
  ];
  return (
    <section
      className="anim-entree relative overflow-hidden rounded-3xl px-6 py-7 text-[var(--sur-encre)] sm:px-9 sm:py-8"
      style={{
        background:
          "radial-gradient(circle at 8% 0%, rgba(95,199,184,0.4), transparent 50%), radial-gradient(circle at 100% 100%, rgba(255,122,77,0.28), transparent 45%), radial-gradient(rgba(234,245,242,0.12) 1.5px, transparent 1.5px) 0 0 / 20px 20px, linear-gradient(135deg, #16443c, #0b2622)",
      }}
    >
      <svg aria-hidden className="pointer-events-none absolute -right-24 -top-24 hidden h-[360px] w-[360px] sm:block" viewBox="0 0 200 200" fill="none">
        <circle className="anim-tourne" cx="100" cy="100" r="96" stroke="#5FC7B8" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="2 7" strokeLinecap="round" />
        <circle cx="100" cy="100" r="70" stroke="#5FC7B8" strokeOpacity="0.25" strokeWidth="1.2" />
        <circle className="anim-lueur" cx="100" cy="4" r="5" fill="#FF7A4D" />
      </svg>

      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="min-w-0">
          <p className="font-mono text-[11px] capitalize tracking-wide text-[var(--sarcelle-light)]">{dateDuJourConakry()}</p>
          <h1 className="font-display mt-2 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">
            {salutationConakry()} <span className="text-[var(--sarcelle-light)]">{pseudo}</span>{" "}
            <span className="anim-salue" aria-hidden>
              👋
            </span>
          </h1>
          <p className="mt-2 max-w-sm text-[13.5px] text-[var(--sur-encre-mute)]">
            Content de te voir dans la communauté. Voici ce qui t&apos;attend aujourd&apos;hui.
          </p>
        </div>

        <div className="flex gap-3">
          {pastilles.map((p, i) => (
            <div
              key={p.libelle}
              className="anim-entree flex items-center gap-3 rounded-2xl border border-[rgba(234,245,242,0.16)] bg-[rgba(234,245,242,0.08)] px-4 py-3 backdrop-blur"
              style={{ "--d": `${200 + i * 120}ms` } as CSSProperties}
            >
              <span className="text-xl" aria-hidden>
                {p.icone}
              </span>
              <div>
                <div className="font-display text-xl font-extrabold leading-none">
                  <CompteurAnime valeur={p.nombre} />
                </div>
                <div className="mt-1 text-[11.5px] text-[var(--sur-encre-mute)]">{p.libelle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
