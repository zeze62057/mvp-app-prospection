// Indicateurs de communaute pour l'admin (voir CADRAGE.md section 9 :
// "plusieurs parametres" au-dela du nombre d'abonnes). Reserve a l'admin,
// jamais affiche aux membres (le taux de conversion et les revenus sont des
// donnees commerciales privees).
//
// Deux sources : les compteurs simples calcules ici (membres, posts, actifs,
// conversion), et les agregats calcules en SQL par stats_admin_espace
// (migration 0024) : croissance, demandes en attente, progression, revenus.

import { createAdminClient } from "@/lib/supabase/admin";

export type SectionStats = {
  titre: string;
  module_ordre: number;
  section_ordre: number;
  nb_terminees: number;
};

export type StatsCommunaute = {
  nbMembres: number;
  nbPosts: number;
  nbActifsRecents: number;
  periodeActiviteJours: number;
  tauxConversion: number | null; // null si aucun membre approuve
  // false si stats_admin_espace a echoue (ex: migration 0024 pas encore
  // appliquee) : l'admin affiche alors un avertissement plutot que de faux zeros.
  agregatsDisponibles: boolean;
  nouveaux7j: number;
  nouveaux30j: number;
  demandesEnAttente: number;
  revenus: { nbConfirmes: number; montantTotal: number; montant30j: number };
  progression: {
    nbEleves: number;
    nbSections: number;
    avancementMoyen: number | null; // pourcentage, null sans eleve ou sans section
    plusTerminees: SectionStats[]; // au plus 3, seulement celles terminees par au moins un eleve
    moinsTerminees: SectionStats[]; // au plus 3, vide sans eleve
  };
};

type AgregatsSql = {
  nouveaux_7j: number;
  nouveaux_30j: number;
  demandes_en_attente: number;
  revenus: { nb_confirmes: number; montant_total: number; montant_30j: number };
  progression: {
    nb_eleves: number;
    nb_sections: number;
    avancement_moyen: number | null;
    sections: SectionStats[];
  };
};

const JOUR_MS = 24 * 60 * 60 * 1000;

export async function getStatsEspace(espace: {
  id: string;
  periode_activite_jours?: number | null;
}): Promise<StatsCommunaute> {
  const admin = createAdminClient();
  // Repli sur 7 jours si la colonne n'existe pas encore (migration 0024).
  const periodeActiviteJours = espace.periode_activite_jours ?? 7;
  const depuis = new Date(Date.now() - periodeActiviteJours * JOUR_MS).toISOString();

  const [
    { count: nbMembres },
    { count: nbPosts },
    { data: postsRecents },
    { data: votesRecents },
    { count: nbAccesPayant },
    { data: agregats, error: erreurAgregats },
  ] = await Promise.all([
    admin
      .from("adhesions")
      .select("*", { count: "exact", head: true })
      .eq("espace_id", espace.id)
      .eq("statut", "approuve"),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("espace_id", espace.id).eq("statut", "publie"),
    admin
      .from("posts")
      .select("auteur_id")
      .eq("espace_id", espace.id)
      .eq("statut", "publie")
      .gte("created_at", depuis),
    admin
      .from("post_votes")
      .select("profil_id, posts!inner(espace_id)")
      .eq("posts.espace_id", espace.id)
      .gte("created_at", depuis),
    admin
      .from("acces_payant")
      .select("*", { count: "exact", head: true })
      .eq("espace_id", espace.id)
      .eq("actif", true),
    admin.rpc("stats_admin_espace", { p_espace_id: espace.id }),
  ]);

  const actifs = new Set<string>();
  (postsRecents ?? []).forEach((p) => actifs.add(p.auteur_id));
  (votesRecents ?? []).forEach((v) => actifs.add(v.profil_id));

  const membres = nbMembres ?? 0;
  const tauxConversion = membres > 0 ? Math.round(((nbAccesPayant ?? 0) / membres) * 100) : null;

  const sql = agregats as AgregatsSql | null;
  const sections = sql?.progression.sections ?? [];
  const nbEleves = sql?.progression.nb_eleves ?? 0;

  // Departage les egalites par l'ordre du programme, pour un affichage stable.
  const parOrdre = (a: SectionStats, b: SectionStats) =>
    a.module_ordre - b.module_ordre || a.section_ordre - b.section_ordre;
  const plusTerminees = sections
    .filter((s) => s.nb_terminees > 0)
    .sort((a, b) => b.nb_terminees - a.nb_terminees || parOrdre(a, b))
    .slice(0, 3);
  const moinsTerminees =
    nbEleves > 0
      ? [...sections]
          .sort((a, b) => a.nb_terminees - b.nb_terminees || parOrdre(a, b))
          .slice(0, 3)
      : [];

  return {
    nbMembres: membres,
    nbPosts: nbPosts ?? 0,
    nbActifsRecents: actifs.size,
    periodeActiviteJours,
    tauxConversion,
    agregatsDisponibles: !erreurAgregats && !!sql,
    nouveaux7j: sql?.nouveaux_7j ?? 0,
    nouveaux30j: sql?.nouveaux_30j ?? 0,
    demandesEnAttente: sql?.demandes_en_attente ?? 0,
    revenus: {
      nbConfirmes: sql?.revenus.nb_confirmes ?? 0,
      montantTotal: sql?.revenus.montant_total ?? 0,
      montant30j: sql?.revenus.montant_30j ?? 0,
    },
    progression: {
      nbEleves,
      nbSections: sql?.progression.nb_sections ?? 0,
      avancementMoyen: sql?.progression.avancement_moyen ?? null,
      plusTerminees,
      moinsTerminees,
    },
  };
}
