import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MarqueChatllow } from "@/components/MarqueChatllow";
import { Icone, type NomIcone } from "@/components/Icone";

export type SectionAdmin = "accueil" | "clients" | "diagnostics" | "rendez-vous";

const NAV: { id: SectionAdmin; libelle: string; href: string; icone: NomIcone }[] = [
  { id: "accueil", libelle: "Tableau de bord", href: "/admin", icone: "graphique" },
  { id: "clients", libelle: "Clients", href: "/admin/clients", icone: "dossier" },
  { id: "diagnostics", libelle: "Diagnostics reçus", href: "/admin/diagnostics", icone: "cible" },
  { id: "rendez-vous", libelle: "Rendez-vous", href: "/admin/rendez-vous", icone: "calendrier" },
];

// Cadre des pages d'administration Chatllow, en theme sombre (.theme-admin redefinit les couleurs). Le role
// admin est verifie par chaque page (verifierAdmin) : ce cadre n'est qu'un habillage.
export async function CoqueAdmin({
  section,
  titre,
  sousTitre,
  ok,
  erreur,
  nouveaux,
  large = false,
  masquerTitre = false,
  children,
}: {
  section: SectionAdmin;
  titre: string;
  sousTitre?: string;
  ok?: string;
  erreur?: string;
  nouveaux?: number;
  large?: boolean;
  masquerTitre?: boolean;
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: moi } = await supabase.from("chatllow_clients").select("contact").maybeSingle();
  const nom = moi?.contact ?? "Administrateur";
  const initiales = nom.split(/\s+/).map((m: string) => m[0]).slice(0, 2).join("").toUpperCase();
  const maintenant = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Conakry", weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="theme-admin min-h-screen lg:flex">
      <aside className="hidden w-[250px] shrink-0 flex-col justify-between border-r border-[var(--ligne)] px-4 py-6 lg:sticky lg:top-0 lg:flex lg:h-screen" style={{ background: "linear-gradient(180deg, #0f1428, #080b16)" }}>
        <div>
          <Link href="/admin" className="flex items-center gap-3 px-2">
            <MarqueChatllow taille={32} sombre />
            <span>
              <span className="font-[family-name:var(--font-display)] block text-[19px] font-semibold leading-tight">Chatllow</span>
              <span className="block text-[10.5px] text-[var(--texte-mute)]">Administration du cabinet</span>
            </span>
          </Link>
          <nav aria-label="Administration" className="mt-8 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.id}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${
                  section === n.id ? "bg-[var(--indigo)] text-[#0b1020]" : "text-[var(--texte-mute)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--texte)]"
                }`}
              >
                <Icone nom={n.icone} />
                {n.libelle}
              </Link>
            ))}
            <div className="my-3 border-t border-[var(--ligne)]" />
            <Link href="/espace-client" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-[var(--texte-mute)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--texte)]">
              <Icone nom="chat" />
              Mon espace client
            </Link>
            <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold text-[var(--texte-mute)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[var(--texte)]">
              <Icone nom="bibliotheque" />
              Site public
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--ligne)] bg-[rgba(255,255,255,0.03)] p-3">
          <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--indigo)] text-[12px] font-bold text-[#0b1020]">{initiales}</span>
          <div className="min-w-0 text-[12px] leading-tight">
            <b className="block truncate text-[13px]">{nom}</b>
            <span className="text-[var(--texte-mute)]">Fondateur</span>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-[var(--ligne)] px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2.5 lg:hidden">
            <MarqueChatllow taille={26} sombre />
          </div>
          <div title="Bientôt disponible" className="min-w-0 flex-1 cursor-not-allowed rounded-xl border border-[var(--ligne)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[13px] text-[var(--texte-mute)]">
            Rechercher un client, un diagnostic… <span className="font-[family-name:var(--font-mono)] text-[10.5px]">bientôt</span>
          </div>
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--ligne)] text-[var(--texte-mute)]" title={nouveaux ? `${nouveaux} nouveauté(s) cette semaine` : "Aucune nouveauté cette semaine"}>
            <Icone nom="cloche" />
            {!!nouveaux && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff5c8a] px-1 font-mono text-[9.5px] font-bold text-white">{nouveaux}</span>
            )}
          </span>
          <span className="hidden text-right text-[11.5px] leading-tight first-letter:uppercase text-[var(--texte-mute)] md:block">{maintenant}</span>
        </header>

        <nav aria-label="Administration" className="flex gap-2 overflow-x-auto border-b border-[var(--ligne)] px-4 py-2.5 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.id} href={n.href} className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${section === n.id ? "bg-[var(--indigo)] text-[#0b1020]" : "border border-[var(--ligne)]"}`}>
              {n.libelle}
            </Link>
          ))}
          <Link href="/espace-client" className="shrink-0 rounded-full border border-[var(--ligne)] px-3.5 py-1.5 text-[12.5px] font-semibold">
            Espace client
          </Link>
        </nav>

        <main className={`mx-auto w-full flex-1 p-4 sm:p-8 ${large ? "max-w-[1400px]" : "max-w-5xl"}`}>
          {!masquerTitre && (
            <>
              <h1 className="font-[family-name:var(--font-display)] text-[26px] font-semibold">{titre}</h1>
              {sousTitre && <p className="mt-1 max-w-2xl text-[13.5px] text-[var(--texte-mute)]">{sousTitre}</p>}
            </>
          )}
          {ok && (
            <p role="status" className="mt-5 rounded-xl bg-[rgba(52,211,153,0.14)] px-4 py-2.5 text-[13px] font-semibold text-[var(--vert-texte)]">
              {ok}
            </p>
          )}
          {erreur && (
            <p role="alert" className="mt-5 rounded-xl bg-[rgba(255,107,107,0.14)] px-4 py-2.5 text-[13px] font-semibold text-[var(--rouge-texte)]">
              {erreur}
            </p>
          )}
          <div className={masquerTitre ? "mt-2" : "mt-6"}>{children}</div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ligne)] px-4 py-4 text-[12px] text-[var(--texte-mute)] sm:px-8">
          <span className="flex items-center gap-2.5">
            <MarqueChatllow taille={22} sombre />
            <span>
              <b className="font-[family-name:var(--font-display)] text-[var(--texte)]">Chatllow</b> · Administration du cabinet
            </span>
          </span>
          <span className="flex gap-5">
            <Link href="/" className="hover:text-[var(--texte)]">Site public</Link>
            <Link href="/espace-client" className="hover:text-[var(--texte)]">Espace client</Link>
          </span>
        </footer>
      </div>
    </div>
  );
}
