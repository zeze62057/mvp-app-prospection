// Client Supabase avec la cle service_role : contourne le RLS.
// STRICTEMENT reserve au code serveur (Server Actions, Route Handlers)
// deja protege par une verification de role admin. Ne jamais importer
// ce fichier depuis un composant client.

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
