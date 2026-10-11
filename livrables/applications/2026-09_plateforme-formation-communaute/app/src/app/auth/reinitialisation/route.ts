import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Point d'arrivee du lien "mot de passe oublie" envoye par Supabase : le code
// est echange contre une session (cookies poses ici, possible uniquement dans
// une route), puis redirection vers la page de nouveau mot de passe.
// next est valide : chemin interne uniquement, jamais une URL externe.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";
  const cible = next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (!code) {
    return NextResponse.redirect(new URL(`${cible}?erreur=lien-invalide`, url.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("reinitialisation: echec d'echange du code", error);
    return NextResponse.redirect(new URL(`${cible}?erreur=lien-expire`, url.origin));
  }

  return NextResponse.redirect(new URL(cible, url.origin));
}
