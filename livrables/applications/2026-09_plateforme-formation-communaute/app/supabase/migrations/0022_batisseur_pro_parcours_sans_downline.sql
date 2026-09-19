-- Retire la promesse "un vrai suivi de ta downline" de la vitrine de Batisseur
-- Pro (etape 3 du parcours, communaute payante). Cette fonctionnalite n'existe
-- pas dans la plateforme : le suivi de downline est une fonction de Kora
-- (livrables/applications/2026-09_app-prospection-mlm/), pas de Vivier
-- Academies. Une vitrine ne doit pas promettre ce que le produit ne fait pas.
--
-- Decouvert le 2026-09-19 en verifiant le texte reel affiche par la vitrine.
-- Le texte remplace ne garde que ce que la communaute payante fait vraiment
-- (exercices hebdomadaires, echanges entre membres). Meme style que les deux
-- autres etapes du parcours de cet espace.

update espaces
set contenu_vitrine = contenu_vitrine || jsonb_build_object(
  'parcours_etape3', 'Exercices envoyes chaque semaine et echanges avec les autres membres de l''equipe.'
)
where slug = 'batisseur-pro';
