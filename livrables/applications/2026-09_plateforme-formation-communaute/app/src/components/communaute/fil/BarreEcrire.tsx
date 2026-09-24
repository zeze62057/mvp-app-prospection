"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { CategoriePost, ZonePost } from "@/types/membre";
import { Avatar } from "./Avatar";

// Icones traits (pas d'emoji), pour matcher le style de la capture de reference.
function IconeCamera() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 8a2 2 0 0 1 2-2h2l1.4-2h5.2L14 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8Z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function IconeVideo() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 8-6 4 6 4V8Z" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

function IconeFichier() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21.44 11.05 12.25 20.24a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L9.41 17.41a1.5 1.5 0 0 1-2.12-2.12l8.49-8.49" />
    </svg>
  );
}

function IconeLien() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 17H7a5 5 0 0 1 0-10h2" />
      <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

type PieceJointe = "video" | "fichier" | "lien" | null;

// Carte "Ecrire quelque chose" : repliee comme sur Skool, elle s'ouvre au clic en
// formulaire (titre, texte, categorie, piece jointe). L'envoi passe par /api/posts,
// seul chemin qui sache recevoir un fichier. Photo, Video (lien YouTube), Fichier
// (petit document) et Lien sont tous reellement branches (2026-09-23) : au plus
// une piece jointe a la fois cote formulaire, /api/posts accepte les 4 en meme
// temps si jamais plusieurs sont remplis.
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
  const [info, setInfo] = useState<string | null>(null);
  const [nomImage, setNomImage] = useState<string | null>(null);
  const [nomFichier, setNomFichier] = useState<string | null>(null);
  const [pieceJointe, setPieceJointe] = useState<PieceJointe>(null);

  function ouvrirAvec(piece: PieceJointe) {
    setOuvert(true);
    if (piece) setPieceJointe(piece);
  }

  if (!ouvert) {
    return (
      <div className="mb-4 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
        {info && (
          <p role="status" className="mb-3 rounded-lg bg-[rgba(255,122,77,0.12)] px-3.5 py-2.5 text-[12.5px] font-bold text-[var(--corail-texte)]">
            {info}
          </p>
        )}
        <button type="button" onClick={() => ouvrirAvec(null)} className="flex w-full items-center gap-3 text-left">
          <Avatar id={auteurId} pseudo={auteurPseudo} taille={36} urlPhoto={auteurAvatarUrl} />
          <span className="text-[14px] text-[var(--texte-mute)]">
            Partagez une idée, une question, une actualité...
          </span>
        </button>
        <div className="mt-3 flex flex-wrap items-center gap-1 border-t border-[var(--ligne)] pt-3">
          <button
            type="button"
            onClick={() => ouvrirAvec(null)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--texte)]"
          >
            <IconeCamera /> Photo
          </button>
          <button
            type="button"
            onClick={() => ouvrirAvec("video")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--texte)]"
          >
            <IconeVideo /> Vidéo
          </button>
          <button
            type="button"
            onClick={() => ouvrirAvec("fichier")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--texte)]"
          >
            <IconeFichier /> Fichier
          </button>
          <button
            type="button"
            onClick={() => ouvrirAvec("lien")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--texte)]"
          >
            <IconeLien /> Lien
          </button>
          <button
            type="button"
            onClick={() => ouvrirAvec(null)}
            className="ml-auto rounded-[9px] bg-[var(--corail)] px-4 py-2 text-[12.5px] font-extrabold text-[var(--encre)]"
          >
            Publier
          </button>
        </div>
      </div>
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
      const json = (await reponse.json().catch(() => ({}))) as { erreur?: string; enAttente?: boolean };
      if (!reponse.ok) {
        setErreur(json.erreur ?? "La publication a échoué.");
      } else {
        formRef.current?.reset();
        setNomImage(null);
        setNomFichier(null);
        setPieceJointe(null);
        setOuvert(false);
        setInfo(json.enAttente ? "Ton post est en attente d'approbation : il sera visible des autres membres dès qu'un admin l'aura validé. Tu le vois déjà dans le fil, marqué « en attente »." : null);
        router.refresh();
      }
    } catch {
      setErreur("Connexion impossible, réessaie.");
    } finally {
      setEnCours(false);
    }
  }

  const champ = "rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]";
  const boutonPiece = (actif: boolean) =>
    `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold ${
      actif ? "bg-[var(--fond)] text-[var(--texte)]" : "text-[var(--texte-mute)] hover:text-[var(--texte)]"
    }`;

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
            ? "Partage ton exercice, une question, une victoire... (@pseudo pour mentionner un membre)"
            : "Partage une victoire, pose une question... (@pseudo pour mentionner un membre)"
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
      {categories.length > 0 && (
        <select
          name="categorie_id"
          defaultValue={categorieParDefaut ?? ""}
          className="self-start rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)]"
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

      {pieceJointe === "video" && (
        <input
          name="video"
          type="url"
          placeholder="Lien YouTube (https://youtube.com/watch?v=...)"
          className={champ}
        />
      )}
      {pieceJointe === "lien" && (
        <input name="lien" type="url" placeholder="https://..." className={champ} />
      )}
      {pieceJointe === "fichier" && (
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-[var(--ligne)] px-3.5 py-2.5 text-[12.5px] font-bold text-[var(--texte-mute)]">
          <IconeFichier /> {nomFichier ? nomFichier : "Choisir un fichier (PDF, Word, ZIP, texte — 10 Mo max)"}
          <input
            name="fichier"
            type="file"
            accept=".pdf,.doc,.docx,.zip,.txt"
            className="sr-only"
            onChange={(e) => setNomFichier(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      )}

      <div className="flex flex-wrap items-center gap-1 border-t border-[var(--ligne)] pt-2.5">
        <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-bold text-[var(--texte-mute)] hover:text-[var(--texte)]">
          <IconeCamera /> {nomImage ? nomImage : "Photo"}
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => setNomImage(e.target.files?.[0]?.name ?? null)}
          />
        </label>
        <button
          type="button"
          onClick={() => setPieceJointe(pieceJointe === "video" ? null : "video")}
          className={boutonPiece(pieceJointe === "video")}
        >
          <IconeVideo /> Vidéo
        </button>
        <button
          type="button"
          onClick={() => setPieceJointe(pieceJointe === "fichier" ? null : "fichier")}
          className={boutonPiece(pieceJointe === "fichier")}
        >
          <IconeFichier /> Fichier
        </button>
        <button
          type="button"
          onClick={() => setPieceJointe(pieceJointe === "lien" ? null : "lien")}
          className={boutonPiece(pieceJointe === "lien")}
        >
          <IconeLien /> Lien
        </button>
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
