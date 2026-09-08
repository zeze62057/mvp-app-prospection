-- ============================================================
--  MVP App Prospection MLM  —  schéma de base de données
-- ============================================================
--  À copier-coller tel quel dans Supabase > SQL Editor > Run.
--  Ne pas exécuter depuis un autre contexte : ce fichier est destiné
--  à être lancé manuellement par BONJOUR.
--
--  Source unique de vérité : schema-base-de-donnees.md (schéma validé
--  le 2026-09-07). Rien n'est ajouté au-delà de ce document.
--  Chaque point non tranché dans le document est signalé par un bloc
--  "-- ⚠️ À VALIDER" et n'est PAS implémenté.
--
--  Remarque : un brouillon plus large existe dans supabase/schema.sql.
--  Il contient des objets absents du schéma validé (colonne slug,
--  RPC de formulaire public, trigger de création de profil). Le présent
--  fichier s'en tient strictement au document validé.
--
--  À exécuter sur une base neuve.
-- ============================================================


-- ============================================================
--  0. EXTENSIONS
-- ============================================================
create extension if not exists pgcrypto;   -- fournit gen_random_uuid()


-- ============================================================
--  1. TYPES ÉNUMÉRÉS
-- ============================================================

-- Statut du prospect. Valeurs et ordre repris tels quels de schema-base-de-donnees.md.
--   nouveau         -> « Nouveau »
--   contacte        -> « Contacté »
--   dans_le_tunnel  -> « Dans le tunnel »
--   interesse       -> « Intéressé »
--   en_negociation  -> « En négociation »
--   close_gagne     -> « Closé gagné »
--   close_perdu     -> « Closé perdu »
create type prospect_statut as enum (
  'nouveau',
  'contacte',
  'dans_le_tunnel',
  'interesse',
  'en_negociation',
  'close_gagne',
  'close_perdu'
);

-- Voie de création du prospect (trace la provenance, pas un canal marketing).
create type mode_creation_prospect as enum (
  'manuel',
  'formulaire_public'
);


-- ============================================================
--  2. FONCTION UTILITAIRE : updated_at
-- ============================================================
--  Le document impose « updated_at maintenu par trigger » sur chaque table.
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;


-- ============================================================
--  3. TABLES
-- ============================================================

-- ------------------------------------------------------------
--  3.1  agents
--       Profil applicatif de l'agent, 1 pour 1 avec auth.users.
-- ------------------------------------------------------------
create table agents (
  id          uuid        primary key references auth.users(id) on delete cascade,
  nom_complet text        not null,
  email       text,
  parrain_id  uuid        references agents(id),   -- null = racine (BONJOUR)
  actif       boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index agents_parrain_id_idx on agents(parrain_id);

create trigger agents_set_updated_at
  before update on agents
  for each row execute function set_updated_at();

-- ⚠️ À VALIDER (agents)
--   - « slug unique par agent » est demandé dans la consigne, mais AUCUNE
--     colonne slug n'est définie dans schema-base-de-donnees.md. Non ajoutée.
--     Si retenue :  alter table agents add column slug text unique;
--   - Unicité de `email` : non spécifiée dans le document. Aucune contrainte posée.
--   - Colonne `role` (agent / chef d'équipe / admin) : listée « à valider », non ajoutée.
--   - Désactivation d'un compte (actif = false) : sort du périmètre de ce DDL
--     (que deviennent ses prospects et sa downline ? non tranché).


-- ------------------------------------------------------------
--  3.2  prospects
-- ------------------------------------------------------------
create table prospects (
  id            uuid                   primary key default gen_random_uuid(),
  agent_id      uuid                   not null references agents(id),
  nom           text                   not null,
  telephone     text,
  email         text,
  statut        prospect_statut        not null default 'nouveau',
  mode_creation mode_creation_prospect not null,
  created_at    timestamptz            not null default now(),
  updated_at    timestamptz            not null default now(),
  -- « au moins un moyen de contact » — le document précise « à confirmer ».
  constraint prospects_contact_present check (telephone is not null or email is not null)
);

create index prospects_agent_id_idx     on prospects(agent_id);
create index prospects_statut_idx       on prospects(statut);
create index prospects_agent_statut_idx on prospects(agent_id, statut);

create trigger prospects_set_updated_at
  before update on prospects
  for each row execute function set_updated_at();

-- ⚠️ À VALIDER (prospects)
--   - Champs de contact limités à nom / telephone / email. Le document laisse
--     ouverts « ville, réseau social, profession... » et lesquels sont obligatoires.
--   - Contrainte prospects_contact_present : marquée « à confirmer » dans le document.
--   - Champ « source » marketing (canal, campagne) : non ajouté (voir document).
--   - agent_id NOT NULL : cohérent avec « rattachement obligatoire ». Mais la règle
--     d'attribution d'un prospect issu du formulaire public n'est PAS tranchée
--     (voir section 6 et schema-base-de-donnees.md).
--   - Transitions de statut : libres entre les 7 valeurs ici. Le document demande
--     de valider s'il faut contraindre l'ordre du pipeline (machine à états).


-- ------------------------------------------------------------
--  3.3  interactions   (historique de suivi)
-- ------------------------------------------------------------
create table interactions (
  id          uuid        primary key default gen_random_uuid(),
  prospect_id uuid        not null references prospects(id) on delete cascade,
  agent_id    uuid        not null references agents(id),
  type        text,       -- liste de valeurs « à définir » (document)
  contenu     text,
  created_at  timestamptz not null default now()
);

create index interactions_prospect_id_idx on interactions(prospect_id, created_at);


-- ------------------------------------------------------------
--  3.4  changements_statut   (journal d'audit des transitions)
-- ------------------------------------------------------------
create table changements_statut (
  id             uuid            primary key default gen_random_uuid(),
  prospect_id    uuid            not null references prospects(id) on delete cascade,
  agent_id       uuid            not null references agents(id),
  ancien_statut  prospect_statut,                 -- null à la création du prospect
  nouveau_statut prospect_statut not null,
  created_at     timestamptz     not null default now()
);

create index changements_statut_prospect_id_idx on changements_statut(prospect_id, created_at);

-- Alimentation proposée par le document : trigger « after insert or update of
-- statut on prospects » qui insère automatiquement une ligne.
create or replace function log_changement_statut() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    insert into changements_statut (prospect_id, agent_id, ancien_statut, nouveau_statut)
    values (new.id, new.agent_id, null, new.statut);
  elsif new.statut is distinct from old.statut then
    insert into changements_statut (prospect_id, agent_id, ancien_statut, nouveau_statut)
    values (new.id, coalesce(auth.uid(), new.agent_id), old.statut, new.statut);
  end if;
  return new;
end $$;

create trigger prospects_log_statut
  after insert or update of statut on prospects
  for each row execute function log_changement_statut();

-- ⚠️ À VALIDER (changements_statut)
--   - Le document propose EN ALTERNATIVE de supprimer cette table et de tracer
--     les changements de statut comme des interactions typées. Choix non arbitré.
--   - Ce trigger écrit dans changements_statut. Selon la policy INSERT retenue
--     (section 5.4), il pourra devoir être déclaré SECURITY DEFINER pour ne pas
--     être bloqué par la RLS. Non fait ici pour rester au plus près du document.


-- ============================================================
--  4. FONCTION DE DOWNLINE (hiérarchie multi-niveaux)
-- ============================================================
--  Reprise telle quelle de schema-base-de-donnees.md.
--  SECURITY DEFINER : parcourt `agents` sans être bloquée par la RLS.
create or replace function est_dans_ma_downline(cible uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with recursive downline as (
    select id from agents where parrain_id = auth.uid()
    union all
    select a.id from agents a
    join downline d on a.parrain_id = d.id
  )
  select exists (select 1 from downline where id = cible);
$$;

-- ⚠️ À VALIDER (downline)
--   - « union all » sans détection de cycle : un parrain_id formant une boucle
--     (saisi à la main) ferait boucler la récursion et casserait toutes les
--     lectures RLS des utilisateurs concernés. Alternatives : « union »
--     (dédoublonne), clause CYCLE, ou table de fermeture. Laissé « union all »
--     pour rester fidèle au document ; à trancher.
--   - Implémentation : fonction récursive vs table de fermeture
--     agent_hierarchie(ancetre_id, descendant_id, profondeur) — non tranché.


-- ============================================================
--  5. ROW LEVEL SECURITY
-- ============================================================
--  Objectif (document) : chaque agent accède à ses prospects ET à ceux de toute
--  sa downline en LECTURE ; l'ÉCRITURE reste réservée à l'agent propriétaire.

alter table agents             enable row level security;
alter table prospects          enable row level security;
alter table interactions       enable row level security;
alter table changements_statut enable row level security;

-- ------------------------------------------------------------
--  5.1  agents
-- ------------------------------------------------------------
create policy agents_select on agents
  for select to authenticated
  using (id = auth.uid() or est_dans_ma_downline(id));

create policy agents_update on agents
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ⚠️ À VALIDER (agents / INSERT)
--   Le document indique « insert géré à l'inscription » et renvoie à « ⚠️ à
--   valider » (auto-inscription ? invitation ? création manuelle par BONJOUR ?).
--   Donc : AUCUNE policy INSERT n'est créée ici, et AUCUN trigger
--   auth.users -> agents n'est ajouté. À définir avant mise en service.

-- ------------------------------------------------------------
--  5.2  prospects
-- ------------------------------------------------------------
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

-- ⚠️ À VALIDER (prospects)
--   - DELETE : le document note « autorisation de suppression à confirmer ».
--   - RÉATTRIBUTION PAR LE PARRAIN : la consigne demande une règle
--     « réattribution des prospects réservée au parrain pour ses filleuls ».
--     schema-base-de-donnees.md ne la définit PAS : l'UPDATE y est réservé au
--     propriétaire (agent_id = auth.uid()). Elle n'est donc pas implémentée.
--     Piste à valider (colonnes/attributs d'une réattribution non spécifiés) :
--       -- create policy prospects_reassign on prospects
--       --   for update to authenticated
--       --   using  (est_dans_ma_downline(agent_id))
--       --   with check (est_dans_ma_downline(agent_id));
--     Point ouvert : cette policy autoriserait aussi à modifier d'autres champs
--     que agent_id ; restreindre la réattribution à la seule colonne agent_id
--     demande une fonction dédiée, non spécifiée.

-- ------------------------------------------------------------
--  5.3  interactions
--       select : autorisé si le prospect parent est visible (même règle que prospects).
--       insert : agent_id = auth.uid() ET prospect parent visible.
-- ------------------------------------------------------------
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
    and exists (
      select 1 from prospects p
      where p.id = interactions.prospect_id
        and (p.agent_id = auth.uid() or est_dans_ma_downline(p.agent_id))
    )
  );

-- ⚠️ À VALIDER (interactions / INSERT)
--   Le document dit « prospect parent visible », ce qui inclut la downline :
--   un parrain pourrait donc journaliser une interaction sur le prospect d'un
--   filleul. Si l'écriture doit être strictement réservée au propriétaire,
--   remplacer la sous-requête par «  p.agent_id = auth.uid()  ».

-- ------------------------------------------------------------
--  5.4  changements_statut
-- ------------------------------------------------------------
create policy changements_statut_select on changements_statut
  for select to authenticated
  using (exists (
    select 1 from prospects p
    where p.id = changements_statut.prospect_id
      and (p.agent_id = auth.uid() or est_dans_ma_downline(p.agent_id))
  ));

create policy changements_statut_insert on changements_statut
  for insert to authenticated
  with check (
    agent_id = auth.uid()
    and exists (
      select 1 from prospects p
      where p.id = changements_statut.prospect_id
        and (p.agent_id = auth.uid() or est_dans_ma_downline(p.agent_id))
    )
  );

-- ⚠️ À VALIDER (changements_statut / INSERT)
--   Cette policy suppose que c'est l'agent connecté qui écrit la ligne. Or le
--   trigger log_changement_statut (section 3.4) s'exécute aussi lors d'un INSERT
--   de prospect et, à terme, lors d'une création par le formulaire public
--   (sans auth.uid()). Selon la voie retenue, passer le trigger en
--   SECURITY DEFINER, ou ajuster cette policy. Non tranché ici.


-- ============================================================
--  6. VOIE DU FORMULAIRE PUBLIC   —   NON IMPLÉMENTÉE
-- ============================================================
-- ⚠️ À VALIDER
--   schema-base-de-donnees.md décrit une fonction SECURITY DEFINER (ou une Edge
--   Function) exposée sans session, qui :
--     1. force statut = 'nouveau' et mode_creation = 'formulaire_public',
--     2. renseigne agent_id « selon la règle d'attribution retenue »,
--     3. n'accepte que les champs nom, telephone, email.
--   Le point (2) n'est PAS tranché (une landing par agent ? tout vers BONJOUR ?
--   file « à attribuer » avec agent_id nullable ?). Tant que cette règle n'est
--   pas fixée, la fonction n'est pas écrite ici (sa signature en dépend).
--
--   Squelette indicatif, à compléter APRÈS décision (ne pas exécuter tel quel) :
--
--   -- create or replace function soumettre_prospect_public(
--   --   p_nom text, p_telephone text default null, p_email text default null
--   --   /* + un moyen d'identifier l'agent cible, à définir */
--   -- ) returns uuid
--   -- language plpgsql security definer set search_path = public as $$
--   -- declare v_agent uuid; v_id uuid;
--   -- begin
--   --   -- v_agent := ... (règle d'attribution à définir)
--   --   if p_nom is null or length(trim(p_nom)) = 0 then raise exception 'nom_requis'; end if;
--   --   if coalesce(trim(p_telephone),'') = '' and coalesce(trim(p_email),'') = ''
--   --     then raise exception 'contact_requis'; end if;
--   --   insert into prospects (agent_id, nom, telephone, email, statut, mode_creation)
--   --   values (v_agent, trim(p_nom),
--   --           nullif(trim(coalesce(p_telephone,'')),''),
--   --           nullif(trim(coalesce(p_email,'')),''),
--   --           'nouveau', 'formulaire_public')
--   --   returning id into v_id;
--   --   return v_id;
--   -- end $$;


-- ============================================================
--  7. POINTS DEMANDÉS MAIS ABSENTS DU SCHÉMA VALIDÉ
-- ============================================================
-- ⚠️ À VALIDER  —  non créés, car non définis dans schema-base-de-donnees.md :
--
--   - TABLE « liens d'invitation ».
--     Le schéma validé ne comporte que 4 tables : agents, prospects,
--     interactions, changements_statut. Aucune table d'invitations.
--     Si le parrainage doit passer par des liens traçables, définir d'abord ses
--     colonnes (token unique, parrain_id, email invité, statut, expires_at,
--     used_at, agent_cree_id...) et ses règles, puis les ajouter.
--
--   - COLONNE agents.slug + contrainte d'unicité par agent.
--     Aucune colonne slug dans le schéma validé (voir 3.1).
--
--   - POLICY de réattribution des prospects par le parrain (voir 5.2).
--
--   - CONTRAINTES D'UNICITÉ additionnelles : le schéma validé ne spécifie que
--     les clés primaires. Ni agents.email, ni un slug, ni un couple de colonnes
--     ne sont marqués uniques dans le document.
--
-- ============================================================
--  FIN
-- ============================================================
