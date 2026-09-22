# Vidéo : Préparer vos livrables professionnels

Module 1, section 4 « Claude Code au quotidien », chapitre 2 sur 3. Sources : `04-quotidien.md`, chapitre 2, et `04-quotidien-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait ce que contient un vrai livrable professionnel (pas que le produit technique), et a généré une documentation client et une reformulation en valeur non technique, en conditions réelles avec Claude Code.
- **Signal de réussite** (repris du "à faire" de la section 4, `00-guide-de-reussite.md`) : un exemple de documentation client non technique généré à partir d'un projet réel ou fictif.
- **Prérequis de l'élève** : avoir suivi le chapitre 1 de cette section (second brain). Aucun outil supplémentaire à installer.
- **Durée cible** : entre 6 et 9 minutes.
- **Exemple concret qui porte la vidéo** : le site vitrine de Menuiserie Dubois (le projet fil rouge déjà utilisé dans le module), pour la documentation client. Puis l'exemple d'audit IA hôtellerie du chapitre, pour la reformulation en valeur.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Une phrase du cours cite Chatllow et les clients CAC40**, à neutraliser pour un public d'élèves :
   - Texte d'origine : « C'est particulièrement vrai pour un cabinet comme Chatllow qui vise des clients CAC40, où la forme professionnelle du livrable compte autant, parfois plus, que le fond technique aux yeux d'un dirigeant qui ne lira jamais une ligne de code. »
   - Version proposée : « C'est particulièrement vrai pour un cabinet de conseil qui vise de grands comptes, où la forme professionnelle du livrable compte autant, parfois plus, que le fond technique aux yeux d'un dirigeant qui ne lira jamais une ligne de code. »
2. **Démonstration réelle confirmée** : les deux prompts de la fiche pratique, joués en direct sur le projet Menuiserie Dubois pour le premier, et sur l'exemple hôtellerie du cours pour le second (le texte à coller est repris mot pour mot du chapitre, pas inventé).
3. **Le prompt 2 de la fiche a un texte à coller entre crochets** (`[colle ici la liste de fonctionnalités]`) : pour la démonstration, ce texte est remplacé par la liste technique déjà donnée dans l'exemple concret du chapitre (« webhook n8n connecté au PMS, scoring automatique des leads, export CSV quotidien »), pas par un exemple inventé pour l'occasion.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce deuxième chapitre de la section Claude Code au quotidien. Après le second brain, un autre usage essentiel : préparer un livrable que votre client va vraiment comprendre, utiliser, et auquel il va faire confiance. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:17 | Un livrable, ce n'est pas seulement le produit technique qui fonctionne. C'est aussi comment il est présenté, documenté, transmis. Le client, surtout un dirigeant non technique, va juger votre présentation autant que la qualité du code, qu'il ne verra jamais. | Diapositive 2 (avant-après : produit seul contre produit et présentation). | Aucune. |
| 0:34 | Un bon livrable a trois éléments. Le produit lui-même. Une documentation claire de ce qui a été fait et comment l'utiliser au quotidien. Et une explication de la valeur apportée, en langage non technique, pas une liste de fonctionnalités. | Diapositive 3, un clic par carte (3 clics). | Un clic par carte. |
| 0:51 | Claude Code peut vous aider à générer cette documentation et ces supports. Mais le soin apporté à la présentation, le choix de ce qui mérite d'être mis en avant pour ce client précis, reste une compétence humaine. C'est particulièrement vrai pour un cabinet de conseil qui vise de grands comptes. | Diapositive 4 (une phrase, avec un appui). | Un clic pour l'appui. |
| 1:12 | Mettons ça en pratique. Le site de Menuiserie Dubois est terminé côté technique. Je demande à Claude Code une documentation non technique : comment modifier le contenu du site, comment consulter les messages du formulaire de contact, qui contacter en cas de problème. | VS Code : le prompt de la fiche collé et envoyé, puis la documentation générée à l'écran. | Coller le premier prompt de la fiche (documentation client, sur le dossier Menuiserie Dubois). Lire la documentation générée. ⏱ +40 s |
| 2:10 | Deuxième cas, un audit IA pour un hôtel. Côté technique, on a livré : un webhook n8n connecté au PMS, un scoring automatique des leads, un export CSV quotidien. Je demande à Claude Code de reformuler ça en bénéfices pour un dirigeant qui ne lira jamais le code. | VS Code : le deuxième prompt collé avec la liste technique de l'exemple, puis la reformulation générée. | Coller le deuxième prompt avec la liste technique de l'exemple hôtellerie. Comparer avec la reformulation du cours (« vous savez en temps réel quelles réservations... »). ⏱ +35 s |
| 3:06 | Vous venez de faire le "à faire" de cette section : générer une documentation client non technique. Un exercice pour vous : reprenez un livrable que vous avez déjà produit, ou que vous imaginez produire, et reformulez-le de la même façon pour un client non technique. | Diapositive 5 (une phrase, avec un appui, rappel de l'exercice). | Un clic pour l'appui. |
| 3:26 | Retenons l'essentiel. Un livrable, c'est le produit et sa présentation, les deux comptent. Une documentation claire, plus une valeur exprimée simplement. Et la forme compte d'autant plus face à un client grand compte. Dans la prochaine vidéo, gérer votre propre business avec Claude Code. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**353 mots prononcés**, soit environ 2,5 minutes de voix, plus 75 secondes de manipulation à l'écran. **Durée estimée : 3:46**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de démonstration (40 s, 35 s) sont des estimations : la vitesse de génération de Claude Code varie.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : les trois éléments d'un bon livrable, le rôle de Claude Code et ce qu'il ne remplace pas, l'exemple hôtellerie repris mot pour mot (liste technique et reformulation), le premier prompt sur Menuiserie Dubois repris tel quel. Écart : la phrase citant Chatllow et les clients CAC40 est neutralisée (point 1 des points à valider). Le texte à coller entre crochets du deuxième prompt est remplacé par l'exemple du cours, pas inventé (point 3).
