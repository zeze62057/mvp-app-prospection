import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStatsEspace } from "@/lib/stats-communaute";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";
import { GrapheEvolution } from "@/components/admin/GrapheEvolution";

const JOUR_MS = 24 * 60 * 60 * 1000;
const PERIODES: Record<string, string> = { "7": "7 derniers jours", "30": "30 derniers jours", "365": "12 derniers mois" };

type Donnee = { libelle: string; valeur: string; sous?: string; variation: number | null };

export default async function RapportsPage({
  searchParams,
}: {
  searchParams: Promise<{ periode?: string; espace?: string }>;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase
    .from("profils")
    .select("role, pseudo")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">Cette page est reservee aux admins.</p>
      </main>
    );
  }

  const { periode: periodeBrute = "30", espace: espaceFiltre = "" } = await searchParams;
  const periode = periodeBrute in PERIODES ? periodeBrute : "30";
  const jours = Number(periode);

  const maintenant = new Date().getTime();
  const debut = maintenant - jours * JOUR_MS;
  const debutPrecedent = debut - jours * JOUR_MS;
  const depuisIso = new Date(debutPrecedent).toISOString();

  const admin = createAdminClient();
  const { data: espaces } = await admin.from("espaces").select("*").order("nom");
  const espacesPortee = (espaces ?? []).filter((e) => !espaceFiltre || e.id === espaceFiltre);
  const idsPortee = new Set(espacesPortee.map((e) => e.id as string));
  const devise = espacesPortee[0]?.devise ?? "GNF";

  // ponytail: on lit les lignes des deux periodes et on compte en JS, plafonne a 1000 lignes par
  // table (limite Supabase). Suffisant a l'echelle actuelle ; passer a des agregats SQL au-dela.
  const [
    { data: adhesions },
    { data: acces },
    { data: paiements },
    { data: posts },
    { data: votes },
    { data: progression },
    { data: remises },
    { data: tousAcces },
    { data: tousMembres },
  ] = await Promise.all([
    admin.from("adhesions").select("espace_id, created_at").gte("created_at", depuisIso),
    admin.from("acces_payant").select("espace_id, paye_at").eq("actif", true).gte("paye_at", depuisIso),
    admin.from("paiements").select("espace_id, montant, statut, created_at, confirme_at").gte("created_at", depuisIso),
    admin.from("posts").select("espace_id, auteur_id, created_at").eq("statut", "publie").gte("created_at", depuisIso),
    admin.from("post_votes").select("profil_id, created_at, posts(espace_id)").gte("created_at", depuisIso),
    admin.from("progression").select("profil_id, completed_at, sections(modules(espace_id))").gte("completed_at", depuisIso),
    admin.from("devoirs_remises").select("rendu_at, note, devoirs(espace_id)").gte("rendu_at", depuisIso),
    admin.from("acces_payant").select("espace_id").eq("actif", true),
    admin.from("adhesions").select("espace_id").eq("statut", "approuve"),
  ]);

  const dansPortee = (id: unknown) => idsPortee.has(id as string);
  const espaceDe = (x: unknown, chemin: "posts" | "devoirs") =>
    (x as Record<string, { espace_id: string } | null>)[chemin]?.espace_id;

  const ms = (iso: string | null) => (iso ? new Date(iso).getTime() : NaN);
  const compte = (dates: (string | null)[]) => ({
    cur: dates.filter((d) => ms(d) >= debut).length,
    prec: dates.filter((d) => ms(d) >= debutPrecedent && ms(d) < debut).length,
  });
  // Variation en %, seulement si la periode precedente a au moins une valeur (sinon rien d'honnete a dire).
  const variation = (cur: number, prec: number) => (prec > 0 ? Math.round(((cur - prec) / prec) * 100) : null);

  const demandes = compte((adhesions ?? []).filter((a) => dansPortee(a.espace_id)).map((a) => a.created_at as string));
  const payants = compte((acces ?? []).filter((a) => dansPortee(a.espace_id)).map((a) => a.paye_at as string));

  const paiementsPortee = (paiements ?? []).filter((p) => dansPortee(p.espace_id));
  const confirmes = paiementsPortee.filter((p) => p.statut === "confirme");
  const montant = (liste: typeof confirmes, de: number, a: number) =>
    liste.filter((p) => ms(p.confirme_at as string) >= de && ms(p.confirme_at as string) < a).reduce((s, p) => s + (p.montant as number), 0);
  const revenus = montant(confirmes, debut, maintenant + 1);
  const revenusPrec = montant(confirmes, debutPrecedent, debut);
  const enAttente = paiementsPortee.filter((p) => p.statut === "en_attente" && ms(p.created_at as string) >= debut).length;
  const echoues = paiementsPortee.filter((p) => p.statut === "echoue" && ms(p.created_at as string) >= debut).length;

  const postsPortee = (posts ?? []).filter((p) => dansPortee(p.espace_id));
  const postsCompte = compte(postsPortee.map((p) => p.created_at as string));
  const votesPortee = (votes ?? []).filter((v) => dansPortee(espaceDe(v, "posts")));
  const actifsDans = (de: number, a: number) => {
    const ids = new Set<string>();
    postsPortee.filter((p) => ms(p.created_at as string) >= de && ms(p.created_at as string) < a).forEach((p) => ids.add(p.auteur_id as string));
    votesPortee.filter((v) => ms(v.created_at as string) >= de && ms(v.created_at as string) < a).forEach((v) => ids.add(v.profil_id as string));
    return ids.size;
  };
  const actifs = actifsDans(debut, maintenant + 1);
  const actifsPrec = actifsDans(debutPrecedent, debut);

  const progressionPortee = (progression ?? []).filter((p) => {
    const e = (p.sections as unknown as { modules: { espace_id: string } | null } | null)?.modules?.espace_id;
    return dansPortee(e);
  });
  const sectionsTerminees = compte(progressionPortee.map((p) => p.completed_at as string));

  const remisesPortee = (remises ?? []).filter((r) => dansPortee(espaceDe(r, "devoirs")));
  const remisesCompte = compte(remisesPortee.map((r) => r.rendu_at as string));
  const remisesNotees = remisesPortee.filter((r) => ms(r.rendu_at as string) >= debut && r.note !== null).length;

  const nbAccesTotal = (tousAcces ?? []).filter((a) => dansPortee(a.espace_id)).length;
  const nbMembresTotal = (tousMembres ?? []).filter((a) => dansPortee(a.espace_id)).length;
  const conversion = nbMembresTotal > 0 ? Math.round((nbAccesTotal / nbMembresTotal) * 100) : null;

  const donnees: Donnee[] = [
    { libelle: "Demandes d'adhésion", valeur: String(demandes.cur), variation: variation(demandes.cur, demandes.prec) },
    { libelle: "Accès payants activés", valeur: String(payants.cur), variation: variation(payants.cur, payants.prec) },
    {
      libelle: "Revenus confirmés",
      valeur: `${revenus.toLocaleString("fr-FR")} ${devise}`,
      sous: `${enAttente} paiement${enAttente !== 1 ? "s" : ""} en attente, ${echoues} échoué${echoues !== 1 ? "s" : ""}`,
      variation: variation(revenus, revenusPrec),
    },
    {
      libelle: "Conversion gratuit vers payant",
      valeur: conversion !== null ? `${conversion}%` : "Donnée non disponible",
      sous: `${nbAccesTotal} accès payant${nbAccesTotal !== 1 ? "s" : ""} pour ${nbMembresTotal} membre${nbMembresTotal !== 1 ? "s" : ""} gratuit${nbMembresTotal !== 1 ? "s" : ""}, depuis le début`,
      variation: null,
    },
    { libelle: "Posts publiés", valeur: String(postsCompte.cur), variation: variation(postsCompte.cur, postsCompte.prec) },
    { libelle: "Membres actifs", valeur: String(actifs), sous: "ont posté ou liké", variation: variation(actifs, actifsPrec) },
    {
      libelle: "Sections terminées",
      valeur: String(sectionsTerminees.cur),
      variation: variation(sectionsTerminees.cur, sectionsTerminees.prec),
    },
    {
      libelle: "Devoirs rendus",
      valeur: String(remisesCompte.cur),
      sous: `${remisesNotees} noté${remisesNotees !== 1 ? "s" : ""}`,
      variation: variation(remisesCompte.cur, remisesCompte.prec),
    },
  ];

  // Courbe mensuelle des demandes d'adhesion, seulement sur 12 mois (sinon trop peu de points).
  const mois: { cle: string; libelle: string; valeur: number }[] = [];
  if (periode === "365") {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(new Date(maintenant).getUTCFullYear(), new Date(maintenant).getUTCMonth() - i, 1));
      mois.push({
        cle: `${d.getUTCFullYear()}-${d.getUTCMonth()}`,
        libelle: d.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" }),
        valeur: 0,
      });
    }
    (adhesions ?? [])
      .filter((a) => dansPortee(a.espace_id))
      .forEach((a) => {
        const d = new Date(a.created_at as string);
        const m = mois.find((x) => x.cle === `${d.getUTCFullYear()}-${d.getUTCMonth()}`);
        if (m) m.valeur += 1;
      });
  }

  const statsParEspace = await Promise.all(espacesPortee.map(async (e) => ({ espace: e, stats: await getStatsEspace(e) })));

  const champ =
    "rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--sarcelle)]";

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Rapports</h1>
      <p className="mt-1 text-[13px] text-[var(--texte-mute)]">
        {PERIODES[periode]}, comparés aux {jours} jours précédents quand ils ont des données. Lecture seule.
      </p>

      <form method="get" className="mt-5 flex flex-wrap items-center gap-2.5">
        <select name="periode" defaultValue={periode} aria-label="Période" className={champ}>
          {Object.entries(PERIODES).map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>
              {libelle}
            </option>
          ))}
        </select>
        <select name="espace" defaultValue={espaceFiltre} aria-label="Espace" className={champ}>
          <option value="">Tous les espaces</option>
          {(espaces ?? []).map((e) => (
            <option key={e.id as string} value={e.id as string}>
              {e.nom as string}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-4 py-1.5 text-[12.5px] font-bold text-white">
          Afficher
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {donnees.map((d) => (
          <div key={d.libelle} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">{d.valeur}</div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">{d.libelle}</div>
            {d.sous && <div className="mt-1 text-[10.5px] text-[var(--texte-mute)]">{d.sous}</div>}
            {d.variation !== null && (
              <div className={`mt-1 text-[10.5px] font-bold ${d.variation >= 0 ? "text-[var(--sarcelle)]" : "text-[var(--corail)]"}`}>
                {d.variation === 0 ? "→ stable" : `${d.variation > 0 ? "↗ +" : "↘ "}${d.variation}%`} vs période précédente
              </div>
            )}
          </div>
        ))}
      </div>

      {periode === "365" && (
        <div className="mt-6 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
          <div className="mb-4 font-display text-[14px] font-bold">📈 Demandes d&apos;adhésion par mois</div>
          <GrapheEvolution points={mois.map((m) => ({ libelle: m.libelle, valeur: m.valeur }))} />
        </div>
      )}

      <h2 className="font-display mt-10 text-lg font-semibold">Sections terminées, depuis le début</h2>
      <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">
        Par espace, indépendant de la période choisie.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        {statsParEspace.map(({ espace, stats }) => (
          <div key={espace.id as string} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="font-display text-[14px] font-bold">{espace.nom as string}</div>
            <div className="mt-1 text-[11.5px] text-[var(--texte-mute)]">
              {stats.progression.nbEleves} élève{stats.progression.nbEleves !== 1 ? "s" : ""}, avancement moyen{" "}
              {stats.progression.avancementMoyen !== null ? `${stats.progression.avancementMoyen}%` : "non disponible"}
            </div>
            {[
              { titre: "Les plus terminées", liste: stats.progression.plusTerminees },
              { titre: "Les moins terminées", liste: stats.progression.moinsTerminees },
            ].map((bloc) => (
              <div key={bloc.titre} className="mt-3">
                <div className="font-mono text-[10px] font-bold uppercase text-[var(--texte-mute)]">{bloc.titre}</div>
                {bloc.liste.length === 0 ? (
                  <p className="mt-1 text-[12px] text-[var(--texte-mute)]">Aucune donnée.</p>
                ) : (
                  <ul className="mt-1 flex flex-col gap-0.5 text-[12px]">
                    {bloc.liste.map((s) => (
                      <li key={`${s.module_ordre}-${s.section_ordre}`} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">{s.titre}</span>
                        <span className="font-mono font-bold">{s.nb_terminees}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
        {statsParEspace.length === 0 && <p className="text-[12.5px] text-[var(--texte-mute)]">Aucun espace.</p>}
      </div>
    </main>
  );
}
