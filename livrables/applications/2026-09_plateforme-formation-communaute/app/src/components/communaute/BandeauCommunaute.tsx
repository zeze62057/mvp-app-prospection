import Image from "next/image";
import type { CSSProperties } from "react";
import { CompteurAnime } from "@/components/progression/CompteurAnime";

// Bandeau d'accueil de la communaute (gratuite et payante) : texte a gauche, photo de Zeze a droite,
// puces flottantes, decor de la marque, stats reelles en bas. Texte generique : il sert tous les espaces.
// Les animations sont dans globals.css et s'arretent pour qui a demande moins d'animations.
const PUCES = [
  { titre: "Apprendre", detail: "pas à pas", icone: "M12 3 2 8l10 5 8-4v6h2V8L12 3zm-6 9v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4l-6 3-6-3z" },
  { titre: "Échanger", detail: "entre élèves", icone: "M4 4h16v11H8l-4 4V4zm4 4v2h8V8H8z" },
  { titre: "Booster", detail: "tes projets", icone: "M12 2c3 2 5 5 5 9l2 3-3 1-1 3h-6l-1-3-3-1 2-3c0-4 2-7 5-9zm0 5a2 2 0 100 4 2 2 0 000-4z" },
];

const ETINCELLE = "M12 0 14 10 24 12 14 14 12 24 10 14 0 12 10 10Z";
const ETINCELLES = [
  { x: "5%", y: "12%", t: 22, d: "0s" },
  { x: "46%", y: "9%", t: 16, d: "1.1s" },
  { x: "54%", y: "56%", t: 20, d: "2.2s" },
  { x: "36%", y: "80%", t: 14, d: "0.6s" },
  { x: "93%", y: "86%", t: 22, d: "1.7s" },
];

export function BandeauCommunaute({
  espaceNom,
  nbMembres,
  nbEleves,
}: {
  espaceNom: string;
  nbMembres: number;
  nbEleves: number;
}) {
  return (
    <section
      className="anim-entree relative overflow-hidden rounded-3xl border border-[var(--ligne)]"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, rgba(95,199,184,0.26), transparent 45%), radial-gradient(circle at 62% 100%, rgba(255,122,77,0.12), transparent 40%), radial-gradient(rgba(43,140,130,0.16) 1.4px, transparent 1.4px) 0 0 / 22px 22px, linear-gradient(135deg, #ffffff, #F2F7F5)",
      }}
    >
      {/* Decor : la Cle de la marque (anneau + point d'acces), grand cercle en pointilles, etincelles */}
      <svg aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 hidden h-[340px] w-[340px] sm:block" viewBox="0 0 120 120" fill="none">
        <g className="anim-flotte">
          <circle cx="45" cy="75" r="22" stroke="#2B8C82" strokeOpacity="0.14" strokeWidth="9" />
          <line x1="61" y1="59" x2="95" y2="25" stroke="#2B8C82" strokeOpacity="0.14" strokeWidth="9" strokeLinecap="round" />
          <circle className="anim-lueur" cx="95" cy="25" r="9" fill="#FF7A4D" fillOpacity="0.4" />
        </g>
      </svg>
      <svg aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] hidden md:block" viewBox="0 0 200 200" fill="none">
        <circle className="anim-tourne" cx="100" cy="100" r="96" stroke="#2B8C82" strokeOpacity="0.6" strokeWidth="1.6" strokeDasharray="2 7" strokeLinecap="round" />
        <circle cx="100" cy="100" r="74" stroke="#5FC7B8" strokeOpacity="0.5" strokeWidth="1.4" />
        <circle cx="100" cy="100" r="52" stroke="#FF7A4D" strokeOpacity="0.4" strokeWidth="1.4" />
      </svg>
      {ETINCELLES.map((e, i) => (
        <svg
          key={i}
          aria-hidden
          viewBox="0 0 24 24"
          className={`anim-scintille pointer-events-none absolute ${i === 2 || i === 3 ? "hidden md:block" : ""}`}
          style={{ left: e.x, top: e.y, width: e.t, height: e.t, animationDelay: e.d } as CSSProperties}
          fill={i % 2 ? "#FF7A4D" : "#2B8C82"}
        >
          <path d={ETINCELLE} />
        </svg>
      ))}

      <div className="relative grid md:grid-cols-[1.15fr_0.85fr]">
        {/* Photo : en haut sur mobile, a droite sur ordinateur (order pour garder le texte en premier dans le code) */}
        <div className="relative order-first h-60 md:order-last md:h-auto md:min-h-[340px]">
          <div className="pointer-events-none absolute -left-10 top-0 hidden h-72 w-72 rounded-full bg-[rgba(95,199,184,0.4)] blur-3xl md:block" />
          <div className="pointer-events-none absolute right-16 top-2 hidden h-32 w-32 rounded-full bg-[rgba(255,122,77,0.35)] blur-2xl md:block" />
          <div className="pointer-events-none absolute -left-3.5 inset-y-4 hidden rounded-l-[150px] border-2 border-dashed border-[rgba(43,140,130,0.55)] md:block md:w-[calc(100%-0.5rem)]" />
          <div className="absolute inset-0 overflow-hidden rounded-b-[60px] bg-[#EEF1F0] md:rounded-b-none md:rounded-l-[140px]">
            <Image
              src="/zeze-bilivogui.jpg"
              alt="Zézé Bilivogui, expert agentic coding"
              fill
              priority
              sizes="(min-width: 768px) 380px, 100vw"
              className="origin-top scale-[1.16] object-cover object-[50%_10%]" /* la photo source a des marges blanches sur les cotes */
            />
          </div>
          <div className="pointer-events-none absolute inset-0 hidden md:block">
            {PUCES.map((p, i) => (
              <div
                key={p.titre}
                className="anim-entree absolute right-4"
                style={{ top: `${12 + i * 27}%`, "--d": `${350 + i * 120}ms` } as CSSProperties}
              >
                <div
                  className="anim-flotte flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/85 px-3.5 py-2.5 shadow-[0_10px_28px_rgba(17,56,50,0.18)] backdrop-blur"
                  style={{ animationDelay: `${-i * 2.2}s` }}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--encre)]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#5FC7B8" aria-hidden>
                      <path d={p.icone} />
                    </svg>
                  </span>
                  <span className="text-[11px] leading-tight text-[var(--texte-mute)]">
                    <b className="font-display block text-[12.5px] text-[var(--texte)]">{p.titre}</b>
                    {p.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--ligne)] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--texte)]">
            <span className="anim-lueur h-2 w-2 rounded-full bg-[var(--corail)]" aria-hidden />
            La communauté qui fait grandir tes idées
          </span>
          <h2 className="font-display text-[30px] font-extrabold leading-[1.08] tracking-tight sm:text-[38px]">
            Ton avenir commence ici
            <span className="block text-[var(--sarcelle)]">{espaceNom}</span>
          </h2>
          <span
            aria-hidden
            className="mt-4 block h-1 w-16 rounded-full"
            style={{ background: "linear-gradient(90deg, #2B8C82, #FF7A4D)" }}
          />
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-[var(--texte-mute)]">
            Apprends, pose tes questions et avance avec des élèves qui visent le même objectif que toi.
          </p>
        </div>
      </div>

      <div className="relative flex gap-3 border-t border-[var(--ligne)] bg-white/70 px-6 py-4 sm:px-10">
        <div className="flex flex-1 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(43,140,130,0.12)] text-lg" aria-hidden>
            👥
          </span>
          <div>
            <div className="font-display text-lg font-extrabold">
              <CompteurAnime valeur={nbMembres} />
            </div>
            <div className="text-[11.5px] text-[var(--texte-mute)]">membre{nbMembres !== 1 ? "s" : ""}</div>
          </div>
        </div>
        <div className="flex flex-1 items-center gap-3 border-l border-[var(--ligne)] pl-3 sm:pl-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(255,122,77,0.14)] text-lg" aria-hidden>
            🎓
          </span>
          <div>
            <div className="font-display text-lg font-extrabold">
              <CompteurAnime valeur={nbEleves} />
            </div>
            <div className="text-[11.5px] text-[var(--texte-mute)]">élève{nbEleves !== 1 ? "s" : ""}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
