// Fil d'activite de l'admin : fusion de 4 sources reelles, la plus recente en premier.
// Les messages prives n'en font pas partie (l'admin n'y a jamais acces, migration 0030).
// Reserve au code serveur deja protege par une verification de role admin.

import type { SupabaseClient } from "@supabase/supabase-js";

export type Evenement = { date: string; icone: string; couleur: string; titre: string; detail: string };

export function ilYa(dateIso: string) {
  const min = Math.max(0, Math.round((new Date().getTime() - new Date(dateIso).getTime()) / 60000));
  if (min < 60) return `il y a ${min} min`;
  if (min < 60 * 24) return `il y a ${Math.floor(min / 60)} h`;
  return `il y a ${Math.floor(min / (60 * 24))} j`;
}

const pseudoDe = (p: unknown) => (p as { pseudo: string } | null)?.pseudo ?? "?";

export async function getActivite(admin: SupabaseClient, limite: number): Promise<Evenement[]> {
  const [{ data: inscriptions }, { data: paiements }, { data: remises }, { data: contenus }] = await Promise.all([
    admin
      .from("adhesions")
      .select("created_at, profils(pseudo), espaces(nom)")
      .order("created_at", { ascending: false })
      .limit(limite),
    admin
      .from("paiements")
      .select("created_at, montant, devise, statut, profils(pseudo)")
      .order("created_at", { ascending: false })
      .limit(limite),
    admin
      .from("devoirs_remises")
      .select("rendu_at, devoirs(titre), profils(pseudo)")
      .order("rendu_at", { ascending: false })
      .limit(limite),
    admin
      .from("contenus")
      .select("titre, created_at")
      .eq("statut", "publie")
      .order("created_at", { ascending: false })
      .limit(limite),
  ]);

  return [
    ...(inscriptions ?? []).map((d) => ({
      date: d.created_at as string,
      icone: "👤",
      couleur: "var(--sarcelle-light)",
      titre: `Inscription de ${pseudoDe(d.profils)}`,
      detail: (d.espaces as unknown as { nom: string } | null)?.nom ?? "?",
    })),
    ...(paiements ?? []).map((p) => ({
      date: p.created_at as string,
      icone: "💳",
      couleur: "var(--corail)",
      titre: `Paiement ${p.statut === "confirme" ? "confirmé" : p.statut === "echoue" ? "échoué" : "en attente"} de ${(p.montant as number).toLocaleString("fr-FR")} ${p.devise}`,
      detail: pseudoDe(p.profils),
    })),
    ...(remises ?? []).map((r) => ({
      date: r.rendu_at as string,
      icone: "📝",
      couleur: "var(--sarcelle)",
      titre: `Devoir rendu par ${pseudoDe(r.profils)}`,
      detail: (r.devoirs as unknown as { titre: string } | null)?.titre ?? "?",
    })),
    ...(contenus ?? []).map((c) => ({
      date: c.created_at as string,
      icone: "📰",
      couleur: "var(--sarcelle-light)",
      titre: "Article publié dans Contenu",
      detail: c.titre as string,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limite);
}
