"use client";

import { useActionState } from "react";
import { demanderAdhesion } from "@/app/(membre)/[espace]/communaute/actions";

const etatInitial = { erreur: null };

export function BoutonDemanderAdhesion({ espaceSlug }: { espaceSlug: string }) {
  const [etat, action] = useActionState(demanderAdhesion, etatInitial);

  return (
    <form action={action} className="flex flex-col items-start gap-2">
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      {etat.erreur && <p className="text-sm text-[var(--corail)]">{etat.erreur}</p>}
      <button
        type="submit"
        className="rounded-lg bg-[var(--sarcelle)] px-5 py-2.5 text-sm font-medium text-white"
      >
        Rejoindre la communaute gratuite
      </button>
    </form>
  );
}
