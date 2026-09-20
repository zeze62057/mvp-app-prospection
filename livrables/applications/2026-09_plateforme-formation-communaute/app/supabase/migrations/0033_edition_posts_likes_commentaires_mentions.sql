-- Lot 6 : modifier et supprimer son propre post, likes sur les commentaires, mentions @.
--
-- 1. Posts : un membre peut modifier le titre, le texte et la categorie de SON post, et le
--    supprimer. Aucune autre colonne n'est modifiable par un membre (droits par colonne) :
--    ni la date de creation, ni l'auteur, ni la zone, ni l'espace, ni l'epinglage, ni l'image.
-- 2. Likes sur les commentaires : meme visibilite que le commentaire. Ils ne donnent ni point
--    ni notification (choix volontaire, un like de post donne deja des points).
-- 3. Mentions : ecrire @pseudo dans un post ou un commentaire previent le membre nomme, s'il
--    peut lire ce contenu. Deux membres au meme pseudo sont prevenus tous les deux.

-- ---------------------------------------------------------------------------
-- 1. Modifier et supprimer son propre post
-- ---------------------------------------------------------------------------
alter table posts add column if not exists modifie_le timestamptz;

-- Longueur du texte imposee aussi par la base (l'API la verifie deja, mais un appel direct
-- a PostgREST la contournait). "not valid" : ne teste que les lignes ecrites a partir de maintenant.
alter table posts drop constraint if exists posts_contenu_longueur_check;
alter table posts
  add constraint posts_contenu_longueur_check
  check (length(trim(contenu)) between 1 and 5000) not valid;

create or replace function public.marquer_post_modifie()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.titre is distinct from old.titre or new.contenu is distinct from old.contenu then
    new.modifie_le := now();
  end if;
  return new;
end;
$$;

drop trigger if exists marquer_post_modifie_trigger on posts;
create trigger marquer_post_modifie_trigger
  before update of titre, contenu on posts
  for each row execute function public.marquer_post_modifie();

-- Droits par colonne : sans cela, la policy d'update ci-dessous laisserait un membre changer
-- created_at, magnet_texte, etc. Le service_role (admin) n'est pas concerne.
revoke update on public.posts from anon, authenticated;
grant update (titre, contenu, categorie_id) on public.posts to authenticated;

drop policy if exists "un membre modifie son propre post" on posts;
create policy "un membre modifie son propre post"
  on posts for update
  to authenticated
  using (auteur_id = auth.uid() and public.a_acces_zone(auth.uid(), espace_id, zone))
  with check (auteur_id = auth.uid() and public.a_acces_zone(auth.uid(), espace_id, zone));

-- Supprimer son post reste possible meme apres avoir perdu l'acces a la zone : c'est son contenu.
-- Commentaires, likes et notifications du post partent avec lui (on delete cascade). Un
-- signalement deja fait garde l'extrait copie au moment du signalement.
drop policy if exists "un membre supprime son propre post" on posts;
create policy "un membre supprime son propre post"
  on posts for delete
  to authenticated
  using (auteur_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 2. Likes sur les commentaires
-- ---------------------------------------------------------------------------
create table if not exists commentaire_votes (
  id uuid primary key default gen_random_uuid(),
  commentaire_id uuid not null references commentaires (id) on delete cascade,
  profil_id uuid not null references profils (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (commentaire_id, profil_id)
);

create index if not exists commentaire_votes_commentaire_idx on commentaire_votes (commentaire_id);

alter table commentaire_votes enable row level security;

create policy "acces zone lecture likes commentaires"
  on commentaire_votes for select
  to authenticated
  using (
    exists (
      select 1
      from commentaires c
      join posts p on p.id = c.post_id
      where c.id = commentaire_votes.commentaire_id
        and public.a_acces_zone(auth.uid(), p.espace_id, p.zone)
    )
  );

create policy "un membre like un commentaire qu'il peut lire"
  on commentaire_votes for insert
  to authenticated
  with check (
    profil_id = auth.uid()
    and exists (
      select 1
      from commentaires c
      join posts p on p.id = c.post_id
      where c.id = commentaire_votes.commentaire_id
        and public.a_acces_zone(auth.uid(), p.espace_id, p.zone)
    )
  );

create policy "un membre retire son propre like de commentaire"
  on commentaire_votes for delete
  to authenticated
  using (profil_id = auth.uid());

-- Un like ne se modifie jamais : on le pose ou on le retire.
revoke all on public.commentaire_votes from anon;
revoke update on public.commentaire_votes from authenticated;

-- ---------------------------------------------------------------------------
-- 3. Mentions @pseudo
-- ---------------------------------------------------------------------------
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications
  add constraint notifications_type_check
  check (type in ('like', 'commentaire', 'message', 'mention'));

-- Un meme membre ne mentionne qu'une fois un autre membre par post (modifier un post ou
-- commenter a nouveau ne renvoie pas de notification).
create unique index if not exists notifications_mention_unique
  on notifications (profil_id, acteur_id, post_id) where type = 'mention';

-- Notifie les membres nommes dans un texte. Non appelable par un client : seuls les
-- triggers ci-dessous l'utilisent.
create or replace function public.notifier_mentions(
  p_auteur uuid,
  p_espace uuid,
  p_zone text,
  p_post uuid,
  p_texte text,
  p_exclu uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_texte is null or position('@' in p_texte) = 0 then
    return;
  end if;

  -- Le pseudo est echappe (tout caractere qui n'est ni lettre, ni chiffre, ni espace recoit
  -- un antislash) pour ne jamais etre interprete comme un motif. Le motif exige que le
  -- pseudo ne soit pas suivi d'une lettre, d'un chiffre ou d'un souligne : "@Marie" ne
  -- designe pas "Marielle".
  insert into notifications (profil_id, acteur_id, espace_id, type, post_id)
  select m.id, p_auteur, p_espace, 'mention', p_post
  from public.membres_espace(p_espace) m
  where m.id <> p_auteur
    and (p_exclu is null or m.id <> p_exclu)
    and length(trim(m.pseudo)) >= 2
    and p_texte ~* (
      '@' || regexp_replace(m.pseudo, '([^[:alnum:][:space:]])', '\\\1', 'g') || '(?![[:alnum:]_])'
    )
    and public.a_acces_zone(m.id, p_espace, p_zone)
  limit 20
  on conflict do nothing;
end;
$$;

revoke execute on function public.notifier_mentions(uuid, uuid, text, uuid, text, uuid)
  from public, anon, authenticated;

create or replace function public.notifier_mentions_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notifier_mentions(
    new.auteur_id, new.espace_id, new.zone, new.id,
    coalesce(new.titre, '') || ' ' || new.contenu, null
  );
  return new;
end;
$$;

drop trigger if exists notifier_mentions_post_trigger on posts;
create trigger notifier_mentions_post_trigger
  after insert or update of titre, contenu on posts
  for each row execute function public.notifier_mentions_post();

-- Sur un commentaire, l'auteur du post est deja prevenu ("a commente ton post") : on ne lui
-- envoie pas en plus une mention.
create or replace function public.notifier_mentions_commentaire()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_espace uuid;
  v_zone text;
  v_auteur_post uuid;
begin
  select p.espace_id, p.zone, p.auteur_id into v_espace, v_zone, v_auteur_post
  from posts p where p.id = new.post_id;
  if v_espace is not null then
    perform public.notifier_mentions(new.auteur_id, v_espace, v_zone, new.post_id, new.contenu, v_auteur_post);
  end if;
  return new;
end;
$$;

drop trigger if exists notifier_mentions_commentaire_trigger on commentaires;
create trigger notifier_mentions_commentaire_trigger
  after insert on commentaires
  for each row execute function public.notifier_mentions_commentaire();

revoke execute on function public.notifier_mentions_post() from public, anon, authenticated;
revoke execute on function public.notifier_mentions_commentaire() from public, anon, authenticated;
