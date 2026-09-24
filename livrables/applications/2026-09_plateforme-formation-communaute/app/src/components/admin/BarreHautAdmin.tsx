"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { GROUPES } from "./MenuAdmin";

// Barre du haut de l'espace admin. La recherche saute vers la section ou la page dont le nom
// correspond (memes entrees que le menu) ; sinon le texte est cherche parmi les eleves.
// Raccourci clavier : Ctrl+K ou Cmd+K.
const SECTIONS = GROUPES.flatMap((g) => g.entrees).filter((e): e is { libelle: string; href: string } => !!e.href);

const normaliser = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

export function BarreHautAdmin({ pseudo, nbAttente }: { pseudo: string; nbAttente?: number }) {
  const champ = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function touche(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        champ.current?.focus();
      }
    }
    window.addEventListener("keydown", touche);
    return () => window.removeEventListener("keydown", touche);
  }, []);

  function aller(texte: string) {
    const cherche = normaliser(texte);
    if (!cherche) return;
    const trouvee = SECTIONS.find((s) => normaliser(s.libelle).includes(cherche));
    window.location.href = trouvee ? trouvee.href : `/admin/eleves?q=${encodeURIComponent(texte.trim())}`;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <form
        className="relative min-w-full sm:min-w-0 sm:flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          aller(new FormData(e.currentTarget).get("q") as string);
        }}
      >
        <div className="relative max-w-md">
          <input
            ref={champ}
            name="q"
            list="sections-admin"
            onChange={(e) => {
              if (SECTIONS.some((s) => s.libelle === e.target.value)) aller(e.target.value);
            }}
            placeholder="Rechercher une section ou un élève..."
            aria-label="Rechercher une section ou un élève"
            className="w-full rounded-full border border-[var(--ligne)] bg-[var(--fond-carte)] py-2 pl-4 pr-16 text-[12.5px] outline-none focus:border-[var(--sarcelle)]"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-[var(--ligne)] px-1.5 font-mono text-[10px] text-[var(--texte-mute)] sm:block">
            Ctrl K
          </kbd>
        </div>
        <datalist id="sections-admin">
          {SECTIONS.map((s) => (
            <option key={s.href} value={s.libelle} />
          ))}
        </datalist>
      </form>

      {nbAttente !== undefined && (
        <Link
          href="/admin/notifications"
          aria-label={`${nbAttente} élément${nbAttente !== 1 ? "s" : ""} en attente`}
          title={nbAttente > 0 ? `${nbAttente} en attente de ton action` : "Rien en attente"}
          className="relative rounded-full border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-2 text-[14px]"
        >
          🔔
          {nbAttente > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-[var(--corail)] px-1.5 font-mono text-[10px] font-bold text-[var(--encre)]">
              {nbAttente}
            </span>
          )}
        </Link>
      )}

      <div className="flex items-center gap-2.5 rounded-full border border-[var(--ligne)] bg-[var(--fond-carte)] py-1 pl-1 pr-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--encre)] font-display text-[13px] font-bold uppercase text-[var(--sur-encre)]">
          {pseudo.charAt(0) || "A"}
        </span>
        <span className="leading-tight">
          <span className="block text-[12.5px] font-bold">{pseudo || "Admin"}</span>
          <span className="block font-mono text-[10px] text-[var(--texte-mute)]">Administrateur</span>
        </span>
      </div>
    </div>
  );
}
