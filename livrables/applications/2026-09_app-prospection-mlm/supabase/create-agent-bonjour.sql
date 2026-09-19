-- ============================================================
--  Kora — créer la fiche agent de BONJOUR (racine de la hiérarchie)
-- ============================================================
--  Contexte : le schema.sql exécuté ne crée PAS la ligne `agents`
--  à l'inscription (point laissé « à valider »). Ce script la crée
--  à la main pour le compte déjà créé dans Authentication > Users.
--
--  À exécuter dans Supabase : SQL Editor > New query > coller > Run.
--  Remplace l'email ci-dessous par l'email exact du compte de BONJOUR.
-- ============================================================

insert into agents (id, nom_complet, email, parrain_id, actif)
select
  u.id,
  'BONJOUR',                          -- nom affiché dans l'app, mets ici le vrai nom
  u.email,
  null,                               -- racine de la hiérarchie, pas de parrain
  true
from auth.users u
where u.email = 'REMPLACE_PAR_EMAIL_DE_BONJOUR'
on conflict (id) do nothing;

-- Vérification : doit renvoyer 1 ligne
select id, nom_complet, email, parrain_id, actif from agents;
