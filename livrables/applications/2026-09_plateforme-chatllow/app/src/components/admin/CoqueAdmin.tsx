import Link from "next/link";
import { MarqueChatllow } from "@/components/MarqueChatllow";
import { Icone, type NomIcone } from "@/components/Icone";

export type SectionAdmin = "accueil" | "clients" | "diagnostics" | "rendez-vous";

const NAV: { id: SectionAdmin; libelle: string; href: string; icone: NomIcone }[] = [
  { id: "accueil", libelle: "Accueil", href: "/admin", icone: "graphique" },
  { id: "clients", libelle: "Clients", href: "/admin/clients", icone: "dossier" },
  { id: "diagnostics", libelle: "Diagnostics reçus", href: "/admin/diagnostics", icone: "cible" },
  { id: "rendez-vous", libelle: "Rendez-vous", href: "/admin/rendez-vous", icone: "calendrier" },
];

// Cadre des pages d'administration Chatllow : barre laterale sombre comme l'espace client, contenu a droite.
// Le role admin est verifie par chaque page (verifierAdmin) : ce cadre n'est qu'un habillage.
export function CoqueAdmin({
  section,
  titre,
  sousTitre,
  ok,
  erreur,
  children,
}: {
  section: SectionAdmin;
  titre: string;
  sousTitre?: string;
  ok?: string;
  erreur?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--fond)] lg:flex">
      <aside
        className="hidden w-[250px] shrink-0 flex-col justify-between px-4 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen"
        style={{ background: "linear-gradient(180deg, #171b2c, #0d0f16)" }}
      >
        <div>
          <Link href="/admin" className="flex items-center gap-3 px-2">
            <MarqueChatllow taille={30} sombre />
            <span>
              <span className="font-[family-name:var(--font-display)] block text-[18px] font-semibold leading-tight">Chatllow</span>
              <span className="block text-[10.5px] text-[rgba(255,255,255,0.55)]">Administration</span>
            </span>
          </Link>
          <nav aria-label="Administration" className="mt-8 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${
                  section === n.id ? "bg-[var(--indigo)] text-[#0b1020]" : "text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.07)]"
                }`}
              >
                <Icone nom={n.icone} />
                {n.libelle}
              </Link>
            ))}
          </nav>
        </div>
        <Link href="/espace-client" className="rounded-xl px-3.5 py-2.5 text-[12.5px] font-semibold text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.07)]">
          ← Mon espace client
        </Link>
      </aside>

      <div className="min-w-0 flex-1">
        <nav aria-label="Administration" className="flex gap-2 overflow-x-auto border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-2.5 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.id} href={n.href} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${section === n.id ? "bg-[var(--encre)] text-white" : "border border-[var(--ligne)]"}`}>
              {n.libelle}
            </Link>
          ))}
          <Link href="/espace-client" className="shrink-0 rounded-full border border-[var(--ligne)] px-3.5 py-1.5 text-[12.5px] font-semibold">
            Espace client
          </Link>
        </nav>

        <main className="mx-auto max-w-5xl p-4 sm:p-8">
          <h1 className="font-[family-name:var(--font-display)] text-[26px] font-semibold">{titre}</h1>
          {sousTitre && <p className="mt-1 max-w-2xl text-[13.5px] text-[var(--texte-mute)]">{sousTitre}</p>}
          {ok && (
            <p role="status" className="mt-5 rounded-xl bg-[rgba(34,160,110,0.14)] px-4 py-2.5 text-[13px] font-semibold text-[#157a52]">
              {ok}
            </p>
          )}
          {erreur && (
            <p role="alert" className="mt-5 rounded-xl bg-[rgba(255,107,107,0.14)] px-4 py-2.5 text-[13px] font-semibold text-[#b53a3a]">
              {erreur}
            </p>
          )}
          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
