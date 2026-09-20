"use client";

import { useActionState, useEffect, useRef } from "react";
import { envoyerMessage } from "@/app/(membre)/[espace]/messages/actions";

const etatInitial = { erreur: null as string | null };

export function FormulaireMessage({
  espaceSlug,
  destinataireId,
}: {
  espaceSlug: string;
  destinataireId: string;
}) {
  const [etat, action, enCours] = useActionState(envoyerMessage, etatInitial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!enCours && etat.erreur === null) formRef.current?.reset();
  }, [enCours, etat]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <input type="hidden" name="destinataire_id" value={destinataireId} />
      <div className="flex gap-2">
        <textarea
          name="contenu"
          required
          rows={2}
          maxLength={2000}
          placeholder="Écris un message..."
          className="min-w-0 flex-1 resize-none rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]"
        />
        <button
          type="submit"
          disabled={enCours}
          className="self-end rounded-[9px] bg-[var(--encre)] px-4 py-2.5 text-[12.5px] font-bold text-[var(--sur-encre)] disabled:opacity-60"
        >
          {enCours ? "..." : "Envoyer"}
        </button>
      </div>
      {etat.erreur && <p className="text-[13px] text-[var(--corail)]">{etat.erreur}</p>}
    </form>
  );
}
