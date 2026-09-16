-- Espace Batisseur Pro (marketing de reseau), deuxieme espace de Vivier
-- Academies (voir CADRAGE.md section 3). Trio complet Vivier IA construit
-- et stable (voir CADRAGE.md section 5), replication maintenant : juste
-- la structure de l'espace, pas encore le contenu de cours (decision de
-- Zeze le 2026-09-16).
--
-- Contenu vitrine adapte de la maquette maquette/BatisseurProFormation.dc.html
-- (hero deja redige), plus le parcours reecrit pour l'audience marketing
-- de reseau (memes faits reels du produit : approbation manuelle, paiement
-- Mobile Money, exercices hebdomadaires -- pas d'invention, juste un ton
-- different de Vivier IA). Prix aligne sur Vivier IA (250 000 GNF), decision
-- de Zeze le 2026-09-16, modifiable ensuite dans /admin comme tout espace.

insert into espaces (slug, nom, tagline, prix, devise, actif, contenu_vitrine)
values (
  'batisseur-pro',
  'Bâtisseur Pro',
  'L''IA appliquee au marketing de reseau',
  250000,
  'GNF',
  true,
  jsonb_build_object(
    'hero_kicker', 'communaute gratuite · batisseur pro',
    'hero_titre', E'Construis ton reseau avec des outils que\ntes concurrents *n''utilisent pas encore*.',
    'hero_sous_titre', 'L''IA appliquee au marketing de reseau : liste de noms, scripts de prospection, suivi d''equipe. Peu importe ton entreprise, la methode fonctionne partout.',
    'parcours_titre', 'De la premiere liste de noms a une equipe qui se duplique',
    'parcours_etape1', 'Demande d''acces approuvee manuellement. Contenu gratuit pour decouvrir l''IA appliquee au marketing de reseau, sans engagement.',
    'parcours_etape2', 'Paiement Mobile Money — Orange ou MTN. Acces immediat au programme complet et a ta page de progression personnelle.',
    'parcours_etape3', 'Exercices envoyes chaque semaine, echanges avec les autres membres de l''equipe, et un vrai suivi de ta downline.'
  )
)
on conflict (slug) do nothing;
