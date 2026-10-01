"use client";

import { useState } from "react";
import type { CategoriePrompt, Prompt } from "@/types/membre";

const LIBELLES: Record<CategoriePrompt, string> = {
  fondations: "Fondations",
  methode: "Méthode",
  quotidien: "Quotidien",
  business: "Business",
  n8n: "n8n",
  design_maquettes: "Maquettes et écrans",
  design_identite: "Logo et charte",
  design_site: "Site et page d'accueil",
  design_supports: "Supports et réseaux",
  design_ameliorer: "Améliorer et corriger",
  design_vers_code: "De la maquette au code",
  codex_migration: "Migrer vers Codex",
  chatgpt_ameliorer: "Améliorer avec ChatGPT et Codex",
  chatgpt_integrer: "Enrichir avec l'API OpenAI",
  chatgpt_securite: "Sécurité et coûts",
};

// Les catégories sont regroupées en familles : l'ordre ci-dessous est l'ordre d'affichage.
const FAMILLES: { cle: string; libelle: string; categories: CategoriePrompt[] }[] = [
  { cle: "cours", libelle: "Cours", categories: ["fondations", "methode", "quotidien", "business", "n8n"] },
  {
    cle: "design",
    libelle: "Claude Design",
    categories: ["design_maquettes", "design_identite", "design_site", "design_supports", "design_ameliorer", "design_vers_code"],
  },
  { cle: "codex", libelle: "Codex et ChatGPT", categories: ["codex_migration", "chatgpt_ameliorer", "chatgpt_integrer", "chatgpt_securite"] },
];

const puce = (actif: boolean) =>
  `rounded-full border px-4 py-2 font-mono text-[11.5px] ${
    actif
      ? "border-[var(--encre)] bg-[var(--encre)] text-[var(--sur-encre-mute)]"
      : "border-[var(--ligne)] text-[var(--texte-mute)]"
  }`;

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
      <div className="mb-2.5 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-[rgba(43,140,130,0.1)] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-[var(--sarcelle)]">
          {LIBELLES[prompt.categorie]}
        </span>
        {prompt.acces === "payante" && (
          <span className="rounded-md bg-[var(--encre)] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-wide text-[var(--sur-encre)]">
            Payant
          </span>
        )}
      </div>
      <p className="font-display mb-2 text-[14.5px] font-bold">{prompt.titre}</p>
      <div className="mb-3 flex-1 whitespace-pre-wrap rounded-lg border border-[var(--ligne)] bg-[var(--fond)] p-3 font-mono text-[10.5px] leading-relaxed text-[var(--texte-mute)]">
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
  const [famille, setFamille] = useState<string>("toutes");
  const [filtre, setFiltre] = useState<CategoriePrompt | "tous">("tous");

  const presentes = new Set(prompts.map((p) => p.categorie));
  // Seules les familles et les catégories qui ont au moins un prompt sont proposées.
  const famillesPresentes = FAMILLES.filter((f) => f.categories.some((c) => presentes.has(c)));
  const familleActive = famillesPresentes.find((f) => f.cle === famille);
  const categoriesProposees = (familleActive ? [familleActive] : famillesPresentes)
    .flatMap((f) => f.categories)
    .filter((c) => presentes.has(c));

  const promptsAffiches = prompts.filter(
    (p) =>
      (!familleActive || familleActive.categories.includes(p.categorie)) && (filtre === "tous" || p.categorie === filtre),
  );

  function choisirFamille(cle: string) {
    setFamille(cle);
    setFiltre("tous"); // la catégorie choisie avant peut ne pas appartenir à la nouvelle famille
  }

  return (
    <div>
      {famillesPresentes.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2.5" role="group" aria-label="Famille de prompts">
          <button type="button" onClick={() => choisirFamille("toutes")} className={puce(famille === "toutes")}>
            Toutes
          </button>
          {famillesPresentes.map((f) => (
            <button key={f.cle} type="button" onClick={() => choisirFamille(f.cle)} className={puce(famille === f.cle)}>
              {f.libelle}
            </button>
          ))}
        </div>
      )}

      <div className="mb-5 flex flex-wrap gap-2.5" role="group" aria-label="Catégorie de prompts">
        <button type="button" onClick={() => setFiltre("tous")} className={puce(filtre === "tous")}>
          Tous
        </button>
        {categoriesProposees.map((c) => (
          <button key={c} type="button" onClick={() => setFiltre(c)} className={puce(filtre === c)}>
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
