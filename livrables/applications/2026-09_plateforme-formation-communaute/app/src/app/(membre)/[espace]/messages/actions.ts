"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";
import { urlsAvatars } from "@/lib/avatars";
import { estErreurReseau, MESSAGE_RESEAU } from "@/lib/auth-erreurs";

type EtatAction = { erreur: string | null };

// Envoi d'un message prive (migration 0030). Le RLS de la base refuse tout envoi a
// quelqu'un qui n'est pas membre du meme espace, ou avec qui un blocage existe (dans
// un sens ou dans l'autre) : ces controles ne sont pas que cote UI. Le message d'erreur
// reste volontairement generique : le bloque ne doit pas savoir qu'il est bloque.
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

export type MembreTrouve = { id: string; pseudo: string; avatarUrl: string | null };

// Recherche d'un membre de l'espace pour lui ecrire (migration 0031). La fonction de
// la base ne renvoie que les membres de l'espace, hors soi-meme et hors blocages.
export async function chercherMembres(
  espaceSlug: string,
  recherche: string
): Promise<{ erreur: string | null; membres: MembreTrouve[] }> {
  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) {
    return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté.", membres: [] };
  }
  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable.", membres: [] };

  const { data, error } = await supabase.rpc("rechercher_membres", {
    p_espace: espace.id,
    p_q: recherche.slice(0, 50),
  });
  if (error) return { erreur: "La recherche a échoué, réessaie.", membres: [] };

  const lignes = (data ?? []) as { id: string; pseudo: string; avatar_path: string | null }[];
  const photos = await urlsAvatars(lignes);
  return {
    erreur: null,
    membres: lignes.map((m) => ({ id: m.id, pseudo: m.pseudo, avatarUrl: photos.get(m.id) ?? null })),
  };
}
