"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";

type EtatAction = { erreur: string | null };

// Publication et likes de la zone payante : voir /api/posts et post/actions.ts
// (un seul fil pour les deux zones).

export async function postulerExpert(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecte." };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable." };

  const { error } = await supabase
    .from("candidatures_expert")
    .insert({ profil_id: userData.user.id, espace_id: espace.id });

  if (error) {
    if (error.code === "23505") return { erreur: "Tu as deja postule pour ce statut." };
    return { erreur: error.message };
  }

  revalidatePath(`/${espaceSlug}/communaute-payante`);
  revalidatePath(`/${espaceSlug}/expert`);
  return { erreur: null };
}
