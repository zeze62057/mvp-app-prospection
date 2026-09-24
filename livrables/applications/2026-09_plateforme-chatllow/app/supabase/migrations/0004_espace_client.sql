-- 0004 : espace client Chatllow (comptes clients, projets, livrables).
--
-- Meme projet Supabase que Vivier Academies : tables prefixees chatllow_. Trois regles :
--   1. Pas d'inscription publique. Un compte client est cree par le cabinet (script serveur). L'acces
--      a l'espace client exige une ligne dans chatllow_clients : un compte Vivier n'y entre pas.
--   2. Tout est en lecture seule pour le client, limite a SES lignes. Aucune ecriture depuis le
--      navigateur : le cabinet ajoute projets et livrables avec la cle serveur.
--   3. Les fichiers livres sont confidentiels : bucket prive, aucune policy, donc lisible seulement
--      par le serveur, qui verifie le proprietaire puis genere un lien temporaire.

create table if not exists public.chatllow_clients (
  profil_id uuid primary key references auth.users (id) on delete cascade,
  entreprise text not null,
  contact text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.chatllow_projets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.chatllow_clients (profil_id) on delete cascade,
  titre text not null,
  description text,
  statut text not null default 'en_cours' check (statut in ('a_venir', 'en_cours', 'termine')),
  avancement integer not null default 0 check (avancement between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.chatllow_livrables (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.chatllow_clients (profil_id) on delete cascade,
  projet_id uuid references public.chatllow_projets (id) on delete set null,
  categorie text not null check (categorie in ('strategie', 'analyse', 'documentation', 'ressource')),
  titre text not null,
  description text,
  fichier_path text,
  taille_octets bigint,
  created_at timestamptz not null default now()
);

create index if not exists chatllow_projets_client_idx on public.chatllow_projets (client_id);
create index if not exists chatllow_livrables_client_idx on public.chatllow_livrables (client_id, categorie);

alter table public.chatllow_clients enable row level security;
alter table public.chatllow_projets enable row level security;
alter table public.chatllow_livrables enable row level security;

drop policy if exists "un client lit sa fiche" on public.chatllow_clients;
create policy "un client lit sa fiche"
  on public.chatllow_clients for select to authenticated
  using (auth.uid() = profil_id);

drop policy if exists "un client lit ses projets" on public.chatllow_projets;
create policy "un client lit ses projets"
  on public.chatllow_projets for select to authenticated
  using (auth.uid() = client_id);

drop policy if exists "un client lit ses livrables" on public.chatllow_livrables;
create policy "un client lit ses livrables"
  on public.chatllow_livrables for select to authenticated
  using (auth.uid() = client_id);

revoke all on public.chatllow_clients, public.chatllow_projets, public.chatllow_livrables from anon, authenticated;
grant select on public.chatllow_clients, public.chatllow_projets, public.chatllow_livrables to authenticated;

-- Bucket prive des livrables. Sans policy sur storage.objects pour ce bucket : le client ne peut rien
-- lire ni ecrire directement.
insert into storage.buckets (id, name, public)
values ('chatllow-livrables', 'chatllow-livrables', false)
on conflict (id) do update set public = false;

-- Declencheur d'inscription partage avec Vivier Academies : un compte cree pour Chatllow (metadonnee
-- origine = 'chatllow') ne doit PAS creer de profil Vivier (il apparaitrait dans l'admin Eleves).
-- Reprend a l'identique la version de la migration 0049 de Vivier, plus cette garde. Si une migration
-- Vivier redefinit un jour handle_new_user, elle doit conserver cette garde.
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
  if new.raw_user_meta_data ->> 'origine' = 'chatllow' then
    return new;
  end if;

  insert into public.profils (id, pseudo)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'pseudo', split_part(new.email, '@', 1)));

  if v_prenom <> '' and v_nom <> '' and v_tel <> '' then
    insert into public.profils_contact (profil_id, prenom, nom, telephone)
    values (new.id, left(v_prenom, 80), left(v_nom, 80), left(v_tel, 30));
  end if;
  return new;
end;
$$;
