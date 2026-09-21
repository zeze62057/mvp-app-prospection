"use client";

import { useActionState } from "react";
import { demanderAdhesion } from "@/app/(membre)/[espace]/communaute/actions";

type Etat = { erreur: string | null; reponses?: Record<string, string> };
const etatInitial: Etat = { erreur: null };

// Demande d'acces a la communaute gratuite : les questions de l'espace (s'il y en a), puis le bouton.
// Toutes les reponses sont obligatoires.
export function FormulaireDemandeAdhesion({
  espaceSlug,
  questions,
}: {
  espaceSlug: string;
  questions: { id: string; libelle: string }[];
}) {
  const [etat, action, enCours] = useActionState(demanderAdhesion, etatInitial);

  return (
    <form action={action} className="flex flex-col items-start gap-3">
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      {questions.length > 0 && (
        <p className="text-sm text-[var(--texte-mute)]">
          Avant de rejoindre, réponds à {questions.length > 1 ? "ces questions" : "cette question"} : l&apos;admin
          les lit pour valider ta demande.
        </p>
      )}
      {questions.map((q) => (
        <label key={q.id} className="flex w-full flex-col gap-1.5 text-[13px] font-bold">
          {q.libelle}
          <textarea
            name={`reponse_${q.id}`}
            defaultValue={etat.reponses?.[q.id] ?? ""}
            required
            rows={2}
            maxLength={500}
            className="w-full resize-y rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2 text-[13px] font-normal"
          />
        </label>
      ))}
      {etat.erreur && <p className="text-sm text-[var(--corail)]">{etat.erreur}</p>}
      <button
        type="submit"
        disabled={enCours}
        className="rounded-lg bg-[var(--sarcelle)] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {enCours ? "Envoi..." : "Rejoindre la communaute gratuite"}
      </button>
    </form>
  );
}
