"use client";

import { useActionState } from "react";
import { creerPost } from "@/app/(membre)/[espace]/communaute/actions";

const etatInitial = { erreur: null };

export function Composer({ espaceSlug }: { espaceSlug: string }) {
  const [etat, action] = useActionState(creerPost, etatInitial);

  return (
    <form
      action={action}
      className="mb-[18px] flex flex-col gap-2.5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
    >
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <textarea
        name="contenu"
        placeholder="Partage une victoire, pose une question..."
        required
        rows={3}
        className="resize-none rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]"
      />
      <div className="flex items-center justify-between">
        <select
          name="tag"
          defaultValue="victoire"
          className="rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wide text-[var(--texte-mute)]"
        >
          <option value="victoire">victoire</option>
          <option value="question">question</option>
          <option value="annonce">annonce</option>
        </select>
        <button
          type="submit"
          className="rounded-[9px] bg-[var(--encre)] px-4 py-2 text-[12.5px] font-bold text-[var(--sur-encre)]"
        >
          Publier
        </button>
      </div>
      {etat.erreur && <p className="text-sm text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
