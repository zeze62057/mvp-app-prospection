-- 0005 : messages de l'assistant IA de l'espace client Chatllow.
--
-- Une conversation continue par client (les anciennes sont archivees). Lecture : le client lit SES messages. Ecriture : uniquement le
-- serveur (cle service), qui enregistre la question puis la reponse. Le serveur compte aussi les
-- messages du jour pour appliquer la limite d'usage.

create table if not exists public.chatllow_messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.chatllow_clients (profil_id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  contenu text not null check (char_length(contenu) between 1 and 12000),
  -- "Nouvelle conversation" archive les messages au lieu de les supprimer : ils restent comptes dans la
  -- limite quotidienne (sinon un client remettrait son compteur a zero en effacant son fil).
  archive boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists chatllow_messages_client_idx on public.chatllow_messages (client_id, created_at);

alter table public.chatllow_messages enable row level security;

drop policy if exists "un client lit ses messages" on public.chatllow_messages;
create policy "un client lit ses messages"
  on public.chatllow_messages for select to authenticated
  using (auth.uid() = client_id);

revoke all on public.chatllow_messages from anon, authenticated;
grant select on public.chatllow_messages to authenticated;
