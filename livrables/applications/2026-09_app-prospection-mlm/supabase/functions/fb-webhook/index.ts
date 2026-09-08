// fb-webhook
// -------------------------------------------------------------------
// Recepteur des notifications temps reel de Facebook (champ "feed").
//
//   GET  ?hub.mode=subscribe&hub.verify_token=...&hub.challenge=...
//        -> verification initiale, on renvoie le challenge
//   POST { object: "page", entry: [ { id, changes: [ { field, value } ] } ] }
//        -> un commentaire (ou une reaction) ajoute sur une publication
//
// On cree une ligne dans notifications. On n'invente aucune donnee :
// si Facebook ne fournit pas le nom du commentateur, prospect_nom reste NULL.
//
// IMPORTANT : ce webhook ne fonctionne qu'apres validation de l'app par
// Meta (App Review). Sans ca, seules les personnes ayant un role sur
// l'app declenchent des evenements. Voir VEILLE-SOCIALE.md.
// -------------------------------------------------------------------
import { admin, env } from "../_shared/fb.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);

  // --- Verification de l'abonnement ---
  if (req.method === "GET") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge") ?? "";
    if (mode === "subscribe" && token === env("FB_WEBHOOK_VERIFY_TOKEN")) {
      return new Response(challenge, { status: 200 });
    }
    return new Response("forbidden", { status: 403 });
  }

  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  // Repondre 200 vite : Facebook re-essaie sinon et desactive le webhook.
  let payload: any = {};
  try {
    payload = await req.json();
  } catch {
    return new Response("bad json", { status: 200 });
  }

  // Traitement best-effort, sans jamais renvoyer d'erreur a Facebook.
  queueMicrotask(() => handle(payload).catch((e) => console.error("[fb-webhook]", e)));
  return new Response("EVENT_RECEIVED", { status: 200 });
});

async function handle(payload: any) {
  if (payload.object !== "page" || !Array.isArray(payload.entry)) return;
  const sb = admin();

  for (const entry of payload.entry) {
    const pageId = String(entry.id ?? "");
    if (!pageId) continue;

    const { data: conn } = await sb
      .from("connexions_sociales")
      .select("agent_id")
      .eq("fb_page_id", pageId)
      .maybeSingle();
    if (!conn) continue; // Page non rattachee a un agent Kora
    const agentId = conn.agent_id as string;

    for (const change of entry.changes ?? []) {
      if (change.field !== "feed") continue;
      const v = change.value ?? {};
      if (v.verb && v.verb !== "add") continue; // on ignore edit / remove / hide

      let type: "commentaire" | "like" | null = null;
      if (v.item === "comment") type = "commentaire";
      else if (v.item === "reaction") type = "like";
      if (!type) continue;

      const externalId = v.comment_id ?? v.reaction_id ??
        (v.post_id && v.from?.id ? `${v.post_id}:${v.from.id}:${type}` : null);
      if (!externalId) continue;

      const postId: string | null = v.post_id ?? v.parent_id ?? null;
      const publicationUrl = v.permalink_url ??
        (postId ? `https://www.facebook.com/${postId}` : null);

      const row = {
        agent_id: agentId,
        source: "facebook" as const,
        type,
        prospect_nom: v.from?.name ?? null, // NULL si non communique
        prospect_ref: v.from?.id ?? null,
        publication_titre: v.post?.status_type ?? null,
        publication_url: publicationUrl,
        commentaire_texte: type === "commentaire" ? (v.message ?? null) : null,
        external_id: String(externalId),
      };

      const { error } = await sb
        .from("notifications")
        .upsert(row, {
          onConflict: "agent_id,source,external_id",
          ignoreDuplicates: true,
        });
      if (error) console.error("[fb-webhook] insert notification", error);
    }
  }
}
