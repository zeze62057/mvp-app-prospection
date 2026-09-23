-- Met a jour le badge affiche sur la photo du fondateur, section vitrine de
-- vivier-ia. Fusion `||` : seule la cle fondateur_tag est remplacee, le reste
-- de contenu_vitrine reste intact. Idempotente : la rejouer ecrit la meme valeur.

update espaces
set contenu_vitrine = contenu_vitrine || '{"fondateur_tag": "Expert Agentic Coding"}'::jsonb
where slug = 'vivier-ia';
