-- Approbation des publications avant parution (decision du 2026-09-24, lot 4 des pouvoirs
-- d'administration).
--
-- Un reglage par espace (espaces.approuver_publications, desactive par defaut : aucun changement
-- de comportement tant qu'un admin ne l'active pas). Quand il est actif, le post d'un membre reste
-- "en_attente", invisible des autres membres, jusqu'a l'approbation d'un admin. Les posts d'un admin
-- ne sont jamais en attente. Les posts existants restent "publie".
--
-- Ce que la BASE garantit, quel que soit le chemin (formulaire, appel direct avec la cle publique) :
--   - le statut d'un nouveau post est fixe par un declencheur, jamais par le client ;
--   - un membre ne peut pas changer le statut (droit de colonne : seuls titre, contenu et categorie
--     sont modifiables, migration 0033) ;
--   - modifier le titre ou le texte d'un post deja publie le remet "en_attente" quand le reglage est
--     actif (sinon on contournerait l'approbation en editant apres coup) ;
--   - un post non publie n'est lisible que par son auteur (le RLS des commentaires et des reactions
--     s'appuie sur la lecture du post : ils suivent) ;
--   - aucune notification de mention ne part tant que le post n'est pas publie.

-- ---------------------------------------------------------------------------
-- 1. Colonnes
-- ---------------------------------------------------------------------------
alter table espaces
  add column if not exists approuver_publications boolean not null default false;

alter table posts
  add column if not exists statut text not null default 'publie'
    check (statut in ('publie', 'en_attente', 'refuse')),
  add column if not exists traite_at timestamptz;

create index if not exists posts_statut_idx on posts (espace_id, statut) where statut <> 'publie';

-- ---------------------------------------------------------------------------
-- 2. Statut d'un nouveau post, fixe par la base
-- ---------------------------------------------------------------------------
create or replace function public.fixer_statut_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  exige boolean;
  est_admin boolean;
begin
  select approuver_publications into exige from espaces where id = new.espace_id;
  select (role = 'admin') into est_admin from profils where id = new.auteur_id;
  if coalesce(exige, false) and not coalesce(est_admin, false) then
    new.statut := 'en_attente';
  else
    new.statut := 'publie';
  end if;
  new.traite_at := null;
  return new;
end;
$$;

drop trigger if exists fixer_statut_post_trigger on posts;
create trigger fixer_statut_post_trigger
  before insert on posts
  for each row execute function public.fixer_statut_post();

-- ---------------------------------------------------------------------------
-- 3. Modifier un post publie le remet en attente (si le reglage est actif)
-- ---------------------------------------------------------------------------
-- auth.uid() est nul pour le service_role (actions admin) : l'admin qui corrige un post ne le remet
-- pas en attente. Un membre qui modifie SON post, si.
create or replace function public.remettre_post_en_attente()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  exige boolean;
  est_admin boolean;
begin
  if old.statut <> 'publie' then
    return new;
  end if;
  if new.titre is not distinct from old.titre and new.contenu is not distinct from old.contenu then
    return new;
  end if;
  if auth.uid() is null then
    return new;
  end if;
  select approuver_publications into exige from espaces where id = new.espace_id;
  select (role = 'admin') into est_admin from profils where id = auth.uid();
  if coalesce(exige, false) and not coalesce(est_admin, false) then
    new.statut := 'en_attente';
    new.traite_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists remettre_post_en_attente_trigger on posts;
create trigger remettre_post_en_attente_trigger
  before update of titre, contenu on posts
  for each row execute function public.remettre_post_en_attente();

-- ---------------------------------------------------------------------------
-- 4. Lecture : un post non publie n'est lisible que par son auteur
-- ---------------------------------------------------------------------------
drop policy if exists "acces zone lecture posts" on posts;
create policy "acces zone lecture posts"
  on posts for select
  using (
    public.a_acces_zone(auth.uid(), espace_id, zone)
    and (statut = 'publie' or auteur_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- 5. Pas de mention notifiee tant que le post n'est pas publie
-- ---------------------------------------------------------------------------
create or replace function public.notifier_mentions_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut <> 'publie' then
    return new;
  end if;
  perform public.notifier_mentions(
    new.auteur_id, new.espace_id, new.zone, new.id,
    coalesce(new.titre, '') || ' ' || new.contenu, null
  );
  return new;
end;
$$;

drop trigger if exists notifier_mentions_post_trigger on posts;
create trigger notifier_mentions_post_trigger
  after insert or update of titre, contenu, statut on posts
  for each row execute function public.notifier_mentions_post();

-- ---------------------------------------------------------------------------
-- 6. Notifications de decision (creees par le serveur, jamais par un membre)
-- ---------------------------------------------------------------------------
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications
  add constraint notifications_type_check
  check (type in ('like', 'commentaire', 'message', 'mention', 'demande_adhesion', 'adhesion_approuvee', 'post_approuve', 'post_refuse'));

-- Une decision = une notification par post.
create unique index if not exists notifications_decision_post_unique
  on notifications (profil_id, post_id) where type in ('post_approuve', 'post_refuse');
