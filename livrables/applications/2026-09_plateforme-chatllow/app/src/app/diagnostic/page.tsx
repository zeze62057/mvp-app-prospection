"use client";

import { useState } from "react";
import Link from "next/link";
import { QUESTIONS } from "@/lib/diagnostic-questions";

function MarqueChatllow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6 shrink-0">
      <rect x="4" y="4" width="40" height="40" rx="13" fill="#14161F" opacity="0.14" />
      <rect x="20" y="20" width="40" height="40" rx="13" fill="oklch(62% 0.19 250)" />
    </svg>
  );
}

export default function DiagnosticPage() {
  const [step, setStep] = useState(0);
  const [reponses, setReponses] = useState<Record<number, string>>({});
  const [termine, setTermine] = useState(false);

  const question = QUESTIONS[step];
  const aRepondu = !!reponses[step];
  const dernier = step === QUESTIONS.length - 1;

  function repondre(choix: string) {
    setReponses((r) => ({ ...r, [step]: choix }));
  }

  function suivant() {
    if (!aRepondu) return;
    if (dernier) {
      const toutesReponses = QUESTIONS.map((_, i) => reponses[i]);
      sessionStorage.setItem(
        "chatllow_diagnostic_reponses",
        JSON.stringify(toutesReponses)
      );
      setTermine(true);
      return;
    }
    setStep((s) => s + 1);
  }

  function retour() {
    setStep((s) => Math.max(0, s - 1));
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
        {termine ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--indigo-soft)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 13l4 4L20 6"
                  stroke="oklch(62% 0.19 250)"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[22px] font-semibold">
              Diagnostic terminé
            </h1>
            <p className="max-w-sm text-[13.5px] text-[var(--texte-mute)]">
              Prochaine étape : la restitution, avec la recommandation de pilote et l&apos;envoi
              du résultat.
            </p>
            <Link
              href="/restitution"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--encre)] px-6 py-3.5 text-[14.5px] font-semibold text-[var(--fond)]"
            >
              Voir ma recommandation <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        ) : (
          <div className="flex w-full max-w-xl flex-col items-center">
            <div className="mb-10 flex w-full max-w-md gap-2">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    reponses[i] ? "bg-[var(--indigo)]" : "bg-[var(--ligne)]"
                  }`}
                />
              ))}
            </div>

            <p className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide text-[var(--texte-mute)]">
              Question {step + 1} sur {QUESTIONS.length} &middot; réponses confidentielles
            </p>
            <h1 className="mb-9 max-w-xl text-center font-[family-name:var(--font-display)] text-2xl font-semibold leading-snug sm:text-[27px]">
              {question.question}
            </h1>

            <div className="flex w-full max-w-md flex-col gap-3">
              {question.options.map((option) => {
                const selectionne = reponses[step] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => repondre(option)}
                    className={`rounded-xl border px-5 py-4 text-left text-[14.5px] ${
                      selectionne
                        ? "border-[var(--indigo)] bg-[var(--indigo-soft)] font-semibold"
                        : "border-[var(--ligne)] bg-[var(--fond-carte)]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-9 flex items-center gap-4">
              <button
                type="button"
                onClick={suivant}
                disabled={!aRepondu}
                className={`rounded-full bg-[var(--encre)] px-7 py-3.5 text-[14.5px] font-semibold text-[var(--fond)] ${
                  aRepondu ? "" : "opacity-35"
                }`}
              >
                {dernier ? "Voir ma recommandation" : "Suivant"}
              </button>
              {step > 0 && (
                <button
                  type="button"
                  onClick={retour}
                  className="text-[13.5px] text-[var(--texte-mute)]"
                >
                  Retour
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
