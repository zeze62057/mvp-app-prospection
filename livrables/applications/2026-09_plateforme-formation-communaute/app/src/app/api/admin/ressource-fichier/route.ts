import { NextResponse } from "next/server";
import { verifierAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

// Upload d'un fichier telechargeable (voir migration 0011). Meme
// principe que /api/admin/video : jamais d'upload direct navigateur ->
// Storage, tout passe par service_role apres verification admin.
export async function POST(request: Request) {
  try {
    await verifierAdmin();
  } catch {
    return NextResponse.json({ erreur: "Reserve aux admins." }, { status: 403 });
  }

  const formData = await request.formData();
  const espaceId = String(formData.get("espace_id") ?? "");
  const titre = String(formData.get("titre") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const fichier = formData.get("fichier");

  if (!espaceId || !titre || !(fichier instanceof File) || fichier.size === 0) {
    return NextResponse.json({ erreur: "Champs manquants ou fichier vide." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: ressource, error: erreurInsert } = await admin
    .from("ressources")
    .insert({ espace_id: espaceId, type: "fichier", titre, description })
    .select()
    .single();
  if (erreurInsert) return NextResponse.json({ erreur: erreurInsert.message }, { status: 500 });

  const path = `${ressource.id}/${fichier.name}`;
  const bytes = await fichier.arrayBuffer();

  const { error: erreurUpload } = await admin.storage
    .from("ressources-fichiers")
    .upload(path, Buffer.from(bytes), { contentType: fichier.type || "application/octet-stream" });
  if (erreurUpload) {
    await admin.from("ressources").delete().eq("id", ressource.id);
    return NextResponse.json({ erreur: erreurUpload.message }, { status: 500 });
  }

  const { error: erreurUpdate } = await admin
    .from("ressources")
    .update({ chemin_storage: path })
    .eq("id", ressource.id);
  if (erreurUpdate) return NextResponse.json({ erreur: erreurUpdate.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
