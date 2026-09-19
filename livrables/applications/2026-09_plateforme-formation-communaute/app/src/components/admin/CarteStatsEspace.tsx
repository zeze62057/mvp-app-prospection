import type { StatsCommunaute } from "@/lib/stats-communaute";

function Chiffre({ valeur, libelle }: { valeur: string | number; libelle: string }) {
  return (
    <div>
      <p className="font-display text-lg font-extrabold text-[var(--sarcelle)]">{valeur}</p>
      <p className="font-mono text-[10px] text-[var(--texte-mute)]">{libelle}</p>
    </div>
  );
}

function ListeSections({
  titre,
  sections,
  vide,
}: {
  titre: string;
  sections: StatsCommunaute["progression"]["plusTerminees"];
  vide: string;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--texte-mute)]">
        {titre}
      </p>
      {sections.length === 0 ? (
        <p className="mt-1 text-xs text-[var(--texte-mute)]">{vide}</p>
      ) : (
        <ol className="mt-1 flex flex-col gap-0.5">
          {sections.map((s) => (
            <li
              key={`${s.module_ordre}-${s.section_ordre}`}
              className="flex justify-between gap-3 text-xs"
            >
              <span>
                M{s.module_ordre}.{s.section_ordre} {s.titre}
              </span>
              <span className="whitespace-nowrap font-mono text-[var(--texte-mute)]">
                {s.nb_terminees}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function CarteStatsEspace({
  nom,
  devise,
  stats,
}: {
  nom: string;
  devise: string;
  stats: StatsCommunaute;
}) {
  const montant = (n: number) => `${n.toLocaleString("fr-FR")} ${devise}`;
  const p = stats.progression;

  return (
    <li className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <p className="text-sm font-medium">{nom}</p>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Chiffre valeur={stats.nbMembres} libelle="membres" />
        <Chiffre valeur={stats.nbPosts} libelle="posts" />
        <Chiffre valeur={stats.nbActifsRecents} libelle={`actifs (${stats.periodeActiviteJours}j)`} />
        <Chiffre
          valeur={stats.tauxConversion === null ? "—" : `${stats.tauxConversion}%`}
          libelle="conversion"
        />
      </div>

      {!stats.agregatsDisponibles ? (
        <p className="mt-4 rounded-lg border border-[var(--corail)] px-3 py-2 text-xs text-[var(--corail)]">
          Croissance, progression et revenus indisponibles : la migration 0024 n&apos;est
          probablement pas appliquee a la base.
        </p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--ligne)] pt-4 sm:grid-cols-4">
            <Chiffre valeur={`+${stats.nouveaux7j}`} libelle="nouveaux membres (7j)" />
            <Chiffre valeur={`+${stats.nouveaux30j}`} libelle="nouveaux membres (30j)" />
            <Chiffre valeur={stats.demandesEnAttente} libelle="demandes en attente" />
            <Chiffre valeur={p.nbEleves} libelle="eleves (acces payant)" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--ligne)] pt-4 sm:grid-cols-4">
            <Chiffre valeur={montant(stats.revenus.montantTotal)} libelle="revenus confirmes" />
            <Chiffre valeur={montant(stats.revenus.montant30j)} libelle="revenus (30j)" />
            <Chiffre valeur={stats.revenus.nbConfirmes} libelle="paiements confirmes" />
          </div>

          <div className="mt-4 border-t border-[var(--ligne)] pt-4">
            <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--texte-mute)]">
              progression dans la formation
            </p>
            {p.nbEleves === 0 || p.avancementMoyen === null ? (
              <p className="mt-1 text-xs text-[var(--texte-mute)]">
                {p.nbSections === 0
                  ? "Aucune section de cours en base pour cet espace."
                  : "Aucun eleve avec un acces payant pour l'instant."}
              </p>
            ) : (
              <>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--fond)]">
                    <div
                      className="h-full rounded-full bg-[var(--sarcelle)]"
                      style={{ width: `${Math.min(100, p.avancementMoyen)}%` }}
                    />
                  </div>
                  <span className="font-display text-sm font-extrabold text-[var(--sarcelle)]">
                    {p.avancementMoyen}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-[var(--texte-mute)]">
                  Avancement moyen des {p.nbEleves} eleve{p.nbEleves > 1 ? "s" : ""} sur les{" "}
                  {p.nbSections} sections disponibles (les eleves a 0 % comptent).
                </p>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ListeSections
                    titre="Les plus terminees (eleves)"
                    sections={p.plusTerminees}
                    vide="Aucune section terminee."
                  />
                  <ListeSections
                    titre="Les moins terminees (eleves)"
                    sections={p.moinsTerminees}
                    vide="—"
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </li>
  );
}
