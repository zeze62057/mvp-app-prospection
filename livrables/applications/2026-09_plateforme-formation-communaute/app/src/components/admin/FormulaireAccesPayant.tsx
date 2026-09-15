"use client";

import { useActionState } from "react";
import { accorderAccesPayant } from "@/app/admin/actions";

const etatInitial = { erreur: null };

export function FormulaireAccesPayant({ espaces }: { espaces: { id: string; nom: string }[] }) {
  const [etat, action] = useActionState(accorderAccesPayant, etatInitial);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Email de l&apos;eleve</label>
        <input
          name="email"
          type="email"
          required
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Espace</label>
        <select name="espace_id" required className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm">
          {espaces.map((e) => (
            <option key={e.id} value={e.id}>{e.nom}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-[var(--corail)] px-4 py-2 text-xs font-bold text-[var(--encre)]"
      >
        Accorder l&apos;acces payant
      </button>
      {etat.erreur && <p className="w-full text-xs text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
