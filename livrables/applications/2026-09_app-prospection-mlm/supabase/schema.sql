-- ============================================================
--  Kora — schéma Supabase (Postgres) pour le MVP prospection
--  À coller dans Supabase > SQL Editor > New query, puis Run.
--  Idempotent au niveau des types et fonctions (create or replace / if not exists)
--  mais PAS des tables : à exécuter sur une base neuve.
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
--  Types
-- ------------------------------------------------------------
do $$ begin
  create type prospect_statut as enum
    ('nouveau','contacte','dans_le_tunnel','interesse','en_negociation','close_gagne','close_perdu');
exception when duplicate_object then null; end $$;

do $$ begin
  create type mode_creation_prospect as enum ('manuel','formulaire_public');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
--  Helper updated_at
-- ------------------------------------------------------------
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  -- Si l'appelant a fixé updated_at explicitement (seed, correction), on le respecte.
  if new.updated_at is distinct from old.updated_at then
    return new;
  end if;
  new.updated_at = now();
  return new;
end $$;

-- ------------------------------------------------------------
--  Table agents  (profil applicatif, 1 pour 1 avec auth.users)
-- ------------------------------------------------------------
create table agents (
  id          uuid primary key references auth.users(id) on delete cascade,
  nom_complet text not null,
  email       text,
  slug        text unique,                    -- porte la landing publique : kora.gn/<slug>
  parrain_id  uuid references agents(id),     -- null = racine (BONJOUR)
  actif       boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index agents_parrain_id_idx on agents(parrain_id);

create trigger agents_set_updated_at
  before update on agents
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
--  Table prospects
-- ------------------------------------------------------------
create table prospects (
  id            uuid primary key default gen_random_uuid(),
  agent_id      uuid not null references agents(id),     -- rattachement obligatoire
  nom           text not null,
  telephone     text,
  email         text,
  statut        prospect_statut not null default 'nouveau',
  mode_creation mode_creation_prospect not null default 'manuel',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint prospects_contact_present check (telephone is not null or email is not null)
);
create index prospects_agent_id_idx     on prospects(agent_id);
create index prospects_statut_idx       on prospects(statut);
create index prospects_agent_statut_idx on prospects(agent_id, statut);

create trigger prospects_set_updated_at
  before update on prospects
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
--  Table interactions  (historique de suivi)
-- ------------------------------------------------------------
create table interactions (
  id          uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references prospects(id) on delete cascade,
  agent_id    uuid not null references agents(id),
  type        text,                 -- 'appel' | 'message' | 'rdv' | 'relance' | 'note' (libre pour l'instant)
  contenu     text,
  created_at  timestamptz not null default now()
);
create index interactions_prospect_id_idx on interactions(prospect_id, created_at desc);

-- ------------------------------------------------------------
--  Table changements_statut  (journal d'audit des transitions)
-- ------------------------------------------------------------
create table changements_statut (
  id            uuid primary key default gen_random_uuid(),
  prospect_id   uuid not null references prospects(id) on delete cascade,
  agent_id      uuid references agents(id),
  ancien_statut prospect_statut,    -- null à la création
  nouveau_statut prospect_statut not null,
  created_at    timestamptz not null default now()
);
create index changements_statut_prospect_id_idx on changements_statut(prospect_id, created_at desc);

-- ------------------------------------------------------------
--  Triggers métier
-- ------------------------------------------------------------

-- Journalise chaque création et chaque changement de statut d'un prospect.
-- SECURITY DEFINER : l'insertion dans changements_statut ne doit pas être bloquée par la RLS.
create or replace function log_changement_statut() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into changements_statut(prospect_id, agent_id, ancien_statut, nouveau_statut)
    values (new.id, new.agent_id, null, new.statut);
  elsif new.statut is distinct from old.statut then
    insert into changements_statut(prospect_id, agent_id, ancien_statut, nouveau_statut)
    values (new.id, coalesce(auth.uid(), new.agent_id), old.statut, new.statut);
  end if;
  return new;
end $$;

create trigger prospects_log_statut
  after insert or update of statut on prospects
  for each row execute function log_changement_statut();

-- Toute nouvelle interaction rafraîchit updated_at du prospect (pilote "dernier contact").
-- SECURITY DEFINER pour rester indépendant de la RLS d'update sur prospects.
create or replace function touch_prospect_on_interaction() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update prospects set updated_at = now() where id = new.prospect_id;
  return new;
end $$;

create trigger interactions_touch_prospect
  after insert on interactions
  for each row execute function touch_prospect_on_interaction();

-- ------------------------------------------------------------
--  Hiérarchie : est-ce que <cible> est dans la downline de l'agent courant ?
--  SECURITY DEFINER pour parcourir agents sans être bloqué par la RLS.
-- ------------------------------------------------------------
create or replace function est_dans_ma_downline(cible uuid) returns boolean
language sql stable security definer set search_path = public as $$
  with recursive downline as (
    select id from agents where parrain_id = auth.uid() and id <> auth.uid()
    union                                   -- UNION (et non UNION ALL) : dédoublonne,
                                            -- donc un cycle parrain_id éventuel s'arrête.
    select a.id
      from agents a
      join downline d on a.parrain_id = d.id
     where a.id <> a.parrain_id
  )
  select exists (select 1 from downline where id = cible);
$$;

-- ------------------------------------------------------------
--  Création automatique du profil agent à l'inscription
-- ------------------------------------------------------------
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.agents (id, nom_complet, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nom_complet', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------------------
--  Row Level Security
-- ------------------------------------------------------------
alter table agents             enable row level security;
alter table prospects          enable row level security;
alter table interactions       enable row level security;
alter table changements_statut enable row level security;

-- agents : je vois ma ligne et toute ma downline ; je ne modifie que ma ligne.
create policy agents_select on agents
  for select to authenticated
  using (id = auth.uid() or est_dans_ma_downline(id));

create policy agents_update on agents
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- prospects : lecture pour le propriétaire et sa lignée ; écriture pour le propriétaire seul.
create policy prospects_select on prospects
  for select to authenticated
  using (agent_id = auth.uid() or est_dans_ma_downline(agent_id));

create policy prospects_insert on prospects
  for insert to authenticated
  with check (agent_id = auth.uid());

create policy prospects_update on prospects
  for update to authenticated
  using (agent_id = auth.uid())
  with check (agent_id = auth.uid());

create policy prospects_delete on prospects
  for delete to authenticated
  using (agent_id = auth.uid());

-- interactions : visibles si le prospect parent est visible ; créées par l'agent acteur, sur ses prospects.
create policy interactions_select on interactions
  for select to authenticated
  using (exists (
    select 1 from prospects p
    where p.id = interactions.prospect_id
      and (p.agent_id = auth.uid() or est_dans_ma_downline(p.agent_id))
  ));

create policy interactions_insert on interactions
  for insert to authenticated
  with check (
    agent_id = auth.uid()
    and exists (select 1 from prospects p where p.id = interactions.prospect_id and p.agent_id = auth.uid())
  );

-- changements_statut : lecture seule côté client, même visibilité que le prospect parent.
create policy changements_select on changements_statut
  for select to authenticated
  using (exists (
    select 1 from prospects p
    where p.id = changements_statut.prospect_id
      and (p.agent_id = auth.uid() or est_dans_ma_downline(p.agent_id))
  ));

-- ------------------------------------------------------------
--  Formulaire public : RPC SECURITY DEFINER, appelable avec la clé anon.
--  Crée le prospect au statut 'nouveau', rattaché à l'agent porté par le slug de l'URL.
-- ------------------------------------------------------------
create or replace function soumettre_prospect_public(
  agent_slug  text,
  p_nom       text,
  p_telephone text default null,
  p_email     text default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_agent uuid;
  v_id    uuid;
begin
  if p_nom is null or length(trim(p_nom)) = 0 then
    raise exception 'nom_requis';
  end if;
  if coalesce(trim(p_telephone), '') = '' and coalesce(trim(p_email), '') = '' then
    raise exception 'contact_requis';
  end if;

  select id into v_agent from agents where slug = agent_slug and actif = true;
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

  return v_id;
end $$;

revoke all on function soumettre_prospect_public(text, text, text, text) from public;
grant execute on function soumettre_prospect_public(text, text, text, text) to anon, authenticated;

-- Nom public d'un agent à partir de son slug, pour personnaliser la landing.
-- SECURITY DEFINER : la RLS de agents n'autorise pas la lecture anonyme.
create or replace function agent_public_nom(agent_slug text) returns text
language sql stable security definer set search_path = public as $$
  select nom_complet from agents where slug = agent_slug and actif = true;
$$;

revoke all on function agent_public_nom(text) from public;
grant execute on function agent_public_nom(text) to anon, authenticated;
