-- ============================================================
--  Kora — Migration : veille reseaux sociaux (module Facebook)
-- ============================================================
--  Ajoute :
--    1. agents.message_modele        -> texte de premier contact, editable par agent
--    2. table connexions_sociales    -> jetons OAuth, JAMAIS lisibles cote navigateur
--    3. table notifications          -> interactions detectees (Facebook) ou saisies a la main
--    4. RPC mon_statut_social()      -> etat de connexion sans exposer les jetons
--
--  A executer : Supabase > SQL Editor > New query > coller > Run.
--  Idempotent : peut etre relance sans casse.
-- ============================================================


-- ------------------------------------------------------------
--  1. Message de premier contact, par agent
-- ------------------------------------------------------------
--  Le jeton [lien] est remplace cote app par l'URL du tunnel de l'agent
--  (index.html?agent=<slug>). Chaque agent modifie SON texte, sans effet
--  sur les autres.

alter table agents
  add column if not exists message_modele text
  not null
  default 'Salut ! Merci pour ton intérêt 😊 Je vois que tu es passé(e) par ici. Si tu veux en savoir plus sur ce que je propose, clique ici : [lien] — je réponds à toutes tes questions !';

--  La policy agents_update existante (id = auth.uid()) autorise deja chaque
--  agent a mettre a jour cette colonne sur sa propre ligne. Rien a ajouter.


-- ------------------------------------------------------------
--  2. Connexions sociales (jetons OAuth)
-- ------------------------------------------------------------
--  RLS activee SANS AUCUNE policy : la table est donc totalement
--  inaccessible via l'API REST (clef anon comme clef utilisateur).
--  Seules les Edge Functions, qui utilisent la SERVICE ROLE KEY,
--  ecrivent et lisent ici. Les jetons ne transitent jamais par le navigateur.

create table if not exists connexions_sociales (
  agent_id             uuid primary key references agents(id) on delete cascade,

  -- Facebook
  fb_user_token        text,          -- user access token longue duree
  fb_user_token_expire timestamptz,
  fb_page_id           text,
  fb_page_name         text,
  fb_page_token        text,          -- page access token, utilise par le poller / webhook
  fb_connecte_le       timestamptz,
  fb_dernier_scan      timestamptz,   -- borne temporelle du dernier passage du poller

  -- TikTok (login uniquement : voir ../VEILLE-SOCIALE.md, aucune API d'interactions)
  tiktok_open_id       text,
  tiktok_token         text,
  tiktok_refresh_token text,
  tiktok_display_name  text,
  tiktok_connecte_le   timestamptz,

  updated_at           timestamptz not null default now()
);

alter table connexions_sociales enable row level security;
-- Volontairement aucune policy.


-- ------------------------------------------------------------
--  2 bis. Nonce OAuth (anti-CSRF du flux "Connecter Facebook")
-- ------------------------------------------------------------
--  La fonction Edge fb-oauth-start ecrit ici un jeton a usage unique ;
--  fb-oauth-callback le relit pour retrouver l'agent, puis le supprime.
--  RLS activee sans policy : jamais expose cote navigateur.

create table if not exists oauth_nonce (
  nonce      text primary key,
  agent_id   uuid not null references agents(id) on delete cascade,
  reseau     text not null,
  created_at timestamptz not null default now()
);
alter table oauth_nonce enable row level security;


-- ------------------------------------------------------------
--  3. Notifications d'interaction
-- ------------------------------------------------------------
--  Une ligne par commentaire / like detecte (Facebook) ou saisi
--  manuellement par l'agent. L'app lit et met a jour SES lignes.

do $$ begin
  create type notif_source as enum ('facebook', 'tiktok', 'manuel');
exception when duplicate_object then null; end $$;

do $$ begin
  create type notif_type as enum ('commentaire', 'like');
exception when duplicate_object then null; end $$;

create table if not exists notifications (
  id                 uuid primary key default gen_random_uuid(),
  agent_id           uuid not null references agents(id) on delete cascade,

  source             notif_source not null,
  type               notif_type   not null,

  -- Ce que l'API a REELLEMENT renvoye. NULL si non communique : on n'invente rien.
  prospect_nom       text,          -- nom d'affichage du commentateur, si l'API le donne
  prospect_ref       text,          -- identifiant plateforme (PSID Facebook), si dispo
  prospect_profil_url text,         -- quasi jamais fourni par Facebook ; garde le champ pour TikTok/manuel

  publication_titre  text,          -- extrait du texte de la publication
  publication_url    text,          -- lien vers la publication
  commentaire_texte  text,          -- contenu du commentaire, si type = commentaire

  external_id        text,          -- id du commentaire cote plateforme, pour la deduplication
  message_envoye     boolean not null default false,
  lu                 boolean not null default false,
  prospect_id        uuid references prospects(id) on delete set null,  -- si converti en prospect

  created_at         timestamptz not null default now()
);

create index if not exists notifications_agent_idx
  on notifications (agent_id, created_at desc);

--  Deduplication des interactions Facebook. Index NON partiel : les lignes
--  a external_id NULL (saisie manuelle) ne se percutent pas entre elles
--  (Postgres traite les NULL comme distincts), et l'inference ON CONFLICT
--  de PostgREST fonctionne de maniere fiable sur les 3 colonnes.
create unique index if not exists notifications_dedup_idx
  on notifications (agent_id, source, external_id);

alter table notifications enable row level security;

do $$ begin
  create policy notifications_select on notifications
    for select to authenticated
    using (agent_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy notifications_insert on notifications
    for insert to authenticated
    with check (agent_id = auth.uid());   -- saisie manuelle par l'agent
exception when duplicate_object then null; end $$;

do $$ begin
  create policy notifications_update on notifications
    for update to authenticated
    using (agent_id = auth.uid())
    with check (agent_id = auth.uid());   -- marquer lu / message envoye / rattacher un prospect
exception when duplicate_object then null; end $$;

do $$ begin
  create policy notifications_delete on notifications
    for delete to authenticated
    using (agent_id = auth.uid());
exception when duplicate_object then null; end $$;

--  Le poller et le webhook (Edge Functions, service role) inserent
--  en contournant la RLS. Aucune policy INSERT "large" n'est donc requise.


-- ------------------------------------------------------------
--  4. Etat de connexion sociale, sans exposer les jetons
-- ------------------------------------------------------------
--  Renvoie uniquement des booleens et des libelles publics.
--  SECURITY DEFINER pour lire connexions_sociales (qui n'a pas de policy).

create or replace function mon_statut_social()
returns table (
  fb_connecte        boolean,
  fb_page_nom        text,
  fb_connecte_le     timestamptz,
  fb_dernier_scan    timestamptz,
  tiktok_connecte    boolean,
  tiktok_nom         text,
  tiktok_connecte_le timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (c.fb_page_id is not null)            as fb_connecte,
    c.fb_page_name                        as fb_page_nom,
    c.fb_connecte_le,
    c.fb_dernier_scan,
    (c.tiktok_open_id is not null)        as tiktok_connecte,
    c.tiktok_display_name                 as tiktok_nom,
    c.tiktok_connecte_le
  from (select auth.uid() as uid) me
  left join connexions_sociales c on c.agent_id = me.uid;
$$;

revoke all on function mon_statut_social() from public;
grant execute on function mon_statut_social() to authenticated;


-- ------------------------------------------------------------
--  5. Deconnexion d'un compte social (efface les jetons)
-- ------------------------------------------------------------
create or replace function deconnecter_compte_social(p_reseau text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_reseau = 'facebook' then
    update connexions_sociales
       set fb_user_token = null, fb_user_token_expire = null,
           fb_page_id = null, fb_page_name = null, fb_page_token = null,
           fb_connecte_le = null, fb_dernier_scan = null, updated_at = now()
     where agent_id = auth.uid();
  elsif p_reseau = 'tiktok' then
    update connexions_sociales
       set tiktok_open_id = null, tiktok_token = null, tiktok_refresh_token = null,
           tiktok_display_name = null, tiktok_connecte_le = null, updated_at = now()
     where agent_id = auth.uid();
  else
    raise exception 'reseau_inconnu';
  end if;
end $$;

revoke all on function deconnecter_compte_social(text) from public;
grant execute on function deconnecter_compte_social(text) to authenticated;


-- ------------------------------------------------------------
--  Verifications
-- ------------------------------------------------------------
select column_name from information_schema.columns
 where table_name = 'agents' and column_name = 'message_modele';

select to_regclass('public.connexions_sociales') as connexions_sociales,
       to_regclass('public.notifications')       as notifications;

select proname from pg_proc
 where proname in ('mon_statut_social', 'deconnecter_compte_social');
