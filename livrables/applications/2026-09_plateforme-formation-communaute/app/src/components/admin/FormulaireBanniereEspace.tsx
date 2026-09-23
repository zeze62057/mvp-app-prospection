"use client";

import { useRef, useState } from "react";

export function FormulaireBanniereEspace({
  espace,
  bannierUrl,
}: {
  espace: { id: string; nom: string };
  bannierUrl: string | null;
}) {
  const [etat, setEtat] = useState<"idle" | "envoi" | "envoye" | "erreur">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function envoyer(formData: FormData) {
    setEtat("envoi");
    setMessage(null);

    const reponse = await fetch("/api/admin/banniere-espace", {
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
    setMessage("Banniere mise a jour. Rafraichis la page pour la voir.");
    formRef.current?.reset();
  }

  return (
    <li className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <p className="text-sm font-medium">{espace.nom}</p>
      {bannierUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- apercu simple, pas besoin d'optimisation Next/Image ici
        <img src={bannierUrl} alt="" className="mt-2 h-16 w-full rounded-lg object-cover" />
      ) : (
        <p className="mt-2 text-xs text-[var(--texte-mute)]">Aucune banniere, degrade par defaut affiche.</p>
      )}
      <form ref={formRef} action={envoyer} className="mt-3 flex flex-wrap items-end gap-3">
        <input type="hidden" name="espace_id" value={espace.id} />
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[var(--texte-mute)]">Nouvelle image (jpeg, png, webp, 5 Mo max)</label>
          <input name="fichier" type="file" accept="image/jpeg,image/png,image/webp" required className="text-xs" />
        </div>
        <button
          type="submit"
          disabled={etat === "envoi"}
          className="rounded-lg bg-[var(--sarcelle)] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
        >
          {etat === "envoi" ? "Envoi..." : "Changer la banniere"}
        </button>
        {message && (
          <span className={`text-xs ${etat === "erreur" ? "text-[var(--corail)]" : "text-[var(--sarcelle)]"}`}>
            {message}
          </span>
        )}
      </form>
    </li>
  );
}
