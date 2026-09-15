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
