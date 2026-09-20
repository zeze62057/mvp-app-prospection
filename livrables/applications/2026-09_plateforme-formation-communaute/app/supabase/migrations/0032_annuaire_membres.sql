-- Annuaire des membres : lister les membres d'un espace, et lire le profil public de l'un
-- d'eux. AUCUNE nouvelle table, AUCUNE nouvelle colonne : seulement des fonctions de lecture.
--
-- Pourquoi des fonctions security definer : adhesions et acces_payant ne sont lisibles que
-- pour ses propres lignes (elles exposent le statut et la date de paiement de chacun). Une
-- fonction ne renvoie que ce qu'un co-membre peut deja voir, plus le badge Expert et la
-- date d'arrivee dans l'espace.
--
-- Ce qui n'est JAMAIS renvoye : e-mail, telephone, montant ou date de paiement, et le fait
-- qu'un membre soit payant ou non. Seul le badge Expert (un statut) est expose.
--
-- Un membre de l'espace = adhesion approuvee (zone gratuite) OU acces payant actif. Le
-- blocage ne cache personne ici : il est limite aux messages (voir migration 0031).

-- Coeur commun, non appelable directement : les deux fonctions publiques ci-dessous
-- verifient d'abord que l'appelant est membre de l'espace.
create or replace function public.membres_espace(p_espace uuid)
returns table (
  id uuid,
  pseudo text,
  avatar_path text,
  role text,
  points integer,
  est_expert boolean,
  membre_depuis timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    pr.id,
    pr.pseudo,
    pr.avatar_path,
    pr.role::text,
    pr.points,
    exists (
      select 1 from acces_payant ap
      where ap.profil_id = pr.id and ap.espace_id = p_espace and ap.actif and ap.est_expert
    ),
    (
      select min(x.arrivee) from (
        select coalesce(a.traite_at, a.created_at) as arrivee
        from adhesions a
        where a.profil_id = pr.id and a.espace_id = p_espace and a.statut = 'approuve'
        union all
        select ap.paye_at
        from acces_payant ap
        where ap.profil_id = pr.id and ap.espace_id = p_espace and ap.actif
      ) x
    )
  from profils pr
  where exists (
          select 1 from adhesions a
          where a.profil_id = pr.id and a.espace_id = p_espace and a.statut = 'approuve'
        )
     or exists (
          select 1 from acces_payant ap
          where ap.profil_id = pr.id and ap.espace_id = p_espace and ap.actif
        );
$$;

revoke all on function public.membres_espace(uuid) from public, anon, authenticated;

-- Liste paginee. Filtre : tous | admins | experts. Tri : alpha | points.
-- La recherche est une recherche de texte simple (position), jamais un motif : un "%"
-- saisi ne renvoie pas tout le monde. `total` est le nombre de membres qui correspondent,
-- pour afficher "Voir plus" sans deuxieme requete.
create or replace function public.annuaire_membres(
  p_espace uuid,
  p_q text default '',
  p_filtre text default 'tous',
  p_tri text default 'alpha',
  p_limite integer default 24,
  p_decalage integer default 0
)
returns table (
  id uuid,
  pseudo text,
  avatar_path text,
  role text,
  points integer,
  est_expert boolean,
  membre_depuis timestamptz,
  total bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  q text := lower(trim(coalesce(p_q, '')));
  lim integer := least(greatest(coalesce(p_limite, 24), 1), 48);
  decal integer := greatest(coalesce(p_decalage, 0), 0);
begin
  if p_filtre not in ('tous', 'admins', 'experts') then
    raise exception 'Filtre inconnu.';
  end if;
  if p_tri not in ('alpha', 'points') then
    raise exception 'Tri inconnu.';
  end if;

  if auth.uid() is null or not public.est_membre_espace(auth.uid(), p_espace) then
    return;
  end if;

  return query
  select m.id, m.pseudo, m.avatar_path, m.role, m.points, m.est_expert, m.membre_depuis,
         count(*) over () as total
  from public.membres_espace(p_espace) m
  where (q = '' or position(q in lower(m.pseudo)) > 0)
    and (
      p_filtre = 'tous'
      or (p_filtre = 'admins' and m.role = 'admin')
      or (p_filtre = 'experts' and m.est_expert)
    )
  order by
    case when p_tri = 'points' then m.points end desc nulls last,
    lower(m.pseudo),
    m.id
  limit lim offset decal;
end;
$$;

revoke all on function public.annuaire_membres(uuid, text, text, text, integer, integer) from public, anon;
grant execute on function public.annuaire_membres(uuid, text, text, text, integer, integer) to authenticated;

-- Profil public d'un membre. Une seule ligne, ou aucune si l'appelant n'est pas membre
-- de l'espace ou si la personne demandee n'en est pas membre.
create or replace function public.profil_membre(p_espace uuid, p_profil uuid)
returns table (
  id uuid,
  pseudo text,
  avatar_path text,
  role text,
  points integer,
  est_expert boolean,
  membre_depuis timestamptz
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.est_membre_espace(auth.uid(), p_espace) then
    return;
  end if;

  return query
  select m.id, m.pseudo, m.avatar_path, m.role, m.points, m.est_expert, m.membre_depuis
  from public.membres_espace(p_espace) m
  where m.id = p_profil;
end;
$$;

revoke all on function public.profil_membre(uuid, uuid) from public, anon;
grant execute on function public.profil_membre(uuid, uuid) to authenticated;
