// fb-poll
// -------------------------------------------------------------------
// Voie FIABLE de detection (le webhook n'est qu'un bonus temps reel).
// A declencher par un cron (pg_cron ou Scheduled Functions), ex. toutes
// les 15 min. Pour chaque agent ayant connecte une Page :
//   - lit les commentaires recents de ses publications via la Graph API
//   - cree une notification par commentaire encore inconnu
//   - met a jour fb_dernier_scan
//
// Les LIKES ne sont pas recuperes ici : /{post}/reactions ne renvoie
// qu'un total, pas l'identite des personnes (voir VEILLE-SOCIALE.md).
//
// Protection d'appel : exiger l'en-tete x-cron-secret == CRON_SECRET.
// -------------------------------------------------------------------
import { admin, env, graphGet } from "../_shared/fb.ts";

Deno.serve(async (req) => {
  if (req.headers.get("x-cron-secret") !== env("CRON_SECRET")) {
    return new Response("forbidden", { status: 403 });
  }

  const sb = admin();
  const { data: conns, error } = await sb
    .from("connexions_sociales")
    .select("agent_id, fb_page_id, fb_page_token, fb_dernier_scan")
    .not("fb_page_id", "is", null);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const rapport: Record<string, unknown>[] = [];

  for (const c of conns ?? []) {
    const sinceMs = c.fb_dernier_scan
      ? Date.parse(c.fb_dernier_scan)
      : Date.now() - 24 * 3600 * 1000;
    const sinceUnix = Math.floor(sinceMs / 1000);
    let cree = 0;
    let erreurs: string[] = [];

    try {
      const feed = await graphGet(`/${c.fb_page_id}/feed`, {
        access_token: c.fb_page_token,
        fields:
          `id,permalink_url,status_type,` +
          `comments.since(${sinceUnix}).limit(50){id,message,from,created_time,permalink_url}`,
        limit: "25",
      });

      for (const post of feed.data ?? []) {
        for (const cm of post.comments?.data ?? []) {
          if (Date.parse(cm.created_time) <= sinceMs) continue;
          const { error: insErr } = await sb.from("notifications").upsert({
            agent_id: c.agent_id,
            source: "facebook",
            type: "commentaire",
            prospect_nom: cm.from?.name ?? null, // rien d'invente
            prospect_ref: cm.from?.id ?? null,
            publication_titre: post.status_type ?? null,
            publication_url: cm.permalink_url ?? post.permalink_url ?? null,
            commentaire_texte: cm.message ?? null,
            external_id: cm.id,
          }, { onConflict: "agent_id,source,external_id", ignoreDuplicates: true });
          if (insErr) erreurs.push(insErr.message);
          else cree++;
        }
      }

      await sb
        .from("connexions_sociales")
        .update({ fb_dernier_scan: new Date().toISOString() })
        .eq("agent_id", c.agent_id);
    } catch (e) {
      erreurs.push(String((e as Error)?.message ?? e));
    }

    rapport.push({ agent_id: c.agent_id, notifications_creees: cree, erreurs });
  }

  return new Response(JSON.stringify({ traites: rapport.length, rapport }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
