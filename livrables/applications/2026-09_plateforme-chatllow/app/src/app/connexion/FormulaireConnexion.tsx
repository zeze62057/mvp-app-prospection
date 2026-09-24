"use client";

import { useActionState, useState } from "react";
import { connexion, type EtatConnexion } from "./actions";

const etatInitial: EtatConnexion = { erreur: null };

const CHAMP =
  "w-full rounded-xl border border-[rgba(255,255,255,0.16)] bg-[rgba(255,255,255,0.05)] px-4 py-3 text-[14px] text-white placeholder:text-[rgba(255,255,255,0.4)] focus:border-[var(--indigo)] focus:outline-none";

export function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(connexion, etatInitial);
  const [voir, setVoir] = useState(false);

  return (
    <form action={action} className="mt-7 flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[13px] font-semibold">
          Adresse e-mail
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" placeholder="vous@entreprise.com" className={CHAMP} />
      </div>
      <div>
        <label htmlFor="mot_de_passe" className="mb-1.5 block text-[13px] font-semibold">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="mot_de_passe"
            name="mot_de_passe"
            type={voir ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            className={`${CHAMP} pr-20`}
          />
          <button
            type="button"
            onClick={() => setVoir((v) => !v)}
            aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[11.5px] font-semibold text-[rgba(255,255,255,0.6)]"
          >
            {voir ? "Masquer" : "Afficher"}
          </button>
        </div>
      </div>
      {etat.erreur && (
        <p role="alert" className="rounded-lg bg-[rgba(255,107,107,0.14)] px-3.5 py-2.5 text-[13px] font-semibold text-[#ff9b9b]">
          {etat.erreur}
        </p>
      )}
      <button
        type="submit"
        disabled={enCours}
        className="mt-1 rounded-full bg-[var(--indigo)] px-6 py-3.5 text-[14.5px] font-semibold text-[#0b1020] transition-opacity disabled:opacity-60"
      >
        {enCours ? "Connexion…" : "Se connecter →"}
      </button>
    </form>
  );
}
