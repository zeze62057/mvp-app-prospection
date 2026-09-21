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

// Messages de la fonction demander_adhesion (fichier SQL en ASCII) traduits avec leurs accents.
const MESSAGES_ADHESION: Record<string, string> = {
  "Reponds a toutes les questions.": "Réponds à toutes les questions.",
  "Une reponse est trop longue (500 caracteres maximum).": "Une réponse est trop longue (500 caractères maximum).",
  "Demande deja envoyee.": "Ta demande a déjà été envoyée.",
  "Espace introuvable.": "Espace introuvable.",
  "Non connecte.": "Non connecté.",
};

// Demande d'acces a la communaute gratuite. Elle passe par la fonction de la base, qui impose une
// reponse a chaque question de l'espace (migration 0037) et ecrit demande et reponses ensemble.
// Les reponses saisies sont renvoyees : React 19 vide le formulaire apres chaque action.
export async function demanderAdhesion(
  _etat: EtatAction & { reponses?: Record<string, string> },
  formData: FormData
): Promise<EtatAction & { reponses?: Record<string, string> }> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecté." };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable." };

  // Les questions viennent de la base, jamais du formulaire : on ne lit que les champs qui leur
  // correspondent.
  const { data: questions } = await supabase.from("questions_adhesion").select("id").eq("espace_id", espace.id);
  const reponses: Record<string, string> = {};
  (questions ?? []).forEach((q) => {
    reponses[q.id as string] = String(formData.get(`reponse_${q.id}`) ?? "");
  });

  const { error } = await supabase.rpc("demander_adhesion", { p_espace: espace.id, p_reponses: reponses });
  if (error) {
    return { erreur: MESSAGES_ADHESION[error.message] ?? "La demande a échoué, réessaie.", reponses };
  }

  revalidatePath(`/${espaceSlug}/communaute`);
  return { erreur: null };
}

// La creation de post (avec titre, categorie et image) passe par /api/posts, et les
// likes par post/actions.ts : ces anciennes actions n'existent plus.
