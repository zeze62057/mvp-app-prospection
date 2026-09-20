// Distingue une vraie deconnexion d'un incident reseau passager vers Supabase.
// Sans cela, une requete lente ou coupee (getUser renvoie alors "pas d'utilisateur")
// affichait "Non connecte" ou renvoyait un membre pourtant connecte vers la
// page de connexion.

export function estErreurReseau(error: { name?: string; status?: number; message?: string } | null | undefined) {
  if (!error) return false;
  return (
    error.name === "AuthRetryableFetchError" ||
    error.status === 0 ||
    /fetch failed|network|timeout|ECONNRESET|ETIMEDOUT/i.test(error.message ?? "")
  );
}

export const MESSAGE_RESEAU = "Connexion au serveur impossible, réessaie dans un instant.";
