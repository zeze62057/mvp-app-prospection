import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { urlsAvatars } from "@/lib/avatars";
import { BarreNavigation } from "@/components/navigation/BarreNavigation";
import { MenuLateral } from "@/components/navigation/MenuLateral";
import { OngletsFlottants } from "@/components/navigation/OngletsFlottants";
import { chargerNiveaux } from "@/lib/niveaux-donnees";
import { libelleNiveau, niveauDe, prochainNiveau } from "@/lib/niveaux";

// Layout commun des pages membres : ajoute le menu lateral (ordinateur) ou la
// barre de navigation du bas (mobile) pour un membre connecte de cet espace.
// Pour un visiteur, ou tant que les migrations 0029 et 0030 ne sont pas
// appliquees, la page s'affiche telle quelle, sans navigation.
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

  const [{ count }, { data: moi }, niveaux, { data: accesPayant }] = await Promise.all([
    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("lu", false)
      .eq("espace_id", espace.id),
    supabase.from("profils").select("id, pseudo, role, points, avatar_path").eq("id", userData.user.id).maybeSingle(),
    chargerNiveaux(supabase, espace.id),
    supabase
      .from("acces_payant")
      .select("actif, est_expert")
      .eq("profil_id", userData.user.id)
      .eq("espace_id", espace.id)
      .maybeSingle(),
  ]);
  const points = moi?.points ?? 0;
  const role = moi?.role ?? "membre";
  const actuel = niveauDe(points, niveaux);
  const suivant = role === "admin" ? null : prochainNiveau(points, niveaux);
  // Part du chemin parcouru entre le niveau actuel et le suivant (100 % au dernier niveau).
  const pourcentage = suivant
    ? Math.round(((points - actuel.points_requis) / (suivant.points_requis - actuel.points_requis)) * 100)
    : 100;
  const photos = await urlsAvatars(moi ? [moi as { id: string; avatar_path: string | null }] : []);

  return (
    <div className="md:flex">
      <MenuLateral
        espaceSlug={espace.slug}
        espaceNom={espace.nom}
        userId={userData.user.id}
        pseudo={moi?.pseudo ?? "Moi"}
        avatarUrl={photos.get(userData.user.id) ?? null}
        points={points}
        niveau={libelleNiveau(points, role, niveaux)}
        pointsRestants={suivant ? suivant.points_requis - points : null}
        prochainLibelle={suivant?.libelle ?? null}
        estExpert={role === "admin" || (accesPayant?.actif === true && accesPayant.est_expert === true)}
        pourcentage={Math.min(100, Math.max(0, pourcentage))}
      />
      <div className="min-w-0 flex-1">
        <OngletsFlottants espaceSlug={espace.slug} nbNotifications={count ?? 0} estAdmin={role === "admin"} />
        {children}
        {/* Reserve la place de la barre fixe du bas, mobile uniquement : sur ordinateur le menu lateral la remplace. */}
        <div aria-hidden="true" className="h-20 md:hidden" />
        <BarreNavigation
          espaceSlug={espace.slug}
          espaceId={espace.id}
          nbInitial={count ?? 0}
          userId={userData.user.id}
          pseudo={moi?.pseudo ?? "Moi"}
          avatarUrl={photos.get(userData.user.id) ?? null}
        />
      </div>
    </div>
  );
}
