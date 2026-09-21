"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-guard";
import { extraireIdYoutube } from "@/lib/youtube";
import {
  NIVEAUX_PAR_DEFAUT,
  NIVEAU_MAX,
  libelleDuNiveau,
  lireNiveauxSaisis,
  niveauMaximum,
  type NiveauConfig,
} from "@/lib/niveaux";

export async function approuverAdhesion(adhesionId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin
    .from("adhesions")
    .update({ statut: "approuve", traite_at: new Date().toISOString() })
    .eq("id", adhesionId);
  revalidatePath("/admin");
}

export async function refuserAdhesion(adhesionId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin
    .from("adhesions")
    .update({ statut: "refuse", traite_at: new Date().toISOString() })
    .eq("id", adhesionId);
  revalidatePath("/admin");
}

// Filet de securite : accorde l'acces payant a la main, pour un eleve qui a
// paye autrement ou si le tunnel Chariow est indisponible. Le paiement
// Mobile Money reste le chemin normal (voir CADRAGE.md section 6), cet
// outil ne le remplace pas.
export async function accorderAccesPayant(_etat: { erreur: string | null }, formData: FormData) {
  await verifierAdmin();
  const email = String(formData.get("email") ?? "").trim();
  const espaceId = String(formData.get("espace_id") ?? "");

  const admin = createAdminClient();
  const { data: usersData, error: erreurUsers } = await admin.auth.admin.listUsers();
  if (erreurUsers) return { erreur: erreurUsers.message };

  const utilisateur = usersData.users.find((u) => u.email === email);
  if (!utilisateur) return { erreur: "Aucun compte avec cet email." };

  const { error } = await admin
    .from("acces_payant")
    .upsert(
      { profil_id: utilisateur.id, espace_id: espaceId, actif: true },
      { onConflict: "profil_id,espace_id" }
    );

  if (error) return { erreur: error.message };

  revalidatePath("/admin");
  return { erreur: null };
}

// Prix modifiable par admin, jamais code en dur (voir CADRAGE.md section 6).
// La colonne espaces.prix existe deja et est deja lue dynamiquement par le
// tunnel de paiement : cette action ne fait qu'exposer une interface pour
// la modifier, sans toucher au tunnel ni au webhook.
export async function modifierPrixEspace(
  espaceId: string,
  _etat: { erreur: string | null },
  formData: FormData
) {
  await verifierAdmin();

  const prix = Number(formData.get("prix"));
  if (!Number.isInteger(prix) || prix <= 0) {
    return { erreur: "Le prix doit etre un nombre entier positif." };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("espaces").update({ prix }).eq("id", espaceId);
  if (error) return { erreur: error.message };

  revalidatePath("/admin");
  return { erreur: null };
}

// Reglages de communaute d'un espace (voir CADRAGE.md section 9 et migration
// 0024) : fenetre d'activite, compteur public de la vitrine, message d'accueil.
// Un message vide supprime le message d'accueil de l'espace.
export async function modifierParametresCommunaute(
  espaceId: string,
  _etat: { erreur: string | null; succes: boolean },
  formData: FormData
) {
  await verifierAdmin();

  const periode = Number(formData.get("periode_activite_jours"));
  if (!Number.isInteger(periode) || periode < 1 || periode > 365) {
    return { erreur: "La periode d'activite doit etre un nombre de jours entre 1 et 365.", succes: false };
  }
  const afficherCompteur = formData.get("afficher_compteur_public") === "on";
  const message = String(formData.get("message_accueil") ?? "").trim();
  if (message.length > 2000) {
    return { erreur: "Le message d'accueil est limite a 2000 caracteres.", succes: false };
  }

  const admin = createAdminClient();

  const { data: espace, error: erreurEspace } = await admin
    .from("espaces")
    .update({ periode_activite_jours: periode, afficher_compteur_public: afficherCompteur })
    .eq("id", espaceId)
    .select("slug")
    .maybeSingle();
  if (erreurEspace) return { erreur: erreurEspace.message, succes: false };
  if (!espace) return { erreur: "Espace introuvable.", succes: false };

  const { error: erreurMessage } = message
    ? await admin
        .from("messages_accueil")
        .upsert({ espace_id: espaceId, texte: message, updated_at: new Date().toISOString() })
    : await admin.from("messages_accueil").delete().eq("espace_id", espaceId);
  if (erreurMessage) return { erreur: erreurMessage.message, succes: false };

  revalidatePath("/admin");
  revalidatePath(`/${espace.slug}`);
  revalidatePath(`/${espace.slug}/communaute`);
  revalidatePath(`/${espace.slug}/communaute-payante`);
  return { erreur: null, succes: true };
}

// Page "A propos" d'un espace (migration 0035) : une video YouTube et un texte, lisibles des
// membres. On ne garde que l'identifiant de la video. Video et texte vides : la page est retiree.
// Les valeurs saisies sont renvoyees : React 19 vide le formulaire apres chaque action.
export async function modifierPresentationEspace(
  espaceId: string,
  _etat: { erreur: string | null; succes: boolean; valeurs?: { video: string; description: string } },
  formData: FormData
) {
  await verifierAdmin();

  const video = String(formData.get("video") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const valeurs = { video, description };

  if (description.length > 4000) {
    return { erreur: "Le texte est limite a 4000 caracteres.", succes: false, valeurs };
  }
  const idVideo = video ? extraireIdYoutube(video) : null;
  if (video && !idVideo) {
    return {
      erreur: "Video non reconnue : colle une adresse YouTube (youtube.com/watch?v=..., youtu.be/...) ou l'identifiant.",
      succes: false,
      valeurs,
    };
  }

  const admin = createAdminClient();
  const { data: espace } = await admin.from("espaces").select("slug").eq("id", espaceId).maybeSingle();
  if (!espace) return { erreur: "Espace introuvable.", succes: false, valeurs };

  const { error } =
    idVideo || description
      ? await admin.from("presentations_espace").upsert({
          espace_id: espaceId,
          video_youtube_id: idVideo,
          description,
          updated_at: new Date().toISOString(),
        })
      : await admin.from("presentations_espace").delete().eq("espace_id", espaceId);
  if (error) return { erreur: error.message, succes: false, valeurs };

  revalidatePath("/admin");
  revalidatePath(`/${espace.slug}/a-propos`);
  return {
    erreur: null,
    succes: true,
    valeurs: { video: idVideo ? `https://youtu.be/${idVideo}` : "", description },
  };
}

// Niveaux d'un espace (migration 0036) : reglages, ou valeurs par defaut s'il n'y en a aucun.
async function niveauxDeLEspace(
  admin: ReturnType<typeof createAdminClient>,
  espaceId: string
): Promise<NiveauConfig[]> {
  const { data } = await admin
    .from("niveaux_espace")
    .select("niveau, libelle, points_requis")
    .eq("espace_id", espaceId)
    .order("niveau");
  return data && data.length > 0 ? (data as NiveauConfig[]) : NIVEAUX_PAR_DEFAUT;
}

// Refuse de supprimer un niveau qu'une masterclass exige encore : elle deviendrait invisible pour
// tous les membres (sauf les admins).
async function masterclassBloquee(
  admin: ReturnType<typeof createAdminClient>,
  espaceId: string,
  nouveauMax: number,
  niveaux: NiveauConfig[]
): Promise<string | null> {
  const { data } = await admin
    .from("masterclasses")
    .select("titre, niveau_min")
    .eq("espace_id", espaceId)
    .gt("niveau_min", nouveauMax)
    .limit(1);
  const m = data?.[0];
  if (!m) return null;
  return `La masterclass « ${m.titre} » exige le niveau ${m.niveau_min} (${libelleDuNiveau(m.niveau_min, niveaux)}), qui n'existerait plus. Baisse d'abord son niveau minimum.`;
}

export async function enregistrerNiveaux(
  espaceId: string,
  _etat: { erreur: string | null; succes: boolean; valeurs?: Record<string, string> },
  formData: FormData
) {
  await verifierAdmin();

  // La saisie est renvoyee telle quelle : React 19 vide le formulaire apres chaque action.
  const valeurs: Record<string, string> = {};
  for (let n = 1; n <= NIVEAU_MAX; n++) {
    valeurs[`libelle_${n}`] = String(formData.get(`libelle_${n}`) ?? "");
    valeurs[`points_${n}`] = String(formData.get(`points_${n}`) ?? "");
  }

  const lecture = lireNiveauxSaisis((cle) => valeurs[cle] ?? "");
  if (lecture.niveaux === null) return { erreur: lecture.erreur, succes: false, valeurs };

  const admin = createAdminClient();
  const { data: espace } = await admin.from("espaces").select("slug").eq("id", espaceId).maybeSingle();
  if (!espace) return { erreur: "Espace introuvable.", succes: false, valeurs };

  const bloquee = await masterclassBloquee(
    admin,
    espaceId,
    niveauMaximum(lecture.niveaux),
    await niveauxDeLEspace(admin, espaceId)
  );
  if (bloquee) return { erreur: bloquee, succes: false, valeurs };

  const { error } = await admin
    .from("niveaux_espace")
    .upsert(lecture.niveaux.map((n) => ({ espace_id: espaceId, ...n })), { onConflict: "espace_id,niveau" });
  if (error) return { erreur: error.message, succes: false, valeurs };

  // Les niveaux au-dela du dernier saisi n'existent plus.
  const { error: erreurSuppression } = await admin
    .from("niveaux_espace")
    .delete()
    .eq("espace_id", espaceId)
    .gt("niveau", niveauMaximum(lecture.niveaux));
  if (erreurSuppression) return { erreur: erreurSuppression.message, succes: false, valeurs };

  revalidatePath("/admin");
  revalidatePath(`/${espace.slug}`, "layout");
  return { erreur: null, succes: true, valeurs: undefined };
}

export async function reinitialiserNiveaux(espaceId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  const { data: espace } = await admin.from("espaces").select("slug").eq("id", espaceId).maybeSingle();
  if (!espace) return;

  // Les niveaux par defaut vont jusqu'a 5 : meme protection que pour un reglage.
  const bloquee = await masterclassBloquee(
    admin,
    espaceId,
    niveauMaximum(NIVEAUX_PAR_DEFAUT),
    await niveauxDeLEspace(admin, espaceId)
  );
  if (bloquee) return;

  await admin.from("niveaux_espace").delete().eq("espace_id", espaceId);
  revalidatePath("/admin");
  revalidatePath(`/${espace.slug}`, "layout");
}

// Questions posees a qui demande a rejoindre la communaute gratuite (migration 0037) : 3 au plus par
// espace, une par ligne. Une ligne vide retire la question, et supprime aussi les reponses deja
// recues a cette question. La saisie est renvoyee telle quelle (React 19 vide le formulaire).
export async function enregistrerQuestionsAdhesion(
  espaceId: string,
  _etat: { erreur: string | null; succes: boolean; valeurs?: string[] },
  formData: FormData
) {
  await verifierAdmin();

  const valeurs = [1, 2, 3].map((n) => String(formData.get(`question_${n}`) ?? ""));
  const libelles = valeurs.map((v) => v.trim().replace(/\s+/g, " "));
  for (let i = 0; i < 3; i++) {
    if (libelles[i] && (libelles[i].length < 3 || libelles[i].length > 200)) {
      return { erreur: `La question ${i + 1} doit faire entre 3 et 200 caractères.`, succes: false, valeurs };
    }
  }

  const admin = createAdminClient();
  const { data: espace } = await admin.from("espaces").select("slug").eq("id", espaceId).maybeSingle();
  if (!espace) return { erreur: "Espace introuvable.", succes: false, valeurs };

  for (let i = 0; i < 3; i++) {
    const ordre = i + 1;
    const { error } = libelles[i]
      ? await admin
          .from("questions_adhesion")
          .upsert({ espace_id: espaceId, ordre, libelle: libelles[i] }, { onConflict: "espace_id,ordre" })
      : await admin.from("questions_adhesion").delete().eq("espace_id", espaceId).eq("ordre", ordre);
    if (error) return { erreur: error.message, succes: false, valeurs };
  }

  revalidatePath("/admin");
  revalidatePath(`/${espace.slug}`, "layout");
  return { erreur: null, succes: true, valeurs: undefined };
}

// Categories du fil de communaute (voir migration 0026) : propres a chaque espace,
// avec un emoji. Supprimer une categorie ne supprime aucun post : ils redeviennent
// "sans categorie" (on delete set null).
export async function creerCategoriePost(
  _etat: { erreur: string | null; succes: boolean },
  formData: FormData
) {
  await verifierAdmin();

  const espaceId = String(formData.get("espace_id") ?? "");
  const libelle = String(formData.get("libelle") ?? "").trim();
  const emoji = String(formData.get("emoji") ?? "").trim();

  if (!espaceId || !libelle) return { erreur: "Espace et nom sont requis.", succes: false };
  if (libelle.length > 40) return { erreur: "Le nom est limité à 40 caractères.", succes: false };
  if (emoji.length > 8) return { erreur: "Un seul emoji suffit.", succes: false };

  const admin = createAdminClient();
  const { data: derniere } = await admin
    .from("categories_posts")
    .select("ordre")
    .eq("espace_id", espaceId)
    .order("ordre", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await admin
    .from("categories_posts")
    .insert({ espace_id: espaceId, libelle, emoji, ordre: (derniere?.ordre ?? 0) + 1 });
  if (error) {
    if (error.code === "23505") return { erreur: "Cette catégorie existe déjà.", succes: false };
    return { erreur: error.message, succes: false };
  }

  revalidatePath("/admin");
  return { erreur: null, succes: true };
}

export async function supprimerCategoriePost(categorieId: string) {
  await verifierAdmin();
  await createAdminClient().from("categories_posts").delete().eq("id", categorieId);
  revalidatePath("/admin");
}

// Moderation des signalements (migration 0031). L'admin lit les signalements avec le
// service_role : pour un message prive, il ne voit que l'extrait copie au moment du
// signalement, jamais la conversation. Il ne peut pas supprimer un message prive.
export async function traiterSignalement(signalementId: string) {
  await verifierAdmin();
  await createAdminClient()
    .from("signalements")
    .update({ statut: "traite", traite_at: new Date().toISOString() })
    .eq("id", signalementId);
  revalidatePath("/admin");
}

// Supprime le post ou le commentaire signale (et l'image du post), puis marque traites
// tous les signalements portant sur ce meme contenu.
export async function supprimerContenuSignale(signalementId: string) {
  await verifierAdmin();
  const admin = createAdminClient();

  const { data: s } = await admin
    .from("signalements")
    .select("type, cible_id")
    .eq("id", signalementId)
    .maybeSingle();
  if (!s || (s.type !== "post" && s.type !== "commentaire")) return;

  if (s.type === "post") {
    const { data: post } = await admin.from("posts").select("image_path").eq("id", s.cible_id).maybeSingle();
    if (post?.image_path) await admin.storage.from("posts-images").remove([post.image_path]);
    await admin.from("posts").delete().eq("id", s.cible_id);
  } else {
    await admin.from("commentaires").delete().eq("id", s.cible_id);
  }

  await admin
    .from("signalements")
    .update({ statut: "traite", traite_at: new Date().toISOString() })
    .eq("type", s.type)
    .eq("cible_id", s.cible_id);
  revalidatePath("/admin");
}

function slugifier(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Outil admin "creer une nouvelle formation" en libre-service (voir
// CADRAGE.md section 7) : cree seulement la ligne espaces (mecanisme
// generique dont la communaute gratuite/payante et la progression
// dependent deja partout par espace_id, voir CADRAGE.md section 0). Le
// contenu de cours (modules/sections) reste hors perimetre, ajoute a la
// main comme pour Vivier IA.
export async function creerEspace(
  _etat: { erreur: string | null; succes: boolean },
  formData: FormData
) {
  await verifierAdmin();

  const nom = String(formData.get("nom") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const prix = Number(formData.get("prix"));
  const devise = String(formData.get("devise") ?? "GNF").trim();

  if (!nom) return { erreur: "Le nom est requis.", succes: false };
  if (!Number.isInteger(prix) || prix <= 0) {
    return { erreur: "Le prix doit etre un nombre entier positif.", succes: false };
  }

  const slug = slugifier(nom);
  if (!slug) {
    return { erreur: "Impossible de generer un identifiant a partir de ce nom.", succes: false };
  }

  const admin = createAdminClient();

  const { data: existant } = await admin
    .from("espaces")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existant) {
    return { erreur: `Un espace avec l'identifiant "${slug}" existe deja.`, succes: false };
  }

  const { error } = await admin
    .from("espaces")
    .insert({ slug, nom, tagline, prix, devise, actif: true });
  if (error) return { erreur: error.message, succes: false };

  revalidatePath("/admin");
  return { erreur: null, succes: true };
}

// Ajout d'un outil (lien externe) dans Ressources (voir migration 0011).
// Le fichier telechargeable, lui, passe par la route /api/admin/ressource-fichier
// (upload binaire, pas adapte a une server action classique).
export async function ajouterLienRessource(
  _etat: { erreur: string | null; succes: boolean },
  formData: FormData
) {
  await verifierAdmin();

  const espaceId = String(formData.get("espace_id") ?? "");
  const titre = String(formData.get("titre") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();

  if (!espaceId || !titre || !url) {
    return { erreur: "Espace, titre et URL sont requis.", succes: false };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("ressources")
    .insert({ espace_id: espaceId, type: "lien", titre, description, url });
  if (error) return { erreur: error.message, succes: false };

  revalidatePath("/admin");
  return { erreur: null, succes: true };
}

// Creation d'un evenement masterclass (voir migration 0012). Visible par
// la communaute gratuite une fois cree, inscription geree cote membre.
export async function creerMasterclass(
  _etat: { erreur: string | null; succes: boolean },
  formData: FormData
) {
  await verifierAdmin();

  const espaceId = String(formData.get("espace_id") ?? "");
  const titre = String(formData.get("titre") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const dateHeure = String(formData.get("date_heure") ?? "");
  const lien = String(formData.get("lien") ?? "").trim();
  const niveauMin = Number(String(formData.get("niveau_min") ?? "1"));

  if (!espaceId || !titre || !dateHeure || !lien) {
    return { erreur: "Espace, titre, date/heure et lien sont requis.", succes: false };
  }

  const date = new Date(dateHeure);
  if (Number.isNaN(date.getTime())) {
    return { erreur: "Date ou heure invalide.", succes: false };
  }

  if (!Number.isInteger(niveauMin) || niveauMin < 1 || niveauMin > NIVEAU_MAX) {
    return { erreur: "Le niveau minimum doit être un nombre de 1 à 9.", succes: false };
  }

  const admin = createAdminClient();
  // Un niveau que personne ne peut atteindre rendrait la masterclass invisible pour tous les membres.
  const niveaux = await niveauxDeLEspace(admin, espaceId);
  if (niveauMin > niveauMaximum(niveaux)) {
    return {
      erreur: `Cet espace n'a que ${niveauMaximum(niveaux)} niveaux : choisis un niveau minimum plus bas.`,
      succes: false,
    };
  }

  const { error } = await admin.from("masterclasses").insert({
    espace_id: espaceId,
    titre,
    description,
    date_heure: date.toISOString(),
    lien,
    niveau_min: niveauMin,
  });
  if (error) return { erreur: error.message, succes: false };

  revalidatePath("/admin");
  return { erreur: null, succes: true };
}

// Creation d'un creneau RDV (voir migration 0013). Visible par la
// communaute gratuite, reservation geree cote membre via les fonctions
// atomiques reserver_creneau/annuler_creneau.
export async function creerCreneauRdv(
  _etat: { erreur: string | null; succes: boolean },
  formData: FormData
) {
  await verifierAdmin();

  const espaceId = String(formData.get("espace_id") ?? "");
  const dateHeure = String(formData.get("date_heure") ?? "");
  const lien = String(formData.get("lien") ?? "").trim();

  if (!espaceId || !dateHeure || !lien) {
    return { erreur: "Espace, date/heure et lien sont requis.", succes: false };
  }

  const date = new Date(dateHeure);
  if (Number.isNaN(date.getTime())) {
    return { erreur: "Date ou heure invalide.", succes: false };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("creneaux_rdv")
    .insert({ espace_id: espaceId, date_heure: date.toISOString(), lien });
  if (error) return { erreur: error.message, succes: false };

  revalidatePath("/admin");
  return { erreur: null, succes: true };
}

// Validation des brouillons de contenu (voir migration 0015 et le skill
// .claude/skills/contenu-vivier-ia/). Jamais de publication automatique :
// un brouillon reste invisible des membres tant que ce chemin admin ne
// l'a pas explicitement publie.
export async function publierContenu(contenuId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin.from("contenus").update({ statut: "publie" }).eq("id", contenuId);
  revalidatePath("/admin");
}

export async function supprimerBrouillonContenu(contenuId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin.from("contenus").delete().eq("id", contenuId);
  revalidatePath("/admin");
}

export async function approuverExpert(candidatureId: string, profilId: string, espaceId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin
    .from("candidatures_expert")
    .update({ statut: "approuve" })
    .eq("id", candidatureId);
  await admin
    .from("acces_payant")
    .update({ est_expert: true })
    .eq("profil_id", profilId)
    .eq("espace_id", espaceId);
  revalidatePath("/admin");
}

export async function refuserExpert(candidatureId: string) {
  await verifierAdmin();
  const admin = createAdminClient();
  await admin.from("candidatures_expert").update({ statut: "refuse" }).eq("id", candidatureId);
  revalidatePath("/admin");
}
