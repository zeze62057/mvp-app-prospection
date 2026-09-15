-- Table espaces : une formation hebergee sur Vivier Academies (Vivier IA, Bâtisseur Pro, etc.)
-- Voir CADRAGE.md section 0 : un espace est un concept generique, jamais code en dur par nom.

create table if not exists espaces (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  nom text not null,
  tagline text not null default '',
  prix integer not null,
  devise text not null default 'GNF',
  actif boolean not null default true,
  created_at timestamptz not null default now()
);

insert into espaces (slug, nom, tagline, prix, devise, actif)
values ('vivier-ia', 'Vivier IA', 'Le vivier des talents IA francophones', 250000, 'GNF', true)
on conflict (slug) do nothing;
