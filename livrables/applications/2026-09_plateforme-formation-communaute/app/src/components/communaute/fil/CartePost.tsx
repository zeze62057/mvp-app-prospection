import Link from "next/link";
import { basculerReaction, epinglerPost } from "@/app/(membre)/[espace]/post/actions";
import { tempsEcoule } from "@/lib/temps";
import { urlIntegration } from "@/lib/youtube";
import type { PostFil } from "@/lib/fil";
import type { TypeReaction } from "@/types/membre";
import { Avatar } from "./Avatar";
import { BoutonSignaler } from "@/components/moderation/BoutonSignaler";
import { BadgeMembre } from "@/components/communaute/BadgeMembre";
import { BoutonSupprimerPost } from "./BoutonSupprimerPost";
import { TexteAvecMentions } from "./TexteAvecMentions";

export function IconePouce({ plein }: { plein: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={plein ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 10v11" />
      <path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 7.5a2 2 0 0 1-1.9 1.4H7V10l4-8a2.5 2.5 0 0 1 4 3.9Z" />
    </svg>
  );
}

function IconeCoeur() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function IconeRire() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8 13.5s1.5 2.5 4 2.5 4-2.5 4-2.5" />
      <path d="M8.5 9h.01" />
      <path d="M15.5 9h.01" />
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
  return <BadgeMembre estExpert={auteur.estExpert} niveau={auteur.niveau} />;
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
  const { post, auteur, categorie, nbReactions, maReaction, nbCommentaires, dernierCommentaireAt, imageUrl, fichierUrl } = item;
  const lienPost = `/${espaceSlug}/post/${post.id}`;
  const lienProfil = `/${espaceSlug}/membres/${auteur.id}`;

  // Menu "..." : regroupe les actions de gestion du post (modifier/supprimer, ecrire/signaler,
  // epingler), separees des reactions (like/commentaires) restees dans la ligne du bas.
  // <details> natif : pas de nouveau JS, mais ne se ferme pas seul au clic exterieur.
  // ponytail: fermeture au clic exterieur a ajouter si ca genait a l'usage.
  const menu = (
    <details className="relative ml-auto flex-shrink-0">
      <summary
        aria-label="Options du post"
        className="flex h-7 w-7 cursor-pointer list-none items-center justify-center rounded-full text-[15px] text-[var(--texte-mute)] hover:bg-[var(--fond)] [&::-webkit-details-marker]:hidden"
      >
        ⋯
      </summary>
      <div className="absolute right-0 top-8 z-10 min-w-[180px] rounded-[10px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-1.5 text-[12.5px] font-bold shadow-md [&_button]:w-full [&_button]:text-left [&_form]:block [&_a]:block [&_a]:no-underline [&_button]:no-underline [&>*]:rounded-lg [&>*]:px-2.5 [&>*]:py-1.5 hover:[&>*]:bg-[var(--fond)]">
        {auteur.id === userId ? (
          <>
            <Link href={`/${espaceSlug}/post/${post.id}/modifier`}>✎ Modifier</Link>
            <BoutonSupprimerPost espaceSlug={espaceSlug} postId={post.id} />
          </>
        ) : (
          <>
            <Link href={`/${espaceSlug}/messages/${auteur.id}`}>✉ Écrire à {auteur.pseudo}</Link>
            <BoutonSignaler type="post" cibleId={post.id} />
          </>
        )}
        {estAdmin && (
          <form action={epinglerPost.bind(null, retour, post.id, !post.epingle)}>
            <button type="submit">{post.epingle ? "📌 Désépingler" : "📌 Épingler"}</button>
          </form>
        )}
      </div>
    </details>
  );

  const entete = (
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
          {post.modifie_le && <span title={new Date(post.modifie_le).toLocaleString("fr-FR")}>· modifié</span>}
          {categorie && (
            <span className="rounded-[5px] bg-[rgba(43,140,130,0.1)] px-1.5 py-px text-[var(--sarcelle)]">
              {categorie.emoji ? `${categorie.emoji} ` : ""}
              {categorie.libelle}
            </span>
          )}
        </div>
      </div>
      {menu}
    </div>
  );

  const texte = (
    <>
      {post.titre && <h3 className="font-display mb-1.5 text-[16px] font-bold leading-snug">{post.titre}</h3>}
      <p className={`whitespace-pre-wrap text-[13.5px] leading-[1.6] text-[var(--texte)] ${detail ? "" : "line-clamp-4"}`}>
        <TexteAvecMentions texte={post.contenu} />
      </p>

      {post.magnet_texte && (
        <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-[var(--corail)] px-2 py-1 font-mono text-[9px] font-bold text-[var(--encre)]">
          🧲 {post.magnet_texte}
        </div>
      )}

      {post.video_url && urlIntegration(post.video_url) && (
        <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl border border-[var(--ligne)]">
          <iframe
            src={urlIntegration(post.video_url)!}
            title="Vidéo du post"
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {fichierUrl && (
        <a
          href={fichierUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--ligne)] px-3.5 py-2.5 text-[12.5px] font-bold text-[var(--sarcelle)]"
        >
          📎 {post.fichier_nom ?? "Fichier joint"}
        </a>
      )}

      {post.lien_url && (
        <a
          href={post.lien_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-2 truncate rounded-xl border border-[var(--ligne)] px-3.5 py-2.5 text-[12.5px] font-bold text-[var(--sarcelle)]"
        >
          🔗 {post.lien_url}
        </a>
      )}
    </>
  );

  // En vue detail, l'image passe en pleine largeur sous le texte. Dans le fil, elle
  // devient une vignette a droite du texte, comme sur la capture de reference.
  const image = imageUrl && (
    // eslint-disable-next-line @next/next/no-img-element -- lien temporaire signe, pas d'optimisation possible
    <img
      src={imageUrl}
      alt=""
      loading="lazy"
      className={
        detail
          ? "mt-3 max-h-[520px] w-full rounded-xl border border-[var(--ligne)] object-cover"
          : "h-24 w-24 flex-shrink-0 rounded-xl border border-[var(--ligne)] object-cover sm:h-28 sm:w-28"
      }
    />
  );

  const corpsCarte =
    imageUrl && !detail ? (
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">{texte}</div>
        {image}
      </div>
    ) : (
      <>
        {texte}
        {image}
      </>
    );

  return (
    <article className="relative mb-3.5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
      {post.epingle && (
        <span className="absolute -top-2.5 left-5 rounded-full bg-[var(--corail)] px-2.5 py-1 font-mono text-[10px] font-bold text-[var(--encre)] shadow-sm">
          📌 Épinglé
        </span>
      )}
      {entete}
      {detail ? corpsCarte : (
        <Link href={lienPost} className="block">
          {corpsCarte}
        </Link>
      )}

      <div className="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-2 border-t border-[var(--ligne)] pt-3 text-[12.5px] text-[var(--texte-mute)]">
        {(
          [
            { type: "like" as TypeReaction, icone: <IconePouce plein={maReaction === "like"} />, libelle: "Liker" },
            { type: "coeur" as TypeReaction, icone: <IconeCoeur />, libelle: "Réagir avec un cœur" },
            { type: "rire" as TypeReaction, icone: <IconeRire />, libelle: "Réagir avec un rire" },
          ]
        ).map(({ type, icone, libelle }) => (
          <form key={type} action={basculerReaction.bind(null, retour, post.id, type)}>
            <button
              type="submit"
              aria-pressed={maReaction === type}
              aria-label={maReaction === type ? `Retirer ma réaction (${type})` : libelle}
              className={`flex items-center gap-1.5 font-bold ${maReaction === type ? "text-[var(--sarcelle)]" : ""}`}
            >
              {icone}
            </button>
          </form>
        ))}
        <span className="font-bold">{nbReactions}</span>

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

        {!detail && (
          <Link href={lienPost} className="ml-auto text-[11.5px] font-bold text-[var(--sarcelle)]">
            {post.epingle ? "Voir le post →" : "Lire la suite →"}
          </Link>
        )}
      </div>
    </article>
  );
}
