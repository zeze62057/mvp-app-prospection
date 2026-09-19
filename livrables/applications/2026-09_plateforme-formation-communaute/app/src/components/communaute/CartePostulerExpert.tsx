"use client";

import { useActionState } from "react";
import { postulerExpert } from "@/app/(membre)/[espace]/communaute-payante/actions";

const etatInitial = { erreur: null };

export function CartePostulerExpert({
  espaceSlug,
  espaceNom,
}: {
  espaceSlug: string;
  espaceNom: string;
}) {
  const [etat, action] = useActionState(postulerExpert, etatInitial);

  return (
    <form
      action={action}
      className="mb-[18px] flex items-center justify-between gap-3 rounded-[14px] border border-dashed border-[var(--corail)] bg-[var(--fond-carte)] px-5 py-[18px]"
    >
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <div>
        <b className="font-display block text-sm">Deviens Expert {espaceNom}</b>
        <span className="text-xs text-[var(--texte-mute)]">
          Les membres les plus actifs peuvent etre invites a mentorer, animer un atelier, ou rejoindre l&apos;equipe.
        </span>
        {etat.erreur && <span className="mt-1 block text-xs text-[var(--corail)]">{etat.erreur}</span>}
      </div>
      <button
        type="submit"
        className="whitespace-nowrap rounded-[9px] bg-[var(--corail)] px-[18px] py-2.5 text-[12.5px] font-extrabold text-[var(--encre)]"
      >
        Postuler
      </button>
    </form>
  );
}
