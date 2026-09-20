-- Notifications (lot C) : un like ou un commentaire recu sur son post, et (0030)
-- un message recu. Avec compteur de non lues dans la barre de navigation.
--
-- Les notifications sont creees par des triggers (security definer), jamais par
-- le client : un membre ne peut donc ni en fabriquer pour un autre, ni en
-- fabriquer de fausses pour lui-meme. Il peut seulement lire les siennes, les
-- marquer lues (colonne "lu" uniquement) et les supprimer.

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  profil_id uuid not null references profils (id) on delete cascade, -- destinataire
  acteur_id uuid not null references profils (id) on delete cascade, -- qui a agi
  espace_id uuid not null references espaces (id) on delete cascade,
  type text not null check (type in ('like', 'commentaire', 'message')),
  post_id uuid references posts (id) on delete cascade,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_destinataire_idx
  on notifications (profil_id, lu, created_at desc);

-- Un meme membre qui like, retire son like puis re-like ne genere qu'une notification.
create unique index if not exists notifications_like_unique
  on notifications (profil_id, acteur_id, post_id) where type = 'like';

-- Plusieurs messages non lus d'un meme expediteur ne forment qu'une notification.
create unique index if not exists notifications_message_non_lu
  on notifications (profil_id, acteur_id, espace_id) where type = 'message' and not lu;

alter table notifications enable row level security;

create policy "un membre lit ses notifications"
  on notifications for select
  to authenticated
  using (profil_id = auth.uid());

create policy "un membre marque ses notifications lues"
  on notifications for update
  to authenticated
  using (profil_id = auth.uid())
  with check (profil_id = auth.uid());

create policy "un membre supprime ses notifications"
  on notifications for delete
  to authenticated
  using (profil_id = auth.uid());

-- Seule la colonne "lu" est modifiable par un membre (pas le destinataire, ni le type).
revoke update on public.notifications from anon, authenticated;
grant update (lu) on public.notifications to authenticated;
revoke insert on public.notifications from anon, authenticated;

-- Like recu -> notification a l'auteur du post (jamais pour son propre like).
create or replace function public.notifier_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  auteur uuid;
  espace uuid;
begin
  select auteur_id, espace_id into auteur, espace from posts where id = new.post_id;
  if auteur is not null and auteur <> new.profil_id then
    insert into notifications (profil_id, acteur_id, espace_id, type, post_id)
    values (auteur, new.profil_id, espace, 'like', new.post_id)
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists notifier_like_trigger on post_votes;
create trigger notifier_like_trigger
  after insert on post_votes
  for each row execute function public.notifier_like();

-- Like retire -> la notification disparait (elle n'a plus de sens).
create or replace function public.retirer_notification_like()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from notifications
  where type = 'like' and acteur_id = old.profil_id and post_id = old.post_id;
  return old;
end;
$$;

drop trigger if exists retirer_notification_like_trigger on post_votes;
create trigger retirer_notification_like_trigger
  after delete on post_votes
  for each row execute function public.retirer_notification_like();

-- Commentaire recu -> notification a l'auteur du post (jamais pour son propre commentaire).
create or replace function public.notifier_commentaire()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  auteur uuid;
  espace uuid;
begin
  select auteur_id, espace_id into auteur, espace from posts where id = new.post_id;
  if auteur is not null and auteur <> new.auteur_id then
    insert into notifications (profil_id, acteur_id, espace_id, type, post_id)
    values (auteur, new.auteur_id, espace, 'commentaire', new.post_id);
  end if;
  return new;
end;
$$;

drop trigger if exists notifier_commentaire_trigger on commentaires;
create trigger notifier_commentaire_trigger
  after insert on commentaires
  for each row execute function public.notifier_commentaire();
