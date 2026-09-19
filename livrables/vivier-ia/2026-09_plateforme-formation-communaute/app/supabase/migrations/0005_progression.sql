-- Suivi de progression reel : modules et sections (contenu reel du
-- programme Ecosysteme Claude pour le Module 1, modules suivants
-- verrouilles sans contenu detaille invente), completion par eleve,
-- et temoignages avec consentement explicite de partage.

create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  ordre integer not null,
  titre text not null,
  unique (espace_id, ordre)
);

create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules (id) on delete cascade,
  ordre integer not null,
  titre text not null,
  unique (module_id, ordre)
);

create table if not exists progression (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade,
  section_id uuid not null references sections (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (profil_id, section_id)
);

create table if not exists temoignages (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade,
  espace_id uuid not null references espaces (id) on delete cascade,
  note integer not null check (note between 1 and 5),
  texte text not null,
  autorise_partage boolean not null default true,
  created_at timestamptz not null default now()
);

alter table modules enable row level security;
alter table sections enable row level security;
alter table progression enable row level security;
alter table temoignages enable row level security;

create policy "membre approuve lit les modules de son espace"
  on modules for select
  using (public.a_acces_zone(auth.uid(), espace_id, 'gratuite'));

create policy "membre approuve lit les sections de son espace"
  on sections for select
  using (
    exists (
      select 1 from modules m
      where m.id = sections.module_id
        and public.a_acces_zone(auth.uid(), m.espace_id, 'gratuite')
    )
  );

create policy "un membre voit sa propre progression"
  on progression for select
  using (auth.uid() = profil_id);

create policy "un membre marque sa propre progression"
  on progression for insert
  with check (
    profil_id = auth.uid()
    and exists (
      select 1 from sections s
      join modules m on m.id = s.module_id
      where s.id = progression.section_id
        and public.a_acces_zone(auth.uid(), m.espace_id, 'gratuite')
    )
  );

create policy "un membre voit ses propres temoignages"
  on temoignages for select
  using (auth.uid() = profil_id);

create policy "un membre envoie son propre temoignage"
  on temoignages for insert
  with check (
    profil_id = auth.uid()
    and public.a_acces_zone(auth.uid(), espace_id, 'gratuite')
  );

-- Seed : programme reel du skill programme-ecosysteme-ia pour Vivier IA.
insert into modules (espace_id, ordre, titre)
select id, 1, 'Module 1 — Ecosysteme Claude' from espaces where slug = 'vivier-ia'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 2, 'Module 2 — n8n' from espaces where slug = 'vivier-ia'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 3, 'Module 3 — Mindset Early Adopter & Business IA' from espaces where slug = 'vivier-ia'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 4, 'Module 4 — RGPD / AI Act' from espaces where slug = 'vivier-ia'
on conflict (espace_id, ordre) do nothing;

insert into modules (espace_id, ordre, titre)
select id, 5, 'Module 5 — Lemlist / prospection froide' from espaces where slug = 'vivier-ia'
on conflict (espace_id, ordre) do nothing;

insert into sections (module_id, ordre, titre)
select m.id, s.ordre, s.titre
from modules m
join espaces e on e.id = m.espace_id and e.slug = 'vivier-ia'
join (values
  (1, 'Les Fondations'),
  (2, 'La Methode'),
  (3, 'Maitriser l''outil'),
  (4, 'Claude Code au quotidien'),
  (5, 'Le Fullstack — projet fil rouge'),
  (6, 'Le Business'),
  (7, 'Hacks & videos bonus')
) as s(ordre, titre) on true
where m.ordre = 1
on conflict (module_id, ordre) do nothing;
