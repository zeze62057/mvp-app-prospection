"use client";

import { useActionState } from "react";
import { creerDevoir } from "@/app/admin/actions";

const etatInitial = { erreur: null, succes: false };

export function FormulaireDevoir({
  espaces,
  modules,
}: {
  espaces: { id: string; nom: string }[];
  modules: { id: string; espace_id: string; titre: string }[];
}) {
  const [etat, action] = useActionState(creerDevoir, etatInitial);

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
        <label className="text-xs text-[var(--texte-mute)]">Module</label>
        <select name="module_id" required className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm">
          {modules.map((m) => (
            <option key={m.id} value={m.id}>{m.titre}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Titre</label>
        <input name="titre" type="text" required className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-48" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Consigne</label>
        <input name="consigne" type="text" required className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm sm:w-64" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Date limite</label>
        <input name="date_limite" type="datetime-local" required className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm" />
      </div>
      <button type="submit" className="rounded-lg bg-[var(--corail)] px-4 py-2 text-xs font-bold text-[var(--encre)]">
        Créer le devoir
      </button>
      {etat.erreur && <p className="w-full text-xs text-[var(--corail)]">{etat.erreur}</p>}
      {etat.succes && <p className="w-full text-xs text-[var(--sarcelle)]">Devoir créé.</p>}
    </form>
  );
}
