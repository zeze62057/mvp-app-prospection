import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import type { AccesPayant, Module, Section } from "@/types/membre";

// Catalogue complet du programme (voir nav de la maquette CommunautePayante.dc.html,
// distinct de /progression : ici pas de suivi personnel, juste la table des
// matieres complete). Meme gate payant que /progression et /ressources.
// Cadrage du 2026-09-16.
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
  const { data: sections } = moduleIds.length
    ? await supabase.from("sections").select("id, module_id, ordre, titre, video_path, a_contenu").in("module_id", moduleIds).order("ordre").returns<Section[]>()
    : { data: [] as Section[] };

  const sectionsParModule = new Map<string, Section[]>();
  (sections ?? []).forEach((s) => {
    sectionsParModule.set(s.module_id, [...(sectionsParModule.get(s.module_id) ?? []), s]);
  });

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex gap-6 font-mono text-[13px] font-bold text-[var(--texte-mute)]">
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

      <div className="mx-auto max-w-3xl px-7 py-8">
        <p className="font-display text-[23px] font-extrabold tracking-tight">
          Le programme complet
        </p>
        <p className="mt-1.5 text-[13px] text-[var(--texte-mute)]">
          Tous les modules et sections de {espace.nom}. Pour ton suivi personnel, va sur Ma progression.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {(modules ?? []).map((m) => {
            const secs = sectionsParModule.get(m.id) ?? [];
            return (
              <div key={m.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
                <p className="font-display text-base font-bold">{m.titre}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {secs.map((s) => (
                    <li key={s.id} className="flex items-center justify-between text-[13px] text-[var(--texte-mute)]">
                      {s.a_contenu || s.video_path ? (
                        <Link
                          href={`/${espace.slug}/formation/${s.id}`}
                          className="text-[var(--texte)] hover:text-[var(--sarcelle)] hover:underline"
                        >
                          {s.titre}
                        </Link>
                      ) : (
                        <span>{s.titre}</span>
                      )}
                      {s.video_path && (
                        <span className="font-mono text-[10px] uppercase tracking-wide text-[var(--sarcelle)]">
                          video
                        </span>
                      )}
                    </li>
                  ))}
                  {secs.length === 0 && (
                    <li className="text-[13px] text-[var(--texte-mute)]">Aucune section pour l&apos;instant.</li>
                  )}
                </ul>
              </div>
            );
          })}
          {(modules ?? []).length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">Aucun module pour l&apos;instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}
