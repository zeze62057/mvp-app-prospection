// Contexte commun a toutes les pages admin : qui est connecte, sa photo, et le nombre d'elements
// qui attendent son action. `cache` : le layout et la barre du haut le demandent dans la meme
// requete, les requetes ne partent qu'une fois. Renvoie null si l'utilisateur n'est pas admin.

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { urlsAvatars } from "@/lib/avatars";
import { getAttentes } from "@/lib/attentes-admin";

export const getContexteAdmin = cache(async () => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: profil } = await supabase
    .from("profils")
    .select("id, role, pseudo, avatar_path")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profil?.role !== "admin") return null;

  const [attentes, photos] = await Promise.all([getAttentes(createAdminClient()), urlsAvatars([profil])]);
  return {
    id: profil.id as string,
    pseudo: profil.pseudo as string,
    avatarUrl: photos.get(profil.id as string) ?? null,
    nbAttente: attentes.reduce((s, a) => s + a.n, 0),
  };
});
