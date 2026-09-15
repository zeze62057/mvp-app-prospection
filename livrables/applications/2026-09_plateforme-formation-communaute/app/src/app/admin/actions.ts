"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Verifie que l'utilisateur courant a le role admin avant toute action.
// Les adhesions n'ont pas de policy RLS d'update pour les membres normaux :
// seul ce chemin, passe par la cle service_role, peut changer un statut.
async function verifierAdmin() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error("Non connecte.");

  const { data: profil } = await supabase
    .from("profils")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profil?.role !== "admin") throw new Error("Reserve aux admins.");
}

export async function approuverAdhesion(adhesionId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin
    .from("adhesions")
    .update({ statut: "approuve", traite_at: new Date().toISOString() })
    .eq("id", adhesionId);
  revalidatePath("/admin");
}

export async function refuserAdhesion(adhesionId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin
    .from("adhesions")
    .update({ statut: "refuse", traite_at: new Date().toISOString() })
    .eq("id", adhesionId);
  revalidatePath("/admin");
}

// Outil temporaire : accorde l'acces payant a la main, en attendant que le
// vrai paiement Mobile Money (tunnel + webhook n8n) soit branche. A retirer
// ou masquer une fois ce circuit reel en place.
export async function accorderAccesPayant(_etat: { erreur: string | null }, formData: FormData) {
  await verifierAdmin();
  const email = String(formData.get("email") ?? "").trim();
  const espaceId = String(formData.get("espace_id") ?? "");

  const admin = createAdminClient();
  const { data: usersData, error: erreurUsers } = await admin.auth.admin.listUsers();
  if (erreurUsers) return { erreur: erreurUsers.message };

  const utilisateur = usersData.users.find((u) => u.email === email);
  if (!utilisateur) return { erreur: "Aucun compte avec cet email." };

  const { error } = await admin
    .from("acces_payant")
    .upsert(
      { profil_id: utilisateur.id, espace_id: espaceId, actif: true },
      { onConflict: "profil_id,espace_id" }
    );

  if (error) return { erreur: error.message };

  revalidatePath("/admin");
  return { erreur: null };
}

export async function approuverExpert(candidatureId: string, profilId: string, espaceId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin
    .from("candidatures_expert")
    .update({ statut: "approuve" })
    .eq("id", candidatureId);
  await admin
    .from("acces_payant")
    .update({ est_expert: true })
    .eq("profil_id", profilId)
    .eq("espace_id", espaceId);
  revalidatePath("/admin");
}

export async function refuserExpert(candidatureId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin.from("candidatures_expert").update({ statut: "refuse" }).eq("id", candidatureId);
  revalidatePath("/admin");
}
