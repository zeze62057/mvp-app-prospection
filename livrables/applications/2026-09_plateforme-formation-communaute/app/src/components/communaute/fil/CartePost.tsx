import Link from "next/link";
import { basculerLike, epinglerPost } from "@/app/(membre)/[espace]/post/actions";
import { tempsEcoule } from "@/lib/temps";
import type { PostFil } from "@/lib/fil";
import { Avatar } from "./Avatar";
import { BoutonSignaler } from "@/components/moderation/BoutonSignaler";
import { BadgeMembre } from "@/components/communaute/BadgeMembre";

function IconePouce({ plein }: { plein: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={plein ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 10v11" />
      <path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7.5a2 2 0 0 1-1.9 1.4H7V10l4-8a2.5 2.5 0 0 1 4 3.9Z" />
    </svg>
  );
}

function IconeBulle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

export function BadgeAuteur({ auteur }: { auteur: PostFil["auteur"] }) {
  return <BadgeMembre estExpert={auteur.estExpert} role={auteur.role} points={auteur.points} />;
}

export function CartePost({
  espaceSlug,
  retour,
  item,
  estAdmin,
  userId,
  detail = false,
}: {
  espaceSlug: string;
  retour: string; // page a rafraichir apres une action (like, epingle)
  item: PostFil;
  estAdmin: boolean;
  userId: string;
  detail?: boolean; // page du post : texte complet, pas de lien vers soi-meme
}) {
  const { post, auteur, categorie, nbLikes, aLike, nbCommentaires, dernierCommentaireAt, imageUrl } = item;
  const lienPost = `/${espaceSlug}/post/${post.id}`;
  const lienProfil = `/${espaceSlug}/membres/${auteur.id}`;

  const entete = (
    <>
      <div className="mb-2.5 flex items-center gap-2.5">
        <Link href={lienProfil} aria-label={`Voir le profil de ${auteur.pseudo}`} className="flex-shrink-0">
          <Avatar id={auteur.id} pseudo={auteur.pseudo} taille={36} urlPhoto={auteur.avatarUrl} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={lienProfil} className="text-[13.5px] font-bold hover:text-[var(--sarcelle)]">
              {auteur.pseudo}
            </Link>
            <BadgeAuteur auteur={auteur} />
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10.5px] text-[var(--texte-mute)]">
            <span>{tempsEcoule(post.created_at)}</span>
            {categorie && (
              <span className="rounded-[5px] bg-[rgba(43,140,130,0.1)] px-1.5 py-px text-[var(--sarcelle)]">
                {categorie.emoji ? `${categorie.emoji} ` : ""}
                {categorie.libelle}
              </span>
            )}
          </div>
        </div>
        {post.epingle && (
          <span className="flex-shrink-0 rounded-full bg-[rgba(255,122,77,0.14)] px-2.5 py-1 font-mono text-[10px] font-bold text-[var(--corail)]">
            📌 Épinglé
          </span>
        )}
      </div>
    </>
  );

  const corpsCarte = (
    <>
      {post.titre && <h3 className="font-display mb-1.5 text-[16px] font-bold leading-snug">{post.titre}</h3>}
      <p className={`whitespace-pre-wrap text-[13.5px] leading-[1.6] text-[var(--texte)] ${detail ? "" : "line-clamp-4"}`}>
        {post.contenu}
      </p>

      {post.magnet_texte && (
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--corail)] px-2 py-1 font-mono text-[9px] font-bold text-[var(--encre)]">
          🧲 {post.magnet_texte}
        </div>
      )}

      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- lien temporaire signe, pas d'optimisation possible
        <img
          src={imageUrl}
          alt=""
          loading="lazy"
          className={`mt-3 w-full rounded-xl border border-[var(--ligne)] object-cover ${detail ? "max-h-[520px]" : "max-h-[320px]"}`}
        />
      )}
    </>
  );

  return (
    <article className="mb-3.5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
      {entete}
      {detail ? corpsCarte : (
        <Link href={lienPost} className="block">
          {corpsCarte}
        </Link>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[var(--ligne)] pt-3 text-[12.5px] text-[var(--texte-mute)]">
        <form action={basculerLike.bind(null, retour, post.id)}>
          <button
            type="submit"
            aria-pressed={aLike}
            aria-label={aLike ? "Retirer mon like" : "Liker ce post"}
            className={`flex items-center gap-1.5 font-bold ${aLike ? "text-[var(--sarcelle)]" : ""}`}
          >
            <IconePouce plein={aLike} />
            {nbLikes}
          </button>
        </form>

        {detail ? (
          <span className="flex items-center gap-1.5 font-bold">
            <IconeBulle />
            {nbCommentaires}
          </span>
        ) : (
          <Link href={lienPost} className="flex items-center gap-1.5 font-bold">
            <IconeBulle />
            {nbCommentaires}
          </Link>
        )}

        {dernierCommentaireAt && (
          <span className="text-[11.5px] text-[var(--sarcelle)]">
            Nouveau commentaire {tempsEcoule(dernierCommentaireAt)}
          </span>
        )}

        {auteur.id !== userId && (
          <>
            <Link href={`/${espaceSlug}/messages/${auteur.id}`} className="text-[11.5px] font-bold hover:text-[var(--sarcelle)]">
              ✉ Écrire à {auteur.pseudo}
            </Link>
            <BoutonSignaler type="post" cibleId={post.id} />
          </>
        )}

        {estAdmin && (
          <form action={epinglerPost.bind(null, retour, post.id, !post.epingle)} className="ml-auto">
            <button type="submit" className="text-[11.5px] font-bold underline">
              {post.epingle ? "Désépingler" : "Épingler"}
            </button>
          </form>
        )}
      </div>
    </article>
  );
}
