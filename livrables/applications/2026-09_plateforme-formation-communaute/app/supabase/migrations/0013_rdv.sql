-- RDV : appels decouverte 1:1 avec Zeze, reserves aux membres de la
-- communaute gratuite (acces 'gratuite', meme aimant a prospects que
-- Masterclass/Prompts). Decision de Zeze le 2026-09-16.
--
-- Creneaux exclusifs (un seul membre par creneau) : la reservation et
-- l'annulation passent par des fonctions SECURITY DEFINER atomiques
-- (reserver_creneau / annuler_creneau) plutot que par des policies RLS
-- UPDATE, pour eviter toute course entre deux membres qui cliquent sur
-- le meme creneau au meme moment (WHERE ... and reserve_par is null
-- dans un seul UPDATE garantit qu'un seul gagne).

create table if not exists creneaux_rdv (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces (id) on delete cascade,
  date_heure timestamptz not null,
  lien text not null,
  reserve_par uuid references profils (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table creneaux_rdv enable row level security;

create policy "membre approuve lit les creneaux de son espace"
  on creneaux_rdv for select
  to authenticated
  using (public.a_acces_zone(auth.uid(), espace_id, 'gratuite'));

-- Pas de policy insert/update/delete pour les membres : la creation de
-- creneaux est reservee a l'admin (service_role), la reservation et
-- l'annulation passent uniquement par les fonctions ci-dessous.

create or replace function public.reserver_creneau(p_creneau_id uuid)
returns creneaux_rdv
language plpgsql
security definer
set search_path = public
as $$
declare
  v_espace_id uuid;
  v_result creneaux_rdv;
begin
  select espace_id into v_espace_id from creneaux_rdv where id = p_creneau_id;
  if v_espace_id is null then
    raise exception 'Creneau introuvable';
  end if;
  if not public.a_acces_zone(auth.uid(), v_espace_id, 'gratuite') then
    raise exception 'Acces refuse';
  end if;

  update creneaux_rdv
  set reserve_par = auth.uid()
  where id = p_creneau_id and reserve_par is null
  returning * into v_result;

  if v_result.id is null then
    raise exception 'Ce creneau vient d''etre reserve par quelqu''un d''autre';
  end if;
  return v_result;
end;
$$;

create or replace function public.annuler_creneau(p_creneau_id uuid)
returns creneaux_rdv
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result creneaux_rdv;
begin
  update creneaux_rdv
  set reserve_par = null
  where id = p_creneau_id and reserve_par = auth.uid()
  returning * into v_result;

  if v_result.id is null then
    raise exception 'Ce creneau n''est pas reserve par toi';
  end if;
  return v_result;
end;
$$;
