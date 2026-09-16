"use client";

import { useRef, useState } from "react";

export function FormulaireFichierRessource({ espaces }: { espaces: { id: string; nom: string }[] }) {
  const [etat, setEtat] = useState<"idle" | "envoi" | "envoye" | "erreur">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function envoyer(formData: FormData) {
    setEtat("envoi");
    setMessage(null);

    const reponse = await fetch("/api/admin/ressource-fichier", {
      method: "POST",
      body: formData,
    });

    if (!reponse.ok) {
      const corps = await reponse.json().catch(() => null);
      setEtat("erreur");
      setMessage(corps?.erreur ?? "Echec de l'upload.");
      return;
    }

    setEtat("envoye");
    setMessage("Fichier ajoute.");
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={envoyer}
      className="flex flex-col gap-3 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Espace</label>
        <select name="espace_id" required className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm">
          {espaces.map((e) => (
            <option key={e.id} value={e.id}>{e.nom}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Titre</label>
        <input
          name="titre"
          type="text"
          required
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Description</label>
        <input
          name="description"
          type="text"
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-64"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Fichier</label>
        <input name="fichier" type="file" required className="text-xs" />
      </div>
      <button
        type="submit"
        disabled={etat === "envoi"}
        className="rounded-lg bg-[var(--sarcelle)] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
      >
        {etat === "envoi" ? "Envoi..." : "Uploader le fichier"}
      </button>
      {message && (
        <p className={`w-full text-xs ${etat === "erreur" ? "text-[var(--corail)]" : "text-[var(--sarcelle)]"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
