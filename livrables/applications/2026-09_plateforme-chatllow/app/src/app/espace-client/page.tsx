"use client";

import { useState } from "react";

function MarqueChatllow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6 shrink-0">
      <rect x="4" y="4" width="40" height="40" rx="13" fill="#14161F" opacity="0.14" />
      <rect x="20" y="20" width="40" height="40" rx="13" fill="oklch(62% 0.19 250)" />
    </svg>
  );
}

type Onglet = "suivi" | "livrables" | "echanges";

const ETAPES = [
  { titre: "Cadrage", statut: "done" as const },
  { titre: "Diagnostic approfondi", statut: "done" as const },
  { titre: "Déploiement pilote", statut: "current" as const },
  { titre: "Suivi & bilan", statut: "todo" as const },
];

const LIVRABLES = [
  { nom: "Rapport de cadrage", meta: "PDF · déposé le [date]", action: "Télécharger" },
  {
    nom: "Compte rendu diagnostic approfondi",
    meta: "PDF · déposé le [date]",
    action: "Télécharger",
  },
  { nom: "Spécification du pilote", meta: "En cours de rédaction", action: "Voir le détail" },
];

export default function EspaceClientPage() {
  const [onglet, setOnglet] = useState<Onglet>("suivi");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-[var(--ligne)] px-6 py-5 sm:px-16">
        <div className="flex items-center gap-3">
          <MarqueChatllow />
          <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold">
            Chatllow
          </span>
        </div>
        <span className="font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--texte-mute)]">
          [Nom de l&apos;entreprise cliente]
        </span>
      </header>

      <nav className="flex gap-7 border-b border-[var(--ligne)] px-6 sm:px-16">
        {(
          [
            { id: "suivi", label: "Suivi de mission" },
            { id: "livrables", label: "Livrables" },
            { id: "echanges", label: "Échanges" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setOnglet(tab.id)}
            className={`border-b-2 py-4 text-[13.5px] ${
              onglet === tab.id
                ? "border-[var(--indigo)] font-semibold text-[var(--texte)]"
                : "border-transparent font-medium text-[var(--texte-mute)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 px-6 py-10 sm:px-16">
        {onglet === "suivi" && (
          <>
            <div className="mb-10 flex">
              {ETAPES.map((etape) => (
                <div key={etape.titre} className="flex flex-1 flex-col gap-2">
                  <div
                    className={`h-1 rounded-full ${
                      etape.statut === "done"
                        ? "bg-[var(--indigo)]"
                        : etape.statut === "current"
                          ? "bg-[var(--indigo)] opacity-50"
                          : "bg-[var(--ligne)]"
                    }`}
                  />
                  <div
                    className={`text-[12.5px] ${
                      etape.statut === "current"
                        ? "font-semibold text-[var(--texte)]"
                        : "text-[var(--texte-mute)]"
                    }`}
                  >
                    {etape.titre}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-4">
              <div>
                <div className="text-sm font-medium">
                  Prochaine étape : atelier de cadrage du pilote
                </div>
                <div className="mt-0.5 font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--texte-mute)]">
                  Prévue le [date]
                </div>
              </div>
              <button
                type="button"
                className="rounded-lg border border-[var(--encre)] px-4 py-2 text-[12.5px] font-semibold text-[var(--encre)]"
              >
                Voir le détail
              </button>
            </div>
          </>
        )}

        {onglet === "livrables" && (
          <div className="flex flex-col gap-3">
            {LIVRABLES.map((livrable) => (
              <div
                key={livrable.nom}
                className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-4"
              >
                <div>
                  <div className="text-sm font-medium">{livrable.nom}</div>
                  <div className="mt-0.5 font-[family-name:var(--font-mono)] text-[11.5px] text-[var(--texte-mute)]">
                    {livrable.meta}
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--encre)] px-4 py-2 text-[12.5px] font-semibold text-[var(--encre)]"
                >
                  {livrable.action}
                </button>
              </div>
            ))}
          </div>
        )}

        {onglet === "echanges" && (
          <div className="flex flex-col gap-4">
            <div className="flex max-w-[60%] flex-col">
              <div className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 text-[13.5px] leading-relaxed">
                Le compte rendu du diagnostic approfondi est déposé dans vos livrables,
                avec la spécification proposée pour le pilote.
              </div>
              <div className="mt-1.5 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--texte-mute)]">
                Chatllow &middot; [date]
              </div>
            </div>
            <div className="flex max-w-[60%] flex-col self-end items-end">
              <div className="rounded-xl bg-[var(--indigo-soft)] px-4 py-3 text-[13.5px] leading-relaxed">
                Reçu, on regarde ça en interne et on revient avant l&apos;atelier de
                cadrage.
              </div>
              <div className="mt-1.5 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--texte-mute)]">
                [Nom du client] &middot; [date]
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
