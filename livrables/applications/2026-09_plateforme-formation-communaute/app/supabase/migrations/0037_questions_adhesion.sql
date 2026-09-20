-- Lot 3 : questions a l'adhesion, et notifications de demande (aux admins) et de decision (au membre).
--
-- 1. Chaque espace peut poser jusqu'a 3 questions a qui demande a rejoindre la communaute gratuite.
--    Les reponses sont obligatoires pour tout le monde et lisibles de l'admin seulement (via le
--    service_role) et de leur auteur. Cela aide a qualifier les prospects avant d'approuver.
-- 2. La demande passe par une fonction : elle verifie que toutes les questions ont une reponse et
--    ecrit demande et reponses ensemble. L'insertion directe dans adhesions n'est PAS retiree ici :
--    l'ancienne version de l'application (celle en ligne) insere encore directement. Le retrait est
--    dans la migration 0038, a appliquer une fois le nouveau code en ligne.
-- 3. Une demande previent les admins ; une approbation previent le membre. Sans e-mail : ce sont
--    des notifications dans l'application (cloche), en attendant un canal externe.

-- ---------------------------------------------------------------------------
-- 1. Questions et reponses
-- ---------------------------------------------------------------------------
create table if not exists questions_adhesion (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  ordre integer not null check (ordre between 1 and 3),
  libelle text not null check (length(trim(libelle)) between 3 and 200),
  unique (espace_id, ordre)
);

alter table questions_adhesion enable row level security;

-- Lecture : tout compte connecte, car la personne qui demande l'acces n'est pas encore membre.
-- Les questions ne sont pas un secret. Ecriture : service_role seulement (actions admin).
create policy "un compte connecte lit les questions d'adhesion"
  on questions_adhesion for select
  to authenticated
  using (true);

revoke all on public.questions_adhesion from anon;
revoke insert, update, delete on public.questions_adhesion from authenticated;

create table if not exists reponses_adhesion (
  adhesion_id uuid not null references adhesions (id) on delete cascade,
  question_id uuid not null references questions_adhesion (id) on delete cascade,
  reponse text not null check (length(trim(reponse)) between 1 and 500),
  primary key (adhesion_id, question_id)
);

alter table reponses_adhesion enable row level security;

create policy "un membre lit ses propres reponses d'adhesion"
  on reponses_adhesion for select
  to authenticated
  using (
    exists (
      select 1 from adhesions a
      where a.id = reponses_adhesion.adhesion_id and a.profil_id = auth.uid()
    )
  );

-- Aucune ecriture par un client : les reponses naissent avec la demande, dans la fonction ci-dessous.
revoke all on public.reponses_adhesion from anon;
revoke insert, update, delete on public.reponses_adhesion from authenticated;

-- ---------------------------------------------------------------------------
-- 2. Demande d'adhesion atomique
-- ---------------------------------------------------------------------------
-- p_reponses : objet JSON { "<id de la question>": "texte", ... }. Toutes les questions de
-- l'espace exigent une reponse non vide de 500 caracteres au plus.
create or replace function public.demander_adhesion(p_espace uuid, p_reponses jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  v_adhesion uuid;
  q record;
  rep text;
begin
  if uid is null then
    raise exception 'Non connecte.';
  end if;
  if not exists (select 1 from espaces where id = p_espace) then
    raise exception 'Espace introuvable.';
  end if;
  if p_reponses is null or jsonb_typeof(p_reponses) <> 'object' then
    raise exception 'Reponses invalides.';
  end if;
  if exists (select 1 from adhesions where profil_id = uid and espace_id = p_espace) then
    raise exception 'Demande deja envoyee.';
  end if;

  for q in select id from questions_adhesion where espace_id = p_espace loop
    rep := trim(coalesce(p_reponses ->> q.id::text, ''));
    if length(rep) = 0 then
      raise exception 'Reponds a toutes les questions.';
    end if;
    if length(rep) > 500 then
      raise exception 'Une reponse est trop longue (500 caracteres maximum).';
    end if;
  end loop;

  insert into adhesions (profil_id, espace_id) values (uid, p_espace) returning id into v_adhesion;

  insert into reponses_adhesion (adhesion_id, question_id, reponse)
  select v_adhesion, qa.id, trim(p_reponses ->> qa.id::text)
  from questions_adhesion qa
  where qa.espace_id = p_espace;
end;
$$;

revoke all on function public.demander_adhesion(uuid, jsonb) from public, anon;
grant execute on function public.demander_adhesion(uuid, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Notifications de demande et de decision
-- ---------------------------------------------------------------------------
alter table notifications drop constraint if exists notifications_type_check;
alter table notifications
  add constraint notifications_type_check
  check (type in ('like', 'commentaire', 'message', 'mention', 'demande_adhesion', 'adhesion_approuvee'));

-- Une demande = une notification par admin. Une approbation = une notification par membre et espace.
create unique index if not exists notifications_demande_unique
  on notifications (profil_id, acteur_id, espace_id) where type = 'demande_adhesion';
create unique index if not exists notifications_approuvee_unique
  on notifications (profil_id, espace_id) where type = 'adhesion_approuvee';

create or replace function public.notifier_demande_adhesion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut = 'en_attente' then
    insert into notifications (profil_id, acteur_id, espace_id, type)
    select p.id, new.profil_id, new.espace_id, 'demande_adhesion'
    from profils p
    where p.role = 'admin' and p.id <> new.profil_id
    on conflict do nothing;
  end if;
  return new;
end;
$$;

drop trigger if exists notifier_demande_adhesion_trigger on adhesions;
create trigger notifier_demande_adhesion_trigger
  after insert on adhesions
  for each row execute function public.notifier_demande_adhesion();

create or replace function public.notifier_decision_adhesion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut is distinct from old.statut and old.statut = 'en_attente' then
    -- La demande est traitee : elle n'est plus a signaler aux admins.
    update notifications
    set lu = true
    where type = 'demande_adhesion' and acteur_id = new.profil_id and espace_id = new.espace_id;

    if new.statut = 'approuve' then
      insert into notifications (profil_id, acteur_id, espace_id, type)
      values (new.profil_id, new.profil_id, new.espace_id, 'adhesion_approuvee')
      on conflict do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists notifier_decision_adhesion_trigger on adhesions;
create trigger notifier_decision_adhesion_trigger
  after update of statut on adhesions
  for each row execute function public.notifier_decision_adhesion();

revoke execute on function public.notifier_demande_adhesion() from public, anon, authenticated;
revoke execute on function public.notifier_decision_adhesion() from public, anon, authenticated;
