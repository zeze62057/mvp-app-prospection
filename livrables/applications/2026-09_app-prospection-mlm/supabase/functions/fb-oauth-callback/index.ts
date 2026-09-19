// fb-oauth-callback
// -------------------------------------------------------------------
// Facebook redirige ici apres que l'agent a autorise l'app.
//   GET ?code=...&state=<nonce>        succes
//   GET ?error=...&error_reason=...    refus / annulation
//
// On echange le code contre un jeton longue duree, on recupere la
// Page de l'agent, on abonne la Page au webhook, on stocke les jetons
// dans connexions_sociales (jamais renvoyes au navigateur), puis on
// redirige vers parametres.html.
// -------------------------------------------------------------------
import { admin, appUrl, backToSettings, env, graphGet, GRAPH } from "../_shared/fb.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const err = url.searchParams.get("error");
  if (err) {
    return backToSettings("erreur", url.searchParams.get("error_description") ?? err);
  }

  const code = url.searchParams.get("code");
  const nonce = url.searchParams.get("state");
  if (!code || !nonce) return backToSettings("erreur", "reponse_incomplete");

  const sb = admin();

  // 1. Retrouver l'agent via le nonce (usage unique, valable 10 min).
  const { data: nrow } = await sb
    .from("oauth_nonce")
    .select("agent_id, created_at")
    .eq("nonce", nonce)
    .maybeSingle();
  await sb.from("oauth_nonce").delete().eq("nonce", nonce);

  if (!nrow) return backToSettings("erreur", "lien_expire");
  if (Date.now() - Date.parse(nrow.created_at) > 10 * 60 * 1000) {
    return backToSettings("erreur", "lien_expire");
  }
  const agentId = nrow.agent_id as string;

  try {
    const appId = env("FB_APP_ID");
    const appSecret = env("FB_APP_SECRET");
    const redirectUri = `${env("SUPABASE_URL")}/functions/v1/fb-oauth-callback`;

    // 2. code -> jeton utilisateur court
    const short = await graphGet("/oauth/access_token", {
      client_id: appId,
      client_secret: appSecret,
      redirect_uri: redirectUri,
      code,
    });

    // 3. court -> jeton utilisateur longue duree (~60 jours)
    const long = await graphGet("/oauth/access_token", {
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: short.access_token,
    });
    const userToken: string = long.access_token;
    const expiresIn: number = long.expires_in ?? 0;

    // 4. Pages administrees par l'agent
    const pages = await graphGet("/me/accounts", {
      fields: "id,name,access_token",
      access_token: userToken,
    });
    const list: any[] = pages.data ?? [];
    if (list.length === 0) return backToSettings("erreur", "aucune_page");

    // MVP : on prend la premiere Page. Choix multi-Page = evolution (voir VEILLE-SOCIALE.md).
    const page = list[0];

    // 5. Abonner la Page au webhook (champ feed = publications + commentaires)
    try {
      const subRes = await fetch(
        `${GRAPH}/${page.id}/subscribed_apps?subscribed_fields=feed&access_token=${encodeURIComponent(page.access_token)}`,
        { method: "POST" },
      );
      const subBody = await subRes.json();
      if (!subRes.ok || subBody.error) {
        console.warn("[fb-oauth-callback] abonnement webhook échoué :", subBody.error);
        // Non bloquant : le poller fb-poll prendra le relais.
      }
    } catch (e) {
      console.warn("[fb-oauth-callback] abonnement webhook exception :", e);
    }

    // 6. Stocker (upsert) les jetons cote serveur uniquement
    const expireIso = expiresIn
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;
    const { error: upErr } = await sb.from("connexions_sociales").upsert({
      agent_id: agentId,
      fb_user_token: userToken,
      fb_user_token_expire: expireIso,
      fb_page_id: page.id,
      fb_page_name: page.name ?? null,
      fb_page_token: page.access_token,
      fb_connecte_le: new Date().toISOString(),
      fb_dernier_scan: null,
      updated_at: new Date().toISOString(),
    }, { onConflict: "agent_id" });
    if (upErr) return backToSettings("erreur", upErr.message);

    return backToSettings("ok");
  } catch (e) {
    console.error("[fb-oauth-callback]", e);
    return backToSettings("erreur", String((e as Error)?.message ?? e).slice(0, 180));
  }
});
