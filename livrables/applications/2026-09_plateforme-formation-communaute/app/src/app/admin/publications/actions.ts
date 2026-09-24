"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-guard";

// Approbation des publications (migration 0048). Chaque action verifie le role admin cote serveur.
// Le statut d'un post est fixe et protege par la base : seul le serveur (client admin) peut le changer.

function revenir(type: "ok" | "erreur", message: string): never {
  revalidatePath("/admin/publications");
  redirect(`/admin/publications?${type}=${encodeURIComponent(message)}`);
}

async function journaliser(adminId: string, action: string, cibleId: string | null, espaceId: string | null, detail: string) {
  // Le journal ne doit jamais empecher une decision deja prise : son echec est seulement ignore.
  await createAdminClient().from("journal_admin").insert({
    admin_id: adminId,
    action,
    cible_type: cibleId ? "post" : "espace",
    cible_id: cibleId,
    espace_id: espaceId,
    detail: detail.slice(0, 500),
  });
}

async function trancher(formData: FormData, decision: "publie" | "refuse") {
  const adminId = await verifierAdmin();
  const postId = String(formData.get("post_id") ?? "");
  const admin = createAdminClient();

  const { data: post } = await admin
    .from("posts")
    .select("id, espace_id, auteur_id, titre, contenu, statut")
    .eq("id", postId)
    .maybeSingle();
  if (!post) revenir("erreur", "Ce post n'existe plus.");
  if (post.statut !== "en_attente") revenir("erreur", "Ce post n'est plus en attente : une décision a déjà été prise.");

  const { error } = await admin
    .from("posts")
    .update({ statut: decision, traite_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("statut", "en_attente");
  if (error) revenir("erreur", "Décision impossible.");

  // Prevenir l'auteur. L'index unique impose une seule notification de decision par post : on remplace
  // l'ancienne (post approuve, modifie, puis refuse) pour que la derniere decision soit bien notifiee.
  await admin.from("notifications").delete().eq("post_id", postId).in("type", ["post_approuve", "post_refuse"]);
  await admin.from("notifications").insert({
    profil_id: post.auteur_id,
    acteur_id: adminId,
    espace_id: post.espace_id,
    type: decision === "publie" ? "post_approuve" : "post_refuse",
    post_id: postId,
  });

  const { data: auteur } = await admin.from("profils").select("pseudo").eq("id", post.auteur_id).maybeSingle();
  const extrait = String(post.titre ? `${post.titre} : ${post.contenu}` : post.contenu).replace(/\s+/g, " ").slice(0, 200);
  await journaliser(
    adminId,
    decision === "publie" ? "approuver_publication" : "refuser_publication",
    postId,
    post.espace_id as string,
    `Auteur ${auteur?.pseudo ?? "inconnu"} : ${extrait}`
  );
  revenir("ok", decision === "publie" ? "Post approuvé, il est publié." : "Post refusé, l'auteur est prévenu.");
}

export async function approuverPublication(formData: FormData) {
  await trancher(formData, "publie");
}

export async function refuserPublication(formData: FormData) {
  await trancher(formData, "refuse");
}

// Active ou desactive l'approbation pour un espace. Desactiver ne publie pas les posts deja en
// attente : ils restent a traiter dans la file.
export async function basculerApprobation(formData: FormData) {
  const adminId = await verifierAdmin();
  const espaceId = String(formData.get("espace_id") ?? "");
  const activer = String(formData.get("activer") ?? "") === "oui";
  const admin = createAdminClient();

  const { data: espace } = await admin.from("espaces").select("id, nom").eq("id", espaceId).maybeSingle();
  if (!espace) revenir("erreur", "Espace introuvable.");
  const { error } = await admin.from("espaces").update({ approuver_publications: activer }).eq("id", espaceId);
  if (error) revenir("erreur", "Réglage impossible.");

  await journaliser(adminId, activer ? "activer_approbation" : "desactiver_approbation", null, espaceId, `${espace.nom} : approbation des publications ${activer ? "activée" : "désactivée"}`);
  revenir("ok", `Approbation ${activer ? "activée" : "désactivée"} pour ${espace.nom}.`);
}
