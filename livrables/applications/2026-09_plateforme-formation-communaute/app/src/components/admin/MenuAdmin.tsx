"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AvatarAdmin } from "./AvatarAdmin";

// Menu lateral de l'espace admin : sections de /admin (ancres) ou sous-pages (ex. /admin/eleves).
// "Formateurs" correspond aux Experts et "Notifications" aux actions en attente de l'admin :
// ce sont les concepts reels de la plateforme derriere ces deux entrees du modele LearnHub.
type Entree = { libelle: string; href?: string; badge?: boolean };

export const GROUPES: { titre: string; entrees: Entree[] }[] = [
  {
    titre: "Utilisateurs",
    entrees: [
      { libelle: "Élèves", href: "/admin/eleves" },
      { libelle: "Formateurs", href: "/admin/formateurs" },
      { libelle: "Administrateurs", href: "/admin/administrateurs" },
      { libelle: "Inscriptions", href: "/admin#inscriptions" },
      { libelle: "Candidatures Expert", href: "/admin#candidatures-expert" },
      { libelle: "Accès payant manuel", href: "/admin#acces-payant-manuel" },
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
      { libelle: "Paiements", href: "/admin/paiements" },
      { libelle: "Messages", href: "/admin/messages" },
      { libelle: "Notifications", href: "/admin/notifications", badge: true },
    ],
  },
  {
    titre: "Paramètres",
    entrees: [
      { libelle: "Paramètres généraux", href: "/admin#parametres-generaux" },
      { libelle: "Personnalisation", href: "/admin#personnalisation" },
      { libelle: "Rapports", href: "/admin/rapports" },
      { libelle: "Guide de l'admin", href: "/admin/guide" },
    ],
  },
];

export function MenuAdmin({
  moi,
  nbAttente,
}: {
  moi: { id: string; pseudo: string; avatarUrl: string | null };
  nbAttente: number;
}) {
  const pathname = usePathname();
  const classeLien =
    "flex items-center justify-between rounded-lg px-3 py-1.5 text-[12.5px] font-bold text-[var(--sur-encre-mute)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--sur-encre)]";
  const classeActif =
    "flex items-center justify-between rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-[12.5px] font-bold text-[var(--sur-encre)]";

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
            {groupe.entrees.map((e) => (
              <Link key={e.libelle} href={e.href!} className={e.href === pathname ? classeActif : classeLien}>
                {e.libelle}
                {e.badge && nbAttente > 0 && (
                  <span className="rounded-full bg-[var(--corail)] px-1.5 font-mono text-[10px] font-bold text-[var(--encre)]">
                    {nbAttente}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 -mx-4 mt-auto flex items-center gap-2.5 border-t border-[rgba(255,255,255,0.1)] bg-[var(--encre)] px-4 pb-1 pt-3">
        <AvatarAdmin id={moi.id} pseudo={moi.pseudo} url={moi.avatarUrl} taille={34} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-[12.5px] font-bold">{moi.pseudo}</span>
          <span className="block font-mono text-[10px] text-[var(--sur-encre-mute)]">Administrateur</span>
        </span>
        <Link
          href="/admin#parametres-generaux"
          aria-label="Paramètres généraux"
          className="rounded-lg p-1.5 text-[16px] text-[var(--sur-encre-mute)] hover:bg-[rgba(255,255,255,0.08)]"
        >
          ⚙
        </Link>
      </div>
    </nav>
  );
}
