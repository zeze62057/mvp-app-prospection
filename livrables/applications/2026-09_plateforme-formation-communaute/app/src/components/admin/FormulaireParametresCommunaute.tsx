"use client";

import { useActionState } from "react";
import { modifierParametresCommunaute } from "@/app/admin/actions";

const etatInitial = { erreur: null as string | null, succes: false };

export function FormulaireParametresCommunaute({
  espace,
  messageAccueil,
}: {
  espace: {
    id: string;
    nom: string;
    periode_activite_jours: number;
    afficher_compteur_public: boolean;
  };
  messageAccueil: string;
}) {
  const action = modifierParametresCommunaute.bind(null, espace.id);
  const [etat, formAction] = useActionState(action, etatInitial);

  return (
    <li className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <p className="text-sm font-medium">{espace.nom}</p>
      <form action={formAction} className="mt-3 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor={`periode-${espace.id}`}
            className="text-xs text-[var(--texte-mute)]"
          >
            Periode d&apos;activite (jours) : un membre est actif s&apos;il a poste ou vote sur cette periode
          </label>
          <input
            id={`periode-${espace.id}`}
            name="periode_activite_jours"
            type="number"
            min={1}
            max={365}
            step={1}
            defaultValue={espace.periode_activite_jours}
            required
            className="w-24 rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-[var(--texte-mute)]">
          <input
            name="afficher_compteur_public"
            type="checkbox"
            defaultChecked={espace.afficher_compteur_public}
          />
          Afficher le nombre de membres sur la vitrine publique
        </label>

        <div className="flex flex-col gap-1">
          <label
            htmlFor={`accueil-${espace.id}`}
            className="text-xs text-[var(--texte-mute)]"
          >
            Message d&apos;accueil et regles (visible des membres seulement, vide = aucun message)
          </label>
          <textarea
            id={`accueil-${espace.id}`}
            name="message_accueil"
            rows={5}
            maxLength={2000}
            defaultValue={messageAccueil}
            placeholder="Bienvenue dans la communaute. Voici les regles : ..."
            className="rounded-lg border border-[var(--ligne)] px-3 py-2 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
          >
            Enregistrer les reglages
          </button>
          {etat.succes && (
            <span className="text-xs text-[var(--sarcelle)]">Reglages enregistres.</span>
          )}
          {etat.erreur && <span className="text-xs text-[var(--corail)]">{etat.erreur}</span>}
        </div>
      </form>
    </li>
  );
}
