"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-chatllow";
import { CATEGORIES_LIVRABLE, EXTENSIONS_AUTORISEES, STATUTS_PROJET, TAILLE_MAX_LIVRABLE } from "@/lib/admin-constantes";

const BUCKET = "chatllow-livrables";

// Toutes les actions verifient le role admin cote serveur, puis ecrivent avec la cle serveur : le client
// n'a aucun droit d'ecriture. Les comptes partages avec Vivier Academies (meme base d'utilisateurs) ne sont
// jamais supprimes ni modifies (mot de passe) depuis ici : voir estCompteChatllowSeul.

type Resultat = { erreur: string | null };

async function trouverUtilisateur(admin: ReturnType<typeof createAdminClient>, email: string) {
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  return (data?.users ?? []).find((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? null;
}

// Un compte est "propre a Chatllow" s'il a ete cree pour Chatllow (origine), n'a aucun profil Vivier et
// n'est pas administrateur. Seuls ceux-la peuvent etre supprimes ou voir leur mot de passe change ici.
async function estCompteChatllowSeul(admin: ReturnType<typeof createAdminClient>, id: string): Promise<boolean> {
  const { data } = await admin.auth.admin.getUserById(id);
  if (data.user?.user_metadata?.origine !== "chatllow") return false;
  const { data: profil } = await admin.from("profils").select("id").eq("id", id).maybeSingle();
  if (profil) return false;
  const { data: adm } = await admin.from("chatllow_admins").select("profil_id").eq("profil_id", id).maybeSingle();
  return !adm;
}

function revenir(chemin: string, type: "ok" | "erreur", message: string): never {
  revalidatePath(chemin);
  redirect(`${chemin}?${type}=${encodeURIComponent(message)}`);
}

// ---------- Clients ----------

export type EtatNouveauClient = { erreur: string | null; identifiants: { email: string; motDePasse: string | null; contact: string } | null };

export async function creerClient(_etat: EtatNouveauClient, formData: FormData): Promise<EtatNouveauClient> {
  await verifierAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const entreprise = String(formData.get("entreprise") ?? "").trim();
  const contact = String(formData.get("contact") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { erreur: "Adresse e-mail invalide.", identifiants: null };
  if (!entreprise || !contact) return { erreur: "L'entreprise et le contact sont obligatoires.", identifiants: null };
  if (entreprise.length > 120 || contact.length > 120) return { erreur: "Entreprise et contact : 120 caractères maximum.", identifiants: null };

  const admin = createAdminClient();
  const existant = await trouverUtilisateur(admin, email);
  if (existant) {
    const { data: deja } = await admin.from("chatllow_clients").select("profil_id").eq("profil_id", existant.id).maybeSingle();
    if (deja) return { erreur: "Ce compte est déjà client Chatllow.", identifiants: null };
    // Compte existant (par exemple un membre Vivier) : on ouvre l'acces sans toucher a son mot de passe.
    const { error } = await admin.from("chatllow_clients").insert({ profil_id: existant.id, entreprise, contact });
    if (error) return { erreur: "Création impossible.", identifiants: null };
    revalidatePath("/admin/clients");
    return { erreur: null, identifiants: { email, motDePasse: null, contact } };
  }

  const motDePasse = randomBytes(12).toString("base64url");
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: motDePasse,
    email_confirm: true,
    user_metadata: { origine: "chatllow" }, // le declencheur Vivier ne cree alors aucun profil
  });
  if (error || !data.user) return { erreur: "Création du compte impossible.", identifiants: null };
  const { error: e2 } = await admin.from("chatllow_clients").insert({ profil_id: data.user.id, entreprise, contact });
  if (e2) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { erreur: "Création impossible.", identifiants: null };
  }
  revalidatePath("/admin/clients");
  return { erreur: null, identifiants: { email, motDePasse, contact } };
}

export type EtatMotDePasse = { erreur: string | null; motDePasse: string | null };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function reinitialiserMotDePasse(clientId: string, _etat: EtatMotDePasse): Promise<EtatMotDePasse> {
  await verifierAdmin();
  const admin = createAdminClient();
  const { data: client } = await admin.from("chatllow_clients").select("profil_id").eq("profil_id", clientId).maybeSingle();
  if (!client) return { erreur: "Client introuvable.", motDePasse: null };
  if (!(await estCompteChatllowSeul(admin, clientId))) {
    return { erreur: "Ce compte est partagé avec Vivier Academies ou administrateur : son mot de passe se change depuis Vivier.", motDePasse: null };
  }
  const motDePasse = randomBytes(12).toString("base64url");
  const { error } = await admin.auth.admin.updateUserById(clientId, { password: motDePasse });
  if (error) return { erreur: "Réinitialisation impossible.", motDePasse: null };
  return { erreur: null, motDePasse };
}

export async function supprimerClient(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("client_id") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "").trim().toLowerCase();
  const admin = createAdminClient();
  const { data: client } = await admin.from("chatllow_clients").select("profil_id, entreprise").eq("profil_id", id).maybeSingle();
  if (!client) revenir("/admin/clients", "erreur", "Client introuvable.");
  if (confirmation !== client.entreprise.trim().toLowerCase()) {
    revenir(`/admin/clients/${id}`, "erreur", "Confirmation incorrecte : tapez exactement le nom de l'entreprise.");
  }

  const supprimerCompte = await estCompteChatllowSeul(admin, id);
  const { data: fichiers } = await admin.storage.from(BUCKET).list(id, { limit: 1000 });
  if (fichiers && fichiers.length > 0) await admin.storage.from(BUCKET).remove(fichiers.map((f) => `${id}/${f.name}`));

  if (supprimerCompte) {
    await admin.auth.admin.deleteUser(id); // la suppression du compte emporte projets, documents et messages
  } else {
    await admin.from("chatllow_clients").delete().eq("profil_id", id); // le compte reste (partage avec Vivier)
  }
  revenir(
    "/admin/clients",
    "ok",
    supprimerCompte ? `Client ${client.entreprise} supprimé.` : `Accès Chatllow retiré à ${client.entreprise}. Son compte est conservé car il est partagé avec Vivier ou administrateur.`
  );
}

// ---------- Projets ----------

export async function ajouterProjet(formData: FormData) {
  await verifierAdmin();
  const clientId = String(formData.get("client_id") ?? "");
  const chemin = `/admin/clients/${clientId}`;
  const titre = String(formData.get("titre") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const statut = String(formData.get("statut") ?? "en_cours");
  const avancement = Number(formData.get("avancement") ?? 0);
  if (!titre || titre.length > 200) revenir(chemin, "erreur", "Le titre est obligatoire (200 caractères maximum).");
  if (description.length > 600) revenir(chemin, "erreur", "Description : 600 caractères maximum.");
  if (!STATUTS_PROJET.some((s) => s.id === statut)) revenir(chemin, "erreur", "Statut invalide.");
  if (!Number.isInteger(avancement) || avancement < 0 || avancement > 100) revenir(chemin, "erreur", "L'avancement doit être un entier de 0 à 100.");

  const { error } = await createAdminClient()
    .from("chatllow_projets")
    .insert({ client_id: clientId, titre, description: description || null, statut, avancement });
  if (error) revenir(chemin, "erreur", "Ajout impossible.");
  revenir(chemin, "ok", "Projet ajouté.");
}

export async function modifierProjet(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("projet_id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const chemin = `/admin/clients/${clientId}`;
  const statut = String(formData.get("statut") ?? "");
  const avancement = Number(formData.get("avancement") ?? 0);
  if (!STATUTS_PROJET.some((s) => s.id === statut)) revenir(chemin, "erreur", "Statut invalide.");
  if (!Number.isInteger(avancement) || avancement < 0 || avancement > 100) revenir(chemin, "erreur", "L'avancement doit être un entier de 0 à 100.");
  const { error } = await createAdminClient().from("chatllow_projets").update({ statut, avancement }).eq("id", id).eq("client_id", clientId);
  if (error) revenir(chemin, "erreur", "Modification impossible.");
  revenir(chemin, "ok", "Projet mis à jour.");
}

export async function supprimerProjet(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("projet_id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  await createAdminClient().from("chatllow_projets").delete().eq("id", id).eq("client_id", clientId);
  revenir(`/admin/clients/${clientId}`, "ok", "Projet supprimé.");
}

// ---------- Livrables ----------

export type EnvoiPrepare = { erreur: string | null; chemin: string | null; jeton: string | null };

// Etape 1 : le serveur valide et fournit un lien d'envoi temporaire. Le navigateur envoie ensuite le fichier
// directement au stockage prive (pas de limite de 4,5 Mo du serveur).
export async function preparerEnvoi(clientId: string, nomFichier: string, tailleOctets: number): Promise<EnvoiPrepare> {
  await verifierAdmin();
  const admin = createAdminClient();
  const { data: client } = await admin.from("chatllow_clients").select("profil_id").eq("profil_id", clientId).maybeSingle();
  if (!client) return { erreur: "Client introuvable.", chemin: null, jeton: null };
  const extension = nomFichier.split(".").pop()?.toLowerCase() ?? "";
  if (!EXTENSIONS_AUTORISEES.includes(extension)) {
    return { erreur: `Format non accepté (${EXTENSIONS_AUTORISEES.join(", ")}).`, chemin: null, jeton: null };
  }
  if (!Number.isFinite(tailleOctets) || tailleOctets <= 0 || tailleOctets > TAILLE_MAX_LIVRABLE) {
    return { erreur: "Le fichier doit faire 50 Mo au maximum.", chemin: null, jeton: null };
  }
  const nomSur = nomFichier.normalize("NFD").replace(/\p{M}/gu, "").replace(/[^\w.-]+/g, "_").slice(-100);
  const chemin = `${clientId}/${Date.now()}-${nomSur}`;
  const { data, error } = await admin.storage.from(BUCKET).createSignedUploadUrl(chemin);
  if (error || !data) return { erreur: "Envoi impossible pour le moment.", chemin: null, jeton: null };
  return { erreur: null, chemin, jeton: data.token };
}

// Etape 2 : une fois le fichier envoye, on verifie qu'il existe vraiment avant d'enregistrer la ligne.
export async function enregistrerLivrable(input: {
  clientId: string;
  categorie: string;
  titre: string;
  description: string;
  chemin: string;
}): Promise<Resultat> {
  await verifierAdmin();
  const titre = input.titre.trim();
  const description = input.description.trim();
  if (!titre || titre.length > 200) return { erreur: "Le titre est obligatoire (200 caractères maximum)." };
  if (description.length > 600) return { erreur: "Description : 600 caractères maximum." };
  if (!CATEGORIES_LIVRABLE.some((c) => c.id === input.categorie)) return { erreur: "Catégorie invalide." };
  if (!input.chemin.startsWith(`${input.clientId}/`)) return { erreur: "Chemin de fichier invalide." };

  const admin = createAdminClient();
  const nom = input.chemin.slice(input.clientId.length + 1);
  const { data: fichiers } = await admin.storage.from(BUCKET).list(input.clientId, { limit: 1000, search: nom });
  const fichier = (fichiers ?? []).find((f) => f.name === nom);
  if (!fichier) return { erreur: "Le fichier n'a pas été reçu. Réessayez." };

  const { error } = await admin.from("chatllow_livrables").insert({
    client_id: input.clientId,
    categorie: input.categorie,
    titre,
    description: description || null,
    fichier_path: input.chemin,
    taille_octets: (fichier.metadata as { size?: number } | null)?.size ?? null,
  });
  if (error) return { erreur: "Enregistrement impossible." };
  revalidatePath(`/admin/clients/${input.clientId}`);
  return { erreur: null };
}

export async function supprimerLivrable(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("livrable_id") ?? "");
  const clientId = String(formData.get("client_id") ?? "");
  const admin = createAdminClient();
  const { data: livrable } = await admin.from("chatllow_livrables").select("fichier_path").eq("id", id).eq("client_id", clientId).maybeSingle();
  if (livrable?.fichier_path) await admin.storage.from(BUCKET).remove([livrable.fichier_path]);
  await admin.from("chatllow_livrables").delete().eq("id", id).eq("client_id", clientId);
  revenir(`/admin/clients/${clientId}`, "ok", "Document supprimé.");
}
