"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { chercherMembres, type MembreTrouve } from "@/app/(membre)/[espace]/messages/actions";
import { Avatar } from "@/components/communaute/fil/Avatar";

const DELAI_MS = 300;

// Recherche d'un membre de l'espace pour lui ecrire. Sans saisie, la liste montre les
// premiers membres par ordre alphabetique, pour pouvoir demarrer une conversation
// sans avoir a connaitre un pseudo.
export function RechercheMembre({ espaceSlug }: { espaceSlug: string }) {
  const [saisie, setSaisie] = useState("");
  const [membres, setMembres] = useState<MembreTrouve[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    if (!ouvert) return;
    let actif = true;
    const minuteur = setTimeout(async () => {
      setChargement(true);
      const r = await chercherMembres(espaceSlug, saisie);
      if (!actif) return;
      setMembres(r.membres);
      setErreur(r.erreur);
      setChargement(false);
    }, DELAI_MS);
    return () => {
      actif = false;
      clearTimeout(minuteur);
    };
  }, [saisie, ouvert, espaceSlug]);

  if (!ouvert) {
    return (
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="mb-5 w-full rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 text-left text-[13.5px] text-[var(--texte-mute)]"
      >
        ✉ Écrire à un membre...
      </button>
    );
  }

  return (
    <div className="mb-5 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <div className="flex items-center gap-2">
        <input
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          autoFocus
          maxLength={50}
          placeholder="Chercher un membre par pseudo"
          aria-label="Chercher un membre par pseudo"
          className="min-w-0 flex-1 rounded-lg border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2 text-[13px]"
        />
        <button
          type="button"
          onClick={() => {
            setOuvert(false);
            setSaisie("");
          }}
          className="text-[12.5px] font-bold text-[var(--texte-mute)] underline"
        >
          Fermer
        </button>
      </div>

      {erreur && <p className="mt-3 text-[13px] text-[var(--corail)]">{erreur}</p>}
      <ul className="mt-3 flex max-h-72 flex-col gap-1 overflow-y-auto">
        {membres.map((m) => (
          <li key={m.id}>
            <Link
              href={`/${espaceSlug}/messages/${m.id}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[var(--fond)]"
            >
              <Avatar id={m.id} pseudo={m.pseudo} taille={32} urlPhoto={m.avatarUrl} />
              <span className="text-[13.5px] font-bold">{m.pseudo}</span>
            </Link>
          </li>
        ))}
        {!chargement && !erreur && membres.length === 0 && (
          <li className="px-2 py-2 text-[13px] text-[var(--texte-mute)]">Aucun membre trouvé.</li>
        )}
        {chargement && membres.length === 0 && (
          <li className="px-2 py-2 text-[13px] text-[var(--texte-mute)]">Recherche...</li>
        )}
      </ul>
    </div>
  );
}
