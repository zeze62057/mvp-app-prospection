import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

// Telechargement d'un livrable par l'administrateur (n'importe quel client). Le role admin est verifie avec
// la session ; le lien genere est temporaire (60 s) sur le bucket prive.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.redirect(new URL("/connexion", req.url));
  const { data: estAdmin } = await supabase.from("chatllow_admins").select("profil_id").maybeSingle();
  if (!estAdmin) return new NextResponse("Accès refusé.", { status: 403 });

  const admin = createAdminClient();
  const { data: livrable } = await admin.from("chatllow_livrables").select("fichier_path").eq("id", id).maybeSingle();
  if (!livrable?.fichier_path) return new NextResponse("Document introuvable.", { status: 404 });
  const { data, error } = await admin.storage.from("chatllow-livrables").createSignedUrl(livrable.fichier_path, 60);
  if (error || !data) return new NextResponse("Document indisponible.", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
