-- ============================================================
--  Kora — Migration : positionnement agent + contenu IA quotidien
-- ============================================================
--  1. agents.positionnement_situation / positionnement_ton
--  2. table contenus_generes  -> posts generes (IA ou manuel), par agent
--  3. table canva_templates   -> 1 template Canva par ton (rempli plus tard
--     par BONJOUR ; l'autofill Canva est un module separe, non branche ici)
--
--  A executer : Supabase > SQL Editor > New query > coller > Run.
--  Idempotent. Ne PAS executer automatiquement (Claude n'a pas d'acces DB).
--  Prerequis : schema.sql (table agents).
-- ============================================================


-- ------------------------------------------------------------
--  1. Positionnement de l'agent (situation + ton)
-- ------------------------------------------------------------
--  Stocke en text (cles courtes), libelles cote app. NULL = questionnaire
--  pas encore rempli -> l'app force le passage par positionnement.html.
--  Cles situation : etudiant | parent_foyer | reconversion | sans_emploi
--                 | entrepreneur_diversification | jeune_diplome
--  Cles ton       : inspirant | pedagogue | direct | humoristique | preuve_sociale

alter table agents add column if not exists positionnement_situation text;
alter table agents add column if not exists positionnement_ton       text;

--  Ecriture couverte par la policy agents_update existante
--  (using / with check : id = auth.uid()). Rien a ajouter.


-- ------------------------------------------------------------
--  2. Contenus generes (1 ligne par generation)
-- ------------------------------------------------------------
create table if not exists contenus_generes (
  id         uuid primary key default gen_random_uuid(),
  agent_id   uuid not null references agents(id) on delete cascade,
  jour       date not null default current_date,
  hook       text,
  texte      text,
  ton        text,            -- ton utilise pour cette generation
  situation  text,            -- situation utilisee pour cette generation
  source     text not null default 'ia',   -- 'ia' | 'manuel'
  created_at timestamptz not null default now()
);

create index if not exists contenus_generes_agent_idx
  on contenus_generes (agent_id, jour desc, created_at desc);

alter table contenus_generes enable row level security;

do $$ begin
  create policy contenus_generes_select on contenus_generes
    for select to authenticated using (agent_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy contenus_generes_insert on contenus_generes
    for insert to authenticated with check (agent_id = auth.uid());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy contenus_generes_delete on contenus_generes
    for delete to authenticated using (agent_id = auth.uid());
exception when duplicate_object then null; end $$;


-- ------------------------------------------------------------
--  3. Templates Canva par ton (module image, a brancher plus tard)
-- ------------------------------------------------------------
--  BONJOUR remplit template_id (et champ_texte = nom du champ de texte
--  du template ou inserer le hook) quand les templates sont prets.
--  L'autofill Canva lui-meme (API Canva Connect) n'est PAS implemente ici :
--  il faut un jeton Canva + l'API Autofill (acces partenaire). Voir CONTENU-IA.md.

create table if not exists canva_templates (
  ton          text primary key,     -- inspirant | pedagogue | direct | humoristique | preuve_sociale
  template_id  text,                 -- id du brand template Canva (NULL tant que pas cree)
  champ_texte  text,                 -- nom du champ de texte du template pour le hook
  updated_at   timestamptz not null default now()
);

insert into canva_templates (ton) values
  ('inspirant'), ('pedagogue'), ('direct'), ('humoristique'), ('preuve_sociale')
on conflict (ton) do nothing;

alter table canva_templates enable row level security;

do $$ begin
  create policy canva_templates_select on canva_templates
    for select to authenticated using (true);
exception when duplicate_object then null; end $$;

--  Ecriture reservee a l'agent racine (BONJOUR : parrain_id is null).
do $$ begin
  create policy canva_templates_write on canva_templates
    for all to authenticated
    using (exists (select 1 from agents a where a.id = auth.uid() and a.parrain_id is null))
    with check (exists (select 1 from agents a where a.id = auth.uid() and a.parrain_id is null));
exception when duplicate_object then null; end $$;


-- ------------------------------------------------------------
--  Verifications
-- ------------------------------------------------------------
select column_name from information_schema.columns
 where table_name = 'agents' and column_name like 'positionnement_%'
 order by column_name;

select to_regclass('public.contenus_generes') as contenus_generes,
       to_regclass('public.canva_templates')  as canva_templates;

select ton, template_id from canva_templates order by ton;
