-- Accents manquants dans le contenu de la vitrine (contenu_vitrine et tagline).
--
-- Corrige les textes tels qu'ils sont reellement en base au 2026-09-21 (lus avant
-- d'ecrire cette migration), pas tels que les migrations 0006 a 0022 les avaient
-- semes : certaines cles de batisseur-pro etaient deja accentuees a la main.
-- Fusion `||` : seules les cles listees ici sont remplacees, les autres restent
-- intactes (dont terminal_titre, parcours_titre de vivier-ia, fondateur_tag).
-- Idempotente : la rejouer ecrit les memes valeurs.

update espaces
set contenu_vitrine = contenu_vitrine || $json${
  "hero_kicker": "communauté gratuite · vivier ia",
  "hero_titre": "Tu n'as jamais codé.\nCe soir, ton premier\nsite sera *en ligne*.",
  "hero_sous_titre": "Claude Code traduit ce que tu décris en produit réel. Rejoins la communauté gratuite, suis les premiers exercices, et passe à la formation complète quand tu es prêt.",
  "terminal_lignes": [
    "Crée-moi un site vitrine pour mon activité de couture",
    "Je pose d'abord le plan avant de construire...",
    "✓ Structure du site posée",
    "✓ Premier commit Git effectué",
    "✓ Déployé sur Vercel"
  ],
  "parcours_etape1": "Demande d'accès approuvée manuellement. Contenu gratuit pour découvrir Claude Code et l'IA appliquée, sans engagement.",
  "parcours_etape2": "Paiement Mobile Money — Orange ou MTN. Accès immédiat aux modules complets et à ta page de progression personnelle.",
  "parcours_etape3": "Exercices envoyés chaque semaine, échanges avec les autres élèves, et un vrai suivi jusqu'à ton premier projet livré.",
  "fondateur_lede": "Je n'ai pas grandi dans le code. J'ai grandi en Guinée Forestière.",
  "fondateur_legende": "Capture d'un\ndéploiement réel",
  "fondateur_paragraphes": [
    "Claude Code m'a fait comprendre un truc simple : **le vrai obstacle n'a jamais été la syntaxe**, c'était l'accès. À l'outil, à la méthode, à quelqu'un qui explique en français, sans survendre.",
    "Alors j'ai commencé à documenter chaque chapitre que j'apprenais, chaque erreur, chaque déploiement raté puis réussi.",
    "**Vivier Academies, c'est ce chemin transformé en formation** — pour que tu n'aies pas à le refaire seul."
  ],
  "offre_texte": "Les **50 premiers** membres de la communauté gratuite reçoivent **3 mois d'accès offerts** à la communauté payante à leur inscription.",
  "faq": [
    {
      "question": "Faut-il déjà savoir coder ?",
      "reponse": "Non, c'est le principe même de la formation. Claude Code traduit tes instructions en code, ton travail est d'apprendre à cadrer et valider, pas à écrire de la syntaxe."
    },
    {
      "question": "Combien coûte la formation complète ?",
      "reponse": "{{prix}}, en un seul paiement."
    },
    {
      "question": "Comment se fait le paiement ?",
      "reponse": "Par Mobile Money (Orange Money, MTN Money). L'accès est activé dès réception du paiement."
    },
    {
      "question": "Qu'est-ce qui est inclus dans la formation complète ?",
      "reponse": "Tous les modules du programme, ta page de progression personnelle, et la communauté payante avec exercices et échanges entre élèves."
    },
    {
      "question": "La communauté gratuite est-elle vraiment gratuite ?",
      "reponse": "Oui, sur approbation manuelle, sans engagement."
    },
    {
      "question": "Puis-je me faire rembourser ?",
      "reponse": "Non, le paiement est définitif, sans politique de remboursement."
    },
    {
      "question": "Combien de temps je garde l'accès une fois payé ?",
      "reponse": "À vie. Une fois l'accès activé, il ne s'arrête jamais."
    },
    {
      "question": "Y a-t-il un niveau requis pour démarrer ?",
      "reponse": "Aucun. La formation est ouverte aux débutants complets, sans prérequis."
    },
    {
      "question": "Je suis bloqué sur un exercice, comment obtenir de l'aide ?",
      "reponse": "Via la communauté payante, où tu peux poser tes questions et échanger avec les autres élèves."
    }
  ]
}$json$::jsonb
where slug = 'vivier-ia';

update espaces
set
  tagline = 'L''IA appliquée au marketing de réseau',
  contenu_vitrine = contenu_vitrine || $json${
    "hero_kicker": "communauté gratuite · bâtisseur pro",
    "hero_titre": "Construis ton réseau avec des outils que\ntes concurrents *n'utilisent pas encore*.",
    "hero_sous_titre": "L'IA appliquée au marketing de réseau : liste de noms, scripts de prospection, suivi d'équipe. Peu importe ton entreprise, la méthode fonctionne partout.",
    "parcours_titre": "De la première liste de noms à une équipe qui se duplique",
    "parcours_etape1": "Demande d'accès approuvée manuellement. Contenu gratuit pour découvrir l'IA appliquée au marketing de réseau, sans engagement.",
    "parcours_etape2": "Paiement Mobile Money — Orange ou MTN. Accès immédiat au programme complet et à ta page de progression personnelle.",
    "parcours_etape3": "Exercices envoyés chaque semaine et échanges avec les autres membres de l'équipe."
  }$json$::jsonb
where slug = 'batisseur-pro';
