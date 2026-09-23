import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEspaceParSlug } from "@/lib/espaces";
import { validerImage } from "@/lib/image";
import { extraireIdYoutube } from "@/lib/youtube";

// Publication d'un post du fil, avec image optionnelle (voir migration 0026).
// Route handler plutot que server action : un fichier binaire depasse la limite
// de taille des actions. Meme principe que /api/admin/video.
//
// Ordre voulu : 1) verifier l'acces, 2) televerser l'image, 3) inserer le post
// avec le client de l'utilisateur (le RLS et le trigger de la base decident),
// 4) si l'insertion echoue, supprimer l'image orpheline.

const TAILLE_MAX_IMAGE = 5 * 1024 * 1024;
const TAILLE_MAX_FICHIER = 10 * 1024 * 1024;
const EXTENSIONS_FICHIER: Record<string, string> = {
  "application/pdf": "pdf",
  "application/zip": "zip",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "text/plain": "txt",
};

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
  const videoSaisie = String(formData.get("video") ?? "").trim();
  const lienSaisi = String(formData.get("lien") ?? "").trim();
  const fichier = formData.get("fichier");

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

  // Video : uniquement un lien YouTube, jamais un fichier video televerse (voir
  // migration 0044, meme contrainte de taille que l'envoi des videos de cours).
  let idYoutube: string | null = null;
  if (videoSaisie) {
    idYoutube = extraireIdYoutube(videoSaisie);
    if (!idYoutube) return NextResponse.json({ erreur: "Lien vidéo invalide : seuls les liens YouTube sont acceptés." }, { status: 400 });
  }
  if (lienSaisi && !/^https?:\/\/[^\s]+$/i.test(lienSaisi)) {
    return NextResponse.json({ erreur: "Lien invalide : doit commencer par http:// ou https://." }, { status: 400 });
  }
  if (fichier instanceof File && fichier.size > 0) {
    if (fichier.size > TAILLE_MAX_FICHIER) {
      return NextResponse.json({ erreur: "Le fichier dépasse 10 Mo." }, { status: 400 });
    }
    if (!EXTENSIONS_FICHIER[fichier.type]) {
      return NextResponse.json({ erreur: "Type de fichier non accepté (PDF, Word, ZIP ou texte)." }, { status: 400 });
    }
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

  let fichierPath: string | null = null;
  let fichierNom: string | null = null;
  if (fichier instanceof File && fichier.size > 0) {
    const ext = EXTENSIONS_FICHIER[fichier.type];
    fichierPath = `${espace.id}/${zone}/${crypto.randomUUID()}.${ext}`;
    fichierNom = fichier.name;
    const { error: erreurUploadFichier } = await createAdminClient()
      .storage.from("posts-fichiers")
      .upload(fichierPath, Buffer.from(await fichier.arrayBuffer()), { contentType: fichier.type });
    if (erreurUploadFichier) {
      if (imagePath) await createAdminClient().storage.from("posts-images").remove([imagePath]);
      return NextResponse.json({ erreur: erreurUploadFichier.message }, { status: 500 });
    }
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
    video_url: idYoutube,
    lien_url: lienSaisi || null,
    fichier_path: fichierPath,
    fichier_nom: fichierNom,
  });

  if (error) {
    if (imagePath) await createAdminClient().storage.from("posts-images").remove([imagePath]);
    if (fichierPath) await createAdminClient().storage.from("posts-fichiers").remove([fichierPath]);
    return NextResponse.json({ erreur: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
