"use client";

import { useActionState } from "react";
import { modifierInfosProfil } from "@/app/(membre)/[espace]/profil/actions";

type Valeurs = { bio: string; ville: string; lien: string };
const etatInitial = { erreur: null as string | null, succes: false, valeurs: undefined as Valeurs | undefined };

const champ =
  "w-full rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2 text-[13px] text-[var(--texte)]";

// Bio, ville et lien : facultatifs, visibles des membres de l'espace.
export function FormulaireInfosProfil({
  espaceSlug,
  bio,
  ville,
  lien,
}: {
  espaceSlug: string;
  bio: string;
  ville: string;
  lien: string;
}) {
  const [etat, action, enCours] = useActionState(modifierInfosProfil, etatInitial);
  // Apres une action, React remet chaque champ a sa valeur par defaut : on y met la derniere saisie.
  const v = etat.valeurs ?? { bio, ville, lien };

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-5"
    >
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <div>
        <p className="font-display text-[15px] font-bold">À propos de toi</p>
        <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">
          Facultatif. Visible des membres de tes communautés, jamais de l&apos;extérieur.
        </p>
      </div>

      <label className="flex flex-col gap-1.5 text-[12.5px] font-bold">
        Bio
        <textarea
          name="bio"
          defaultValue={v.bio}
          rows={3}
          maxLength={300}
          placeholder="Qui es-tu, ce que tu construis, ce que tu cherches ici (300 caractères)"
          className={`${champ} resize-y font-normal`}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-[12.5px] font-bold">
        Ville
        <input name="ville" defaultValue={v.ville} maxLength={80} placeholder="Conakry" className={`${champ} font-normal`} />
      </label>

      <label className="flex flex-col gap-1.5 text-[12.5px] font-bold">
        Lien (site, LinkedIn, chaîne YouTube...)
        <input
          name="lien"
          defaultValue={v.lien}
          maxLength={200}
          inputMode="url"
          autoCapitalize="none"
          placeholder="exemple.com/moi"
          className={`${champ} font-normal`}
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={enCours}
          className="rounded-[9px] bg-[var(--sarcelle)] px-4 py-2 text-[12.5px] font-bold text-white disabled:opacity-60"
        >
          {enCours ? "Enregistrement..." : "Enregistrer"}
        </button>
        {etat.succes && <p className="text-[13px] text-[var(--sarcelle)]">Enregistré.</p>}
        {etat.erreur && <p className="text-[13px] text-[var(--corail)]">{etat.erreur}</p>}
      </div>
    </form>
  );
}
