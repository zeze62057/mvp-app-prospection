"use client";

import { supprimerContenuSignale, traiterSignalement } from "@/app/admin/actions";

// Actions d'un signalement : marquer traite, ou supprimer le contenu (posts et
// commentaires seulement, avec confirmation). Un message prive n'est jamais supprimable.
export function ActionsSignalement({
  signalementId,
  supprimable,
}: {
  signalementId: string;
  supprimable: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <form action={traiterSignalement.bind(null, signalementId)}>
        <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white">
          Marquer traité
        </button>
      </form>
      {supprimable && (
        <form
          action={supprimerContenuSignale.bind(null, signalementId)}
          onSubmit={(e) => {
            if (!window.confirm("Supprimer définitivement ce contenu ? Cette action est irréversible.")) {
              e.preventDefault();
            }
          }}
        >
          <button type="submit" className="rounded-lg border border-[var(--corail)] px-3 py-1.5 text-xs font-medium text-[var(--corail)]">
            Supprimer le contenu
          </button>
        </form>
      )}
    </div>
  );
}
