import Link from "next/link";
import { verifierAdmin } from "@/lib/admin-chatllow";
import { chargerTableauDeBord, type Activite } from "@/lib/stats-admin";
import { QUESTIONS } from "@/lib/diagnostic-questions";
import { CoqueAdmin } from "@/components/admin/CoqueAdmin";
import { Anneau, CourbeEvolution, Sparkline } from "@/components/admin/graphiques";
import { Icone, type NomIcone } from "@/components/Icone";
import { MarqueChatllow } from "@/components/MarqueChatllow";

export const metadata = { title: "Tableau de bord — Administration Chatllow" };

const CARTE = "rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]";
const PERIODES = [7, 30, 90];

function ilYa(iso: string): string {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 3600) return `il y a ${Math.max(1, Math.round(s / 60))} min`;
  if (s < 86400) return `il y a ${Math.round(s / 3600)} h`;
  return `il y a ${Math.round(s / 86400)} j`;
}

const TYPE_ACTIVITE: Record<Activite["type"], { icone: NomIcone; teinte: string }> = {
  diagnostic: { icone: "cible", teinte: "bg-[rgba(110,130,255,0.18)] text-[#9aa8ff]" },
  rdv: { icone: "calendrier", teinte: "bg-[rgba(255,140,90,0.18)] text-[#ff9c72]" },
  client: { icone: "equipe", teinte: "bg-[rgba(52,211,153,0.18)] text-[#34d399]" },
  document: { icone: "fichier", teinte: "bg-[rgba(255,92,138,0.18)] text-[#ff7aa2]" },
};

export default async function TableauDeBord({ searchParams }: { searchParams: Promise<{ p?: string; q?: string }> }) {
  await verifierAdmin();
  const { p, q } = await searchParams;
  const periode = PERIODES.includes(Number(p)) ? Number(p) : 30;
  const indexQ = Math.max(0, Math.min(QUESTIONS.length - 1, Number.isInteger(Number(q)) ? Number(q) : 0));
  const d = await chargerTableauDeBord(periode, indexQ);

  const kpis: { libelle: string; valeur: number; icone: NomIcone; couleur: string; teinte: string; donnees: typeof d.kpi.clients }[] = [
    { libelle: "Clients", valeur: d.total.clients, icone: "equipe", couleur: "#34d399", teinte: "bg-[rgba(52,211,153,0.16)] text-[#34d399]", donnees: d.kpi.clients },
    { libelle: "Projets en cours", valeur: d.total.enCours, icone: "dossier", couleur: "#7c8cff", teinte: "bg-[rgba(110,130,255,0.18)] text-[#9aa8ff]", donnees: d.kpi.projets },
    { libelle: "Documents livrés", valeur: d.total.livrables, icone: "fichier", couleur: "#ff7aa2", teinte: "bg-[rgba(255,92,138,0.16)] text-[#ff7aa2]", donnees: d.kpi.livrables },
    { libelle: "Diagnostics reçus", valeur: d.total.diagnostics, icone: "cible", couleur: "#5fb8ff", teinte: "bg-[rgba(95,184,255,0.16)] text-[#5fb8ff]", donnees: d.kpi.diagnostics },
    { libelle: "Demandes de rendez-vous", valeur: d.total.rdv, icone: "calendrier", couleur: "#ff9c72", teinte: "bg-[rgba(255,140,90,0.16)] text-[#ff9c72]", donnees: d.kpi.rdv },
  ];

  const toutZero = d.evolution.diagnostics.every((v) => v === 0) && d.evolution.rdv.every((v) => v === 0);
  const maxRep = Math.max(...d.question.repartition.map((r) => r.n), 1);
  const nouveaux = d.nouveaux7.diagnostics + d.nouveaux7.rdv;

  const points: { texte: string; ok: boolean }[] = [
    {
      texte: d.nouveaux7.diagnostics > 0 ? `${d.nouveaux7.diagnostics} diagnostic${d.nouveaux7.diagnostics > 1 ? "s" : ""} reçu${d.nouveaux7.diagnostics > 1 ? "s" : ""} ces 7 derniers jours.` : "Aucun nouveau diagnostic ces 7 derniers jours.",
      ok: d.nouveaux7.diagnostics > 0,
    },
    {
      texte: d.nouveaux7.rdv > 0 ? `${d.nouveaux7.rdv} demande${d.nouveaux7.rdv > 1 ? "s" : ""} de rendez-vous à traiter ces 7 derniers jours.` : "Aucune demande de rendez-vous ces 7 derniers jours.",
      ok: d.nouveaux7.rdv > 0,
    },
  ];
  if (d.freinPrincipal) points.push({ texte: `Frein le plus cité : « ${d.freinPrincipal.option} » (${d.freinPrincipal.n} réponse${d.freinPrincipal.n > 1 ? "s" : ""}).`, ok: true });
  if (d.total.clients > 0) {
    points.push(
      d.clientsSansProjet > 0
        ? { texte: `${d.clientsSansProjet} client${d.clientsSansProjet > 1 ? "s" : ""} sans projet : pensez à en créer un.`, ok: false }
        : { texte: "Chaque client a au moins un projet.", ok: true }
    );
  }

  const outils: { libelle: string; href: string; icone: NomIcone }[] = [
    { libelle: "Nouveau client", href: "/admin/clients", icone: "equipe" },
    { libelle: "Diagnostics reçus", href: "/admin/diagnostics", icone: "cible" },
    { libelle: "Demandes de rendez-vous", href: "/admin/rendez-vous", icone: "calendrier" },
    { libelle: "Ajouter un projet", href: "/admin/clients", icone: "dossier" },
    { libelle: "Mon espace client", href: "/espace-client", icone: "chat" },
    { libelle: "Site public", href: "/", icone: "bibliotheque" },
  ];

  return (
    <CoqueAdmin section="accueil" titre="Tableau de bord" nouveaux={nouveaux} large masquerTitre>
      <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
        <div className="flex min-w-0 flex-col gap-5">
          {/* Bandeau */}
          <section
            className="relative overflow-hidden rounded-3xl border border-[var(--ligne)] p-6 sm:p-8"
            style={{ background: "radial-gradient(circle at 80% 100%, rgba(255,140,90,0.35), transparent 45%), radial-gradient(circle at 60% 0%, rgba(124,140,255,0.4), transparent 50%), linear-gradient(120deg, #0d1226, #1a1440 60%, #2a1a4a)" }}
          >
            <svg aria-hidden viewBox="0 0 400 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full opacity-40">
              <path d="M0 60V38h20v-8h14v14h16V20h10v18h18V28h12v16h20V14h8v30h18V30h14v14h24V22h10v22h18V34h16v10h20V26h12v18h20V32h14v12h22V18h9v26h20V36h14v8h24V60Z" fill="#070a14" />
            </svg>
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <MarqueChatllow taille={54} sombre />
                <div>
                  <h1 className="font-[family-name:var(--font-display)] text-[38px] font-semibold leading-none sm:text-[46px]">Chatllow</h1>
                  <p className="mt-1.5 text-[13.5px] text-[var(--texte-mute)]">Administration du cabinet de conseil IA</p>
                </div>
              </div>
              <p className="max-w-[240px] text-[15px] font-semibold leading-snug">Vos clients, vos projets et vos prospects, au même endroit.</p>
              <div className="grid grid-cols-4 divide-x divide-[var(--ligne)] rounded-xl border border-[var(--ligne)] bg-[rgba(8,11,22,0.6)] py-2.5 text-center backdrop-blur">
                {[
                  { l: "Clients", v: d.total.clients },
                  { l: "Projets", v: d.total.projets },
                  { l: "Documents", v: d.total.livrables },
                  { l: "Diagnostics", v: d.total.diagnostics },
                ].map((x) => (
                  <div key={x.l} className="px-4">
                    <div className="text-[10.5px] text-[var(--texte-mute)]">{x.l}</div>
                    <div className="font-[family-name:var(--font-display)] text-[17px] font-semibold">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tuiles */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 2xl:grid-cols-5">
            {kpis.map((k) => {
              const delta = k.donnees.recents - k.donnees.precedents;
              return (
                <section key={k.libelle} className={`${CARTE} p-4`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${k.teinte}`}>
                      <Icone nom={k.icone} />
                    </span>
                    <span className="text-[11.5px] font-semibold leading-tight text-[var(--texte-mute)]">{k.libelle}</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <div>
                      <div className="font-[family-name:var(--font-display)] text-[28px] font-semibold leading-none">{k.valeur}</div>
                      <div className={`mt-1.5 text-[11px] font-semibold ${delta > 0 ? "text-[var(--vert-texte)]" : delta < 0 ? "text-[var(--rouge-texte)]" : "text-[var(--texte-mute)]"}`}>
                        {delta > 0 ? "▲ +" : delta < 0 ? "▼ " : "= "}
                        {delta} sur 7 j
                      </div>
                    </div>
                    <Sparkline valeurs={k.donnees.serie} couleur={k.couleur} />
                  </div>
                </section>
              );
            })}
          </div>

          {/* Evolution + repartition */}
          <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            <section className={`${CARTE} p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Évolution des demandes</h2>
                <div className="flex gap-1 rounded-xl border border-[var(--ligne)] p-1">
                  {PERIODES.map((n) => (
                    <Link key={n} href={`/admin?p=${n}&q=${indexQ}`} className={`rounded-lg px-3 py-1 text-[12px] font-semibold ${periode === n ? "bg-[var(--indigo)] text-[#0b1020]" : "text-[var(--texte-mute)]"}`}>
                      {n} j
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mt-2 flex gap-4 text-[11.5px] text-[var(--texte-mute)]">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#7c8cff]" />Diagnostics</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#ff9c72]" />Rendez-vous</span>
              </div>
              <div className="mt-3">
                <CourbeEvolution
                  jours={d.evolution.jours}
                  series={[
                    { nom: "Diagnostics", couleur: "#7c8cff", valeurs: d.evolution.diagnostics },
                    { nom: "Rendez-vous", couleur: "#ff9c72", valeurs: d.evolution.rdv },
                  ]}
                />
              </div>
              {toutZero && <p className="mt-1 text-center text-[12px] text-[var(--texte-mute)]">Aucune demande sur les {periode} derniers jours.</p>}
            </section>

            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Réponses au diagnostic</h2>
              <div className="mt-3 flex flex-wrap gap-1">
                {QUESTIONS.map((_, i) => (
                  <Link key={i} href={`/admin?p=${periode}&q=${i}`} className={`rounded-lg px-2.5 py-1 text-[11.5px] font-semibold ${indexQ === i ? "bg-[var(--indigo)] text-[#0b1020]" : "border border-[var(--ligne)] text-[var(--texte-mute)]"}`}>
                    Q{i + 1}
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-[12px] leading-snug text-[var(--texte-mute)]">{d.question.texte}</p>
              {d.question.total === 0 ? (
                <p className="mt-6 text-center text-[12.5px] text-[var(--texte-mute)]">Aucune réponse pour l&apos;instant.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-3">
                  {d.question.repartition.map((r) => (
                    <li key={r.option}>
                      <div className="flex justify-between gap-3 text-[12px]">
                        <span>{r.option}</span>
                        <b className="text-[var(--vert-texte)]">{Math.round((r.n / d.question.total) * 100)} %</b>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[rgba(140,160,255,0.14)]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#7c8cff] to-[#34d399]" style={{ width: `${(r.n / maxRep) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* Clients, activite, avancement */}
          <div className="grid gap-5 lg:grid-cols-[1.3fr_1.2fr_0.9fr]">
            <section className={`${CARTE} p-5`}>
              <div className="flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Mes clients</h2>
                <Link href="/admin/clients" className="rounded-lg border border-[var(--ligne)] px-3 py-1 text-[11.5px] font-semibold">Gérer</Link>
              </div>
              {d.clients.length === 0 ? (
                <p className="mt-6 text-center text-[12.5px] text-[var(--texte-mute)]">Aucun client pour l&apos;instant.</p>
              ) : (
                <ul className="mt-3 divide-y divide-[var(--ligne)]">
                  {d.clients.map((c) => (
                    <li key={c.id}>
                      <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-3 py-2.5 hover:opacity-80">
                        <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(110,130,255,0.18)] text-[12px] font-bold text-[#9aa8ff]">{c.entreprise[0]?.toUpperCase()}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-semibold">{c.entreprise}</span>
                          <span className="block text-[11px] text-[var(--texte-mute)]">{c.nbProjets} projet{c.nbProjets !== 1 ? "s" : ""} · {c.nbDocs} document{c.nbDocs !== 1 ? "s" : ""}</span>
                        </span>
                        <span className="w-20 text-right">
                          <span className="text-[12px] font-semibold text-[var(--vert-texte)]">{c.avancement === null ? "—" : `${c.avancement} %`}</span>
                          <span className="mt-1 block h-1 overflow-hidden rounded-full bg-[rgba(140,160,255,0.14)]">
                            <span className="block h-full rounded-full bg-[#34d399]" style={{ width: `${c.avancement ?? 0}%` }} />
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Activité récente</h2>
              {d.activite.length === 0 ? (
                <p className="mt-6 text-center text-[12.5px] text-[var(--texte-mute)]">Rien à signaler pour l&apos;instant.</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-3">
                  {d.activite.map((a, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TYPE_ACTIVITE[a.type].teinte}`}>
                        <Icone nom={TYPE_ACTIVITE[a.type].icone} className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-semibold">{a.titre}</div>
                        <div className="truncate text-[11.5px] text-[var(--texte-mute)]">{a.detail}</div>
                      </div>
                      <span className="shrink-0 text-[10.5px] text-[var(--texte-mute)]">{ilYa(a.date)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className={`${CARTE} p-5`}>
              <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Avancement des projets</h2>
              {d.avancementMoyen === null ? (
                <p className="mt-6 text-center text-[12.5px] text-[var(--texte-mute)]">Aucun projet pour l&apos;instant.</p>
              ) : (
                <div className="mt-3 flex flex-col items-center gap-3">
                  <Anneau pct={d.avancementMoyen} libelle={`${d.avancementMoyen} %`} sous="en moyenne" />
                  <ul className="w-full text-[12px]">
                    {[
                      { l: "En cours", n: d.parStatut.en_cours, c: "#7c8cff" },
                      { l: "Terminés", n: d.parStatut.termine, c: "#34d399" },
                      { l: "À venir", n: d.parStatut.a_venir, c: "#ff9c72" },
                    ].map((s) => (
                      <li key={s.l} className="flex items-center justify-between py-1">
                        <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: s.c }} />{s.l}</span>
                        <b>{s.n}</b>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Colonne de droite */}
        <aside className="flex flex-col gap-5">
          <section className="rounded-2xl border border-[rgba(124,140,255,0.4)] p-5" style={{ background: "linear-gradient(160deg, rgba(90,110,255,0.14), rgba(17,23,41,0.9))" }}>
            <div className="flex items-center gap-3">
              <MarqueChatllow taille={38} sombre />
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold leading-tight">Synthèse du jour</h2>
                <p className="text-[11.5px] text-[var(--texte-mute)]">Calculée sur vos données</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[var(--ligne)] bg-[rgba(8,11,22,0.5)] p-4">
              <p className="text-[12.5px] font-semibold">Points clés :</p>
              <ul className="mt-3 flex flex-col gap-3">
                {points.map((pt) => (
                  <li key={pt.texte} className="flex items-start gap-2.5 text-[12.5px] leading-snug">
                    <span aria-hidden className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${pt.ok ? "bg-[rgba(52,211,153,0.2)] text-[#34d399]" : "bg-[rgba(255,140,90,0.2)] text-[#ff9c72]"}`}>{pt.ok ? "✓" : "!"}</span>
                    {pt.texte}
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/admin/diagnostics" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5b6cff] to-[#9b7cff] px-4 py-3 text-[13px] font-semibold text-white">
              Voir les diagnostics <span aria-hidden>→</span>
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-[11.5px] font-semibold">
              <Link href="/admin/clients" className="rounded-lg border border-[var(--ligne)] px-2 py-2 hover:bg-[var(--indigo-soft)]">Nouveau client</Link>
              <Link href="/admin/rendez-vous" className="rounded-lg border border-[var(--ligne)] px-2 py-2 hover:bg-[var(--indigo-soft)]">Rendez-vous</Link>
            </div>
          </section>

          <section className={`${CARTE} p-5`}>
            <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Outils rapides</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {outils.map((o) => (
                <Link key={o.libelle} href={o.href} className="flex flex-col items-center gap-2 rounded-xl border border-[var(--ligne)] bg-[rgba(255,255,255,0.02)] px-2 py-4 text-center text-[11.5px] font-semibold leading-tight hover:bg-[var(--indigo-soft)]">
                  <Icone nom={o.icone} className="h-5 w-5 text-[#9aa8ff]" />
                  {o.libelle}
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </CoqueAdmin>
  );
}
