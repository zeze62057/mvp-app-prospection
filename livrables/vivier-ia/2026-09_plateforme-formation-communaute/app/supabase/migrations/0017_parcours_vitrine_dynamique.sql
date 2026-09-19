-- Deplace le texte de la section "le parcours" (3 paliers) de la vitrine,
-- jusqu'ici code en dur dans page.tsx et specifique a Vivier IA (mentionnait
-- "Claude Code" et "terminal"), vers contenu_vitrine (donnee par espace,
-- voir CADRAGE.md section 0 : jamais de JSX code en dur par nom d'espace).
--
-- Decouvert le 2026-09-16 en preparant la replication sur Batisseur Pro :
-- sans cette migration, la vitrine de Batisseur Pro afficherait a tort du
-- texte parlant de Claude Code. Texte de Vivier IA repris a l'identique,
-- aucun changement visible pour cet espace.

update espaces
set contenu_vitrine = contenu_vitrine || jsonb_build_object(
  'parcours_titre', 'Du terminal vide au premier client, en trois paliers',
  'parcours_etape1', 'Demande d''acces approuvee manuellement. Contenu gratuit pour decouvrir Claude Code et l''IA appliquee, sans engagement.',
  'parcours_etape2', 'Paiement Mobile Money — Orange ou MTN. Acces immediat aux modules complets et a ta page de progression personnelle.',
  'parcours_etape3', 'Exercices envoyes chaque semaine, echanges avec les autres eleves, et un vrai suivi jusqu''a ton premier projet livre.'
)
where slug = 'vivier-ia';
