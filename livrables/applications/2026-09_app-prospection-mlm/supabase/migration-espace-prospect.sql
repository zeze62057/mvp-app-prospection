-- ============================================================
--  Kora — Migration : espace prospect (etape 1, fondation)
-- ============================================================
--  Objectif : permettre a un PROSPECT de se connecter, via un lien
--  d'acces a usage unique que l'agent lui envoie par WhatsApp.
--  Prealable aux fonctionnalites Communaute et Meetings.
--
--  Contenu :
--    1. prospects.user_id            -> lien vers auth.users (NULL = pas connecte)
--    2. table acces_prospect         -> jetons d'acces a usage unique
--    3. est_un_agent() / est_un_prospect()  -> distinguer le type de session
--    4. creer_acces_prospect(uuid)   -> RPC appelee par l'agent, renvoie le jeton
--
--  A executer : Supabase > SQL Editor > New query > coller > Run.
--  Idempotent. Ne PAS executer automatiquement (Claude n'a pas d'acces DB).
--  Prerequis : schema.sql + migration-tunnel-public.sql.
-- ============================================================


-- ------------------------------------------------------------
--  1. Rattachement prospect <-> compte auth
-- ------------------------------------------------------------
alter table prospects
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create unique index if not exists prospects_user_id_key
  on prospects (user_id) where user_id is not null;


-- ------------------------------------------------------------
--  2. Jetons d'acces prospect (a usage unique, envoyes par WhatsApp)
-- ------------------------------------------------------------
--  RLS activee SANS policy : la table est inaccessible via l'API REST.
--  Seules la fonction Edge prospect-login (service role) et la RPC
--  creer_acces_prospect (SECURITY DEFINER) y touchent.
--
--  ⚠️ A DURCIR plus tard : le jeton est stocke en clair. Pour une v2,
--  ne stocker que son hash (extension pgcrypto : digest(token,'sha256')).

create table if not exists acces_prospect (
  id          uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references prospects(id) on delete cascade,
  token       text not null unique,
  cree_par    uuid references agents(id),
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null default (now() + interval '7 days'),
  used_at     timestamptz
);

create index if not exists acces_prospect_prospect_idx
  on acces_prospect (prospect_id, created_at desc);

alter table acces_prospect enable row level security;
-- Volontairement aucune policy.


-- ------------------------------------------------------------
--  3. Type de la session courante
-- ------------------------------------------------------------
--  Un agent a une ligne dans agents ; un prospect connecte a
--  prospects.user_id = auth.uid(). Ces deux fonctions serviront a
--  ecrire les policies des tables Communaute / Meetings (etapes 2 et 3),
--  pour qu'une session prospect ne puisse PAS lire le CRM.

create or replace function est_un_agent() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from agents where id = auth.uid());
$$;

create or replace function est_un_prospect() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from prospects where user_id = auth.uid());
$$;

revoke all on function est_un_agent() from public;
revoke all on function est_un_prospect() from public;
grant execute on function est_un_agent() to authenticated;
grant execute on function est_un_prospect() to authenticated;

--  Note : les policies CRM actuelles (prospects_select, interactions_*,
--  changements_statut_select) filtrent deja sur agent_id = auth.uid() ou
--  est_dans_ma_downline(...). Une session prospect ne remplit ni l'un ni
--  l'autre, donc elle ne voit rien du CRM. Rien a modifier ici.


-- ------------------------------------------------------------
--  4. Creation d'un lien d'acces par l'agent
-- ------------------------------------------------------------
--  L'agent (proprietaire du prospect, ou dans sa downline) appelle cette
--  RPC ; elle cree un jeton et le renvoie EN CLAIR une seule fois, a
--  coller dans le message WhatsApp d'invitation.
--  Jeton = 2 UUID concatenes sans tirets (256 bits, pas de dependance pgcrypto).

create or replace function creer_acces_prospect(p_prospect_id uuid)
returns text
language plpgsql security definer set search_path = public as $$
declare
  v_token text;
  v_autorise boolean;
begin
  select exists (
    select 1 from prospects p
    where p.id = p_prospect_id
      and (p.agent_id = auth.uid() or est_dans_ma_downline(p.agent_id))
  ) into v_autorise;

  if not v_autorise then
    raise exception 'prospect_hors_perimetre';
  end if;

  v_token := replace(gen_random_uuid()::text, '-', '') ||
             replace(gen_random_uuid()::text, '-', '');

  insert into acces_prospect (prospect_id, token, cree_par)
  values (p_prospect_id, v_token, auth.uid());

  return v_token;
end $$;

revoke all on function creer_acces_prospect(uuid) from public;
grant execute on function creer_acces_prospect(uuid) to authenticated;


-- ------------------------------------------------------------
--  Verifications
-- ------------------------------------------------------------
select column_name from information_schema.columns
 where table_name = 'prospects' and column_name = 'user_id';

select to_regclass('public.acces_prospect') as acces_prospect;

select proname from pg_proc
 where proname in ('est_un_agent', 'est_un_prospect', 'creer_acces_prospect')
 order by proname;
