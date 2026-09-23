"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Carte communaute en haut de la sidebar : banniere, nom, stats, bouton
// inviter, lien vitrine epingle en bas. Le lien vitrine est aussi ce que
// le bouton "Inviter" copie dans le presse-papiers.
export function CarteCommunaute({
  espaceNom,
  espaceSlug,
  tagline,
  nbMembres,
  nbEleves,
  banniereUrl,
}: {
  espaceNom: string;
  espaceSlug: string;
  tagline: string;
  nbMembres: number;
  nbEleves: number;
  banniereUrl: string | null;
}) {
  const [copie, setCopie] = useState(false);
  // Chemin relatif seulement : window n'existe pas au rendu serveur, l'utiliser
  // ici causait un ecart d'hydratation (texte different serveur/client).
  const cheminVitrine = `/${espaceSlug}`;

  async function copierLien() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${cheminVitrine}`);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers indisponible (permissions navigateur) : le lien
      // epingle ci-dessous reste cliquable, ce n'est pas bloquant.
    }
  }

  return (
    <div className="overflow-hidden rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)]">
      {banniereUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL externe Storage, pas de domaine a whitelister pour un hero
        <img src={banniereUrl} alt="" className="h-40 w-full object-cover" />
      ) : (
        <div
          className="h-40 w-full"
          style={{ background: "linear-gradient(135deg, var(--encre), var(--sarcelle), var(--corail))" }}
        />
      )}
      <div className="p-[18px]">
        <div className="mb-2.5 flex items-center gap-2.5">
          <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border-2 border-[var(--fond-carte)] shadow-sm">
            <Image
              src="/zeze-bilivogui.jpg"
              alt="Zezé Bilivogui, expert agentic coding"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-[10.5px] leading-tight text-[var(--texte-mute)]">
            <b className="block text-[11.5px] text-[var(--texte)]">Zezé Bilivogui</b>
            Expert Agentic Coding
          </div>
        </div>
        <div className="font-display mb-1 text-[15px] font-bold">{espaceNom}</div>
        <p className="mb-3.5 text-[11.5px] text-[var(--texte-mute)]">
          {tagline || `Communauté ${espaceNom}`}
        </p>

        <div className="mb-3.5 flex gap-4 font-mono text-[11.5px] text-[var(--texte-mute)]">
          <span>
            👥 <b className="text-[var(--texte)]">{nbMembres}</b> membres
          </span>
          <span>
            🎓 <b className="text-[var(--texte)]">{nbEleves}</b> eleves
          </span>
        </div>

        <button
          type="button"
          onClick={copierLien}
          className="mb-3 w-full rounded-[9px] bg-[var(--corail)] px-4 py-2 text-[12.5px] font-extrabold text-[var(--encre)]"
        >
          {copie ? "Lien copie !" : "Inviter"}
        </button>

        <Link
          href={cheminVitrine}
          target="_blank"
          className="block truncate font-mono text-[11px] font-bold text-[var(--sarcelle)] hover:underline"
        >
          {cheminVitrine}
        </Link>
      </div>
    </div>
  );
}
