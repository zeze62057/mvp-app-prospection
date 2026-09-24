"use client";

import { supprimerContenuAdmin } from "@/app/admin/moderation/actions";

// Suppression d'un post ou d'un commentaire par un admin (visible seulement pour un admin, la
// verification reelle est faite cote serveur). Confirmation obligatoire : c'est definitif.
export function BoutonSupprimerAdmin({
  retour,
  type,
  id,
  classe,
  libelle = "🗑 Supprimer (admin)",
}: {
  retour: string;
  type: "post" | "commentaire";
  id: string;
  classe?: string;
  libelle?: string;
}) {
  return (
    <form
      action={supprimerContenuAdmin.bind(null, retour, type, id)}
      onSubmit={(e) => {
        const message =
          type === "post"
            ? "Supprimer ce post en tant qu'admin ? Ses commentaires et ses likes seront supprimés aussi. Cette action est enregistrée dans le journal."
            : "Supprimer ce commentaire en tant qu'admin ? Cette action est enregistrée dans le journal.";
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <button type="submit" className={classe ?? "text-[var(--corail-texte)]"}>
        {libelle}
      </button>
    </form>
  );
}
