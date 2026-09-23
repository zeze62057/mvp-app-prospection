import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { marquerSectionTerminee } from "./actions";
import { ModuleCard } from "@/components/progression/ModuleCard";
import { AnneauProgression } from "@/components/progression/AnneauProgression";
import { FormulaireTemoignage } from "@/components/progression/FormulaireTemoignage";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { urlsAvatars } from "@/lib/avatars";
import { chargerNiveaux } from "@/lib/niveaux-donnees";
import { niveauDe, prochainNiveau } from "@/lib/niveaux";
import { tempsEcoule } from "@/lib/temps";
import type { AccesPayant, BadgeManuel, Devoir, DevoirRemise, Module, Section } from "@/types/membre";

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
    .select("pseudo, role, points, avatar_path")
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

  const [{ data: progressionRows }, niveaux, { data: devoirs }, { data: remises }, { data: badgesManuels }] =
    await Promise.all([
      supabase.from("progression").select("section_id, completed_at").eq("profil_id", userData.user.id),
      chargerNiveaux(supabase, espace.id),
      supabase.from("devoirs").select("*").eq("espace_id", espace.id).order("date_limite").returns<Devoir[]>(),
      supabase.from("devoirs_remises").select("*").eq("profil_id", userData.user.id).returns<DevoirRemise[]>(),
      supabase.from("badges_manuels").select("*").eq("espace_id", espace.id).eq("profil_id", userData.user.id).returns<BadgeManuel[]>(),
    ]);
  const photos = await urlsAvatars(profil ? [{ id: userData.user.id, avatar_path: profil.avatar_path }] : []);

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
  let moduleCourant: { titre: string; section: Section } | null = null;
  let premiereNonTerminee: { titre: string; section: Section } | null = null;
  const modulesAffiches: { module: Module; sections: Section[] }[] = [];
  for (const m of modules ?? []) {
    const secs = sectionsParModule.get(m.id) ?? [];
    for (const s of secs) {
      if (sectionsTerminees.has(s.id)) continue;
      if (!premiereNonTerminee) premiereNonTerminee = { titre: m.titre, section: s };
      if (!moduleCourant && (s.a_contenu || s.video_path)) moduleCourant = { titre: m.titre, section: s };
    }
    modulesAffiches.push({ module: m, sections: secs });
  }
  moduleCourant = moduleCourant ?? premiereNonTerminee;

  const totalSections = (sections ?? []).length;
  const totalTerminees = (sections ?? []).filter((s) => sectionsTerminees.has(s.id)).length;
  const pctGlobal = totalSections > 0 ? Math.round((totalTerminees / totalSections) * 100) : 0;

  // "Cours suivis" : un module compte comme suivi des qu'au moins une section est terminee.
  const modulesSuivis = modulesAffiches.filter(({ sections: secs }) => secs.some((s) => sectionsTerminees.has(s.id))).length;

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
  const notesObtenues = (remises ?? []).filter((r) => r.note !== null).map((r) => r.note as number);
  const moyenneGenerale = notesObtenues.length > 0 ? notesObtenues.reduce((s, n) => s + n, 0) / notesObtenues.length : null;
  const maintenant = new Date().getTime();
  const echeances = (devoirs ?? [])
    .map((d) => ({ devoir: d, remise: remiseParDevoir.get(d.id) ?? null }))
    .filter(({ remise }) => !remise) // deja rendu : ne compte plus comme echeance a venir
    .sort((a, b) => a.devoir.date_limite.localeCompare(b.devoir.date_limite));

  // Tendances "cette semaine" : uniquement quand elles se calculent depuis des
  // dates deja reelles (completion, remise, notation). La moyenne generale n'a
  // pas de tendance affichee tant qu'il n'y a pas de notes des deux cotes de la
  // semaine a comparer : jamais de delta invente. La serie de jours n'a pas de
  // tendance non plus : un delta n'aurait pas de sens pour un compteur qui se
  // reinitialise a chaque jour manque.
  const ilYA7Jours = new Date(maintenant - 7 * 24 * 60 * 60 * 1000).toISOString();
  const moduleIdParSection = new Map((sections ?? []).map((s) => [s.id, s.module_id]));
  const premiereCompletionParModule = new Map<string, string>();
  (progressionRows ?? []).forEach((p) => {
    const modId = moduleIdParSection.get(p.section_id);
    if (!modId) return;
    const actuel = premiereCompletionParModule.get(modId);
    if (!actuel || p.completed_at < actuel) premiereCompletionParModule.set(modId, p.completed_at);
  });
  const modulesSuivisSemaine = [...premiereCompletionParModule.values()].filter((d) => d >= ilYA7Jours).length;
  const devoirsRendusSemaine = (remises ?? []).filter((r) => r.rendu_at >= ilYA7Jours).length;
  const notesRecentes = (remises ?? [])
    .filter((r) => r.note !== null && r.note_le && r.note_le >= ilYA7Jours)
    .map((r) => r.note as number);
  const notesAnciennes = (remises ?? [])
    .filter((r) => r.note !== null && r.note_le && r.note_le < ilYA7Jours)
    .map((r) => r.note as number);
  const moyenneDelta =
    notesRecentes.length > 0 && notesAnciennes.length > 0
      ? notesRecentes.reduce((s, n) => s + n, 0) / notesRecentes.length -
        notesAnciennes.reduce((s, n) => s + n, 0) / notesAnciennes.length
      : null;

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

  let urlVideoCourante: string | null = null;
  if (moduleCourant && (moduleCourant as { section: Section }).section.video_path) {
    const { data: urlSignee } = await supabase.storage
      .from("videos-cours")
      .createSignedUrl((moduleCourant as { section: Section }).section.video_path!, 3600);
    urlVideoCourante = urlSignee?.signedUrl ?? null;
  }

  const dateDuJour = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

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

      <div className="mx-auto max-w-6xl px-7 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-[23px] font-extrabold tracking-tight">
              Bonjour {profil?.pseudo ?? ""} 👋
            </p>
            <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">
              Voici un aperçu de ton parcours et de tes dernières activités.
            </p>
            <p className="mt-1 text-[11px] capitalize text-[var(--texte-mute)]">{dateDuJour}</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-[rgba(255,122,77,0.25)] bg-[rgba(255,122,77,0.1)] px-4 py-2 font-mono text-xs font-bold text-[var(--corail)]">
              🔥 {streak} jour{streak > 1 ? "s" : ""} de suite
            </div>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <div className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
              {modulesSuivis} / {modulesAffiches.length}
            </div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">cours suivis</div>
            {modulesSuivisSemaine > 0 && (
              <div className="mt-1 text-[10.5px] font-bold text-[var(--sarcelle)]">↗ +{modulesSuivisSemaine} cette semaine</div>
            )}
          </div>
          <div className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
              {(remises ?? []).length} / {(devoirs ?? []).length}
            </div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">devoirs rendus</div>
            {devoirsRendusSemaine > 0 && (
              <div className="mt-1 text-[10.5px] font-bold text-[var(--sarcelle)]">↗ +{devoirsRendusSemaine} cette semaine</div>
            )}
          </div>
          {moyenneGenerale !== null ? (
            <div className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
              <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">{moyenneGenerale.toFixed(1)} / 20</div>
              <div className="mt-0.5 text-xs text-[var(--texte-mute)]">moyenne générale</div>
              {moyenneDelta !== null && (
                <div className={`mt-1 text-[10.5px] font-bold ${moyenneDelta >= 0 ? "text-[var(--sarcelle)]" : "text-[var(--corail)]"}`}>
                  {moyenneDelta >= 0 ? "↗ +" : "↘ "}{moyenneDelta.toFixed(1)} cette semaine
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--ligne)] bg-[var(--fond-carte)] p-4 opacity-70">
              <div className="font-display text-xl font-extrabold text-[var(--texte-mute)]">—</div>
              <div className="mt-0.5 text-xs text-[var(--texte-mute)]">moyenne générale</div>
              <div className="mt-1 font-mono text-[9px] font-bold text-[var(--texte-mute)]">Pas encore de note</div>
            </div>
          )}
          <div className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">{streak}</div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">jour{streak !== 1 ? "s" : ""} de suite</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">
              {moduleCourant ? (
                <div className="relative overflow-hidden rounded-2xl bg-[var(--encre)] px-7 py-[26px] text-[var(--sur-encre)]">
                  <p className="mb-2 font-mono text-[10.5px] uppercase tracking-wide text-[var(--sarcelle-light)]">
                    reprendre ou tu en etais
                  </p>
                  <p className="font-display mb-1 text-[17px] font-bold">
                    {(moduleCourant as { titre: string }).titre}
                  </p>
                  <p className="mb-4 text-[12.5px] text-[var(--sur-encre-mute)]">
                    {(moduleCourant as { section: Section }).section.titre}
                  </p>
                  {urlVideoCourante && (
                    <video
                      key={urlVideoCourante}
                      src={urlVideoCourante}
                      controls
                      className="mb-4 w-full rounded-lg"
                    />
                  )}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                    {(moduleCourant as { section: Section }).section.a_contenu && (
                      <Link
                        href={`/${espace.slug}/formation/${(moduleCourant as { section: Section }).section.id}`}
                        className="rounded-[9px] bg-[var(--corail)] px-[22px] py-3 text-[13px] font-extrabold text-[var(--encre)]"
                      >
                        Lire la leçon →
                      </Link>
                    )}
                    <form
                      action={marquerSectionTerminee.bind(
                        null,
                        espace.slug,
                        (moduleCourant as { section: Section }).section.id
                      )}
                    >
                      {(moduleCourant as { section: Section }).section.a_contenu ? (
                        <button type="submit" className="text-xs font-bold text-[var(--sarcelle-light)] underline">
                          Marquer comme terminée
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="rounded-[9px] bg-[var(--corail)] px-[22px] py-3 text-[13px] font-extrabold text-[var(--encre)]"
                        >
                          Continuer →
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex items-center rounded-2xl bg-[var(--encre)] px-7 py-[26px] text-[var(--sur-encre)]">
                  <p className="font-display text-[15px] font-bold">
                    Formation terminee, felicitations !
                  </p>
                </div>
              )}
              <div className="flex flex-col justify-center gap-4 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-[22px]">
                <div className="font-display text-[13px] font-bold">Ma progression</div>
                <AnneauProgression pct={pctGlobal} />
                {modulesAffiches.length > 0 && (
                  <div className="flex flex-col gap-2 border-t border-[var(--ligne)] pt-3.5">
                    {modulesAffiches.map(({ module, sections: secs }) => {
                      const pct = secs.length > 0 ? Math.round((secs.filter((s) => sectionsTerminees.has(s.id)).length / secs.length) * 100) : 0;
                      return (
                        <div key={module.id}>
                          <div className="mb-1 flex items-center justify-between text-[10.5px] text-[var(--texte-mute)]">
                            <span className="truncate">{module.titre}</span>
                            <span className="shrink-0 font-mono font-bold">{pct}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--fond)]">
                            <div className="h-full rounded-full bg-[var(--sarcelle)]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

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
              <>
                <p className="mb-3.5 mt-7 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
                  Mes cours en cours
                </p>
                <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {modulesAffiches.map(({ module, sections: secs }) => {
                    const pct = secs.length > 0 ? Math.round((secs.filter((s) => sectionsTerminees.has(s.id)).length / secs.length) * 100) : 0;
                    const premiereSection = secs[0];
                    return (
                      <div key={module.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
                        <div className="font-display mb-2 text-[13.5px] font-bold">{module.titre}</div>
                        <div className="mb-1 flex items-center justify-between text-[10.5px] text-[var(--texte-mute)]">
                          <span>Progression</span>
                          <span className="font-mono font-bold text-[var(--sarcelle)]">{pct}%</span>
                        </div>
                        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-[var(--fond)]">
                          <div className="h-full rounded-full bg-[var(--sarcelle)]" style={{ width: `${pct}%` }} />
                        </div>
                        {premiereSection ? (
                          <Link
                            href={`/${espace.slug}/formation/${premiereSection.id}`}
                            className="text-[11.5px] font-bold text-[var(--sarcelle)]"
                          >
                            Accéder au cours →
                          </Link>
                        ) : (
                          <span className="text-[11.5px] text-[var(--texte-mute)]">Aucune section pour le moment.</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <p className="mb-3.5 mt-7 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
              Ta formation
            </p>

            {modulesAffiches.length === 0 && (
              <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
                Aucun module pour le moment.
              </p>
            )}

            {modulesAffiches.map(({ module, sections: secs }) => (
              <ModuleCard
                key={module.id}
                espaceSlug={espace.slug}
                titre={module.titre}
                sections={secs}
                sectionsTerminees={sectionsTerminees}
              />
            ))}

            <p className="mb-3.5 mt-7 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
              Activité récente
            </p>
            <div className="mb-3.5 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
              {activiteRecente.length === 0 ? (
                <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune activité pour le moment.</p>
              ) : (
                activiteRecente.map((a, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-1.5 text-[12.5px]">
                    <span>
                      Tu as terminé « {a.titre} »
                    </span>
                    <span className="shrink-0 font-mono text-[10.5px] text-[var(--texte-mute)]">{tempsEcoule(a.date)}</span>
                  </div>
                ))
              )}
            </div>

            <FormulaireTemoignage espaceSlug={espace.slug} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5 text-center">
              <div className="mx-auto mb-2.5 h-16 w-16 overflow-hidden rounded-full">
                <Avatar id={userData.user.id} pseudo={profil?.pseudo ?? "Moi"} taille={64} urlPhoto={photos.get(userData.user.id) ?? null} />
              </div>
              <div className="font-display text-[15px] font-bold">{profil?.pseudo ?? "Moi"}</div>
              {userData.user.email && (
                <div className="mt-0.5 truncate text-[11px] text-[var(--texte-mute)]">{userData.user.email}</div>
              )}
              <div className="mt-3.5 border-t border-[var(--ligne)] pt-3.5 text-left">
                <div className="mb-1 flex items-center justify-between text-[11px] font-bold">
                  <span>{niveauActuel.libelle}</span>
                  <span className="font-mono text-[var(--sarcelle)]">
                    {profil?.points ?? 0}{niveauSuivant ? ` / ${niveauSuivant.points_requis} pts` : " pts"}
                  </span>
                </div>
                {niveauSuivant && (
                  <div className="h-1.5 overflow-hidden rounded-full bg-[var(--fond)]">
                    <div
                      className="h-full rounded-full bg-[var(--sarcelle)]"
                      style={{
                        width: `${Math.min(100, Math.round((((profil?.points ?? 0) - niveauActuel.points_requis) / (niveauSuivant.points_requis - niveauActuel.points_requis)) * 100))}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

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

            <div className="rounded-2xl bg-[var(--encre)] p-5 text-[var(--sur-encre)]">
              <p className="font-display mb-1.5 text-[14px] font-bold">Continue comme ça</p>
              <p className="mb-3.5 text-[12px] text-[var(--sur-encre-mute)]">
                Chaque leçon terminée te rapproche de la fin de la formation.
              </p>
              <Link
                href={`/${espace.slug}/objectifs`}
                className="block w-full rounded-[9px] bg-[var(--corail)] px-4 py-2.5 text-center text-[12px] font-bold text-[var(--encre)]"
              >
                Voir mes objectifs →
              </Link>
            </div>

            <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
              <div className="font-display mb-3.5 text-[13px] font-bold">Accès rapide</div>
              <div className="grid grid-cols-2 gap-2.5">
                <Link href={`/${espace.slug}/ressources`} className="rounded-lg border border-[var(--ligne)] px-3 py-2.5 text-center text-[11.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
                  Ressources
                </Link>
                <Link href={`/${espace.slug}/formation`} className="rounded-lg border border-[var(--ligne)] px-3 py-2.5 text-center text-[11.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
                  Formation
                </Link>
                <Link href={`/${espace.slug}/messages`} className="rounded-lg border border-[var(--ligne)] px-3 py-2.5 text-center text-[11.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
                  Messages
                </Link>
                <Link href={`/${espace.slug}/communaute-payante`} className="rounded-lg border border-[var(--ligne)] px-3 py-2.5 text-center text-[11.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
                  Communauté
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
