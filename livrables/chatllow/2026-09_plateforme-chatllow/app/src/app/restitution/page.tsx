"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const PILOTE_RECOMMANDE = "Assistant IA pour la synthèse de réunions et comptes rendus";

function MarqueChatllow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6 shrink-0">
      <rect x="4" y="4" width="40" height="40" rx="13" fill="#14161F" opacity="0.14" />
      <rect x="20" y="20" width="40" height="40" rx="13" fill="oklch(62% 0.19 250)" />
    </svg>
  );
}

const POURQUOI = [
  "Le processus identifié comme le plus chronophage (reporting manuel) est directement adressable par ce type d'outil.",
  "Une équipe déjà utilisatrice d'IA au quotidien peut porter le pilote sans formation lourde préalable.",
  "Résultat mesurable en quelques semaines, sans dépendance à un chantier de données plus large.",
];

export default function RestitutionPage() {
  const [envoye, setEnvoye] = useState(false);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function envoyer(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEnvoiEnCours(true);
    setErreur(null);

    const brut = sessionStorage.getItem("chatllow_diagnostic_reponses");
    const reponses = brut ? (JSON.parse(brut) as string[]) : [];

    const { error } = await supabase.from("chatllow_diagnostics").insert({
      email: email.trim(),
      reponses,
      pilote_recommande: PILOTE_RECOMMANDE,
    });

    setEnvoiEnCours(false);
    if (error) {
      setErreur("L'envoi a échoué, réessayez dans un instant.");
      return;
    }
    setEnvoye(true);

    fetch("/api/notifier-diagnostic", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        reponses,
        piloteRecommande: PILOTE_RECOMMANDE,
      }),
    }).catch(() => {
      // Best-effort : le lead est deja sauvegarde, on n'affiche rien au visiteur.
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-3 border-b border-[var(--ligne)] px-6 py-6 sm:px-16">
        <MarqueChatllow />
        <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold">
          Chatllow
        </span>
      </header>

      <main className="flex flex-1 flex-col gap-10 px-6 py-14 sm:px-16 lg:flex-row lg:gap-12">
        <div className="flex-[1.3]">
          <p className="mb-3.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--indigo)]">
            Pilote recommandé
          </p>
          <h1 className="mb-5 max-w-2xl font-[family-name:var(--font-display)] text-[32px] font-semibold leading-tight">
            Assistant IA pour la <span className="accent-italic">synthèse</span> de
            réunions et comptes rendus
          </h1>
          <p className="mb-8 max-w-xl text-[14.5px] leading-relaxed text-[var(--texte-mute)]">
            Le reporting manuel est votre plus grosse fuite de temps, et une équipe
            utilise déjà l&apos;IA au quotidien. Les deux conditions pour un pilote
            rapide sont réunies — pas besoin d&apos;attendre un grand chantier data.
          </p>

          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-6">
            <p className="mb-3 font-[family-name:var(--font-display)] text-[14.5px] font-semibold">
              Pourquoi ce pilote
            </p>
            <ul className="flex flex-col gap-2">
              {POURQUOI.map((raison) => (
                <li
                  key={raison}
                  className="flex gap-2.5 text-[13.5px] leading-relaxed text-[var(--texte-mute)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--indigo)]" />
                  {raison}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5">
          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-6">
            <p className="mb-1.5 font-[family-name:var(--font-display)] text-[14.5px] font-semibold">
              Recevoir ce résultat par email
            </p>
            <p className="mb-4 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
              Un récapitulatif complet du diagnostic et de la recommandation, envoyé
              immédiatement. Vos données restent confidentielles.
            </p>
            {envoye ? (
              <div className="flex items-center gap-1.5 text-[12.5px] text-[var(--indigo)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 13l4 4L20 6"
                    stroke="oklch(62% 0.19 250)"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Résultat envoyé.
              </div>
            ) : (
              <form onSubmit={envoyer} className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="[votre email professionnel]"
                    className="flex-1 rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13px]"
                  />
                  <button
                    type="submit"
                    disabled={envoiEnCours}
                    className="whitespace-nowrap rounded-full bg-[var(--encre)] px-4.5 py-2.5 text-[13px] font-semibold text-[var(--fond)] disabled:opacity-50"
                  >
                    {envoiEnCours ? "Envoi..." : "Envoyer"}
                  </button>
                </div>
                {erreur && (
                  <p className="text-[12px] text-red-600">{erreur}</p>
                )}
              </form>
            )}
          </div>

          <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-6">
            <p className="mb-1.5 font-[family-name:var(--font-display)] text-[14.5px] font-semibold">
              Aller plus loin
            </p>
            <p className="mb-4 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
              Prendre rendez-vous avec Chatllow pour approfondir ce pilote et son
              cadrage.
            </p>
            <Link
              href="/rdv"
              className="block w-full rounded-full border border-[var(--encre)] px-4.5 py-2.5 text-center text-[13px] font-semibold text-[var(--encre)]"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
