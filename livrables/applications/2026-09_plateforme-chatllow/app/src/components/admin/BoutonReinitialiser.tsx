"use client";

import { useActionState } from "react";
import { reinitialiserMotDePasse, type EtatMotDePasse } from "@/app/admin/actions";

const initial: EtatMotDePasse = { erreur: null, motDePasse: null };

export function BoutonReinitialiser({ clientId, email }: { clientId: string; email: string }) {
  const [etat, action, enCours] = useActionState(reinitialiserMotDePasse.bind(null, clientId), initial);
  return (
    <div>
      <form action={action}>
        <button type="submit" disabled={enCours} className="rounded-full border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-semibold disabled:opacity-60">
          {enCours ? "Réinitialisation…" : "Réinitialiser le mot de passe"}
        </button>
      </form>
      {etat.erreur && <p role="alert" className="mt-2 text-[12px] font-semibold text-[#b53a3a]">{etat.erreur}</p>}
      {etat.motDePasse && (
        <p role="status" className="mt-2 rounded-lg bg-[var(--indigo-soft)] px-3.5 py-2 text-[12.5px]">
          Nouveau mot de passe pour {email} : <b className="font-[family-name:var(--font-mono)]">{etat.motDePasse}</b>
          <span className="block text-[var(--texte-mute)]">Affiché une seule fois. Transmettez-le par un canal privé.</span>
        </p>
      )}
    </div>
  );
}
