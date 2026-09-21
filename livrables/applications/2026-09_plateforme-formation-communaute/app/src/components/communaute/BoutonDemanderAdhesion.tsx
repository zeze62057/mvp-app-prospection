import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";
import { FormulaireDemandeAdhesion } from "@/components/communaute/FormulaireDemandeAdhesion";

// Demande d'acces a la communaute gratuite. Composant serveur : il charge les questions de
// l'espace (migration 0037) puis affiche le formulaire. Les cinq pages qui l'utilisaient
// continuent de l'importer sous ce nom.
export async function BoutonDemanderAdhesion({ espaceSlug }: { espaceSlug: string }) {
  const espace = await getEspaceParSlug(espaceSlug);
  let questions: { id: string; libelle: string }[] = [];
  if (espace) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("questions_adhesion")
      .select("id, libelle")
      .eq("espace_id", espace.id)
      .order("ordre");
    questions = (data ?? []) as { id: string; libelle: string }[];
  }
  return <FormulaireDemandeAdhesion espaceSlug={espaceSlug} questions={questions} />;
}
