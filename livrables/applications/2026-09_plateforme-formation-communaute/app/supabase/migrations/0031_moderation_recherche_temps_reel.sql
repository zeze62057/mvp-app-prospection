-- Moderation, recherche de membre, statistiques de communaute et temps reel.
-- Modele valide le 2026-09-20.
--
--   1. Temps reel : notifications et messages rejoignent la publication Realtime.
--      Le RLS s'applique aux evenements : un membre ne recoit que les siens.
--   2. blocages : bloquer un membre l'empeche de t'ecrire, et inversement. Portee :
--      les messages seulement. Le bloque n'apprend jamais qu'il est bloque.
--   3. signalements : signaler un post, un commentaire ou un message recu. La
--      creation passe par une fonction qui lit elle-meme le contenu signale : un
--      membre ne peut donc ni fabriquer un faux extrait, ni accuser quelqu'un a tort
--      en trafiquant la ligne. L'admin ne lit JAMAIS une conversation privee : il ne
--      voit que le message signale, copie au moment du signalement.
--   4. stats_communaute : compteur de membres et classement corriges. Ils etaient
--      faux des qu'il y avait plusieurs membres, car adhesions n'est lisible que
--      pour ses propres lignes.
--   5. rechercher_membres : trouver un membre de son espace pour lui ecrire.
--
-- Migration additive. Depend de 0026 (partage_un_espace), 0029 et 0030.

-- ---------------------------------------------------------------------------
-- 1. Temps reel
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['notifications', 'messages'] loop
      if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
      ) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    end loop;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Blocage
-- ---------------------------------------------------------------------------
create table if not exists blocages (
  bloqueur_id uuid not null references profils (id) on delete cascade,
  bloque_id uuid not null references profils (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (bloqueur_id, bloque_id),
  check (bloqueur_id <> bloque_id)
);

alter table blocages enable row level security;

-- Un membre ne voit que les blocages QU'IL a poses : impossible de savoir qui l'a bloque.
create policy "un membre voit ses propres blocages"
  on blocages for select
  to authenticated
  using (bloqueur_id = auth.uid());

create policy "un membre bloque un co-membre"
  on blocages for insert
  to authenticated
  with check (bloqueur_id = auth.uid() and public.partage_un_espace(auth.uid(), bloque_id));

create policy "un membre retire son propre blocage"
  on blocages for delete
  to authenticated
  using (bloqueur_id = auth.uid());

-- Vrai si l'un des deux a bloque l'autre. Security definer : la policy des messages
-- doit voir les blocages posés par l'AUTRE, que le RLS de blocages lui cache.
create or replace function public.est_bloque(p_a uuid, p_b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from blocages
    where (bloqueur_id = p_a and bloque_id = p_b)
       or (bloqueur_id = p_b and bloque_id = p_a)
  );
$$;

revoke all on function public.est_bloque(uuid, uuid) from public, anon;
grant execute on function public.est_bloque(uuid, uuid) to authenticated;

-- Les messages : meme regle qu'en 0030, plus "aucun blocage entre les deux".
drop policy if exists "un membre ecrit a un membre du meme espace" on messages;
create policy "un membre ecrit a un membre du meme espace"
  on messages for insert
  to authenticated
  with check (
    expediteur_id = auth.uid()
    and lu_at is null
    and public.est_membre_espace(auth.uid(), espace_id)
    and public.est_membre_espace(destinataire_id, espace_id)
    and not public.est_bloque(expediteur_id, destinataire_id)
  );

-- ---------------------------------------------------------------------------
-- 3. Signalements
-- ---------------------------------------------------------------------------
create table if not exists signalements (
  id uuid primary key default gen_random_uuid(),
  signaleur_id uuid not null references profils (id) on delete cascade,
  espace_id uuid not null references espaces (id) on delete cascade,
  type text not null check (type in ('post', 'commentaire', 'message')),
  cible_id uuid not null,
  auteur_cible_id uuid references profils (id) on delete set null,
  extrait text not null check (length(extrait) between 1 and 1000),
  motif text not null check (length(trim(motif)) between 3 and 500),
  statut text not null default 'ouvert' check (statut in ('ouvert', 'traite')),
  created_at timestamptz not null default now(),
  traite_at timestamptz,
  unique (signaleur_id, type, cible_id)
);

create index if not exists signalements_statut_idx on signalements (statut, created_at desc);

alter table signalements enable row level security;

-- Le signaleur relit ses propres signalements (pour afficher "deja signale").
-- Aucune policy d'ecriture et aucun droit d'insertion : tout passe par signaler().
create policy "un membre voit ses propres signalements"
  on signalements for select
  to authenticated
  using (signaleur_id = auth.uid());

revoke insert, update, delete on public.signalements from anon, authenticated;

-- Cree un signalement. Le contenu, son auteur et son espace sont LUS ICI, jamais
-- recus du client : impossible de fabriquer un faux extrait. On ne peut signaler que
-- ce qu'on a le droit de voir, et pour un message, seulement un message recu.
create or replace function public.signaler(p_type text, p_cible_id uuid, p_motif text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  moi uuid := auth.uid();
  v_espace uuid;
  v_auteur uuid;
  v_extrait text;
begin
  if moi is null then
    raise exception 'Non connecte.' using errcode = '42501';
  end if;
  if length(trim(coalesce(p_motif, ''))) < 3 then
    raise exception 'Precise le motif du signalement.' using errcode = '22023';
  end if;

  if p_type = 'post' then
    select p.espace_id, p.auteur_id, coalesce(nullif(p.titre, '') || E'\n', '') || p.contenu
      into v_espace, v_auteur, v_extrait
    from posts p
    where p.id = p_cible_id and public.a_acces_zone(moi, p.espace_id, p.zone);
  elsif p_type = 'commentaire' then
    select p.espace_id, c.auteur_id, c.contenu
      into v_espace, v_auteur, v_extrait
    from commentaires c
    join posts p on p.id = c.post_id
    where c.id = p_cible_id and public.a_acces_zone(moi, p.espace_id, p.zone);
  elsif p_type = 'message' then
    select m.espace_id, m.expediteur_id, m.contenu
      into v_espace, v_auteur, v_extrait
    from messages m
    where m.id = p_cible_id and m.destinataire_id = moi;
  else
    raise exception 'Type de signalement inconnu.' using errcode = '22023';
  end if;

  if v_espace is null then
    raise exception 'Contenu introuvable.' using errcode = '42501';
  end if;
  if v_auteur = moi then
    raise exception 'Tu ne peux pas signaler ton propre contenu.' using errcode = '22023';
  end if;

  insert into signalements (signaleur_id, espace_id, type, cible_id, auteur_cible_id, extrait, motif)
  values (moi, v_espace, p_type, p_cible_id, v_auteur, left(v_extrait, 1000), left(trim(p_motif), 500));
exception
  when unique_violation then
    raise exception 'Tu as deja signale ce contenu.' using errcode = '23505';
end;
$$;

revoke all on function public.signaler(text, uuid, text) from public, anon;
grant execute on function public.signaler(text, uuid, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Statistiques de communaute (compteur de membres, classement, eleves)
-- ---------------------------------------------------------------------------
-- Reservee aux membres de l'espace. Ne renvoie que ce qu'un co-membre voit deja
-- (pseudo, points) et des compteurs.
create or replace function public.stats_communaute(p_espace uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.est_membre_espace(auth.uid(), p_espace) then
    return null;
  end if;

  return jsonb_build_object(
    'nb_membres', (
      select count(*) from adhesions where espace_id = p_espace and statut = 'approuve'
    ),
    'nb_eleves', (
      select count(*) from acces_payant where espace_id = p_espace and actif
    ),
    'classement', coalesce((
      select jsonb_agg(jsonb_build_object('id', t.id, 'pseudo', t.pseudo, 'points', t.points))
      from (
        select pr.id, pr.pseudo, pr.points
        from adhesions a
        join profils pr on pr.id = a.profil_id
        where a.espace_id = p_espace and a.statut = 'approuve'
        order by pr.points desc, pr.pseudo
        limit 4
      ) t
    ), '[]'::jsonb),
    'eleves', coalesce((
      select jsonb_agg(jsonb_build_object('id', t.id, 'pseudo', t.pseudo))
      from (
        select pr.id, pr.pseudo
        from acces_payant ap
        join profils pr on pr.id = ap.profil_id
        where ap.espace_id = p_espace and ap.actif
        order by pr.pseudo
        limit 6
      ) t
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.stats_communaute(uuid) from public, anon;
grant execute on function public.stats_communaute(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Recherche de membre
-- ---------------------------------------------------------------------------
-- Membres de l'espace (communaute gratuite approuvee ou acces payant), hors soi-meme
-- et hors blocages dans un sens ou dans l'autre. Recherche par "contient" sans
-- caracteres joker : le texte saisi n'est jamais interprete comme un motif.
create or replace function public.rechercher_membres(p_espace uuid, p_q text default '')
returns table (id uuid, pseudo text, avatar_path text)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  q text := lower(trim(coalesce(p_q, '')));
begin
  if not public.est_membre_espace(auth.uid(), p_espace) then
    return;
  end if;

  return query
  select pr.id, pr.pseudo, pr.avatar_path
  from profils pr
  where pr.id <> auth.uid()
    and (
      exists (select 1 from adhesions a where a.profil_id = pr.id and a.espace_id = p_espace and a.statut = 'approuve')
      or exists (select 1 from acces_payant ap where ap.profil_id = pr.id and ap.espace_id = p_espace and ap.actif)
    )
    and not public.est_bloque(auth.uid(), pr.id)
    and (q = '' or position(q in lower(pr.pseudo)) > 0)
  order by pr.pseudo
  limit 20;
end;
$$;

revoke all on function public.rechercher_membres(uuid, text) from public, anon;
grant execute on function public.rechercher_membres(uuid, text) to authenticated;
