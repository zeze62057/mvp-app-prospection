// Chargement du fil de communaute (voir migration 0026) : posts, auteurs,
// categories, likes, commentaires et liens temporaires des images.
// Toutes les lectures passent par le client de l'utilisateur : le RLS decide de
// ce qu'il voit. Le client admin sert uniquement a signer les liens d'images, et
// seulement pour des posts que le RLS vient de renvoyer.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { CategoriePost, Commentaire, Post, ZonePost } from "@/types/membre";

export type AuteurFil = {
  id: string;
  pseudo: string;
  role: "membre" | "admin";
  points: number;
  estExpert: boolean;
};

export type PostFil = {
  post: Post;
  auteur: AuteurFil;
  categorie: CategoriePost | null;
  nbLikes: number;
  aLike: boolean;
  nbCommentaires: number;
  dernierCommentaireAt: string | null;
  imageUrl: string | null;
};

const LIMITE_FIL = 50;
const VALIDITE_LIEN_IMAGE_S = 3600;

type Options = {
  supabase: SupabaseClient;
  espaceId: string;
  userId: string;
  zone?: ZonePost; // absent quand on charge un post precis
  categorieId?: string | null;
  postId?: string;
};

export async function chargerCategories(supabase: SupabaseClient, espaceId: string) {
  const { data } = await supabase
    .from("categories_posts")
    .select("*")
    .eq("espace_id", espaceId)
    .order("ordre")
    .order("created_at")
    .returns<CategoriePost[]>();
  return data ?? [];
}

export async function chargerPostsFil({
  supabase,
  espaceId,
  userId,
  zone,
  categorieId,
  postId,
}: Options): Promise<PostFil[]> {
  let requete = supabase.from("posts").select("*").eq("espace_id", espaceId);
  if (postId) requete = requete.eq("id", postId);
  if (zone) requete = requete.eq("zone", zone);
  if (categorieId) requete = requete.eq("categorie_id", categorieId);

  const { data: posts } = await requete
    .order("epingle", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(LIMITE_FIL)
    .returns<Post[]>();
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);
  const auteurIds = [...new Set(posts.map((p) => p.auteur_id))];
  const zonesPayantes = posts.some((p) => p.zone === "payante");

  const [categories, { data: profils }, { data: votes }, { data: resumes }, { data: experts }] =
    await Promise.all([
      chargerCategories(supabase, espaceId),
      supabase.from("profils").select("id, pseudo, role, points").in("id", auteurIds),
      supabase.from("post_votes").select("post_id, profil_id").in("post_id", postIds),
      supabase.rpc("commentaires_resume", { p_post_ids: postIds }),
      zonesPayantes ? supabase.rpc("experts_espace", { p_espace: espaceId }) : Promise.resolve({ data: [] }),
    ]);

  const parCategorie = new Map(categories.map((c) => [c.id, c]));
  const parAuteur = new Map((profils ?? []).map((p) => [p.id as string, p]));
  const expertIds = new Set<string>((experts ?? []) as string[]);
  const resumeParPost = new Map(
    ((resumes ?? []) as { post_id: string; nb: number | string; dernier_at: string }[]).map((r) => [
      r.post_id,
      r,
    ])
  );
  const likesParPost = new Map<string, string[]>();
  (votes ?? []).forEach((v) => {
    likesParPost.set(v.post_id, [...(likesParPost.get(v.post_id) ?? []), v.profil_id]);
  });

  // Liens temporaires des images, un seul appel pour tout le fil.
  const chemins = posts.map((p) => p.image_path).filter((c): c is string => !!c);
  const liens = new Map<string, string>();
  if (chemins.length > 0) {
    const { data: signes } = await createAdminClient()
      .storage.from("posts-images")
      .createSignedUrls(chemins, VALIDITE_LIEN_IMAGE_S);
    (signes ?? []).forEach((s) => {
      if (s.path && s.signedUrl) liens.set(s.path, s.signedUrl);
    });
  }

  return posts.map((post) => {
    const profil = parAuteur.get(post.auteur_id);
    const resume = resumeParPost.get(post.id);
    const likes = likesParPost.get(post.id) ?? [];
    return {
      post,
      auteur: {
        id: post.auteur_id,
        pseudo: profil?.pseudo ?? "Membre",
        role: (profil?.role as "membre" | "admin") ?? "membre",
        points: profil?.points ?? 0,
        estExpert: expertIds.has(post.auteur_id),
      },
      categorie: post.categorie_id ? (parCategorie.get(post.categorie_id) ?? null) : null,
      nbLikes: likes.length,
      aLike: likes.includes(userId),
      nbCommentaires: resume ? Number(resume.nb) : 0,
      dernierCommentaireAt: resume?.dernier_at ?? null,
      imageUrl: post.image_path ? (liens.get(post.image_path) ?? null) : null,
    };
  });
}

export type CommentaireFil = Commentaire & { pseudo: string };

export async function chargerCommentaires(
  supabase: SupabaseClient,
  postId: string
): Promise<CommentaireFil[]> {
  const { data: commentaires } = await supabase
    .from("commentaires")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .returns<Commentaire[]>();
  if (!commentaires || commentaires.length === 0) return [];

  const auteurIds = [...new Set(commentaires.map((c) => c.auteur_id))];
  const { data: profils } = await supabase.from("profils").select("id, pseudo").in("id", auteurIds);
  const pseudos = new Map((profils ?? []).map((p) => [p.id as string, p.pseudo as string]));
  return commentaires.map((c) => ({ ...c, pseudo: pseudos.get(c.auteur_id) ?? "Membre" }));
}
