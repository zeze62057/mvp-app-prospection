// Lien de profil (migration 0034) : normalisation et affichage. Fichier sans dependance, pour
// rester testable seul. La base impose deja http(s), sans espace, 200 caracteres maximum ;
// ce fichier donne un message clair a l'utilisateur et un lien propre.

export const LONGUEUR_MAX_LIEN = 200;

// Vide -> pas de lien. Sans schema ("exemple.com/moi") -> https:// ajoute. Tout autre schema
// que http ou https est refuse ("javascript:", "data:", "ftp:"...).
export function normaliserLien(brut: string): { lien: string | null; erreur: null } | { lien: null; erreur: string } {
  const saisie = brut.trim();
  if (!saisie) return { lien: null, erreur: null };
  if (/\s/.test(saisie)) return { lien: null, erreur: "Le lien ne doit pas contenir d'espace." };

  // Un schema explicite (lettres suivies de ":") autre que http(s) est refuse tel quel.
  // "site.com:8080" n'est pas un schema : il est suivi d'un chiffre, pas de "//".
  const schema = saisie.match(/^([a-z][a-z0-9+.-]*):(?!\d)/i);
  if (schema && !/^https?$/i.test(schema[1])) {
    return { lien: null, erreur: "Le lien doit commencer par http:// ou https://." };
  }

  const avecSchema = /^https?:\/\//i.test(saisie) ? saisie : `https://${saisie}`;
  let url: URL;
  try {
    url = new URL(avecSchema);
  } catch {
    return { lien: null, erreur: "Ce lien n'est pas valide." };
  }
  if ((url.protocol !== "https:" && url.protocol !== "http:") || !url.hostname.includes(".")) {
    return { lien: null, erreur: "Ce lien n'est pas valide." };
  }
  const lien = url.toString();
  if (lien.length > LONGUEUR_MAX_LIEN) {
    return { lien: null, erreur: `Le lien est limité à ${LONGUEUR_MAX_LIEN} caractères.` };
  }
  return { lien, erreur: null };
}

// Adresse affichable : le nom de domaine, sans "www." ni chemin.
export function domaineAffiche(lien: string): string {
  try {
    return new URL(lien).hostname.replace(/^www\./i, "");
  } catch {
    return lien;
  }
}

// Ne rend cliquable qu'un lien http(s) : garde-fou si une valeur inattendue arrivait de la base.
export function lienSur(lien: string | null | undefined): string | null {
  if (!lien) return null;
  try {
    const u = new URL(lien);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : null;
  } catch {
    return null;
  }
}
