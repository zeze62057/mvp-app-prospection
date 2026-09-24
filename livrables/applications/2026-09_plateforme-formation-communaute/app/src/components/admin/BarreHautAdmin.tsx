"use client";

import { GROUPES } from "./MenuAdmin";

// Barre du haut de l'espace admin. La recherche ne cherche pas dans des
// utilisateurs ou des cours (pas de page dediee) : elle saute vers la section
// de la page qui correspond au mot tape, a partir des memes entrees que le menu.
const SECTIONS = GROUPES.flatMap((g) => g.entrees).filter((e): e is { libelle: string; href: string } => !!e.href);

const normaliser = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

export function BarreHautAdmin({
  pseudo,
  nbAttente,
  cible,
}: {
  pseudo: string;
  nbAttente: number;
  cible: string;
}) {
  function aller(texte: string) {
    const cherche = normaliser(texte);
    if (!cherche) return;
    const trouvee = SECTIONS.find((s) => normaliser(s.libelle).includes(cherche));
    if (trouvee) window.location.hash = trouvee.href;
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <form
        className="min-w-full sm:min-w-0 sm:flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          aller(new FormData(e.currentTarget).get("q") as string);
        }}
      >
        <input
          name="q"
          list="sections-admin"
          onChange={(e) => {
            if (SECTIONS.some((s) => s.libelle === e.target.value)) aller(e.target.value);
          }}
          placeholder="Aller à une section (paiements, devoirs, modération...)"
          aria-label="Aller à une section"
          className="w-full max-w-md rounded-full border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-2 text-[12.5px] outline-none focus:border-[var(--sarcelle)]"
        />
        <datalist id="sections-admin">
          {SECTIONS.map((s) => (
            <option key={s.href} value={s.libelle} />
          ))}
        </datalist>
      </form>

      <a
        href={cible}
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
      </a>

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
