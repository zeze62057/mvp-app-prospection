import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { chargerCommentaires, chargerPostsFil } from "@/lib/fil";
import { tempsEcoule } from "@/lib/temps";
import { supprimerCommentaire } from "../actions";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { CartePost } from "@/components/communaute/fil/CartePost";
import { FormulaireCommentaire } from "@/components/communaute/fil/FormulaireCommentaire";

export default async function PostPage({
  params,
}: {
  params: Promise<{ espace: string; postId: string }>;
}) {
  const { espace: slug, postId } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect(`/${espace.slug}/communaute`);
  const userId = userData.user.id;

  // Le RLS decide : un post d'une zone ou l'on n'a pas acces n'est simplement pas renvoye.
  const [item] = await chargerPostsFil({ supabase, espaceId: espace.id, userId, postId });
  if (!item) notFound();

  const [commentaires, { data: profil }] = await Promise.all([
    chargerCommentaires(supabase, postId),
    supabase.from("profils").select("role").eq("id", userId).maybeSingle(),
  ]);

  const retour = `/${espace.slug}/post/${postId}`;
  const listeFil = `/${espace.slug}/${item.post.zone === "payante" ? "communaute-payante" : "communaute"}`;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
        <Link href={listeFil} className="font-mono text-[13px] font-bold text-[var(--sarcelle)]">
          ← Retour au fil
        </Link>
      </div>

      <div className="mx-auto max-w-2xl p-5 sm:p-7">
        <CartePost
          espaceSlug={espace.slug}
          retour={retour}
          item={item}
          estAdmin={profil?.role === "admin"}
          detail
        />

        <h2 className="font-display mb-3 mt-6 text-[15px] font-bold">
          {commentaires.length} commentaire{commentaires.length > 1 ? "s" : ""}
        </h2>

        <ul className="mb-5 flex flex-col gap-3">
          {commentaires.map((c) => (
            <li
              key={c.id}
              className="flex gap-3 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
            >
              <Avatar id={c.auteur_id} pseudo={c.pseudo} taille={30} urlPhoto={c.avatarUrl} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold">{c.pseudo}</span>
                  <span className="font-mono text-[10.5px] text-[var(--texte-mute)]">
                    {tempsEcoule(c.created_at)}
                  </span>
                  {c.auteur_id === userId && (
                    <form action={supprimerCommentaire.bind(null, retour, c.id)} className="ml-auto">
                      <button type="submit" className="text-[11px] text-[var(--texte-mute)] underline">
                        Supprimer
                      </button>
                    </form>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-[13.5px] leading-[1.55]">{c.contenu}</p>
              </div>
            </li>
          ))}
          {commentaires.length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">Aucun commentaire pour l&apos;instant.</p>
          )}
        </ul>

        <FormulaireCommentaire postId={postId} retour={retour} />
      </div>
    </div>
  );
}
