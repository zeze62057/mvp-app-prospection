-- Comptes membres, demandes d'acces a un espace (approbation manuelle
-- obligatoire pour la communaute gratuite, voir CADRAGE.md section 6),
-- et premier fil de posts texte.

create table if not exists profils (
  id uuid primary key references auth.users (id) on delete cascade,
  pseudo text not null,
  role text not null default 'membre' check (role in ('membre', 'admin')),
  created_at timestamptz not null default now()
);

alter table profils enable row level security;

create policy "un membre voit son propre profil"
  on profils for select
  using (auth.uid() = id);

create policy "un membre modifie son propre profil"
  on profils for update
  using (auth.uid() = id);

-- Cree automatiquement un profil a l'inscription (auth.users est gere par Supabase,
-- on ne peut pas y ecrire depuis le produit sans ce declencheur).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profils (id, pseudo)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'pseudo', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists adhesions (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade,
  espace_id uuid not null references espaces (id) on delete cascade,
  statut text not null default 'en_attente' check (statut in ('en_attente', 'approuve', 'refuse')),
  created_at timestamptz not null default now(),
  traite_at timestamptz,
  unique (profil_id, espace_id)
);

alter table adhesions enable row level security;

create policy "un membre voit sa propre demande d'adhesion"
  on adhesions for select
  using (auth.uid() = profil_id);

create policy "un membre demande lui-meme son adhesion"
  on adhesions for insert
  with check (auth.uid() = profil_id);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  auteur_id uuid not null references profils (id) on delete cascade,
  contenu text not null,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

create policy "un membre approuve lit les posts de son espace"
  on posts for select
  using (
    exists (
      select 1 from adhesions a
      where a.profil_id = auth.uid()
        and a.espace_id = posts.espace_id
        and a.statut = 'approuve'
    )
  );

create policy "un membre approuve publie dans son espace"
  on posts for insert
  with check (
    auteur_id = auth.uid()
    and exists (
      select 1 from adhesions a
      where a.profil_id = auth.uid()
        and a.espace_id = posts.espace_id
        and a.statut = 'approuve'
    )
  );
