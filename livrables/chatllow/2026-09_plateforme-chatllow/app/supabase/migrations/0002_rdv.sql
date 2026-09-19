-- Capture des demandes de RDV Chatllow. Meme convention que 0001 :
-- table prefixee chatllow_ dans le schema public, RLS insert-only,
-- pas de select pour anon/authenticated (lisible seulement via le
-- service role, futur panneau admin).

create table if not exists public.chatllow_rdv (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  jour text not null,
  heure text not null,
  created_at timestamptz not null default now()
);

alter table public.chatllow_rdv enable row level security;

create policy "quiconque reserve un rdv"
  on public.chatllow_rdv for insert
  to anon, authenticated
  with check (true);
