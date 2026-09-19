-- Habillage reel du fil communaute : tag par post, votes persistes,
-- points/niveau calcules a partir des votes recus.

alter table posts
  add column if not exists tag text not null default 'victoire'
  check (tag in ('victoire', 'question', 'annonce'));

alter table profils
  add column if not exists points integer not null default 0;

create table if not exists post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts (id) on delete cascade,
  profil_id uuid not null references profils (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, profil_id)
);

alter table post_votes enable row level security;

create policy "un membre approuve voit les votes de son espace"
  on post_votes for select
  using (
    exists (
      select 1 from posts p
      join adhesions a on a.espace_id = p.espace_id
      where p.id = post_votes.post_id
        and a.profil_id = auth.uid()
        and a.statut = 'approuve'
    )
  );

create policy "un membre approuve vote dans son espace"
  on post_votes for insert
  with check (
    profil_id = auth.uid()
    and exists (
      select 1 from posts p
      join adhesions a on a.espace_id = p.espace_id
      where p.id = post_votes.post_id
        and a.profil_id = auth.uid()
        and a.statut = 'approuve'
    )
  );

create policy "un membre retire son propre vote"
  on post_votes for delete
  using (profil_id = auth.uid());

-- Un vote (ajout/retrait) modifie les points de l'AUTEUR du post, jamais
-- ceux du votant : la policy RLS sur profils ne l'autoriserait pas, d'ou
-- le security definer ici (seul chemin legitime pour ce cas precis).
create or replace function public.appliquer_vote_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  auteur uuid;
begin
  if tg_op = 'INSERT' then
    select auteur_id into auteur from posts where id = new.post_id;
    update profils set points = points + 1 where id = auteur;
    return new;
  elsif tg_op = 'DELETE' then
    select auteur_id into auteur from posts where id = old.post_id;
    update profils set points = points - 1 where id = auteur;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists on_post_vote_change on post_votes;
create trigger on_post_vote_change
  after insert or delete on post_votes
  for each row execute procedure public.appliquer_vote_points();
