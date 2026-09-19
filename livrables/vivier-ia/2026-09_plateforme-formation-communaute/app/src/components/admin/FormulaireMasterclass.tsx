"use client";

import { useActionState } from "react";
import { creerMasterclass } from "@/app/admin/actions";

const etatInitial = { erreur: null, succes: false };

export function FormulaireMasterclass({ espaces }: { espaces: { id: string; nom: string }[] }) {
  const [etat, action] = useActionState(creerMasterclass, etatInitial);

  return (
    <form
      action={action}
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
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-56"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Date et heure</label>
        <input
          name="date_heure"
          type="datetime-local"
          required
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Lien (Zoom, Meet...)</label>
        <input
          name="lien"
          type="url"
          required
          placeholder="https://..."
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-56"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-[var(--corail)] px-4 py-2 text-xs font-bold text-[var(--encre)]"
      >
        Creer la masterclass
      </button>
      {etat.erreur && <p className="w-full text-xs text-[var(--corail)]">{etat.erreur}</p>}
      {etat.succes && <p className="w-full text-xs text-[var(--sarcelle)]">Masterclass creee.</p>}
    </form>
  );
}
