-- Parametres de communaute et indicateurs admin (voir CADRAGE.md section 9,
-- point "plusieurs parametres" de la communaute, tranche le 2026-09-19).
--
-- Trois reglages par espace, modifiables par l'admin :
--   1. periode_activite_jours : fenetre qui definit un membre "actif"
--      (jusqu'ici 7 jours codes en dur dans stats-communaute.ts).
--   2. afficher_compteur_public : afficher ou non le nombre de membres sur la
--      vitrine. Vrai par defaut, pour ne rien changer a ce que la vitrine de
--      Vivier IA affiche deja aujourd'hui.
--   3. message d'accueil et regles : table a part, pas une colonne d'espaces.
--      La table espaces est lisible publiquement (la vitrine l'utilise sans
--      compte) : un texte reserve aux membres, qui peut contenir un lien
--      prive, ne doit pas y etre.
--
-- Plus une fonction d'agregation pour les nouveaux indicateurs de l'admin
-- (croissance, demandes en attente, progression, revenus). Calculee en SQL
-- plutot qu'en JS : une requete PostgREST est plafonnee a 1000 lignes, ce qui
-- fausserait silencieusement les sommes et moyennes des qu'un espace grandit.
--
-- Migration additive : l'ancien code qui lit "select *" sur espaces recoit
-- simplement deux colonnes de plus et les ignore.

alter table espaces
  add column if not exists periode_activite_jours integer not null default 7
  check (periode_activite_jours between 1 and 365);

alter table espaces
  add column if not exists afficher_compteur_public boolean not null default true;

create table if not exists messages_accueil (
  espace_id uuid primary key references espaces (id) on delete cascade,
  texte text not null check (length(texte) between 1 and 2000),
  updated_at timestamptz not null default now()
);

alter table messages_accueil enable row level security;

-- Lecture : tout membre de l'espace (approuve ou payant). L'ecriture n'a pas
-- de policy : seul le service_role (actions admin) peut ecrire.
create policy "un membre lit le message d'accueil de son espace"
  on messages_accueil for select
  using (
    public.a_acces_zone(auth.uid(), espace_id, 'gratuite')
    or public.a_acces_zone(auth.uid(), espace_id, 'payante')
  );

-- Indicateurs admin d'un espace. Reserve au service_role : le taux de
-- conversion et les revenus sont des donnees commerciales privees.
--
-- Definitions :
--   - nouveaux membres : adhesions approuvees, datees du traitement par
--     l'admin (traite_at), a defaut de la demande (created_at).
--   - eleves : membres avec un acces payant actif. L'avancement moyen compte
--     les eleves sans aucune section terminee (a 0 %), sinon la moyenne serait
--     flatteuse.
--   - avancement : sections terminees / sections existantes en base. Un module
--     sans section (contenu pas encore charge) ne pese donc pas dans le calcul.
--   - revenus : paiements au statut "confirme" seulement. Un acces accorde a la
--     main par l'admin (filet de securite) ne cree pas de paiement, il n'est
--     donc pas compte ici.
create or replace function public.stats_admin_espace(p_espace_id uuid)
returns jsonb
language sql
stable
set search_path = public
as $$
  with
  eleves as (
    select profil_id from acces_payant where espace_id = p_espace_id and actif
  ),
  sections_espace as (
    select s.id, s.titre, m.ordre as module_ordre, s.ordre as section_ordre
    from sections s
    join modules m on m.id = s.module_id
    where m.espace_id = p_espace_id
  ),
  faites as (
    select p.profil_id, p.section_id
    from progression p
    join sections_espace se on se.id = p.section_id
    join eleves e on e.profil_id = p.profil_id
  ),
  par_eleve as (
    select e.profil_id, count(f.section_id) as nb
    from eleves e
    left join faites f on f.profil_id = e.profil_id
    group by e.profil_id
  ),
  par_section as (
    select se.id, se.titre, se.module_ordre, se.section_ordre,
           count(f.profil_id) as nb_terminees
    from sections_espace se
    left join faites f on f.section_id = se.id
    group by se.id, se.titre, se.module_ordre, se.section_ordre
  )
  select jsonb_build_object(
    'nouveaux_7j', (
      select count(*) from adhesions
      where espace_id = p_espace_id and statut = 'approuve'
        and coalesce(traite_at, created_at) >= now() - interval '7 days'
    ),
    'nouveaux_30j', (
      select count(*) from adhesions
      where espace_id = p_espace_id and statut = 'approuve'
        and coalesce(traite_at, created_at) >= now() - interval '30 days'
    ),
    'demandes_en_attente', (
      select count(*) from adhesions
      where espace_id = p_espace_id and statut = 'en_attente'
    ),
    'revenus', jsonb_build_object(
      'nb_confirmes', (
        select count(*) from paiements
        where espace_id = p_espace_id and statut = 'confirme'
      ),
      'montant_total', (
        select coalesce(sum(montant), 0) from paiements
        where espace_id = p_espace_id and statut = 'confirme'
      ),
      'montant_30j', (
        select coalesce(sum(montant), 0) from paiements
        where espace_id = p_espace_id and statut = 'confirme'
          and coalesce(confirme_at, created_at) >= now() - interval '30 days'
      )
    ),
    'progression', jsonb_build_object(
      'nb_eleves', (select count(*) from eleves),
      'nb_sections', (select count(*) from sections_espace),
      'avancement_moyen', (
        select case
          when (select count(*) from sections_espace) = 0 then null
          else round(avg(nb)::numeric * 100 / (select count(*) from sections_espace), 1)
        end
        from par_eleve
      ),
      'sections', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'titre', titre,
            'module_ordre', module_ordre,
            'section_ordre', section_ordre,
            'nb_terminees', nb_terminees
          )
          order by module_ordre, section_ordre
        )
        from par_section
      ), '[]'::jsonb)
    )
  );
$$;

revoke all on function public.stats_admin_espace(uuid) from public, anon, authenticated;
grant execute on function public.stats_admin_espace(uuid) to service_role;
