-- Bibliotheque de prompts : acces gratuit ou payant par prompt, et nouvelles categories (decision du 2026-10-01).
--
-- Jusqu'ici (0045) : tout membre d'un espace, gratuit OU payant, lisait tous les prompts de l'espace.
-- Desormais chaque prompt a un niveau d'acces :
--   'gratuite' : lu par l'adhesion gratuite approuvee ET par l'acces payant actif (comme avant, aucun changement
--                pour les 65 prompts deja en base, qui prennent la valeur par defaut) ;
--   'payante'  : lu UNIQUEMENT par un acces payant actif. Un membre gratuit ne recoit jamais ces lignes, la
--                base les lui cache (ce n'est pas un simple masquage dans l'interface).
-- Aucun droit d'ecriture n'est ajoute : seuls les scripts et les migrations ecrivent dans cette table.
--
-- Nouvelles categories :
--   Claude Design (gratuit)      : design_maquettes, design_identite, design_site, design_supports,
--                                  design_ameliorer, design_vers_code
--   Codex et ChatGPT (payant)    : codex_migration, chatgpt_ameliorer, chatgpt_integrer, chatgpt_securite
--
-- Migration additive : les lignes existantes restent valides. Ordre de mise en service conseille :
-- 1) cette migration, 2) le deploiement du code qui connait les nouvelles categories, 3) le contenu (0052).

alter table prompts
  add column if not exists acces text not null default 'gratuite';

alter table prompts drop constraint if exists prompts_acces_check;
alter table prompts add constraint prompts_acces_check check (acces in ('gratuite', 'payante'));

alter table prompts drop constraint if exists prompts_categorie_check;
alter table prompts add constraint prompts_categorie_check check (categorie in (
  'fondations', 'methode', 'quotidien', 'business', 'n8n',
  'design_maquettes', 'design_identite', 'design_site', 'design_supports', 'design_ameliorer', 'design_vers_code',
  'codex_migration', 'chatgpt_ameliorer', 'chatgpt_integrer', 'chatgpt_securite'
));

-- Remplace la regle de lecture de 0045.
drop policy if exists "membre gratuit ou payant lit les prompts de son espace" on prompts;
drop policy if exists "lecture des prompts selon l'acces" on prompts;

create policy "lecture des prompts selon l'acces"
  on prompts for select
  to authenticated
  using (
    (acces = 'gratuite' and public.est_membre_espace(auth.uid(), espace_id))
    or (acces = 'payante' and public.a_acces_zone(auth.uid(), espace_id, 'payante'))
  );

-- Un acces payant lisait deja l'ensemble des prompts via est_membre_espace : il continue de tout lire.
-- Un membre gratuit lit les prompts 'gratuite' seulement. Un utilisateur sans acces, comme anon, ne lit rien.
