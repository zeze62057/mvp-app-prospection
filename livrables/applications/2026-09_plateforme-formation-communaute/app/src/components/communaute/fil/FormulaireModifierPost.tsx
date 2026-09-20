"use client";

import { useActionState } from "react";
import Link from "next/link";
import { modifierPost } from "@/app/(membre)/[espace]/post/actions";
import type { CategoriePost } from "@/types/membre";

type Valeurs = { titre: string; contenu: string; categorieId: string };
const etatInitial = { erreur: null as string | null, valeurs: undefined as Valeurs | undefined };

const champ =
  "w-full rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13.5px] text-[var(--texte)]";

// Modification d'un post : titre, texte et categorie. L'image reste celle du post d'origine.
export function FormulaireModifierPost({
  espaceSlug,
  postId,
  titre,
  contenu,
  categorieId,
  categories,
}: {
  espaceSlug: string;
  postId: string;
  titre: string;
  contenu: string;
  categorieId: string | null;
  categories: CategoriePost[];
}) {
  const [etat, action, enCours] = useActionState(modifierPost, etatInitial);
  // Apres une action, React remet chaque champ a sa valeur par defaut : on y met la derniere saisie.
  const v = etat.valeurs ?? { titre, contenu, categorieId: categorieId ?? "" };

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <input name="titre" defaultValue={v.titre} maxLength={150} placeholder="Titre (optionnel)" className={champ} />
      <textarea
        name="contenu"
        defaultValue={v.contenu}
        required
        rows={8}
        maxLength={5000}
        placeholder="Ton texte. Tape @pseudo pour mentionner un membre."
        className={`${champ} resize-y`}
      />
      {categories.length > 0 && (
        <select name="categorie_id" defaultValue={v.categorieId} className={champ} aria-label="Catégorie">
          <option value="">Sans catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji ? `${c.emoji} ` : ""}
              {c.libelle}
            </option>
          ))}
        </select>
      )}
      {etat.erreur && <p className="text-[13px] text-[var(--corail)]">{etat.erreur}</p>}
      <div className="flex items-center justify-end gap-4">
        <Link href={`/${espaceSlug}/post/${postId}`} className="text-[12.5px] text-[var(--texte-mute)] underline">
          Annuler
        </Link>
        <button
          type="submit"
          disabled={enCours}
          className="rounded-[9px] bg-[var(--encre)] px-4 py-2 text-[12.5px] font-bold text-[var(--sur-encre)] disabled:opacity-60"
        >
          {enCours ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
