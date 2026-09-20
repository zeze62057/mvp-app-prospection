"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { estErreurReseau, MESSAGE_RESEAU } from "@/lib/auth-erreurs";

type EtatAction = { erreur: string | null; succes: boolean };

// Un membre ne peut modifier que son pseudo et sa photo : role et points sont
// verrouilles par la migration 0027 (privilege de colonne), pas seulement ici.
export async function modifierPseudo(_etat: EtatAction, formData: FormData): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const pseudo = String(formData.get("pseudo") ?? "").trim();
  if (pseudo.length < 2 || pseudo.length > 30) {
    return { erreur: "Le pseudo doit faire entre 2 et 30 caractères.", succes: false };
  }

  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) {
    return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté.", succes: false };
  }

  const { error } = await supabase.from("profils").update({ pseudo }).eq("id", userData.user.id);
  if (error) return { erreur: error.message, succes: false };

  revalidatePath(`/${espaceSlug}`, "layout");
  return { erreur: null, succes: true };
}
