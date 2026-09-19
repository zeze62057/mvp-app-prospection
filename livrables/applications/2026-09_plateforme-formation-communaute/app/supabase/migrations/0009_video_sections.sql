-- Videos de cours (screencast enregistres par l'admin, voir CADRAGE.md
-- section 7 "outil d'enregistrement video integre"). Rattachees directement
-- a une section. Bucket Storage prive : la lecture suit exactement la meme
-- regle d'acces que modules/sections (acces payant, voir migration 0008),
-- l'upload ne passe jamais par le navigateur avec le JWT du membre, donc
-- aucune policy insert/update n'est necessaire ici (voir route handler
-- /api/admin/video, qui utilise le client service_role apres verification
-- du role admin).

alter table sections add column if not exists video_path text;

insert into storage.buckets (id, name, public)
values ('videos-cours', 'videos-cours', false)
on conflict (id) do nothing;

drop policy if exists "lecture video section si acces payant" on storage.objects;
create policy "lecture video section si acces payant"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'videos-cours'
    and exists (
      select 1 from sections s
      join modules m on m.id = s.module_id
      where s.id::text = split_part(storage.objects.name, '.', 1)
        and public.a_acces_zone(auth.uid(), m.espace_id, 'payante')
    )
  );
