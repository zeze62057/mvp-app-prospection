"use client";

import { useActionState } from "react";
import { creerEspace } from "@/app/admin/actions";

const etatInitial = { erreur: null, succes: false };

export function FormulaireCreationEspace() {
  const [etat, action] = useActionState(creerEspace, etatInitial);

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Nom de la formation</label>
        <input
          name="nom"
          type="text"
          required
          placeholder="Batisseur Pro"
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Tagline</label>
        <input
          name="tagline"
          type="text"
          placeholder="Le marketing de reseau augmente par l'IA"
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-64"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Prix</label>
        <input
          name="prix"
          type="number"
          min={1}
          step={1}
          required
          className="w-28 rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Devise</label>
        <input
          name="devise"
          type="text"
          defaultValue="GNF"
          required
          className="w-20 rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-[var(--corail)] px-4 py-2 text-xs font-bold text-[var(--encre)]"
      >
        Creer la formation
      </button>
      {etat.erreur && <p className="w-full text-xs text-[var(--corail)]">{etat.erreur}</p>}
      {etat.succes && (
        <p className="w-full text-xs text-[var(--sarcelle)]">Formation creee avec succes.</p>
      )}
    </form>
  );
}
