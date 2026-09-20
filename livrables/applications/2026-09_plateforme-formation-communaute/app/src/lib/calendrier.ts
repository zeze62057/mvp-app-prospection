// Calendrier des evenements d'un espace (masterclass et RDV). Partie logique, sans dependance,
// pour rester testable seule : mois, grille, jours, et fichier .ics.
//
// Fuseau : tous les jours et toutes les heures sont ceux de Conakry (Africa/Conakry, UTC+0 toute
// l'annee, sans heure d'ete). Les dates sont stockees en UTC dans la base : les bornes d'un mois
// sont donc de simples dates UTC. Si le fuseau devait changer, ce fichier est le seul a adapter.

export const FUSEAU = "Africa/Conakry";

export type Periode = { annee: number; mois: number }; // mois de 1 a 12

export type EvenementCalendrier = {
  id: string;
  type: "masterclass" | "rdv";
  titre: string;
  debut: string; // ISO UTC
  description: string;
  statut: "inscrit" | "reserve" | "ouvert" | "libre";
  lien: string | null; // seulement pour un evenement auquel la personne participe
  page: string; // page ou s'inscrire / reserver
};

const MOIS_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

// ?mois=2026-09. Toute valeur absente, invalide ou hors de 2000-2100 retombe sur le mois courant.
export function parseMois(valeur: unknown, maintenant: Date = new Date()): Periode {
  const courant = { annee: maintenant.getUTCFullYear(), mois: maintenant.getUTCMonth() + 1 };
  if (typeof valeur !== "string") return courant;
  const m = valeur.match(MOIS_RE);
  if (!m) return courant;
  const annee = Number(m[1]);
  if (annee < 2000 || annee > 2100) return courant;
  return { annee, mois: Number(m[2]) };
}

export function versParam(p: Periode): string {
  return `${p.annee}-${String(p.mois).padStart(2, "0")}`;
}

export function moisSuivant(p: Periode): Periode {
  return p.mois === 12 ? { annee: p.annee + 1, mois: 1 } : { annee: p.annee, mois: p.mois + 1 };
}

export function moisPrecedent(p: Periode): Periode {
  return p.mois === 1 ? { annee: p.annee - 1, mois: 12 } : { annee: p.annee, mois: p.mois - 1 };
}

// [debut, fin[ du mois, en UTC.
export function bornesMois(p: Periode): { debut: Date; fin: Date } {
  const suivant = moisSuivant(p);
  return {
    debut: new Date(Date.UTC(p.annee, p.mois - 1, 1)),
    fin: new Date(Date.UTC(suivant.annee, suivant.mois - 1, 1)),
  };
}

const FORMAT_JOUR = new Intl.DateTimeFormat("en-CA", {
  timeZone: FUSEAU,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// "2026-09-21" : le jour d'un instant, dans le fuseau de l'espace.
export function cleJour(iso: string | Date): string {
  return FORMAT_JOUR.format(typeof iso === "string" ? new Date(iso) : iso);
}

export function libelleMois(p: Periode): string {
  const texte = new Date(Date.UTC(p.annee, p.mois - 1, 1)).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function libelleJour(cle: string): string {
  const [a, m, j] = cle.split("-").map(Number);
  const texte = new Date(Date.UTC(a, m - 1, j)).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function heure(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: FUSEAU });
}

// Semaines du mois, du lundi au dimanche. Chaque case est "AAAA-MM-JJ" ou null (jour d'un autre mois).
export function grilleMois(p: Periode): (string | null)[][] {
  const premier = new Date(Date.UTC(p.annee, p.mois - 1, 1));
  const nbJours = new Date(Date.UTC(p.annee, p.mois, 0)).getUTCDate();
  const decalage = (premier.getUTCDay() + 6) % 7; // lundi = 0
  const cases: (string | null)[] = Array(decalage).fill(null);
  for (let j = 1; j <= nbJours; j++) {
    cases.push(`${p.annee}-${String(p.mois).padStart(2, "0")}-${String(j).padStart(2, "0")}`);
  }
  while (cases.length % 7 !== 0) cases.push(null);
  const semaines: (string | null)[][] = [];
  for (let i = 0; i < cases.length; i += 7) semaines.push(cases.slice(i, i + 7));
  return semaines;
}

export function grouperParJour(evenements: EvenementCalendrier[]): Map<string, EvenementCalendrier[]> {
  const parJour = new Map<string, EvenementCalendrier[]>();
  [...evenements]
    .sort((a, b) => a.debut.localeCompare(b.debut))
    .forEach((e) => {
      const cle = cleJour(e.debut);
      parJour.set(cle, [...(parJour.get(cle) ?? []), e]);
    });
  return parJour;
}

// ---------------------------------------------------------------------------
// Fichier .ics (Google Agenda, Apple, Outlook) : sert de rappel sans e-mail, car l'application
// d'agenda de la personne declenche elle-meme l'alerte (30 minutes avant).
// ---------------------------------------------------------------------------

// Durees supposees : la base ne stocke que l'heure de debut.
const DUREE_MINUTES = { masterclass: 60, rdv: 30 } as const;

function echapper(texte: string): string {
  return texte
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function dateIcs(d: Date): string {
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

// Coupe a 75 caracteres avec une continuation (RFC 5545), sans couper un caractere multi-octets.
function plier(ligne: string): string {
  const morceaux: string[] = [];
  let reste = Array.from(ligne);
  let limite = 74;
  while (reste.length > limite) {
    morceaux.push(reste.slice(0, limite).join(""));
    reste = reste.slice(limite);
    limite = 73; // la ligne de continuation commence par une espace
  }
  morceaux.push(reste.join(""));
  return morceaux.join("\r\n ");
}

export function construireIcs(e: EvenementCalendrier, maintenant: Date = new Date()): string {
  const debut = new Date(e.debut);
  const fin = new Date(debut.getTime() + DUREE_MINUTES[e.type] * 60_000);
  const lignes = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Vivier Academies//Calendrier//FR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.type}-${e.id}@vivier-academies`,
    `DTSTAMP:${dateIcs(maintenant)}`,
    `DTSTART:${dateIcs(debut)}`,
    `DTEND:${dateIcs(fin)}`,
    `SUMMARY:${echapper(e.titre)}`,
  ];
  // Le lien vient de l'admin : seule une adresse http(s) sans espace ni saut de ligne est reprise,
  // pour qu'il ne puisse jamais ajouter de lignes au fichier.
  const lien = e.lien && /^https?:\/\/[^\s]+$/i.test(e.lien) ? e.lien : null;
  const description = [e.description, lien ? `Lien : ${lien}` : ""].filter(Boolean).join("\n");
  if (description) lignes.push(`DESCRIPTION:${echapper(description)}`);
  if (lien) lignes.push(`URL:${lien}`);
  lignes.push(
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    `DESCRIPTION:${echapper(e.titre)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  );
  return lignes.map(plier).join("\r\n") + "\r\n";
}
