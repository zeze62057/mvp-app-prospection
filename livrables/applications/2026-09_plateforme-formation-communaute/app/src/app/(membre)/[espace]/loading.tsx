// Etat de chargement des pages membres (fil, formation, messages...) :
// evite un ecran blanc pendant les requetes de la page.
export default function ChargementMembre() {
  return (
    <div className="flex flex-col gap-3 p-6" aria-busy="true" aria-label="Chargement">
      <div className="h-6 w-48 animate-pulse rounded-lg bg-[var(--ligne)]" />
      <div className="h-32 animate-pulse rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)]" />
      <div className="h-32 animate-pulse rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)]" />
    </div>
  );
}
