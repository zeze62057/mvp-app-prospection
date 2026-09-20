"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type EtatRdv = { erreur: string | null };

export async function reserver(
  espaceSlug: string,
  creneauId: string,
  // Requis par la signature de useActionState (etat precedent), non utilise ici.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _etat: EtatRdv
): Promise<EtatRdv> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("reserver_creneau", { p_creneau_id: creneauId });
  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/rdv`);
  return { erreur: null };
}

export async function annuler(
  espaceSlug: string,
  creneauId: string,
  // Requis par la signature de useActionState (etat precedent), non utilise ici.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _etat: EtatRdv
): Promise<EtatRdv> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("annuler_creneau", { p_creneau_id: creneauId });
  if (error) return { erreur: error.message };

  revalidatePath(`/${espaceSlug}/rdv`);
  return { erreur: null };
}
