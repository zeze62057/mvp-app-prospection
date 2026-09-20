"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-guard";
import { estErreurReseau, MESSAGE_RESEAU } from "@/lib/auth-erreurs";

type EtatAction = { erreur: string | null };

// `retour` est le chemin de la page a rafraichir (fil gratuit, fil payant ou page
// du post). Il vient du serveur (les pages le fixent), jamais d'un champ libre.
function cheminValide(retour: string) {
  return retour.startsWith("/") && !retour.startsWith("//");
}

// Like : un clic ajoute le vote, un second le retire. Le like est le vote existant
// (post_votes) : ses points et son RLS ne changent pas.
export async function basculerLike(retour: string, postId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  const { data: voteExistant } = await supabase
    .from("post_votes")
    .select("id")
    .eq("post_id", postId)
    .eq("profil_id", userData.user.id)
    .maybeSingle();

  if (voteExistant) {
    await supabase.from("post_votes").delete().eq("id", voteExistant.id);
  } else {
    await supabase.from("post_votes").insert({ post_id: postId, profil_id: userData.user.id });
  }

  if (cheminValide(retour)) revalidatePath(retour);
}

// Epingler / desepingler : reserve a l'admin. Le trigger de la base refuse aussi
// tout epinglage qui ne vient pas du service_role.
export async function epinglerPost(retour: string, postId: string, epingle: boolean) {
  await verifierAdmin();
  await createAdminClient().from("posts").update({ epingle }).eq("id", postId);
  if (cheminValide(retour)) revalidatePath(retour);
}

export async function ajouterCommentaire(
  _etat: EtatAction,
  formData: FormData
): Promise<EtatAction> {
  const postId = String(formData.get("post_id") ?? "");
  const retour = String(formData.get("retour") ?? "");
  const contenu = String(formData.get("contenu") ?? "").trim();
  if (!contenu) return { erreur: "Le commentaire est vide." };
  if (contenu.length > 2000) return { erreur: "Le commentaire est limité à 2000 caractères." };

  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté." };

  const { error } = await supabase
    .from("commentaires")
    .insert({ post_id: postId, auteur_id: userData.user.id, contenu });
  if (error) return { erreur: error.message };

  if (cheminValide(retour)) revalidatePath(retour);
  return { erreur: null };
}

const MESSAGES_SIGNALEMENT: Record<string, string> = {
  "Tu as deja signale ce contenu.": "Tu as déjà signalé ce contenu.",
  "Tu ne peux pas signaler ton propre contenu.": "Tu ne peux pas signaler ton propre contenu.",
  "Precise le motif du signalement.": "Précise le motif du signalement (3 caractères minimum).",
  "Contenu introuvable.": "Ce contenu est introuvable ou tu n'y as pas accès.",
  "Type de signalement inconnu.": "Type de signalement inconnu.",
  "Non connecte.": "Non connecté.",
};

// Signalement d'un post, d'un commentaire ou d'un message recu (migration 0031). La
// fonction de la base lit elle-meme le contenu signale : le client n'envoie que le
// type, l'identifiant et le motif, donc aucun faux extrait n'est possible. Pour un
// message prive, l'admin ne voit que ce message, jamais la conversation.
export async function signaler(
  type: "post" | "commentaire" | "message",
  cibleId: string,
  motif: string
): Promise<{ erreur: string | null }> {
  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté." };

  const { error } = await supabase.rpc("signaler", {
    p_type: type,
    p_cible_id: cibleId,
    p_motif: motif.trim().slice(0, 500),
  });
  if (error) {
    // Les messages de la base sont en ASCII (fichier SQL) : on les traduit ici, avec leurs accents.
    return { erreur: MESSAGES_SIGNALEMENT[error.message] ?? "Le signalement a échoué, réessaie." };
  }
  return { erreur: null };
}

export async function supprimerCommentaire(retour: string, commentaireId: string) {
  const supabase = await createClient();
  // La policy ne laisse supprimer que ses propres commentaires.
  await supabase.from("commentaires").delete().eq("id", commentaireId);
  if (cheminValide(retour)) revalidatePath(retour);
}
