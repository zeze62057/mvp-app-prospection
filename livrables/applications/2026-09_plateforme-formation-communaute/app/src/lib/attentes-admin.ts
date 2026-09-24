// Ce qui attend une action de l'admin : demandes d'adhesion, candidatures Expert, signalements
// ouverts, devoirs a noter. Comptages seulement ; la liste detaillee est dans /admin.
// Reserve au code serveur deja protege par une verification de role admin.

import type { SupabaseClient } from "@supabase/supabase-js";

export type Attente = { cle: string; libelle: string; n: number; href: string; action: string };

export async function getAttentes(admin: SupabaseClient): Promise<Attente[]> {
  const compte = (table: string, colonne: string, valeur: string | null) => {
    const requete = admin.from(table).select("*", { count: "exact", head: true });
    return valeur === null ? requete.is(colonne, null) : requete.eq(colonne, valeur);
  };
  const [adhesions, candidatures, signalements, remises, publications] = await Promise.all([
    compte("adhesions", "statut", "en_attente"),
    compte("candidatures_expert", "statut", "en_attente"),
    compte("signalements", "statut", "ouvert"),
    compte("devoirs_remises", "note", null),
    compte("posts", "statut", "en_attente"),
  ]);

  return [
    { cle: "adhesions", libelle: "Demandes d'accès à la communauté", n: adhesions.count ?? 0, href: "/admin#inscriptions", action: "Approuver ou refuser" },
    { cle: "candidatures", libelle: "Candidatures Expert", n: candidatures.count ?? 0, href: "/admin#candidatures-expert", action: "Approuver ou refuser" },
    { cle: "signalements", libelle: "Signalements ouverts", n: signalements.count ?? 0, href: "/admin#signalements", action: "Modérer" },
    { cle: "remises", libelle: "Devoirs à noter", n: remises.count ?? 0, href: "/admin#devoirs", action: "Noter" },
    { cle: "publications", libelle: "Publications à approuver", n: publications.count ?? 0, href: "/admin/publications", action: "Approuver ou refuser" },
  ];
}
