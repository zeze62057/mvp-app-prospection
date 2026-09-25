import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Garde des pages et actions d'administration Chatllow. Un compte est admin s'il a une ligne dans
// chatllow_admins (migration 0006), lue avec SA session : personne ne peut se l'ajouter depuis le navigateur.
// A appeler au debut de CHAQUE page et de CHAQUE action : un layout n'est pas rejoue a chaque navigation.
export async function verifierAdmin(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/connexion");
  const { data: admin } = await supabase.from("chatllow_admins").select("profil_id").maybeSingle();
  if (!admin) redirect("/espace-client");
  return data.user.id;
}
