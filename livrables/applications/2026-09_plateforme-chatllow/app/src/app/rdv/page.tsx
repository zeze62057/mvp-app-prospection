"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

function MarqueChatllow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6 shrink-0">
      <rect x="4" y="4" width="40" height="40" rx="13" fill="#14161F" opacity="0.14" />
      <rect x="20" y="20" width="40" height="40" rx="13" fill="oklch(62% 0.19 250)" />
    </svg>
  );
}

const CRENEAUX = [
  { jour: "[jour 1]", heure: "10:00" },
  { jour: "[jour 1]", heure: "15:30" },
  { jour: "[jour 2]", heure: "09:00" },
  { jour: "[jour 2]", heure: "14:00" },
  { jour: "[jour 3]", heure: "11:30" },
  { jour: "[jour 3]", heure: "16:00" },
];

export default function RdvPage() {
  const [choisi, setChoisi] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [confirme, setConfirme] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const creneauChoisi = choisi !== null ? CRENEAUX[choisi] : null;

  async function confirmer() {
    if (choisi === null || !email.trim()) return;
    setEnCours(true);
    setErreur(null);

    const { error } = await supabase.from("chatllow_rdv").insert({
      email: email.trim(),
      jour: CRENEAUX[choisi].jour,
      heure: CRENEAUX[choisi].heure,
    });

    setEnCours(false);
    if (error) {
      setErreur("La confirmation a échoué, réessayez dans un instant.");
      return;
    }
    setConfirme(true);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-[var(--ligne)] px-6 py-6 sm:px-16">
        <MarqueChatllow />
        <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold">
          Chatllow
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-10 sm:px-16">
        {confirme ? (
          <div className="flex flex-col items-center gap-3.5 text-center">
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[var(--indigo-soft)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 13l4 4L20 6"
                  stroke="oklch(62% 0.19 250)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[20px] font-semibold">
              Rendez-vous confirmé
            </h1>
            <p className="text-[13.5px] text-[var(--texte-mute)]">
              {creneauChoisi?.jour} à {creneauChoisi?.heure} &middot; une invitation suit
              par email.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-3.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--indigo)]">
              Rendez-vous
            </p>
            <h1 className="mb-2 font-[family-name:var(--font-display)] text-[26px] font-semibold">
              Choisissez un <span className="accent-italic">créneau</span>
            </h1>
            <p className="mb-9 text-[13.5px] text-[var(--texte-mute)]">
              Échange de 30 minutes pour approfondir le pilote recommandé.
            </p>

            <div className="mb-8 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
              {CRENEAUX.map((creneau, i) => {
                const selectionne = choisi === i;
                return (
                  <button
                    key={`${creneau.jour}-${creneau.heure}`}
                    type="button"
                    onClick={() => setChoisi(i)}
                    className={`rounded-lg border px-3.5 py-3.5 text-center ${
                      selectionne
                        ? "border-[var(--indigo)] bg-[var(--indigo-soft)]"
                        : "border-[var(--ligne)] bg-[var(--fond-carte)]"
                    }`}
                  >
                    <div className="mb-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--texte-mute)]">
                      {creneau.jour}
                    </div>
                    <div className="font-[family-name:var(--font-display)] text-[15px] font-semibold">
                      {creneau.heure}
                    </div>
                  </button>
                );
              })}
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="[votre email professionnel]"
              className="mb-4 w-full max-w-xs rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3.5 py-2.5 text-center text-[13px]"
            />

            <button
              type="button"
              disabled={choisi === null || !email.trim() || enCours}
              onClick={confirmer}
              className={`rounded-full bg-[var(--encre)] px-7 py-3.5 text-[14.5px] font-semibold text-[var(--fond)] ${
                choisi === null || !email.trim() || enCours ? "opacity-35" : ""
              }`}
            >
              {enCours ? "Confirmation..." : "Confirmer le rendez-vous"}
            </button>
            {erreur && (
              <p className="mt-3 text-[12px] text-red-600">{erreur}</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
