import { createAdminClient } from "@/lib/supabase/admin";
import { QUESTIONS } from "@/lib/diagnostic-questions";

// Calculs du tableau de bord d'administration. Tout vient de la base : aucun chiffre invente, aucune IA.

const JOUR = 24 * 3600 * 1000;
const cleJour = (d: Date) => d.toISOString().slice(0, 10);

export type Activite = { type: "diagnostic" | "rdv" | "client" | "document"; titre: string; detail: string; date: string };

export async function chargerTableauDeBord(periodeJours: number, indexQuestion: number) {
  const admin = createAdminClient();
  const [{ data: clients }, { data: projets }, { data: livrables }, { data: diagnostics }, { data: rdv }, users] = await Promise.all([
    admin.from("chatllow_clients").select("profil_id, entreprise, contact, created_at").order("created_at", { ascending: false }),
    admin.from("chatllow_projets").select("id, client_id, titre, statut, avancement, created_at"),
    admin.from("chatllow_livrables").select("id, client_id, titre, created_at").order("created_at", { ascending: false }),
    admin.from("chatllow_diagnostics").select("id, email, reponses, pilote_recommande, created_at").order("created_at", { ascending: false }).limit(2000),
    admin.from("chatllow_rdv").select("id, email, jour, heure, created_at").order("created_at", { ascending: false }).limit(2000),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => r.data?.users ?? []),
  ]);
  const C = clients ?? [];
  const P = projets ?? [];
  const L = livrables ?? [];
  const D = diagnostics ?? [];
  const R = rdv ?? [];
  const emails = new Map(users.map((u) => [u.id, u.email ?? ""]));

  const maintenant = Date.now();
  const debutJour = new Date(new Date().toISOString().slice(0, 10)).getTime();

  // Serie quotidienne sur n jours (le dernier jour est aujourd'hui).
  const serie = (lignes: { created_at: string }[], n: number) => {
    const compteur = new Map<string, number>();
    lignes.forEach((l) => compteur.set(cleJour(new Date(l.created_at)), (compteur.get(cleJour(new Date(l.created_at))) ?? 0) + 1));
    return Array.from({ length: n }, (_, i) => compteur.get(cleJour(new Date(debutJour - (n - 1 - i) * JOUR))) ?? 0);
  };
  const somme = (v: number[]) => v.reduce((t, x) => t + x, 0);
  // Variation : 7 derniers jours contre les 7 precedents.
  const variation = (lignes: { created_at: string }[]) => {
    const s = serie(lignes, 14);
    return { recents: somme(s.slice(7)), precedents: somme(s.slice(0, 7)) };
  };

  const jours = Array.from({ length: periodeJours }, (_, i) =>
    new Date(debutJour - (periodeJours - 1 - i) * JOUR).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  );

  const projetsEnCours = P.filter((p) => p.statut === "en_cours");
  const parStatut = { en_cours: projetsEnCours.length, termine: P.filter((p) => p.statut === "termine").length, a_venir: P.filter((p) => p.statut === "a_venir").length };
  const avancementMoyen = P.length ? Math.round(P.reduce((t, p) => t + p.avancement, 0) / P.length) : null;

  // Repartition des reponses a une question du diagnostic.
  const q = QUESTIONS[Math.max(0, Math.min(QUESTIONS.length - 1, indexQuestion))];
  const repartition = q.options.map((option) => ({
    option,
    n: D.filter((d) => Array.isArray(d.reponses) && (d.reponses as string[])[indexQuestion] === option).length,
  }));
  const totalReponses = repartition.reduce((t, r) => t + r.n, 0);

  // Frein principal le plus cite (question 1) pour la synthese.
  const freins = QUESTIONS[0].options
    .map((option) => ({ option, n: D.filter((d) => Array.isArray(d.reponses) && (d.reponses as string[])[0] === option).length }))
    .sort((a, b) => b.n - a.n);

  // Clients avec avancement moyen de leurs projets et nombre de documents.
  const parClient = C.slice(0, 6).map((c) => {
    const ps = P.filter((p) => p.client_id === c.profil_id);
    return {
      id: c.profil_id,
      entreprise: c.entreprise,
      contact: c.contact,
      email: emails.get(c.profil_id) ?? "",
      nbProjets: ps.length,
      avancement: ps.length ? Math.round(ps.reduce((t, p) => t + p.avancement, 0) / ps.length) : null,
      nbDocs: L.filter((l) => l.client_id === c.profil_id).length,
    };
  });

  // Fil d'activite : diagnostics, rendez-vous, nouveaux clients, documents deposes.
  const nomClient = new Map(C.map((c) => [c.profil_id, c.entreprise]));
  const activite: Activite[] = [
    ...D.slice(0, 8).map((d): Activite => ({ type: "diagnostic", titre: "Nouveau diagnostic", detail: `${d.email}${d.pilote_recommande ? ` · ${d.pilote_recommande}` : ""}`, date: d.created_at })),
    ...R.slice(0, 8).map((r): Activite => ({ type: "rdv", titre: "Demande de rendez-vous", detail: `${r.email} · ${r.jour} à ${r.heure}`, date: r.created_at })),
    ...C.slice(0, 8).map((c): Activite => ({ type: "client", titre: "Nouveau client", detail: `${c.entreprise} · ${c.contact}`, date: c.created_at })),
    ...L.slice(0, 8).map((l): Activite => ({ type: "document", titre: "Document déposé", detail: `${l.titre} · ${nomClient.get(l.client_id) ?? ""}`, date: l.created_at })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 6);

  const recents7 = (lignes: { created_at: string }[]) => lignes.filter((l) => maintenant - +new Date(l.created_at) < 7 * JOUR).length;

  return {
    total: { clients: C.length, projets: P.length, enCours: projetsEnCours.length, livrables: L.length, diagnostics: D.length, rdv: R.length },
    kpi: {
      clients: { serie: serie(C, 14), ...variation(C) },
      projets: { serie: serie(P, 14), ...variation(P) },
      livrables: { serie: serie(L, 14), ...variation(L) },
      diagnostics: { serie: serie(D, 14), ...variation(D) },
      rdv: { serie: serie(R, 14), ...variation(R) },
    },
    evolution: { jours, diagnostics: serie(D, periodeJours), rdv: serie(R, periodeJours) },
    question: { indice: indexQuestion, texte: q.question, repartition, total: totalReponses },
    avancementMoyen,
    parStatut,
    clients: parClient,
    clientsSansProjet: C.filter((c) => !P.some((p) => p.client_id === c.profil_id)).length,
    activite,
    nouveaux7: { diagnostics: recents7(D), rdv: recents7(R) },
    freinPrincipal: freins[0] && freins[0].n > 0 ? freins[0] : null,
    misAJour: new Date().toLocaleString("fr-FR", { timeZone: "Africa/Conakry", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }),
  };
}
