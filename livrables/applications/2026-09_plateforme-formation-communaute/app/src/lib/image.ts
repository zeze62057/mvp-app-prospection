// Validation commune des images envoyees par les membres (posts du fil, photo de
// profil). Le type declare par le navigateur ne prouve rien : on controle aussi
// les premiers octets du fichier (signature PNG, JPEG ou WebP).

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function signatureValide(octets: Uint8Array, type: string): boolean {
  const debut = (...attendu: number[]) => attendu.every((o, i) => octets[i] === o);
  if (type === "image/png") return debut(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
  if (type === "image/jpeg") return debut(0xff, 0xd8, 0xff);
  if (type === "image/webp") {
    return (
      debut(0x52, 0x49, 0x46, 0x46) &&
      octets[8] === 0x57 &&
      octets[9] === 0x45 &&
      octets[10] === 0x42 &&
      octets[11] === 0x50
    );
  }
  return false;
}

export type ImageValidee = { octets: Uint8Array; type: string; extension: string };

// Renvoie l'image validee, ou un message d'erreur destine a l'utilisateur.
export async function validerImage(
  fichier: File,
  tailleMaxOctets: number
): Promise<{ image: ImageValidee } | { erreur: string }> {
  const extension = EXTENSIONS[fichier.type];
  if (!extension) return { erreur: "Image acceptée : JPG, PNG ou WebP." };
  if (fichier.size > tailleMaxOctets) {
    return { erreur: `Image trop lourde (${Math.round(tailleMaxOctets / 1024 / 1024)} Mo maximum).` };
  }
  const octets = new Uint8Array(await fichier.arrayBuffer());
  if (!signatureValide(octets, fichier.type)) {
    return { erreur: "Ce fichier n'est pas une vraie image." };
  }
  return { image: { octets, type: fichier.type, extension } };
}
