// Video de presentation d'un espace (migration 0035) : on ne garde que l'identifiant YouTube
// (11 caracteres), jamais l'adresse saisie. La page n'integre donc que youtube-nocookie.com.
// Fichier sans dependance, pour rester testable seul.

const ID = /^[A-Za-z0-9_-]{11}$/;

// Accepte un identifiant seul ou une adresse : watch?v=, youtu.be/, embed/, shorts/, live/.
// Renvoie null si rien de reconnaissable, ou si l'hote n'est pas YouTube.
export function extraireIdYoutube(saisie: string): string | null {
  const texte = saisie.trim();
  if (!texte) return null;
  if (ID.test(texte)) return texte;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(texte) ? texte : `https://${texte}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const hote = url.hostname.toLowerCase().replace(/^(www|m)\./, "");
  let candidat: string | null = null;
  if (hote === "youtu.be") {
    candidat = url.pathname.split("/")[1] ?? null;
  } else if (hote === "youtube.com" || hote === "youtube-nocookie.com") {
    if (url.pathname === "/watch") candidat = url.searchParams.get("v");
    else {
      const m = url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/?#]+)/);
      candidat = m ? m[1] : null;
    }
  }
  return candidat && ID.test(candidat) ? candidat : null;
}

export function urlIntegration(id: string): string | null {
  return ID.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
