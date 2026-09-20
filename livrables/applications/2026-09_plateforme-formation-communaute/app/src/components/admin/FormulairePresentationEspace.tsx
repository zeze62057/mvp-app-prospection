"use client";

import { useActionState } from "react";
import { modifierPresentationEspace } from "@/app/admin/actions";

type Valeurs = { video: string; description: string };
const etatInitial = {
  erreur: null as string | null,
  succes: false,
  valeurs: undefined as Valeurs | undefined,
};

// Page "A propos" d'un espace : video de presentation (YouTube) et texte, visibles des membres.
export function FormulairePresentationEspace({
  espace,
  video,
  description,
}: {
  espace: { id: string; nom: string; slug: string };
  video: string;
  description: string;
}) {
  const action = modifierPresentationEspace.bind(null, espace.id);
  const [etat, formAction] = useActionState(action, etatInitial);
  // Apres une action, React remet chaque champ a sa valeur par defaut : on y met la derniere saisie.
  const v = etat.valeurs ?? { video, description };

  return (
    <li className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <p className="text-sm font-medium">{espace.nom}</p>
      <form action={formAction} className="mt-3 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor={`video-${espace.id}`} className="text-xs text-[var(--texte-mute)]">
            Video de presentation (adresse YouTube, vide = aucune video)
          </label>
          <input
            id={`video-${espace.id}`}
            name="video"
            defaultValue={v.video}
            placeholder="https://youtu.be/..."
            autoCapitalize="none"
            className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={`presentation-${espace.id}`} className="text-xs text-[var(--texte-mute)]">
            Texte de presentation (visible des membres seulement, 4000 caracteres maximum)
          </label>
          <textarea
            id={`presentation-${espace.id}`}
            name="description"
            rows={6}
            maxLength={4000}
            defaultValue={v.description}
            placeholder="Qui est derriere cette communaute, ce que les membres y trouvent, pour qui elle est faite..."
            className="rounded-lg border border-[var(--ligne)] px-3 py-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
          >
            Enregistrer la page A propos
          </button>
          <a
            href={`/${espace.slug}/a-propos`}
            target="_blank"
            rel="noopener"
            className="text-xs text-[var(--texte-mute)] underline"
          >
            Voir la page
          </a>
          {etat.succes && <span className="text-xs text-[var(--sarcelle)]">Page enregistree.</span>}
          {etat.erreur && <span className="text-xs text-[var(--corail)]">{etat.erreur}</span>}
        </div>
      </form>
    </li>
  );
}
