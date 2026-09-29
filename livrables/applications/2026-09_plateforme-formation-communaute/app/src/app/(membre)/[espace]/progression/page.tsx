import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { marquerSectionTerminee } from "./actions";
import { ModuleCard } from "@/components/progression/ModuleCard";
import { FormulaireTemoignage } from "@/components/progression/FormulaireTemoignage";
import { CarteClassement } from "@/components/communaute/CarteClassement";
import { chargerEvenements } from "@/lib/calendrier-donnees";
import { parseMois, type EvenementCalendrier } from "@/lib/calendrier";
import {
  BandeauAccueil, CarteCitation, CartesStats, FormationEnCours, ListeModules, MaCommunaute, MonCalendrier,
  ProchainesSessions, ProfilProgression, RessourcesUtiles, type ModuleResume,
} from "@/components/progression/BlocsTableauDeBord";
import { chargerNiveaux } from "@/lib/niveaux-donnees";
import { niveauDe, prochainNiveau } from "@/lib/niveaux";
import { tempsEcoule } from "@/lib/temps";
import { salutationConakry } from "@/lib/salutation";
import type { AccesPayant, BadgeManuel, Devoir, DevoirRemise, Module, Section, StatsCommunaute } from "@/types/membre";

function calculerStreak(dates: string[]): number {
  const jours = new Set(dates.map((d) => new Date(d).toDateString()));
  let streak = 0;
  const curseur = new Date();
  while (jours.has(curseur.toDateString())) {
    streak++;
    curseur.setDate(curseur.getDate() - 1);
  }
  return streak;
}

export default async function ProgressionPage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect(`/${espace.slug}/communaute`);

  const { data: profil } = await supabase
    .from("profils")
    .select("pseudo, role, points")
    .eq("id", userData.user.id)
    .maybeSingle();

  const { data: acces } = await supabase
    .from("acces_payant")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<AccesPayant>();

  // Ce que voit un eleve pas encore payant : inchange, pas dans le perimetre de cette refonte.
  if (!acces?.actif) {
    return (
      <main className="mx-auto max-w-md p-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          ma progression — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Formation pas encore debloquee
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ta progression et le contenu des modules apparaissent ici une fois
          l&apos;acces payant active.
        </p>
        <Link
          href={`/${espace.slug}/tunnel`}
          className="mt-8 inline-block rounded-[9px] bg-[var(--corail)] px-5 py-2.5 text-sm font-bold text-[var(--encre)]"
        >
          Debloquer la formation
        </Link>
      </main>
    );
  }

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("espace_id", espace.id)
    .order("ordre")
    .returns<Module[]>();

  const moduleIds = (modules ?? []).map((m) => m.id);
  const { data: sections } = moduleIds.length
    ? await supabase.from("sections").select("id, module_id, ordre, titre, video_path, a_contenu").in("module_id", moduleIds).order("ordre").returns<Section[]>()
    : { data: [] as Section[] };

  const [{ data: progressionRows }, niveaux, { data: devoirs }, { data: remises }, { data: badgesManuels }, { data: statsRpc }, { data: ressources }] =
    await Promise.all([
      supabase.from("progression").select("section_id, completed_at").eq("profil_id", userData.user.id),
      chargerNiveaux(supabase, espace.id),
      supabase.from("devoirs").select("*").eq("espace_id", espace.id).order("date_limite").returns<Devoir[]>(),
      supabase.from("devoirs_remises").select("*").eq("profil_id", userData.user.id).returns<DevoirRemise[]>(),
      supabase.from("badges_manuels").select("*").eq("espace_id", espace.id).eq("profil_id", userData.user.id).returns<BadgeManuel[]>(),
      // Compteur, classement et liste des eleves : fonction reservee aux membres (migration 0031).
      supabase.rpc("stats_communaute", { p_espace: espace.id }),
      supabase.from("ressources").select("id, titre, description").eq("espace_id", espace.id).order("type").order("ordre").limit(4),
    ]);
  const stats = statsRpc as StatsCommunaute | null;

  const sectionsTerminees = new Set((progressionRows ?? []).map((p) => p.section_id));
  const streak = calculerStreak((progressionRows ?? []).map((p) => p.completed_at));

  const sectionsParModule = new Map<string, Section[]>();
  (sections ?? []).forEach((s) => {
    sectionsParModule.set(s.module_id, [...(sectionsParModule.get(s.module_id) ?? []), s]);
  });

  // Plus aucun verrou : tous les modules sont ouverts. Le bloc "reprendre" pointe vers
  // la premiere section non terminee QUI A DU CONTENU (texte ou video), pour ne pas
  // renvoyer l'eleve vers une section vide. S'il n'en reste aucune, on retombe sur la
  // premiere section non terminee, quelle qu'elle soit.
  // Boucle plutot que map : les variables sont reassignees pendant le parcours, ce que
  // React interdit dans un callback (regle react-hooks/immutability).
  let moduleCourant: { module: Module; section: Section } | null = null;
  let premiereNonTerminee: { module: Module; section: Section } | null = null;
  const modulesAffiches: { module: Module; sections: Section[] }[] = [];
  for (const m of modules ?? []) {
    const secs = sectionsParModule.get(m.id) ?? [];
    for (const s of secs) {
      if (sectionsTerminees.has(s.id)) continue;
      if (!premiereNonTerminee) premiereNonTerminee = { module: m, section: s };
      if (!moduleCourant && (s.a_contenu || s.video_path)) moduleCourant = { module: m, section: s };
    }
    modulesAffiches.push({ module: m, sections: secs });
  }
  moduleCourant = moduleCourant ?? premiereNonTerminee;

  const totalSections = (sections ?? []).length;
  const totalTerminees = (sections ?? []).filter((s) => sectionsTerminees.has(s.id)).length;
  const pctGlobal = totalSections > 0 ? Math.round((totalTerminees / totalSections) * 100) : 0;

  // Activite recente : les dernieres sections terminees, les plus recentes d'abord.
  const titreParSection = new Map((sections ?? []).map((s) => [s.id, s.titre]));
  const activiteRecente = [...(progressionRows ?? [])]
    .sort((a, b) => b.completed_at.localeCompare(a.completed_at))
    .slice(0, 4)
    .map((p) => ({ titre: titreParSection.get(p.section_id) ?? "Une leçon", date: p.completed_at }));

  const niveauActuel = niveauDe(profil?.points ?? 0, niveaux);
  const niveauSuivant = prochainNiveau(profil?.points ?? 0, niveaux);

  // Devoirs, notes et echeances : donnees reelles (migration 0043).
  const remiseParDevoir = new Map((remises ?? []).map((r) => [r.devoir_id, r]));
  const maintenant = new Date().getTime();
  const echeances = (devoirs ?? [])
    .map((d) => ({ devoir: d, remise: remiseParDevoir.get(d.id) ?? null }))
    .filter(({ remise }) => !remise) // deja rendu : ne compte plus comme echeance a venir
    .sort((a, b) => a.devoir.date_limite.localeCompare(b.devoir.date_limite));

  const ilYA7Jours = new Date(maintenant - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Badges automatiques : calcules depuis la progression deja reelle, jamais stockes.
  const badgesAuto = [
    { libelle: "Premier pas", emoji: "🌱", obtenu: totalTerminees >= 1 },
    { libelle: "Série de 7 jours", emoji: "🔥", obtenu: streak >= 7 },
    { libelle: "Formation terminée", emoji: "🎓", obtenu: totalSections > 0 && pctGlobal === 100 },
  ];
  const badgesObtenus = [
    ...badgesAuto.filter((b) => b.obtenu).map((b) => ({ libelle: b.libelle, emoji: b.emoji })),
    ...(badgesManuels ?? []).map((b) => ({ libelle: b.libelle, emoji: b.emoji })),
  ];

  // Modules complets (toutes les sections terminees) : c'est ce que la maquette appelle "modules completes".
  const dateParSection = new Map((progressionRows ?? []).map((p) => [p.section_id, p.completed_at]));
  const modulesComplets = modulesAffiches.filter(({ sections: secs }) => secs.length > 0 && secs.every((s) => sectionsTerminees.has(s.id)));
  const modulesCompletsSemaine = modulesComplets.filter(({ sections: secs }) =>
    (secs.map((s) => dateParSection.get(s.id) ?? "").sort().pop() ?? "") >= ilYA7Jours
  ).length;

  // Resume par module pour la maquette : progression reelle, lien vers la premiere lecon non terminee.
  const resumes: ModuleResume[] = modulesAffiches.map(({ module, sections: secs }, i) => {
    const faites = secs.filter((s) => sectionsTerminees.has(s.id)).length;
    const cible = secs.find((s) => !sectionsTerminees.has(s.id) && s.a_contenu) ?? secs.find((s) => !sectionsTerminees.has(s.id)) ?? secs[0];
    return {
      id: module.id, rang: i, titre: module.titre, faites, total: secs.length,
      pct: secs.length > 0 ? Math.round((faites / secs.length) * 100) : 0,
      lien: cible ? `/${espace.slug}/formation/${cible.id}` : `/${espace.slug}/formation`,
    };
  });
  const courantModule = moduleCourant ? resumes.find((r) => r.id === moduleCourant!.module.id) ?? null : null;
  const lienCourant = moduleCourant?.section.a_contenu
    ? `/${espace.slug}/formation/${moduleCourant.section.id}`
    : `/${espace.slug}/formation`;

  // Prochaines sessions : les memes evenements que le calendrier (masterclasses et appels decouverte).
  let evenements: EvenementCalendrier[] = [];
  try {
    const tous = await chargerEvenements(supabase, { id: espace.id, slug: espace.slug }, userData.user.id, parseMois(undefined));
    evenements = tous.filter((e) => e.debut >= new Date().toISOString()).slice(0, 3);
  } catch {
    // ponytail: un calendrier en erreur ne doit pas casser le tableau de bord, le bloc affiche "aucune session".
  }

  const salutation = salutationConakry();

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/communaute`} className="hover:text-[var(--sarcelle)]">
            Communaute
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Ma progression
          </span>
          <Link href={`/${espace.slug}/formation`} className="hover:text-[var(--sarcelle)]">
            Formation
          </Link>
          <Link href={`/${espace.slug}/ressources`} className="hover:text-[var(--sarcelle)]">
            Ressources
          </Link>
          <Link href={`/${espace.slug}/expert`} className="hover:text-[var(--sarcelle)]">
            Devenir Expert
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-7 sm:py-8">
        <BandeauAccueil
          salutation={salutation}
          pseudo={profil?.pseudo ?? ""}
          pctGlobal={pctGlobal}
          modulesCompletes={modulesComplets.length}
          totalModules={modulesAffiches.length}
          lienReprise={lienCourant}
        />

        {/* "Heures d'apprentissage" de la maquette : aucune mesure du temps en base, remplace par la serie de jours. */}
        <CartesStats
          stats={[
            { icone: "cap", libelle: "Modules complétés", valeur: modulesComplets.length, sur: modulesAffiches.length, delta: modulesCompletsSemaine },
            { icone: "flamme", libelle: "Jours de suite", valeur: streak },
            { icone: "trophee", libelle: "Badges obtenus", valeur: badgesObtenus.length },
            { icone: "membres", libelle: "Membres de la communauté", valeur: stats ? stats.nb_membres : null },
          ]}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="flex min-w-0 flex-col gap-6">
            <FormationEnCours
              espaceSlug={espace.slug}
              courant={
                moduleCourant && courantModule
                  ? { module: courantModule, titreSection: moduleCourant.section.titre, lien: lienCourant }
                  : null
              }
              actionTerminer={
                moduleCourant ? (
                  <form action={marquerSectionTerminee.bind(null, espace.slug, moduleCourant.section.id)}>
                    <button type="submit" className="text-xs font-bold text-[var(--sarcelle-texte)] underline">
                      Marquer comme terminée
                    </button>
                  </form>
                ) : null
              }
            />
            <ListeModules modules={resumes} />
            <ProchainesSessions espaceSlug={espace.slug} evenements={evenements} />
            <RessourcesUtiles espaceSlug={espace.slug} ressources={ressources ?? []} />

            {/* Hors maquette, gardes pour ne perdre aucune fonction : echeances des devoirs, detail des lecons, activite, temoignage. */}
            <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
              <div className="font-display mb-3.5 text-[14px] font-bold">Mes prochaines échéances</div>
              {echeances.length === 0 ? (
                <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune échéance pour le moment.</p>
              ) : (
                <div className="flex flex-col gap-2.5">
                  {echeances.map(({ devoir }) => {
                    const enRetard = new Date(devoir.date_limite).getTime() < maintenant;
                    return (
                      <Link
                        key={devoir.id}
                        href={`/${espace.slug}/devoirs/${devoir.id}`}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[var(--ligne)] px-3.5 py-2.5 hover:border-[var(--sarcelle)]"
                      >
                        <span className="text-[12.5px] font-bold">{devoir.titre}</span>
                        <span className={`shrink-0 rounded-[5px] px-1.5 py-px font-mono text-[10px] font-bold ${enRetard ? "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]" : "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]"}`}>
                          {enRetard ? "En retard" : new Date(devoir.date_limite).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {modulesAffiches.length > 0 && (
              <div>
                <p className="mb-3.5 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">Détail de ta formation</p>
                {modulesAffiches.map(({ module, sections: secs }) => (
                  <ModuleCard
                    key={module.id}
                    espaceSlug={espace.slug}
                    titre={module.titre}
                    sections={secs}
                    sectionsTerminees={sectionsTerminees}
                  />
                ))}
              </div>
            )}

            <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
              <div className="font-display mb-3 text-[14px] font-bold">Activité récente</div>
              {activiteRecente.length === 0 ? (
                <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune activité pour le moment.</p>
              ) : (
                activiteRecente.map((a, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-1.5 text-[12.5px]">
                    <span>Tu as terminé « {a.titre} »</span>
                    <span className="shrink-0 font-mono text-[10.5px] text-[var(--texte-mute)]">{tempsEcoule(a.date)}</span>
                  </div>
                ))
              )}
            </div>

            <FormulaireTemoignage espaceSlug={espace.slug} />
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <ProfilProgression
              pct={pctGlobal}
              lignes={[
                { icone: "cap", libelle: "Modules complétés", valeur: `${modulesComplets.length} / ${modulesAffiches.length}` },
                { icone: "trophee", libelle: "Badges obtenus", valeur: String(badgesObtenus.length) },
                { icone: "flamme", libelle: "Jours de suite", valeur: String(streak) },
                { icone: "niveau", libelle: "Niveau actuel", valeur: niveauActuel.libelle },
                { icone: "niveau", libelle: "Points", valeur: `${profil?.points ?? 0}${niveauSuivant ? ` / ${niveauSuivant.points_requis}` : ""}` },
              ]}
            />
            <MonCalendrier espaceSlug={espace.slug} evenements={evenements} />
            <MaCommunaute espaceSlug={espace.slug} nbMembres={stats ? stats.nb_membres : null} eleves={stats?.eleves ?? []} />
            <CarteClassement espaceSlug={espace.slug} classement={stats?.classement ?? []} />
            <CarteCitation />

            <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
              <div className="font-display mb-3.5 text-[14px] font-bold">Mes badges</div>
              {badgesObtenus.length === 0 ? (
                <p className="text-[12.5px] text-[var(--texte-mute)]">Aucun badge obtenu pour le moment.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {badgesObtenus.map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--ligne)] py-3 text-center">
                      <span className="text-2xl" aria-hidden="true">{b.emoji}</span>
                      <span className="text-[10.5px] font-bold leading-tight">{b.libelle}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={`/${espace.slug}/objectifs`}
              className="block rounded-2xl bg-[var(--encre)] p-5 text-center text-[12.5px] font-bold text-[var(--sur-encre)]"
            >
              Voir mes objectifs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
