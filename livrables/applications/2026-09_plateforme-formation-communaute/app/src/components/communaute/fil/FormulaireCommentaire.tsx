"use client";

import { useActionState, useEffect, useRef } from "react";
import { ajouterCommentaire } from "@/app/(membre)/[espace]/post/actions";

const etatInitial = { erreur: null as string | null };

export function FormulaireCommentaire({ postId, retour }: { postId: string; retour: string }) {
  const [etat, action, enCours] = useActionState(ajouterCommentaire, etatInitial);
  const formRef = useRef<HTMLFormElement>(null);

  // Vide le champ une fois le commentaire publie (pas en cas d'erreur).
  useEffect(() => {
    if (!enCours && etat.erreur === null) formRef.current?.reset();
  }, [enCours, etat]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-2">
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="retour" value={retour} />
      <textarea
        name="contenu"
        required
        rows={3}
        maxLength={2000}
        placeholder="Écris un commentaire..."
        className="resize-y rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]"
      />
      {etat.erreur && <p className="text-[13px] text-[var(--corail)]">{etat.erreur}</p>}
      <button
        type="submit"
        disabled={enCours}
        className="self-end rounded-[9px] bg-[var(--encre)] px-4 py-2 text-[12.5px] font-bold text-[var(--sur-encre)] disabled:opacity-60"
      >
        {enCours ? "Envoi..." : "Commenter"}
      </button>
    </form>
  );
}
