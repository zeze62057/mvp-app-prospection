"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";

type EtatAction = { erreur: string | null };

// Messages bruts de Supabase Auth (anglais) traduits pour l'eleve.
const MESSAGES_AUTH: Record<string, string> = {
  "Invalid login credentials": "Email ou mot de passe incorrect.",
  "User already registered": "Un compte existe déjà avec cet email.",
  "Password should be at least 6 characters": "Le mot de passe doit contenir au moins 6 caractères.",
  "Unable to validate email address: invalid format": "L'adresse email n'est pas valide.",
  "Email not confirmed": "Confirme d'abord ton adresse email (lien recu par courriel).",
};

function traduireErreurAuth(message: string): string {
  return MESSAGES_AUTH[message] ?? "Une erreur est survenue. Réessaie.";
}

export async function inscription(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const email = String(formData.get("email") ?? "");
  const motDePasse = String(formData.get("mot_de_passe") ?? "");
  const pseudo = String(formData.get("pseudo") ?? "");
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();
  const confirmation = String(formData.get("confirmation") ?? "");

  // Champs obligatoires verifies ici (le formulaire les exige aussi, mais le navigateur ne fait pas foi).
  if (!prenom || !nom) return { erreur: "Le prénom et le nom sont obligatoires." };
  const chiffres = telephone.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]+$/.test(telephone) || chiffres.length < 8 || chiffres.length > 15) {
    return { erreur: "Le numéro de téléphone n'est pas valide (8 à 15 chiffres, avec l'indicatif si possible)." };
  }
  if (motDePasse !== confirmation) return { erreur: "Les deux mots de passe ne sont pas identiques." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password: motDePasse,
    options: { data: { pseudo, prenom, nom, telephone } },
  });

  if (error) return { erreur: traduireErreurAuth(error.message) };

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

  if (error) return { erreur: traduireErreurAuth(error.message) };

  revalidatePath(`/${espaceSlug}/communaute`);
  return { erreur: null };
}

export async function deconnexion(espaceSlug: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(`/${espaceSlug}/communaute`);
}

// Envoie le lien de reinitialisation du mot de passe. Repond toujours pareil,
// que l'email existe ou non : ne jamais reveler quels comptes existent.
// Le lien pointe vers /auth/reinitialisation (route qui echange le code contre
// une session) puis renvoie vers la page de nouveau mot de passe de l'espace.
export async function demanderReinitialisation(
  _etat: EtatAction & { envoye?: boolean },
  formData: FormData
): Promise<EtatAction & { envoye?: boolean }> {
  const email = String(formData.get("email") ?? "").trim();
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  if (!email) return { erreur: "Indique ton email." };

  const entetes = await headers();
  const hote = entetes.get("x-forwarded-host") ?? entetes.get("host");
  const proto = entetes.get("x-forwarded-proto") ?? "http";
  const redirectTo = `${proto}://${hote}/auth/reinitialisation?next=/${espaceSlug}/reinitialisation`;

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) {
    console.error("reinitialisation: echec d'envoi de l'email", error);
    return { erreur: "L'envoi a échoué. Réessaie dans un instant." };
  }

  return { erreur: null, envoye: true };
}

// Nouveau mot de passe apres le clic sur le lien recu par email. La session de
// recuperation est deja en place (posee par /auth/reinitialisation).
export async function definirNouveauMotDePasse(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const motDePasse = String(formData.get("mot_de_passe") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (motDePasse.length < 6) {
    return { erreur: "Le mot de passe doit contenir au moins 6 caractères." };
  }
  if (motDePasse !== confirmation) {
    return { erreur: "Les deux mots de passe ne sont pas identiques." };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { erreur: "Le lien a expiré. Redemande un lien de réinitialisation." };
  }

  const { error } = await supabase.auth.updateUser({ password: motDePasse });
  if (error) {
    console.error("reinitialisation: echec updateUser", error);
    return { erreur: "Impossible d'enregistrer le nouveau mot de passe. Réessaie." };
  }

  redirect(`/${espaceSlug}/communaute`);
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
