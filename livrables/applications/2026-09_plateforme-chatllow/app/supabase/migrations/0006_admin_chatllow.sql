-- 0006 : administrateurs de l'espace Chatllow.
--
-- Un compte est administrateur Chatllow s'il a une ligne ici. Le titulaire lit sa propre ligne (pour que
-- l'application sache s'il a acces a /admin) ; personne ne peut ecrire depuis le navigateur. L'ajout d'un
-- administrateur se fait avec la cle serveur.
--
-- Fichiers livres : limite de taille du bucket portee a 50 Mo. Les envois passent par un lien d'envoi
-- temporaire genere par le serveur (pas par le serveur lui-meme, limite a 4,5 Mo sur Vercel).

create table if not exists public.chatllow_admins (
  profil_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.chatllow_admins enable row level security;

drop policy if exists "un admin lit sa ligne" on public.chatllow_admins;
create policy "un admin lit sa ligne"
  on public.chatllow_admins for select to authenticated
  using (auth.uid() = profil_id);

revoke all on public.chatllow_admins from anon, authenticated;
grant select on public.chatllow_admins to authenticated;

update storage.buckets set file_size_limit = 52428800 where id = 'chatllow-livrables';
