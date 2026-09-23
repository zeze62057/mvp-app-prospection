"use client";

import { useActionState } from "react";
import { attribuerBadge } from "@/app/admin/actions";

const etatInitial = { erreur: null, succes: false };

export function FormulaireBadge({ espaces }: { espaces: { id: string; nom: string }[] }) {
  const [etat, action] = useActionState(attribuerBadge, etatInitial);

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
        <label className="text-xs text-[var(--texte-mute)]">Email de l&apos;élève</label>
        <input name="email" type="email" required className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-56" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Libellé</label>
        <input name="libelle" type="text" required placeholder="Ex : Assiduité" className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-48" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Emoji</label>
        <input name="emoji" type="text" defaultValue="🏅" maxLength={4} className="w-16 rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm" />
      </div>
      <button type="submit" className="rounded-lg bg-[var(--corail)] px-4 py-2 text-xs font-bold text-[var(--encre)]">
        Attribuer le badge
      </button>
      {etat.erreur && <p className="w-full text-xs text-[var(--corail)]">{etat.erreur}</p>}
      {etat.succes && <p className="w-full text-xs text-[var(--sarcelle)]">Badge attribué.</p>}
    </form>
  );
}
