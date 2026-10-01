"use client";

import { useRef, useState } from "react";

export type GenreBloc = "prompt" | "terminal" | "claude" | "texte";

const GENRES: Record<GenreBloc, { entete: string; icone: string; aide: string }> = {
  prompt: {
    entete: "Prompt prêt à l'emploi",
    icone: "✦",
    aide: "Copie ce prompt, colle-le dans Claude Code (ou ton assistant IA), puis regarde le résultat.",
  },
  terminal: {
    entete: "Commande à copier",
    icone: "⌨",
    aide: "Copie cette commande, colle-la dans ton terminal, puis appuie sur Entrée.",
  },
  claude: {
    entete: "Commande Claude Code",
    icone: "/",
    aide: "Copie cette commande, tape-la dans Claude Code, puis appuie sur Entrée.",
  },
  texte: {
    entete: "À copier",
    icone: "❐",
    aide: "Copie ce texte et colle-le là où le cours te le demande.",
  },
};

// Encadré d'un bloc de code de leçon : un prompt ou une commande à copier et coller tel quel.
// Le texte copié est celui qui est affiché (lu dans le bloc), pas une copie séparée.
export function PromptPret({ children, genre = "texte" }: { children: React.ReactNode; genre?: GenreBloc }) {
  const bloc = useRef<HTMLPreElement>(null);
  const [etat, setEtat] = useState<"repos" | "copie" | "echec">("repos");
  const { entete, icone, aide } = GENRES[genre];

  async function copier() {
    const texte = (bloc.current?.innerText ?? "").replace(/\n$/, "");
    try {
      await navigator.clipboard.writeText(texte);
      setEtat("copie");
    } catch {
      setEtat("echec");
    }
    setTimeout(() => setEtat("repos"), 2000);
  }

  return (
    <figure className="my-6 overflow-hidden rounded-2xl border border-[var(--sarcelle)]/40 bg-[var(--encre)] shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
      <figcaption className="flex items-center justify-between gap-3 bg-gradient-to-r from-[var(--sarcelle)] to-[var(--encre-2)] px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-[11px] font-extrabold uppercase tracking-wide text-[var(--sur-encre)]">
          <span aria-hidden="true">{icone}</span> {entete}
        </span>
        <button
          type="button"
          onClick={copier}
          aria-live="polite"
          className="rounded-lg bg-[var(--corail)] px-3 py-1 text-[11.5px] font-extrabold text-[var(--encre)] transition-opacity hover:opacity-90"
        >
          {etat === "copie" ? "Copié ✓" : etat === "echec" ? "Copie impossible" : "Copier"}
        </button>
      </figcaption>
      <pre
        ref={bloc}
        className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-[12.5px] leading-relaxed text-[var(--sur-encre)]"
      >
        {children}
      </pre>
      <p className="border-t border-[rgba(255,255,255,0.12)] px-4 py-2 text-[11.5px] text-[var(--sur-encre-mute)]">{aide}</p>
    </figure>
  );
}
