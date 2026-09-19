-- Communaute payante : acces distinct des adhesions gratuites (automatique
-- des paiement, jamais approuve manuellement, voir CADRAGE.md section 6),
-- badge et candidature Expert, lead magnets sur les posts.

alter table posts
  add column if not exists zone text not null default 'gratuite'
  check (zone in ('gratuite', 'payante'));

alter table posts
  add column if not exists magnet_texte text;

create table if not exists acces_payant (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade,
  espace_id uuid not null references espaces (id) on delete cascade,
  actif boolean not null default true,
  est_expert boolean not null default false,
  paye_at timestamptz not null default now(),
  unique (profil_id, espace_id)
);

alter table acces_payant enable row level security;

create policy "un membre voit son propre acces payant"
  on acces_payant for select
  using (auth.uid() = profil_id);

-- Pas de policy insert/update pour les membres : seul un chemin service_role
-- (webhook de paiement ou outil admin temporaire) peut accorder cet acces,
-- jamais une approbation manuelle "a la main" par un membre lui-meme.

create table if not exists candidatures_expert (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade,
  espace_id uuid not null references espaces (id) on delete cascade,
  statut text not null default 'en_attente' check (statut in ('en_attente', 'approuve', 'refuse')),
  created_at timestamptz not null default now(),
  unique (profil_id, espace_id)
);

alter table candidatures_expert enable row level security;

create policy "un membre voit sa propre candidature"
  on candidatures_expert for select
  using (auth.uid() = profil_id);

create policy "un membre payant postule lui-meme"
  on candidatures_expert for insert
  with check (
    profil_id = auth.uid()
    and exists (
      select 1 from acces_payant ap
      where ap.profil_id = auth.uid()
        and ap.espace_id = candidatures_expert.espace_id
        and ap.actif = true
    )
  );

-- Verifie l'acces d'un profil a une zone donnee d'un espace (gratuite via
-- adhesion approuvee, payante via acces_payant actif). Factorise pour eviter
-- de dupliquer cette logique dans chaque policy posts/post_votes.
create or replace function public.a_acces_zone(p_profil uuid, p_espace uuid, p_zone text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select case p_zone
    when 'gratuite' then exists (
      select 1 from adhesions
      where profil_id = p_profil and espace_id = p_espace and statut = 'approuve'
    )
    when 'payante' then exists (
      select 1 from acces_payant
      where profil_id = p_profil and espace_id = p_espace and actif = true
    )
    else false
  end;
$$;

drop policy if exists "un membre approuve lit les posts de son espace" on posts;
drop policy if exists "un membre approuve publie dans son espace" on posts;

create policy "acces zone lecture posts"
  on posts for select
  using (public.a_acces_zone(auth.uid(), espace_id, zone));

create policy "acces zone ecriture posts"
  on posts for insert
  with check (auteur_id = auth.uid() and public.a_acces_zone(auth.uid(), espace_id, zone));

drop policy if exists "un membre approuve voit les votes de son espace" on post_votes;
drop policy if exists "un membre approuve vote dans son espace" on post_votes;

create policy "acces zone lecture votes"
  on post_votes for select
  using (
    exists (
      select 1 from posts p
      where p.id = post_votes.post_id
        and public.a_acces_zone(auth.uid(), p.espace_id, p.zone)
    )
  );

create policy "acces zone ecriture votes"
  on post_votes for insert
  with check (
    profil_id = auth.uid()
    and exists (
      select 1 from posts p
      where p.id = post_votes.post_id
        and public.a_acces_zone(auth.uid(), p.espace_id, p.zone)
    )
  );
