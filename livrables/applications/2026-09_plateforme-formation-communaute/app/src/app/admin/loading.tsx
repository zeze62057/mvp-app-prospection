// Etat de chargement des pages d'administration (tableaux de bord lourds).
export default function ChargementAdmin() {
  return (
    <div className="flex flex-col gap-3 p-6" aria-busy="true" aria-label="Chargement">
      <div className="h-6 w-56 animate-pulse rounded-lg bg-[var(--ligne)]" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)]"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)]" />
    </div>
  );
}
