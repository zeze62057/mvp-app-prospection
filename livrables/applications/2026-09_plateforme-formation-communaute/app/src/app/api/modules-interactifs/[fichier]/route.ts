import { readFile } from "node:fs/promises";
import path from "node:path";
import { getEspaceParSlug } from "@/lib/espaces";
import { ESPACE_MODULES_INTERACTIFS, fichierModuleInteractif } from "@/lib/modules-interactifs";
import { createClient } from "@/lib/supabase/server";

// Sert les modules interactifs et fiches PDF aux eleves ayant debloque la formation
// (acces_payant.actif de l'espace Vivier IA) et aux administrateurs. Meme gate que /formation.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ fichier: string }> },
) {
  const { fichier } = await params;
  const cible = fichierModuleInteractif(fichier);
  if (!cible) return new Response("Introuvable", { status: 404 });

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return new Response("Connexion requise", { status: 401 });

  const espace = await getEspaceParSlug(ESPACE_MODULES_INTERACTIFS);
  if (!espace) return new Response("Introuvable", { status: 404 });

  const [{ data: acces }, { data: profil }] = await Promise.all([
    supabase
      .from("acces_payant")
      .select("actif")
      .eq("profil_id", userData.user.id)
      .eq("espace_id", espace.id)
      .maybeSingle(),
    supabase.from("profils").select("role").eq("id", userData.user.id).maybeSingle(),
  ]);
  if (!acces?.actif && profil?.role !== "admin") {
    return new Response("Acces reserve aux eleves", { status: 403 });
  }

  let contenu: Buffer;
  try {
    contenu = await readFile(path.join(process.cwd(), "modules-interactifs", cible.chemin));
  } catch {
    return new Response("Introuvable", { status: 404 });
  }

  return new Response(new Uint8Array(contenu), {
    headers: {
      "Content-Type": cible.type,
      "Content-Disposition": `inline; filename="${cible.chemin}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
