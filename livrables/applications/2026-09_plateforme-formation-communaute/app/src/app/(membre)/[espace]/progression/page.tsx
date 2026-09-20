import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { marquerSectionTerminee } from "./actions";
import { ModuleCard } from "@/components/progression/ModuleCard";
import { AnneauProgression } from "@/components/progression/AnneauProgression";
import { FormulaireTemoignage } from "@/components/progression/FormulaireTemoignage";
import type { AccesPayant, Module, Section } from "@/types/membre";

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
    .select("pseudo")
    .eq("id", userData.user.id)
    .maybeSingle();

  const { data: acces } = await supabase
    .from("acces_payant")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<AccesPayant>();

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

  const { data: progressionRows } = await supabase
    .from("progression")
    .select("section_id, completed_at")
    .eq("profil_id", userData.user.id);

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

  let urlVideoCourante: string | null = null;
  if (moduleCourant && (moduleCourant as { section: Section }).section.video_path) {
    const { data: urlSignee } = await supabase.storage
      .from("videos-cours")
      .createSignedUrl((moduleCourant as { section: Section }).section.video_path!, 3600);
    urlVideoCourante = urlSignee?.signedUrl ?? null;
  }

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

      <div className="mx-auto max-w-3xl px-7 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-display text-[23px] font-extrabold tracking-tight">
              Bonjour {profil?.pseudo ?? ""}
            </p>
            {moduleCourant && (
              <p className="mt-1.5 text-[13px] text-[var(--texte-mute)]">
                Continue avec &quot;{(moduleCourant as { titre: string }).titre}&quot;
              </p>
            )}
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-2 rounded-full border border-[rgba(255,122,77,0.25)] bg-[rgba(255,122,77,0.1)] px-4 py-2 font-mono text-xs font-bold text-[var(--corail)]">
              🔥 {streak} jour{streak > 1 ? "s" : ""} de suite
            </div>
          )}
        </div>

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
          <div className="flex items-center rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-[22px]">
            <AnneauProgression pct={pctGlobal} />
          </div>
        </div>

        <p className="mb-3.5 mt-7 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
          Ta formation
        </p>

        {modulesAffiches.map(({ module, sections: secs }) => (
          <ModuleCard
            key={module.id}
            espaceSlug={espace.slug}
            titre={module.titre}
            sections={secs}
            sectionsTerminees={sectionsTerminees}
          />
        ))}

        <FormulaireTemoignage espaceSlug={espace.slug} />
      </div>
    </div>
  );
}
