"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type EtatRemise = { erreur: string | null; envoye: boolean };

const TAILLE_MAX_FICHIER = 10 * 1024 * 1024;
const TYPES_FICHIER: Record<string, string> = {
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};
const REGEX_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

  if (!REGEX_UUID.test(devoirId)) {
    return { erreur: "Devoir invalide.", envoye: false };
  }

  // Le devoir doit exister et etre visible par l'eleve (le RLS filtre) : sans
  // cette verification, n'importe quel identifiant servirait de dossier Storage.
  const { data: devoir } = await supabase
    .from("devoirs")
    .select("id")
    .eq("id", devoirId)
    .maybeSingle();
  if (!devoir) return { erreur: "Devoir introuvable.", envoye: false };

  if (!texte && (!fichier || fichier.size === 0)) {
    return { erreur: "Ajoute un texte ou un fichier.", envoye: false };
  }

  if (fichier && fichier.size > 0) {
    if (fichier.size > TAILLE_MAX_FICHIER) {
      return { erreur: "Le fichier dépasse 10 Mo.", envoye: false };
    }
    if (!TYPES_FICHIER[fichier.type]) {
      return { erreur: "Type de fichier non accepté (PDF, Word, ZIP, texte ou image).", envoye: false };
    }
  }

  let fichierPath: string | null = null;
  if (fichier && fichier.size > 0) {
    fichierPath = `${devoirId}/${userData.user.id}/${Date.now()}.${TYPES_FICHIER[fichier.type]}`;
    const { error: erreurUpload } = await createAdminClient()
      .storage.from("devoirs-fichiers")
      .upload(fichierPath, fichier, { upsert: true, contentType: fichier.type });
    if (erreurUpload) {
      console.error("devoirs: echec upload", erreurUpload);
      return { erreur: "L'envoi du fichier a échoué. Réessaie.", envoye: false };
    }
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
  if (error) {
    // Ne pas laisser de fichier orphelin si la remise n'a pas ete enregistree.
    if (fichierPath) await createAdminClient().storage.from("devoirs-fichiers").remove([fichierPath]);
    return { erreur: "Impossible d'enregistrer : ta remise est peut-être déjà notée.", envoye: false };
  }

  revalidatePath(`/${espaceSlug}/devoirs/${devoirId}`);
  revalidatePath(`/${espaceSlug}/progression`);
  return { erreur: null, envoye: true };
}
