-- Fil de contenu educatif gratuit (onglet "Contenu"), distinct du fil
-- communaute (victoires/questions des membres, table posts). Articles
-- publies par Zeze, pas par les membres. Acces 'gratuite' comme
-- Prompts/Masterclass/RDV.
--
-- Pas de formulaire admin de redaction pour l'instant : la publication
-- sera geree par un agent programme plus tard (decision de Zeze le
-- 2026-09-16). En attendant, les lignes s'inserent directement en base
-- (service_role) ou via ce futur agent, jamais via une policy insert
-- ouverte aux membres.

create table if not exists contenus (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  titre text not null,
  corps text not null,
  created_at timestamptz not null default now()
);

alter table contenus enable row level security;

create policy "membre approuve lit le contenu de son espace"
  on contenus for select
  to authenticated
  using (public.a_acces_zone(auth.uid(), espace_id, 'gratuite'));
