"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-guard";

// Gestion du programme (modules et sections) d'un espace. Chaque action verifie le role admin
// puis ecrit avec le client admin. Les formulaires n'ont pas de JavaScript : le resultat revient
// par l'URL (?ok=... ou ?erreur=...), sauf l'editeur de lecon qui renvoie son etat.

const TITRE_MAX = 120;
const CONTENU_MAX = 100000;

function retour(espaceId: string, type: "ok" | "erreur", message: string, section?: string): never {
  const params = new URLSearchParams({ espace: espaceId, [type]: message });
  if (section) params.set("section", section);
  redirect(`/admin/programme?${params.toString()}`);
}

function titreValide(brut: FormDataEntryValue | null): string | null {
  const t = String(brut ?? "").replace(/\s+/g, " ").trim();
  return t.length >= 2 && t.length <= TITRE_MAX ? t : null;
}

// Echange l'ordre de deux lignes sous une contrainte d'unicite : une valeur temporaire evite le
// conflit. ponytail: trois ecritures sans transaction, un echec au milieu laisserait un ordre
// temporaire (100000+), visible et corrigeable en redeplacant ; passer a une fonction SQL si besoin.
async function echangerOrdre(
  table: "modules" | "sections",
  a: { id: string; ordre: number },
  b: { id: string; ordre: number }
) {
  const admin = createAdminClient();
  await admin.from(table).update({ ordre: 100000 + a.ordre }).eq("id", a.id);
  await admin.from(table).update({ ordre: a.ordre }).eq("id", b.id);
  await admin.from(table).update({ ordre: b.ordre }).eq("id", a.id);
}

// ---- Modules ---------------------------------------------------------------------------------

export async function creerModule(formData: FormData) {
  await verifierAdmin();
  const espaceId = String(formData.get("espace_id") ?? "");
  const titre = titreValide(formData.get("titre"));
  if (!titre) retour(espaceId, "erreur", `Le titre du module doit faire entre 2 et ${TITRE_MAX} caractères.`);

  const admin = createAdminClient();
  const { data: dernier } = await admin
    .from("modules")
    .select("ordre")
    .eq("espace_id", espaceId)
    .order("ordre", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { error } = await admin.from("modules").insert({ espace_id: espaceId, titre, ordre: (dernier?.ordre ?? 0) + 1 });
  if (error) retour(espaceId, "erreur", "Création du module impossible.");
  retour(espaceId, "ok", "Module créé.");
}

export async function renommerModule(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("module_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const titre = titreValide(formData.get("titre"));
  if (!titre) retour(espaceId, "erreur", `Le titre doit faire entre 2 et ${TITRE_MAX} caractères.`);
  await createAdminClient().from("modules").update({ titre }).eq("id", id);
  retour(espaceId, "ok", "Module renommé.");
}

export async function deplacerModule(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("module_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const sens = String(formData.get("sens") ?? "");
  const admin = createAdminClient();
  const { data: courant } = await admin.from("modules").select("id, ordre").eq("id", id).maybeSingle();
  if (!courant) retour(espaceId, "erreur", "Module introuvable.");
  const requete = admin.from("modules").select("id, ordre").eq("espace_id", espaceId);
  const { data: voisin } =
    sens === "haut"
      ? await requete.lt("ordre", courant.ordre).order("ordre", { ascending: false }).limit(1).maybeSingle()
      : await requete.gt("ordre", courant.ordre).order("ordre", { ascending: true }).limit(1).maybeSingle();
  if (voisin) await echangerOrdre("modules", courant, voisin);
  retour(espaceId, "ok", "Ordre modifié.");
}

export async function supprimerModule(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("module_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const admin = createAdminClient();

  // Refuse si des eleves ont deja avance ou rendu un devoir dans ce module : la suppression
  // effacerait leur progression et leurs notes.
  const { data: sections } = await admin.from("sections").select("id").eq("module_id", id);
  const idsSections = (sections ?? []).map((s) => s.id as string);
  const { count: terminees } = idsSections.length
    ? await admin.from("progression").select("*", { count: "exact", head: true }).in("section_id", idsSections)
    : { count: 0 };
  const { data: devoirs } = await admin.from("devoirs").select("id").eq("module_id", id);
  const idsDevoirs = (devoirs ?? []).map((d) => d.id as string);
  const { count: remises } = idsDevoirs.length
    ? await admin.from("devoirs_remises").select("*", { count: "exact", head: true }).in("devoir_id", idsDevoirs)
    : { count: 0 };
  if ((terminees ?? 0) > 0 || (remises ?? 0) > 0) {
    retour(
      espaceId,
      "erreur",
      `Suppression refusée : ${terminees ?? 0} section(s) terminée(s) et ${remises ?? 0} devoir(s) rendu(s) par des élèves dans ce module.`
    );
  }

  const { data: avecVideo } = idsSections.length
    ? await admin.from("sections").select("video_path").in("id", idsSections).not("video_path", "is", null)
    : { data: [] };
  const chemins = (avecVideo ?? []).map((s) => s.video_path as string);
  const { error } = await admin.from("modules").delete().eq("id", id);
  if (error) retour(espaceId, "erreur", "Suppression impossible.");
  if (chemins.length) await admin.storage.from("videos-cours").remove(chemins);
  retour(espaceId, "ok", "Module supprimé.");
}

// ---- Sections --------------------------------------------------------------------------------

export async function creerSection(formData: FormData) {
  await verifierAdmin();
  const moduleId = String(formData.get("module_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const titre = titreValide(formData.get("titre"));
  if (!titre) retour(espaceId, "erreur", `Le titre de la section doit faire entre 2 et ${TITRE_MAX} caractères.`);

  const admin = createAdminClient();
  const { data: derniere } = await admin
    .from("sections")
    .select("ordre")
    .eq("module_id", moduleId)
    .order("ordre", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data: creee, error } = await admin
    .from("sections")
    .insert({ module_id: moduleId, titre, ordre: (derniere?.ordre ?? 0) + 1 })
    .select("id")
    .single();
  if (error || !creee) retour(espaceId, "erreur", "Création de la section impossible.");
  retour(espaceId, "ok", "Section créée : écris sa leçon ci-dessous.", creee.id as string);
}

export async function deplacerSection(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("section_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const sens = String(formData.get("sens") ?? "");
  const admin = createAdminClient();
  const { data: courante } = await admin.from("sections").select("id, ordre, module_id").eq("id", id).maybeSingle();
  if (!courante) retour(espaceId, "erreur", "Section introuvable.");
  const requete = admin.from("sections").select("id, ordre").eq("module_id", courante.module_id);
  const { data: voisine } =
    sens === "haut"
      ? await requete.lt("ordre", courante.ordre).order("ordre", { ascending: false }).limit(1).maybeSingle()
      : await requete.gt("ordre", courante.ordre).order("ordre", { ascending: true }).limit(1).maybeSingle();
  if (voisine) await echangerOrdre("sections", courante, voisine);
  retour(espaceId, "ok", "Ordre modifié.");
}

export async function supprimerSection(formData: FormData) {
  await verifierAdmin();
  const id = String(formData.get("section_id") ?? "");
  const espaceId = String(formData.get("espace_id") ?? "");
  const admin = createAdminClient();
  const { count: terminees } = await admin
    .from("progression")
    .select("*", { count: "exact", head: true })
    .eq("section_id", id);
  if ((terminees ?? 0) > 0) {
    retour(espaceId, "erreur", `Suppression refusée : ${terminees} élève(s) ont déjà terminé cette section.`);
  }
  const { data: section } = await admin.from("sections").select("video_path").eq("id", id).maybeSingle();
  const { error } = await admin.from("sections").delete().eq("id", id);
  if (error) retour(espaceId, "erreur", "Suppression impossible.");
  if (section?.video_path) await admin.storage.from("videos-cours").remove([section.video_path as string]);
  retour(espaceId, "ok", "Section supprimée.");
}

// Enregistre le titre et le texte Markdown d'une lecon. Renvoie un etat (pas de redirection) pour
// que l'editeur garde le texte affiche. Le HTML n'est jamais interprete a l'affichage.
export async function enregistrerLecon(
  _etat: { erreur: string | null; succes: boolean },
  formData: FormData
): Promise<{ erreur: string | null; succes: boolean }> {
  await verifierAdmin();
  const id = String(formData.get("section_id") ?? "");
  const titre = titreValide(formData.get("titre"));
  const contenu = String(formData.get("contenu") ?? "");
  if (!titre) return { erreur: `Le titre doit faire entre 2 et ${TITRE_MAX} caractères.`, succes: false };
  if (contenu.length > CONTENU_MAX) return { erreur: `Leçon trop longue (${CONTENU_MAX} caractères maximum).`, succes: false };

  const { error } = await createAdminClient()
    .from("sections")
    .update({ titre, contenu: contenu.trim() === "" ? null : contenu })
    .eq("id", id);
  if (error) return { erreur: "Enregistrement impossible.", succes: false };
  return { erreur: null, succes: true };
}
