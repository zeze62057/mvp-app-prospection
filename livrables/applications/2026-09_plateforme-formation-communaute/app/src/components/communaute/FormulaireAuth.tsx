"use client";

import { useActionState, useState } from "react";
import { inscription, connexion } from "@/app/(membre)/[espace]/communaute/actions";

const etatInitial = { erreur: null };

export function FormulaireAuth({ espaceSlug }: { espaceSlug: string }) {
  const [mode, setMode] = useState<"connexion" | "inscription">("inscription");
  const [etatInscription, actionInscription] = useActionState(inscription, etatInitial);
  const [etatConnexion, actionConnexion] = useActionState(connexion, etatInitial);

  const etat = mode === "inscription" ? etatInscription : etatConnexion;

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-8">
      <div className="mb-6 flex gap-2 font-mono text-xs uppercase tracking-wide">
        <button
          type="button"
          onClick={() => setMode("inscription")}
          className={mode === "inscription" ? "text-[var(--sarcelle)]" : "text-[var(--texte-mute)]"}
        >
          Creer un compte
        </button>
        <span className="text-[var(--texte-mute)]">/</span>
        <button
          type="button"
          onClick={() => setMode("connexion")}
          className={mode === "connexion" ? "text-[var(--sarcelle)]" : "text-[var(--texte-mute)]"}
        >
          Se connecter
        </button>
      </div>

      <form action={mode === "inscription" ? actionInscription : actionConnexion} className="flex flex-col gap-3">
        <input type="hidden" name="espace_slug" value={espaceSlug} />
        {mode === "inscription" && (
          <input
            name="pseudo"
            placeholder="Pseudo"
            required
            className="rounded-lg border border-[var(--ligne)] px-3 py-2 text-sm"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="rounded-lg border border-[var(--ligne)] px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="mot_de_passe"
          placeholder="Mot de passe"
          required
          minLength={6}
          className="rounded-lg border border-[var(--ligne)] px-3 py-2 text-sm"
        />
        {etat.erreur && <p className="text-sm text-[var(--corail)]">{etat.erreur}</p>}
        <button
          type="submit"
          className="mt-2 rounded-lg bg-[var(--encre)] px-4 py-2 text-sm font-medium text-[var(--sur-encre)]"
        >
          {mode === "inscription" ? "Creer mon compte" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
