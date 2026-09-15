"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";

type EtatAction = { erreur: string | null };

export async function creerPostPayant(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const contenu = String(formData.get("contenu") ?? "").trim();
  const magnetTexte = String(formData.get("magnet_texte") ?? "").trim();
  if (!contenu) return { erreur: "Le post est vide." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecte." };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable." };

  const { error } = await supabase.from("posts").insert({
    espace_id: espace.id,
    auteur_id: userData.user.id,
    contenu,
    zone: "payante",
    magnet_texte: magnetTexte || null,
  });

  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/communaute-payante`);
  return { erreur: null };
}

export async function voterPayant(espaceSlug: string, postId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { data: voteExistant } = await supabase
    .from("post_votes")
    .select("id")
    .eq("post_id", postId)
    .eq("profil_id", userData.user.id)
    .maybeSingle();

  if (voteExistant) {
    await supabase.from("post_votes").delete().eq("id", voteExistant.id);
  } else {
    await supabase.from("post_votes").insert({ post_id: postId, profil_id: userData.user.id });
  }

  revalidatePath(`/${espaceSlug}/communaute-payante`);
}

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

  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/communaute-payante`);
  return { erreur: null };
}
