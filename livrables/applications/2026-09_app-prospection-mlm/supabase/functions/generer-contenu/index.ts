// generer-contenu  (v2 : ZERO import — boot instantane)
// -------------------------------------------------------------------
// Genere le "contenu du jour" d'un agent : un post texte pret a poster
// (Facebook / TikTok), personnalise avec SON positionnement
// (situation + ton). Appelle l'API Claude (Anthropic).
//
// v2 : plus aucun `import` (pas de @supabase/supabase-js). Tout passe par
// fetch vers les endpoints REST/Auth de Supabase. Une fonction sans import
// ne peut pas rester bloquee au chargement du module (cause du hang de v1).
//
// Appelee par un agent connecte -> "Verify JWT" ACTIVE.
// Cle API : variable d'environnement ANTHROPIC_API_KEY (secret Supabase),
// JAMAIS en dur. Absente -> erreur claire, aucune simulation.
// -------------------------------------------------------------------

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  const json = (b: unknown, s = 200) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

  if (req.method !== "POST") return json({ error: "method_non_supportee" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader) return json({ error: "non_authentifie" }, 401);

  const sbHeaders = { "Authorization": authHeader, "apikey": SUPABASE_ANON };

  try {
    // 1. Qui est l'agent ? (Auth REST)
    const uRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: sbHeaders });
    if (!uRes.ok) return json({ error: "session_invalide" }, 401);
    const user = await uRes.json();
    const uid = user?.id;
    if (!uid) return json({ error: "session_invalide" }, 401);

    // 2. Positionnement de l'agent (PostgREST, RLS via le JWT agent)
    const aRes = await fetch(
      `${SUPABASE_URL}/rest/v1/agents?id=eq.${uid}&select=positionnement_situation,positionnement_ton`,
      { headers: sbHeaders },
    );
    if (!aRes.ok) {
      return json({ error: "lecture_agent", detail: await aRes.text() }, 500);
    }
    const rows = await aRes.json();
    const agent = Array.isArray(rows) ? rows[0] : null;
    const situationKey = agent?.positionnement_situation ?? "";
    const tonKey = agent?.positionnement_ton ?? "";
    if (!SITUATIONS[situationKey] || !TONS[tonKey]) {
      return json({ error: "positionnement_absent" }, 400);
    }

    // 3. Cle API Anthropic
    const apiKey = (Deno.env.get("ANTHROPIC_API_KEY") ?? "").trim();
    if (!apiKey || /x{6,}/i.test(apiKey) || !apiKey.startsWith("sk-ant-")) {
      return json({
        error: "cle_api_absente",
        detail: "ANTHROPIC_API_KEY absente ou invalide dans les secrets de la fonction.",
      }, 503);
    }

    const systemPrompt =
      "Tu ecris des posts courts pour les reseaux sociaux (Facebook, TikTok) au service " +
      "d'un agent en marketing de reseau francophone (Afrique de l'Ouest, Guinee). " +
      "Regles :\n" +
      "- Premiere ligne = un VRAI hook accrocheur, concret, jamais generique.\n" +
      "- 90 a 170 mots au total, francais courant, phrases lisibles a voix haute.\n" +
      "- Marketing de reseau : on partage une opportunite et un accompagnement, on " +
      "n'affirme aucun gain chiffre, on ne promet pas la richesse, pas d'\"argent facile\".\n" +
      "- 2 hashtags maximum (optionnels), 3 emojis maximum.\n" +
      "- Termine par une invitation simple a echanger en message prive.\n" +
      "- Adapte-toi STRICTEMENT a la situation et au ton fournis.\n" +
      "Reponds UNIQUEMENT avec un objet JSON valide, sans texte autour : " +
      '{"hook":"<1re ligne>","texte":"<post complet, hook inclus en 1re ligne>"}';

    const userPrompt =
      "Situation de l'agent : " + SITUATIONS[situationKey] + "\n" +
      "Ton demande : " + TONS[tonKey] + "\n\n" +
      "Genere le post du jour. Varie l'angle. N'invente aucun detail personnel " +
      "sur l'agent au-dela de sa situation.";

    // 4. Appel Claude
    const cRes = await fetch("https://api.anthropic.com/v1/messages", {
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
    const cJson = await cRes.json();
    if (!cRes.ok) {
      const t = cJson?.error?.type ?? "";
      const map: Record<string, string> = {
        authentication_error: "cle_api_invalide",
        permission_error: "cle_api_invalide",
        rate_limit_error: "trop_de_demandes",
        overloaded_error: "service_surcharge",
      };
      return json({ error: map[t] || "generation_impossible", detail: cJson?.error?.message ?? null }, 502);
    }
    if (cJson?.stop_reason === "refusal") return json({ error: "generation_refusee" }, 502);

    const raw = (cJson?.content ?? [])
      .filter((b: any) => b?.type === "text").map((b: any) => b.text).join("\n").trim();

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

    // 5. Enregistrement (PostgREST, RLS agent_id = auth.uid())
    const iRes = await fetch(`${SUPABASE_URL}/rest/v1/contenus_generes`, {
      method: "POST",
      headers: { ...sbHeaders, "Content-Type": "application/json", "Prefer": "return=representation" },
      body: JSON.stringify({ agent_id: uid, hook, texte, ton: tonKey, situation: situationKey, source: "ia" }),
    });
    let ins: any = null;
    if (iRes.ok) {
      const arr = await iRes.json();
      ins = Array.isArray(arr) ? arr[0] : arr;
    } else {
      // Le texte est genere : on le renvoie meme si l'enregistrement echoue.
      return json({ id: null, jour: null, hook, texte, ton: tonKey, situation: situationKey,
        detail: "genere mais non enregistre : " + (await iRes.text()).slice(0, 200) });
    }

    return json({ id: ins?.id ?? null, jour: ins?.jour ?? null, hook, texte, ton: tonKey, situation: situationKey });
  } catch (e) {
    return json({ error: "erreur_serveur", detail: String((e as Error)?.message ?? e) }, 500);
  }
});
