"use client";

import { useState } from "react";
import type { CategoriePrompt, Prompt } from "@/types/membre";

const LIBELLES: Record<CategoriePrompt, string> = {
  fondations: "Fondations",
  methode: "Méthode",
  quotidien: "Quotidien",
  business: "Business",
};

function CartePrompt({ prompt }: { prompt: Prompt }) {
  const [copie, setCopie] = useState(false);

  async function copier() {
    try {
      await navigator.clipboard.writeText(prompt.contenu);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      setCopie(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
      <span className="mb-2.5 self-start rounded-md bg-[rgba(43,140,130,0.1)] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-[var(--sarcelle)]">
        {LIBELLES[prompt.categorie]}
      </span>
      <p className="font-display mb-2 text-[14.5px] font-bold">{prompt.titre}</p>
      <div className="mb-3 flex-1 rounded-lg border border-[var(--ligne)] bg-[var(--fond)] p-3 font-mono text-[10.5px] leading-relaxed text-[var(--texte-mute)]">
        {prompt.contenu}
      </div>
      <button
        type="button"
        onClick={copier}
        className={`self-start rounded-lg px-3.5 py-2 text-[11.5px] font-bold text-[var(--sur-encre)] ${
          copie ? "bg-[var(--sarcelle)]" : "bg-[var(--encre)]"
        }`}
      >
        {copie ? "Copié ✓" : "Copier le prompt"}
      </button>
    </div>
  );
}

export function BibliothequePrompts({ prompts }: { prompts: Prompt[] }) {
  const [filtre, setFiltre] = useState<CategoriePrompt | "tous">("tous");

  const categoriesPresentes = Array.from(new Set(prompts.map((p) => p.categorie)));
  const promptsAffiches = filtre === "tous" ? prompts : prompts.filter((p) => p.categorie === filtre);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => setFiltre("tous")}
          className={`rounded-full border px-4 py-2 font-mono text-[11.5px] ${
            filtre === "tous"
              ? "border-[var(--encre)] bg-[var(--encre)] text-[var(--sur-encre-mute)]"
              : "border-[var(--ligne)] text-[var(--texte-mute)]"
          }`}
        >
          Tous
        </button>
        {categoriesPresentes.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFiltre(c)}
            className={`rounded-full border px-4 py-2 font-mono text-[11.5px] ${
              filtre === c
                ? "border-[var(--encre)] bg-[var(--encre)] text-[var(--sur-encre-mute)]"
                : "border-[var(--ligne)] text-[var(--texte-mute)]"
            }`}
          >
            {LIBELLES[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promptsAffiches.map((p) => (
          <CartePrompt key={p.id} prompt={p} />
        ))}
      </div>
      {promptsAffiches.length === 0 && (
        <p className="text-sm text-[var(--texte-mute)]">Aucun prompt dans cette catégorie.</p>
      )}
    </div>
  );
}
