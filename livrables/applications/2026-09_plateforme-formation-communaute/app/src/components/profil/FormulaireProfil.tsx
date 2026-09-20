"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { modifierPseudo } from "@/app/(membre)/[espace]/profil/actions";
import { Avatar } from "@/components/communaute/fil/Avatar";

const etatInitial = { erreur: null as string | null, succes: false };

// Profil du membre : photo (envoi via /api/profil/avatar) et pseudo (server action).
export function FormulaireProfil({
  espaceSlug,
  userId,
  pseudo,
  avatarUrl,
}: {
  espaceSlug: string;
  userId: string;
  pseudo: string;
  avatarUrl: string | null;
}) {
  const router = useRouter();
  const champPhoto = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreurPhoto, setErreurPhoto] = useState<string | null>(null);
  const [etat, action] = useActionState(modifierPseudo, etatInitial);

  async function envoyerPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setEnvoi(true);
    setErreurPhoto(null);
    const donnees = new FormData();
    donnees.set("photo", fichier);
    try {
      const r = await fetch("/api/profil/avatar", { method: "POST", body: donnees });
      const json = (await r.json().catch(() => ({}))) as { erreur?: string };
      if (!r.ok) setErreurPhoto(json.erreur ?? "L'envoi a échoué.");
      else router.refresh();
    } catch {
      setErreurPhoto("Connexion impossible, réessaie.");
    } finally {
      setEnvoi(false);
      if (champPhoto.current) champPhoto.current.value = "";
    }
  }

  async function retirerPhoto() {
    setEnvoi(true);
    setErreurPhoto(null);
    try {
      const r = await fetch("/api/profil/avatar", { method: "DELETE" });
      if (!r.ok) setErreurPhoto("La suppression a échoué.");
      else router.refresh();
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-wrap items-center gap-5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
        <Avatar id={userId} pseudo={pseudo} taille={88} urlPhoto={avatarUrl} />
        <div className="flex flex-col gap-2">
          <p className="font-display text-[15px] font-bold">Ta photo</p>
          <p className="text-[12.5px] text-[var(--texte-mute)]">
            JPG, PNG ou WebP, 2 Mo maximum. Visible des membres de tes communautés.
          </p>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-[9px] bg-[var(--encre)] px-4 py-2 text-[12.5px] font-bold text-[var(--sur-encre)]">
              {envoi ? "Envoi..." : avatarUrl ? "Changer la photo" : "Ajouter une photo"}
              <input
                ref={champPhoto}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={envoi}
                onChange={envoyerPhoto}
              />
            </label>
            {avatarUrl && (
              <button
                type="button"
                onClick={retirerPhoto}
                disabled={envoi}
                className="rounded-[9px] border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-bold text-[var(--texte-mute)]"
              >
                Retirer
              </button>
            )}
          </div>
          {erreurPhoto && <p className="text-[13px] text-[var(--corail)]">{erreurPhoto}</p>}
        </div>
      </section>

      <form
        action={action}
        className="flex flex-col gap-2 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-5"
      >
        <input type="hidden" name="espace_slug" value={espaceSlug} />
        <label htmlFor="pseudo" className="font-display text-[15px] font-bold">
          Ton pseudo
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id="pseudo"
            name="pseudo"
            defaultValue={pseudo}
            required
            minLength={2}
            maxLength={30}
            className="min-w-0 flex-1 rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2 text-[13px]"
          />
          <button
            type="submit"
            className="rounded-[9px] bg-[var(--sarcelle)] px-4 py-2 text-[12.5px] font-bold text-white"
          >
            Enregistrer
          </button>
        </div>
        {etat.succes && <p className="text-[13px] text-[var(--sarcelle)]">Pseudo enregistré.</p>}
        {etat.erreur && <p className="text-[13px] text-[var(--corail)]">{etat.erreur}</p>}
      </form>
    </div>
  );
}
