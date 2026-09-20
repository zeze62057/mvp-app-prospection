-- Lot 2 : niveaux personnalisables par espace, masterclass reservables a un niveau minimum, et
-- correctif des points gagnes en likant son propre post.
--
-- 1. Correctif : liker son propre post donnait un point. Cela n'avait pas d'importance tant que
--    les niveaux ne debloquaient rien ; des qu'un niveau ouvre un contenu, c'est une faille.
--    Un like de son propre post ne donne plus de point, et les points deja gagnes ainsi sont retires.
-- 2. Niveaux : chaque espace peut nommer ses niveaux et fixer les points necessaires. Sans reglage,
--    les seuils historiques restent (0, 10, 30, 80, 200 points, "Niveau 1" a "Niveau 5").
-- 3. Masterclass : un niveau minimum par masterclass. Sous ce niveau, la masterclass n'est pas
--    renvoyee du tout par la base (ni lien, ni description) : c'est le RLS qui verrouille, pas la page.
--    Une fonction ne renvoie que le titre, la date et le niveau requis, pour afficher un cadenas.

-- ---------------------------------------------------------------------------
-- 1. Points : plus de point pour un like de son propre post
-- ---------------------------------------------------------------------------
create or replace function public.appliquer_vote_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  auteur uuid;
begin
  if tg_op = 'INSERT' then
    select auteur_id into auteur from posts where id = new.post_id;
    if auteur is not null and auteur <> new.profil_id then
      update profils set points = points + 1 where id = auteur;
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    select auteur_id into auteur from posts where id = old.post_id;
    if auteur is not null and auteur <> old.profil_id then
      update profils set points = points - 1 where id = auteur;
    end if;
    return old;
  end if;
  return null;
end;
$$;

-- Retire les points deja gagnes en likant son propre post (jamais sous zero). Les likes eux-memes
-- restent : seuls les points changent.
update profils p
set points = greatest(p.points - s.n, 0)
from (
  select po.auteur_id, count(*)::int as n
  from post_votes v
  join posts po on po.id = v.post_id
  where v.profil_id = po.auteur_id
  group by po.auteur_id
) s
where s.auteur_id = p.id;

-- ---------------------------------------------------------------------------
-- 2. Niveaux par espace
-- ---------------------------------------------------------------------------
create table if not exists niveaux_espace (
  espace_id uuid not null references espaces (id) on delete cascade,
  niveau integer not null check (niveau between 1 and 9),
  libelle text not null check (length(trim(libelle)) between 1 and 30),
  points_requis integer not null check (points_requis >= 0),
  primary key (espace_id, niveau)
);

alter table niveaux_espace enable row level security;

-- Lecture : les membres de l'espace (les libelles s'affichent a cote des pseudos). L'ecriture n'a
-- pas de policy : seul le service_role (actions admin) peut ecrire.
create policy "un membre lit les niveaux de son espace"
  on niveaux_espace for select
  to authenticated
  using (
    public.a_acces_zone(auth.uid(), espace_id, 'gratuite')
    or public.a_acces_zone(auth.uid(), espace_id, 'payante')
  );

revoke all on public.niveaux_espace from anon;
revoke insert, update, delete on public.niveaux_espace from authenticated;

-- Niveau de l'utilisateur connecte dans un espace. Un admin est au niveau maximum (99). Le niveau
-- est le plus haut dont les points requis sont atteints ; le niveau 1 est toujours acquis.
-- Ne prend que l'espace : on ne peut interroger que son propre niveau.
create or replace function public.niveau_actuel(p_espace uuid)
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  pts integer;
  r text;
begin
  select points, role into pts, r from profils where id = auth.uid();
  if r is null then
    return 0;
  end if;
  if r = 'admin' then
    return 99;
  end if;

  if exists (select 1 from niveaux_espace where espace_id = p_espace) then
    return coalesce(
      (select max(niveau) from niveaux_espace where espace_id = p_espace and points_requis <= pts),
      1
    );
  end if;

  return case
    when pts >= 200 then 5
    when pts >= 80 then 4
    when pts >= 30 then 3
    when pts >= 10 then 2
    else 1
  end;
end;
$$;

revoke all on function public.niveau_actuel(uuid) from public, anon;
grant execute on function public.niveau_actuel(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Masterclass reservables a un niveau
-- ---------------------------------------------------------------------------
alter table masterclasses
  add column if not exists niveau_min integer not null default 1 check (niveau_min between 1 and 9);

drop policy if exists "membre approuve lit les masterclass de son espace" on masterclasses;
create policy "membre approuve lit les masterclass de son espace"
  on masterclasses for select
  to authenticated
  using (
    public.a_acces_zone(auth.uid(), espace_id, 'gratuite')
    and public.niveau_actuel(espace_id) >= niveau_min
  );

-- Les masterclass a venir que l'utilisateur ne peut pas encore ouvrir : titre, date et niveau
-- requis seulement. Ni lien, ni description.
create or replace function public.masterclasses_verrouillees(p_espace uuid)
returns table (
  id uuid,
  titre text,
  date_heure timestamptz,
  niveau_min integer
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.a_acces_zone(auth.uid(), p_espace, 'gratuite') then
    return;
  end if;

  return query
  select m.id, m.titre, m.date_heure, m.niveau_min
  from masterclasses m
  where m.espace_id = p_espace
    and m.date_heure > now()
    and m.niveau_min > public.niveau_actuel(p_espace)
  order by m.date_heure;
end;
$$;

revoke all on function public.masterclasses_verrouillees(uuid) from public, anon;
grant execute on function public.masterclasses_verrouillees(uuid) to authenticated;
