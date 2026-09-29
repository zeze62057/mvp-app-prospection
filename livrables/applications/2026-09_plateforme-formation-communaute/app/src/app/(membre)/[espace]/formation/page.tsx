import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { MontagneDrapeau, Vignette } from "@/components/progression/BlocsTableauDeBord";
import type { AccesPayant, Module, Section } from "@/types/membre";

// Catalogue complet du programme, refait d'apres la maquette du 2026-09-29. Distinct de /progression :
// ici la table des matieres complete, avec le statut reel de chaque module (progression de l'eleve).
// Photos de la maquette remplacees par des illustrations Vivier, logo feuille remplace par la Cle.
// Meme gate payant que /progression et /ressources. Cadrage du 2026-09-16.
export default async function FormationPage({
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
          formation — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Formation pas encore debloquee
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Le catalogue complet du programme est reserve aux eleves ayant
          debloque la formation complete.
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
  const [{ data: sections }, { data: progressionRows }] = await Promise.all([
    moduleIds.length
      ? supabase.from("sections").select("id, module_id, ordre, titre, video_path, a_contenu").in("module_id", moduleIds).order("ordre").returns<Section[]>()
      : Promise.resolve({ data: [] as Section[] }),
    supabase.from("progression").select("section_id").eq("profil_id", userData.user.id),
  ]);

  const terminees = new Set((progressionRows ?? []).map((p) => p.section_id));
  const sectionsParModule = new Map<string, Section[]>();
  (sections ?? []).forEach((s) => {
    sectionsParModule.set(s.module_id, [...(sectionsParModule.get(s.module_id) ?? []), s]);
  });

  const ouvrable = (s: Section) => s.a_contenu || !!s.video_path;
  const modulesAffiches = (modules ?? []).map((m, rang) => {
    const secs = sectionsParModule.get(m.id) ?? [];
    const faites = secs.filter((s) => terminees.has(s.id)).length;
    const pct = secs.length > 0 ? Math.round((faites / secs.length) * 100) : 0;
    const statut = secs.length > 0 && faites === secs.length ? "Terminé" : faites > 0 ? "En cours" : "Non commencé";
    // Chevron : premiere lecon non terminee qui s'ouvre, sinon la premiere qui s'ouvre.
    const cible = secs.find((s) => !terminees.has(s.id) && ouvrable(s)) ?? secs.find(ouvrable);
    return { m, rang, secs, faites, pct, statut, lien: cible ? `/${espace.slug}/formation/${cible.id}` : null };
  });
  // Module mis en avant (bordure verte) : le premier pas encore termine.
  const idCourant = modulesAffiches.find((x) => x.secs.length > 0 && x.statut !== "Terminé")?.m.id;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/progression`} className="hover:text-[var(--sarcelle)]">
            Ma progression
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Formation
          </span>
          <Link href={`/${espace.slug}/ressources`} className="hover:text-[var(--sarcelle)]">
            Ressources
          </Link>
          <Link href={`/${espace.slug}/expert`} className="hover:text-[var(--sarcelle)]">
            Devenir Expert
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-7 sm:py-8">
        <section
          className="anim-entree relative mb-6 overflow-hidden rounded-3xl px-6 py-8 text-[var(--sur-encre)] sm:px-9"
          style={{
            background:
              "radial-gradient(circle at 12% 0%, rgba(95,199,184,0.34), transparent 52%), radial-gradient(circle at 70% 0%, rgba(255,122,77,0.22), transparent 44%), linear-gradient(135deg, #16443c, #0b2622)",
          }}
        >
          <MontagneDrapeau />
          {/* La Cle de la marque : anneau et point d'acces */}
          <svg aria-hidden className="anim-flotte pointer-events-none absolute right-6 top-1/2 hidden h-24 w-24 -translate-y-1/2 sm:block" viewBox="0 0 120 120" fill="none">
            <circle cx="45" cy="75" r="22" stroke="#5FC7B8" strokeOpacity="0.7" strokeWidth="9" />
            <line x1="61" y1="59" x2="95" y2="25" stroke="#5FC7B8" strokeOpacity="0.7" strokeWidth="9" strokeLinecap="round" />
            <circle className="anim-lueur" cx="95" cy="25" r="9" fill="#FF7A4D" />
          </svg>
          <div className="relative md:max-w-[52%]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(234,245,242,0.25)] px-3 py-1 font-mono text-[10.5px] font-bold text-[var(--sarcelle-light)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--sarcelle-light)]" aria-hidden />
              Espace Formation
            </span>
            <h1 className="font-display mt-3 text-[30px] font-extrabold leading-tight tracking-tight sm:text-[36px]">
              Le programme complet
            </h1>
            <p className="mt-2 text-[13.5px] text-[var(--sur-encre-mute)]">
              Tous les modules et sections de {espace.nom}. Pour ton suivi personnel, va sur{" "}
              <Link href={`/${espace.slug}/progression`} className="font-bold text-[var(--sarcelle-light)] underline">
                Ma progression
              </Link>
              .
            </p>
          </div>
        </section>

        <div className="flex flex-col gap-4">
          {modulesAffiches.map(({ m, rang, secs, faites, pct, statut, lien }) => (
            <div
              key={m.id}
              className={`anim-entree rounded-2xl border bg-[var(--fond-carte)] p-4 sm:p-5 ${m.id === idCourant ? "border-[var(--sarcelle)] shadow-[0_0_0_3px_rgba(43,140,130,0.10)]" : "border-[var(--ligne)]"}`}
              style={{ animationDelay: `${Math.min(rang, 6) * 70}ms` }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
                <Vignette rang={rang} className="h-40 w-full sm:h-auto sm:min-h-[150px] sm:w-[170px]" />

                <div className="flex min-w-0 flex-1 gap-3.5">
                  <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(43,140,130,0.14)] text-[14px] font-extrabold text-[var(--sarcelle-texte)]">
                    {String(rang + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[16px] font-bold">{m.titre}</h2>
                    <ul className="mt-2.5 flex flex-col gap-1">
                      {secs.map((s) => {
                        const fait = terminees.has(s.id);
                        return (
                          <li key={s.id} className="flex items-center gap-2 text-[12.5px]">
                            <span aria-hidden className={`w-3 shrink-0 text-[11px] ${fait ? "font-bold text-[var(--sarcelle)]" : "text-[var(--sarcelle)]"}`}>
                              {fait ? "✓" : "▸"}
                            </span>
                            {ouvrable(s) ? (
                              <Link href={`/${espace.slug}/formation/${s.id}`} className="min-w-0 truncate text-[var(--texte)] hover:text-[var(--sarcelle)] hover:underline">
                                {s.titre}
                              </Link>
                            ) : (
                              <span className="min-w-0 truncate text-[var(--texte-mute)]">{s.titre}</span>
                            )}
                            {s.video_path && (
                              <span className="shrink-0 font-mono text-[10px] uppercase tracking-wide text-[var(--sarcelle)]">vidéo</span>
                            )}
                          </li>
                        );
                      })}
                      {secs.length === 0 && (
                        <li className="text-[12.5px] text-[var(--texte-mute)]">Aucune section pour l&apos;instant.</li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex shrink-0 flex-row items-center justify-between gap-4 sm:w-[210px] sm:flex-col sm:items-end sm:justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 font-mono text-[10.5px] font-bold ${statut === "Non commencé" ? "bg-[var(--fond)] text-[var(--texte-mute)]" : "bg-[rgba(43,140,130,0.14)] text-[var(--sarcelle-texte)]"}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
                      {statut}
                    </span>
                    {lien && (
                      <Link href={lien} aria-label={`Ouvrir ${m.titre}`} className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--ligne)] text-[var(--texte-mute)] hover:border-[var(--sarcelle)] hover:text-[var(--sarcelle)]">
                        ›
                      </Link>
                    )}
                  </div>
                  <div className="w-full max-w-[210px]">
                    <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-[var(--texte-mute)]">
                      <span>{secs.length} section{secs.length > 1 ? "s" : ""}</span>
                      {secs.length > 0 && <span className="font-bold text-[var(--sarcelle-texte)]">{faites} / {secs.length}</span>}
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--ligne)]">
                      <div className="h-full rounded-full bg-[var(--sarcelle)]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {modulesAffiches.length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">Aucun module pour l&apos;instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}
