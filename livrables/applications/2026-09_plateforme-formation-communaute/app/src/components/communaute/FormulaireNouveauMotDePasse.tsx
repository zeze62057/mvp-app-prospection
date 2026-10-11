"use client";

import { useActionState } from "react";
import { definirNouveauMotDePasse } from "@/app/(membre)/[espace]/communaute/actions";

const etatInitial = { erreur: null };

// Formulaire du nouveau mot de passe, affiche apres le clic sur le lien de
// reinitialisation (session de recuperation deja en place).
export function FormulaireNouveauMotDePasse({ espaceSlug }: { espaceSlug: string }) {
  const [etat, action, enCours] = useActionState(definirNouveauMotDePasse, etatInitial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <div>
        <label htmlFor="nouveau-mdp" className="mb-1.5 block text-[13px] font-bold text-[var(--encre)]">
          Nouveau mot de passe
        </label>
        <input
          id="nouveau-mdp"
          type="password"
          name="mot_de_passe"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Au moins 6 caractères"
          className="w-full rounded-xl border border-[var(--ligne)] bg-[var(--fond)] px-4 py-3 text-[14px] text-[var(--encre)] focus:border-[var(--sarcelle)] focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="confirmer-mdp" className="mb-1.5 block text-[13px] font-bold text-[var(--encre)]">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmer-mdp"
          type="password"
          name="confirmation"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Répète ton mot de passe"
          className="w-full rounded-xl border border-[var(--ligne)] bg-[var(--fond)] px-4 py-3 text-[14px] text-[var(--encre)] focus:border-[var(--sarcelle)] focus:outline-none"
        />
      </div>
      {etat.erreur && (
        <p role="alert" className="rounded-lg bg-[rgba(255,122,77,0.14)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--corail-texte)]">
          {etat.erreur}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="rounded-xl bg-[var(--sarcelle)] px-4 py-3 text-[14px] font-bold text-white disabled:opacity-50"
      >
        {enCours ? "Enregistrement..." : "Enregistrer le nouveau mot de passe"}
      </button>
    </form>
  );
}
