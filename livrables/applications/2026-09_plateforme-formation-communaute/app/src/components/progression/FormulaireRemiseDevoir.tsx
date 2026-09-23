"use client";

import { useActionState } from "react";
import { soumettreDevoir } from "@/app/(membre)/[espace]/devoirs/actions";
import type { DevoirRemise } from "@/types/membre";

const etatInitial = { erreur: null, envoye: false };

export function FormulaireRemiseDevoir({
  espaceSlug,
  devoirId,
  remiseExistante,
}: {
  espaceSlug: string;
  devoirId: string;
  remiseExistante: DevoirRemise | null;
}) {
  const [etat, action] = useActionState(soumettreDevoir, etatInitial);

  return (
    <form action={action} className="flex flex-col gap-3 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <input type="hidden" name="devoir_id" value={devoirId} />
      <label className="text-xs font-bold text-[var(--texte-mute)]">Ta réponse</label>
      <textarea
        name="texte"
        rows={5}
        defaultValue={remiseExistante?.texte ?? ""}
        placeholder="Écris ta réponse ici..."
        className="resize-y rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]"
      />
      <label className="text-xs font-bold text-[var(--texte-mute)]">Ou un fichier (optionnel)</label>
      <input
        name="fichier"
        type="file"
        accept=".pdf,.doc,.docx,.zip,image/jpeg,image/png"
        className="text-[12.5px]"
      />
      {remiseExistante?.fichier_path && (
        <p className="text-[11px] text-[var(--texte-mute)]">Un fichier est déjà déposé, en ajouter un nouveau le remplace.</p>
      )}
      <button
        type="submit"
        className="self-start rounded-[9px] bg-[var(--corail)] px-5 py-2.5 text-[13px] font-extrabold text-[var(--encre)]"
      >
        {remiseExistante ? "Mettre à jour ma remise" : "Rendre le devoir"}
      </button>
      {etat.erreur && <p className="text-[12.5px] text-[var(--corail)]">{etat.erreur}</p>}
      {etat.envoye && <p className="text-[12.5px] text-[var(--sarcelle)]">Remise enregistrée.</p>}
    </form>
  );
}
