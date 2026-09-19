-- Contenu texte des lecons : jusqu'ici une section n'avait qu'un titre (et
-- eventuellement une video, voir 0009). Le texte de la lecon est stocke en
-- Markdown dans sections.contenu.
--
-- Acces : la policy de lecture des sections (0008, "membre payant lit les
-- sections de son espace") s'applique a toute la ligne, donc le texte des
-- lecons n'est lisible que par un membre ayant l'acces payant. Aucune policy
-- a ajouter.
--
-- a_contenu : indicateur calcule, pour que les listes (formation, progression)
-- sachent quelles sections ont une lecon sans rapatrier le texte complet de
-- chaque section a chaque affichage.
--
-- Migration additive : l'ancien code qui lit "select *" recoit simplement deux
-- colonnes de plus et les ignore.

alter table sections add column if not exists contenu text;

alter table sections add column if not exists a_contenu boolean
  generated always as (contenu is not null and length(contenu) > 0) stored;
