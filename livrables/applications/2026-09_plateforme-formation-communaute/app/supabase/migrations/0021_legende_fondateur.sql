-- Deplace la legende de la petite carte a cote de la photo du fondateur
-- ("Capture d'un deploiement reel"), jusqu'ici codee en dur dans page.tsx et
-- affichee sur tous les espaces, vers contenu_vitrine (donnee par espace,
-- voir CADRAGE.md section 0 : jamais de JSX code en dur par nom d'espace).
--
-- Decouvert le 2026-09-19 en preparant la vitrine de Batisseur Pro : cette
-- legende n'a de sens que pour Vivier IA (deploiement d'une application), pas
-- pour des distributeurs en marketing de reseau. Texte de Vivier IA repris a
-- l'identique, aucun changement visible pour cet espace. Batisseur Pro ne
-- renseigne pas ce champ : sa carte n'est plus affichee.
--
-- A executer AVANT de deployer le nouveau page.tsx, sinon Vivier IA perdrait
-- sa carte le temps du deploiement.

update espaces
set contenu_vitrine = contenu_vitrine || jsonb_build_object(
  'fondateur_legende', E'Capture d''un\ndeploiement reel'
)
where slug = 'vivier-ia';
