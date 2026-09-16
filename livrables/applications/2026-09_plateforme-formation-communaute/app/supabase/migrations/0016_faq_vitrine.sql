-- FAQ de la vitrine (voir types/espace.ts, champ contenu_vitrine.faq).
-- Reponses basees uniquement sur des faits reels du produit, aucune
-- validee le 2026-09-16 avec Zeze (remboursement, duree d'acces, niveau
-- requis, support). "{{prix}}" est remplace dynamiquement par le prix
-- reel de l'espace au rendu, jamais fige dans ce texte.

update espaces
set contenu_vitrine = contenu_vitrine || jsonb_build_object(
  'faq', jsonb_build_array(
    jsonb_build_object(
      'question', 'Faut-il deja savoir coder ?',
      'reponse', 'Non, c''est le principe meme de la formation. Claude Code traduit tes instructions en code, ton travail est d''apprendre a cadrer et valider, pas a ecrire de la syntaxe.'
    ),
    jsonb_build_object(
      'question', 'Combien coute la formation complete ?',
      'reponse', '{{prix}}, en un seul paiement.'
    ),
    jsonb_build_object(
      'question', 'Comment se fait le paiement ?',
      'reponse', 'Par Mobile Money (Orange Money, MTN Money). L''acces est active des reception du paiement.'
    ),
    jsonb_build_object(
      'question', 'Qu''est-ce qui est inclus dans la formation complete ?',
      'reponse', 'Tous les modules du programme, ta page de progression personnelle, et la communaute payante avec exercices et echanges entre eleves.'
    ),
    jsonb_build_object(
      'question', 'La communaute gratuite est-elle vraiment gratuite ?',
      'reponse', 'Oui, sur approbation manuelle, sans engagement.'
    ),
    jsonb_build_object(
      'question', 'Puis-je me faire rembourser ?',
      'reponse', 'Non, le paiement est definitif, sans politique de remboursement.'
    ),
    jsonb_build_object(
      'question', 'Combien de temps je garde l''acces une fois paye ?',
      'reponse', 'A vie. Une fois l''acces active, il ne s''arrete jamais.'
    ),
    jsonb_build_object(
      'question', 'Y a-t-il un niveau requis pour demarrer ?',
      'reponse', 'Aucun. La formation est ouverte aux debutants complets, sans prerequis.'
    ),
    jsonb_build_object(
      'question', 'Je suis bloque sur un exercice, comment obtenir de l''aide ?',
      'reponse', 'Via la communaute payante, ou tu peux poser tes questions et echanger avec les autres eleves.'
    )
  )
)
where slug = 'vivier-ia';
