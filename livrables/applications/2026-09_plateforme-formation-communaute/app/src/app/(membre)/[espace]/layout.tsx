import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { urlsAvatars } from "@/lib/avatars";
import { BarreNavigation } from "@/components/navigation/BarreNavigation";

// Layout commun des pages membres : ajoute la barre de navigation (Accueil,
// Messages, Notifications, profil) pour un membre connecte de cet espace. Pour un
// visiteur, ou tant que les migrations 0029 et 0030 ne sont pas appliquees, la
// page s'affiche telle quelle, sans barre.
export default async function LayoutMembre({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) return <>{children}</>;

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return <>{children}</>;

  const { data: estMembre } = await supabase.rpc("est_membre_espace", {
    p_profil: userData.user.id,
    p_espace: espace.id,
  });
  if (estMembre !== true) return <>{children}</>;

  const [{ count }, { data: moi }] = await Promise.all([
    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("lu", false)
      .eq("espace_id", espace.id),
    supabase.from("profils").select("id, pseudo, avatar_path").eq("id", userData.user.id).maybeSingle(),
  ]);
  const photos = await urlsAvatars(moi ? [moi as { id: string; avatar_path: string | null }] : []);

  return (
    <>
      {children}
      {/* Reserve la place de la barre fixe, pour qu'elle ne cache pas le bas de page. */}
      <div aria-hidden="true" className="h-20 md:h-16" />
      <BarreNavigation
        espaceSlug={espace.slug}
        espaceId={espace.id}
        nbInitial={count ?? 0}
        userId={userData.user.id}
        pseudo={moi?.pseudo ?? "Moi"}
        avatarUrl={photos.get(userData.user.id) ?? null}
      />
    </>
  );
}
