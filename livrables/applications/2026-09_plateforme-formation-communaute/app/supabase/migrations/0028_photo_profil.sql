-- Photo de profil (lot B) : chaque membre peut envoyer sa photo.
--
-- La photo est stockee dans un bucket PRIVE, sans policy : le serveur televerse
-- (service_role) et signe des liens temporaires, seulement pour des membres qui
-- partagent un espace. Aucune URL publique.
--
-- Depend de 0027 : depuis ce correctif, un membre ne peut modifier que les
-- colonnes de profils qui recoivent explicitement un GRANT. avatar_path en recoit
-- un ici, role et points n'en recoivent jamais.

alter table profils add column if not exists avatar_path text;

grant update (avatar_path) on public.profils to authenticated;

-- Un membre ne peut pointer que vers un fichier de SON propre dossier : sans cela,
-- il pourrait referencer la photo d'un autre membre et la faire signer par le serveur.
create or replace function public.verifier_avatar()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.avatar_path is not null and new.avatar_path not like new.id::text || '/%' then
    raise exception 'Chemin de photo invalide.';
  end if;
  return new;
end;
$$;

drop trigger if exists verifier_avatar_trigger on profils;
create trigger verifier_avatar_trigger
  before insert or update of avatar_path on profils
  for each row execute function public.verifier_avatar();

-- Chemin : <profil_id>/<uuid>.<ext>. 2 Mo, images seulement.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
