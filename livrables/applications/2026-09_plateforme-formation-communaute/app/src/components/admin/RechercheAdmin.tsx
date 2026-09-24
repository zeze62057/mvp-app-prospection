"use client";

import { useEffect, useRef } from "react";
import { GROUPES } from "./MenuAdmin";

// Recherche de la barre du haut : saute vers la section ou la page dont le nom correspond (memes
// entrees que le menu) ; sinon le texte est cherche parmi les eleves. Raccourci : Ctrl+K ou Cmd+K.
const SECTIONS = GROUPES.flatMap((g) => g.entrees);

const normaliser = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

export function RechercheAdmin() {
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
    <form
      className="min-w-full sm:min-w-0 sm:flex-1"
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
  );
}
