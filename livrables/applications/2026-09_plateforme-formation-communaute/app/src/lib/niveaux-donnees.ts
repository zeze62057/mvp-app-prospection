// Chargement des niveaux d'un espace (migration 0036). Lecture avec le client de l'utilisateur :
// le RLS reserve la lecture aux membres de l'espace. Un espace sans reglage, ou une lecture qui
// echoue, retombe sur les seuils historiques : un badge de niveau ne doit jamais casser une page.

import type { SupabaseClient } from "@supabase/supabase-js";
import { NIVEAUX_PAR_DEFAUT, type NiveauConfig } from "@/lib/niveaux";

export async function chargerNiveaux(supabase: SupabaseClient, espaceId: string): Promise<NiveauConfig[]> {
  const { data, error } = await supabase
    .from("niveaux_espace")
    .select("niveau, libelle, points_requis")
    .eq("espace_id", espaceId)
    .order("niveau");
  if (error || !data || data.length === 0) return NIVEAUX_PAR_DEFAUT;
  return data as NiveauConfig[];
}
