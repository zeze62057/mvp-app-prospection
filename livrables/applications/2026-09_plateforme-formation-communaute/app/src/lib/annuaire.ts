// Annuaire des membres (migration 0032) : liste paginee et profil public d'un membre.
// Les lectures passent par les fonctions de la base, qui refusent tout non-membre de
// l'espace et ne renvoient jamais d'e-mail, de telephone ni d'information de paiement.

import type { SupabaseClient } from "@supabase/supabase-js";
import { urlsAvatars } from "@/lib/avatars";

export const TAILLE_PAGE_ANNUAIRE = 24;

export type FiltreAnnuaire = "tous" | "admins" | "experts";
export type TriAnnuaire = "alpha" | "points";

export type MembreAnnuaire = {
  id: string;
  pseudo: string;
  role: "membre" | "admin";
  points: number;
  estExpert: boolean;
  membreDepuis: string | null;
  avatarUrl: string | null;
  // Renseignes par le membre (migration 0034), presents seulement sur le profil public.
  bio: string | null;
  ville: string | null;
  lien: string | null;
};

type LigneMembre = {
  id: string;
  pseudo: string;
  avatar_path: string | null;
  role: string;
  points: number;
  est_expert: boolean;
  membre_depuis: string | null;
  total?: number | string;
  bio?: string | null;
  ville?: string | null;
  lien?: string | null;
};

function versMembre(l: LigneMembre, photos: Map<string, string>): MembreAnnuaire {
  return {
    id: l.id,
    pseudo: l.pseudo,
    role: l.role === "admin" ? "admin" : "membre",
    points: l.points ?? 0,
    estExpert: l.est_expert === true,
    membreDepuis: l.membre_depuis,
    avatarUrl: photos.get(l.id) ?? null,
    bio: l.bio ?? null,
    ville: l.ville ?? null,
    lien: l.lien ?? null,
  };
}

// Valeurs venant du navigateur : tout ce qui n'est pas prevu retombe sur le defaut, pour
// ne pas faire echouer la fonction de la base sur une valeur inconnue.
export function filtreValide(v: unknown): FiltreAnnuaire {
  return v === "admins" || v === "experts" ? v : "tous";
}
export function triValide(v: unknown): TriAnnuaire {
  return v === "points" ? "points" : "alpha";
}

export async function lireAnnuaire(
  supabase: SupabaseClient,
  espaceId: string,
  options: { q?: string; filtre?: unknown; tri?: unknown; decalage?: number } = {}
): Promise<{ erreur: string | null; membres: MembreAnnuaire[]; total: number }> {
  const decalage = Number.isInteger(options.decalage) && (options.decalage ?? 0) > 0 ? options.decalage! : 0;
  const { data, error } = await supabase.rpc("annuaire_membres", {
    p_espace: espaceId,
    p_q: (options.q ?? "").slice(0, 50),
    p_filtre: filtreValide(options.filtre),
    p_tri: triValide(options.tri),
    p_limite: TAILLE_PAGE_ANNUAIRE,
    p_decalage: decalage,
  });
  if (error) return { erreur: "L'annuaire n'a pas pu se charger, réessaie.", membres: [], total: 0 };

  const lignes = (data ?? []) as LigneMembre[];
  const photos = await urlsAvatars(lignes);
  return {
    erreur: null,
    membres: lignes.map((l) => versMembre(l, photos)),
    total: lignes.length > 0 ? Number(lignes[0].total ?? lignes.length) : 0,
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Renvoie null si l'identifiant est invalide, si la personne n'est pas membre de l'espace,
// ou si l'appelant n'en est pas membre : la page affiche alors "introuvable".
export async function lireProfilMembre(
  supabase: SupabaseClient,
  espaceId: string,
  profilId: string
): Promise<MembreAnnuaire | null> {
  if (!UUID.test(profilId)) return null;
  const { data, error } = await supabase.rpc("profil_membre", { p_espace: espaceId, p_profil: profilId });
  if (error) throw new Error("Le profil n'a pas pu se charger.");
  const ligne = ((data ?? []) as LigneMembre[])[0];
  if (!ligne) return null;
  return versMembre(ligne, await urlsAvatars([ligne]));
}
