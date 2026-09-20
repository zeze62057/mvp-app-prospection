"use server";

import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";
import { estErreurReseau, MESSAGE_RESEAU } from "@/lib/auth-erreurs";
import { lireAnnuaire, type MembreAnnuaire } from "@/lib/annuaire";

// Page suivante ou nouvelle recherche de l'annuaire (migration 0032). La fonction de la
// base refuse un non-membre : ce controle n'est pas seulement ici.
export async function chargerMembres(
  espaceSlug: string,
  options: { q: string; filtre: string; tri: string; decalage: number }
): Promise<{ erreur: string | null; membres: MembreAnnuaire[]; total: number }> {
  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) {
    return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté.", membres: [], total: 0 };
  }
  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable.", membres: [], total: 0 };

  return lireAnnuaire(supabase, espace.id, options);
}
