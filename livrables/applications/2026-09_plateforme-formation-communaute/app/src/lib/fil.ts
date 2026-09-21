// Chargement du fil de communaute (voir migration 0026) : posts, auteurs,
// categories, likes, commentaires et liens temporaires des images.
// Toutes les lectures passent par le client de l'utilisateur : le RLS decide de
// ce qu'il voit. Le client admin sert uniquement a signer les liens d'images, et
// seulement pour des posts que le RLS vient de renvoyer.

import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import { urlsAvatars } from "@/lib/avatars";
import { filtreRecherche } from "@/lib/recherche";
import { libelleNiveau } from "@/lib/niveaux";
import { chargerNiveaux } from "@/lib/niveaux-donnees";
import type { CategoriePost, Commentaire, Post, ZonePost } from "@/types/membre";

export type AuteurFil = {
  id: string;
  pseudo: string;
  role: "membre" | "admin";
  points: number;
  niveau: string; // "Admin" ou le nom du niveau dans cet espace (migration 0036)
  estExpert: boolean;
  avatarUrl: string | null;
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
  auteurId?: string; // posts d'un seul membre (page profil)
  recherche?: string | null; // terme deja nettoye par nettoyerTerme (voir recherche.ts)
  limite?: number;
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
  auteurId,
  recherche,
  limite = LIMITE_FIL,
}: Options): Promise<PostFil[]> {
  let requete = supabase.from("posts").select("*").eq("espace_id", espaceId);
  if (postId) requete = requete.eq("id", postId);
  if (zone) requete = requete.eq("zone", zone);
  if (categorieId) requete = requete.eq("categorie_id", categorieId);
  if (auteurId) requete = requete.eq("auteur_id", auteurId);
  if (recherche) requete = requete.or(filtreRecherche(recherche));

  const { data: posts } = await requete
    .order("epingle", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(Math.min(limite, LIMITE_FIL))
    .returns<Post[]>();
  if (!posts || posts.length === 0) return [];

  const postIds = posts.map((p) => p.id);
  const auteurIds = [...new Set(posts.map((p) => p.auteur_id))];
  const zonesPayantes = posts.some((p) => p.zone === "payante");

  const [categories, niveaux, { data: profils }, { data: votes }, { data: resumes }, { data: experts }] =
    await Promise.all([
      chargerCategories(supabase, espaceId),
      chargerNiveaux(supabase, espaceId),
      supabase.from("profils").select("id, pseudo, role, points, avatar_path").in("id", auteurIds),
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

  // Liens temporaires des images et des photos de profil, un appel par bucket.
  const chemins = posts.map((p) => p.image_path).filter((c): c is string => !!c);
  const liens = new Map<string, string>();
  const [signes, photos] = await Promise.all([
    chemins.length > 0
      ? createAdminClient().storage.from("posts-images").createSignedUrls(chemins, VALIDITE_LIEN_IMAGE_S)
      : Promise.resolve({ data: [] as { path: string | null; signedUrl: string }[] }),
    urlsAvatars((profils ?? []) as { id: string; avatar_path: string | null }[]),
  ]);
  (signes.data ?? []).forEach((s) => {
    if (s.path && s.signedUrl) liens.set(s.path, s.signedUrl);
  });

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
        niveau: libelleNiveau(profil?.points ?? 0, profil?.role ?? "membre", niveaux),
        estExpert: expertIds.has(post.auteur_id),
        avatarUrl: photos.get(post.auteur_id) ?? null,
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

export type CommentaireFil = Commentaire & {
  pseudo: string;
  avatarUrl: string | null;
  nbLikes: number;
  aLike: boolean;
};

export async function chargerCommentaires(
  supabase: SupabaseClient,
  postId: string,
  userId: string
): Promise<CommentaireFil[]> {
  const { data: commentaires } = await supabase
    .from("commentaires")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })
    .returns<Commentaire[]>();
  if (!commentaires || commentaires.length === 0) return [];

  const auteurIds = [...new Set(commentaires.map((c) => c.auteur_id))];
  const [{ data: profils }, { data: votes }] = await Promise.all([
    supabase.from("profils").select("id, pseudo, avatar_path").in("id", auteurIds),
    supabase
      .from("commentaire_votes")
      .select("commentaire_id, profil_id")
      .in("commentaire_id", commentaires.map((c) => c.id)),
  ]);
  const pseudos = new Map((profils ?? []).map((p) => [p.id as string, p.pseudo as string]));
  const photos = await urlsAvatars((profils ?? []) as { id: string; avatar_path: string | null }[]);
  const likesParCommentaire = new Map<string, string[]>();
  (votes ?? []).forEach((v) => {
    likesParCommentaire.set(v.commentaire_id, [...(likesParCommentaire.get(v.commentaire_id) ?? []), v.profil_id]);
  });
  return commentaires.map((c) => {
    const likes = likesParCommentaire.get(c.id) ?? [];
    return {
      ...c,
      pseudo: pseudos.get(c.auteur_id) ?? "Membre",
      avatarUrl: photos.get(c.auteur_id) ?? null,
      nbLikes: likes.length,
      aLike: likes.includes(userId),
    };
  });
}
