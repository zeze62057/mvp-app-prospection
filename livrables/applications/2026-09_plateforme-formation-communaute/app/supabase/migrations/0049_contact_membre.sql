-- 0049 : prenom, nom et telephone demandes a la creation du compte.
--
-- Table separee de profils, volontairement : la policy "un membre voit les profils de ses espaces"
-- ouvre la lecture de TOUTES les colonnes de profils aux autres membres. Un telephone ajoute la-bas
-- serait lisible par n'importe quel membre avec la cle publique. Ici, seul le titulaire lit sa ligne ;
-- l'admin la lit avec le client serveur (service role), qui contourne les regles de lecture.
--
-- Aucune ecriture depuis le produit : la ligne est creee par le declencheur d'inscription, a partir des
-- metadonnees du compte. Les comptes existants n'ont pas de ligne (pas de donnees inventees).

create table if not exists public.profils_contact (
  profil_id uuid primary key references public.profils (id) on delete cascade,
  prenom text not null,
  nom text not null,
  telephone text not null,
  created_at timestamptz not null default now()
);

alter table public.profils_contact enable row level security;

drop policy if exists "un membre lit son contact" on public.profils_contact;
create policy "un membre lit son contact"
  on public.profils_contact for select
  to authenticated
  using (auth.uid() = profil_id);

revoke all on public.profils_contact from anon, authenticated;
grant select on public.profils_contact to authenticated;

-- Declencheur d'inscription : meme comportement qu'avant, plus la ligne de contact quand les trois
-- valeurs sont fournies (comptes crees par l'admin ou par un script : pas de ligne, pas d'erreur).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_prenom text := btrim(coalesce(new.raw_user_meta_data ->> 'prenom', ''));
  v_nom text := btrim(coalesce(new.raw_user_meta_data ->> 'nom', ''));
  v_tel text := btrim(coalesce(new.raw_user_meta_data ->> 'telephone', ''));
begin
  insert into public.profils (id, pseudo)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'pseudo', split_part(new.email, '@', 1)));

  if v_prenom <> '' and v_nom <> '' and v_tel <> '' then
    insert into public.profils_contact (profil_id, prenom, nom, telephone)
    values (new.id, left(v_prenom, 80), left(v_nom, 80), left(v_tel, 30));
  end if;
  return new;
end;
$$;
