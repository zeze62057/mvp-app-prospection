"use client";

import { useActionState, useRef } from "react";
import { ajouterObjectif } from "@/app/(membre)/[espace]/objectifs/actions";

type EtatObjectif = { erreur: string | null };
const etatInitial: EtatObjectif = { erreur: null };

export function FormulaireObjectif({ espaceSlug }: { espaceSlug: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [etat, action] = useActionState(async (etat: EtatObjectif, formData: FormData) => {
    const resultat = await ajouterObjectif(etat, formData);
    if (!resultat.erreur) formRef.current?.reset();
    return resultat;
  }, etatInitial);

  return (
    <form ref={formRef} action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <input
        name="texte"
        type="text"
        required
        maxLength={200}
        placeholder="Ex : Terminer le module 2 avant la fin du mois"
        className="min-w-0 flex-1 rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]"
      />
      <button type="submit" className="rounded-[9px] bg-[var(--corail)] px-4 py-2.5 text-[12.5px] font-extrabold text-[var(--encre)]">
        Ajouter
      </button>
      {etat.erreur && <p className="w-full text-[12px] text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
