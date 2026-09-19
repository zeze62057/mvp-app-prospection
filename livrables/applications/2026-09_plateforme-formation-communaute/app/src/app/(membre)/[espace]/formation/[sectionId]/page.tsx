import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Markdown, { type Components } from "react-markdown";
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
const composants: Components = {
  h2: ({ children }) => <h2 className="font-display mb-3 mt-10 text-[20px] font-bold tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="font-display mb-2 mt-7 text-[16.5px] font-bold">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-2 mt-5 text-[15px] font-bold">{children}</h4>,
  p: ({ children }) => <p className="mb-4 text-[15px] leading-[1.75] text-[var(--texte)]">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1.5 text-[15px] leading-[1.7]">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-[15px] leading-[1.7]">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-[var(--texte)]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-xl border-l-4 border-[var(--sarcelle)] bg-[var(--fond-carte)] px-5 py-3 text-[14px] leading-relaxed text-[var(--texte-mute)] [&>p]:mb-2 [&>p]:text-[14px] [&>p]:text-[var(--texte-mute)] [&>p:last-child]:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-[var(--ligne)]" />,
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[var(--encre)] p-4 font-mono text-[12.5px] leading-relaxed text-[var(--sur-encre)]">
      {children}
    </pre>
  ),
  code: ({ children }) => <code className="font-mono text-[12.5px]">{children}</code>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--sarcelle)] underline">
      {children}
    </a>
  ),
};

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
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex gap-6 font-mono text-[13px] font-bold text-[var(--texte-mute)]">
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

      <article className="mx-auto max-w-2xl px-7 py-10">
        <Link href={`/${espace.slug}/formation`} className="text-xs font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
          ← Retour au programme
        </Link>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">{module.titre}</p>
        <h1 className="font-display mt-2 text-[28px] font-extrabold leading-tight tracking-tight">{section.titre}</h1>

        {urlVideo && (
          <video key={urlVideo} src={urlVideo} controls className="mt-6 w-full rounded-xl" />
        )}

        <div className="mt-8">
          {section.contenu ? (
            <Markdown components={composants}>{section.contenu}</Markdown>
          ) : (
            !urlVideo && (
              <p className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5 text-sm text-[var(--texte-mute)]">
                Cette lecon arrive bientot.
              </p>
            )
          )}
        </div>

        <div className="mt-10 border-t border-[var(--ligne)] pt-6">
          {dejaTerminee ? (
            <p className="font-mono text-[13px] font-bold text-[var(--sarcelle)]">✓ Lecon terminee</p>
          ) : (
            <form action={marquerSectionTerminee.bind(null, espace.slug, section.id)}>
              <button
                type="submit"
                className="rounded-[9px] bg-[var(--encre)] px-5 py-2.5 text-sm font-bold text-[var(--sur-encre)]"
              >
                Marquer cette lecon comme terminee
              </button>
            </form>
          )}

          <div className="mt-6 flex items-start justify-between gap-6 text-[13px]">
            {precedente ? (
              <Link href={lienLecon(precedente)} className="max-w-[45%] text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
                ← {precedente.titre}
              </Link>
            ) : (
              <span />
            )}
            {suivante ? (
              <Link href={lienLecon(suivante)} className="max-w-[45%] text-right font-semibold text-[var(--sarcelle)]">
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
