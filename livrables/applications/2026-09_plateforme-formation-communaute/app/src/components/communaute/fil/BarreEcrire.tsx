"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoriePost, ZonePost } from "@/types/membre";
import { Avatar } from "./Avatar";

// Barre "Ecrire quelque chose" : repliee comme sur Skool, elle s'ouvre au clic en
// formulaire (titre, texte, categorie, image). L'envoi passe par /api/posts, seul
// chemin qui sache recevoir un fichier.
export function BarreEcrire({
  espaceSlug,
  zone,
  categories,
  auteurId,
  auteurPseudo,
  auteurAvatarUrl,
  categorieParDefaut,
}: {
  espaceSlug: string;
  zone: ZonePost;
  categories: CategoriePost[];
  auteurId: string;
  auteurPseudo: string;
  auteurAvatarUrl: string | null;
  categorieParDefaut: string | null;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [ouvert, setOuvert] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [nomImage, setNomImage] = useState<string | null>(null);

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="mb-4 flex w-full items-center gap-3 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3.5 text-left"
      >
        <Avatar id={auteurId} pseudo={auteurPseudo} taille={36} urlPhoto={auteurAvatarUrl} />
        <span className="text-[14px] text-[var(--texte-mute)]">Écrire quelque chose</span>
      </button>
    );
  }

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnCours(true);
    setErreur(null);
    const donnees = new FormData(e.currentTarget);
    donnees.set("espace_slug", espaceSlug);
    donnees.set("zone", zone);
    try {
      const reponse = await fetch("/api/posts", { method: "POST", body: donnees });
      const json = (await reponse.json().catch(() => ({}))) as { erreur?: string };
      if (!reponse.ok) {
        setErreur(json.erreur ?? "La publication a échoué.");
      } else {
        formRef.current?.reset();
        setNomImage(null);
        setOuvert(false);
        router.refresh();
      }
    } catch {
      setErreur("Connexion impossible, réessaie.");
    } finally {
      setEnCours(false);
    }
  }

  const champ = "rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]";

  return (
    <form
      ref={formRef}
      onSubmit={envoyer}
      className="mb-4 flex flex-col gap-2.5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
    >
      <div className="flex items-center gap-3">
        <Avatar id={auteurId} pseudo={auteurPseudo} taille={36} urlPhoto={auteurAvatarUrl} />
        <span className="text-[13px] font-bold">{auteurPseudo}</span>
      </div>
      <input name="titre" maxLength={150} placeholder="Titre (optionnel)" className={champ} />
      <textarea
        name="contenu"
        required
        rows={4}
        maxLength={5000}
        autoFocus
        placeholder={
          zone === "payante"
            ? "Partage ton exercice, une question, une victoire..."
            : "Partage une victoire, pose une question..."
        }
        className={`${champ} resize-y`}
      />
      {zone === "payante" && (
        <input
          name="magnet_texte"
          placeholder="Lead magnet offert avec ce post (optionnel, ex : template offert)"
          className={champ}
        />
      )}
      <div className="flex flex-wrap items-center gap-2.5">
        {categories.length > 0 && (
          <select
            name="categorie_id"
            defaultValue={categorieParDefaut ?? ""}
            className="rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)]"
          >
            <option value="">Sans catégorie</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.emoji ? `${c.emoji} ` : ""}
                {c.libelle}
              </option>
            ))}
          </select>
        )}
        <label className="cursor-pointer rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)]">
          {nomImage ? `🖼 ${nomImage}` : "🖼 Ajouter une image"}
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => setNomImage(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>
      {erreur && <p className="text-[13px] text-[var(--corail)]">{erreur}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setOuvert(false)}
          disabled={enCours}
          className="rounded-[9px] border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-bold text-[var(--texte-mute)]"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={enCours}
          className="rounded-[9px] bg-[var(--encre)] px-4 py-2 text-[12.5px] font-bold text-[var(--sur-encre)] disabled:opacity-60"
        >
          {enCours ? "Publication..." : "Publier"}
        </button>
      </div>
    </form>
  );
}
