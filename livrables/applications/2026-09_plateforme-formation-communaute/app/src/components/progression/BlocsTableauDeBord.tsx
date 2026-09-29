import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { couleurAvatar } from "@/lib/avatar";
import { heure, type EvenementCalendrier } from "@/lib/calendrier";
import { CompteurAnime } from "@/components/progression/CompteurAnime";

// Blocs du tableau de bord eleve, d'apres la maquette fournie le 2026-09-29. Que des donnees reelles :
// tout ce que la maquette montrait sans source en base (heures d'apprentissage, durees restantes, defis,
// parcours, photos) est omis ou remplace par une illustration aux couleurs Vivier. Composants sans etat,
// les animations sont dans globals.css.

const ICONES = {
  cap: "M12 3 2 8l10 5 8-4v6h2V8L12 3zm-6 9v4c0 1.7 2.7 3 6 3s6-1.3 6-3v-4l-6 3-6-3z",
  flamme: "M12 2s5 4 5 9a5 5 0 01-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-8z",
  trophee: "M7 4h10v3a5 5 0 01-4 4.9V15h3v2H8v-2h3v-3.1A5 5 0 017 7V4zM4 5h3v2a3 3 0 01-3-2zm16 0h-3v2a3 3 0 003-2zM8 19h8v2H8z",
  membres: "M16 11a3 3 0 100-6 3 3 0 000 6zm-8 0a3 3 0 100-6 3 3 0 000 6zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .1 1.2.9 2 2 2 3.4V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z",
  calendrier: "M7 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-2V2h-2v2H9V2H7zm-2 8h14v10H5V10z",
  livre: "M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4V4zm16 0h-4a3 3 0 00-2 .8V20a2 2 0 012-2h4V4z",
  niveau: "M12 2l3 6.5 7 1-5 5 1.2 7L12 18l-6.2 3.5L7 14.5l-5-5 7-1L12 2z",
} as const;

function Icone({ nom, className = "h-4 w-4" }: { nom: keyof typeof ICONES; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d={ICONES[nom]} />
    </svg>
  );
}

function TitreCarte({ icone, titre, lien }: { icone: keyof typeof ICONES; titre: string; lien?: { href: string; texte?: string } }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle)]">
          <Icone nom={icone} />
        </span>
        <h2 className="font-display text-[15px] font-bold">{titre}</h2>
      </div>
      {lien && (
        <Link href={lien.href} className="font-mono text-[11px] font-bold text-[var(--sarcelle-texte)] hover:underline">
          {lien.texte ?? "Voir tout"} →
        </Link>
      )}
    </div>
  );
}

const CARTE = "rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5";

// ---------------------------------------------------------------------------------------------
// Anneau de progression (grand format du bandeau et du profil)
// ---------------------------------------------------------------------------------------------
function AnneauGrand({ pct, taille, clair = false }: { pct: number; taille: number; clair?: boolean }) {
  const rayon = 44;
  const circ = 2 * Math.PI * rayon;
  const decalage = circ * (1 - pct / 100);
  return (
    <div className="relative" style={{ width: taille, height: taille }}>
      <svg viewBox="0 0 100 100" width={taille} height={taille}>
        <circle cx="50" cy="50" r={rayon} fill="none" stroke={clair ? "rgba(234,245,242,0.16)" : "var(--ligne)"} strokeWidth="9" />
        <circle
          className="anim-anneau"
          style={{ "--circ": circ, "--decalage": decalage } as CSSProperties}
          cx="50" cy="50" r={rayon} fill="none"
          stroke={clair ? "#5FC7B8" : "var(--sarcelle)"} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={decalage} transform="rotate(-90 50 50)"
        />
      </svg>
      <div className={`font-display absolute inset-0 flex items-center justify-center text-[26px] font-extrabold ${clair ? "text-[var(--sur-encre)]" : ""}`}>
        {pct}%
      </div>
    </div>
  );
}

// Montagne et drapeau : illustration de la marque, pas une photo. Posee en bas a droite d'un bandeau sombre.
export function MontagneDrapeau() {
  return (
    <svg aria-hidden className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[68%] md:block" viewBox="0 0 400 200" preserveAspectRatio="xMaxYMax slice" fill="none">
      <path d="M60 200 190 55l45 55 40-32 125 122z" fill="#0d3029" fillOpacity="0.85" />
      <path d="M120 200 250 40l70 90 45-35 35 105z" fill="#154a41" fillOpacity="0.9" />
      <path d="M250 40l-26 34 18-8 12 14 14-18 12 10z" fill="#EAF5F2" fillOpacity="0.85" />
      <line x1="250" y1="40" x2="250" y2="14" stroke="#EAF5F2" strokeWidth="2" strokeLinecap="round" />
      <path className="anim-lueur" d="M250 14l24 6-24 7z" fill="#FF7A4D" />
    </svg>
  );
}

// ---------------------------------------------------------------------------------------------
// Bandeau d'accueil : texte a gauche, montagne et drapeau (illustration), carte de progression a droite
// ---------------------------------------------------------------------------------------------
export function BandeauAccueil({
  salutation, pseudo, pctGlobal, modulesCompletes, totalModules, lienReprise,
}: {
  salutation: string; pseudo: string; pctGlobal: number; modulesCompletes: number; totalModules: number; lienReprise: string;
}) {
  return (
    <section
      className="anim-entree relative mb-6 overflow-hidden rounded-3xl text-[var(--sur-encre)]"
      style={{
        background:
          "radial-gradient(circle at 12% 0%, rgba(95,199,184,0.34), transparent 52%), radial-gradient(circle at 70% 0%, rgba(255,122,77,0.22), transparent 44%), linear-gradient(135deg, #16443c, #0b2622)",
      }}
    >
      <MontagneDrapeau />

      <div className="relative grid gap-6 px-6 py-8 sm:px-9 md:grid-cols-[1fr_auto] md:items-center">
        <div className="md:max-w-[440px]">
          <p className="font-mono text-[11px] font-bold uppercase tracking-wide text-[var(--sarcelle-light)]">
            {salutation} {pseudo}{" "}
            <span className="anim-salue" aria-hidden>👋</span>
          </p>
          <h1 className="font-display mt-2 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">
            Envie d&apos;aller encore plus loin ?
          </h1>
          <p className="mt-2.5 text-[13.5px] text-[var(--sur-encre-mute)]">
            Chaque étape te rapproche de tes objectifs. Continue sur ta lancée, tu fais déjà une vraie différence !
          </p>
          <Link
            href={lienReprise}
            className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-[var(--corail)] px-6 py-3 text-[13px] font-extrabold text-[var(--encre)]"
          >
            Reprendre ma formation →
          </Link>
        </div>

        <div className="relative rounded-2xl border border-[rgba(234,245,242,0.16)] bg-[rgba(11,38,34,0.55)] p-5 backdrop-blur md:w-[230px]">
          <div className="mx-auto w-fit"><AnneauGrand pct={pctGlobal} taille={112} clair /></div>
          <p className="font-display mt-3 text-center text-[13px] font-bold">Progression globale</p>
          <p className="mt-0.5 text-center font-mono text-[11px] text-[var(--sur-encre-mute)]">
            {modulesCompletes} / {totalModules} modules
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(234,245,242,0.14)]">
            <div className="anim-barre h-full rounded-full" style={{ width: `${pctGlobal}%`, background: "linear-gradient(90deg, #5FC7B8, #FF7A4D)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------------------------
// Quatre statistiques
// ---------------------------------------------------------------------------------------------
type Stat = { icone: keyof typeof ICONES; libelle: string; valeur: number | null; sur?: number; delta?: number };

export function CartesStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.libelle} className="anim-entree carte-vivante flex items-center gap-3.5 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4" style={{ "--d": `${120 + i * 80}ms` } as CSSProperties}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle)]">
            <Icone nom={s.icone} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <div className="text-[11.5px] text-[var(--texte-mute)]">{s.libelle}</div>
            <div className="font-display text-xl font-extrabold leading-tight">
              {s.valeur === null ? "—" : <><CompteurAnime valeur={s.valeur} />{s.sur !== undefined && <span className="text-[var(--texte-mute)]"> / {s.sur}</span>}</>}
            </div>
            {s.delta !== undefined && s.delta > 0 && (
              <div className="text-[10.5px] font-bold text-[var(--sarcelle-texte)]">↗ +{s.delta} cette semaine</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Vignette de module : illustration Vivier (pas de photo en base), teinte selon le rang du module
// ---------------------------------------------------------------------------------------------
const TEINTES = [
  ["#16443c", "#2b8c82"], ["#113832", "#5fc7b8"], ["#1b4d45", "#ff7a4d"],
  ["#0e2f2a", "#2b8c82"], ["#16443c", "#ff7a4d"], ["#113832", "#2b8c82"],
];
export function Vignette({ rang, className }: { rang: number; className: string }) {
  const [a, b] = TEINTES[rang % TEINTES.length];
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-xl ${className}`} style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} aria-hidden>
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" fill="none">
        <circle cx="45" cy="75" r="22" stroke="#EAF5F2" strokeOpacity="0.4" strokeWidth="9" />
        <line x1="61" y1="59" x2="95" y2="25" stroke="#EAF5F2" strokeOpacity="0.4" strokeWidth="9" strokeLinecap="round" />
        <circle cx="95" cy="25" r="9" fill="#FF7A4D" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Ma formation en cours + Mes modules
// ---------------------------------------------------------------------------------------------
export type ModuleResume = { id: string; rang: number; titre: string; faites: number; total: number; pct: number; lien: string };

export function FormationEnCours({
  espaceSlug, courant, actionTerminer,
}: {
  espaceSlug: string;
  courant: { module: ModuleResume; titreSection: string; lien: string } | null;
  actionTerminer: ReactNode; // formulaire "marquer comme terminee", fourni par la page (action serveur liee)
}) {
  return (
    <div className={CARTE}>
      <TitreCarte icone="livre" titre="Ma formation en cours" lien={{ href: `/${espaceSlug}/formation` }} />
      {courant ? (
        <div className="flex flex-col gap-4 rounded-xl border border-[var(--ligne)] bg-[var(--fond)] p-3.5 sm:flex-row sm:items-center">
          <Vignette rang={courant.module.rang} className="h-[120px] w-full sm:w-[170px]" />
          <div className="min-w-0 flex-1">
            <span className="rounded-md bg-[rgba(43,140,130,0.14)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--sarcelle-texte)]">En cours</span>
            <h3 className="font-display mt-1.5 text-[16px] font-bold">{courant.module.titre}</h3>
            <p className="mt-0.5 text-[12px] text-[var(--texte-mute)]">Prochaine leçon : {courant.titreSection}</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--ligne)]">
                <div className="anim-barre h-full rounded-full bg-[var(--sarcelle)]" style={{ width: `${courant.module.pct}%` }} />
              </div>
              <span className="font-mono text-[12px] font-bold text-[var(--sarcelle-texte)]">{courant.module.pct}%</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-[var(--texte-mute)]">{courant.module.faites} / {courant.module.total} leçons</span>
              <div className="flex items-center gap-4">
                {actionTerminer}
                <Link href={courant.lien} className="rounded-[9px] bg-[var(--encre)] px-5 py-2.5 text-[12.5px] font-bold text-[var(--sur-encre)]">Reprendre →</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[var(--ligne)] p-5 text-center text-sm text-[var(--texte-mute)]">Formation terminée, félicitations !</p>
      )}
    </div>
  );
}

export function ListeModules({ modules }: { modules: ModuleResume[] }) {
  if (modules.length === 0) {
    return <p className="rounded-2xl border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">Aucun module pour le moment.</p>;
  }
  return (
    <div className={CARTE}>
      <h2 className="font-display mb-3 text-[15px] font-bold">Mes modules</h2>
      <div className="flex flex-col gap-2.5">
        {modules.map((m) => (
          <Link key={m.id} href={m.lien} className="carte-vivante flex items-center gap-3.5 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-2.5">
            <Vignette rang={m.rang} className="h-14 w-20" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-bold">{m.titre}</div>
              <div className="font-mono text-[10.5px] text-[var(--texte-mute)]">{m.faites} / {m.total} leçons</div>
              <div className="mt-1.5 flex items-center gap-2.5">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--ligne)]">
                  <div className="h-full rounded-full bg-[var(--sarcelle)]" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="font-mono text-[10.5px] font-bold text-[var(--sarcelle-texte)]">{m.pct}%</span>
              </div>
            </div>
            <span className={`hidden shrink-0 rounded-lg px-3.5 py-2 text-[11.5px] font-bold sm:block ${m.pct > 0 && m.pct < 100 ? "bg-[var(--encre)] text-[var(--sur-encre)]" : "border border-[var(--ligne)]"}`}>
              {m.pct === 100 ? "Revoir" : m.pct > 0 ? "Reprendre" : "Commencer"}
            </span>
            <span aria-hidden className="text-[var(--texte-mute)]">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Prochaines sessions (bas) et calendrier (colonne de droite) : memes evenements reels
// ---------------------------------------------------------------------------------------------
function TuileDate({ iso }: { iso: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]">
      <span className="text-[16px] font-extrabold leading-none">{new Date(iso).toLocaleDateString("fr-FR", { day: "numeric" })}</span>
      <span className="font-mono text-[9px] uppercase">{new Date(iso).toLocaleDateString("fr-FR", { month: "short" })}</span>
    </div>
  );
}

export function ProchainesSessions({ espaceSlug, evenements }: { espaceSlug: string; evenements: EvenementCalendrier[] }) {
  return (
    <div className={CARTE}>
      <TitreCarte icone="calendrier" titre="Prochaines sessions" lien={{ href: `/${espaceSlug}/calendrier` }} />
      {evenements.length === 0 ? (
        <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune session programmée pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {evenements.map((e) => (
            <div key={e.type + e.id} className="flex flex-col gap-3 rounded-xl border border-[var(--ligne)] p-3.5">
              <div className="flex items-start gap-3">
                <TuileDate iso={e.debut} />
                <div className="min-w-0">
                  <div className="text-[12.5px] font-bold leading-snug">{e.titre}</div>
                  <div className="mt-0.5 font-mono text-[10.5px] text-[var(--texte-mute)]">{heure(e.debut)} · En ligne</div>
                </div>
              </div>
              <Link href={e.page} className="rounded-lg bg-[rgba(43,140,130,0.12)] py-2 text-center text-[12px] font-bold text-[var(--sarcelle-texte)]">Rejoindre</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MonCalendrier({ espaceSlug, evenements }: { espaceSlug: string; evenements: EvenementCalendrier[] }) {
  const mois = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "Africa/Conakry" });
  return (
    <div className={CARTE}>
      <TitreCarte icone="calendrier" titre="Mon calendrier" lien={{ href: `/${espaceSlug}/calendrier` }} />
      <p className="mb-2 text-[12.5px] font-bold capitalize text-[var(--sarcelle-texte)]">{mois}</p>
      {evenements.length === 0 ? (
        <p className="text-[12px] text-[var(--texte-mute)]">Aucun événement à venir.</p>
      ) : (
        evenements.map((e) => (
          <Link key={e.type + e.id} href={e.page} className="flex items-center gap-3 border-t border-[var(--ligne)] py-2.5 first:border-t-0 hover:text-[var(--sarcelle)]">
            <TuileDate iso={e.debut} />
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-bold">{e.titre}</div>
              <div className="font-mono text-[10.5px] text-[var(--texte-mute)]">{heure(e.debut)}</div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// Profil de progression, communaute, citation, ressources
// ---------------------------------------------------------------------------------------------
export function ProfilProgression({
  pct, lignes,
}: { pct: number; lignes: { icone: keyof typeof ICONES; libelle: string; valeur: string }[] }) {
  return (
    <div className={CARTE}>
      <TitreCarte icone="niveau" titre="Mon profil de progression" />
      <div className="mb-4 flex justify-center"><AnneauGrand pct={pct} taille={110} /></div>
      <div className="flex flex-col">
        {lignes.map((l) => (
          <div key={l.libelle} className="flex items-center gap-3 border-t border-[var(--ligne)] py-2.5 text-[12.5px]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle)]"><Icone nom={l.icone} className="h-3.5 w-3.5" /></span>
            <span className="flex-1 text-[var(--texte-mute)]">{l.libelle}</span>
            <span className="font-mono font-bold">{l.valeur}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MaCommunaute({
  espaceSlug, nbMembres, eleves,
}: { espaceSlug: string; nbMembres: number | null; eleves: { id: string; pseudo: string }[] }) {
  return (
    <div className={CARTE}>
      <TitreCarte icone="membres" titre="Ma communauté" lien={{ href: `/${espaceSlug}/communaute-payante` }} />
      <p className="text-[12.5px] text-[var(--texte-mute)]">Échange avec d&apos;autres apprenants, pose tes questions et partage tes progrès.</p>
      <div className="mt-3.5 flex items-center gap-3">
        <div className="flex -space-x-2">
          {eleves.slice(0, 5).map((e) => (
            <span key={e.id} title={e.pseudo} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[var(--fond-carte)] text-[11px] font-extrabold text-white" style={{ background: couleurAvatar(e.id) }}>
              {e.pseudo.slice(0, 1).toUpperCase()}
            </span>
          ))}
        </div>
        {nbMembres !== null && <span className="text-[12px] font-bold">{nbMembres} membre{nbMembres > 1 ? "s" : ""}</span>}
      </div>
      <Link href={`/${espaceSlug}/communaute-payante`} className="mt-4 block rounded-[10px] bg-[var(--encre)] py-2.5 text-center text-[12.5px] font-bold text-[var(--sur-encre)]">
        Rejoindre la communauté
      </Link>
    </div>
  );
}

export function CarteCitation() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 text-[var(--sur-encre)]" style={{ background: "linear-gradient(160deg, #16443c, #0b2622)" }}>
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full" viewBox="0 0 300 100" preserveAspectRatio="none" fill="none">
        <path d="M0 100V70l50-30 45 25 60-45 70 50 40-25 35 20v35z" fill="#5FC7B8" fillOpacity="0.14" />
        <path d="M0 100V85l70-25 55 20 65-35 110 40v15z" fill="#FF7A4D" fillOpacity="0.14" />
      </svg>
      <p className="font-display relative pb-14 text-[15px] font-semibold leading-snug">
        « Les grandes choses ne se font pas en un jour, mais par de petits efforts répétés chaque jour. »
      </p>
      <p className="relative -mt-10 font-mono text-[11px] text-[var(--sarcelle-light)]">— Vivier IA</p>
    </div>
  );
}

export function RessourcesUtiles({
  espaceSlug, ressources,
}: { espaceSlug: string; ressources: { id: string; titre: string; description: string }[] }) {
  if (ressources.length === 0) return null;
  return (
    <div className={CARTE}>
      <TitreCarte icone="livre" titre="Ressources utiles" lien={{ href: `/${espaceSlug}/ressources` }} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ressources.map((r) => (
          <Link key={r.id} href={`/${espaceSlug}/ressources`} className="carte-vivante flex flex-col gap-1.5 rounded-xl border border-[var(--ligne)] p-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]"><Icone nom="livre" className="h-4.5 w-4.5" /></span>
            <span className="text-[12.5px] font-bold leading-snug">{r.titre}</span>
            <span className="line-clamp-2 text-[11px] text-[var(--texte-mute)]">{r.description}</span>
            <span className="mt-auto pt-1 font-mono text-[11px] font-bold text-[var(--sarcelle-texte)]">Voir →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
