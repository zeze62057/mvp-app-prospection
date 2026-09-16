// Indicateurs de communaute pour l'admin (voir CADRAGE.md section 9 :
// "plusieurs parametres" au-dela du nombre d'abonnes). Reserve a l'admin,
// jamais affiche aux membres (le taux de conversion est une donnee
// commerciale privee).

import { createAdminClient } from "@/lib/supabase/admin";

export type StatsCommunaute = {
  nbMembres: number;
  nbPosts: number;
  nbActifsRecents: number;
  tauxConversion: number | null; // null si aucun membre approuve
};

const SEPT_JOURS_MS = 7 * 24 * 60 * 60 * 1000;

export async function getStatsEspace(espaceId: string): Promise<StatsCommunaute> {
  const admin = createAdminClient();
  const depuis = new Date(Date.now() - SEPT_JOURS_MS).toISOString();

  const [
    { count: nbMembres },
    { count: nbPosts },
    { data: postsRecents },
    { data: votesRecents },
    { count: nbAccesPayant },
  ] = await Promise.all([
    admin
      .from("adhesions")
      .select("*", { count: "exact", head: true })
      .eq("espace_id", espaceId)
      .eq("statut", "approuve"),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("espace_id", espaceId),
    admin
      .from("posts")
      .select("auteur_id")
      .eq("espace_id", espaceId)
      .gte("created_at", depuis),
    admin
      .from("post_votes")
      .select("profil_id, posts!inner(espace_id)")
      .eq("posts.espace_id", espaceId)
      .gte("created_at", depuis),
    admin
      .from("acces_payant")
      .select("*", { count: "exact", head: true })
      .eq("espace_id", espaceId)
      .eq("actif", true),
  ]);

  const actifs = new Set<string>();
  (postsRecents ?? []).forEach((p) => actifs.add(p.auteur_id));
  (votesRecents ?? []).forEach((v) => actifs.add(v.profil_id));

  const membres = nbMembres ?? 0;
  const tauxConversion = membres > 0 ? Math.round(((nbAccesPayant ?? 0) / membres) * 100) : null;

  return {
    nbMembres: membres,
    nbPosts: nbPosts ?? 0,
    nbActifsRecents: actifs.size,
    tauxConversion,
  };
}
