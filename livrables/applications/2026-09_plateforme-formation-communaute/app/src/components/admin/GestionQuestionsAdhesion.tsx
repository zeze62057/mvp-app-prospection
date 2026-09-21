"use client";

import { useActionState } from "react";
import { enregistrerQuestionsAdhesion } from "@/app/admin/actions";

const etatInitial = { erreur: null as string | null, succes: false, valeurs: undefined as string[] | undefined };

// Questions posees a qui demande a rejoindre la communaute gratuite de l'espace. Les reponses
// sont obligatoires et n'apparaissent que sous la demande, dans cette page.
export function GestionQuestionsAdhesion({
  espace,
  questions,
}: {
  espace: { id: string; nom: string };
  questions: string[]; // les 3 lignes, vides si la question n'existe pas
}) {
  const [etat, formAction] = useActionState(enregistrerQuestionsAdhesion.bind(null, espace.id), etatInitial);
  // Apres une action, React remet chaque champ a sa valeur par defaut : on y met la derniere saisie.
  const valeurs = etat.valeurs ?? questions;

  return (
    <li className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <p className="text-sm font-medium">{espace.nom}</p>
      <form action={formAction} className="mt-3 flex flex-col gap-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col gap-1">
            <label htmlFor={`question-${espace.id}-${n}`} className="text-xs text-[var(--texte-mute)]">
              Question {n} (vide = aucune)
            </label>
            <input
              id={`question-${espace.id}-${n}`}
              name={`question_${n}`}
              defaultValue={valeurs[n - 1] ?? ""}
              maxLength={200}
              placeholder={n === 1 ? "Que fais-tu comme activité ?" : ""}
              className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
            />
          </div>
        ))}
        <p className="text-xs text-[var(--texte-mute)]">
          Toutes les questions sont obligatoires pour le demandeur. Retirer une question supprime aussi les
          réponses déjà reçues à cette question.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
          >
            Enregistrer les questions
          </button>
          {etat.succes && <span className="text-xs text-[var(--sarcelle)]">Questions enregistrées.</span>}
          {etat.erreur && <span className="text-xs text-[var(--corail)]">{etat.erreur}</span>}
        </div>
      </form>
    </li>
  );
}
