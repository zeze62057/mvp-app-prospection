import Link from "next/link";

function MarqueChatllow() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-6 w-6 shrink-0">
      <rect x="4" y="4" width="40" height="40" rx="13" fill="#14161F" opacity="0.14" />
      <rect x="20" y="20" width="40" height="40" rx="13" fill="oklch(62% 0.19 250)" />
    </svg>
  );
}

const methode = [
  {
    num: "01",
    titre: "Le diagnostic",
    corps:
      "Un questionnaire structuré sur vos freins, vos usages et vos processus les plus coûteux — le même cadre que nos audits de mission, pas une version allégée.",
  },
  {
    num: "02",
    titre: "La recommandation",
    corps:
      "Pas un score abstrait : un pilote concret, priorisé selon votre contexte, avec la logique qui justifie ce choix.",
  },
  {
    num: "03",
    titre: "Le suivi si vous signez",
    corps:
      "Un espace client pour suivre la mission, consulter les livrables et échanger — du cadrage jusqu'au déploiement.",
  },
];

const exempleDiagnostic = [
  { label: "Frein principal identifié", valeur: "Cas d'usage flous" },
  { label: "Processus le plus chronophage", valeur: "Reporting manuel" },
  { label: "Pilote recommandé", valeur: "Assistant synthèse" },
];

export default function AccueilPage() {
  return (
    <div className="flex flex-col">
      <header className="flex items-center justify-between border-b border-[var(--ligne)] px-6 py-6 sm:px-16">
        <div className="flex items-center gap-3">
          <MarqueChatllow />
          <span className="font-[family-name:var(--font-display)] text-[17px] font-semibold">
            Chatllow
          </span>
        </div>
        <nav className="hidden gap-8 text-[13.5px] font-medium text-[var(--texte-mute)] md:flex">
          <span>Méthode</span>
          <span>Fondateur</span>
          <span>Diagnostic</span>
        </nav>
        <Link
          href="/diagnostic"
          className="inline-flex items-center gap-1.5 rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13.5px] font-semibold text-[var(--fond)]"
        >
          Lancer le diagnostic <span aria-hidden>&rarr;</span>
        </Link>
      </header>

      <section className="flex flex-col items-start gap-10 px-6 py-16 sm:px-16 md:flex-row md:items-center md:gap-14">
        <div className="flex-[1.1]">
          <div className="mb-6 flex items-center gap-3">
            <svg
              viewBox="0 0 16 16"
              className="h-3 w-3 shrink-0 -rotate-12 text-[var(--indigo)]"
              aria-hidden
            >
              <rect x="1" y="1" width="14" height="14" rx="3" fill="currentColor" opacity="0.7" />
            </svg>
            <div className="inline-flex items-center rounded-full bg-[var(--indigo-soft)] px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[11.5px] uppercase tracking-wide text-[var(--indigo)]">
              Diagnostic gratuit &middot; 8 minutes
            </div>
          </div>
          <h1 className="mb-5 max-w-xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.14] tracking-tight sm:text-5xl">
            Le cas d&apos;usage IA qui mérite d&apos;être lancé{" "}
            <span className="accent-italic">en premier</span>. Identifié en 8
            minutes, sans nous rencontrer.
          </h1>
          <p className="mb-8 max-w-md text-base leading-relaxed text-[var(--texte-mute)]">
            Un diagnostic qui remplace le premier rendez-vous commercial : vous
            ressortez avec une recommandation concrète, pas une liste de
            possibilités.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--encre)] px-6 py-4 text-[14.5px] font-semibold text-[var(--fond)]"
          >
            Lancer le diagnostic gratuit <span aria-hidden>&rarr;</span>
          </Link>
          <p className="mt-3 text-[12.5px] text-[var(--texte-mute)]">
            Confidentiel. Sans engagement. Le résultat arrive par email.
          </p>

          <div className="mt-8 flex max-w-md items-center gap-3 border-t border-[var(--ligne)] pt-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--encre)] font-[family-name:var(--font-display)] text-[12px] font-bold text-[var(--fond)]">
              ZB
            </div>
            <div className="text-[12.5px] leading-snug">
              <span className="font-semibold text-[var(--texte)]">
                Zézé Bilivogui
              </span>
              <span className="block text-[var(--texte-mute)]">
                Fondateur de Chatllow
              </span>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 border-t-2 border-[var(--encre)] pt-5">
          <div className="mb-4 font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
            Exemple de diagnostic
          </div>
          {exempleDiagnostic.map((ligne, i) => (
            <div
              key={ligne.label}
              className={`flex items-baseline justify-between py-3.5 text-[13.5px] ${
                i < exempleDiagnostic.length - 1 ? "border-b border-[var(--ligne)]" : ""
              }`}
            >
              <span>{ligne.label}</span>
              <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--indigo)]">
                {ligne.valeur}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--ligne)] px-6 py-14 sm:px-16">
        <p className="mb-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--texte-mute)]">
          La méthode
        </p>
        <h2 className="mb-8 max-w-xl font-[family-name:var(--font-display)] text-2xl font-semibold sm:text-[27px]">
          Une méthode, pas une promesse
        </h2>
        <div className="flex flex-col divide-y divide-[var(--ligne)] md:flex-row md:divide-x md:divide-y-0">
          {methode.map((etape) => (
            <div
              key={etape.num}
              className="flex-1 border-t-2 border-[var(--indigo)] py-5 md:border-l-0 md:pl-8 md:pt-5 first:md:pl-0"
            >
              <div className="mb-4 font-[family-name:var(--font-mono)] text-xl text-[var(--indigo)]">
                {etape.num}
              </div>
              <div className="mb-2 font-[family-name:var(--font-display)] text-[15.5px] font-semibold">
                {etape.titre}
              </div>
              <p className="text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
                {etape.corps}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--ligne)] px-6 py-14 sm:px-16">
        <p className="mb-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[var(--texte-mute)]">
          Le fondateur
        </p>
        <div className="flex gap-7 border-l-2 border-[var(--indigo)] pl-7">
          <div>
            <div className="mb-1.5 font-[family-name:var(--font-display)] text-base font-semibold">
              Zézé Bilivogui
            </div>
            <p className="max-w-xl text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
              Fondateur de Chatllow, spécialiste de l&apos;écosystème Claude. Le
              diagnostic n&apos;est pas un gadget marketing : c&apos;est le même cadre
              d&apos;audit qu&apos;on utilise en mission.
            </p>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-start justify-between gap-2 border-t border-[var(--ligne)] px-6 py-7 font-[family-name:var(--font-mono)] text-[11px] text-[var(--texte-mute)] sm:flex-row sm:items-center sm:px-16">
        <span>chatllow</span>
        <span>conseil en intelligence artificielle</span>
      </footer>
    </div>
  );
}
