// Contexte commun des pages membres (profil, notifications, messages) : l'espace
// de l'URL, le client Supabase de l'utilisateur, et son profil. Un visiteur non
// connecte est renvoye vers la page de connexion de la communaute.

import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { estErreurReseau, MESSAGE_RESEAU } from "@/lib/auth-erreurs";

export async function contexteMembre(slug: string) {
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data, error: erreurAuth } = await supabase.auth.getUser();
  if (!data.user) {
    // Incident reseau : page d'erreur reessayable, pas un renvoi vers la connexion.
    if (estErreurReseau(erreurAuth)) throw new Error(MESSAGE_RESEAU);
    redirect(`/${espace.slug}/communaute`);
  }

  const { data: moi } = await supabase
    .from("profils")
    .select("id, pseudo, role, points, avatar_path, bio, ville, lien")
    .eq("id", data.user.id)
    .maybeSingle();

  // Membre de l'espace : communaute gratuite approuvee ou acces payant.
  const { data: estMembre, error: erreurMembre } = await supabase.rpc("est_membre_espace", {
    p_profil: data.user.id,
    p_espace: espace.id,
  });
  // Une erreur du controle n'est pas "pas membre" : on n'expulse personne sur un incident.
  if (erreurMembre) throw new Error(MESSAGE_RESEAU);

  return { supabase, espace, userId: data.user.id, moi, estMembre: estMembre === true };
}
