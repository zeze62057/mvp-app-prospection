import { createClient } from "@/lib/supabase/server";
import { MenuAdmin } from "@/components/admin/MenuAdmin";

// Menu lateral commun a toutes les pages admin. Chaque page refait sa propre verification
// de role : ici on n'affiche le menu qu'a un admin, pour ne rien montrer aux autres.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: profil } = userData.user
    ? await supabase.from("profils").select("role").eq("id", userData.user.id).maybeSingle()
    : { data: null };

  if (profil?.role !== "admin") return <>{children}</>;
  return (
    <div className="md:flex">
      <MenuAdmin />
      {children}
    </div>
  );
}
