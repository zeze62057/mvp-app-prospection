-- Le diagnostic passe de 3 a 7 questions (decision du 2026-09-17) et va
-- probablement continuer a evoluer : reponse_1/2/3 en colonnes fixes
-- n'a plus de sens, remplace par un tableau jsonb qui encaisse tout
-- changement futur sans nouvelle migration de structure.

alter table public.chatllow_diagnostics
  add column if not exists reponses jsonb not null default '[]'::jsonb;

alter table public.chatllow_diagnostics drop column if exists reponse_1;
alter table public.chatllow_diagnostics drop column if exists reponse_2;
alter table public.chatllow_diagnostics drop column if exists reponse_3;

alter table public.chatllow_diagnostics alter column reponses drop default;
