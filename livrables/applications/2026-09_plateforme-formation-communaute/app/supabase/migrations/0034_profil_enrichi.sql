-- Lot 7 : profil enrichi. Un membre peut renseigner une bio, sa ville et un lien. Ces trois
-- champs sont facultatifs et visibles des seuls membres de l'espace (via profil_membre,
-- migration 0032), comme le pseudo et la photo.
--
-- Droits : un membre ne modifie toujours que ses propres champs listes ici (pseudo, photo,
-- bio, ville, lien). Le role et les points restent hors de portee (voir migration 0027).
--
-- Le lien doit etre une adresse http(s) sans espace : la base refuse "javascript:" et tout
-- autre schema, pour qu'un lien de profil ne puisse jamais executer du code.

alter table profils
  add column if not exists bio text,
  add column if not exists ville text,
  add column if not exists lien text;

alter table profils drop constraint if exists profils_bio_longueur_check;
alter table profils
  add constraint profils_bio_longueur_check check (bio is null or length(bio) <= 300);

alter table profils drop constraint if exists profils_ville_longueur_check;
alter table profils
  add constraint profils_ville_longueur_check check (ville is null or length(ville) <= 80);

alter table profils drop constraint if exists profils_lien_check;
alter table profils
  add constraint profils_lien_check
  check (lien is null or (length(lien) <= 200 and lien ~* '^https?://[^[:space:]<>"]+$'));

grant update (bio, ville, lien) on public.profils to authenticated;

-- Le profil public renvoie maintenant aussi ces trois champs. Le type de retour change :
-- il faut supprimer puis recreer la fonction.
drop function if exists public.profil_membre(uuid, uuid);

create function public.profil_membre(p_espace uuid, p_profil uuid)
returns table (
  id uuid,
  pseudo text,
  avatar_path text,
  role text,
  points integer,
  est_expert boolean,
  membre_depuis timestamptz,
  bio text,
  ville text,
  lien text
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
  select m.id, m.pseudo, m.avatar_path, m.role, m.points, m.est_expert, m.membre_depuis,
         pr.bio, pr.ville, pr.lien
  from public.membres_espace(p_espace) m
  join profils pr on pr.id = m.id
  where m.id = p_profil;
end;
$$;

revoke all on function public.profil_membre(uuid, uuid) from public, anon;
grant execute on function public.profil_membre(uuid, uuid) to authenticated;
