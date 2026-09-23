-- Trois fonctions reelles pour remplacer les derniers "Bientot disponible"
-- (mission "ajoute les tous", 2026-09-23) : reactions multiples sur un post
-- (like/coeur/rire), pieces jointes de post (video en lien, fichier uploade,
-- lien), et objectifs personnels d'un eleve.

-- 1. Reactions multiples : une seule reaction par membre et par post (comme avant),
-- mais le type est desormais choisi (like/coeur/rire) au lieu d'un simple like.
-- Le trigger de points (migration 0036) compte deja "select count(*) from
-- post_votes" sans regarder le type : aucune reaction, quel que soit son type,
-- ne change son fonctionnement. Idem pour le trigger de notification (0029).
alter table post_votes
  add column if not exists type text not null default 'like' check (type in ('like', 'coeur', 'rire'));

-- 2. Pieces jointes de post. Video en lien (YouTube ou autre) : jamais de gros
-- fichier video televerse par la route /api/posts, qui passerait par Vercel
-- (limite ~4,5 Mo par requete sur l'offre gratuite, meme contrainte deja
-- documentee pour l'envoi des videos de cours). Fichier : upload reel, petits
-- documents seulement (meme principe que les images de post deja en place).
alter table posts add column if not exists video_url text;
alter table posts add column if not exists fichier_path text;
alter table posts add column if not exists fichier_nom text;
alter table posts add column if not exists lien_url text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'posts-fichiers',
  'posts-fichiers',
  false,
  10485760,
  array['application/pdf', 'application/zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
on conflict (id) do nothing;

drop policy if exists "lecture fichier de post si membre de l'espace" on storage.objects;
create policy "lecture fichier de post si membre de l'espace"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'posts-fichiers'
    and exists (
      select 1 from posts p
      where p.id::text = split_part(storage.objects.name, '/', 1)
        and public.a_acces_zone(auth.uid(), p.espace_id, p.zone)
    )
  );

-- 3. Objectifs personnels : texte libre de l'eleve, coche quand atteint. Rien
-- a voir avec les objectifs pedagogiques du programme (modules/sections), ce
-- sont des notes que l'eleve se fixe lui-meme, comme sur la capture de reference.
create table if not exists objectifs_eleve (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade,
  espace_id uuid not null references espaces (id) on delete cascade,
  texte text not null,
  atteint boolean not null default false,
  created_at timestamptz not null default now()
);

alter table objectifs_eleve enable row level security;

create policy "un eleve gere ses propres objectifs"
  on objectifs_eleve for all
  to authenticated
  using (profil_id = auth.uid())
  with check (profil_id = auth.uid());
