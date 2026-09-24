// Suppression d'un post ou d'un commentaire par la moderation (admin). Une seule fonction pour
// tous les chemins : depuis la communaute, depuis /admin/moderation, depuis un signalement. Elle
// retire aussi les fichiers du stockage (image et fichier joint d'un post), marque traites les
// signalements portant sur ce contenu, et ecrit une ligne au journal des actions d'admin.
// Reserve au code serveur deja protege par une verification de role admin.

import type { SupabaseClient } from "@supabase/supabase-js";

export type TypeContenu = "post" | "commentaire";

export async function supprimerContenuModeration(
  admin: SupabaseClient,
  adminId: string,
  type: TypeContenu,
  id: string
): Promise<{ ok: boolean; message: string }> {
  let espaceId: string | null = null;
  let auteurId: string | null = null;
  let extrait = "";
  let detailPlus = "";

  if (type === "post") {
    const { data: post } = await admin.from("posts").select("*").eq("id", id).maybeSingle();
    if (!post) return { ok: false, message: "Ce post n'existe plus." };
    espaceId = post.espace_id as string;
    auteurId = post.auteur_id as string;
    extrait = String(post.titre ? `${post.titre} : ${post.contenu ?? ""}` : post.contenu ?? "");
    const { count } = await admin.from("commentaires").select("*", { count: "exact", head: true }).eq("post_id", id);
    detailPlus = ` (${count ?? 0} commentaire(s) supprimé(s) avec lui)`;

    const { error } = await admin.from("posts").delete().eq("id", id);
    if (error) return { ok: false, message: "Suppression impossible." };
    // Stockage : seulement apres la suppression reussie en base.
    if (post.image_path) await admin.storage.from("posts-images").remove([post.image_path as string]);
    if (post.fichier_path) await admin.storage.from("posts-fichiers").remove([post.fichier_path as string]);
  } else {
    const { data: com } = await admin.from("commentaires").select("id, contenu, auteur_id, posts(espace_id)").eq("id", id).maybeSingle();
    if (!com) return { ok: false, message: "Ce commentaire n'existe plus." };
    espaceId = (com.posts as unknown as { espace_id: string } | null)?.espace_id ?? null;
    auteurId = com.auteur_id as string;
    extrait = String(com.contenu ?? "");
    const { error } = await admin.from("commentaires").delete().eq("id", id);
    if (error) return { ok: false, message: "Suppression impossible." };
  }

  await admin
    .from("signalements")
    .update({ statut: "traite", traite_at: new Date().toISOString() })
    .eq("type", type)
    .eq("cible_id", id);

  const { data: auteur } = auteurId
    ? await admin.from("profils").select("pseudo").eq("id", auteurId).maybeSingle()
    : { data: null };
  // Le journal ne doit jamais empecher une suppression deja faite : son echec est seulement ignore.
  await admin.from("journal_admin").insert({
    admin_id: adminId,
    action: type === "post" ? "supprimer_post" : "supprimer_commentaire",
    cible_type: type,
    cible_id: id,
    espace_id: espaceId,
    detail: `Auteur ${auteur?.pseudo ?? "inconnu"} : ${extrait.replace(/\s+/g, " ").slice(0, 300)}${detailPlus}`.slice(0, 500),
  });

  return { ok: true, message: type === "post" ? "Post supprimé." : "Commentaire supprimé." };
}
