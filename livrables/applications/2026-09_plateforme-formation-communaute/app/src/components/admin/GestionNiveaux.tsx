"use client";

import { useActionState } from "react";
import { enregistrerNiveaux, reinitialiserNiveaux } from "@/app/admin/actions";
import { NIVEAU_MAX, LIBELLE_MAX, NIVEAUX_PAR_DEFAUT, type NiveauConfig } from "@/lib/niveaux";

type Valeurs = Record<string, string>;
const etatInitial = { erreur: null as string | null, succes: false, valeurs: undefined as Valeurs | undefined };

// Niveaux d'un espace : un nom et les points requis pour chaque niveau. Un membre monte de niveau
// avec les likes recus. Un niveau peut ouvrir une masterclass (voir "Creer une masterclass").
export function GestionNiveaux({
  espace,
  niveaux,
  personnalise,
  niveauMasterclassMax,
}: {
  espace: { id: string; nom: string };
  niveaux: NiveauConfig[];
  personnalise: boolean;
  niveauMasterclassMax: number; // plus haut niveau exige par une masterclass de l'espace (1 s'il n'y en a pas)
}) {
  const [etat, formAction] = useActionState(enregistrerNiveaux.bind(null, espace.id), etatInitial);

  const valeurInitiale = (cle: string): string => {
    const [, champ, n] = cle.match(/^(libelle|points)_(\d)$/) ?? [];
    const ligne = niveaux.find((x) => x.niveau === Number(n));
    if (!ligne) return "";
    return champ === "libelle" ? ligne.libelle : String(ligne.points_requis);
  };
  // Apres une action, React remet chaque champ a sa valeur par defaut : on y met la derniere saisie.
  const valeur = (cle: string) => etat.valeurs?.[cle] ?? valeurInitiale(cle);

  // Les niveaux existants, plus deux lignes libres pour en ajouter.
  const nbLignes = Math.min(Math.max(niveaux.length, Number(etat.valeurs ? maxSaisi(etat.valeurs) : 0)) + 2, NIVEAU_MAX);

  return (
    <li className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium">{espace.nom}</p>
        <span className="text-xs text-[var(--texte-mute)]">
          {personnalise ? "Niveaux personnalisés" : "Niveaux par défaut (aucun réglage)"}
        </span>
      </div>

      <form action={formAction} className="mt-3 flex flex-col gap-2">
        <div className="grid grid-cols-[2.5rem_1fr_6.5rem] items-center gap-2 text-xs text-[var(--texte-mute)]">
          <span>Niveau</span>
          <span>Nom (vide = niveau inutilisé)</span>
          <span>Points requis</span>
        </div>
        {Array.from({ length: nbLignes }, (_, i) => i + 1).map((n) => (
          <div key={n} className="grid grid-cols-[2.5rem_1fr_6.5rem] items-center gap-2">
            <span className="font-mono text-sm font-bold">{n}</span>
            <input
              name={`libelle_${n}`}
              defaultValue={valeur(`libelle_${n}`)}
              maxLength={LIBELLE_MAX}
              aria-label={`Nom du niveau ${n}`}
              className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
            />
            <input
              name={`points_${n}`}
              defaultValue={valeur(`points_${n}`)}
              inputMode="numeric"
              aria-label={`Points requis pour le niveau ${n}`}
              readOnly={n === 1}
              className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm read-only:bg-[var(--fond)] read-only:text-[var(--texte-mute)]"
            />
          </div>
        ))}
        <p className="text-xs text-[var(--texte-mute)]">
          Le niveau 1 vaut toujours 0 point. Les points augmentent d&apos;un niveau à l&apos;autre. Un admin est
          toujours au niveau maximum.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
          >
            Enregistrer les niveaux
          </button>
          {etat.succes && <span className="text-xs text-[var(--sarcelle)]">Niveaux enregistrés.</span>}
          {etat.erreur && <span className="text-xs text-[var(--corail)]">{etat.erreur}</span>}
        </div>
      </form>

      {personnalise &&
        (niveauMasterclassMax <= NIVEAUX_PAR_DEFAUT.length ? (
          <form action={reinitialiserNiveaux.bind(null, espace.id)} className="mt-2">
            <button type="submit" className="text-xs text-[var(--texte-mute)] underline">
              Revenir aux niveaux par défaut
            </button>
          </form>
        ) : (
          <p className="mt-2 text-xs text-[var(--texte-mute)]">
            Retour aux niveaux par défaut impossible : une masterclass exige le niveau {niveauMasterclassMax}.
          </p>
        ))}
    </li>
  );
}

// Plus haut numero de niveau ayant un nom dans la derniere saisie (pour garder les lignes affichees).
function maxSaisi(valeurs: Valeurs): number {
  let max = 0;
  for (let n = 1; n <= NIVEAU_MAX; n++) {
    if ((valeurs[`libelle_${n}`] ?? "").trim() || (valeurs[`points_${n}`] ?? "").trim()) max = n;
  }
  return max;
}
