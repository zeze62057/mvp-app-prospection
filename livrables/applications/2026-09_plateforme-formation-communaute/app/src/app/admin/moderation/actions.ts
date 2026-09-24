"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-guard";
import { supprimerContenuModeration, type TypeContenu } from "@/lib/moderation-contenu";

// Un chemin de retour ne peut etre qu'interne : les actions serveur sont appelables avec
// n'importe quel argument, "//site-externe" deviendrait une redirection hors du site.
function cheminValide(retour: string) {
  return retour.startsWith("/") && !retour.startsWith("//");
}

// Supprime un post ou un commentaire, depuis la communaute (bouton admin) ou /admin/moderation.
// `retour` : la page a recharger apres la suppression.
export async function supprimerContenuAdmin(retour: string, type: TypeContenu, id: string) {
  const adminId = await verifierAdmin();
  if (type !== "post" && type !== "commentaire") return;
  const resultat = await supprimerContenuModeration(createAdminClient(), adminId, type, id);

  const cible = cheminValide(retour) ? retour : "/admin/moderation";
  revalidatePath(cible.split("?")[0]);
  // Sur la page de moderation, le resultat s'affiche dans la page (?ok=... ou ?erreur=...).
  if (cible.startsWith("/admin/moderation")) {
    const [chemin, requete = ""] = cible.split("?");
    const params = new URLSearchParams(requete);
    params.delete("ok");
    params.delete("erreur");
    params.set(resultat.ok ? "ok" : "erreur", resultat.message);
    redirect(`${chemin}?${params.toString()}`);
  }
  redirect(cible);
}
