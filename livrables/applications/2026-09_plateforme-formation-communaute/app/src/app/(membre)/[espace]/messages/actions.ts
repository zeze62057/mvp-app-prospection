"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";
import { estErreurReseau, MESSAGE_RESEAU } from "@/lib/auth-erreurs";

type EtatAction = { erreur: string | null };

// Envoi d'un message prive (migration 0030). Le RLS de la base refuse tout envoi a
// quelqu'un qui n'est pas membre du meme espace : ce controle n'est pas que cote UI.
export async function envoyerMessage(_etat: EtatAction, formData: FormData): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const destinataireId = String(formData.get("destinataire_id") ?? "");
  const contenu = String(formData.get("contenu") ?? "").trim();
  if (!contenu) return { erreur: "Le message est vide." };
  if (contenu.length > 2000) return { erreur: "Le message est limité à 2000 caractères." };

  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté." };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable." };

  const { error } = await supabase.from("messages").insert({
    espace_id: espace.id,
    expediteur_id: userData.user.id,
    destinataire_id: destinataireId,
    contenu,
  });
  if (error) {
    if (error.code === "42501") return { erreur: "Tu ne peux écrire qu'aux membres de cet espace." };
    return { erreur: error.message };
  }

  revalidatePath(`/${espaceSlug}/messages/${destinataireId}`);
  revalidatePath(`/${espaceSlug}/messages`);
  return { erreur: null };
}
