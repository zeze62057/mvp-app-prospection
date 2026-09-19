"use client";

import { useActionState } from "react";
import { modifierPrixEspace } from "@/app/admin/actions";

const etatInitial = { erreur: null };

export function LignePrixEspace({
  espace,
}: {
  espace: { id: string; nom: string; prix: number; devise: string };
}) {
  const action = modifierPrixEspace.bind(null, espace.id);
  const [etat, formAction] = useActionState(action, etatInitial);

  return (
    <li className="flex flex-col gap-2 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{espace.nom}</p>
        <p className="text-xs text-[var(--texte-mute)]">
          Prix actuel : {espace.prix.toLocaleString("fr-FR")} {espace.devise}
        </p>
      </div>
      <form action={formAction} className="flex items-center gap-2">
        <input
          name="prix"
          type="number"
          min={1}
          step={1}
          defaultValue={espace.prix}
          required
          className="w-32 rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
        >
          Enregistrer
        </button>
      </form>
      {etat.erreur && <p className="text-xs text-[var(--corail)]">{etat.erreur}</p>}
    </li>
  );
}
