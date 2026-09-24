// Verifie que l'utilisateur courant a le role admin. Partage entre les
// server actions de /admin et les route handlers admin (ex: upload video),
// qui ne peuvent pas importer une fonction depuis un fichier "use server".
import { createClient } from "@/lib/supabase/server";

export async function verifierAdmin(): Promise<string> {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Non connecte.");

  const { data: profil } = await supabase
    .from("profils")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profil?.role !== "admin") throw new Error("Reserve aux admins.");
  return userData.user.id;
}
