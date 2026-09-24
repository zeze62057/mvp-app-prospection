import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  approuverAdhesion,
  refuserAdhesion,
  approuverExpert,
  refuserExpert,
  publierContenu,
  supprimerBrouillonContenu,
} from "./actions";
import { FormulaireAccesPayant } from "@/components/admin/FormulaireAccesPayant";
import { LignePrixEspace } from "@/components/admin/LignePrixEspace";
import { FormulaireCreationEspace } from "@/components/admin/FormulaireCreationEspace";
import { getStatsEspace } from "@/lib/stats-communaute";
import { CarteStatsEspace } from "@/components/admin/CarteStatsEspace";
import { FormulaireParametresCommunaute } from "@/components/admin/FormulaireParametresCommunaute";
import { FormulairePresentationEspace } from "@/components/admin/FormulairePresentationEspace";
import { FormulaireBanniereEspace } from "@/components/admin/FormulaireBanniereEspace";
import { GestionNiveaux } from "@/components/admin/GestionNiveaux";
import { GestionQuestionsAdhesion } from "@/components/admin/GestionQuestionsAdhesion";
import { NIVEAUX_PAR_DEFAUT, type NiveauConfig } from "@/lib/niveaux";
import { GestionCategories } from "@/components/admin/GestionCategories";
import { ActionsSignalement } from "@/components/admin/ActionsSignalement";
import { EnregistrementVideo } from "@/components/admin/EnregistrementVideo";
import { FormulaireLienRessource } from "@/components/admin/FormulaireLienRessource";
import { FormulaireFichierRessource } from "@/components/admin/FormulaireFichierRessource";
import { FormulaireMasterclass } from "@/components/admin/FormulaireMasterclass";
import { FormulaireCreneauRdv } from "@/components/admin/FormulaireCreneauRdv";
import { FormulaireDevoir } from "@/components/admin/FormulaireDevoir";
import { FormulaireNoterRemise } from "@/components/admin/FormulaireNoterRemise";
import { FormulaireBadge } from "@/components/admin/FormulaireBadge";
import { GrapheEvolution } from "@/components/admin/GrapheEvolution";
import { AnneauRepartition } from "@/components/admin/AnneauRepartition";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";
import { SelecteurPeriode } from "@/components/admin/SelecteurPeriode";
import { IllustrationBanniere } from "@/components/admin/IllustrationBanniere";
import { AvatarAdmin } from "@/components/admin/AvatarAdmin";
import { urlsAvatars } from "@/lib/avatars";
import { getActivite, ilYa } from "@/lib/activite-admin";

const JOUR_MS = 24 * 60 * 60 * 1000;
const PERIODES: Record<string, string> = { "7": "7 derniers jours", "30": "30 derniers jours", "365": "12 derniers mois" };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  const { periode: periodeBrute = "30" } = await searchParams;
  const periode = periodeBrute in PERIODES ? periodeBrute : "30";
  const jours = Number(periode);
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
        <p className="text-sm text-[var(--texte-mute)]">
          Cette page est reservee aux admins.
        </p>
      </main>
    );
  }

  const admin = createAdminClient();
  const { data: demandes } = await admin
    .from("adhesions")
    .select("id, statut, created_at, profils(pseudo), espaces(nom)")
    .eq("statut", "en_attente")
    .order("created_at", { ascending: true });

  // Reponses aux questions d'adhesion (migration 0037), par demande, dans l'ordre des questions.
  const idsDemandes = (demandes ?? []).map((d) => d.id as string);
  const { data: reponsesDemandes } = idsDemandes.length
    ? await admin
        .from("reponses_adhesion")
        .select("adhesion_id, reponse, questions_adhesion(libelle, ordre)")
        .in("adhesion_id", idsDemandes)
    : { data: [] };
  const reponsesParDemande = new Map<string, { question: string; ordre: number; reponse: string }[]>();
  (reponsesDemandes ?? []).forEach((r) => {
    const q = r.questions_adhesion as unknown as { libelle: string; ordre: number } | null;
    const id = r.adhesion_id as string;
    reponsesParDemande.set(id, [
      ...(reponsesParDemande.get(id) ?? []),
      { question: q?.libelle ?? "Question supprimée", ordre: q?.ordre ?? 99, reponse: r.reponse as string },
    ]);
  });
  const { data: questionsAdhesion } = await admin
    .from("questions_adhesion")
    .select("espace_id, ordre, libelle")
    .order("ordre");
  const questionsParEspace = new Map<string, string[]>();
  (questionsAdhesion ?? []).forEach((q) => {
    const lignes = questionsParEspace.get(q.espace_id as string) ?? ["", "", ""];
    lignes[(q.ordre as number) - 1] = q.libelle as string;
    questionsParEspace.set(q.espace_id as string, lignes);
  });

  const { data: candidaturesExpert } = await admin
    .from("candidatures_expert")
    .select("id, profil_id, espace_id, created_at, profils(pseudo), espaces(nom)")
    .eq("statut", "en_attente")
    .order("created_at", { ascending: true });

  // select("*") plutot qu'une liste de colonnes : reste fonctionnel meme si la
  // migration 0024 (reglages de communaute) n'est pas encore appliquee.
  const { data: espaces } = await admin
    .from("espaces")
    .select("*")
    .order("nom", { ascending: true });

  const statsParEspace = await Promise.all(
    (espaces ?? []).map(async (e) => ({ espace: e, stats: await getStatsEspace(e) }))
  );

  // Categories du fil (migration 0026) : absentes tant qu'elle n'est pas appliquee.
  const { data: categoriesFil } = await admin
    .from("categories_posts")
    .select("id, espace_id, libelle, emoji")
    .order("ordre")
    .order("created_at");

  // Signalements ouverts (migration 0031). Pour un message prive, seul l'extrait copie au
  // moment du signalement est visible : l'admin n'a aucun acces a la conversation.
  const { data: signalements } = await admin
    .from("signalements")
    .select("id, type, espace_id, signaleur_id, auteur_cible_id, extrait, motif, created_at")
    .eq("statut", "ouvert")
    .order("created_at", { ascending: true });
  const idsSignalement = [
    ...new Set((signalements ?? []).flatMap((x) => [x.signaleur_id, x.auteur_cible_id]).filter((id): id is string => !!id)),
  ];
  const { data: profilsSignalement } = idsSignalement.length
    ? await admin.from("profils").select("id, pseudo").in("id", idsSignalement)
    : { data: [] as { id: string; pseudo: string }[] };
  const pseudoParId = new Map((profilsSignalement ?? []).map((p) => [p.id, p.pseudo]));

  const { data: messagesAccueil } = await admin
    .from("messages_accueil")
    .select("espace_id, texte");
  const messageParEspace = new Map(
    (messagesAccueil ?? []).map((m) => [m.espace_id as string, m.texte as string])
  );

  const { data: presentations } = await admin
    .from("presentations_espace")
    .select("espace_id, video_youtube_id, description");
  const [{ data: lignesNiveaux }, { data: niveauxMasterclass }] = await Promise.all([
    admin.from("niveaux_espace").select("espace_id, niveau, libelle, points_requis").order("niveau"),
    admin.from("masterclasses").select("espace_id, niveau_min"),
  ]);
  const niveauxParEspace = new Map<string, NiveauConfig[]>();
  (lignesNiveaux ?? []).forEach((l) => {
    niveauxParEspace.set(l.espace_id as string, [
      ...(niveauxParEspace.get(l.espace_id as string) ?? []),
      { niveau: l.niveau as number, libelle: l.libelle as string, points_requis: l.points_requis as number },
    ]);
  });
  const niveauMasterclassParEspace = new Map<string, number>();
  (niveauxMasterclass ?? []).forEach((m) => {
    const id = m.espace_id as string;
    niveauMasterclassParEspace.set(id, Math.max(niveauMasterclassParEspace.get(id) ?? 1, m.niveau_min as number));
  });

  const presentationParEspace = new Map(
    (presentations ?? []).map((p) => [
      p.espace_id as string,
      { video: p.video_youtube_id as string | null, description: p.description as string },
    ])
  );

  const { data: masterclasses } = await admin
    .from("masterclasses")
    .select("id, titre, date_heure")
    .order("date_heure", { ascending: false });

  const inscritsParMasterclass = await Promise.all(
    (masterclasses ?? []).map(async (m) => {
      const { data: inscriptions } = await admin
        .from("inscriptions_masterclass")
        .select("profils(pseudo)")
        .eq("masterclass_id", m.id);
      return { masterclass: m, inscrits: inscriptions ?? [] };
    })
  );

  const { data: brouillonsContenu } = await admin
    .from("contenus")
    .select("id, titre, corps, created_at, espaces(nom)")
    .eq("statut", "brouillon")
    .order("created_at", { ascending: false });

  const { data: creneauxRdv } = await admin
    .from("creneaux_rdv")
    .select("id, date_heure, reserve_par, profils(pseudo)")
    .order("date_heure", { ascending: false });

  const { data: modules } = await admin
    .from("modules")
    .select("id, titre, espace_id, ordre, sections(id, titre, ordre, video_path)")
    .order("ordre");
  const modulesTries = (modules ?? []).map((m) => ({
    ...m,
    sections: [...(m.sections ?? [])].sort((a, b) => a.ordre - b.ordre),
  }));

  // Devoirs et remises (migration 0043) : une remise non notee attend une action admin.
  const { data: devoirs } = await admin
    .from("devoirs")
    .select("id, titre, date_limite, espaces(nom)")
    .order("date_limite", { ascending: false });
  const { data: remisesAttente } = await admin
    .from("devoirs_remises")
    .select("id, texte, fichier_path, rendu_at, devoirs(titre), profils(pseudo)")
    .is("note", null)
    .order("rendu_at", { ascending: true });

  // -------------------------------------------------------------------------
  // Tableau de bord (mission "refaire le tableau de bord admin", 2026-09-24).
  // Aucune donnee inventee : chaque chiffre vient d'une requete reelle. Les
  // variations ("+X%") ne s'affichent que si les deux periodes comparees ont
  // au moins une valeur.
  // -------------------------------------------------------------------------
  const maintenant = new Date().getTime();
  const debut = maintenant - jours * JOUR_MS;
  const debutPrecedent = debut - jours * JOUR_MS;
  const ilDebut = new Date(debut).toISOString();
  const ilDebutPrecedent = new Date(debutPrecedent).toISOString();

  const [
    { count: totalEleves },
    { count: coursPublies },
    { count: elevesNouveaux },
    { count: elevesPrecedent },
    { count: espacesNouveaux },
    { data: paiementsConfirmes },
    { data: paiementsConfirmesPrecedent },
    { data: adhesionsPeriode },
    { data: derniersInscrits },
    { data: paiementsRecents },
    { data: avisTousEspaces },
    { data: postsActifs },
    { data: votesActifs },
    { data: progressionActive },
    comptesAuth,
  ] = await Promise.all([
    admin.from("acces_payant").select("*", { count: "exact", head: true }).eq("actif", true),
    admin.from("sections").select("*", { count: "exact", head: true }).or("a_contenu.eq.true,video_path.not.is.null"),
    admin.from("acces_payant").select("*", { count: "exact", head: true }).eq("actif", true).gte("paye_at", ilDebut),
    admin.from("acces_payant").select("*", { count: "exact", head: true }).eq("actif", true).gte("paye_at", ilDebutPrecedent).lt("paye_at", ilDebut),
    admin.from("espaces").select("*", { count: "exact", head: true }).eq("actif", true).gte("created_at", ilDebut),
    admin.from("paiements").select("montant").eq("statut", "confirme").gte("confirme_at", ilDebut),
    admin.from("paiements").select("montant").eq("statut", "confirme").gte("confirme_at", ilDebutPrecedent).lt("confirme_at", ilDebut),
    admin.from("adhesions").select("created_at").gte("created_at", ilDebut),
    admin
      .from("adhesions")
      .select("id, statut, created_at, profils(id, pseudo, avatar_path), espaces(nom)")
      .order("created_at", { ascending: false })
      .limit(5),
    admin
      .from("paiements")
      .select("id, montant, devise, statut, created_at, profils(id, pseudo, avatar_path), espaces(nom)")
      .order("created_at", { ascending: false })
      .limit(5),
    admin.from("temoignages").select("espace_id, note"),
    admin.from("posts").select("auteur_id, created_at").eq("statut", "publie").gte("created_at", ilDebutPrecedent),
    admin.from("post_votes").select("profil_id, created_at").gte("created_at", ilDebutPrecedent),
    admin.from("progression").select("profil_id, completed_at").gte("completed_at", ilDebutPrecedent),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => r.data?.users ?? []),
  ]);

  const emailDe = new Map(comptesAuth.map((u) => [u.id, u.email ?? ""]));
  type ProfilLigne = { id: string; pseudo: string; avatar_path: string | null } | null;
  const profilDe = (p: unknown) => p as ProfilLigne;
  const photos = await urlsAvatars(
    [...(derniersInscrits ?? []), ...(paiementsRecents ?? [])]
      .map((l) => profilDe(l.profils))
      .filter((p): p is NonNullable<ProfilLigne> => !!p)
  );

  const revenusPeriode = (paiementsConfirmes ?? []).reduce((s, p) => s + p.montant, 0);
  const revenusPrecedent = (paiementsConfirmesPrecedent ?? []).reduce((s, p) => s + p.montant, 0);
  const variationRevenus =
    revenusPrecedent > 0 ? Math.round(((revenusPeriode - revenusPrecedent) / revenusPrecedent) * 100) : null;
  const variationEleves =
    (elevesPrecedent ?? 0) > 0
      ? Math.round((((elevesNouveaux ?? 0) - (elevesPrecedent ?? 0)) / (elevesPrecedent ?? 1)) * 100)
      : null;
  const devise = espaces?.[0]?.devise ?? "GNF";

  // Retention : parmi les membres actifs sur la periode precedente, part de ceux qui le sont encore
  // sur la periode choisie. "Actif" = a poste, aime un post ou termine une section. Rien affiche
  // sans membre actif avant (pas de base de comparaison).
  const actifsEntre = (de: number, a: number) => {
    const ids = new Set<string>();
    const dans = (iso: string) => {
      const t = new Date(iso).getTime();
      return t >= de && t < a;
    };
    (postsActifs ?? []).filter((x) => dans(x.created_at)).forEach((x) => ids.add(x.auteur_id));
    (votesActifs ?? []).filter((x) => dans(x.created_at)).forEach((x) => ids.add(x.profil_id));
    (progressionActive ?? []).filter((x) => dans(x.completed_at)).forEach((x) => ids.add(x.profil_id));
    return ids;
  };
  const actifsAvant = actifsEntre(debutPrecedent, debut);
  const actifsMaintenant = actifsEntre(debut, maintenant + 1);
  const resteActifs = [...actifsAvant].filter((id) => actifsMaintenant.has(id)).length;
  const tauxRetention =
    actifsAvant.size > 0
      ? { pct: Math.round((resteActifs / actifsAvant.size) * 100), reste: resteActifs, avant: actifsAvant.size }
      : null;

  // Evolution des demandes d'adhesion sur la periode choisie : par jour (7 ou 30 jours) ou par
  // mois (12 mois), comptage reel sur adhesions.created_at.
  const evolutionInscriptions: { libelle: string; valeur: number }[] = [];
  if (jours === 365) {
    const comptesParMois = new Map<string, number>();
    (adhesionsPeriode ?? []).forEach((a) => {
      const d = new Date(a.created_at);
      const cle = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      comptesParMois.set(cle, (comptesParMois.get(cle) ?? 0) + 1);
    });
    for (let i = 11; i >= 0; i--) {
      const d = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth() - i, 1));
      evolutionInscriptions.push({
        libelle: d.toLocaleDateString("fr-FR", { month: "short", timeZone: "UTC" }),
        valeur: comptesParMois.get(`${d.getUTCFullYear()}-${d.getUTCMonth()}`) ?? 0,
      });
    }
  } else {
    const comptesParJour = new Map<string, number>();
    (adhesionsPeriode ?? []).forEach((a) => {
      const cle = new Date(a.created_at).toISOString().slice(0, 10);
      comptesParJour.set(cle, (comptesParJour.get(cle) ?? 0) + 1);
    });
    for (let i = jours - 1; i >= 0; i--) {
      const d = new Date(maintenant - i * JOUR_MS);
      evolutionInscriptions.push({
        libelle: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", timeZone: "UTC" }),
        valeur: comptesParJour.get(d.toISOString().slice(0, 10)) ?? 0,
      });
    }
  }

  // Repartition et popularite par formation : reutilise statsParEspace (deja calcule plus bas
  // pour la section "Statistiques de communaute"), pas de nouvelle agregation dupliquee.
  const noteMoyenneParEspace = new Map<string, number>();
  const parEspaceAvis = new Map<string, number[]>();
  (avisTousEspaces ?? []).forEach((a) => {
    parEspaceAvis.set(a.espace_id, [...(parEspaceAvis.get(a.espace_id) ?? []), a.note]);
  });
  parEspaceAvis.forEach((notes, espaceId) => {
    noteMoyenneParEspace.set(espaceId, notes.reduce((s, n) => s + n, 0) / notes.length);
  });

  // Taux de completion et satisfaction moyens, ponderes par eleve/avis (pas juste la moyenne
  // des moyennes par espace, pour ne pas sur-representer une petite formation).
  const avancementsValides = (statsParEspace ?? []).filter(
    ({ stats }) => stats.progression.avancementMoyen !== null && stats.progression.nbEleves > 0
  );
  const totalElevesAvancement = avancementsValides.reduce((s, { stats }) => s + stats.progression.nbEleves, 0);
  const tauxCompletionMoyen =
    totalElevesAvancement > 0
      ? Math.round(
          avancementsValides.reduce((s, { stats }) => s + (stats.progression.avancementMoyen ?? 0) * stats.progression.nbEleves, 0) /
            totalElevesAvancement
        )
      : null;
  const tousLesAvis = (avisTousEspaces ?? []).map((a) => a.note);
  const satisfactionMoyenne = tousLesAvis.length > 0 ? tousLesAvis.reduce((s, n) => s + n, 0) / tousLesAvis.length : null;

  const activite = await getActivite(admin, 6);

  const raccourcis = [
    { icone: "➕", libelle: "Ajouter un élève", href: "#acces-payant-manuel" },
    { icone: "🎓", libelle: "Créer une formation", href: "#catalogue-formations" },
    { icone: "▶️", libelle: "Publier un cours", href: "#cours" },
    { icone: "💳", libelle: "Voir les paiements", href: "/admin/paiements" },
    { icone: "🚩", libelle: "Voir les signalements", href: "#signalements" },
    { icone: "⭐", libelle: "Gérer les évaluations", href: "#devoirs" },
  ];

  type Delta = { texte: string; positif: boolean } | null;
  const delta = (v: number | null): Delta =>
    v === null
      ? null
      : { texte: v === 0 ? "→ stable vs période précédente" : `${v > 0 ? "↗ +" : "↘ "}${v}% vs période précédente`, positif: v >= 0 };
  const cartesChiffres: { icone: string; couleur: string; libelle: string; valeur: string; delta: Delta }[] = [
    { icone: "👥", couleur: "var(--sarcelle-light)", libelle: "Total des élèves", valeur: String(totalEleves ?? 0), delta: delta(variationEleves) },
    {
      icone: "🎓",
      couleur: "var(--corail)",
      libelle: "Formations actives",
      valeur: String((espaces ?? []).filter((e) => e.actif).length),
      delta:
        (espacesNouveaux ?? 0) > 0
          ? { texte: `↗ +${espacesNouveaux} nouvelle${(espacesNouveaux ?? 0) > 1 ? "s" : ""} sur la période`, positif: true }
          : null,
    },
    // Pas de variation : la table sections n'a pas de date de creation, rien d'honnete a comparer.
    { icone: "▶️", couleur: "var(--sarcelle-light)", libelle: "Cours publiés", valeur: String(coursPublies ?? 0), delta: null },
    {
      icone: "💰",
      couleur: "var(--corail)",
      libelle: `Revenus (${PERIODES[periode].toLowerCase()})`,
      valeur: `${revenusPeriode.toLocaleString("fr-FR")} ${devise}`,
      delta: delta(variationRevenus),
    },
  ];

  return (
      <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />
      <div id="tableau-de-bord" className="grid scroll-mt-8 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-[15px] font-bold">Bonjour {profil?.pseudo ?? ""} 👋</p>
            <h1 className="font-display mt-1 text-[26px] font-semibold">Tableau de bord administrateur</h1>
            <p className="mt-1 text-[13px] text-[var(--texte-mute)]">
              Voici un aperçu de l&apos;activité de votre plateforme de formation.
            </p>
          </div>
          <SelecteurPeriode
            periode={periode}
            options={Object.entries(PERIODES).map(([valeur, libelle]) => ({ valeur, libelle }))}
            dates={`Du ${new Date(debut).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} au ${new Date(maintenant).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`}
          />
        </div>

        <div className="mt-7 grid grid-cols-1 gap-3.5 sm:grid-cols-2 2xl:grid-cols-4">
          {cartesChiffres.map((c) => (
            <div key={c.libelle} className="flex gap-3 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
              <span
                aria-hidden
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-[18px]"
                style={{ background: c.couleur }}
              >
                {c.icone}
              </span>
              <div className="min-w-0">
                <div className="text-xs text-[var(--texte-mute)]">{c.libelle}</div>
                <div className="font-display text-xl font-extrabold">{c.valeur}</div>
                {c.delta && (
                  <div className={`mt-0.5 text-[10.5px] font-bold ${c.delta.positif ? "text-[var(--sarcelle)]" : "text-[var(--corail)]"}`}>
                    {c.delta.texte}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 2xl:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-[14px] font-bold">📈 Évolution des demandes d&apos;adhésion</span>
              <span className="rounded-lg border border-[var(--ligne)] px-2.5 py-1 font-mono text-[10.5px] text-[var(--texte-mute)]">{PERIODES[periode]}</span>
            </div>
            <GrapheEvolution points={evolutionInscriptions} pasLibelle={jours === 30 ? 5 : 1} />
          </div>
          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="mb-4 font-display text-[14px] font-bold">🥧 Répartition des formations</div>
            <AnneauRepartition
              segments={(statsParEspace ?? []).map(({ espace, stats }) => ({ libelle: espace.nom, valeur: stats.nbMembres }))}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 2xl:grid-cols-2">
          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="font-display text-[14px] font-bold">Derniers inscrits</span>
              <Link href="/admin/eleves" className="font-mono text-[10.5px] font-bold text-[var(--sarcelle)]">Voir tout →</Link>
            </div>
            {(derniersInscrits ?? []).length === 0 ? (
              <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune inscription pour le moment.</p>
            ) : (
              <div className="overflow-x-auto"><table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="font-mono text-[9.5px] uppercase tracking-wide text-[var(--texte-mute)]">
                    <th className="pb-2 font-normal">Élève</th>
                    <th className="pb-2 font-normal">Formation</th>
                    <th className="pb-2 text-right font-normal">Inscription</th>
                    <th className="pb-2 pl-2 text-right font-normal">Statut</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {(derniersInscrits ?? []).map((d) => {
                    const pr = profilDe(d.profils);
                    return (
                      <tr key={d.id} className="border-t border-[var(--ligne)] first:border-t-0">
                        <td className="py-2">
                          <div className="flex items-center gap-2.5">
                            {pr && <AvatarAdmin id={pr.id} pseudo={pr.pseudo} url={photos.get(pr.id)} />}
                            <div className="min-w-0">
                              <div className="font-bold">{pr?.pseudo ?? "?"}</div>
                              {pr && emailDe.get(pr.id) && (
                                <div className="max-w-[170px] truncate text-[10.5px] text-[var(--texte-mute)]">{emailDe.get(pr.id)}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-2 text-[var(--texte-mute)]">{(d.espaces as unknown as { nom: string } | null)?.nom ?? "?"}</td>
                        <td className="py-2 text-right font-mono text-[10.5px] leading-tight text-[var(--texte-mute)]">
                          <div>{new Date(d.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</div>
                          <div>{new Date(d.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>
                        <td className="py-2 pl-2 text-right">
                          <span
                            className={`rounded-[5px] px-1.5 py-px font-mono text-[9.5px] font-bold ${
                              d.statut === "approuve"
                                ? "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]"
                                : d.statut === "refuse"
                                  ? "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]"
                                  : "bg-[var(--fond)] text-[var(--texte-mute)]"
                            }`}
                          >
                            {d.statut === "approuve" ? "Actif" : d.statut === "refuse" ? "Refusé" : "En attente"}
                          </span>
                        </td>
                        <td className="py-2 pl-2 text-right">
                          <Link
                            href={`/admin/eleves?q=${encodeURIComponent(pr?.pseudo ?? "")}`}
                            aria-label={`Voir ${pr?.pseudo ?? "l'élève"} dans la liste des élèves`}
                            className="font-mono text-[14px] font-bold text-[var(--texte-mute)]"
                          >
                            …
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>
            )}
          </div>

          <div id="paiements-recents" className="scroll-mt-8 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="font-display text-[14px] font-bold">Paiements récents</span>
              <Link href="/admin/paiements" className="font-mono text-[10.5px] font-bold text-[var(--sarcelle)]">Voir tout →</Link>
            </div>
            {(paiementsRecents ?? []).length === 0 ? (
              <p className="text-[12.5px] text-[var(--texte-mute)]">Aucun paiement pour le moment.</p>
            ) : (
              <div className="overflow-x-auto"><table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="font-mono text-[9.5px] uppercase tracking-wide text-[var(--texte-mute)]">
                    <th className="pb-2 font-normal">Élève</th>
                    <th className="pb-2 font-normal">Montant</th>
                    <th className="pb-2 pl-2 text-right font-normal">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {(paiementsRecents ?? []).map((p) => {
                    const pr = profilDe(p.profils);
                    return (
                      <tr key={p.id} className="border-t border-[var(--ligne)] first:border-t-0">
                        <td className="py-2">
                          <div className="flex items-center gap-2.5">
                            {pr && <AvatarAdmin id={pr.id} pseudo={pr.pseudo} url={photos.get(pr.id)} />}
                            <span className="font-bold">{pr?.pseudo ?? "?"}</span>
                          </div>
                        </td>
                        <td className="py-2 text-[var(--texte-mute)]">{p.montant.toLocaleString("fr-FR")} {p.devise}</td>
                        <td className="py-2 pl-2 text-right">
                          <span
                            className={`rounded-[5px] px-1.5 py-px font-mono text-[9.5px] font-bold ${
                              p.statut === "confirme"
                                ? "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]"
                                : p.statut === "echoue"
                                  ? "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]"
                                  : "bg-[var(--fond)] text-[var(--texte-mute)]"
                            }`}
                          >
                            {p.statut === "confirme" ? "Réussi" : p.statut === "echoue" ? "Échoué" : "En attente"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table></div>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 2xl:grid-cols-[1fr_340px]">
          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="font-display text-[14px] font-bold">Formations les plus populaires</span>
              <Link href="/admin#catalogue-formations" className="font-mono text-[10.5px] font-bold text-[var(--sarcelle)]">Voir tout →</Link>
            </div>
            {(statsParEspace ?? []).length === 0 ? (
              <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune formation pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[...(statsParEspace ?? [])]
                  .sort((a, b) => b.stats.nbMembres - a.stats.nbMembres)
                  .map(({ espace, stats }) => (
                    <div key={espace.id} className="overflow-hidden rounded-xl border border-[var(--ligne)]">
                      <div
                        aria-hidden
                        className="h-20 bg-[linear-gradient(135deg,var(--encre),var(--sarcelle))] bg-cover bg-center"
                        style={
                          espace.banniere_path
                            ? {
                                backgroundImage: `url(${admin.storage.from("bannieres-espaces").getPublicUrl(espace.banniere_path).data.publicUrl})`,
                              }
                            : undefined
                        }
                      />
                      <div className="p-3.5">
                      <div className="mb-1 font-display text-[13px] font-bold">{espace.nom}</div>
                      <div className="flex items-center justify-between text-[11px] text-[var(--texte-mute)]">
                        <span>{stats.nbMembres} membre{stats.nbMembres !== 1 ? "s" : ""}</span>
                        {noteMoyenneParEspace.has(espace.id) && (
                          <span className="font-mono font-bold text-[var(--corail-texte)]">
                            ★ {noteMoyenneParEspace.get(espace.id)!.toFixed(1)}
                          </span>
                        )}
                      </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="mb-3.5 font-display text-[14px] font-bold">📊 Statistiques clés</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icone: "✅",
                  couleur: "var(--sarcelle-light)",
                  libelle: "Taux de complétion",
                  valeur: tauxCompletionMoyen !== null ? `${tauxCompletionMoyen}%` : "n/d",
                  sous: undefined as string | undefined,
                  aide: "Avancement moyen des élèves, pondéré par le nombre d'élèves de chaque formation",
                },
                {
                  icone: "⭐",
                  couleur: "var(--corail)",
                  libelle: "Satisfaction moyenne",
                  valeur: satisfactionMoyenne !== null ? `${satisfactionMoyenne.toFixed(1)} / 5` : "n/d",
                  sous: undefined,
                  aide: "Moyenne des notes laissées avec les témoignages",
                },
                {
                  icone: "⏱",
                  couleur: "var(--sarcelle-light)",
                  libelle: "Temps moyen de formation",
                  valeur: "Bientôt",
                  sous: "aucune mesure du temps passé",
                  aide: "Aucune mesure du temps passé n'existe en base",
                },
                {
                  icone: "🔁",
                  couleur: "var(--corail)",
                  libelle: "Taux de rétention",
                  valeur: tauxRetention !== null ? `${tauxRetention.pct}%` : "n/d",
                  sous: tauxRetention !== null ? `${tauxRetention.reste} sur ${tauxRetention.avant}` : undefined,
                  aide: "Part des membres actifs sur la période précédente qui le sont encore sur la période choisie (post, like ou section terminée)",
                },
              ].map((t) => (
                <div key={t.libelle} title={t.aide} className="rounded-xl border border-[var(--ligne)] p-3">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[13px]" style={{ background: t.couleur }}>
                      {t.icone}
                    </span>
                    <span className="text-[10.5px] leading-tight text-[var(--texte-mute)]">{t.libelle}</span>
                  </div>
                  <div className={`mt-2 font-display text-[17px] font-extrabold ${t.valeur === "Bientôt" || t.valeur === "n/d" ? "text-[var(--texte-mute)] opacity-60" : ""}`}>
                    {t.valeur}
                  </div>
                  {t.sous && <div className="text-[10px] text-[var(--texte-mute)]">{t.sous}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--encre),#1c5d54)] p-5 text-[var(--sur-encre)]">
          <IllustrationBanniere className="pointer-events-none absolute -right-1 top-2 w-[118px]" />
          <p className="relative max-w-[175px] font-display text-[16px] font-bold leading-snug">
            Gérez votre plateforme en toute simplicité
          </p>
          <p className="relative mt-2 max-w-[190px] text-[12px] text-[var(--sur-encre-mute)]">
            Accédez rapidement aux sections d&apos;administration et gardez le contrôle sur votre communauté de formation.
          </p>
          <Link
            href="/admin/guide"
            className="relative mt-4 inline-block rounded-full bg-[var(--corail)] px-4 py-2 text-[12px] font-bold text-[var(--encre)]"
          >
            Voir le guide admin →
          </Link>
        </div>

        <div id="raccourcis" className="scroll-mt-8 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
          <div className="mb-3.5 font-display text-[14px] font-bold">Raccourcis rapides</div>
          <div className="grid grid-cols-2 gap-2.5">
            {raccourcis.map((r) => (
              <a
                key={r.libelle}
                href={r.href}
                className="flex flex-col items-start gap-1.5 rounded-xl border border-[var(--ligne)] p-3 text-[11.5px] font-bold hover:border-[var(--sarcelle)]"
              >
                <span aria-hidden className="text-[16px]">{r.icone}</span>
                {r.libelle}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
          <div className="mb-3.5 flex items-center justify-between">
            <span className="font-display text-[14px] font-bold">Activité récente</span>
            <Link href="/admin/activite" className="font-mono text-[10.5px] font-bold text-[var(--sarcelle)]">Voir tout →</Link>
          </div>
          {activite.length === 0 ? (
            <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune activité pour le moment.</p>
          ) : (
            <ul className="flex flex-col gap-3.5">
              {activite.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span aria-hidden className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[14px]" style={{ background: a.couleur }}>
                    {a.icone}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold leading-snug">{a.titre}</p>
                    <p className="truncate text-[11.5px] text-[var(--texte-mute)]">{a.detail}</p>
                    <p className="font-mono text-[10px] text-[var(--texte-mute)]">{ilYa(a.date)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      </div>

      <p className="font-mono text-xs uppercase tracking-wide text-[var(--corail)] mt-16">
        administration
      </p>
      <h2 id="inscriptions" className="font-display mt-4 text-2xl font-semibold scroll-mt-8">
        Demandes d&apos;acces en attente
      </h2>

      <ul className="mt-8 flex flex-col gap-3">
        {(demandes ?? []).map((demande) => (
          <li
            key={demande.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {(demande.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}
              </p>
              <p className="text-xs text-[var(--texte-mute)]">
                {(demande.espaces as unknown as { nom: string } | null)?.nom ?? "?"}
              </p>
              {(reponsesParDemande.get(demande.id as string) ?? [])
                .sort((a, b) => a.ordre - b.ordre)
                .map((r) => (
                  <div key={r.ordre + r.question} className="mt-2 text-xs">
                    <p className="text-[var(--texte-mute)]">{r.question}</p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-[13px]">{r.reponse}</p>
                  </div>
                ))}
            </div>
            <div className="flex gap-2">
              <form action={approuverAdhesion.bind(null, demande.id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
                >
                  Approuver
                </button>
              </form>
              <form action={refuserAdhesion.bind(null, demande.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-xs font-medium"
                >
                  Refuser
                </button>
              </form>
            </div>
          </li>
        ))}
        {(demandes ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">
            Aucune demande en attente.
          </p>
        )}
      </ul>

      <h2 id="candidatures-expert" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Candidatures Expert en attente
      </h2>
      <ul className="mt-6 flex flex-col gap-3">
        {(candidaturesExpert ?? []).map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
          >
            <div>
              <p className="text-sm font-medium">
                {(c.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}
              </p>
              <p className="text-xs text-[var(--texte-mute)]">
                {(c.espaces as unknown as { nom: string } | null)?.nom ?? "?"}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={approuverExpert.bind(null, c.id, c.profil_id, c.espace_id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--corail)] px-3 py-1.5 text-xs font-medium text-[var(--encre)]"
                >
                  Approuver
                </button>
              </form>
              <form action={refuserExpert.bind(null, c.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-xs font-medium"
                >
                  Refuser
                </button>
              </form>
            </div>
          </li>
        ))}
        {(candidaturesExpert ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">
            Aucune candidature en attente.
          </p>
        )}
      </ul>

      <h2 id="signalements" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Signalements ({(signalements ?? []).length})
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Pour un message prive, tu ne vois que le message signale, copie au moment du signalement :
        jamais la conversation. Un message prive ne peut pas etre supprime d&apos;ici.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(signalements ?? []).map((sg) => (
          <li key={sg.id} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <p className="text-xs text-[var(--texte-mute)]">
              <span className="rounded bg-[var(--encre)] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[var(--sur-encre)]">
                {sg.type}
              </span>{" "}
              {(espaces ?? []).find((e) => e.id === sg.espace_id)?.nom ?? "?"} —{" "}
              {new Date(sg.created_at).toLocaleString("fr-FR")}
            </p>
            <p className="mt-2 text-sm">
              <b>{pseudoParId.get(sg.signaleur_id) ?? "?"}</b> signale un contenu de{" "}
              <b>{sg.auteur_cible_id ? (pseudoParId.get(sg.auteur_cible_id) ?? "?") : "un membre supprime"}</b>
            </p>
            <p className="mt-1 text-xs text-[var(--texte-mute)]">Motif : {sg.motif}</p>
            <p className="mt-2 whitespace-pre-wrap rounded-lg border border-[var(--ligne)] bg-[var(--fond)] p-3 text-xs">
              {sg.extrait}
            </p>
            <div className="mt-3">
              <ActionsSignalement signalementId={sg.id} supprimable={sg.type !== "message"} />
            </div>
          </li>
        ))}
        {(signalements ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun signalement ouvert.</p>
        )}
      </ul>

      <h2 id="statistiques-communaute" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Statistiques de communaute
      </h2>
      <ul className="mt-6 flex flex-col gap-3">
        {statsParEspace.map(({ espace: e, stats }) => (
          <CarteStatsEspace key={e.id} nom={e.nom} devise={e.devise} stats={stats} />
        ))}
        {statsParEspace.length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun espace pour l&apos;instant.</p>
        )}
      </ul>

      <h2 id="parametres-generaux" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Reglages de communaute
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Propres a chaque espace. Le message d&apos;accueil n&apos;est visible que des membres
        de l&apos;espace, jamais du public.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <FormulaireParametresCommunaute
            key={e.id}
            espace={{
              id: e.id,
              nom: e.nom,
              periode_activite_jours: e.periode_activite_jours ?? 7,
              afficher_compteur_public: e.afficher_compteur_public ?? true,
            }}
            messageAccueil={messageParEspace.get(e.id) ?? ""}
          />
        ))}
      </ul>

      <h2 id="questions-adhesion" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Questions d&apos;adhesion
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Posées à qui demande à rejoindre la communauté gratuite, pour qualifier les prospects avant d&apos;approuver.
        Les réponses s&apos;affichent sous chaque demande, tout en haut de cette page.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <GestionQuestionsAdhesion
            key={e.id}
            espace={{ id: e.id, nom: e.nom }}
            questions={questionsParEspace.get(e.id) ?? ["", "", ""]}
          />
        ))}
      </ul>

      <h2 id="niveaux" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Niveaux
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Un membre monte de niveau avec les likes reçus sur ses posts (un like de son propre post ne compte
        pas). Un niveau peut réserver une masterclass : sous ce niveau, la masterclass reste cachée.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => {
          const perso = niveauxParEspace.get(e.id);
          return (
            <GestionNiveaux
              key={e.id}
              espace={{ id: e.id, nom: e.nom }}
              niveaux={perso ?? NIVEAUX_PAR_DEFAUT}
              personnalise={!!perso}
              niveauMasterclassMax={niveauMasterclassParEspace.get(e.id) ?? 1}
            />
          );
        })}
      </ul>

      <h2 id="personnalisation" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Banniere communaute
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        L&apos;image affichee en haut de la carte communaute (sidebar), une par espace.
        Sans image, un degrade par defaut s&apos;affiche.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <FormulaireBanniereEspace
            key={e.id}
            espace={{ id: e.id, nom: e.nom }}
            bannierUrl={
              e.banniere_path
                ? admin.storage.from("bannieres-espaces").getPublicUrl(e.banniere_path).data.publicUrl
                : null
            }
          />
        ))}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Page A propos
      </h2>
      {/* Pas d'ancre propre : fait partie du groupe "Personnalisation" avec la banniere ci-dessus. */}
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Une video et un texte de presentation par espace, visibles des membres seulement
        (menu « A propos » de la communaute).
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => {
          const p = presentationParEspace.get(e.id);
          return (
            <FormulairePresentationEspace
              key={e.id}
              espace={{ id: e.id, nom: e.nom, slug: e.slug }}
              video={p?.video ? `https://youtu.be/${p.video}` : ""}
              description={p?.description ?? ""}
            />
          );
        })}
      </ul>

      <h2 id="categories" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Catégories du fil
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Les pastilles au-dessus du fil de chaque communauté. Supprimer une catégorie ne
        supprime aucun post : ils passent simplement en « sans catégorie ».
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <GestionCategories
            key={e.id}
            espace={{ id: e.id, nom: e.nom }}
            categories={(categoriesFil ?? []).filter((c) => c.espace_id === e.id)}
          />
        ))}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Prix des formations
      </h2>
      {/* Pas d'ancre propre : fait partie du groupe "Catalogue des formations" avec la creation ci-dessous. */}
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <LignePrixEspace key={e.id} espace={e} />
        ))}
      </ul>

      <h2 id="acces-payant-manuel" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Acces payant manuel (filet de securite)
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Le tunnel Mobile Money via Chariow est le chemin normal. N&apos;utilise
        ce formulaire que si un eleve a paye autrement, ou si le tunnel
        automatique est indisponible.
      </p>
      <div className="mt-6">
        <FormulaireAccesPayant espaces={espaces ?? []} />
      </div>

      <h2 id="catalogue-formations" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Creer une nouvelle formation
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Cree seulement l&apos;espace (nom, tagline, prix). Le contenu de cours
        (modules et sections) reste a ajouter separement.
      </p>
      <div className="mt-6">
        <FormulaireCreationEspace />
      </div>

      <ul className="mt-6 flex flex-col gap-2">
        {(espaces ?? []).map((e) => (
          <li key={e.id} className="text-sm text-[var(--texte-mute)]">
            {e.nom} —{" "}
            <Link href={`/${e.slug}`} className="text-[var(--sarcelle)] underline">
              /{e.slug}
            </Link>
          </li>
        ))}
      </ul>

      <h2 id="ressources" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Ressources (outils et fichiers)
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Reserve a la formation payante, pas a la communaute gratuite.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <FormulaireLienRessource espaces={espaces ?? []} />
        <FormulaireFichierRessource espaces={espaces ?? []} />
      </div>

      <h2 id="masterclass" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Masterclass (communaute gratuite)
      </h2>
      <div className="mt-6">
        <FormulaireMasterclass espaces={espaces ?? []} />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {inscritsParMasterclass.map(({ masterclass: m, inscrits }) => (
          <li key={m.id} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <p className="text-sm font-medium">
              {m.titre} —{" "}
              <span className="text-xs text-[var(--texte-mute)]">
                {new Date(m.date_heure).toLocaleString("fr-FR")}
              </span>
            </p>
            <p className="mt-1 text-xs text-[var(--texte-mute)]">
              {inscrits.length === 0
                ? "Aucun inscrit."
                : inscrits
                    .map((i) => (i.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?")
                    .join(", ")}
            </p>
          </li>
        ))}
        {inscritsParMasterclass.length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucune masterclass creee.</p>
        )}
      </ul>

      <h2 id="contenu" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Brouillons de contenu
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Rediges par le skill de veille, invisibles des membres tant qu&apos;ils ne sont pas publies ici.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(brouillonsContenu ?? []).map((b) => (
          <li key={b.id} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <p className="text-xs text-[var(--texte-mute)]">
              {(b.espaces as unknown as { nom: string } | null)?.nom ?? "?"} —{" "}
              {new Date(b.created_at).toLocaleDateString("fr-FR")}
            </p>
            <p className="font-display mt-1 text-sm font-bold">{b.titre}</p>
            <p className="mt-2 whitespace-pre-wrap text-xs text-[var(--texte-mute)]">{b.corps}</p>
            <div className="mt-3 flex gap-2">
              <form action={publierContenu.bind(null, b.id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
                >
                  Publier
                </button>
              </form>
              <form action={supprimerBrouillonContenu.bind(null, b.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-xs font-medium"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </li>
        ))}
        {(brouillonsContenu ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun brouillon en attente.</p>
        )}
      </ul>

      <h2 id="rdv" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        RDV (appel decouverte, communaute gratuite)
      </h2>
      <div className="mt-6">
        <FormulaireCreneauRdv espaces={espaces ?? []} />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {(creneauxRdv ?? []).map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <span className="text-sm">{new Date(c.date_heure).toLocaleString("fr-FR")}</span>
            <span className="text-xs text-[var(--texte-mute)]">
              {c.reserve_par
                ? `Reserve par ${(c.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}`
                : "Libre"}
            </span>
          </li>
        ))}
        {(creneauxRdv ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun creneau cree.</p>
        )}
      </ul>

      <h2 id="cours" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Enregistrer une video de cours
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Capture d&apos;ecran rattachee directement a une section. Le
        navigateur va demander la permission de partager ton ecran.
      </p>
      <div className="mt-6">
        <EnregistrementVideo espaces={espaces ?? []} modules={modulesTries} />
      </div>

      <h2 id="devoirs" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Devoirs
      </h2>
      <div className="mt-6">
        <FormulaireDevoir espaces={espaces ?? []} modules={modulesTries} />
      </div>
      <p className="mb-3 mt-6 text-sm font-semibold text-[var(--texte-mute)]">
        Remises à noter
      </p>
      <ul className="flex flex-col gap-2">
        {(remisesAttente ?? []).map((r) => (
          <li key={r.id} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span>
                <b>{(r.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}</b>
                {" — "}
                {(r.devoirs as unknown as { titre: string } | null)?.titre ?? "?"}
              </span>
              <span className="text-xs text-[var(--texte-mute)]">
                {new Date(r.rendu_at).toLocaleString("fr-FR")}
              </span>
            </div>
            {r.texte && <p className="mt-2 text-xs text-[var(--texte-mute)]">{r.texte}</p>}
            {r.fichier_path && (
              <p className="mt-2 text-xs text-[var(--sarcelle)]">Fichier joint (à récupérer dans Supabase Storage : {r.fichier_path})</p>
            )}
            <FormulaireNoterRemise remiseId={r.id} />
          </li>
        ))}
        {(remisesAttente ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucune remise en attente de note.</p>
        )}
      </ul>
      <p className="mb-3 mt-6 text-sm font-semibold text-[var(--texte-mute)]">
        Tous les devoirs
      </p>
      <ul className="flex flex-col gap-2">
        {(devoirs ?? []).map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <span className="text-sm">
              {d.titre} — {(d.espaces as unknown as { nom: string } | null)?.nom ?? "?"}
            </span>
            <span className="text-xs text-[var(--texte-mute)]">
              limite {new Date(d.date_limite).toLocaleDateString("fr-FR")}
            </span>
          </li>
        ))}
        {(devoirs ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun devoir créé.</p>
        )}
      </ul>

      <h2 id="badges" className="font-display mt-16 text-2xl font-semibold scroll-mt-8">
        Badges (attribution manuelle)
      </h2>
      <div className="mt-6">
        <FormulaireBadge espaces={espaces ?? []} />
      </div>
      </main>
  );
}
