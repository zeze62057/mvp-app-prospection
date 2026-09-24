import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarqueChatllow } from "@/components/MarqueChatllow";
import { MascotteRobot } from "@/components/MascotteRobot";
import { Icone, type NomIcone } from "@/components/Icone";
import { deconnexion } from "@/app/connexion/actions";
import { nouvelleConversation } from "./actions";
import { Chat, type MessageChat } from "@/components/espace-client/Chat";
import { BoutonSujet } from "@/components/espace-client/BoutonSujet";
import { EXPERTISES, LIMITE_MESSAGES_PAR_JOUR, PASTILLES, SUGGESTIONS, questionExpertise } from "@/lib/assistant-public";

export const metadata = { title: "Espace client — Chatllow" };

type Section = "chat" | "projets" | "strategie" | "analyses" | "documentation" | "ressources" | "parametres";

const MENU: { id: Section; libelle: string; icone: NomIcone }[] = [
  { id: "chat", libelle: "Chat IA", icone: "chat" },
  { id: "projets", libelle: "Mes projets", icone: "dossier" },
  { id: "strategie", libelle: "Stratégie IA", icone: "cible" },
  { id: "analyses", libelle: "Analyses & Rapports", icone: "graphique" },
  { id: "documentation", libelle: "Documentation", icone: "document" },
  { id: "ressources", libelle: "Ressources", icone: "bibliotheque" },
  { id: "parametres", libelle: "Paramètres", icone: "reglages" },
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
      <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--indigo-soft)] text-[oklch(45%_0.19_250)]"><Icone nom="fichier" className="h-5 w-5" /></span>
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

export default async function EspaceClientPage({ searchParams }: { searchParams: Promise<{ section?: string; sujet?: string }> }) {
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

  const { section: brute, sujet } = await searchParams;
  const section: Section = MENU.some((m) => m.id === brute) ? (brute as Section) : "chat";
  const surChat = section === "chat";

  const [{ data: projets }, { data: livrables }, { data: fil }] = await Promise.all([
    supabase.from("chatllow_projets").select("*").order("created_at", { ascending: false }).returns<Projet[]>(),
    supabase.from("chatllow_livrables").select("*").order("created_at", { ascending: false }).returns<Livrable[]>(),
    surChat
      ? supabase.from("chatllow_messages").select("id, role, contenu, created_at").eq("archive", false).order("created_at", { ascending: true }).limit(60).returns<MessageChat[]>()
      : Promise.resolve({ data: [] as MessageChat[] }),
  ]);
  const mesProjets = projets ?? [];
  const mesLivrables = livrables ?? [];
  const ressources = mesLivrables.filter((l) => l.categorie === "ressource");
  const prenom = client.contact.trim().split(/\s+/)[0];
  const initiales = client.contact.trim().split(/\s+/).map((m: string) => m[0]).slice(0, 2).join("").toUpperCase();
  const titreSection = MENU.find((m) => m.id === section)?.libelle ?? "";
  const assistantDisponible = Boolean(process.env.ANTHROPIC_API_KEY);

  const chipSujet = "inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.28)] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[rgba(255,255,255,0.12)]";

  return (
    <div className="min-h-screen bg-[var(--fond)] lg:flex">
      {/* Barre latérale */}
      <aside
        className="hidden w-[260px] shrink-0 flex-col justify-between overflow-y-auto px-4 py-6 text-white lg:sticky lg:top-0 lg:flex lg:h-screen"
        style={{ background: "linear-gradient(180deg, #171b2c, #0d0f16)" }}
      >
        <div>
          <Link href="/" className="flex items-center gap-3 px-2">
            <MarqueChatllow taille={30} sombre />
            <span>
              <span className="font-[family-name:var(--font-display)] block text-[18px] font-semibold leading-tight">Chatllow</span>
              <span className="block text-[10.5px] text-[rgba(255,255,255,0.55)]">L&apos;IA au service de votre performance</span>
            </span>
          </Link>
          <nav aria-label="Espace client" className="mt-7 flex flex-col gap-1">
            {MENU.map((m) => (
              <Link
                key={m.id}
                href={`/espace-client?section=${m.id}`}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-semibold ${
                  section === m.id ? "bg-[var(--indigo)] text-[#0b1020]" : "text-[rgba(255,255,255,0.75)] hover:bg-[rgba(255,255,255,0.07)]"
                }`}
              >
                <Icone nom={m.icone} />
                {m.libelle}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-[rgba(255,255,255,0.1)] pt-5">
            <p className="px-3.5 text-[12px] font-semibold text-[rgba(255,255,255,0.6)]">Nos expertises IA</p>
            <ul className="mt-2.5 flex flex-col gap-0.5">
              {EXPERTISES.map((e) => (
                <li key={e.libelle}>
                  <BoutonSujet
                    texte={questionExpertise(e.libelle)}
                    surChat={surChat}
                    className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-left text-[12.5px] font-medium text-[rgba(255,255,255,0.72)] hover:bg-[rgba(255,255,255,0.07)]"
                  >
                    <Icone nom={e.icone} className="h-4 w-4 text-[oklch(72%_0.15_250)]" />
                    {e.libelle}
                  </BoutonSujet>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-2xl p-4" style={{ background: "linear-gradient(135deg, oklch(45% 0.19 250), #1a1f33)" }}>
            <MascotteRobot className="pointer-events-none absolute -right-3 top-1 h-[74px] w-auto opacity-90" />
            <div className="max-w-[150px] font-[family-name:var(--font-display)] text-[14.5px] font-semibold leading-snug">Besoin d&apos;un accompagnement personnalisé ?</div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-[rgba(255,255,255,0.75)]">Nos consultants sont là pour vous aider à passer à l&apos;action.</p>
            <Link href="/rdv" className="mt-3 block rounded-full bg-white px-4 py-2 text-center text-[12.5px] font-semibold text-[#0b1020]">
              Prendre rendez-vous →
            </Link>
          </div>
          <div className="flex items-center gap-3 px-1">
            <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--indigo)] text-[12px] font-bold text-[#0b1020]">{initiales}</span>
            <div className="min-w-0 flex-1 text-[12px] leading-tight">
              <b className="block truncate text-[13px]">{client.contact}</b>
              <span className="block truncate text-[rgba(255,255,255,0.55)]">{client.entreprise}</span>
            </div>
            <form action={deconnexion}>
              <button type="submit" title="Se déconnecter" aria-label="Se déconnecter" className="rounded-full border border-[rgba(255,255,255,0.2)] px-2.5 py-1 text-[11px] font-semibold text-[rgba(255,255,255,0.75)]">
                Quitter
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Barre du haut */}
        <header className="flex items-center gap-3 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 sm:px-8">
          <div className="flex items-center lg:hidden">
            <MarqueChatllow taille={26} />
          </div>
          <div
            title="Bientôt disponible"
            className="min-w-0 flex-1 cursor-not-allowed rounded-full border border-[var(--ligne)] bg-[var(--fond)] px-5 py-2.5 text-[13px] text-[var(--texte-mute)]"
          >
            Rechercher une question, un projet, une ressource… <span className="font-[family-name:var(--font-mono)] text-[10.5px]">bientôt</span>
          </div>
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--encre)] text-[12px] font-bold text-white">{initiales}</span>
          <form action={deconnexion} className="lg:hidden">
            <button type="submit" className="rounded-full border border-[var(--ligne)] px-3 py-1.5 text-[11.5px] font-semibold">Quitter</button>
          </form>
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
            {surChat ? (
              <>
                {/* Bannière d'accueil de l'assistant */}
                <section
                  className="relative overflow-hidden rounded-3xl p-7 text-white sm:p-9"
                  style={{
                    background:
                      "radial-gradient(circle at 88% 30%, oklch(62% 0.19 250 / 0.55), transparent 45%), radial-gradient(circle at 75% 100%, oklch(62% 0.19 300 / 0.4), transparent 45%), linear-gradient(135deg, #10131f, #1c2340)",
                  }}
                >
                  <MascotteRobot className="pointer-events-none absolute -right-2 top-1/2 hidden h-[230px] w-auto -translate-y-1/2 sm:block" />
                  <span aria-hidden className="pointer-events-none absolute right-[210px] top-[34%] hidden rounded-full bg-[rgba(255,255,255,0.14)] px-4 py-2 text-[18px] leading-none tracking-[0.2em] text-white xl:block">•••</span>
                  <p className="font-[family-name:var(--font-display)] text-[15px] font-medium text-[rgba(255,255,255,0.85)]">Bonjour {prenom} <span aria-hidden>👋</span></p>
                  <h1 className="font-[family-name:var(--font-display)] mt-2 max-w-md text-[24px] font-semibold leading-tight sm:max-w-[420px] sm:text-[30px]">
                    Je suis votre assistant IA spécialisé dans le conseil et l&apos;intégration de l&apos;IA.
                  </h1>
                  <p className="mt-3 max-w-md text-[13px] leading-relaxed text-[rgba(255,255,255,0.72)] sm:max-w-[430px]">
                    Posez-moi vos questions, je vous aide à identifier des opportunités, à structurer vos projets et à trouver des solutions concrètes pour intégrer l&apos;IA dans vos services.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2 sm:max-w-[520px]">
                    {PASTILLES.map((p) => (
                      <BoutonSujet key={p.libelle} texte={p.question} surChat className={chipSujet}>
                        <Icone nom={p.icone} className="h-3.5 w-3.5" />
                        {p.libelle}
                      </BoutonSujet>
                    ))}
                  </div>
                </section>

                <Chat initial={fil ?? []} disponible={assistantDisponible} initiales={initiales} sujetInitial={sujet} limite={LIMITE_MESSAGES_PAR_JOUR} />

                {(fil ?? []).length > 0 && (
                  <form action={nouvelleConversation} className="-mt-3 text-right">
                    <button type="submit" className="text-[12px] font-semibold text-[var(--texte-mute)] underline">
                      Nouvelle conversation
                    </button>
                  </form>
                )}
              </>
            ) : (
              <>
                <h1 className="font-[family-name:var(--font-display)] text-[22px] font-semibold">{titreSection}</h1>

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
              </>
            )}
          </main>

          {/* Colonne de droite */}
          <aside className="flex flex-col gap-5">
            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Suggestions rapides</h2>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {SUGGESTIONS.map((s) => (
                  <li key={s.texte}>
                    <BoutonSujet
                      texte={s.texte}
                      surChat={surChat}
                      className="flex w-full items-center gap-3 rounded-xl border border-[var(--ligne)] px-3 py-2.5 text-left text-[12.5px] font-semibold hover:bg-[var(--indigo-soft)]"
                    >
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.teinte}`}><Icone nom={s.icone} /></span>
                      <span className="flex-1">{s.texte}</span>
                      <span aria-hidden>›</span>
                    </BoutonSujet>
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Nos experts IA</h2>
              <div className="mt-3.5 flex gap-3.5">
                <Image src="/zeze-bilivogui.jpg" alt="Zézé Bilivogui" width={64} height={64} className="h-16 w-16 shrink-0 rounded-2xl object-cover object-top" />
                <div>
                  <div className="text-[14px] font-semibold">Zézé Bilivogui</div>
                  <div className="text-[12px] text-[var(--texte-mute)]">Expert en transformation digitale &amp; IA</div>
                  <Link href="/rdv" className="mt-2.5 inline-block rounded-full bg-[var(--indigo)] px-4 py-1.5 text-[12px] font-semibold text-[#0b1020]">
                    Prendre rendez-vous →
                  </Link>
                </div>
              </div>
              <p className="mt-3.5 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
                Fondateur de Chatllow, spécialiste de l&apos;écosystème Claude. Accompagnement des entreprises sur l&apos;intégration de l&apos;IA et l&apos;optimisation des processus.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Stratégie IA", "Automatisation", "Conseil"].map((t) => (
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
                    <li key={r.id} className="flex items-center gap-3 py-2.5 text-[12.5px]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,107,107,0.12)] text-[#c0392b]"><Icone nom="fichier" /></span>
                      <div className="min-w-0">
                        <div className="truncate font-semibold">{r.titre}</div>
                        <div className="font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--texte-mute)]">
                          {date(r.created_at)}{taille(r.taille_octets) && ` · ${taille(r.taille_octets)}`}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="relative overflow-hidden rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, oklch(50% 0.19 250), oklch(45% 0.2 295))" }}>
              <span aria-hidden className="pointer-events-none absolute -bottom-2 right-3 text-[84px] leading-none text-[rgba(255,255,255,0.16)]">↗</span>
              <div className="font-[family-name:var(--font-display)] text-[15px] font-semibold leading-snug">L&apos;IA, un levier de croissance pour votre entreprise</div>
              <p className="mt-1.5 text-[12px] leading-relaxed text-[rgba(255,255,255,0.8)]">Notre cabinet vous accompagne de la stratégie à la mise en œuvre.</p>
              <Link href="/" className="mt-3.5 inline-block rounded-full bg-white px-4 py-2 text-[12.5px] font-semibold text-[#0b1020]">
                Découvrir nos offres →
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
