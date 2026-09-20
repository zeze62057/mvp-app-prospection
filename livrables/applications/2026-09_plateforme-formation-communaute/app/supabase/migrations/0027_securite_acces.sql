-- CORRECTIF DE SECURITE : un membre pouvait s'elever lui-meme.
--
-- Trouve le 2026-09-20 en preparant la photo de profil (les membres vont ecrire
-- sur profils). Trois abus, tous faisables avec la cle publique et une simple
-- session de membre, sans passer par le code du produit :
--
--   1. profils : la policy "un membre modifie son propre profil" n'a aucune
--      limite de colonne. Un membre pouvait donc faire
--        update profils set role = 'admin', points = 9999 where id = <lui>
--      et obtenir l'acces a toute l'administration (verifierAdmin lit ce role).
--   2. adhesions : la policy d'insertion ne verifie que profil_id. Un membre
--      pouvait inserer sa demande directement au statut 'approuve' et contourner
--      l'approbation manuelle de la communaute gratuite (CADRAGE.md section 6).
--   3. paiements : meme defaut. Un membre pouvait creer un paiement deja
--      'confirme', ce qui fausse les revenus affiches dans l'admin.
--
-- Verification faite avant ce correctif : la base ne contient aucune trace d'abus
-- (un seul compte, un seul admin, toutes les adhesions approuvees ont une date de
-- traitement, les 5 paiements sont "en_attente").
--
-- Ce que ca change pour le produit : rien de visible. Le tunnel de paiement et la
-- demande d'adhesion inserent deja uniquement des lignes "en_attente". Les
-- approbations, confirmations et changements de role passent par le service_role
-- (actions admin, webhook), qui n'est pas concerne par ces restrictions.

-- ---------------------------------------------------------------------------
-- 1. profils : un membre ne peut modifier que son pseudo
-- ---------------------------------------------------------------------------
-- Privilege de colonne : plus fort qu'une policy, il s'applique meme si une
-- policy trop large est ajoutee plus tard. role et points restent modifiables
-- par les fonctions security definer (points via le trigger des votes) et par
-- le service_role. Les colonnes de profil ajoutees plus tard (ex: avatar_path)
-- devront recevoir leur propre GRANT.
revoke update on public.profils from anon, authenticated;
grant update (pseudo) on public.profils to authenticated;

-- ---------------------------------------------------------------------------
-- 2. adhesions : une demande d'adhesion est toujours "en attente"
-- ---------------------------------------------------------------------------
drop policy if exists "un membre demande lui-meme son adhesion" on public.adhesions;
create policy "un membre demande lui-meme son adhesion"
  on public.adhesions for insert
  with check (
    auth.uid() = profil_id
    and statut = 'en_attente'
    and traite_at is null
  );

-- ---------------------------------------------------------------------------
-- 3. paiements : un paiement initie par un membre est toujours "en attente"
-- ---------------------------------------------------------------------------
drop policy if exists "un membre initie son propre paiement" on public.paiements;
create policy "un membre initie son propre paiement"
  on public.paiements for insert
  with check (
    auth.uid() = profil_id
    and statut = 'en_attente'
    and confirme_at is null
    and reference_chariow is null
  );
