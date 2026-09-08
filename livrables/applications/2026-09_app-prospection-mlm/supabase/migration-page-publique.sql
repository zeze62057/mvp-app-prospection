-- ============================================================
--  Kora — Migration : personnalisation de la page publique par agent
-- ============================================================
--  Ajoute :
--    1. Colonnes agents.landing_*        -> textes + medias de la landing, par agent
--    2. Bucket Storage "landing-public"  -> photos / videos televersees
--    3. Policies Storage                 -> chaque agent n'ecrit que dans SON dossier
--    4. RPC agent_public_landing(slug)   -> lecture publique du contenu d'un agent
--
--  A executer : Supabase > SQL Editor > New query > coller > Run.
--  Idempotent : peut etre relance sans casse.
--
--  Prerequis : schema.sql + migration-tunnel-public.sql deja passes
--  (colonnes agents.slug / agents.actif, RPC agent_public_nom).
--  Independant de migration-veille-sociale.sql.
-- ============================================================


-- ------------------------------------------------------------
--  1. Contenu de la landing, par agent (NULL = valeur par defaut cote app)
-- ------------------------------------------------------------
--  On ne pose PAS de "default" SQL : les valeurs par defaut (le texte
--  actuel de index.html) vivent dans le front (landing.js / kora-store.js),
--  pour rester la source unique et gerer le jeton {agent} du sous-titre.
--  NULL sur une colonne = "l'agent n'a rien personnalise, on affiche le defaut".

alter table agents add column if not exists landing_badge      text;
alter table agents add column if not exists landing_titre      text;
alter table agents add column if not exists landing_sous_titre text;
alter table agents add column if not exists landing_cta        text;
alter table agents add column if not exists landing_preuve     text;
alter table agents add column if not exists landing_photo_url  text;
alter table agents add column if not exists landing_video_url  text;

--  L'ecriture est deja couverte par la policy agents_update existante :
--    using (id = auth.uid()) with check (id = auth.uid())
--  -> un agent ne peut modifier que SA propre ligne. Rien a ajouter ici.


-- ------------------------------------------------------------
--  2. Bucket de stockage des medias de landing
-- ------------------------------------------------------------
--  public = true : une landing est publique, l'image/video doit etre lisible
--  sans session. Les fichiers sont ranges par dossier <agent_id>/.
--
--  ⚠️ A VALIDER (non specifie dans la demande) :
--    - file_size_limit : laisse a NULL -> utilise la limite globale du projet
--      Supabase (50 Mo par defaut). A ajuster ici si une limite dediee est
--      voulue (ex. 5 Mo pour les photos). Le front verifie aussi file.size.
--    - allowed_mime_types : liste ci-dessous a titre de defaut raisonnable.
--      A elargir / restreindre selon ce qui est decide. NULL = tout accepter.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'landing-public',
  'landing-public',
  true,
  null,                                   -- ⚠️ A VALIDER : limite de taille
  array[                                  -- ⚠️ A VALIDER : formats acceptes
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      allowed_mime_types = excluded.allowed_mime_types;


-- ------------------------------------------------------------
--  3. Policies Storage sur storage.objects (RLS deja active par Supabase)
-- ------------------------------------------------------------
--  Lecture : publique pour ce bucket (landing visible sans session).
--  Ecriture / maj / suppression : uniquement par l'agent connecte, et
--  uniquement sur les fichiers de SON dossier <auth.uid()>/...
--  storage.foldername(name) renvoie le tableau des segments du chemin ;
--  [1] est le premier dossier, ici l'id de l'agent.

do $$ begin
  create policy "landing-public: lecture publique"
    on storage.objects for select
    using ( bucket_id = 'landing-public' );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "landing-public: ecriture dans son dossier"
    on storage.objects for insert to authenticated
    with check (
      bucket_id = 'landing-public'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "landing-public: maj de ses fichiers"
    on storage.objects for update to authenticated
    using (
      bucket_id = 'landing-public'
      and (storage.foldername(name))[1] = auth.uid()::text
    )
    with check (
      bucket_id = 'landing-public'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "landing-public: suppression de ses fichiers"
    on storage.objects for delete to authenticated
    using (
      bucket_id = 'landing-public'
      and (storage.foldername(name))[1] = auth.uid()::text
    );
exception when duplicate_object then null; end $$;


-- ------------------------------------------------------------
--  4. Lecture publique du contenu de landing d'un agent
-- ------------------------------------------------------------
--  Meme logique que agent_public_nom : la RLS de agents interdit la
--  lecture anonyme, donc SECURITY DEFINER. Ne renvoie que du contenu
--  destine a etre affiche publiquement (aucune donnee sensible).

create or replace function agent_public_landing(agent_slug text)
returns table (
  nom_complet        text,
  landing_badge      text,
  landing_titre      text,
  landing_sous_titre text,
  landing_cta        text,
  landing_preuve     text,
  landing_photo_url  text,
  landing_video_url  text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    a.nom_complet,
    a.landing_badge,
    a.landing_titre,
    a.landing_sous_titre,
    a.landing_cta,
    a.landing_preuve,
    a.landing_photo_url,
    a.landing_video_url
  from agents a
  where a.slug = agent_slug and a.actif = true;
$$;

revoke all on function agent_public_landing(text) from public;
grant execute on function agent_public_landing(text) to anon, authenticated;


-- ------------------------------------------------------------
--  Verifications
-- ------------------------------------------------------------
select column_name from information_schema.columns
 where table_name = 'agents' and column_name like 'landing_%'
 order by column_name;

select id, public, allowed_mime_types from storage.buckets where id = 'landing-public';

select policyname from pg_policies
 where schemaname = 'storage' and tablename = 'objects'
   and policyname like 'landing-public%'
 order by policyname;

select proname from pg_proc where proname = 'agent_public_landing';
