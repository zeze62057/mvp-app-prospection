import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validerImage } from "@/lib/image";

// Photo de profil (voir migration 0028). Le fichier est televerse par le serveur
// dans le dossier du membre du bucket prive "avatars" ; la colonne avatar_path est
// ensuite mise a jour avec le client du membre (droit de colonne + trigger de la
// base : impossible de pointer vers le dossier d'un autre).

const TAILLE_MAX = 2 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ erreur: "Non connecté." }, { status: 401 });
  const userId = userData.user.id;

  const photo = (await request.formData()).get("photo");
  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ erreur: "Choisis une image." }, { status: 400 });
  }
  const validation = await validerImage(photo, TAILLE_MAX);
  if ("erreur" in validation) return NextResponse.json({ erreur: validation.erreur }, { status: 400 });

  const admin = createAdminClient();
  const { data: ancien } = await supabase.from("profils").select("avatar_path").eq("id", userId).maybeSingle();

  const chemin = `${userId}/${crypto.randomUUID()}.${validation.image.extension}`;
  const { error: erreurUpload } = await admin.storage
    .from("avatars")
    .upload(chemin, Buffer.from(validation.image.octets), { contentType: validation.image.type });
  if (erreurUpload) return NextResponse.json({ erreur: erreurUpload.message }, { status: 500 });

  const { error } = await supabase.from("profils").update({ avatar_path: chemin }).eq("id", userId);
  if (error) {
    await admin.storage.from("avatars").remove([chemin]);
    return NextResponse.json({ erreur: error.message }, { status: 400 });
  }

  // L'ancienne photo n'a plus de raison d'exister.
  if (ancien?.avatar_path) await admin.storage.from("avatars").remove([ancien.avatar_path]);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ erreur: "Non connecté." }, { status: 401 });
  const userId = userData.user.id;

  const { data: ancien } = await supabase.from("profils").select("avatar_path").eq("id", userId).maybeSingle();
  const { error } = await supabase.from("profils").update({ avatar_path: null }).eq("id", userId);
  if (error) return NextResponse.json({ erreur: error.message }, { status: 400 });

  if (ancien?.avatar_path) {
    await createAdminClient().storage.from("avatars").remove([ancien.avatar_path]);
  }
  return NextResponse.json({ ok: true });
}
