-- Contenu marketing de la vitrine, par espace (voir CADRAGE.md section 0 :
-- un espace est generique, son contenu vitrine est de la donnee, jamais du
-- JSX code en dur par nom d'espace).

alter table espaces
  add column if not exists contenu_vitrine jsonb not null default '{}'::jsonb;

update espaces
set contenu_vitrine = jsonb_build_object(
  'hero_kicker', 'communaute gratuite · vivier ia',
  'hero_titre', E'Tu n''as jamais code.\nCe soir, ton premier\nsite sera *en ligne*.',
  'hero_sous_titre', 'Claude Code traduit ce que tu decris en produit reel. Rejoins la communaute gratuite, suis les premiers exercices, et passe a la formation complete quand tu es pret.',
  'terminal_titre', 'claude — ma-couture',
  'terminal_lignes', jsonb_build_array(
    'Cree-moi un site vitrine pour mon activite de couture',
    'Je pose d''abord le plan avant de construire...',
    '✓ Structure du site posee',
    '✓ Premier commit Git effectue',
    '✓ Deploye sur Vercel'
  ),
  'terminal_lien', 'ma-couture.vercel.app',
  'fondateur_tag', 'agentic coding',
  'fondateur_lede', 'Je n''ai pas grandi dans le code. J''ai grandi en Guinee Forestiere.',
  'fondateur_paragraphes', jsonb_build_array(
    'Claude Code m''a fait comprendre un truc simple : **le vrai obstacle n''a jamais ete la syntaxe**, c''etait l''acces. A l''outil, a la methode, a quelqu''un qui explique en francais, sans survendre.',
    'Alors j''ai commence a documenter chaque chapitre que j''apprenais, chaque erreur, chaque deploiement rate puis reussi.',
    '**Vivier Academies, c''est ce chemin transforme en formation** — pour que tu n''aies pas a le refaire seul.'
  ),
  'offre_texte', 'Les **50 premiers** membres de la communaute gratuite recoivent **3 mois d''acces offerts** a la communaute payante a leur inscription.'
)
where slug = 'vivier-ia';
