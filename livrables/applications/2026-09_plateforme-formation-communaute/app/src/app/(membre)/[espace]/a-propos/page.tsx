import Link from "next/link";
import { contexteMembre } from "@/lib/contexte-membre";
import { urlIntegration } from "@/lib/youtube";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { MessageAccueil } from "@/components/communaute/MessageAccueil";

// Page "A propos" d'un espace (migration 0035) : video de presentation, texte, message
// d'accueil et regles. Reservee aux membres : la policy de presentations_espace ne renvoie
// rien a un non-membre, et la page l'annonce avant meme de la lire.
export default async function AProposPage({ params }: { params: Promise<{ espace: string }> }) {
  const { espace: slug } = await params;
  const { supabase, espace, estMembre } = await contexteMembre(slug);

  const entete = (
    <EnTeteMembre
      espaceSlug={espace.slug}
      espaceNom={espace.nom}
      titre="A propos"
      retour={{ href: `/${espace.slug}/communaute`, libelle: "← Retour au fil" }}
    />
  );

  if (!estMembre) {
    return (
      <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
        {entete}
        <div className="mx-auto max-w-xl p-7 text-center">
          <p className="text-sm text-[var(--texte-mute)]">
            Cette page est réservée aux membres de {espace.nom}.
          </p>
          <Link
            href={`/${espace.slug}/communaute`}
            className="mt-4 inline-block font-mono text-[13px] font-bold text-[var(--sarcelle)]"
          >
            Rejoindre la communauté →
          </Link>
        </div>
      </div>
    );
  }

  const [{ data: presentation }, { data: stats }] = await Promise.all([
    supabase
      .from("presentations_espace")
      .select("video_youtube_id, description")
      .eq("espace_id", espace.id)
      .maybeSingle(),
    supabase.rpc("stats_communaute", { p_espace: espace.id }),
  ]);

  const urlVideo = presentation?.video_youtube_id ? urlIntegration(presentation.video_youtube_id) : null;
  const nbMembres = (stats as { nb_membres?: number } | null)?.nb_membres ?? null;
  const vide = !urlVideo && !presentation?.description;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      {entete}
      <div className="mx-auto max-w-2xl p-5 sm:p-7">
        <h1 className="font-display text-[23px] font-extrabold tracking-tight">À propos de {espace.nom}</h1>
        {nbMembres !== null && (
          <p className="mt-1 font-mono text-[12px] text-[var(--texte-mute)]">
            {nbMembres} membre{nbMembres > 1 ? "s" : ""}
          </p>
        )}

        {urlVideo && (
          <div className="mt-5 overflow-hidden rounded-[14px] border border-[var(--ligne)] bg-black">
            <iframe
              src={urlVideo}
              title={`Vidéo de présentation de ${espace.nom}`}
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
              className="aspect-video w-full"
            />
          </div>
        )}

        {presentation?.description && (
          <p className="mt-5 whitespace-pre-wrap break-words text-[14px] leading-[1.7]">{presentation.description}</p>
        )}

        {vide && (
          <p className="mt-5 rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
            La présentation de {espace.nom} n&apos;est pas encore rédigée.
          </p>
        )}

        <div className="mt-6">
          <MessageAccueil espaceId={espace.id} />
        </div>
      </div>
    </div>
  );
}
