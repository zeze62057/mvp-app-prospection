-- Le dernier admin ne peut pas perdre son role (decision du 2026-09-24, lot 3 des pouvoirs
-- d'administration : promouvoir et retirer un admin depuis l'interface).
--
-- Le controle existe deja dans l'action serveur ; ce declencheur le rend vrai pour la base elle-meme,
-- quel que soit le chemin (action, script, SQL a la main) : sans lui, une erreur de code ou un
-- appel direct pourrait laisser la plateforme sans aucun administrateur.
--
-- Il ne bloque que le changement de role. Passer un membre en admin, ou retirer le role a un admin
-- quand il en reste un autre, fonctionne normalement.

create or replace function public.proteger_dernier_admin()
returns trigger
language plpgsql
as $$
begin
  if old.role = 'admin'
     and new.role is distinct from 'admin'
     and not exists (select 1 from public.profils where role = 'admin' and id <> old.id) then
    raise exception 'Le dernier admin ne peut pas etre retire.';
  end if;
  return new;
end;
$$;

drop trigger if exists proteger_dernier_admin_trigger on public.profils;
create trigger proteger_dernier_admin_trigger
  before update of role on public.profils
  for each row execute function public.proteger_dernier_admin();
