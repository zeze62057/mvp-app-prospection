import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { HISTORIQUE_ENVOYE, MAX_TOKENS_REPONSE, MODELE, SYSTEME } from "@/lib/assistant";
import { LIMITE_MESSAGES_PAR_JOUR, LONGUEUR_MAX_MESSAGE } from "@/lib/assistant-public";

export const maxDuration = 60;

const json = (corps: object, statut: number) =>
  new Response(JSON.stringify(corps), { status: statut, headers: { "Content-Type": "application/json" } });

// Assistant IA de l'espace client. Reponse envoyee au fil de l'eau (texte brut). Ordre des controles :
// session, statut de client, cle configuree, forme du message, limite quotidienne. Rien n'est envoye a
// Claude avant que tout soit valide.
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json({ erreur: "Session expirée. Reconnectez-vous." }, 401);

  const { data: client } = await supabase.from("chatllow_clients").select("profil_id").maybeSingle();
  if (!client) return json({ erreur: "Accès non ouvert." }, 403);

  if (!process.env.ANTHROPIC_API_KEY) return json({ erreur: "L'assistant est en cours de configuration." }, 503);

  const corps = await req.json().catch(() => null);
  const message = typeof corps?.message === "string" ? corps.message.trim() : "";
  if (!message) return json({ erreur: "Message vide." }, 400);
  if (message.length > LONGUEUR_MAX_MESSAGE) {
    return json({ erreur: `Message trop long (${LONGUEUR_MAX_MESSAGE} caractères maximum).` }, 400);
  }

  const admin = createAdminClient();
  const depuis = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
  const { count } = await admin
    .from("chatllow_messages")
    .select("*", { count: "exact", head: true })
    .eq("client_id", client.profil_id)
    .eq("role", "user")
    .gte("created_at", depuis);
  if ((count ?? 0) >= LIMITE_MESSAGES_PAR_JOUR) {
    return json({ erreur: `Limite de ${LIMITE_MESSAGES_PAR_JOUR} messages par jour atteinte. Revenez demain, ou prenez rendez-vous avec le cabinet.` }, 429);
  }

  // Fil recent (avant d'ajouter la question), du plus ancien au plus recent, en commencant par un message client.
  const { data: recents } = await admin
    .from("chatllow_messages")
    .select("role, contenu")
    .eq("client_id", client.profil_id)
    .eq("archive", false)
    .order("created_at", { ascending: false })
    .limit(HISTORIQUE_ENVOYE);
  const historique = (recents ?? []).reverse();
  while (historique.length > 0 && historique[0].role !== "user") historique.shift();

  const { error: erreurInsertion } = await admin
    .from("chatllow_messages")
    .insert({ client_id: client.profil_id, role: "user", contenu: message });
  if (erreurInsertion) return json({ erreur: "Message non enregistré." }, 500);

  const anthropic = new Anthropic();
  const flux = anthropic.messages.stream({
    model: MODELE,
    max_tokens: MAX_TOKENS_REPONSE,
    system: SYSTEME,
    messages: [
      ...historique.map((m) => ({ role: m.role as "user" | "assistant", content: m.contenu })),
      { role: "user" as const, content: message },
    ],
  });
  req.signal.addEventListener("abort", () => flux.abort());

  const encodeur = new TextEncoder();
  let texte = "";
  const sortie = new ReadableStream({
    async start(controleur) {
      try {
        for await (const ev of flux) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            texte += ev.delta.text;
            controleur.enqueue(encodeur.encode(ev.delta.text));
          }
        }
        if (texte.trim()) {
          await admin.from("chatllow_messages").insert({ client_id: client.profil_id, role: "assistant", contenu: texte });
        }
        controleur.close();
      } catch {
        // Reponse partielle conservee si elle existe ; le client voit l'arret du flux et peut reessayer.
        if (texte.trim()) {
          await admin.from("chatllow_messages").insert({ client_id: client.profil_id, role: "assistant", contenu: texte });
        }
        controleur.error(new Error("flux interrompu"));
      }
    },
    cancel() {
      flux.abort();
    },
  });

  return new Response(sortie, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}
