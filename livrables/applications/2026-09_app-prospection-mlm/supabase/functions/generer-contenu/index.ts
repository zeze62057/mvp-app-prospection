// generer-contenu
// -------------------------------------------------------------------
// Genere le "contenu du jour" d'un agent : un post texte pret a poster
// (Facebook / TikTok), personnalise avec SON positionnement
// (situation + ton). Appelle l'API Claude (Anthropic).
//
// Appelee par un agent connecte -> laisser "Verify JWT" ACTIVE.
//
// Cle API : lue depuis la variable d'environnement ANTHROPIC_API_KEY
// (secret Supabase). JAMAIS en dur. Si absente -> erreur claire, aucune
// simulation.
//
// Deploiement :
//   supabase functions deploy generer-contenu
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
// ou Dashboard > Edge Functions (fichier autonome) + Secrets.
//
// Choix technique : appel HTTP direct a /v1/messages (pas de SDK) car
// l'environnement Edge (Deno) n'est pas une cible SDK de premier plan et
// l'appel est simple et non-streaming. Modele : claude-opus-5.
// Pour reduire le cout : voir CONTENU-IA.md (passer a claude-sonnet-5 +
// output_config.effort = "low").
// -------------------------------------------------------------------
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// --- Positionnement : dictionnaires precis (jamais generiques) ---
const SITUATIONS: Record<string, string> = {
  etudiant:
    "Etudiant(e). Peu de temps entre les cours, petit budget, cherche un revenu d'appoint flexible. Parle surtout a d'autres jeunes et a son entourage proche.",
  parent_foyer:
    "Parent au foyer. Organise ses journees autour des enfants, veut une activite depuis la maison, sur son telephone, sans horaires fixes. Sensible a l'autonomie financiere.",
  reconversion:
    "Salarie(e) en reconversion. A un emploi mais veut en sortir, teste une activite en parallele le soir et le week-end. Prudent(e), compare, veut du concret.",
  sans_emploi:
    "Sans emploi actuellement. Cherche une vraie opportunite, pas une promesse. A du temps mais peu de moyens pour demarrer. Besoin d'etre rassure(e) et accompagne(e).",
  entrepreneur_diversification:
    "Deja entrepreneur(e), en diversification. Comprend le business, veut une source de revenus complementaire qui ne prend pas tout son temps. Parle a un public deja actif.",
  jeune_diplome:
    "Jeune diplome(e). Diplome en poche mais marche de l'emploi difficile, veut prendre les devants et ne pas attendre. Ambitieux(se), a l'aise avec les reseaux sociaux.",
};

const TONS: Record<string, string> = {
  inspirant:
    "Ton inspirant / motivant : on parle d'un cap, d'un declic, d'une projection positive. Phrases qui donnent de l'elan, sans exageration ni promesse de gains.",
  pedagogue:
    "Ton pedagogue / explicatif : on explique une idee simplement, on demonte une idee recue, on donne un mini-cadre en 2-3 points. Clair, utile, jamais condescendant.",
  direct:
    "Ton direct / franc : phrases courtes, on va droit au but, on nomme l'objection ou la peur puis on repond. Pas de langue de bois, pas de superlatifs.",
  humoristique:
    "Ton humoristique / leger : une accroche qui fait sourire, une comparaison du quotidien, de l'autoderision legere. L'humour sert le message, il ne le remplace pas.",
  preuve_sociale:
    "Ton temoin / preuve sociale : on raconte a la premiere personne un moment concret (un doute leve, un premier resultat, un echange marquant), sans chiffres inventes.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  if (req.method !== "POST") return json({ error: "method_non_supportee" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader) return json({ error: "non_authentifie" }, 401);

  // Client Supabase avec le JWT de l'agent (RLS appliquee).
  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
  );

  const { data: userData } = await sb.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) return json({ error: "session_invalide" }, 401);

  // Positionnement de l'agent
  const { data: agent, error: aErr } = await sb
    .from("agents")
    .select("nom_complet, positionnement_situation, positionnement_ton")
    .eq("id", uid)
    .maybeSingle();
  if (aErr) return json({ error: "lecture_agent", detail: aErr.message }, 500);

  const situationKey = agent?.positionnement_situation ?? "";
  const tonKey = agent?.positionnement_ton ?? "";
  if (!SITUATIONS[situationKey] || !TONS[tonKey]) {
    return json({ error: "positionnement_absent" }, 400);
  }

  // Cle API
  const apiKey = (Deno.env.get("ANTHROPIC_API_KEY") ?? "").trim();
  if (!apiKey || /x{6,}/i.test(apiKey) || !apiKey.startsWith("sk-ant-")) {
    return json({
      error: "cle_api_absente",
      detail: "ANTHROPIC_API_KEY n'est pas configuree (secret Supabase). Voir CONTENU-IA.md.",
    }, 503);
  }

  const systemPrompt =
    "Tu ecris des posts courts pour les reseaux sociaux (Facebook, TikTok) au service " +
    "d'un agent en marketing de reseau francophone (Afrique de l'Ouest, Guinee). " +
    "Regles :\n" +
    "- Premiere ligne = un VRAI hook accrocheur, concret, jamais generique (pas de " +
    "\"Saviez-vous que...\", pas de \"Dans la vie...\").\n" +
    "- 90 a 170 mots au total, francais courant, phrases lisibles a voix haute.\n" +
    "- Marketing de reseau : on partage une opportunite et un accompagnement, on " +
    "n'affirme aucun gain chiffre, on ne promet pas la richesse, pas de \"argent facile\".\n" +
    "- Pas de hashtags en rafale (2 maximum, optionnels), pas d'emojis en exces (3 max).\n" +
    "- Termine par une invitation simple a echanger en message prive.\n" +
    "- Adapte-toi STRICTEMENT a la situation et au ton fournis.\n" +
    "Reponds UNIQUEMENT avec un objet JSON valide, sans texte autour, de la forme : " +
    '{"hook": "<la premiere ligne>", "texte": "<le post complet, hook inclus en 1re ligne>"}';

  const userPrompt =
    "Situation de l'agent : " + SITUATIONS[situationKey] + "\n" +
    "Ton demande : " + TONS[tonKey] + "\n\n" +
    "Genere le post du jour. Varie l'angle par rapport a un post classique. " +
    "N'invente pas de details personnels sur l'agent au-dela de sa situation.";

  let apiJson: any;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-opus-5",
        max_tokens: 1200,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    apiJson = await res.json();
    if (!res.ok) {
      const t = apiJson?.error?.type ?? "";
      const map: Record<string, string> = {
        authentication_error: "cle_api_invalide",
        permission_error: "cle_api_invalide",
        rate_limit_error: "trop_de_demandes",
        overloaded_error: "service_surcharge",
      };
      return json({ error: map[t] || "generation_impossible", detail: apiJson?.error?.message ?? null }, 502);
    }
    if (apiJson?.stop_reason === "refusal") {
      return json({ error: "generation_refusee" }, 502);
    }
  } catch (e) {
    return json({ error: "appel_impossible", detail: String((e as Error)?.message ?? e) }, 502);
  }

  // Extraction du texte + parsing JSON robuste
  const raw = (apiJson?.content ?? [])
    .filter((b: any) => b?.type === "text")
    .map((b: any) => b.text)
    .join("\n")
    .trim();

  let hook = "";
  let texte = "";
  try {
    const m = raw.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(m ? m[0] : raw);
    hook = String(parsed.hook ?? "").trim();
    texte = String(parsed.texte ?? "").trim();
  } catch {
    texte = raw;
    hook = raw.split("\n")[0].trim();
  }
  if (!texte) return json({ error: "reponse_vide" }, 502);
  if (!hook) hook = texte.split("\n")[0].trim();

  // Enregistrement (RLS : agent_id = auth.uid())
  const { data: ins, error: iErr } = await sb
    .from("contenus_generes")
    .insert({ agent_id: uid, hook, texte, ton: tonKey, situation: situationKey, source: "ia" })
    .select("id, jour")
    .maybeSingle();
  if (iErr) return json({ error: "enregistrement", detail: iErr.message }, 500);

  return json({ id: ins?.id ?? null, jour: ins?.jour ?? null, hook, texte, ton: tonKey, situation: situationKey });
});
