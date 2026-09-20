// Chargement des evenements d'un espace pour le calendrier : masterclass et creneaux de RDV.
// Toutes les lectures passent par le client de l'utilisateur : le RLS decide de ce qu'il voit
// (les masterclass qu'il peut ouvrir, les creneaux de son espace). Le lien de rejoindre n'est
// transmis que pour un evenement auquel la personne participe.

import type { SupabaseClient } from "@supabase/supabase-js";
import { bornesMois, type EvenementCalendrier, type Periode } from "@/lib/calendrier";

type LigneMasterclass = { id: string; titre: string; description: string; date_heure: string; lien: string };
type LigneCreneau = { id: string; date_heure: string; lien: string; reserve_par: string | null };

export async function chargerEvenements(
  supabase: SupabaseClient,
  espace: { id: string; slug: string },
  userId: string,
  periode: Periode
): Promise<EvenementCalendrier[]> {
  const { debut, fin } = bornesMois(periode);

  const [{ data: masterclasses }, { data: creneaux }] = await Promise.all([
    supabase
      .from("masterclasses")
      .select("id, titre, description, date_heure, lien")
      .eq("espace_id", espace.id)
      .gte("date_heure", debut.toISOString())
      .lt("date_heure", fin.toISOString())
      .order("date_heure")
      .returns<LigneMasterclass[]>(),
    supabase
      .from("creneaux_rdv")
      .select("id, date_heure, lien, reserve_par")
      .eq("espace_id", espace.id)
      .gte("date_heure", debut.toISOString())
      .lt("date_heure", fin.toISOString())
      .order("date_heure")
      .returns<LigneCreneau[]>(),
  ]);

  const idsMasterclass = (masterclasses ?? []).map((m) => m.id);
  const { data: inscriptions } = idsMasterclass.length
    ? await supabase
        .from("inscriptions_masterclass")
        .select("masterclass_id")
        .eq("profil_id", userId)
        .in("masterclass_id", idsMasterclass)
    : { data: [] as { masterclass_id: string }[] };
  const inscrit = new Set((inscriptions ?? []).map((i) => i.masterclass_id));

  const evenements: EvenementCalendrier[] = [];

  (masterclasses ?? []).forEach((m) => {
    const participe = inscrit.has(m.id);
    evenements.push({
      id: m.id,
      type: "masterclass",
      titre: m.titre,
      debut: m.date_heure,
      description: m.description ?? "",
      statut: participe ? "inscrit" : "ouvert",
      lien: participe ? m.lien : null,
      page: `/${espace.slug}/masterclass`,
    });
  });

  // Un creneau reserve par quelqu'un d'autre n'apparait pas : il n'est ni libre, ni a la personne.
  (creneaux ?? []).forEach((c) => {
    const mien = c.reserve_par === userId;
    if (c.reserve_par && !mien) return;
    evenements.push({
      id: c.id,
      type: "rdv",
      titre: "Appel découverte 1:1",
      debut: c.date_heure,
      description: "",
      statut: mien ? "reserve" : "libre",
      lien: mien ? c.lien : null,
      page: `/${espace.slug}/rdv`,
    });
  });

  return evenements.sort((a, b) => a.debut.localeCompare(b.debut));
}
