// fb-oauth-start
// -------------------------------------------------------------------
// Appelee par parametres.js (Kora.social.connectUrl) avec le JWT de
// l'agent. Cree un nonce anti-CSRF et renvoie l'URL du dialogue OAuth
// Facebook a ouvrir dans le navigateur.
//
// Aucune donnee sensible cote navigateur : le JWT sert seulement a
// identifier l'agent ici, il n'est pas transmis a Facebook.
// -------------------------------------------------------------------
import { corsHeaders } from "../_shared/cors.ts";
import { admin, env, GRAPH } from "../_shared/fb.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const jwt = authHeader.replace(/^Bearer\s+/i, "");
    if (!jwt) return json({ url: null, raison: "Non authentifié." }, 401);

    const sb = admin();
    const { data: userData, error: userErr } = await sb.auth.getUser(jwt);
    if (userErr || !userData?.user) {
      return json({ url: null, raison: "Session invalide, reconnecte-toi." }, 401);
    }
    const agentId = userData.user.id;

    const appId = env("FB_APP_ID");
    // redirect_uri DOIT correspondre exactement a celui declare dans l'app Meta.
    const redirectUri = `${env("SUPABASE_URL")}/functions/v1/fb-oauth-callback`;

    const nonce = crypto.randomUUID();
    const { error: nErr } = await sb.from("oauth_nonce").insert({
      nonce,
      agent_id: agentId,
      reseau: "facebook",
    });
    if (nErr) return json({ url: null, raison: `Base : ${nErr.message}` }, 500);

    // Permissions minimales pour lire les commentaires d'une Page.
    // pages_read_user_content et pages_read_engagement exigent l'App Review Meta.
    const scope = [
      "pages_show_list",
      "pages_read_engagement",
      "pages_read_user_content",
    ].join(",");

    const dialog = new URL(`${GRAPH.replace("graph.", "www.")}/dialog/oauth`);
    dialog.searchParams.set("client_id", appId);
    dialog.searchParams.set("redirect_uri", redirectUri);
    dialog.searchParams.set("state", nonce);
    dialog.searchParams.set("response_type", "code");
    dialog.searchParams.set("scope", scope);

    return json({ url: dialog.toString(), raison: null });
  } catch (e) {
    return json({ url: null, raison: String((e as Error)?.message ?? e) }, 500);
  }
});
