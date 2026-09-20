// Liens temporaires des photos de profil (bucket prive "avatars", migration 0028).
// A appeler seulement avec des profils que le RLS vient de renvoyer a l'utilisateur.

import { createAdminClient } from "@/lib/supabase/admin";

const VALIDITE_S = 3600;

export async function urlsAvatars(
  profils: { id: string; avatar_path?: string | null }[]
): Promise<Map<string, string>> {
  const avecPhoto = profils.filter((p): p is { id: string; avatar_path: string } => !!p.avatar_path);
  const urls = new Map<string, string>();
  if (avecPhoto.length === 0) return urls;

  const { data } = await createAdminClient()
    .storage.from("avatars")
    .createSignedUrls(
      avecPhoto.map((p) => p.avatar_path),
      VALIDITE_S
    );
  const parChemin = new Map((data ?? []).map((s) => [s.path, s.signedUrl]));
  avecPhoto.forEach((p) => {
    const url = parChemin.get(p.avatar_path);
    if (url) urls.set(p.id, url);
  });
  return urls;
}
