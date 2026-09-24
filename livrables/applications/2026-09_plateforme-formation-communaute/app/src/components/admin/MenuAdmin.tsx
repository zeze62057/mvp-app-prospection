"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AvatarAdmin } from "./AvatarAdmin";

// Menu lateral de l'espace admin : sections de /admin (ancres) ou sous-pages (ex. /admin/eleves).
// "Formateurs" correspond aux Experts et "Notifications" aux actions en attente de l'admin :
// ce sont les concepts reels de la plateforme derriere ces deux entrees du modele LearnHub.
type Entree = { libelle: string; href: string; icone: string; badge?: boolean };

export const GROUPES: { titre: string; entrees: Entree[] }[] = [
  {
    titre: "Utilisateurs",
    entrees: [
      { libelle: "Élèves", href: "/admin/eleves", icone: "☺" },
      { libelle: "Formateurs", href: "/admin/formateurs", icone: "✦" },
      { libelle: "Administrateurs", href: "/admin/administrateurs", icone: "❖" },
      { libelle: "Inscriptions", href: "/admin#inscriptions", icone: "✎" },
      { libelle: "Candidatures Expert", href: "/admin#candidatures-expert", icone: "★" },
      { libelle: "Accès payant manuel", href: "/admin#acces-payant-manuel", icone: "✚" },
    ],
  },
  {
    titre: "Formations",
    entrees: [
      { libelle: "Catalogue des formations", href: "/admin#catalogue-formations", icone: "☰" },
      { libelle: "Programme", href: "/admin/programme", icone: "☰" },
      { libelle: "Cours (vidéos)", href: "/admin#cours", icone: "▶" },
      { libelle: "Catégories", href: "/admin#categories", icone: "▤" },
      { libelle: "Masterclass", href: "/admin#masterclass", icone: "▣" },
      { libelle: "RDV", href: "/admin#rdv", icone: "◷" },
      { libelle: "Ressources", href: "/admin#ressources", icone: "❒" },
      { libelle: "Évaluations (devoirs)", href: "/admin#devoirs", icone: "☑" },
      { libelle: "Badges", href: "/admin#badges", icone: "✪" },
      { libelle: "Niveaux", href: "/admin#niveaux", icone: "▲" },
      { libelle: "Statistiques par formation", href: "/admin#statistiques-communaute", icone: "▥" },
    ],
  },
  {
    titre: "Gestion",
    entrees: [
      { libelle: "Questions d'adhésion", href: "/admin#questions-adhesion", icone: "?" },
      { libelle: "Modération", href: "/admin#signalements", icone: "⚑" },
      { libelle: "Posts et commentaires", href: "/admin/moderation", icone: "✖" },
      { libelle: "Contenu", href: "/admin#contenu", icone: "☷" },
      { libelle: "Paiements", href: "/admin/paiements", icone: "¤" },
      { libelle: "Messages", href: "/admin/messages", icone: "✉" },
      { libelle: "Notifications", href: "/admin/notifications", icone: "♪", badge: true },
    ],
  },
  {
    titre: "Paramètres",
    entrees: [
      { libelle: "Paramètres généraux", href: "/admin#parametres-generaux", icone: "⚙" },
      { libelle: "Personnalisation", href: "/admin#personnalisation", icone: "✧" },
      { libelle: "Rapports", href: "/admin/rapports", icone: "▦" },
      { libelle: "Guide de l'admin", href: "/admin/guide", icone: "ℹ" },
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
  const base = "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[12.5px] font-bold";
  const classeLien = `${base} text-[var(--sur-encre-mute)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--sur-encre)]`;
  const classeActif = `${base} bg-[var(--sarcelle)] text-[var(--sur-encre)]`;
  // Symboles typographiques (pas des emoji) : ils heritent de la couleur du texte, comme les pictos du modele.
  const icone = (c: string) => (
    <span aria-hidden className="w-4 flex-shrink-0 text-center text-[13px]">
      {c}
    </span>
  );

  return (
    <nav
      aria-label="Menu admin"
      className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col overflow-y-auto bg-[var(--encre)] p-4 text-[var(--sur-encre)] md:flex"
    >
      <Link href="/admin" className="mb-5 flex items-center gap-2.5 px-1">
        {/* Logo "Cle" de Vivier IA : anneau, trait, point d'acces (identite visuelle du 2026-09-12). */}
        <svg width="34" height="34" viewBox="0 0 120 120" fill="none" aria-hidden>
          <circle cx="45" cy="75" r="22" stroke="#5FC7B8" strokeWidth="9" />
          <line x1="61" y1="59" x2="95" y2="25" stroke="#5FC7B8" strokeWidth="9" strokeLinecap="round" />
          <circle cx="95" cy="25" r="9" fill="#FF7A4D" />
        </svg>
        <span className="leading-tight">
          <span className="block font-display text-[15px] font-bold">Vivier Academies</span>
          <span className="block font-mono text-[10px] text-[var(--sur-encre-mute)]">Administration</span>
        </span>
      </Link>

      <Link href="/admin#tableau-de-bord" className={`mb-4 ${pathname === "/admin" ? classeActif : classeLien}`}>
        {icone("⌂")}
        Tableau de bord
      </Link>
      {GROUPES.map((groupe) => (
        <div key={groupe.titre} className="mb-4">
          <div className="mb-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--sur-encre-mute)] opacity-70">
            {groupe.titre}
          </div>
          <div className="flex flex-col gap-0.5">
            {groupe.entrees.map((e) => (
              <Link key={e.libelle} href={e.href} className={e.href === pathname ? classeActif : classeLien}>
                {icone(e.icone)}
                <span className="flex-1">{e.libelle}</span>
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
