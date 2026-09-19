-- Capture des leads du diagnostic public Chatllow. Table prefixee
-- chatllow_ dans le schema public du meme projet Supabase que Vivier
-- Academies (decision du 2026-09-16 : evite d'exposer un schema separe
-- via l'API Data, qui demanderait une etape manuelle dans le dashboard).
--
-- Pas de politique select pour anon/authenticated : les reponses ne
-- sont lisibles que via le service role (futur panneau admin cote
-- Zeze), jamais par le visiteur lui-meme apres soumission.

create table if not exists public.chatllow_diagnostics (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  reponse_1 text not null,
  reponse_2 text not null,
  reponse_3 text not null,
  pilote_recommande text,
  created_at timestamptz not null default now()
);

alter table public.chatllow_diagnostics enable row level security;

create policy "quiconque soumet un diagnostic"
  on public.chatllow_diagnostics for insert
  to anon, authenticated
  with check (true);
