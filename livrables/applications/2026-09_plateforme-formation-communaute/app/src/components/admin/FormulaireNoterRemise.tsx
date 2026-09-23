"use client";

import { useActionState } from "react";
import { noterRemise } from "@/app/admin/actions";

const etatInitial = { erreur: null, succes: false };

export function FormulaireNoterRemise({ remiseId }: { remiseId: string }) {
  const [etat, action] = useActionState(noterRemise, etatInitial);

  return (
    <form action={action} className="mt-2 flex flex-wrap items-center gap-2">
      <input type="hidden" name="remise_id" value={remiseId} />
      <input
        name="note"
        type="number"
        min={0}
        max={20}
        required
        placeholder="/20"
        className="w-16 rounded-lg border border-[var(--ligne)] px-2 py-1 text-xs"
      />
      <input
        name="commentaire"
        type="text"
        placeholder="Commentaire (optionnel)"
        className="min-w-0 flex-1 rounded-lg border border-[var(--ligne)] px-2 py-1 text-xs"
      />
      <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-3 py-1 text-xs font-bold text-[var(--sur-encre)]">
        Noter
      </button>
      {etat.erreur && <p className="w-full text-xs text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
