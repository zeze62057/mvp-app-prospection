-- Devoirs, remises notees et badges attribues a la main (mission "tableau de bord
-- eleve", 2026-09-23). Les badges automatiques (premier module, serie de jours,
-- formation terminee) ne sont pas stockes : ils se calculent depuis la progression
-- deja en base (voir progression/page.tsx), pas besoin de table pour ca.
--
-- Ecriture reservee a l'admin (creer un devoir, noter une remise, attribuer un badge
-- a la main) : comme pour les ressources (migration 0011) et les videos de cours
-- (migration 0009), aucune policy insert/update pour les eleves sur devoirs et
-- badges_manuels, seul le chemin admin (service_role, via server action) ecrit.
-- Les eleves ecrivent uniquement leur propre remise, et ne peuvent plus la modifier
-- une fois notee (le "with check" empeche de repasser note a null pour la debloquer).

create table if not exists devoirs (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  module_id uuid not null references modules (id) on delete cascade,
  titre text not null,
  consigne text not null,
  date_limite timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists devoirs_remises (
  id uuid primary key default gen_random_uuid(),
  devoir_id uuid not null references devoirs (id) on delete cascade,
  profil_id uuid not null references profils (id) on delete cascade,
  texte text,
  fichier_path text,
  rendu_at timestamptz not null default now(),
  note integer check (note between 0 and 20),
  commentaire text,
  note_le timestamptz,
  unique (devoir_id, profil_id)
);

create table if not exists badges_manuels (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  profil_id uuid not null references profils (id) on delete cascade,
  libelle text not null,
  emoji text not null default '🏅',
  created_at timestamptz not null default now()
);

alter table devoirs enable row level security;
alter table devoirs_remises enable row level security;
alter table badges_manuels enable row level security;

create policy "membre payant lit les devoirs de son espace"
  on devoirs for select
  to authenticated
  using (public.a_acces_zone(auth.uid(), espace_id, 'payante'));

create policy "un eleve voit ses propres remises"
  on devoirs_remises for select
  to authenticated
  using (profil_id = auth.uid());

create policy "un eleve rend son propre devoir"
  on devoirs_remises for insert
  to authenticated
  with check (
    profil_id = auth.uid()
    and exists (
      select 1 from devoirs d
      where d.id = devoirs_remises.devoir_id
        and public.a_acces_zone(auth.uid(), d.espace_id, 'payante')
    )
  );

create policy "un eleve modifie sa remise tant qu'elle n'est pas notee"
  on devoirs_remises for update
  to authenticated
  using (profil_id = auth.uid() and note is null)
  with check (profil_id = auth.uid() and note is null);

create policy "un eleve voit ses propres badges"
  on badges_manuels for select
  to authenticated
  using (profil_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'devoirs-fichiers',
  'devoirs-fichiers',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png', 'application/zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do nothing;

-- Pas de policy storage.objects : tous les acces (upload par l'eleve, lecture par
-- l'eleve ou l'admin) passent par une route serveur qui verifie l'identite puis
-- utilise le client admin, meme logique que bannieres-espaces (migration 0042).
