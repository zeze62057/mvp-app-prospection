-- ============================================================
--  Kora — données de démonstration (facultatif)
--
--  PRÉREQUIS
--  1. Le schéma (schema.sql) est déjà exécuté.
--  2. L'agent BONJOUR existe : Supabase > Authentication > Users > Add user
--     (email + mot de passe). Le trigger crée sa ligne dans "agents".
--  3. Copie l'UUID de cet utilisateur (colonne "UID") et colle-le ci-dessous
--     à la place de la valeur v_bonjour.
--
--  Puis colle ce script dans SQL Editor et Run.
-- ============================================================

do $$
declare
  v_bonjour uuid := '00000000-0000-0000-0000-000000000000';  -- <== REMPLACER par l'UID de BONJOUR
  p_fatou   uuid;
  p_ibra    uuid;
  p_aissa   uuid;
  p_mamadou uuid;
  p_kadia   uuid;
  p_sekou   uuid;
  p_mariama uuid;
begin
  if not exists (select 1 from agents where id = v_bonjour) then
    raise exception 'Agent BONJOUR introuvable. Crée l''utilisateur puis colle son UID dans v_bonjour.';
  end if;

  update agents
     set nom_complet = 'BONJOUR', slug = 'bonjour', parrain_id = null
   where id = v_bonjour;

  -- Prospects. Le trigger prospects_log_statut crée automatiquement
  -- la 1re ligne d'historique (creation au statut du prospect).
  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation, created_at, updated_at) values
    (v_bonjour, 'Fatoumata Diallo', '+224 622 45 18 90', 'f.diallo@gmail.com', 'en_negociation', 'formulaire_public', now() - interval '17 days', now() - interval '2 days')
    returning id into p_fatou;
  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation, created_at, updated_at) values
    (v_bonjour, 'Ibrahima Barry', '+224 655 02 77 41', null, 'interesse', 'manuel', now() - interval '21 days', now() - interval '4 days')
    returning id into p_ibra;
  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation, created_at, updated_at) values
    (v_bonjour, 'Aïssatou Camara', null, 'aissatou.camara@gmail.com', 'dans_le_tunnel', 'formulaire_public', now() - interval '24 days', now() - interval '8 days')
    returning id into p_aissa;
  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation, created_at, updated_at) values
    (v_bonjour, 'Mamadou Sylla', '+224 628 31 09 55', null, 'contacte', 'manuel', now() - interval '19 days', now() - interval '3 days')
    returning id into p_mamadou;
  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation, created_at, updated_at) values
    (v_bonjour, 'Kadiatou Bah', '+224 664 77 12 30', null, 'nouveau', 'formulaire_public', now() - interval '5 hours', now() - interval '5 hours')
    returning id into p_kadia;
  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation, created_at, updated_at) values
    (v_bonjour, 'Sékou Condé', '+224 621 09 44 12', null, 'close_gagne', 'manuel', now() - interval '33 days', now() - interval '14 days')
    returning id into p_sekou;
  insert into prospects (agent_id, nom, telephone, email, statut, mode_creation, created_at, updated_at) values
    (v_bonjour, 'Mariama Touré', '+224 610 88 23 07', null, 'close_perdu', 'formulaire_public', now() - interval '38 days', now() - interval '21 days')
    returning id into p_mariama;

  -- Quelques interactions de suivi.
  insert into interactions (prospect_id, agent_id, type, contenu, created_at) values
    (p_fatou, v_bonjour, 'note', 'Cherche un revenu complémentaire, disponible le week-end. Préfère WhatsApp.', now() - interval '7 days'),
    (p_fatou, v_bonjour, 'appel', 'Appel passé, pas de réponse.', now() - interval '7 days' + interval '3 minutes'),
    (p_fatou, v_bonjour, 'message', 'Message WhatsApp envoyé avec la vidéo de présentation.', now() - interval '4 days'),
    (p_fatou, v_bonjour, 'rdv', 'Rendez-vous fixé samedi 15h, au bureau de Kaloum.', now() - interval '2 days'),
    (p_ibra, v_bonjour, 'appel', 'Premier échange, intéressé par un revenu d''appoint.', now() - interval '8 days'),
    (p_ibra, v_bonjour, 'message', 'A répondu au message, veut en savoir plus sur les produits.', now() - interval '4 days'),
    (p_aissa, v_bonjour, 'message', 'Vidéo de présentation envoyée par email.', now() - interval '10 days'),
    (p_aissa, v_bonjour, 'rdv', 'Réunion d''information en ligne planifiée.', now() - interval '8 days'),
    (p_mamadou, v_bonjour, 'appel', 'Message vocal laissé, en attente de rappel.', now() - interval '3 days'),
    (p_sekou, v_bonjour, 'rdv', 'Signature du contrat de distribution, kit de démarrage remis.', now() - interval '14 days'),
    (p_mariama, v_bonjour, 'appel', 'Échange court, hésite à cause du temps à consacrer.', now() - interval '26 days'),
    (p_mariama, v_bonjour, 'note', 'Pas disponible cette année, recontacter en janvier.', now() - interval '21 days');

  -- Le trigger interactions_touch_prospect a remis updated_at à now() pour chaque
  -- prospect ayant une interaction. On rétablit un "dernier contact" réaliste.
  update prospects set updated_at = now() - interval '2 days'   where id = p_fatou;
  update prospects set updated_at = now() - interval '4 days'   where id = p_ibra;
  update prospects set updated_at = now() - interval '8 days'   where id = p_aissa;
  update prospects set updated_at = now() - interval '3 days'   where id = p_mamadou;
  update prospects set updated_at = now() - interval '5 hours'  where id = p_kadia;
  update prospects set updated_at = now() - interval '14 days'  where id = p_sekou;
  update prospects set updated_at = now() - interval '21 days'  where id = p_mariama;

  -- Le trigger prospects_log_statut a écrit, pour chaque prospect, une ligne
  -- "créé au statut <statut final>". On la remplace par un historique cohérent :
  -- création au statut 'nouveau' puis progression datée.
  delete from changements_statut
   where prospect_id in (p_fatou, p_ibra, p_aissa, p_mamadou, p_sekou, p_mariama);

  insert into changements_statut (prospect_id, agent_id, ancien_statut, nouveau_statut, created_at) values
    -- Fatoumata : parcours complet
    (p_fatou,   v_bonjour, null,             'nouveau',        now() - interval '17 days'),
    (p_fatou,   v_bonjour, 'nouveau',        'contacte',       now() - interval '9 days'),
    (p_fatou,   v_bonjour, 'contacte',       'dans_le_tunnel', now() - interval '7 days'),
    (p_fatou,   v_bonjour, 'dans_le_tunnel', 'interesse',      now() - interval '5 days'),
    (p_fatou,   v_bonjour, 'interesse',      'en_negociation', now() - interval '2 days'),
    -- Les autres : création puis passage au statut courant
    (p_ibra,    v_bonjour, null,             'nouveau',        now() - interval '21 days'),
    (p_ibra,    v_bonjour, 'contacte',       'interesse',      now() - interval '4 days'),
    (p_aissa,   v_bonjour, null,             'nouveau',        now() - interval '24 days'),
    (p_aissa,   v_bonjour, 'contacte',       'dans_le_tunnel', now() - interval '8 days'),
    (p_mamadou, v_bonjour, null,             'nouveau',        now() - interval '19 days'),
    (p_mamadou, v_bonjour, 'nouveau',        'contacte',       now() - interval '3 days'),
    (p_sekou,   v_bonjour, null,             'nouveau',        now() - interval '33 days'),
    (p_sekou,   v_bonjour, 'en_negociation', 'close_gagne',    now() - interval '14 days'),
    (p_mariama, v_bonjour, null,             'nouveau',        now() - interval '38 days'),
    (p_mariama, v_bonjour, 'interesse',      'close_perdu',    now() - interval '21 days');

  raise notice 'Seed Kora : 7 prospects et 12 interactions créés pour BONJOUR (%).', v_bonjour;
end $$;
