"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";

type EtatTemoignage = { erreur: string | null; envoye: boolean };

export async function marquerSectionTerminee(espaceSlug: string, sectionId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase
    .from("progression")
    .insert({ profil_id: userData.user.id, section_id: sectionId });

  revalidatePath(`/${espaceSlug}/progression`);
}

export async function envoyerTemoignage(
  _etat: EtatTemoignage,
  formData: FormData
): Promise<EtatTemoignage> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const note = Number(formData.get("note") ?? 0);
  const texte = String(formData.get("texte") ?? "").trim();
  const autorisePartage = formData.get("autorise_partage") === "on";

  if (note < 1 || note > 5) return { erreur: "Choisis une note entre 1 et 5 etoiles.", envoye: false };
  if (!texte) return { erreur: "Le temoignage est vide.", envoye: false };

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecte.", envoye: false };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable.", envoye: false };

  const { error } = await supabase.from("temoignages").insert({
    profil_id: userData.user.id,
    espace_id: espace.id,
    note,
    texte,
    autorise_partage: autorisePartage,
  });

  if (error) return { erreur: error.message, envoye: false };

  revalidatePath(`/${espaceSlug}/progression`);
  return { erreur: null, envoye: true };
}
