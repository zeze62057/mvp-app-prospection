-- ============================================================
--  Kora — Migration : activer le tunnel public de capture
-- ============================================================
--  Contexte : la base en service a été créée avec `schema.sql` (version stricte),
--  qui NE contient pas la colonne `slug` ni les fonctions du formulaire public.
--  Cette migration les ajoute, sur une base déjà peuplée (agent BONJOUR présent).
--
--  À exécuter : Supabase > SQL Editor > New query > coller > Run.
--  Idempotent : peut être relancé sans casse.
-- ============================================================


-- ------------------------------------------------------------
--  1. Colonne `slug` sur `agents`
-- ------------------------------------------------------------
--  Règle validée (échange du 2026-09-08) : le slug est choisi par l'agent
--  lui-même à l'inscription, et il est unique sur toute la table `agents`.
--  Il porte l'URL de la landing publique : .../index.html?agent=<slug>
--
--  ⚠️ À VALIDER : le FORMAT exact du slug n'est pas spécifié (longueur mini/maxi,
--  caractères autorisés, casse, gestion des accents et des espaces, comportement
--  en cas de doublon saisi par un agent). Aucune contrainte de format n'est posée
--  ici, seulement l'unicité. À compléter quand l'écran d'inscription sera défini.

alter table agents add column if not exists slug text;

create unique index if not exists agents_slug_key on agents (slug);


-- ------------------------------------------------------------
--  2. Slug de l'agent racine (BONJOUR)
-- ------------------------------------------------------------
--  `app/config.js` attend `defaultAgentSlug = "bonjour"`.
--  On ne renseigne que la racine (parrain_id is null) et seulement si vide,
--  pour ne rien écraser.

update agents
   set slug = 'bonjour'
 where slug is null
   and parrain_id is null;


-- ------------------------------------------------------------
--  3. Journal des soumissions publiques (pour la limite par IP)
-- ------------------------------------------------------------
--  RLS activée SANS policy : la table est donc inaccessible via l'API REST.
--  Seules les fonctions SECURITY DEFINER ci-dessous y écrivent et la lisent.

create table if not exists soumissions_publiques (
  id         bigint generated always as identity primary key,
  ip         text not null,
  agent_slug text,
  created_at timestamptz not null default now()
);

create index if not exists soumissions_publiques_ip_idx
  on soumissions_publiques (ip, created_at desc);

alter table soumissions_publiques enable row level security;


-- ------------------------------------------------------------
--  4. RPC de soumission publique
-- ------------------------------------------------------------
--  Règles déjà validées, appliquées telles quelles :
--    - statut forcé à 'nouveau'
--    - mode_creation forcé à 'formulaire_public'
--    - seuls les champs nom, telephone, email sont acceptés
--    - rattachement obligatoire à un agent, ici via son slug (règle du 2026-09-08)
--  Codes d'erreur renvoyés (déjà gérés par le front dans kora-store.js) :
--    nom_requis, contact_requis, agent_introuvable, trop_de_demandes

create or replace function soumettre_prospect_public(
  agent_slug  text,
  p_nom       text,
  p_telephone text default null,
  p_email     text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  -- ⚠️ À VALIDER : la limite par IP/heure est demandée mais AUCUN seuil n'est
  -- spécifié dans les docs validées. Valeur provisoire, à trancher.
  c_max_par_ip_par_heure constant int := 5;

  v_ip    text;
  v_agent uuid;
  v_count int;
  v_id    uuid;
begin
  -- IP de l'appelant, transmise par PostgREST dans les en-têtes de requête.
  -- Derrière le proxy Supabase, x-forwarded-for peut contenir "ip_client, ip_proxy".
  v_ip := coalesce(
    nullif(trim(split_part(
      (current_setting('request.headers', true)::json ->> 'x-forwarded-for'), ',', 1)), ''),
    current_setting('request.headers', true)::json ->> 'x-real-ip',
    'inconnue'
  );

  if p_nom is null or length(trim(p_nom)) = 0 then
    raise exception 'nom_requis';
  end if;

  if coalesce(trim(p_telephone), '') = '' and coalesce(trim(p_email), '') = '' then
    raise exception 'contact_requis';
  end if;

  -- Limite anti-spam : nombre de soumissions de cette IP sur la dernière heure.
  select count(*) into v_count
    from soumissions_publiques
   where ip = v_ip
     and created_at > now() - interval '1 hour';

  if v_count >= c_max_par_ip_par_heure then
    raise exception 'trop_de_demandes';
  end if;

  select id into v_agent
    from agents
   where slug = agent_slug
     and actif = true;

  if v_agent is null then
    raise exception 'agent_introuvable';
  end if;

  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation)
  values (
    v_agent,
    trim(p_nom),
    nullif(trim(coalesce(p_telephone, '')), ''),
    nullif(trim(coalesce(p_email, '')), ''),
    'nouveau',
    'formulaire_public'
  )
  returning id into v_id;

  insert into soumissions_publiques (ip, agent_slug) values (v_ip, agent_slug);

  return v_id;
end $$;

revoke all on function soumettre_prospect_public(text, text, text, text) from public;
grant execute on function soumettre_prospect_public(text, text, text, text) to anon, authenticated;


-- ------------------------------------------------------------
--  5. Nom public d'un agent à partir de son slug
-- ------------------------------------------------------------
--  Sert à personnaliser la landing ("avec BONJOUR"). La RLS de `agents`
--  n'autorise pas la lecture anonyme, d'où SECURITY DEFINER.

create or replace function agent_public_nom(agent_slug text) returns text
language sql
stable
security definer
set search_path = public
as $$
  select nom_complet from agents where slug = agent_slug and actif = true;
$$;

revoke all on function agent_public_nom(text) from public;
grant execute on function agent_public_nom(text) to anon, authenticated;


-- ------------------------------------------------------------
--  ⚠️ NON TRAITÉ ICI : reCAPTCHA
-- ------------------------------------------------------------
--  Vérifier un token reCAPTCHA impose un appel HTTP sortant depuis Postgres
--  (extension `pg_net`) ou une Edge Function, plus une clé secrète Google à
--  créer sur le compte. Aucun de ces éléments n'est disponible aujourd'hui,
--  et le widget n'existe pas dans app/index.html. À faire ensuite :
--    1. Créer une paire de clés reCAPTCHA (v2 case à cocher, ou v3) sur
--       https://www.google.com/recaptcha/admin
--    2. Ajouter le widget dans app/index.html avec la site key
--    3. Passer le token au RPC via un nouveau paramètre p_captcha_token
--    4. Le vérifier vers https://www.google.com/recaptcha/api/siteverify
--       (via pg_net dans la fonction, ou en déplaçant la soumission dans une
--        Edge Function dédiée)
--  La limite par IP/heure ci-dessus reste en place quoi qu'il arrive.
-- ------------------------------------------------------------


-- ------------------------------------------------------------
--  Vérifications (doivent renvoyer des lignes cohérentes)
-- ------------------------------------------------------------
select id, nom_complet, slug, parrain_id from agents;

select proname, proargnames
  from pg_proc
 where proname in ('soumettre_prospect_public', 'agent_public_nom');
