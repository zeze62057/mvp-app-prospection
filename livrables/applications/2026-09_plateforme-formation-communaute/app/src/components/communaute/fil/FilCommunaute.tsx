import type { SupabaseClient } from "@supabase/supabase-js";
import { chargerCategories, chargerPostsFil } from "@/lib/fil";
import { urlsAvatars } from "@/lib/avatars";
import { nettoyerTerme } from "@/lib/recherche";
import type { ZonePost } from "@/types/membre";
import { BarreEcrire } from "./BarreEcrire";
import { BarreRecherche } from "./BarreRecherche";
import { CartePost } from "./CartePost";
import { PastillesCategories } from "./PastillesCategories";

// Fil de communaute, commun aux zones gratuite et payante : barre d'ecriture,
// pastilles de categories, cartes de posts. La zone ne change que le chemin, le
// texte d'invitation et l'option lead magnet.
export async function FilCommunaute({
  supabase,
  espace,
  zone,
  userId,
  auteurPseudo,
  estAdmin,
  categorieId,
  recherche = null,
}: {
  supabase: SupabaseClient;
  espace: { id: string; slug: string };
  zone: ZonePost;
  userId: string;
  auteurPseudo: string;
  estAdmin: boolean;
  categorieId: string | null;
  recherche?: string | null; // terme brut de l'URL (?q=), nettoye ici
}) {
  const base = `/${espace.slug}/${zone === "payante" ? "communaute-payante" : "communaute"}`;
  const terme = nettoyerTerme(recherche);

  const [categories, items, { data: moi }] = await Promise.all([
    chargerCategories(supabase, espace.id),
    chargerPostsFil({ supabase, espaceId: espace.id, userId, zone, categorieId, recherche: terme }),
    supabase.from("profils").select("id, avatar_path").eq("id", userId).maybeSingle(),
  ]);
  const mesPhotos = await urlsAvatars(moi ? [moi as { id: string; avatar_path: string | null }] : []);

  // Une categorie inconnue dans l'URL est ignoree (aucun filtre) plutot qu'une page vide.
  const categorieValide = categories.some((c) => c.id === categorieId) ? categorieId : null;

  return (
    <div>
      <BarreRecherche base={base} terme={terme} categorieActive={categorieValide} />
      <BarreEcrire
        espaceSlug={espace.slug}
        zone={zone}
        categories={categories}
        auteurId={userId}
        auteurPseudo={auteurPseudo}
        auteurAvatarUrl={mesPhotos.get(userId) ?? null}
        categorieParDefaut={categorieValide}
      />
      <PastillesCategories base={base} categories={categories} categorieActive={categorieValide} />

      {items.map((item) => (
        <CartePost
          key={item.post.id}
          espaceSlug={espace.slug}
          retour={base}
          item={item}
          estAdmin={estAdmin}
          userId={userId}
        />
      ))}
      {items.length === 0 && (
        <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
          {terme
            ? `Aucun résultat pour « ${terme} ».`
            : categorieValide
              ? "Aucun post dans cette catégorie pour l'instant."
            : zone === "payante"
              ? "Aucun post pour l'instant. Partage ton premier exercice."
              : "Aucun post pour l'instant. Sois le premier à partager quelque chose."}
        </p>
      )}
    </div>
  );
}
