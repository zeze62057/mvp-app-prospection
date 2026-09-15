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
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="espace_slug" value={espaceSlug} />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
            Prenom
          </label>
          <input
            name="prenom"
            required
            className="rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3 py-2.5 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
            Nom
          </label>
          <input
            name="nom"
            required
            className="rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
          Numero de telephone (Mobile Money)
        </label>
        <input
          name="telephone"
          type="tel"
          placeholder="6XX XX XX XX"
          required
          className="rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3 py-2.5 text-sm"
        />
      </div>

      <button
        type="submit"
        className="mt-1 w-full rounded-[11px] bg-[var(--encre)] py-4 text-[14.5px] font-extrabold text-[var(--sur-encre)] transition-transform hover:-translate-y-0.5"
      >
        Payer {montant.toLocaleString("fr-FR")} {devise}
      </button>
      {etat.erreur && <p className="text-sm text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
