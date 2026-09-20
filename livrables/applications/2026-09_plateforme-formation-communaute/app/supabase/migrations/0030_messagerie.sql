-- Messagerie privee (lot D) : messages entre deux membres du MEME espace.
--
-- Regles validees le 2026-09-20 :
--   - deux membres d'un meme espace (communaute gratuite approuvee, ou acces
--     payant) peuvent s'ecrire, jamais un membre et un non-membre ;
--   - un message n'est lisible que par ses deux participants. Il n'existe aucun
--     chemin de lecture pour l'admin : ni policy, ni fonction ;
--   - texte seul, 2000 caracteres ; ni blocage ni signalement dans cette version.
--
-- Conversation = un couple de membres dans un espace (espace_id est sur chaque
-- message, comme pour les posts).

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  expediteur_id uuid not null references profils (id) on delete cascade,
  destinataire_id uuid not null references profils (id) on delete cascade,
  contenu text not null check (length(trim(contenu)) between 1 and 2000),
  lu_at timestamptz,
  created_at timestamptz not null default now(),
  check (expediteur_id <> destinataire_id)
);

create index if not exists messages_destinataire_idx on messages (destinataire_id, espace_id, created_at desc);
create index if not exists messages_expediteur_idx on messages (expediteur_id, espace_id, created_at desc);

alter table messages enable row level security;

-- Est membre d'un espace : communaute gratuite approuvee OU acces payant actif.
create or replace function public.est_membre_espace(p_profil uuid, p_espace uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.a_acces_zone(p_profil, p_espace, 'gratuite')
      or public.a_acces_zone(p_profil, p_espace, 'payante');
$$;

revoke all on function public.est_membre_espace(uuid, uuid) from public, anon;
grant execute on function public.est_membre_espace(uuid, uuid) to authenticated;

create policy "un participant lit ses messages"
  on messages for select
  to authenticated
  using (expediteur_id = auth.uid() or destinataire_id = auth.uid());

create policy "un membre ecrit a un membre du meme espace"
  on messages for insert
  to authenticated
  with check (
    expediteur_id = auth.uid()
    and lu_at is null
    and public.est_membre_espace(auth.uid(), espace_id)
    and public.est_membre_espace(destinataire_id, espace_id)
  );

-- Le destinataire marque ses messages lus. Seule la colonne lu_at est modifiable :
-- ni le contenu, ni les participants.
create policy "le destinataire marque ses messages lus"
  on messages for update
  to authenticated
  using (destinataire_id = auth.uid())
  with check (destinataire_id = auth.uid());

revoke update on public.messages from anon, authenticated;
grant update (lu_at) on public.messages to authenticated;

-- Message recu -> notification au destinataire (une seule tant qu'elle n'est pas lue).
create or replace function public.notifier_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into notifications (profil_id, acteur_id, espace_id, type)
  values (new.destinataire_id, new.expediteur_id, new.espace_id, 'message')
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists notifier_message_trigger on messages;
create trigger notifier_message_trigger
  after insert on messages
  for each row execute function public.notifier_message();
