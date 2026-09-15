"use client";

import { useActionState, useEffect } from "react";
import { initierPaiement } from "@/app/(membre)/[espace]/tunnel/actions";

const etatInitial = { erreur: null, checkoutUrl: null };

export function BoutonPayer({ espaceSlug, montant, devise }: { espaceSlug: string; montant: number; devise: string }) {
  const [etat, action] = useActionState(initierPaiement, etatInitial);

  useEffect(() => {
    if (etat.checkoutUrl) window.location.href = etat.checkoutUrl;
  }, [etat.checkoutUrl]);

  return (
    <form action={action}>
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <button
        type="submit"
        className="w-full rounded-[11px] bg-[var(--encre)] py-4 text-[14.5px] font-extrabold text-[var(--sur-encre)] transition-transform hover:-translate-y-0.5"
      >
        Payer {montant.toLocaleString("fr-FR")} {devise}
      </button>
      {etat.erreur && <p className="mt-3 text-sm text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
