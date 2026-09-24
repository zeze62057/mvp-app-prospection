"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-guard";
import { supprimerContenuModeration } from "@/lib/moderation-contenu";

// Gestion des membres depuis la page Eleves : retirer ou reintegrer un membre de la communaute
// gratuite, promouvoir ou retirer un admin. Chaque action verifie le role admin cote serveur, ecrit
// au journal des actions d'admin, et revient sur la page avec un message (?ok=... ou ?erreur=...).
// Le role admin ne se change que par ici (serveur) : les membres n'ont aucun droit d'ecriture sur
// profils.role (migration 0027).

function cheminValide(retour: string) {
  return retour.startsWith("/admin/eleves");
}

function revenir(retour: string, type: "ok" | "erreur", message: string): never {
  const cible = cheminValide(retour) ? retour : "/admin/eleves";
  const [chemin, requete = ""] = cible.split("?");
  const params = new URLSearchParams(requete);
  params.delete("ok");
  params.delete("erreur");
  params.set(type, message);
  revalidatePath("/admin/eleves");
  revalidatePath("/admin/administrateurs");
  redirect(`${chemin}?${params.toString()}`);
}

// Le journal est ecrit AVANT un changement de role : s'il echoue, rien n'est change.
async function journaliser(
  adminId: string,
  action: string,
  cibleId: string,
  detail: string,
  espaceId: string | null = null
): Promise<boolean> {
  const { error } = await createAdminClient().from("journal_admin").insert({
    admin_id: adminId,
    action,
    cible_type: "profil",
    cible_id: cibleId,
    espace_id: espaceId,
    detail: detail.slice(0, 500),
  });
  return !error;
}

const normaliser = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").trim().toLowerCase();

// ---- Communaute gratuite ---------------------------------------------------------------------

// Retirer = adhesion au statut "refuse" : le membre perd l'acces, l'historique reste, et il ne peut
// pas redemander seul (demander_adhesion refuse quand une ligne existe). Reversible par "Reintegrer".
// Ne touche jamais a un acces payant. Option : supprimer aussi ses contenus de la zone gratuite.
export async function retirerDeCommunaute(formData: FormData) {
  const adminId = await verifierAdmin();
  const retour = String(formData.get("retour") ?? "");
  const profilId = String(formData.get("profil_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const supprimerContenu = formData.get("supprimer_contenu") === "on";
  const admin = createAdminClient();

  const { data: adhesion } = await admin
    .from("adhesions")
    .select("id, statut")
    .eq("profil_id", profilId)
    .eq("espace_id", espaceId)
    .maybeSingle();
  if (!adhesion || adhesion.statut !== "approuve") revenir(retour, "erreur", "Ce membre n'est pas dans cette communauté.");

  const { data: profil } = await admin.from("profils").select("pseudo").eq("id", profilId).maybeSingle();
  const { error } = await admin
    .from("adhesions")
    .update({ statut: "refuse", traite_at: new Date().toISOString() })
    .eq("id", adhesion.id);
  if (error) revenir(retour, "erreur", "Retrait impossible.");

  let nbSupprimes = 0;
  if (supprimerContenu) {
    const { data: posts } = await admin
      .from("posts")
      .select("id")
      .eq("auteur_id", profilId)
      .eq("espace_id", espaceId)
      .eq("zone", "gratuite");
    for (const p of posts ?? []) {
      const r = await supprimerContenuModeration(admin, adminId, "post", p.id as string, { journaliser: false });
      if (r.ok) nbSupprimes += 1;
    }
    const { data: coms } = await admin
      .from("commentaires")
      .select("id, posts!inner(espace_id, zone)")
      .eq("auteur_id", profilId)
      .eq("posts.espace_id", espaceId)
      .eq("posts.zone", "gratuite");
    for (const c of coms ?? []) {
      const r = await supprimerContenuModeration(admin, adminId, "commentaire", c.id as string, { journaliser: false });
      if (r.ok) nbSupprimes += 1;
    }
  }

  await journaliser(
    adminId,
    "retirer_membre_communaute",
    profilId,
    `${profil?.pseudo ?? "Membre"} retiré de la communauté gratuite${supprimerContenu ? ` (${nbSupprimes} contenu(s) supprimé(s))` : ""}`,
    espaceId
  );
  revenir(retour, "ok", `${profil?.pseudo ?? "Membre"} a été retiré de la communauté gratuite.`);
}

export async function reintegrerDansCommunaute(formData: FormData) {
  const adminId = await verifierAdmin();
  const retour = String(formData.get("retour") ?? "");
  const profilId = String(formData.get("profil_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const admin = createAdminClient();

  const { data: adhesion } = await admin
    .from("adhesions")
    .select("id, statut")
    .eq("profil_id", profilId)
    .eq("espace_id", espaceId)
    .maybeSingle();
  if (!adhesion || adhesion.statut !== "refuse") revenir(retour, "erreur", "Ce membre n'est pas retiré de cette communauté.");

  const { data: profil } = await admin.from("profils").select("pseudo").eq("id", profilId).maybeSingle();
  const { error } = await admin
    .from("adhesions")
    .update({ statut: "approuve", traite_at: new Date().toISOString() })
    .eq("id", adhesion.id);
  if (error) revenir(retour, "erreur", "Réintégration impossible.");

  await journaliser(adminId, "reintegrer_membre_communaute", profilId, `${profil?.pseudo ?? "Membre"} réintégré dans la communauté gratuite`, espaceId);
  revenir(retour, "ok", `${profil?.pseudo ?? "Membre"} a été réintégré.`);
}

// ---- Role admin ------------------------------------------------------------------------------

async function changerRole(formData: FormData, nouveauRole: "admin" | "membre") {
  const adminId = await verifierAdmin();
  const retour = String(formData.get("retour") ?? "");
  const profilId = String(formData.get("profil_id") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");
  const admin = createAdminClient();

  const { data: cible } = await admin.from("profils").select("id, pseudo, role").eq("id", profilId).maybeSingle();
  if (!cible) revenir(retour, "erreur", "Membre introuvable.");
  // Un admin ne change pas son propre role : evite de se verrouiller dehors par erreur.
  if (cible.id === adminId) revenir(retour, "erreur", "Tu ne peux pas changer ton propre rôle.");
  if (cible.role === nouveauRole) revenir(retour, "erreur", `${cible.pseudo} a déjà ce rôle.`);
  if (normaliser(confirmation) !== normaliser(String(cible.pseudo))) {
    revenir(retour, "erreur", "Confirmation incorrecte : tape exactement le pseudo du membre.");
  }
  if (nouveauRole === "membre") {
    const { count } = await admin.from("profils").select("*", { count: "exact", head: true }).eq("role", "admin").neq("id", cible.id);
    if ((count ?? 0) === 0) revenir(retour, "erreur", "Le dernier admin ne peut pas être retiré.");
  }

  const ecrit = await journaliser(
    adminId,
    nouveauRole === "admin" ? "promouvoir_admin" : "retirer_role_admin",
    cible.id as string,
    `${cible.pseudo} : rôle ${cible.role} vers ${nouveauRole}`
  );
  if (!ecrit) revenir(retour, "erreur", "Journal indisponible : action annulée.");

  const { error } = await admin.from("profils").update({ role: nouveauRole }).eq("id", cible.id);
  if (error) revenir(retour, "erreur", "Changement de rôle refusé par la base.");
  revenir(retour, "ok", nouveauRole === "admin" ? `${cible.pseudo} est maintenant admin.` : `${cible.pseudo} n'est plus admin.`);
}

export async function promouvoirAdmin(formData: FormData) {
  await changerRole(formData, "admin");
}

export async function retirerRoleAdmin(formData: FormData) {
  await changerRole(formData, "membre");
}
