"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar } from "@/components/communaute/fil/Avatar";

const INTERVALLE_MS = 30_000;

function Icone({ nom }: { nom: "accueil" | "messages" | "notifications" }) {
  const props = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  if (nom === "accueil") {
    return (
      <svg {...props}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h5v-6h4v6h5V10" />
      </svg>
    );
  }
  if (nom === "messages") {
    return (
      <svg {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

// Barre de navigation du membre : Accueil, Messages, Notifications (avec badge),
// profil. Fixee en bas de l'ecran sur mobile, en pastille flottante sur ordinateur.
// Le badge est actualise toutes les 30 secondes et au retour sur l'onglet, car le
// layout serveur ne se recharge pas a chaque navigation.
export function BarreNavigation({
  espaceSlug,
  espaceId,
  nbInitial,
  userId,
  pseudo,
  avatarUrl,
}: {
  espaceSlug: string;
  espaceId: string;
  nbInitial: number;
  userId: string;
  pseudo: string;
  avatarUrl: string | null;
}) {
  const chemin = usePathname();
  const [nb, setNb] = useState(nbInitial);

  useEffect(() => {
    let actif = true;
    async function actualiser() {
      try {
        const r = await fetch(`/api/notifications/count?espace=${espaceId}`, { cache: "no-store" });
        if (!r.ok) return;
        const json = (await r.json()) as { nb?: number };
        if (actif && typeof json.nb === "number") setNb(json.nb);
      } catch {
        // Hors ligne : on garde le dernier compteur connu.
      }
    }
    const minuteur = setInterval(actualiser, INTERVALLE_MS);
    const auRetour = () => document.visibilityState === "visible" && actualiser();
    document.addEventListener("visibilitychange", auRetour);
    // Un nouveau chemin (ex: apres avoir ouvert une notification) rafraichit le compteur.
    actualiser();
    return () => {
      actif = false;
      clearInterval(minuteur);
      document.removeEventListener("visibilitychange", auRetour);
    };
  }, [espaceId, chemin]);

  const base = `/${espaceSlug}`;
  const elements = [
    { cle: "accueil", href: `${base}/communaute`, libelle: "Accueil", actif: /\/(communaute|communaute-payante|post)(\/|$)/.test(chemin) },
    { cle: "messages", href: `${base}/messages`, libelle: "Messages", actif: chemin.startsWith(`${base}/messages`) },
    { cle: "notifications", href: `${base}/notifications`, libelle: "Notifications", actif: chemin.startsWith(`${base}/notifications`) },
  ] as const;

  const classe = (actif: boolean) =>
    `relative flex flex-col items-center gap-0.5 px-3 py-1 text-[10.5px] font-bold transition-colors ${
      actif ? "text-[var(--sarcelle)]" : "text-[var(--texte-mute)] hover:text-[var(--texte)]"
    }`;

  return (
    <nav
      aria-label="Navigation du membre"
      className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-[var(--ligne)] bg-[var(--fond-carte)] pb-[max(env(safe-area-inset-bottom),0.4rem)] pt-1.5 md:inset-x-auto md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:gap-1 md:rounded-full md:border md:px-4 md:py-1.5 md:shadow-[0_10px_30px_rgba(17,56,50,0.18)]"
    >
      {elements.map((e) => (
        <Link key={e.cle} href={e.href} className={classe(e.actif)} aria-current={e.actif ? "page" : undefined}>
          <span className="relative">
            <Icone nom={e.cle} />
            {e.cle === "notifications" && nb > 0 && (
              <span
                aria-label={`${nb} notification${nb > 1 ? "s" : ""} non lue${nb > 1 ? "s" : ""}`}
                className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--corail)] px-1 font-mono text-[9.5px] font-bold text-[var(--encre)]"
              >
                {nb > 99 ? "99+" : nb}
              </span>
            )}
          </span>
          {e.libelle}
        </Link>
      ))}
      <Link
        href={`${base}/profil`}
        className={classe(chemin.startsWith(`${base}/profil`))}
        aria-current={chemin.startsWith(`${base}/profil`) ? "page" : undefined}
      >
        <span className={chemin.startsWith(`${base}/profil`) ? "rounded-full ring-2 ring-[var(--sarcelle)]" : ""}>
          <Avatar id={userId} pseudo={pseudo} taille={22} urlPhoto={avatarUrl} />
        </span>
        Profil
      </Link>
    </nav>
  );
}
