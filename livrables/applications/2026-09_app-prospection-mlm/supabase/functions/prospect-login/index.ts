// prospect-login
// -------------------------------------------------------------------
// Un prospect ouvre le lien d'acces recu par WhatsApp
// (rejoindre.html?t=<token>). Cette fonction :
//   1. valide le jeton (acces_prospect : non utilise, non expire)
//   2. cree le compte auth du prospect au premier passage, le rattache
//      a prospects.user_id
//   3. marque le jeton comme utilise
//   4. renvoie un token_hash de type "magiclink" SANS envoyer d'email,
//      que rejoindre.js echange contre une session via verifyOtp()
//
// verify_jwt = false (appelee par un prospect non connecte).
// -------------------------------------------------------------------
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (req.method !== "POST") return json({ error: "method_non_supportee" }, 405);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return json({ error: "json_invalide" }, 400); }
  const token = String(body.token ?? "").trim();
  if (token.length < 40) return json({ error: "lien_invalide" }, 400);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  try {
    // 1. Jeton d'acces
    const { data: acc } = await admin
      .from("acces_prospect")
      .select("id, prospect_id, expires_at, used_at")
      .eq("token", token)
      .maybeSingle();

    if (!acc) return json({ error: "lien_inconnu" }, 404);
    if (acc.used_at) return json({ error: "lien_deja_utilise" }, 410);
    if (Date.parse(acc.expires_at) < Date.now()) return json({ error: "lien_expire" }, 410);

    // 2. Prospect
    const { data: pros } = await admin
      .from("prospects")
      .select("id, nom, user_id")
      .eq("id", acc.prospect_id)
      .maybeSingle();
    if (!pros) return json({ error: "prospect_introuvable" }, 404);

    const email = `p-${pros.id}@prospects.kora.local`;
    let userId = pros.user_id as string | null;

    // 3. Compte auth au premier passage
    if (!userId) {
      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { role: "prospect", prospect_id: pros.id, nom: pros.nom },
      });
      if (created?.user) {
        userId = created.user.id;
      } else {
        // Deja cree lors d'un essai precedent : le retrouver.
        // ⚠️ listUsers ne renvoie que la 1re page (50). Suffisant au demarrage ;
        //    a remplacer par une recherche paginee si le volume grandit.
        const { data: list } = await admin.auth.admin.listUsers();
        const found = list?.users?.find((u) => u.email === email);
        if (!found) return json({ error: "creation_compte", detail: cErr?.message ?? null }, 500);
        userId = found.id;
      }
      await admin.from("prospects").update({ user_id: userId }).eq("id", pros.id);
    }

    // 4. Jeton consomme
    await admin.from("acces_prospect")
      .update({ used_at: new Date().toISOString() })
      .eq("id", acc.id);

    // 5. Jeton de session (magiclink) sans envoi d'email
    const { data: link, error: lErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    const hashed = link?.properties?.hashed_token;
    if (lErr || !hashed) {
      return json({ error: "session_impossible", detail: lErr?.message ?? null }, 500);
    }

    return json({
      email,
      token_hash: hashed,
      prenom: String(pros.nom ?? "").trim().split(/\s+/)[0] || "",
    });
  } catch (e) {
    console.error("[prospect-login]", e);
    return json({ error: "erreur_serveur", detail: String((e as Error)?.message ?? e) }, 500);
  }
});
