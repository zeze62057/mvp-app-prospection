-- ============================================================
--  Kora — Correctif : bucket + policies Storage de la page publique
-- ============================================================
--  Constat : dans migration-page-publique.sql, la creation du bucket par
--  "insert into storage.buckets (...)" n'a PAS pris effet (le bucket
--  landing-public n'existe pas). Sur Supabase hebergé, la DML directe sur
--  storage.buckets est souvent refusee depuis le SQL Editor.
--
--  Marche a suivre :
--    ETAPE 1 (interface, obligatoire) : Storage > New bucket
--        - Name  : landing-public
--        - Public bucket : ACTIVE
--        - Create
--    ETAPE 2 (ce script) : coller dans SQL Editor > Run
--        Cree les 3 policies d'ecriture limitant chaque agent a son
--        dossier <agent_id>/. (La lecture est publique : un bucket public
--        sert ses fichiers sans policy de lecture.)
--
--  Si le SQL Editor refuse "create policy on storage.objects", faire les
--  policies via Storage > Policies > New policy > modele
--  "Give users access to their own folder", sur le bucket landing-public.
-- ============================================================

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
--  Verifications
-- ------------------------------------------------------------
select id, name, public from storage.buckets where id = 'landing-public';

select policyname, cmd from pg_policies
 where schemaname = 'storage' and tablename = 'objects'
   and policyname like 'landing-public%'
 order by policyname;
