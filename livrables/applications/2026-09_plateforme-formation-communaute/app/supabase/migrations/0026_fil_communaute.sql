-- Fil de communaute facon Skool (lot A) : categories gerees par l'admin, titre,
-- epingle, image, commentaires. Un seul fil pour les zones gratuite et payante.
--
-- Contenu de cette migration :
--   1. Visibilite entre membres d'un meme espace (profils) et liste des experts.
--   2. Categories de posts par espace, et rattachement des posts existants.
--   3. Colonnes titre / epingle / image sur posts, avec leurs garde-fous.
--   4. Commentaires, et la fonction qui en donne le nombre et la date du dernier.
--   5. Bucket prive pour les images de posts.
--
-- Migration additive : l'ancien code recoit simplement des colonnes de plus.
-- La colonne posts.tag reste (historique) ; le fil utilise categorie_id.

-- ---------------------------------------------------------------------------
-- 1. Visibilite entre membres
-- ---------------------------------------------------------------------------
-- Jusqu'ici la policy de profils ne laissait lire que SON PROPRE profil : dans
-- un fil, les auteurs des autres membres s'affichaient tous "Membre" avec 0 point
-- (invisible tant que la base n'avait qu'un profil). Ce n'est pas exprimable en
-- policy directe : lire adhesions/acces_payant des autres est lui-meme bloque par
-- RLS, d'ou une fonction security definer (meme approche que a_acces_zone).
-- Ce qui devient visible d'un co-membre : pseudo, role, points (pas d'email, il
-- n'est pas dans cette table).

create or replace function public.partage_un_espace(p_a uuid, p_b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_a = p_b or exists (
    select 1
    from (
      select espace_id from adhesions where profil_id = p_a and statut = 'approuve'
      union
      select espace_id from acces_payant where profil_id = p_a and actif
    ) ea
    join (
      select espace_id from adhesions where profil_id = p_b and statut = 'approuve'
      union
      select espace_id from acces_payant where profil_id = p_b and actif
    ) eb using (espace_id)
  );
$$;

revoke all on function public.partage_un_espace(uuid, uuid) from public, anon;
grant execute on function public.partage_un_espace(uuid, uuid) to authenticated;

drop policy if exists "un membre voit les profils de ses espaces" on profils;
create policy "un membre voit les profils de ses espaces"
  on profils for select
  to authenticated
  using (public.partage_un_espace(auth.uid(), id));

-- Liste des experts d'un espace, pour le badge Expert. On n'ouvre pas la lecture
-- d'acces_payant (elle expose la date de paiement de chacun) : seulement les
-- identifiants des experts, et seulement a un membre payant de cet espace.
create or replace function public.experts_espace(p_espace uuid)
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select profil_id from acces_payant
  where espace_id = p_espace and actif and est_expert
    and public.a_acces_zone(auth.uid(), p_espace, 'payante');
$$;

revoke all on function public.experts_espace(uuid) from public, anon;
grant execute on function public.experts_espace(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 2. Categories de posts
-- ---------------------------------------------------------------------------
create table if not exists categories_posts (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  libelle text not null check (length(libelle) between 1 and 40),
  emoji text not null default '' check (length(emoji) <= 8),
  ordre integer not null default 0,
  created_at timestamptz not null default now(),
  unique (espace_id, libelle)
);

alter table categories_posts enable row level security;

-- Lecture : tout membre de l'espace. Ecriture : aucune policy, seul le
-- service_role (actions admin) peut creer ou supprimer une categorie.
create policy "un membre lit les categories de son espace"
  on categories_posts for select
  to authenticated
  using (
    public.a_acces_zone(auth.uid(), espace_id, 'gratuite')
    or public.a_acces_zone(auth.uid(), espace_id, 'payante')
  );

-- Categories de depart : les 3 anciens tags (victoire, question, annonce), pour
-- que les posts existants gardent leur classement. L'admin en ajoute d'autres.
insert into categories_posts (espace_id, libelle, emoji, ordre)
select e.id, c.libelle, c.emoji, c.ordre
from espaces e
cross join (values ('Victoire', '🏆', 1), ('Question', '❓', 2), ('Annonce', '📣', 3)) as c(libelle, emoji, ordre)
on conflict (espace_id, libelle) do nothing;

-- ---------------------------------------------------------------------------
-- 3. Colonnes du fil sur posts
-- ---------------------------------------------------------------------------
alter table posts add column if not exists titre text
  check (titre is null or length(titre) <= 150);
alter table posts add column if not exists epingle boolean not null default false;
alter table posts add column if not exists image_path text;
alter table posts add column if not exists categorie_id uuid
  references categories_posts (id) on delete set null;

-- Les posts existants prennent la categorie qui correspond a leur ancien tag.
update posts p
set categorie_id = c.id
from categories_posts c
where c.espace_id = p.espace_id
  and lower(c.libelle) = p.tag
  and p.categorie_id is null;

-- Garde-fous, appliques meme a un membre qui appellerait l'API directement :
--   - la categorie doit etre celle du meme espace que le post ;
--   - seul le service_role (action admin) peut epingler ;
--   - image_path doit pointer dans le dossier de l'espace ET de la zone du post :
--     sans cela, un membre pourrait referencer l'image privee d'une autre zone.
create or replace function public.verifier_post_fil()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.categorie_id is not null and not exists (
    select 1 from categories_posts c
    where c.id = new.categorie_id and c.espace_id = new.espace_id
  ) then
    raise exception 'La categorie n''appartient pas a cet espace.';
  end if;

  if new.epingle and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Epingler un post est reserve a l''admin.';
  end if;

  if new.image_path is not null
     and new.image_path not like new.espace_id::text || '/' || new.zone || '/%' then
    raise exception 'Chemin d''image invalide pour cet espace et cette zone.';
  end if;

  return new;
end;
$$;

drop trigger if exists verifier_post_fil_trigger on posts;
create trigger verifier_post_fil_trigger
  before insert or update of categorie_id, epingle, image_path, espace_id, zone on posts
  for each row execute function public.verifier_post_fil();

-- ---------------------------------------------------------------------------
-- 4. Commentaires
-- ---------------------------------------------------------------------------
create table if not exists commentaires (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references posts (id) on delete cascade,
  auteur_id uuid not null references profils (id) on delete cascade,
  contenu text not null check (length(trim(contenu)) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists commentaires_post_idx on commentaires (post_id, created_at);

alter table commentaires enable row level security;

-- Meme acces que le post commente (zone gratuite ou payante).
create policy "acces zone lecture commentaires"
  on commentaires for select
  to authenticated
  using (
    exists (
      select 1 from posts p
      where p.id = commentaires.post_id
        and public.a_acces_zone(auth.uid(), p.espace_id, p.zone)
    )
  );

create policy "acces zone ecriture commentaires"
  on commentaires for insert
  to authenticated
  with check (
    auteur_id = auth.uid()
    and exists (
      select 1 from posts p
      where p.id = commentaires.post_id
        and public.a_acces_zone(auth.uid(), p.espace_id, p.zone)
    )
  );

create policy "un membre supprime son propre commentaire"
  on commentaires for delete
  to authenticated
  using (auteur_id = auth.uid());

-- Nombre de commentaires et date du dernier, pour une liste de posts. Executee
-- avec les droits de l'appelant (pas de security definer) : le RLS ci-dessus
-- s'applique, un membre ne compte que ce qu'il a le droit de lire.
create or replace function public.commentaires_resume(p_post_ids uuid[])
returns table (post_id uuid, nb bigint, dernier_at timestamptz)
language sql
stable
set search_path = public
as $$
  select c.post_id, count(*), max(c.created_at)
  from commentaires c
  where c.post_id = any(p_post_ids)
  group by c.post_id;
$$;

grant execute on function public.commentaires_resume(uuid[]) to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Images de posts
-- ---------------------------------------------------------------------------
-- Bucket PRIVE, sans policy : personne ne lit ni n'ecrit directement. Le serveur
-- televerse (service_role) et genere des liens temporaires, seulement pour des
-- posts que le membre a le droit de voir. Chemin : <espace_id>/<zone>/<uuid>.<ext>
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('posts-images', 'posts-images', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;
