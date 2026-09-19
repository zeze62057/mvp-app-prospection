"use client";

import { useActionState, useState } from "react";
import { envoyerTemoignage } from "@/app/(membre)/[espace]/progression/actions";

const etatInitial = { erreur: null, envoye: false };

export function FormulaireTemoignage({ espaceSlug }: { espaceSlug: string }) {
  const [etat, action] = useActionState(envoyerTemoignage, etatInitial);
  const [note, setNote] = useState(0);

  if (etat.envoye) {
    return (
      <div className="mt-3.5 rounded-2xl bg-[var(--encre)] p-6">
        <p className="text-sm text-[var(--sarcelle-light)]">
          Merci ! Ton temoignage a ete envoye a l&apos;equipe Vivier IA.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="mt-3.5 rounded-2xl bg-[var(--encre)] p-6">
      <input type="hidden" name="espace_slug" value={espaceSlug} />
      <input type="hidden" name="note" value={note} />
      <p className="font-display text-[15px] font-bold text-[var(--sur-encre)]">Ton avis compte</p>
      <p className="mb-3.5 text-xs text-[var(--sur-encre-mute)]">
        Laisse un temoignage sur ta progression, il pourra etre partage (avec ton accord) sur la vitrine Vivier IA.
      </p>

      <div className="mb-3.5 flex gap-1.5 text-2xl">
        {[1, 2, 3, 4, 5].map((v) => (
          <span
            key={v}
            onClick={() => setNote(v)}
            className={`cursor-pointer transition-colors ${v <= note ? "text-[var(--corail)]" : "text-[rgba(234,245,242,0.3)]"}`}
          >
            ★
          </span>
        ))}
      </div>

      <textarea
        name="texte"
        rows={3}
        required
        placeholder="Ce que Vivier IA t'a apporte jusqu'ici..."
        className="mb-3.5 w-full resize-none rounded-[10px] border border-[rgba(234,245,242,0.18)] bg-[rgba(234,245,242,0.06)] px-3.5 py-3 text-[13px] text-[var(--sur-encre)] placeholder:text-[var(--sur-encre-mute)]"
      />

      <label className="mb-3.5 flex items-center gap-2 text-xs text-[var(--sur-encre-mute)]">
        <input type="checkbox" name="autorise_partage" defaultChecked />
        J&apos;autorise le partage de ce temoignage sur la vitrine Vivier IA
      </label>

      {etat.erreur && <p className="mb-3 text-sm text-[var(--corail)]">{etat.erreur}</p>}

      <button
        type="submit"
        disabled={note === 0}
        className="rounded-[9px] bg-[var(--sarcelle-light)] px-5 py-2.5 text-[12.5px] font-extrabold text-[var(--encre)] disabled:opacity-50"
      >
        Envoyer mon temoignage
      </button>
    </form>
  );
}
