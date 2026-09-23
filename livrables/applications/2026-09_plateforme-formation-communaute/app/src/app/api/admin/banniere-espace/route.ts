import { NextResponse } from "next/server";
import { verifierAdmin } from "@/lib/admin-guard";
import { createAdminClient } from "@/lib/supabase/admin";

// Upload de la banniere hero d'un espace (migration 0042). Meme principe que
// /api/admin/ressource-fichier : jamais d'upload direct navigateur -> Storage,
// tout passe par service_role apres verification admin. Bucket public, donc
// pas de lien signe a generer : l'URL publique suffit.
export async function POST(request: Request) {
  try {
    await verifierAdmin();
  } catch {
    return NextResponse.json({ erreur: "Reserve aux admins." }, { status: 403 });
  }

  const formData = await request.formData();
  const espaceId = String(formData.get("espace_id") ?? "");
  const fichier = formData.get("fichier");

  if (!espaceId || !(fichier instanceof File) || fichier.size === 0) {
    return NextResponse.json({ erreur: "Espace et fichier requis." }, { status: 400 });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(fichier.type)) {
    return NextResponse.json({ erreur: "Format non supporte (jpeg, png ou webp seulement)." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: espace } = await admin.from("espaces").select("slug, banniere_path").eq("id", espaceId).maybeSingle();
  if (!espace) return NextResponse.json({ erreur: "Espace introuvable." }, { status: 404 });

  const extension = fichier.type === "image/png" ? "png" : fichier.type === "image/webp" ? "webp" : "jpg";
  const path = `${espaceId}/${crypto.randomUUID()}.${extension}`;
  const bytes = await fichier.arrayBuffer();

  const { error: erreurUpload } = await admin.storage
    .from("bannieres-espaces")
    .upload(path, Buffer.from(bytes), { contentType: fichier.type });
  if (erreurUpload) return NextResponse.json({ erreur: erreurUpload.message }, { status: 500 });

  const { error: erreurUpdate } = await admin.from("espaces").update({ banniere_path: path }).eq("id", espaceId);
  if (erreurUpdate) return NextResponse.json({ erreur: erreurUpdate.message }, { status: 500 });

  // L'ancienne banniere ne sert plus a rien une fois remplacee.
  if (espace.banniere_path) {
    await admin.storage.from("bannieres-espaces").remove([espace.banniere_path]);
  }

  return NextResponse.json({ ok: true });
}
