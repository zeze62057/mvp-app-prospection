import Image from "next/image";
import Link from "next/link";
import { MarqueChatllow } from "@/components/MarqueChatllow";
import { MascotteRobot } from "@/components/MascotteRobot";

// Vitrine publique de Chatllow, dans le style du tableau de bord de l'espace client : barre laterale
// sombre, banniere, cartes, colonne de droite. Le contenu est celui de la vitrine (diagnostic, methode,
// fondateur) : aucune preuve sociale, aucun chiffre, aucun client cite (le cabinet n'en a pas encore).

const methode = [
  {
    titre: "Le diagnostic",
    corps:
      "Un questionnaire structuré sur vos freins, vos usages et vos processus les plus coûteux, le même cadre que nos audits de mission, pas une version allégée.",
  },
  {
    titre: "La recommandation",
    corps: "Pas un score abstrait : un pilote concret, priorisé selon votre contexte, avec la logique qui justifie ce choix.",
  },
  {
    titre: "Le suivi si vous signez",
    corps: "Un espace client pour suivre la mission, consulter les livrables et échanger, du cadrage jusqu'au déploiement.",
  },
];

const exempleDiagnostic = [
  { label: "Frein principal identifié", valeur: "Cas d'usage flous" },
  { label: "Processus le plus chronophage", valeur: "Reporting manuel" },
  { label: "Pilote recommandé", valeur: "Assistant synthèse" },
];

const NAV = [
  { href: "#accueil", libelle: "Accueil", icone: "◐" },
  { href: "#methode", libelle: "La méthode", icone: "▣" },
  { href: "#fondateur", libelle: "Le fondateur", icone: "◇" },
  { href: "/diagnostic", libelle: "Diagnostic gratuit", icone: "▤" },
  { href: "/rdv", libelle: "Rendez-vous", icone: "▥" },
  { href: "/connexion", libelle: "Espace client", icone: "▦" },
];

const CARTE = "rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]";

export default function AccueilPage() {
  return (
    <div className="min-h-screen bg-[var(--fond)] lg:flex">
      {/* Barre latérale */}
      <aside
        className="hidden w-[260px] shrink-0 flex-col justify-between px-4 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen"
        style={{ background: "linear-gradient(180deg, #171b2c, #0d0f16)" }}
      >
        <div>
          <Link href="/" className="flex items-center gap-3 px-2">
            <MarqueChatllow taille={30} sombre />
            <span>
              <span className="font-[family-name:var(--font-display)] block text-[18px] font-semibold leading-tight">Chatllow</span>
              <span className="block text-[10.5px] text-[rgba(255,255,255,0.55)]">Cabinet de conseil IA</span>
            </span>
          </Link>
          <nav aria-label="Sections" className="mt-8 flex flex-col gap-1">
            {NAV.map((n, i) => (
              <Link
                key={n.libelle}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${
                  i === 0 ? "bg-[var(--indigo)] text-[#0b1020]" : "text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.07)]"
                }`}
              >
                <span aria-hidden className="w-4 text-center">{n.icone}</span>
                {n.libelle}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, oklch(45% 0.19 250), #1a1f33)" }}>
            <div className="font-[family-name:var(--font-display)] text-[14.5px] font-semibold leading-snug">Un besoin d&apos;accompagnement personnalisé ?</div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-[rgba(255,255,255,0.75)]">Le fondateur du cabinet vous répond.</p>
            <Link href="/rdv" className="mt-3 block rounded-full bg-white px-4 py-2 text-center text-[12.5px] font-semibold text-[#0b1020]">
              Prendre rendez-vous →
            </Link>
          </div>
          <Link href="/connexion" className="flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-[rgba(255,255,255,0.07)]">
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(255,255,255,0.12)] text-[14px]">◔</span>
            <span className="text-[12px] leading-tight">
              <b className="block text-[13px]">Vous êtes client ?</b>
              <span className="text-[rgba(255,255,255,0.55)]">Accéder à votre espace</span>
            </span>
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Barre du haut */}
        <header className="flex items-center gap-3 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2.5 lg:hidden">
            <MarqueChatllow taille={26} />
            <span className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Chatllow</span>
          </div>
          <p className="hidden min-w-0 flex-1 text-[13px] text-[var(--texte-mute)] lg:block">Conseil en intelligence artificielle</p>
          <div className="ml-auto flex items-center gap-2.5">
            <Link href="/connexion" className="hidden rounded-full border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-semibold sm:block">
              Espace client
            </Link>
            <Link href="/diagnostic" className="inline-flex items-center gap-1.5 rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13px] font-semibold text-[var(--fond)]">
              Lancer le diagnostic <span aria-hidden>&rarr;</span>
            </Link>
          </div>
        </header>

        {/* Navigation mobile */}
        <nav aria-label="Sections" className="flex gap-2 overflow-x-auto border-b border-[var(--ligne)] px-4 py-2.5 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.libelle} href={n.href} className="shrink-0 rounded-full border border-[var(--ligne)] px-3.5 py-1.5 text-[12.5px] font-semibold">
              {n.libelle}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-6 p-4 sm:p-8 xl:grid-cols-[1fr_340px]">
          <main className="flex min-w-0 flex-col gap-6">
            {/* Bannière */}
            <section
              id="accueil"
              className="relative scroll-mt-6 overflow-hidden rounded-3xl p-7 text-white sm:p-9"
              style={{
                background:
                  "radial-gradient(circle at 88% 30%, oklch(62% 0.19 250 / 0.55), transparent 45%), radial-gradient(circle at 75% 100%, oklch(62% 0.19 300 / 0.4), transparent 45%), linear-gradient(135deg, #10131f, #1c2340)",
              }}
            >
              <MascotteRobot className="pointer-events-none absolute -right-2 top-1/2 hidden h-[230px] w-auto -translate-y-1/2 sm:block" />
              <div className="mb-4 inline-flex items-center rounded-full border border-[rgba(255,255,255,0.25)] px-3.5 py-1.5 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide text-[oklch(80%_0.12_250)]">
                Diagnostic gratuit &middot; 8 minutes
              </div>
              <h1 className="font-[family-name:var(--font-display)] max-w-md text-[26px] font-semibold leading-[1.14] tracking-tight sm:max-w-[440px] sm:text-[32px]">
                Le cas d&apos;usage IA qui mérite d&apos;être lancé{" "}
                <span className="accent-italic text-[1.12em] !text-[oklch(78%_0.13_250)]">en premier</span>.
              </h1>
              <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-[rgba(255,255,255,0.75)] sm:max-w-[440px]">
                Identifié en 8 minutes, sans nous rencontrer. Un diagnostic qui remplace le premier rendez-vous commercial : vous ressortez avec une recommandation concrète, pas une liste de possibilités.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link href="/diagnostic" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14px] font-semibold text-[#0b1020]">
                  Lancer le diagnostic gratuit <span aria-hidden>&rarr;</span>
                </Link>
                <span className="text-[12px] text-[rgba(255,255,255,0.65)]">Confidentiel. Sans engagement. Le résultat arrive par email.</span>
              </div>
            </section>

            {/* Exemple de diagnostic */}
            <section className={`${CARTE} p-6`}>
              <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Exemple de diagnostic</p>
              <div className="mt-3">
                {exempleDiagnostic.map((ligne, i) => (
                  <div
                    key={ligne.label}
                    className={`flex flex-wrap items-baseline justify-between gap-2 py-3.5 text-[13.5px] ${i < exempleDiagnostic.length - 1 ? "border-b border-[var(--ligne)]" : ""}`}
                  >
                    <span>{ligne.label}</span>
                    <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--indigo)]">{ligne.valeur}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Méthode, en étapes numérotées comme les réponses de l'assistant */}
            <section id="methode" className={`${CARTE} scroll-mt-6 p-6 sm:p-7`}>
              <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">La méthode</p>
              <h2 className="font-[family-name:var(--font-display)] mt-1.5 text-[22px] font-semibold">Une méthode, pas une promesse</h2>
              <ol className="mt-6 flex flex-col gap-5">
                {methode.map((e, i) => (
                  <li key={e.titre} className="flex gap-4">
                    <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--indigo)] text-[13px] font-bold text-white">{i + 1}</span>
                    <div>
                      <div className="font-[family-name:var(--font-display)] text-[15.5px] font-semibold">{e.titre}</div>
                      <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--texte-mute)]">{e.corps}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link href="/diagnostic" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13px] font-semibold text-[var(--fond)]">
                Commencer par le diagnostic <span aria-hidden>&rarr;</span>
              </Link>
            </section>

            {/* Fondateur */}
            <section id="fondateur" className={`${CARTE} scroll-mt-6 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-7`}>
              <Image src="/zeze-bilivogui.jpg" alt="Zézé Bilivogui, fondateur de Chatllow" width={120} height={120} className="h-28 w-28 shrink-0 rounded-2xl object-cover object-top" />
              <div>
                <p className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Le fondateur</p>
                <div className="font-[family-name:var(--font-display)] mt-1 text-[17px] font-semibold">Zézé Bilivogui</div>
                <p className="mt-1.5 max-w-xl text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
                  Fondateur de Chatllow, spécialiste de l&apos;écosystème Claude. Le diagnostic n&apos;est pas un gadget marketing : c&apos;est le même cadre d&apos;audit qu&apos;on utilise en mission.
                </p>
              </div>
            </section>
          </main>

          {/* Colonne de droite */}
          <aside className="flex flex-col gap-5">
            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Par où commencer ?</h2>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {[
                  { t: "Identifier mon premier cas d'usage IA", href: "/diagnostic" },
                  { t: "Prendre rendez-vous avec le fondateur", href: "/rdv" },
                  { t: "Accéder à mon espace client", href: "/connexion" },
                ].map((s) => (
                  <li key={s.t}>
                    <Link href={s.href} className="flex items-center gap-3 rounded-xl border border-[var(--ligne)] px-3.5 py-3 text-[12.5px] font-semibold hover:bg-[var(--indigo-soft)]">
                      <span className="flex-1">{s.t}</span>
                      <span aria-hidden>›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Votre expert IA</h2>
              <div className="mt-3.5 flex gap-3.5">
                <Image src="/zeze-bilivogui.jpg" alt="Zézé Bilivogui" width={64} height={64} className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top" />
                <div>
                  <div className="text-[14px] font-semibold">Zézé Bilivogui</div>
                  <div className="text-[12px] text-[var(--texte-mute)]">Fondateur de Chatllow</div>
                  <Link href="/rdv" className="mt-2.5 inline-block rounded-full bg-[var(--indigo)] px-4 py-1.5 text-[12px] font-semibold text-[#0b1020]">
                    Prendre rendez-vous →
                  </Link>
                </div>
              </div>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {["Écosystème Claude", "Diagnostic IA"].map((t) => (
                  <span key={t} className="rounded-full bg-[var(--indigo-soft)] px-3 py-1 text-[11px] font-semibold text-[oklch(45%_0.19_250)]">{t}</span>
                ))}
              </div>
            </section>

            <section className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, oklch(50% 0.19 250), oklch(45% 0.2 295))" }}>
              <div className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-snug">Du diagnostic au pilote concret</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[rgba(255,255,255,0.8)]">Le cabinet vous accompagne de la recommandation jusqu&apos;à la mise en œuvre.</p>
              <Link href="/diagnostic" className="mt-3.5 inline-block rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-[#0b1020]">
                Lancer le diagnostic →
              </Link>
            </section>
          </aside>
        </div>

        <footer className="flex flex-col items-start justify-between gap-2 border-t border-[var(--ligne)] px-6 py-6 font-[family-name:var(--font-mono)] text-[11px] text-[var(--texte-mute)] sm:flex-row sm:items-center sm:px-8">
          <span>chatllow</span>
          <span>conseil en intelligence artificielle</span>
        </footer>
      </div>
    </div>
  );
}
