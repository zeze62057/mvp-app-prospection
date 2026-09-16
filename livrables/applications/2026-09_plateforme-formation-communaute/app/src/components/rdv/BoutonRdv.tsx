"use client";

import { useActionState } from "react";
import { reserver, annuler } from "@/app/(membre)/[espace]/rdv/actions";

const etatInitial = { erreur: null };

export function BoutonReserver({ espaceSlug, creneauId }: { espaceSlug: string; creneauId: string }) {
  const action = reserver.bind(null, espaceSlug, creneauId);
  const [etat, formAction] = useActionState(action, etatInitial);

  return (
    <form action={formAction}>
      <button
        type="submit"
        className="rounded-lg bg-[var(--corail)] px-3.5 py-2 text-xs font-bold text-[var(--encre)]"
      >
        Reserver
      </button>
      {etat.erreur && <p className="mt-1 text-[11px] text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}

export function BoutonAnnuler({ espaceSlug, creneauId }: { espaceSlug: string; creneauId: string }) {
  const action = annuler.bind(null, espaceSlug, creneauId);
  const [etat, formAction] = useActionState(action, etatInitial);

  return (
    <form action={formAction}>
      <button
        type="submit"
        className="rounded-lg border border-[var(--ligne)] px-3.5 py-2 text-xs font-bold text-[var(--texte-mute)]"
      >
        Annuler
      </button>
      {etat.erreur && <p className="mt-1 text-[11px] text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
