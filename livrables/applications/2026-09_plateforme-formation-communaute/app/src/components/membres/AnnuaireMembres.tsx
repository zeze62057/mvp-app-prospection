"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { chargerMembres } from "@/app/(membre)/[espace]/membres/actions";
import type { FiltreAnnuaire, MembreAnnuaire, TriAnnuaire } from "@/lib/annuaire";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { BadgeMembre } from "@/components/communaute/BadgeMembre";

const DELAI_MS = 300;

const FILTRES: { valeur: FiltreAnnuaire; libelle: string }[] = [
  { valeur: "tous", libelle: "Tous" },
  { valeur: "admins", libelle: "Admins" },
  { valeur: "experts", libelle: "Experts" },
];

// Annuaire des membres d'un espace : recherche par pseudo, filtres, tri, et "Voir plus"
// (24 membres par page). La premiere page vient du serveur (aucun scintillement) ; toute
// modification de la recherche, du filtre ou du tri recharge depuis la premiere page.
export function AnnuaireMembres({
  espaceSlug,
  userId,
  initial,
}: {
  espaceSlug: string;
  userId: string;
  initial: { membres: MembreAnnuaire[]; total: number; erreur: string | null };
}) {
  const [saisie, setSaisie] = useState("");
  const [filtre, setFiltre] = useState<FiltreAnnuaire>("tous");
  const [tri, setTri] = useState<TriAnnuaire>("alpha");
  const [membres, setMembres] = useState(initial.membres);
  const [total, setTotal] = useState(initial.total);
  const [erreur, setErreur] = useState<string | null>(initial.erreur);
  const [chargement, setChargement] = useState(false);
  const [plusEnCours, setPlusEnCours] = useState(false);
  const premierRendu = useRef(true);

  useEffect(() => {
    // La premiere page est deja affichee : pas de requete au montage.
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    let actif = true;
    const minuteur = setTimeout(async () => {
      setChargement(true);
      const r = await chargerMembres(espaceSlug, { q: saisie, filtre, tri, decalage: 0 });
      if (!actif) return;
      setMembres(r.membres);
      setTotal(r.total);
      setErreur(r.erreur);
      setChargement(false);
    }, DELAI_MS);
    return () => {
      actif = false;
      clearTimeout(minuteur);
    };
  }, [saisie, filtre, tri, espaceSlug]);

  async function voirPlus() {
    setPlusEnCours(true);
    const r = await chargerMembres(espaceSlug, { q: saisie, filtre, tri, decalage: membres.length });
    // On ecarte un doublon possible si quelqu'un a rejoint entre deux pages.
    const deja = new Set(membres.map((m) => m.id));
    setMembres([...membres, ...r.membres.filter((m) => !deja.has(m.id))]);
    setTotal(r.total || total);
    setErreur(r.erreur);
    setPlusEnCours(false);
  }

  return (
    <div>
      <input
        value={saisie}
        onChange={(e) => setSaisie(e.target.value)}
        maxLength={50}
        placeholder="Chercher un membre par pseudo"
        aria-label="Chercher un membre par pseudo"
        className="mb-3 w-full rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 text-[13.5px]"
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {FILTRES.map((f) => (
          <button
            key={f.valeur}
            type="button"
            aria-pressed={filtre === f.valeur}
            onClick={() => setFiltre(f.valeur)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[11.5px] font-bold ${
              filtre === f.valeur
                ? "border-[var(--sarcelle)] bg-[var(--sarcelle)] text-[var(--sur-encre)]"
                : "border-[var(--ligne)] bg-[var(--fond-carte)] text-[var(--texte-mute)]"
            }`}
          >
            {f.libelle}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 font-mono text-[11.5px] text-[var(--texte-mute)]">
          <span className="sr-only sm:not-sr-only">Trier</span>
          <select
            value={tri}
            onChange={(e) => setTri(e.target.value as TriAnnuaire)}
            aria-label="Trier les membres"
            className="rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-2.5 py-1.5 text-[12px] text-[var(--texte)]"
          >
            <option value="alpha">Ordre alphabétique</option>
            <option value="points">Plus de points</option>
          </select>
        </label>
      </div>

      <p className="mb-3 font-mono text-[11.5px] text-[var(--texte-mute)]" aria-live="polite">
        {chargement ? "Chargement..." : `${total} membre${total > 1 ? "s" : ""}`}
      </p>

      {erreur && <p className="mb-3 text-[12.5px] text-[var(--corail)]">{erreur}</p>}

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {membres.map((m) => (
          <li key={m.id}>
            <Link
              href={`/${espaceSlug}/membres/${m.id}`}
              className="flex items-center gap-3 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 hover:border-[rgba(43,140,130,0.4)]"
            >
              <Avatar id={m.id} pseudo={m.pseudo} taille={44} urlPhoto={m.avatarUrl} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <b className="truncate text-[13.5px]">{m.pseudo}</b>
                  {m.id === userId && (
                    <span className="font-mono text-[10px] text-[var(--texte-mute)]">(toi)</span>
                  )}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2">
                  <BadgeMembre estExpert={m.estExpert} role={m.role} points={m.points} />
                  <span className="font-mono text-[10.5px] text-[var(--texte-mute)]">
                    {m.points} pt{m.points > 1 ? "s" : ""}
                  </span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {!chargement && !erreur && membres.length === 0 && (
        <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
          Aucun membre ne correspond.
        </p>
      )}

      {membres.length < total && (
        <button
          type="button"
          onClick={voirPlus}
          disabled={plusEnCours}
          className="mt-5 w-full rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 text-[13px] font-bold text-[var(--sarcelle)] disabled:opacity-60"
        >
          {plusEnCours ? "Chargement..." : `Voir plus (${total - membres.length} restants)`}
        </button>
      )}
    </div>
  );
}
