import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Telechargement d'un livrable. Le client lit la ligne avec SA session (RLS : seulement ses livrables),
// puis le serveur genere un lien temporaire sur le bucket prive. Aucune URL publique n'existe.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.redirect(new URL("/connexion", _req.url));

  const { data: livrable } = await supabase
    .from("chatllow_livrables")
    .select("fichier_path")
    .eq("id", id)
    .maybeSingle();
  if (!livrable?.fichier_path) return new NextResponse("Document introuvable.", { status: 404 });

  const { data, error } = await createAdminClient()
    .storage.from("chatllow-livrables")
    .createSignedUrl(livrable.fichier_path, 60);
  if (error || !data) return new NextResponse("Document indisponible.", { status: 404 });

  return NextResponse.redirect(data.signedUrl);
}
