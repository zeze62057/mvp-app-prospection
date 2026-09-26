"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { CompteurAnime } from "@/components/progression/CompteurAnime";

// Bandeau d'accueil de la communaute (gratuite et payante) : texte a gauche, photo de Zeze a droite,
// puces flottantes, stats reelles en bas. Le bouton "Inviter" copie le lien de la vitrine.
// Les animations sont dans globals.css et s'arretent pour qui a demande moins d'animations.
const PUCES = [
  { titre: "Apprendre", detail: "pas à pas", icone: "M12 3 2 8l10 5 8-4v6h2V8L12 3zm-6 9v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4l-6 3-6-3z" },
  { titre: "Échanger", detail: "entre élèves", icone: "M4 4h16v11H8l-4 4V4zm4 4v2h8V8H8z" },
  { titre: "Booster", detail: "tes projets", icone: "M12 2c3 2 5 5 5 9l2 3-3 1-1 3h-6l-1-3-3-1 2-3c0-4 2-7 5-9zm0 5a2 2 0 100 4 2 2 0 000-4z" },
];

export function BandeauCommunaute({
  espaceNom,
  espaceSlug,
  tagline,
  nbMembres,
  nbEleves,
}: {
  espaceNom: string;
  espaceSlug: string;
  tagline: string;
  nbMembres: number;
  nbEleves: number;
}) {
  const [copie, setCopie] = useState(false);
  // Chemin relatif seulement : window n'existe pas au rendu serveur (ecart d'hydratation sinon).
  const cheminVitrine = `/${espaceSlug}`;

  async function copierLien() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${cheminVitrine}`);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers indisponible : le lien vitrine ci-dessous reste cliquable.
    }
  }

  return (
    <section
      className="anim-entree relative overflow-hidden rounded-3xl border border-[var(--ligne)]"
      style={{
        background:
          "radial-gradient(circle at 0% 0%, rgba(95,199,184,0.22), transparent 45%), radial-gradient(circle at 60% 100%, rgba(255,122,77,0.10), transparent 40%), linear-gradient(135deg, #ffffff, #F2F7F5)",
      }}
    >
      <div className="grid md:grid-cols-[1.15fr_0.85fr]">
        {/* Photo : en haut sur mobile, a droite sur ordinateur (order pour garder le texte en premier dans le code) */}
        <div className="relative order-first h-60 md:order-last md:h-auto md:min-h-[340px]">
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

        <div className="relative flex flex-col justify-center px-6 py-7 sm:px-9 sm:py-9">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--ligne)] bg-white px-3 py-1.5 text-[11px] font-bold text-[var(--texte)]">
            <span className="anim-lueur h-2 w-2 rounded-full bg-[var(--corail)]" aria-hidden />
            La communauté qui fait grandir tes idées
          </span>
          <h2 className="font-display text-[28px] font-extrabold leading-[1.1] tracking-tight sm:text-[34px]">
            Rejoins la communauté
            <span className="block text-[var(--sarcelle)]">{espaceNom}</span>
          </h2>
          <p className="mt-3.5 max-w-md text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
            {tagline || `Communauté ${espaceNom}`}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copierLien}
              className="rounded-full bg-[var(--corail)] px-6 py-3 text-[13px] font-extrabold text-[var(--encre)] shadow-[0_8px_20px_rgba(255,122,77,0.35)] transition-transform hover:-translate-y-0.5"
            >
              {copie ? "Lien copié !" : "Inviter →"}
            </button>
            <Link
              href={cheminVitrine}
              target="_blank"
              className="truncate font-mono text-[11.5px] font-bold text-[var(--sarcelle)] hover:underline"
            >
              {cheminVitrine}
            </Link>
          </div>
        </div>
      </div>

      <div className="flex gap-3 border-t border-[var(--ligne)] bg-white/70 px-6 py-4 sm:px-9">
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
