"use client";

import { supprimerPost } from "@/app/(membre)/[espace]/post/actions";

// Suppression de son propre post, avec confirmation : c'est definitif (commentaires et likes
// partent avec).
export function BoutonSupprimerPost({ espaceSlug, postId }: { espaceSlug: string; postId: string }) {
  return (
    <form
      action={supprimerPost.bind(null, espaceSlug, postId)}
      onSubmit={(e) => {
        if (!window.confirm("Supprimer ce post ? Ses commentaires et ses likes seront supprimés aussi.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-[11.5px] font-bold text-[var(--corail)] underline">
        Supprimer
      </button>
    </form>
  );
}
