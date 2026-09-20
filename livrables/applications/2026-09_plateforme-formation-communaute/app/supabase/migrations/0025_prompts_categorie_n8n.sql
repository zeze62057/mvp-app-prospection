-- Ajoute la categorie "n8n" a la bibliotheque de prompts (voir 0010).
--
-- Les fiches pratiques du Module 2 (n8n) contiennent des prompts d'automatisation
-- qui ne rentrent dans aucune des 4 categories de la maquette (Fondations, Methode,
-- Quotidien, Business). Plutot que de les ranger de force dans "Methode", on ajoute
-- une categorie dediee. Le filtre de la bibliotheque n'affiche que les categories
-- presentes : un espace sans prompt n8n ne voit pas ce filtre.
--
-- Migration additive : les lignes existantes restent valides.

alter table prompts drop constraint if exists prompts_categorie_check;

alter table prompts add constraint prompts_categorie_check
  check (categorie in ('fondations', 'methode', 'quotidien', 'business', 'n8n'));
