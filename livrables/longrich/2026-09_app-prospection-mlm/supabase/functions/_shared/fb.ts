// Helpers partages du module de veille Facebook.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const GRAPH = "https://graph.facebook.com/v21.0";

/** Client Supabase avec la SERVICE ROLE KEY : contourne la RLS.
 *  A n'utiliser que cote fonction Edge, jamais expose au navigateur. */
export function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export function env(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Variable d'environnement manquante : ${name}`);
  return v;
}

/** Base publique de l'app (ou vit parametres.html), sans slash final. */
export function appUrl(): string {
  return (Deno.env.get("APP_PUBLIC_URL") ?? "").replace(/\/+$/, "");
}

/** Redirige vers parametres.html avec un statut lisible par parametres.js. */
export function backToSettings(statut: "ok" | "erreur", msg?: string): Response {
  const base = appUrl();
  const q = new URLSearchParams({ fb: statut });
  if (msg) q.set("msg", msg);
  const target = base
    ? `${base}/parametres.html?${q}`
    : `/parametres.html?${q}`; // repli si APP_PUBLIC_URL non configure
  return new Response(null, { status: 302, headers: { Location: target } });
}

export async function graphGet(
  path: string,
  params: Record<string, string>,
): Promise<any> {
  const q = new URLSearchParams(params);
  const res = await fetch(`${GRAPH}${path}?${q}`);
  const body = await res.json();
  if (!res.ok || body.error) {
    throw new Error(
      `Graph API ${path} : ${body.error?.message ?? res.status} ` +
        `(code ${body.error?.code ?? "?"})`,
    );
  }
  return body;
}
