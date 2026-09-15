"use client";

import { useActionState } from "react";
import { creerPostPayant } from "@/app/(membre)/[espace]/communaute-payante/actions";

const etatInitial = { erreur: null };

export function ComposerPayant({ espaceSlug }: { espaceSlug: string }) {
  const [etat, action] = useActionState(creerPostPayant, etatInitial);

  return (
    <form
      action={action}
      className="mb-[18px] flex flex-col gap-2.5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
    >
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <textarea
        name="contenu"
        placeholder="Partage ton exercice, une photo, une video..."
        required
        rows={3}
        className="resize-none rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]"
      />
      <div className="flex items-center justify-between gap-2">
        <input
          name="magnet_texte"
          placeholder="Lead magnet offert avec ce post (optionnel, ex: template offert)"
          className="flex-1 rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3 py-1.5 text-[11.5px]"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-[9px] bg-[var(--encre)] px-4 py-2 text-[12.5px] font-bold text-[var(--sur-encre)]"
        >
          Publier
        </button>
      </div>
      {etat.erreur && <p className="text-sm text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
