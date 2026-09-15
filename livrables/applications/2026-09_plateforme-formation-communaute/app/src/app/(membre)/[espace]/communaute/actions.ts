"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";

type EtatAction = { erreur: string | null };

export async function inscription(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const email = String(formData.get("email") ?? "");
  const motDePasse = String(formData.get("mot_de_passe") ?? "");
  const pseudo = String(formData.get("pseudo") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password: motDePasse,
    options: { data: { pseudo } },
  });

  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/communaute`);
  return { erreur: null };
}

export async function connexion(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const email = String(formData.get("email") ?? "");
  const motDePasse = String(formData.get("mot_de_passe") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: motDePasse,
  });

  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/communaute`);
  return { erreur: null };
}

export async function deconnexion(espaceSlug: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(`/${espaceSlug}/communaute`);
}

export async function demanderAdhesion(
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
    .from("adhesions")
    .insert({ profil_id: userData.user.id, espace_id: espace.id });

  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/communaute`);
  return { erreur: null };
}

export async function creerPost(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const contenu = String(formData.get("contenu") ?? "").trim();
  const tag = String(formData.get("tag") ?? "victoire");
  if (!contenu) return { erreur: "Le post est vide." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecte." };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable." };

  const { error } = await supabase
    .from("posts")
    .insert({ espace_id: espace.id, auteur_id: userData.user.id, contenu, tag });

  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/communaute`);
  return { erreur: null };
}

export async function voter(espaceSlug: string, postId: string) {
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

  revalidatePath(`/${espaceSlug}/communaute`);
}
