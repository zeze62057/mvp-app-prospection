"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type EtatConnexion = { erreur: string | null };

// Connexion a l'espace client. Message volontairement identique pour un mauvais mot de passe et un
// compte inconnu : on ne revele pas quelles adresses existent. L'acces a l'espace lui-meme est
// controle ensuite (ligne dans chatllow_clients), pas ici.
export async function connexion(_etat: EtatConnexion, formData: FormData): Promise<EtatConnexion> {
  const email = String(formData.get("email") ?? "").trim();
  const motDePasse = String(formData.get("mot_de_passe") ?? "");
  if (!email || !motDePasse) return { erreur: "Renseignez votre adresse e-mail et votre mot de passe." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: motDePasse });
  if (error) return { erreur: "Adresse e-mail ou mot de passe incorrect." };

  redirect("/espace-client");
}

export async function deconnexion() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
