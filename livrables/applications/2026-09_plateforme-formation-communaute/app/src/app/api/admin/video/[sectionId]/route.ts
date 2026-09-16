import { NextResponse } from "next/server";
import { verifierAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

// Recoit le fichier video enregistre depuis /admin (voir CADRAGE.md section 7
// "outil d'enregistrement video integre"). Upload direct navigateur -> Storage
// jamais utilise : tout passe par ce chemin service_role, apres verification
// du role admin, pour ne jamais avoir besoin de policy insert sur
// storage.objects (voir migration 0009).
export async function POST(
  request: Request,
  { params }: { params: Promise<{ sectionId: string }> }
) {
  try {
    await verifierAdmin();
  } catch {
    return NextResponse.json({ erreur: "Reserve aux admins." }, { status: 403 });
  }

  const { sectionId } = await params;
  const contentType = request.headers.get("content-type") ?? "video/webm";
  if (!contentType.startsWith("video/")) {
    return NextResponse.json({ erreur: "Le fichier doit etre une video." }, { status: 400 });
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength === 0) {
    return NextResponse.json({ erreur: "Fichier vide." }, { status: 400 });
  }

  const admin = createAdminClient();
  // Nom fixe (extension .webm arbitraire) : le vrai format vient du
  // Content-Type stocke, jamais de l'extension. Un enregistrement ou un
  // upload de fichier existant (mp4, mov...) suivent tous les deux ce
  // meme chemin, voir EnregistrementVideo.tsx.
  const path = `${sectionId}.webm`;

  const { error: erreurUpload } = await admin.storage
    .from("videos-cours")
    .upload(path, Buffer.from(bytes), { contentType, upsert: true });
  if (erreurUpload) {
    return NextResponse.json({ erreur: erreurUpload.message }, { status: 500 });
  }

  const { error: erreurUpdate } = await admin
    .from("sections")
    .update({ video_path: path })
    .eq("id", sectionId);
  if (erreurUpdate) {
    return NextResponse.json({ erreur: erreurUpdate.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path });
}
