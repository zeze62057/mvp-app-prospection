"use client";

import { useState } from "react";
import { signaler } from "@/app/(membre)/[espace]/post/actions";

type Etat = "ferme" | "ouvert" | "envoi" | "fait";

// Bouton "Signaler" : ouvre un petit formulaire (motif obligatoire) sous le contenu.
// Le client n'envoie que le type, l'identifiant et le motif : c'est la base qui lit le
// contenu signale (aucun faux extrait possible).
export function BoutonSignaler({
  type,
  cibleId,
  classe = "text-[11.5px] font-bold hover:text-[var(--corail)]",
}: {
  type: "post" | "commentaire" | "message";
  cibleId: string;
  classe?: string;
}) {
  const [etat, setEtat] = useState<Etat>("ferme");
  const [motif, setMotif] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEtat("envoi");
    setErreur(null);
    const r = await signaler(type, cibleId, motif);
    if (r.erreur) {
      setErreur(r.erreur);
      setEtat("ouvert");
    } else {
      setEtat("fait");
    }
  }

  if (etat === "fait") {
    return <span className="text-[11.5px] text-[var(--sarcelle)]">Signalé, merci. Un admin va l&apos;examiner.</span>;
  }
  if (etat === "ferme") {
    return (
      <button type="button" onClick={() => setEtat("ouvert")} className={classe}>
        ⚑ Signaler
      </button>
    );
  }

  return (
    <form onSubmit={envoyer} className="flex w-full flex-col gap-2 rounded-lg border border-[var(--ligne)] bg-[var(--fond)] p-3">
      <label className="text-[11.5px] font-bold">Pourquoi signales-tu ce contenu ?</label>
      <textarea
        value={motif}
        onChange={(e) => setMotif(e.target.value)}
        required
        minLength={3}
        maxLength={500}
        rows={2}
        autoFocus
        placeholder="Harcèlement, spam, contenu déplacé..."
        className="resize-none rounded-md border border-[var(--ligne)] bg-[var(--fond-carte)] px-2.5 py-2 text-[12.5px]"
      />
      {erreur && <p className="text-[12px] text-[var(--corail)]">{erreur}</p>}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setEtat("ferme")}
          disabled={etat === "envoi"}
          className="rounded-md border border-[var(--ligne)] px-3 py-1.5 text-[11.5px] font-bold text-[var(--texte-mute)]"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={etat === "envoi"}
          className="rounded-md bg-[var(--corail)] px-3 py-1.5 text-[11.5px] font-bold text-[var(--encre)] disabled:opacity-60"
        >
          {etat === "envoi" ? "Envoi..." : "Signaler"}
        </button>
      </div>
    </form>
  );
}
