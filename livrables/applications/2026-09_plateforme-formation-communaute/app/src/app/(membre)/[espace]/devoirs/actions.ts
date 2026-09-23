"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type EtatRemise = { erreur: string | null; envoye: boolean };

// Remise d'un devoir (texte et/ou fichier). Le fichier passe par le client admin
// car le bucket devoirs-fichiers n'a pas de policy storage.objects cote client
// (voir migration 0043) : tous les acces sont mediatises par le serveur. La ligne
// devoirs_remises, elle, passe par le client de l'eleve : le RLS verifie deja
// que la remise lui appartient et n'est pas encore notee.
export async function soumettreDevoir(_etat: EtatRemise, formData: FormData): Promise<EtatRemise> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const devoirId = String(formData.get("devoir_id") ?? "");
  const texte = String(formData.get("texte") ?? "").trim();
  const fichier = formData.get("fichier") as File | null;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecté.", envoye: false };

  if (!texte && (!fichier || fichier.size === 0)) {
    return { erreur: "Ajoute un texte ou un fichier.", envoye: false };
  }

  let fichierPath: string | null = null;
  if (fichier && fichier.size > 0) {
    const ext = fichier.name.split(".").pop() ?? "bin";
    fichierPath = `${devoirId}/${userData.user.id}/${Date.now()}.${ext}`;
    const { error: erreurUpload } = await createAdminClient()
      .storage.from("devoirs-fichiers")
      .upload(fichierPath, fichier, { upsert: true });
    if (erreurUpload) return { erreur: erreurUpload.message, envoye: false };
  }

  const { error } = await supabase.from("devoirs_remises").upsert(
    {
      devoir_id: devoirId,
      profil_id: userData.user.id,
      texte: texte || null,
      rendu_at: new Date().toISOString(),
      ...(fichierPath ? { fichier_path: fichierPath } : {}),
    },
    { onConflict: "devoir_id,profil_id" }
  );
  // Echec le plus probable ici : la remise existante est deja notee (RLS refuse
  // la modification), pas une vraie erreur technique.
  if (error) return { erreur: "Impossible d'enregistrer : ta remise est peut-être déjà notée.", envoye: false };

  revalidatePath(`/${espaceSlug}/devoirs/${devoirId}`);
  revalidatePath(`/${espaceSlug}/progression`);
  return { erreur: null, envoye: true };
}
