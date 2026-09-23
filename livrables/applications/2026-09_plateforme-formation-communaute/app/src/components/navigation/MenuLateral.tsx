"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/communaute/fil/Avatar";

type CleIcone =
  | "communaute"
  | "progression"
  | "membres"
  | "a-propos"
  | "calendrier"
  | "contenu"
  | "ressources"
  | "masterclass"
  | "prompts"
  | "rdv"
  | "expert"
  | "messages"
  | "notifications";

// Icones de trait, une par entree du menu, style coherent avec celles deja
// utilisees ailleurs (composer, reactions). Quelques concepts proches
// partagent la meme icone (ex: Contenu et Formation) plutot que d'inventer
// une forme distincte pour chacun.
function Icone({ nom }: { nom: CleIcone }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "flex-shrink-0",
  };
  switch (nom) {
    case "communaute":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "progression":
      return (
        <svg {...props}>
          <path d="m3 17 6-6 4 4 8-8" />
          <path d="M17 7h4v4" />
        </svg>
      );
    case "membres":
      return (
        <svg {...props}>
          <circle cx="8.5" cy="8" r="3" />
          <circle cx="16.5" cy="9.5" r="2.3" />
          <path d="M2.5 19.5a6 6 0 0 1 12 0" />
          <path d="M14.8 14.3a5 5 0 0 1 4.7 5.2" />
        </svg>
      );
    case "a-propos":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "calendrier":
      return (
        <svg {...props}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18" />
          <path d="M8 3v4" />
          <path d="M16 3v4" />
        </svg>
      );
    case "contenu":
      return (
        <svg {...props}>
          <path d="M12 6c-2-1.5-5-2-8-1v13c3-1 6-.5 8 1 2-1.5 5-2 8-1V5c-3-1-6-.5-8 1Z" />
          <path d="M12 6v13" />
        </svg>
      );
    case "ressources":
      return (
        <svg {...props}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        </svg>
      );
    case "masterclass":
      return (
        <svg {...props}>
          <path d="m22 8-6 4 6 4V8Z" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
      );
    case "prompts":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m8 9 3 3-3 3" />
          <path d="M13 15h4" />
        </svg>
      );
    case "rdv":
      return (
        <svg {...props}>
          <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h2a2 2 0 0 1 2 1.72c.13.96.36 1.9.68 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0 1 22 16.92Z" />
        </svg>
      );
    case "expert":
      return (
        <svg {...props}>
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21l1.2-6.9-5-4.9 6.9-1Z" />
        </svg>
      );
    case "messages":
      return (
        <svg {...props}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
        </svg>
      );
    case "notifications":
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      );
  }
}

// Menu vertical fixe a gauche, visible sur ordinateur (cache sur mobile, ou la
// barre du bas existante reste seule). Regroupe les onglets qui etaient avant
// repartis en haut de chaque page communaute, plus les liens
// Messages/Notifications/Profil qui etaient dans BarreNavigation.
// Deux jeux d'onglets distincts, comme avant (pas une fusion), choisis selon
// la zone affichee (l'URL), pas selon la permission du membre : sinon un
// membre qui a paye verrait les onglets payants meme sur la page gratuite.
// A affiner quand on retravaillera specifiquement la zone payante.
export function MenuLateral({
  espaceSlug,
  espaceNom,
  userId,
  pseudo,
  avatarUrl,
  nbNotifications,
}: {
  espaceSlug: string;
  espaceNom: string;
  userId: string;
  pseudo: string;
  avatarUrl: string | null;
  nbNotifications: number;
}) {
  const chemin = usePathname();
  const base = `/${espaceSlug}`;

  const estActif = (cible: string) => chemin === cible || chemin.startsWith(`${cible}/`);

  const enZonePayante = ["communaute-payante", "progression", "formation", "expert"].some((p) =>
    estActif(`${base}/${p}`)
  );

  const liens: { libelle: string; href: string; icone: CleIcone }[] = enZonePayante
    ? [
        { libelle: "Ma progression", href: `${base}/progression`, icone: "progression" },
        { libelle: "Communauté payante", href: `${base}/communaute-payante`, icone: "communaute" },
        { libelle: "Membres", href: `${base}/membres`, icone: "membres" },
        { libelle: "À propos", href: `${base}/a-propos`, icone: "a-propos" },
        { libelle: "Calendrier", href: `${base}/calendrier`, icone: "calendrier" },
        { libelle: "Formation", href: `${base}/formation`, icone: "contenu" },
        { libelle: "Devenir Expert", href: `${base}/expert`, icone: "expert" },
      ]
    : [
        { libelle: "Communauté", href: `${base}/communaute`, icone: "communaute" },
        { libelle: "Membres", href: `${base}/membres`, icone: "membres" },
        { libelle: "À propos", href: `${base}/a-propos`, icone: "a-propos" },
        { libelle: "Calendrier", href: `${base}/calendrier`, icone: "calendrier" },
        { libelle: "Contenu", href: `${base}/contenu`, icone: "contenu" },
        { libelle: "Ressources", href: `${base}/ressources`, icone: "ressources" },
        { libelle: "Masterclass", href: `${base}/masterclass`, icone: "masterclass" },
        { libelle: "Prompts", href: `${base}/prompts`, icone: "prompts" },
        { libelle: "RDV", href: `${base}/rdv`, icone: "rdv" },
      ];

  const classeLien = (actif: boolean) =>
    `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-bold transition-colors ${
      actif
        ? "bg-[var(--sarcelle)] text-[var(--sur-encre)]"
        : "text-[var(--sur-encre-mute)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--sur-encre)]"
    }`;

  return (
    <nav
      aria-label="Menu de l'espace"
      className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col overflow-y-auto bg-[var(--encre)] p-4 text-[var(--sur-encre)] md:flex"
    >
      <div className="font-display mb-4 px-1 text-[14.5px] font-bold">{espaceNom}</div>

      <div className="flex flex-1 flex-col gap-0.5">
        {liens.map((l) => (
          <Link key={l.href} href={l.href} className={classeLien(estActif(l.href))} aria-current={estActif(l.href) ? "page" : undefined}>
            <Icone nom={l.icone} />
            {l.libelle}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-0.5 border-t border-[rgba(255,255,255,0.12)] pt-3">
        <Link href={`${base}/messages`} className={classeLien(estActif(`${base}/messages`))} aria-current={estActif(`${base}/messages`) ? "page" : undefined}>
          <Icone nom="messages" />
          Messages
        </Link>
        <Link
          href={`${base}/notifications`}
          className={`${classeLien(estActif(`${base}/notifications`))} justify-between`}
          aria-current={estActif(`${base}/notifications`) ? "page" : undefined}
        >
          <span className="flex items-center gap-2.5">
            <Icone nom="notifications" />
            Notifications
          </span>
          {nbNotifications > 0 && (
            <span
              aria-label={`${nbNotifications} notification${nbNotifications > 1 ? "s" : ""} non lue${nbNotifications > 1 ? "s" : ""}`}
              className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--corail)] px-1 font-mono text-[9.5px] font-bold text-[var(--encre)]"
            >
              {nbNotifications > 99 ? "99+" : nbNotifications}
            </span>
          )}
        </Link>
        <Link
          href={`${base}/profil`}
          className={classeLien(estActif(`${base}/profil`))}
          aria-current={estActif(`${base}/profil`) ? "page" : undefined}
        >
          <Avatar id={userId} pseudo={pseudo} taille={24} urlPhoto={avatarUrl} />
          {pseudo}
        </Link>
      </div>
    </nav>
  );
}
