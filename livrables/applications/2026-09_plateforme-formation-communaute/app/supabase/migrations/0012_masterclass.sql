-- Masterclass : evenements en direct a venir, visibles par la communaute
-- gratuite (aimant a prospects, meme acces que les prompts, migration
-- 0010), avec inscription. Decision de Zeze le 2026-09-16.

create table if not exists masterclasses (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  titre text not null,
  description text not null default '',
  date_heure timestamptz not null,
  lien text not null,
  created_at timestamptz not null default now()
);

alter table masterclasses enable row level security;

create policy "membre approuve lit les masterclass de son espace"
  on masterclasses for select
  to authenticated
  using (public.a_acces_zone(auth.uid(), espace_id, 'gratuite'));

-- Pas de policy insert/update/delete pour les membres : creation reservee
-- a l'admin (service_role), meme logique que les autres tables de contenu.

create table if not exists inscriptions_masterclass (
  id uuid primary key default gen_random_uuid(),
  masterclass_id uuid not null references masterclasses (id) on delete cascade,
  profil_id uuid not null references profils (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (masterclass_id, profil_id)
);

alter table inscriptions_masterclass enable row level security;

create policy "un membre voit ses propres inscriptions"
  on inscriptions_masterclass for select
  to authenticated
  using (auth.uid() = profil_id);

create policy "un membre approuve s'inscrit lui-meme"
  on inscriptions_masterclass for insert
  to authenticated
  with check (
    profil_id = auth.uid()
    and exists (
      select 1 from masterclasses m
      where m.id = inscriptions_masterclass.masterclass_id
        and public.a_acces_zone(auth.uid(), m.espace_id, 'gratuite')
    )
  );

create policy "un membre retire sa propre inscription"
  on inscriptions_masterclass for delete
  to authenticated
  using (profil_id = auth.uid());
