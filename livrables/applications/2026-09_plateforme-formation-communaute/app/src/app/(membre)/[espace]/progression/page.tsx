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

  const { data: modules } = await supabase
    .from("modules")
    .select("*")
    .eq("espace_id", espace.id)
    .order("ordre")
    .returns<Module[]>();

  const moduleIds = (modules ?? []).map((m) => m.id);
  const { data: sections } = moduleIds.length
    ? await supabase.from("sections").select("*").in("module_id", moduleIds).order("ordre").returns<Section[]>()
    : { data: [] as Section[] };

  const { data: progressionRows } = await supabase
    .from("progression")
    .select("section_id, completed_at")
    .eq("profil_id", userData.user.id);

  const { data: acces } = await supabase
    .from("acces_payant")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<AccesPayant>();

  const sectionsTerminees = new Set((progressionRows ?? []).map((p) => p.section_id));
  const streak = calculerStreak((progressionRows ?? []).map((p) => p.completed_at));

  const sectionsParModule = new Map<string, Section[]>();
  (sections ?? []).forEach((s) => {
    sectionsParModule.set(s.module_id, [...(sectionsParModule.get(s.module_id) ?? []), s]);
  });

  let moduleCourant: { titre: string; section: Section } | null = null;
  let precedentComplet = true;
  const modulesAffiches = (modules ?? []).map((m) => {
    const secs = sectionsParModule.get(m.id) ?? [];
    const complet = secs.length > 0 && secs.every((s) => sectionsTerminees.has(s.id));
    const verrouille = !precedentComplet;
    if (!verrouille && !moduleCourant) {
      const prochaine = secs.find((s) => !sectionsTerminees.has(s.id));
      if (prochaine) moduleCourant = { titre: m.titre, section: prochaine };
    }
    precedentComplet = precedentComplet && complet;
    return { module: m, sections: secs, verrouille };
  });

  const totalSections = (sections ?? []).length;
  const totalTerminees = (sections ?? []).filter((s) => sectionsTerminees.has(s.id)).length;
  const pctGlobal = totalSections > 0 ? Math.round((totalTerminees / totalSections) * 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex gap-6 font-mono text-[13px] font-bold text-[var(--texte-mute)]">
          <Link href={`/${espace.slug}/communaute`} className="hover:text-[var(--sarcelle)]">
            Communaute
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Ma progression
          </span>
          <span className="opacity-50" title="A venir">Formation</span>
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
              <form
                action={marquerSectionTerminee.bind(
                  null,
                  espace.slug,
                  (moduleCourant as { section: Section }).section.id
                )}
              >
                <button
                  type="submit"
                  className="rounded-[9px] bg-[var(--corail)] px-[22px] py-3 text-[13px] font-extrabold text-[var(--encre)]"
                >
                  Continuer →
                </button>
              </form>
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

        {modulesAffiches.map(({ module, sections: secs, verrouille }) => (
          <ModuleCard
            key={module.id}
            espaceSlug={espace.slug}
            titre={module.titre}
            sections={secs}
            sectionsTerminees={sectionsTerminees}
            verrouille={verrouille}
          />
        ))}

        {!acces?.actif && (
          <div className="mt-5 flex items-center justify-between rounded-2xl border border-dashed border-[var(--sarcelle)] bg-[var(--fond-carte)] px-[22px] py-[18px]">
            <div>
              <b className="font-display block text-sm">Rejoins la communaute payante</b>
              <span className="text-xs text-[var(--texte-mute)]">
                Exercices hebdomadaires et echanges avec les autres eleves de {espace.nom}.
              </span>
            </div>
            <Link
              href={`/${espace.slug}/communaute-payante`}
              className="whitespace-nowrap rounded-[9px] border-[1.5px] border-[var(--sarcelle)] px-[18px] py-2.5 text-[12.5px] font-bold text-[var(--sarcelle)]"
            >
              Voir la communaute
            </Link>
          </div>
        )}

        <FormulaireTemoignage espaceSlug={espace.slug} />
      </div>
    </div>
  );
}
