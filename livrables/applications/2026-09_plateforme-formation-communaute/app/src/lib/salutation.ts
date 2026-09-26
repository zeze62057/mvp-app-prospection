// Salutation et date du jour a l'heure de Conakry (fuseau fixe, sans changement d'heure), pas celle du serveur.
const FUSEAU = "Africa/Conakry";

export function salutationConakry(date: Date = new Date()): string {
  // formatToParts isole le chiffre : toLocaleString renvoie "06 h" en francais, ce qui donnerait NaN.
  const heure = Number(
    new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hourCycle: "h23", timeZone: FUSEAU })
      .formatToParts(date)
      .find((p) => p.type === "hour")?.value
  );
  if (heure >= 5 && heure < 12) return "Bonjour";
  if (heure >= 12 && heure < 18) return "Bon après-midi";
  return "Bonsoir";
}

export function dateDuJourConakry(date: Date = new Date()): string {
  return date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: FUSEAU });
}
