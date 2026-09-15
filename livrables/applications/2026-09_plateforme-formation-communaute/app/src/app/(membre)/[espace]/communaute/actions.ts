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
  if (!contenu) return { erreur: "Le post est vide." };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecte." };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable." };

  const { error } = await supabase
    .from("posts")
    .insert({ espace_id: espace.id, auteur_id: userData.user.id, contenu });

  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/communaute`);
  return { erreur: null };
}
