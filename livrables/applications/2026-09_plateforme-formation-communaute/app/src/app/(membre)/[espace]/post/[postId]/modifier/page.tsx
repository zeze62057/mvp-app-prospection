import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { chargerCategories } from "@/lib/fil";
import { FormulaireModifierPost } from "@/components/communaute/fil/FormulaireModifierPost";
import type { Post } from "@/types/membre";

// Modification de son propre post. Le RLS ne renvoie que les posts que l'on peut lire, et la
// base n'accepte la modification que de l'auteur : la verification ici n'est qu'un confort.
export default async function ModifierPostPage({
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

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("espace_id", espace.id)
    .maybeSingle<Post>();
  if (!post) notFound();
  if (post.auteur_id !== userData.user.id) redirect(`/${espace.slug}/post/${postId}`);

  const categories = await chargerCategories(supabase, espace.id);

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <Link href={`/${espace.slug}/post/${postId}`} className="font-mono text-[13px] font-bold text-[var(--sarcelle)]">
          ← Retour au post
        </Link>
      </div>
      <div className="mx-auto max-w-2xl p-5 sm:p-7">
        <h1 className="font-display mb-4 text-[20px] font-extrabold tracking-tight">Modifier mon post</h1>
        <FormulaireModifierPost
          espaceSlug={espace.slug}
          postId={post.id}
          titre={post.titre ?? ""}
          contenu={post.contenu}
          categorieId={post.categorie_id}
          categories={categories}
        />
      </div>
    </div>
  );
}
