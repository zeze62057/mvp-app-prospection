import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarqueChatllow } from "@/components/MarqueChatllow";
import { deconnexion } from "@/app/connexion/actions";

export const metadata = { title: "Espace client — Chatllow" };

type Section = "chat" | "projets" | "strategie" | "analyses" | "documentation" | "ressources" | "parametres";

const MENU: { id: Section; libelle: string; icone: string }[] = [
  { id: "chat", libelle: "Assistant IA", icone: "◐" },
  { id: "projets", libelle: "Mes projets", icone: "▣" },
  { id: "strategie", libelle: "Stratégie IA", icone: "◇" },
  { id: "analyses", libelle: "Analyses et rapports", icone: "▤" },
  { id: "documentation", libelle: "Documentation", icone: "▥" },
  { id: "ressources", libelle: "Ressources", icone: "▦" },
  { id: "parametres", libelle: "Paramètres", icone: "⚙" },
];

const CATEGORIE_DE: Partial<Record<Section, string>> = {
  strategie: "strategie",
  analyses: "analyse",
  documentation: "documentation",
  ressources: "ressource",
};

const STATUTS: Record<string, { libelle: string; classe: string }> = {
  a_venir: { libelle: "À venir", classe: "bg-[rgba(20,22,31,0.08)] text-[var(--texte-mute)]" },
  en_cours: { libelle: "En cours", classe: "bg-[var(--indigo-soft)] text-[oklch(45%_0.19_250)]" },
  termine: { libelle: "Terminé", classe: "bg-[rgba(34,160,110,0.14)] text-[#157a52]" },
};

type Projet = { id: string; titre: string; description: string | null; statut: string; avancement: number; created_at: string };
type Livrable = { id: string; categorie: string; titre: string; description: string | null; fichier_path: string | null; taille_octets: number | null; created_at: string };

const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const taille = (o: number | null) => (o == null ? null : o < 1_000_000 ? `${Math.max(1, Math.round(o / 1000))} Ko` : `${(o / 1_000_000).toFixed(1).replace(".", ",")} Mo`);

const CARTE = "rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]";

function LigneLivrable({ l }: { l: Livrable }) {
  return (
    <li className={`${CARTE} flex flex-wrap items-center gap-4 p-4`}>
      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--indigo-soft)] text-[16px] text-[oklch(45%_0.19_250)]">▤</span>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-semibold">{l.titre}</div>
        {l.description && <p className="mt-0.5 text-[12.5px] text-[var(--texte-mute)]">{l.description}</p>}
        <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-[var(--texte-mute)]">
          Déposé le {date(l.created_at)}
          {taille(l.taille_octets) && ` · ${taille(l.taille_octets)}`}
        </p>
      </div>
      {l.fichier_path ? (
        <a href={`/espace-client/telechargement/${l.id}`} className="rounded-full border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-semibold hover:bg-[var(--indigo-soft)]">
          Télécharger
        </a>
      ) : (
        <span className="text-[12px] text-[var(--texte-mute)]">Fichier à venir</span>
      )}
    </li>
  );
}

function Vide({ texte }: { texte: string }) {
  return (
    <div className={`${CARTE} px-6 py-12 text-center`}>
      <p className="text-[14px] font-semibold">{texte}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
        Le cabinet publie ici les éléments de votre mission dès qu&apos;ils sont prêts.
      </p>
    </div>
  );
}

export default async function EspaceClientPage({ searchParams }: { searchParams: Promise<{ section?: string }> }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/connexion");

  const { data: client } = await supabase.from("chatllow_clients").select("entreprise, contact").maybeSingle();
  if (!client) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <MarqueChatllow taille={36} />
        <h1 className="font-[family-name:var(--font-display)] mt-6 text-2xl font-semibold">Accès non ouvert</h1>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--texte-mute)]">
          Ce compte n&apos;a pas d&apos;accès à l&apos;espace client. L&apos;accès est ouvert par le cabinet à ses clients.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/rdv" className="rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13.5px] font-semibold text-white">
            Prendre rendez-vous →
          </Link>
          <form action={deconnexion}>
            <button type="submit" className="rounded-full border border-[var(--ligne)] px-5 py-2.5 text-[13.5px] font-semibold">
              Se déconnecter
            </button>
          </form>
        </div>
      </main>
    );
  }

  const { section: brute } = await searchParams;
  const section: Section = MENU.some((m) => m.id === brute) ? (brute as Section) : "chat";

  const [{ data: projets }, { data: livrables }] = await Promise.all([
    supabase.from("chatllow_projets").select("*").order("created_at", { ascending: false }).returns<Projet[]>(),
    supabase.from("chatllow_livrables").select("*").order("created_at", { ascending: false }).returns<Livrable[]>(),
  ]);
  const mesProjets = projets ?? [];
  const mesLivrables = livrables ?? [];
  const ressources = mesLivrables.filter((l) => l.categorie === "ressource");
  const prenom = client.contact.trim().split(/\s+/)[0];
  const initiales = client.contact.trim().split(/\s+/).map((m: string) => m[0]).slice(0, 2).join("").toUpperCase();
  const titreSection = MENU.find((m) => m.id === section)?.libelle ?? "";

  return (
    <div className="min-h-screen bg-[var(--fond)] lg:flex">
      {/* Barre latérale */}
      <aside
        className="hidden w-[250px] shrink-0 flex-col justify-between px-4 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen"
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
          <nav aria-label="Espace client" className="mt-8 flex flex-col gap-1">
            {MENU.map((m) => (
              <Link
                key={m.id}
                href={`/espace-client?section=${m.id}`}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${
                  section === m.id ? "bg-[var(--indigo)] text-[#0b1020]" : "text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.07)]"
                }`}
              >
                <span aria-hidden className="w-4 text-center">{m.icone}</span>
                {m.libelle}
              </Link>
            ))}
          </nav>
        </div>
        <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, oklch(45% 0.19 250), #1a1f33)" }}>
          <div className="font-[family-name:var(--font-display)] text-[14.5px] font-semibold leading-snug">Un besoin d&apos;accompagnement ?</div>
          <p className="mt-1.5 text-[11.5px] leading-relaxed text-[rgba(255,255,255,0.75)]">Le fondateur du cabinet vous répond.</p>
          <Link href="/rdv" className="mt-3 block rounded-full bg-white px-4 py-2 text-center text-[12.5px] font-semibold text-[#0b1020]">
            Prendre rendez-vous →
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Barre du haut */}
        <header className="flex items-center gap-3 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 sm:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <MarqueChatllow taille={26} />
          </div>
          <div
            title="Bientôt disponible"
            className="min-w-0 flex-1 cursor-not-allowed rounded-full border border-[var(--ligne)] bg-[var(--fond)] px-5 py-2.5 text-[13px] text-[var(--texte-mute)]"
          >
            Rechercher une question, un projet, un document… <span className="font-[family-name:var(--font-mono)] text-[10.5px]">bientôt</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--encre)] text-[12px] font-bold text-white">{initiales}</span>
            <span className="hidden text-[12.5px] leading-tight sm:block">
              <b className="block">{client.contact}</b>
              <span className="text-[var(--texte-mute)]">{client.entreprise}</span>
            </span>
            <form action={deconnexion}>
              <button type="submit" className="rounded-full border border-[var(--ligne)] px-3.5 py-1.5 text-[11.5px] font-semibold">
                Quitter
              </button>
            </form>
          </div>
        </header>

        {/* Navigation mobile */}
        <nav aria-label="Espace client" className="flex gap-2 overflow-x-auto border-b border-[var(--ligne)] px-4 py-2.5 lg:hidden">
          {MENU.map((m) => (
            <Link
              key={m.id}
              href={`/espace-client?section=${m.id}`}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${section === m.id ? "bg-[var(--encre)] text-white" : "border border-[var(--ligne)]"}`}
            >
              {m.libelle}
            </Link>
          ))}
        </nav>

        <div className="grid grid-cols-1 gap-6 p-4 sm:p-8 xl:grid-cols-[1fr_340px]">
          <main className="flex min-w-0 flex-col gap-6">
            {/* Bannière d'accueil */}
            <section
              className="relative overflow-hidden rounded-3xl p-7 text-white sm:p-9"
              style={{
                background:
                  "radial-gradient(circle at 92% 20%, oklch(62% 0.19 250 / 0.55), transparent 45%), radial-gradient(circle at 70% 100%, oklch(62% 0.19 300 / 0.35), transparent 45%), linear-gradient(135deg, #14161f, #1c2340)",
              }}
            >
              <p className="font-[family-name:var(--font-display)] text-[15px] font-medium text-[rgba(255,255,255,0.8)]">Bonjour {prenom}</p>
              <h1 className="font-[family-name:var(--font-display)] mt-2 max-w-xl text-[26px] font-semibold leading-tight sm:text-[32px]">
                Votre espace <span className="accent-italic text-[1.12em] !text-[oklch(78%_0.13_250)]">Chatllow</span>
              </h1>
              <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-[rgba(255,255,255,0.72)]">
                Suivez vos projets, retrouvez vos livrables et échangez avec le cabinet, dans un espace réservé à {client.entreprise}.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  { t: "Stratégie IA", s: "strategie" },
                  { t: "Analyses", s: "analyses" },
                  { t: "Documentation", s: "documentation" },
                  { t: "Ressources", s: "ressources" },
                ].map((p) => (
                  <Link key={p.s} href={`/espace-client?section=${p.s}`} className="rounded-full border border-[rgba(255,255,255,0.3)] px-4 py-1.5 text-[12px] font-semibold hover:bg-[rgba(255,255,255,0.1)]">
                    {p.t}
                  </Link>
                ))}
              </div>
            </section>

            {/* Zone centrale */}
            <h2 className="font-[family-name:var(--font-display)] -mb-2 text-[18px] font-semibold">{titreSection}</h2>

            {section === "chat" && (
              <section className={`${CARTE} flex flex-col`}>
                <div className="flex flex-col items-center px-6 py-14 text-center">
                  <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--indigo-soft)] text-[24px] text-[oklch(45%_0.19_250)]">◐</span>
                  <p className="font-[family-name:var(--font-display)] mt-5 text-[17px] font-semibold">L&apos;assistant IA arrive bientôt</p>
                  <p className="mt-2 max-w-md text-[13px] leading-relaxed text-[var(--texte-mute)]">
                    Vous pourrez y poser vos questions et structurer vos projets. En attendant, vos projets et livrables sont dans le menu, et le fondateur du cabinet reste joignable.
                  </p>
                  <Link href="/rdv" className="mt-5 rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13px] font-semibold text-white">
                    Prendre rendez-vous →
                  </Link>
                </div>
                <div className="flex items-center gap-3 border-t border-[var(--ligne)] p-3.5" aria-disabled>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--indigo-soft)] text-[18px] opacity-60">+</span>
                  <input
                    disabled
                    placeholder="Écrivez votre message ici… (bientôt disponible)"
                    aria-label="Message à l'assistant (bientôt disponible)"
                    className="min-w-0 flex-1 cursor-not-allowed bg-transparent text-[13px] placeholder:text-[var(--texte-mute)]"
                  />
                  <button disabled title="Bientôt disponible" className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-[var(--indigo)] text-[#0b1020] opacity-40">
                    ➤
                  </button>
                </div>
              </section>
            )}

            {section === "projets" &&
              (mesProjets.length === 0 ? (
                <Vide texte="Aucun projet pour l'instant" />
              ) : (
                <ul className="flex flex-col gap-3">
                  {mesProjets.map((p) => {
                    const st = STATUTS[p.statut] ?? STATUTS.en_cours;
                    return (
                      <li key={p.id} className={`${CARTE} p-5`}>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-[family-name:var(--font-display)] flex-1 text-[16px] font-semibold">{p.titre}</h3>
                          <span className={`rounded-full px-3 py-1 text-[11.5px] font-semibold ${st.classe}`}>{st.libelle}</span>
                        </div>
                        {p.description && <p className="mt-1.5 text-[13px] text-[var(--texte-mute)]">{p.description}</p>}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-[rgba(20,22,31,0.08)]">
                            <div className="h-full rounded-full bg-[var(--indigo)]" style={{ width: `${p.avancement}%` }} />
                          </div>
                          <span className="font-[family-name:var(--font-mono)] text-[11.5px] font-semibold">{p.avancement} %</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ))}

            {CATEGORIE_DE[section] &&
              (() => {
                const liste = mesLivrables.filter((l) => l.categorie === CATEGORIE_DE[section]);
                return liste.length === 0 ? (
                  <Vide texte="Aucun document pour l'instant" />
                ) : (
                  <ul className="flex flex-col gap-3">{liste.map((l) => <LigneLivrable key={l.id} l={l} />)}</ul>
                );
              })()}

            {section === "parametres" && (
              <section className={`${CARTE} p-6`}>
                <dl className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Entreprise</dt>
                    <dd className="mt-1 text-[14px] font-semibold">{client.entreprise}</dd>
                  </div>
                  <div>
                    <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Contact</dt>
                    <dd className="mt-1 text-[14px] font-semibold">{client.contact}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Adresse e-mail de connexion</dt>
                    <dd className="mt-1 text-[14px] font-semibold">{userData.user.email}</dd>
                  </div>
                </dl>
                <p className="mt-6 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
                  Pour modifier ces informations ou votre mot de passe, contactez le cabinet.
                </p>
                <form action={deconnexion} className="mt-5">
                  <button type="submit" className="rounded-full border border-[var(--ligne)] px-5 py-2.5 text-[13px] font-semibold">Se déconnecter</button>
                </form>
              </section>
            )}
          </main>

          {/* Colonne de droite */}
          <aside className="flex flex-col gap-5">
            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Suggestions rapides</h2>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {[
                  { t: "Identifier un premier cas d'usage IA", href: "/diagnostic" },
                  { t: "Préparer un plan d'intégration sur 3 mois", href: null },
                  { t: "Évaluer la faisabilité d'un projet", href: null },
                  { t: "Comparer les solutions du marché", href: null },
                ].map((s) => (
                  <li key={s.t}>
                    {s.href ? (
                      <Link href={s.href} className="flex items-center gap-3 rounded-xl border border-[var(--ligne)] px-3.5 py-3 text-[12.5px] font-semibold hover:bg-[var(--indigo-soft)]">
                        <span className="flex-1">{s.t}</span>
                        <span aria-hidden>›</span>
                      </Link>
                    ) : (
                      <div title="Bientôt disponible" className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-[var(--ligne)] px-3.5 py-3 text-[12.5px] font-semibold opacity-55">
                        <span className="flex-1">{s.t}</span>
                        <span className="font-[family-name:var(--font-mono)] text-[10px] font-normal">bientôt</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Votre interlocuteur</h2>
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
              <p className="mt-3.5 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
                Spécialiste de l&apos;écosystème Claude. Le diagnostic est le même cadre d&apos;audit que celui utilisé en mission.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Écosystème Claude", "Diagnostic IA"].map((t) => (
                  <span key={t} className="rounded-full bg-[var(--indigo-soft)] px-3 py-1 text-[11px] font-semibold text-[oklch(45%_0.19_250)]">{t}</span>
                ))}
              </div>
            </section>

            {ressources.length > 0 && (
              <section className={`${CARTE} p-5`}>
                <div className="flex items-center justify-between">
                  <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Ressources utiles</h2>
                  <Link href="/espace-client?section=ressources" className="text-[11.5px] font-semibold text-[oklch(45%_0.19_250)]">Voir tout →</Link>
                </div>
                <ul className="mt-3 flex flex-col divide-y divide-[var(--ligne)]">
                  {ressources.slice(0, 4).map((r) => (
                    <li key={r.id} className="py-2.5 text-[12.5px]">
                      <div className="font-semibold">{r.titre}</div>
                      <div className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--texte-mute)]">
                        {date(r.created_at)}{taille(r.taille_octets) && ` · ${taille(r.taille_octets)}`}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, oklch(50% 0.19 250), oklch(45% 0.2 295))" }}>
              <div className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-snug">Du diagnostic au pilote concret</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[rgba(255,255,255,0.8)]">Le cabinet vous accompagne de la recommandation jusqu&apos;à la mise en œuvre.</p>
              <Link href="/rdv" className="mt-3.5 inline-block rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-[#0b1020]">
                Prendre rendez-vous →
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
