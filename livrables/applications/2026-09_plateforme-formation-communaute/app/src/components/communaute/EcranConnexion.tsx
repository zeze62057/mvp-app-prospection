import { createAdminClient } from "@/lib/supabase/admin";
import { FormulaireAuth } from "./FormulaireAuth";

// Enveloppe serveur de l'ecran de connexion : lit les chiffres reels de l'espace (membres, modules,
// prochaine masterclass) pour les cartes flottantes. Aucun chiffre n'est invente : sans donnee, la
// carte correspondante n'est pas affichee.
export async function EcranConnexion({
  espace,
}: {
  espace: { id: string; slug: string; nom: string; afficher_compteur_public?: boolean | null };
}) {
  const admin = createAdminClient();
  const [{ data: adhesions, count }, { data: modules }, { data: masterclasses }] = await Promise.all([
    admin
      .from("adhesions")
      .select("profil_id", { count: "exact" })
      .eq("espace_id", espace.id)
      .eq("statut", "approuve")
      .limit(4),
    admin.from("modules").select("id, sections(id)").eq("espace_id", espace.id),
    admin
      .from("masterclasses")
      .select("titre, date_heure")
      .eq("espace_id", espace.id)
      .gte("date_heure", new Date().toISOString())
      .order("date_heure")
      .limit(1),
  ]);

  const nbModules = (modules ?? []).filter(
    (m) => ((m as unknown as { sections: unknown[] }).sections ?? []).length > 0
  ).length;
  const compteurVisible = espace.afficher_compteur_public !== false;
  const prochaine = (masterclasses ?? [])[0] as { titre: string; date_heure: string } | undefined;

  return (
    <FormulaireAuth
      espaceSlug={espace.slug}
      espaceNom={espace.nom}
      stats={{
        membres: compteurVisible ? (count ?? 0) : null,
        avatars: compteurVisible ? (adhesions ?? []).map((a) => a.profil_id as string) : [],
        modules: nbModules,
        prochaine: prochaine
          ? {
              titre: prochaine.titre,
              date: new Date(prochaine.date_heure).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                timeZone: "Africa/Conakry",
              }),
            }
          : null,
      }}
    />
  );
}
