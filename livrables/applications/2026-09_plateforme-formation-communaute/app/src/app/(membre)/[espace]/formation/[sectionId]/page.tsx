import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Markdown from "react-markdown";
import { composants } from "@/components/formation/composants-lecon";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { marquerSectionTerminee } from "../../progression/actions";
import type { AccesPayant, Module, Section } from "@/types/membre";

// Lecon d'une section : texte Markdown (sections.contenu, voir migration 0023)
// et/ou video. Meme gate payant que /formation et /progression. La lecture des
// sections est deja restreinte aux membres payants par la RLS (migration 0008),
// ce controle-ci sert a afficher un message clair plutot qu'une page vide.
//
// Le Markdown est rendu par react-markdown, qui n'interprete pas le HTML brut
// par defaut : un contenu mal forme ne peut pas injecter de balises.

export default async function LeconPage({
  params,
}: {
  params: Promise<{ espace: string; sectionId: string }>;
}) {
  const { espace: slug, sectionId } = await params;
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
          lecon — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Lecon reservee aux eleves</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Les lecons sont accessibles une fois la formation complete debloquee.
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

  const { data: section } = await supabase
    .from("sections")
    .select("id, module_id, ordre, titre, video_path, a_contenu, contenu")
    .eq("id", sectionId)
    .maybeSingle<Section>();
  if (!section) notFound();

  const { data: module } = await supabase
    .from("modules")
    .select("id, espace_id, ordre, titre")
    .eq("id", section.module_id)
    .maybeSingle<Module>();
  // Une section d'un autre espace ne doit jamais s'afficher sous cet espace.
  if (!module || module.espace_id !== espace.id) notFound();

  const { data: sectionsDuModule } = await supabase
    .from("sections")
    .select("id, module_id, ordre, titre, video_path, a_contenu")
    .eq("module_id", module.id)
    .order("ordre")
    .returns<Section[]>();
  const liste = sectionsDuModule ?? [];
  const index = liste.findIndex((s) => s.id === section.id);
  const precedente = index > 0 ? liste[index - 1] : null;
  const suivante = index !== -1 && index < liste.length - 1 ? liste[index + 1] : null;

  const { data: dejaTerminee } = await supabase
    .from("progression")
    .select("id")
    .eq("profil_id", userData.user.id)
    .eq("section_id", section.id)
    .maybeSingle();

  let urlVideo: string | null = null;
  if (section.video_path) {
    const { data: urlSignee } = await supabase.storage
      .from("videos-cours")
      .createSignedUrl(section.video_path, 3600);
    urlVideo = urlSignee?.signedUrl ?? null;
  }

  const lienLecon = (s: Section) => `/${espace.slug}/formation/${s.id}`;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/progression`} className="hover:text-[var(--sarcelle)]">
            Ma progression
          </Link>
          <Link
            href={`/${espace.slug}/formation`}
            className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]"
          >
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

      <article className="mx-auto max-w-3xl px-5 py-8 sm:px-7 sm:py-10">
        <Link href={`/${espace.slug}/formation`} className="text-xs font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
          ← Retour au programme
        </Link>

        <header className="relative mt-5 overflow-hidden rounded-[20px] bg-gradient-to-br from-[var(--encre)] via-[var(--encre-2)] to-[var(--sarcelle)] p-6 text-[var(--sur-encre)] shadow-[0_10px_28px_rgba(0,0,0,0.2)] sm:p-8">
          <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full bg-[rgba(255,255,255,0.07)]" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full border-[16px] border-[rgba(255,255,255,0.06)]" />
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-[var(--corail)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--corail)] px-2.5 py-1 font-mono text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--encre)]">
                Module {module.ordre}
              </span>
              {index !== -1 && (
                <span className="rounded-full bg-[rgba(255,255,255,0.14)] px-2.5 py-1 font-mono text-[10.5px] font-bold">
                  Chapitre {index + 1} sur {liste.length}
                </span>
              )}
              {dejaTerminee && (
                <span className="rounded-full bg-[rgba(255,255,255,0.14)] px-2.5 py-1 font-mono text-[10.5px] font-bold">
                  ✓ Terminé
                </span>
              )}
            </div>
            <p className="mt-4 text-[12.5px] font-semibold text-[var(--sur-encre-mute)]">{module.titre}</p>
            <h1 className="font-display mt-1 text-[26px] font-extrabold leading-tight tracking-tight sm:text-[32px]">
              {section.titre}
            </h1>
          </div>
        </header>

        {/* Cadre de la video : toujours present, pour montrer a l'eleve ou elle se trouve. */}
        <figure className="mt-6 overflow-hidden rounded-[18px] border border-[var(--sarcelle)]/40 bg-[var(--encre)] shadow-[0_10px_28px_rgba(0,0,0,0.2)]">
          <figcaption className="flex items-center gap-2 bg-gradient-to-r from-[var(--sarcelle)] to-[var(--encre-2)] px-4 py-2.5 font-mono text-[11px] font-extrabold uppercase tracking-wide text-[var(--sur-encre)]">
            <span aria-hidden="true">▶</span> Vidéo du chapitre
          </figcaption>
          {urlVideo ? (
            // Vignette par convention de nom : public/vignettes/<espace>/m<module>-s<section>.png.
            // Une image absente laisse simplement le navigateur afficher la premiere image de la video.
            <video
              key={urlVideo}
              src={urlVideo}
              poster={`/vignettes/${espace.slug}/m${module.ordre}-s${section.ordre}.png`}
              controls
              className="aspect-video w-full bg-black"
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 px-6 text-center text-[var(--sur-encre)]">
              <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--corail)] text-[22px] text-[var(--encre)]">
                ▶
              </span>
              <b className="font-display text-[15px]">La vidéo de ce chapitre arrive bientôt</b>
              <span className="text-[12.5px] text-[var(--sur-encre-mute)]">Lis la leçon ci-dessous en attendant.</span>
            </div>
          )}
        </figure>

        <div className="mt-8 rounded-[18px] border border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-6 shadow-[0_4px_16px_rgba(0,0,0,0.05)] sm:px-8">
          {section.contenu ? (
            <Markdown components={composants}>{section.contenu}</Markdown>
          ) : (
            <p className="text-sm text-[var(--texte-mute)]">
              {urlVideo ? "Regarde la vidéo ci-dessus." : "Cette leçon arrive bientôt."}
            </p>
          )}
        </div>

        <div className="mt-10 border-t border-[var(--ligne)] pt-6">
          {dejaTerminee ? (
            <p className="rounded-xl bg-[rgba(43,140,130,0.1)] px-4 py-3 font-mono text-[13px] font-bold text-[var(--sarcelle)]">✓ Leçon terminée, bravo !</p>
          ) : (
            <form action={marquerSectionTerminee.bind(null, espace.slug, section.id)}>
              <button
                type="submit"
                className="rounded-[10px] bg-[var(--corail)] px-6 py-3 text-sm font-extrabold text-[var(--encre)] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
              >
                ✓ J&apos;ai terminé ce chapitre
              </button>
            </form>
          )}

          <div className="mt-6 flex items-start justify-between gap-6 text-[13px]">
            {precedente ? (
              <Link href={lienLecon(precedente)} className="max-w-[48%] rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 text-[var(--texte-mute)] hover:border-[var(--sarcelle)] hover:text-[var(--sarcelle)]">
                ← {precedente.titre}
              </Link>
            ) : (
              <span />
            )}
            {suivante ? (
              <Link href={lienLecon(suivante)} className="max-w-[48%] rounded-xl bg-[var(--sarcelle)] px-4 py-3 text-right font-bold text-[var(--sur-encre)] hover:opacity-90">
                {suivante.titre} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
