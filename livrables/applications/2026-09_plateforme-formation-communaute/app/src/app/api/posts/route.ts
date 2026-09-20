import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEspaceParSlug } from "@/lib/espaces";
import { validerImage } from "@/lib/image";

// Publication d'un post du fil, avec image optionnelle (voir migration 0026).
// Route handler plutot que server action : un fichier binaire depasse la limite
// de taille des actions. Meme principe que /api/admin/video.
//
// Ordre voulu : 1) verifier l'acces, 2) televerser l'image, 3) inserer le post
// avec le client de l'utilisateur (le RLS et le trigger de la base decident),
// 4) si l'insertion echoue, supprimer l'image orpheline.

const TAILLE_MAX_IMAGE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ erreur: "Non connecté." }, { status: 401 });

  const formData = await request.formData();
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const zone = String(formData.get("zone") ?? "");
  const titre = String(formData.get("titre") ?? "").trim();
  const contenu = String(formData.get("contenu") ?? "").trim();
  const categorieId = String(formData.get("categorie_id") ?? "").trim();
  const magnet = String(formData.get("magnet_texte") ?? "").trim();
  const image = formData.get("image");

  if (zone !== "gratuite" && zone !== "payante") {
    return NextResponse.json({ erreur: "Zone invalide." }, { status: 400 });
  }
  if (!contenu) return NextResponse.json({ erreur: "Le post est vide." }, { status: 400 });
  if (contenu.length > 5000) {
    return NextResponse.json({ erreur: "Le post est limité à 5000 caractères." }, { status: 400 });
  }
  if (titre.length > 150) {
    return NextResponse.json({ erreur: "Le titre est limité à 150 caractères." }, { status: 400 });
  }

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return NextResponse.json({ erreur: "Espace introuvable." }, { status: 404 });

  // Acces a la zone, verifie AVANT de stocker quoi que ce soit.
  const { data: aAcces } = await supabase.rpc("a_acces_zone", {
    p_profil: userData.user.id,
    p_espace: espace.id,
    p_zone: zone,
  });
  if (!aAcces) return NextResponse.json({ erreur: "Accès refusé." }, { status: 403 });

  let imagePath: string | null = null;
  if (image instanceof File && image.size > 0) {
    const validation = await validerImage(image, TAILLE_MAX_IMAGE);
    if ("erreur" in validation) {
      return NextResponse.json({ erreur: validation.erreur }, { status: 400 });
    }
    imagePath = `${espace.id}/${zone}/${crypto.randomUUID()}.${validation.image.extension}`;
    const { error: erreurUpload } = await createAdminClient()
      .storage.from("posts-images")
      .upload(imagePath, Buffer.from(validation.image.octets), { contentType: validation.image.type });
    if (erreurUpload) return NextResponse.json({ erreur: erreurUpload.message }, { status: 500 });
  }

  const { error } = await supabase.from("posts").insert({
    espace_id: espace.id,
    auteur_id: userData.user.id,
    contenu,
    zone,
    titre: titre || null,
    categorie_id: categorieId || null,
    magnet_texte: zone === "payante" && magnet ? magnet : null,
    image_path: imagePath,
  });

  if (error) {
    if (imagePath) await createAdminClient().storage.from("posts-images").remove([imagePath]);
    return NextResponse.json({ erreur: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
