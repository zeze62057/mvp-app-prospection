"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

// Menu lateral de l'espace admin, ancre sur les sections reelles de /admin ou
// sur une sous-page (ex. /admin/eleves). Trois etats par entree, selon la regle du
// cadrage : active (la section existe), desactivee "Bientot disponible" (une
// vraie donnee existe mais aucune page dediee), ou absente du menu si rien de
// reel n'y correspond (Formateurs, Notifications admin : aucun concept dans
// la plateforme, ni ignorees discretement ni inventees).
type Entree = { libelle: string; href?: string };

export const GROUPES: { titre: string; entrees: Entree[] }[] = [
  {
    titre: "Utilisateurs",
    entrees: [
      { libelle: "Élèves", href: "/admin/eleves" },
      { libelle: "Inscriptions", href: "/admin#inscriptions" },
      { libelle: "Candidatures Expert", href: "/admin#candidatures-expert" },
      { libelle: "Accès payant manuel", href: "/admin#acces-payant-manuel" },
      { libelle: "Administrateurs" },
    ],
  },
  {
    titre: "Formations",
    entrees: [
      { libelle: "Catalogue des formations", href: "/admin#catalogue-formations" },
      { libelle: "Cours", href: "/admin#cours" },
      { libelle: "Masterclass", href: "/admin#masterclass" },
      { libelle: "RDV", href: "/admin#rdv" },
      { libelle: "Ressources", href: "/admin#ressources" },
      { libelle: "Évaluations (devoirs)", href: "/admin#devoirs" },
      { libelle: "Badges", href: "/admin#badges" },
      { libelle: "Niveaux", href: "/admin#niveaux" },
      { libelle: "Statistiques par formation", href: "/admin#statistiques-communaute" },
    ],
  },
  {
    titre: "Gestion",
    entrees: [
      { libelle: "Catégories", href: "/admin#categories" },
      { libelle: "Questions d'adhésion", href: "/admin#questions-adhesion" },
      { libelle: "Modération", href: "/admin#signalements" },
      { libelle: "Contenu", href: "/admin#contenu" },
      { libelle: "Paiements" },
      { libelle: "Rapports" },
      { libelle: "Messages" },
    ],
  },
  {
    titre: "Paramètres",
    entrees: [
      { libelle: "Paramètres généraux", href: "/admin#parametres-generaux" },
      { libelle: "Personnalisation", href: "/admin#personnalisation" },
    ],
  },
];

export function MenuAdmin() {
  const pathname = usePathname();
  const classeLien =
    "block rounded-lg px-3 py-1.5 text-[12.5px] font-bold text-[var(--sur-encre-mute)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--sur-encre)]";
  const classeActif = "block rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-[12.5px] font-bold text-[var(--sur-encre)]";

  return (
    <nav
      aria-label="Menu admin"
      className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col overflow-y-auto bg-[var(--encre)] p-4 text-[var(--sur-encre)] md:flex"
    >
      <Link href="/admin#tableau-de-bord" className={`mb-4 ${pathname === "/admin" ? classeActif : classeLien}`}>
        Tableau de bord
      </Link>
      {GROUPES.map((groupe) => (
        <div key={groupe.titre} className="mb-4">
          <div className="mb-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--sur-encre-mute)] opacity-70">
            {groupe.titre}
          </div>
          <div className="flex flex-col gap-0.5">
            {groupe.entrees.map((e) =>
              e.href ? (
                <Link key={e.libelle} href={e.href} className={e.href === pathname ? classeActif : classeLien}>
                  {e.libelle}
                </Link>
              ) : (
                <span
                  key={e.libelle}
                  title="Bientôt disponible"
                  className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-1.5 text-[12.5px] font-bold text-[var(--sur-encre-mute)] opacity-40"
                >
                  {e.libelle}
                  <span className="font-mono text-[8.5px]">bientôt</span>
                </span>
              )
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
