"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";

type EtatObjectif = { erreur: string | null };

export async function ajouterObjectif(_etat: EtatObjectif, formData: FormData): Promise<EtatObjectif> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const texte = String(formData.get("texte") ?? "").trim();
  if (!texte) return { erreur: "Écris un objectif." };
  if (texte.length > 200) return { erreur: "200 caractères maximum." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecté." };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable." };

  const { error } = await supabase.from("objectifs_eleve").insert({
    profil_id: userData.user.id,
    espace_id: espace.id,
    texte,
  });
  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/objectifs`);
  return { erreur: null };
}

export async function basculerObjectifAtteint(espaceSlug: string, objectifId: string, atteint: boolean) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase
    .from("objectifs_eleve")
    .update({ atteint })
    .eq("id", objectifId)
    .eq("profil_id", userData.user.id);

  revalidatePath(`/${espaceSlug}/objectifs`);
}

export async function supprimerObjectif(espaceSlug: string, objectifId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase.from("objectifs_eleve").delete().eq("id", objectifId).eq("profil_id", userData.user.id);

  revalidatePath(`/${espaceSlug}/objectifs`);
}
