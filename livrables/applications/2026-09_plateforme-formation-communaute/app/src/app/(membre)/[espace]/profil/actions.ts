"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { estErreurReseau, MESSAGE_RESEAU } from "@/lib/auth-erreurs";
import { normaliserLien } from "@/lib/lien-profil";

type EtatAction = { erreur: string | null; succes: boolean };

// React 19 vide un formulaire non controle apres chaque action, erreur comprise : sans renvoyer
// les valeurs saisies, un membre qui se trompe dans son lien perdrait aussi sa bio.
type ValeursInfos = { bio: string; ville: string; lien: string };
type EtatInfos = EtatAction & { valeurs?: ValeursInfos };

// Un membre ne peut modifier que son pseudo et sa photo : role et points sont
// verrouilles par la migration 0027 (privilege de colonne), pas seulement ici.
export async function modifierPseudo(_etat: EtatAction, formData: FormData): Promise<EtatAction> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const pseudo = String(formData.get("pseudo") ?? "").trim();
  if (pseudo.length < 2 || pseudo.length > 30) {
    return { erreur: "Le pseudo doit faire entre 2 et 30 caractères.", succes: false };
  }

  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) {
    return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté.", succes: false };
  }

  const { error } = await supabase.from("profils").update({ pseudo }).eq("id", userData.user.id);
  if (error) return { erreur: error.message, succes: false };

  revalidatePath(`/${espaceSlug}`, "layout");
  return { erreur: null, succes: true };
}

// Bio, ville et lien (migration 0034) : facultatifs, visibles des membres de l'espace. La base
// refuse aussi tout lien qui n'est pas en http(s) et toute valeur trop longue.
export async function modifierInfosProfil(_etat: EtatInfos, formData: FormData): Promise<EtatInfos> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const bio = String(formData.get("bio") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const lienSaisi = String(formData.get("lien") ?? "").trim();
  const valeurs = { bio, ville, lien: lienSaisi };

  if (bio.length > 300) return { erreur: "La bio est limitée à 300 caractères.", succes: false, valeurs };
  if (ville.length > 80) return { erreur: "La ville est limitée à 80 caractères.", succes: false, valeurs };
  const lien = normaliserLien(lienSaisi);
  if (lien.erreur) return { erreur: lien.erreur, succes: false, valeurs };

  const supabase = await createClient();
  const { data: userData, error: erreurAuth } = await supabase.auth.getUser();
  if (!userData.user) {
    return { erreur: estErreurReseau(erreurAuth) ? MESSAGE_RESEAU : "Non connecté.", succes: false, valeurs };
  }

  const { error } = await supabase
    .from("profils")
    .update({ bio: bio || null, ville: ville || null, lien: lien.lien })
    .eq("id", userData.user.id);
  if (error) return { erreur: "L'enregistrement a échoué, réessaie.", succes: false, valeurs };

  revalidatePath(`/${espaceSlug}`, "layout");
  return { erreur: null, succes: true, valeurs: { bio, ville, lien: lien.lien ?? "" } };
}
