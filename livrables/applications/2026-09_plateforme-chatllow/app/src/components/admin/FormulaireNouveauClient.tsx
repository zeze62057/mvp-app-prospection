"use client";

import { useActionState, useState } from "react";
import { creerClient, type EtatNouveauClient } from "@/app/admin/actions";

const initial: EtatNouveauClient = { erreur: null, identifiants: null };
const CHAMP = "w-full rounded-xl border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13.5px] focus:border-[var(--indigo)] focus:outline-none";

export function FormulaireNouveauClient() {
  const [etat, action, enCours] = useActionState(creerClient, initial);
  const [copie, setCopie] = useState(false);
  const ident = etat.identifiants;

  return (
    <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
      <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Nouveau client</h2>
      <form action={action} className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor="nc-email" className="mb-1 block text-[12px] font-semibold">Adresse e-mail</label>
          <input id="nc-email" name="email" type="email" required placeholder="contact@entreprise.com" className={CHAMP} />
        </div>
        <div>
          <label htmlFor="nc-entreprise" className="mb-1 block text-[12px] font-semibold">Entreprise</label>
          <input id="nc-entreprise" name="entreprise" required maxLength={120} className={CHAMP} />
        </div>
        <div>
          <label htmlFor="nc-contact" className="mb-1 block text-[12px] font-semibold">Nom du contact</label>
          <input id="nc-contact" name="contact" required maxLength={120} className={CHAMP} />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" disabled={enCours} className="rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13px] font-semibold text-[var(--fond)] disabled:opacity-60">
            {enCours ? "Création…" : "Créer le client →"}
          </button>
        </div>
      </form>

      {etat.erreur && <p role="alert" className="mt-3 rounded-lg bg-[rgba(255,107,107,0.14)] px-3.5 py-2 text-[12.5px] font-semibold text-[#b53a3a]">{etat.erreur}</p>}

      {ident && (
        <div role="status" className="mt-4 rounded-xl border border-[oklch(82%_0.07_250)] bg-[var(--indigo-soft)] p-4">
          <p className="text-[13px] font-semibold">Client créé : {ident.contact}</p>
          {ident.motDePasse ? (
            <>
              <p className="mt-2 text-[12.5px] text-[var(--texte-mute)]">
                Transmettez ces identifiants par un canal privé. <b>Le mot de passe ne sera plus affiché.</b>
              </p>
              <dl className="mt-3 grid gap-2 text-[13px] sm:grid-cols-[auto_1fr] sm:gap-x-4">
                <dt className="font-semibold">Connexion</dt>
                <dd className="font-[family-name:var(--font-mono)]">{ident.email}</dd>
                <dt className="font-semibold">Mot de passe</dt>
                <dd className="font-[family-name:var(--font-mono)]">{ident.motDePasse}</dd>
              </dl>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(`Connexion : ${ident.email}\nMot de passe : ${ident.motDePasse}`).catch(() => {});
                  setCopie(true);
                }}
                className="mt-3 rounded-full border border-[var(--ligne)] bg-white px-4 py-1.5 text-[12px] font-semibold"
              >
                {copie ? "Copié ✓" : "Copier les identifiants"}
              </button>
            </>
          ) : (
            <p className="mt-2 text-[12.5px] text-[var(--texte-mute)]">
              Ce compte existait déjà (par exemple sur Vivier). L&apos;accès à l&apos;espace client est ouvert, <b>son mot de passe n&apos;a pas été modifié</b> : il se connecte avec celui qu&apos;il utilise déjà.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
