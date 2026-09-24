import { getContexteAdmin } from "@/lib/admin-contexte";
import { MenuAdmin } from "@/components/admin/MenuAdmin";

// Menu lateral commun a toutes les pages admin. Chaque page refait sa propre verification
// de role : ici on n'affiche le menu qu'a un admin, pour ne rien montrer aux autres.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const moi = await getContexteAdmin();
  if (!moi) return <>{children}</>;

  return (
    <div className="md:flex">
      <MenuAdmin moi={{ id: moi.id, pseudo: moi.pseudo, avatarUrl: moi.avatarUrl }} nbAttente={moi.nbAttente} />
      {children}
    </div>
  );
}
