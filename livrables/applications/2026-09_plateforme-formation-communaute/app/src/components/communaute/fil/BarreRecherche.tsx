import Link from "next/link";

// Recherche dans le fil : un simple formulaire GET (?q=), sans JavaScript. La categorie active
// est conservee dans un champ cache, pour chercher a l'interieur d'une categorie.
export function BarreRecherche({
  base,
  terme,
  categorieActive,
}: {
  base: string; // chemin du fil, sans query
  terme: string | null;
  categorieActive: string | null;
}) {
  return (
    <form action={base} method="get" role="search" className="mb-3 flex items-center gap-2">
      {categorieActive && <input type="hidden" name="cat" value={categorieActive} />}
      <input
        type="search"
        name="q"
        defaultValue={terme ?? ""}
        maxLength={80}
        placeholder="Rechercher dans le fil"
        aria-label="Rechercher dans le fil"
        className="min-w-0 flex-1 rounded-[10px] border border-[var(--ligne)] bg-[var(--fond-carte)] px-3.5 py-2 text-[13px] text-[var(--texte)] outline-none placeholder:text-[var(--texte-mute)] focus:border-[var(--sarcelle)]"
      />
      <button
        type="submit"
        className="shrink-0 rounded-[10px] bg-[var(--encre)] px-3.5 py-2 text-[12.5px] font-bold text-[var(--sur-encre)]"
      >
        Chercher
      </button>
      {terme && (
        <Link
          href={categorieActive ? `${base}?cat=${categorieActive}` : base}
          scroll={false}
          className="shrink-0 text-xs text-[var(--texte-mute)] underline"
        >
          Effacer
        </Link>
      )}
    </form>
  );
}
