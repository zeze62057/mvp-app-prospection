"use client";

import { useActionState } from "react";
import { creerCategoriePost, supprimerCategoriePost } from "@/app/admin/actions";

const etatInitial = { erreur: null as string | null, succes: false };

type Categorie = { id: string; libelle: string; emoji: string };

// Categories du fil d'un espace : liste avec suppression, plus un formulaire d'ajout.
export function GestionCategories({
  espace,
  categories,
}: {
  espace: { id: string; nom: string };
  categories: Categorie[];
}) {
  const [etat, action] = useActionState(creerCategoriePost, etatInitial);

  return (
    <li className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <p className="text-sm font-medium">{espace.nom}</p>

      <ul className="mt-3 flex flex-wrap gap-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-1.5 rounded-full border border-[var(--ligne)] bg-[var(--fond)] py-1 pl-3 pr-1.5 text-[12.5px] font-bold"
          >
            {c.emoji ? `${c.emoji} ` : ""}
            {c.libelle}
            <form action={supprimerCategoriePost.bind(null, c.id)}>
              <button
                type="submit"
                aria-label={`Supprimer la catégorie ${c.libelle}`}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[var(--texte-mute)] hover:bg-[var(--ligne)]"
              >
                ×
              </button>
            </form>
          </li>
        ))}
        {categories.length === 0 && (
          <li className="text-xs text-[var(--texte-mute)]">Aucune catégorie : le fil n&apos;a pas de pastilles.</li>
        )}
      </ul>

      <form action={action} className="mt-3 flex flex-wrap items-end gap-2">
        <input type="hidden" name="espace_id" value={espace.id} />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--texte-mute)]">Emoji</label>
          <input
            name="emoji"
            maxLength={8}
            placeholder="💡"
            className="w-16 rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-center text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--texte-mute)]">Nom de la catégorie</label>
          <input
            name="libelle"
            required
            maxLength={40}
            placeholder="Développement"
            className="w-48 rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
          />
        </div>
        <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-3 py-2 text-xs font-medium text-white">
          Ajouter
        </button>
        {etat.succes && <span className="text-xs text-[var(--sarcelle)]">Catégorie ajoutée.</span>}
        {etat.erreur && <span className="text-xs text-[var(--corail)]">{etat.erreur}</span>}
      </form>
    </li>
  );
}
