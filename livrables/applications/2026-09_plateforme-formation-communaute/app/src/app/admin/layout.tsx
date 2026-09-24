import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { urlsAvatars } from "@/lib/avatars";
import { getAttentes } from "@/lib/attentes-admin";
import { MenuAdmin } from "@/components/admin/MenuAdmin";

// Menu lateral commun a toutes les pages admin. Chaque page refait sa propre verification
// de role : ici on n'affiche le menu qu'a un admin, pour ne rien montrer aux autres.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profil } = userData.user
    ? await supabase.from("profils").select("id, role, pseudo, avatar_path").eq("id", userData.user.id).maybeSingle()
    : { data: null };

  if (profil?.role !== "admin") return <>{children}</>;

  const [attentes, photos] = await Promise.all([getAttentes(createAdminClient()), urlsAvatars([profil])]);
  return (
    <div className="md:flex">
      <MenuAdmin
        moi={{ id: profil.id as string, pseudo: profil.pseudo as string, avatarUrl: photos.get(profil.id as string) ?? null }}
        nbAttente={attentes.reduce((s, a) => s + a.n, 0)}
      />
      {children}
    </div>
  );
}
