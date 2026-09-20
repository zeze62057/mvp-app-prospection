// Client Supabase pour le navigateur (composants "use client").
// Necessite NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local
// (voir .env.example a la racine du projet app/).

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Client pret pour le temps reel (Supabase Realtime). Le client navigateur charge la session
// depuis les cookies de facon asynchrone, et ne la transmet pas tout seul a la connexion
// temps reel : sans jeton, le serveur applique le RLS comme pour un anonyme et n'envoie AUCUN
// evenement (les abonnements sont acceptes, mais restent muets). On lit donc la session et on
// la donne explicitement AVANT de s'abonner.
export async function clientTempsReel() {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  if (data.session) supabase.realtime.setAuth(data.session.access_token);
  return supabase;
}
