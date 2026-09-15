"use client";

import { useActionState } from "react";
import { creerPost } from "@/app/(membre)/[espace]/communaute/actions";
import type { Post } from "@/types/membre";

const etatInitial = { erreur: null };

export function FilPosts({
  espaceSlug,
  posts,
  pseudosParAuteur,
}: {
  espaceSlug: string;
  posts: Post[];
  pseudosParAuteur: Record<string, string>;
}) {
  const [etat, action] = useActionState(creerPost, etatInitial);

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-2 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
        <input type="hidden" name="espace_slug" value={espaceSlug} />
        <textarea
          name="contenu"
          placeholder="Partage quelque chose avec la communaute..."
          required
          rows={3}
          className="resize-none rounded-lg border border-[var(--ligne)] px-3 py-2 text-sm"
        />
        {etat.erreur && <p className="text-sm text-[var(--corail)]">{etat.erreur}</p>}
        <button
          type="submit"
          className="self-end rounded-lg bg-[var(--encre)] px-4 py-2 text-sm font-medium text-[var(--sur-encre)]"
        >
          Publier
        </button>
      </form>

      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
              {pseudosParAuteur[post.auteur_id] ?? "Membre"}
            </p>
            <p className="mt-2 text-sm text-[var(--texte)]">{post.contenu}</p>
          </li>
        ))}
        {posts.length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">
            Aucun post pour l&apos;instant. Sois le premier a partager quelque chose.
          </p>
        )}
      </ul>
    </div>
  );
}
