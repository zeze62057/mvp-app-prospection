# Vidéo : Préparer une livraison client (checklist, sécurité, handoff)

Module 1, section 6 « Le Business », chapitre 1 sur 4, premier de la section. Sources : `06-business.md`, chapitre 1, et `06-business-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève connaît les 3 dimensions d'une checklist de livraison professionnelle, et a fait vérifier par Claude Code qu'aucun secret n'est exposé sur un vrai projet.
- **Prérequis de l'élève** : avoir suivi la section 5 (projet fil rouge Alpha Conseil, dossier `/alpha-conseil`).
- **Durée cible** : entre 6 et 9 minutes.
- **Exemple concret qui porte la vidéo** : le projet fil rouge Alpha Conseil, déjà construit en section 5, sur lequel on applique ici la dimension sécurité de la checklist.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Aucune référence à Chatllow ou à Zézé dans ce chapitre** : rien à neutraliser.
2. **Aucun nouveau prompt n'existe dans la fiche pour ce chapitre précis** : la fiche `06-business-prompts.md` ne détaille pas de prompt de checklist séparé, elle renvoie au chapitre 1 sans le développer. La démonstration reprend donc l'exemple concret du cours lui-même (« vérification qu'aucune clé d'API n'apparaît dans le code poussé sur GitHub »), traduit en une demande réelle et vérifiable à Claude Code sur le dossier `/alpha-conseil`, pas un nouveau prompt inventé.
3. **Le point « vérification fonctionnelle » n'est pas rejoué** : il a déjà été démontré en détail au chapitre 6 de la section 5 (test Playwright des 3 phases). Ce chapitre-ci rappelle ce point sans le refaire, et se concentre sur la dimension sécurité, non encore démontrée.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans la section 6, le Business. Premier chapitre : préparer une livraison client, au-delà de "c'est fini, voici le lien". | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:10 | Une livraison professionnelle couvre trois dimensions, aucune suffisante seule. Fonctionnelle : tout marche, testé en conditions réelles. Sécurité : données protégées, accès restreints, aucune clé exposée. Handoff : le client reçoit tout pour être autonome. | Diapositive 2, un clic par carte (3 clics). | Un clic par carte. |
| 0:25 | Le handoff est le point le plus souvent négligé. Un produit techniquement parfait, livré sans explication claire, laisse une impression d'inachevé. Le client ne juge pas que la technique, il juge son sentiment d'autonomie une fois que vous n'êtes plus là. | Diapositive 3 (une phrase, avec un appui). | Un clic pour l'appui. |
| 0:42 | Sur Alpha Conseil, le projet fil rouge de la section précédente : la vérification fonctionnelle, testée avec Playwright, a déjà été faite au chapitre 6. Vérifions maintenant la sécurité : aucune clé d'API ne doit apparaître dans le code. | VS Code en plein écran : la demande de vérification, puis Claude Code qui recherche dans les fichiers du projet. | Demander à Claude Code de vérifier qu'aucune clé d'API ou secret n'apparaît dans les fichiers de `/alpha-conseil`, avant un hypothétique push sur GitHub. Lire le résultat. ⏱ +40 s |
| 1:39 | C'est le troisième réflexe, le handoff : un guide qui explique au client comment consulter son dashboard, et une personne de contact claire en cas de problème après la mise en ligne. Les trois dimensions ensemble, c'est ça, livrer vraiment. | Diapositive 4, un clic par carte (2 clics). | Un clic par carte. |
| 1:56 | Retenons l'essentiel. Une livraison couvre fonctionnement, sécurité, et handoff, les trois ensemble. Le handoff mal fait peut gâcher un travail pourtant réussi techniquement. Prochaine vidéo : maintenir et faire évoluer un projet dans le temps. À tout de suite. | Diapositive 5 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**217 mots prononcés**, soit environ 1,6 minutes de voix, plus 40 secondes de manipulation à l'écran. **Durée estimée : 2:13**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Le temps de démonstration (40 s) est une estimation.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source : ce que livrer veut dire réellement, les trois dimensions, pourquoi le handoff est le plus négligé, la checklist type, l'exemple Alpha Conseil (vérification des clés d'API, guide, contact). Aucun écart de contenu : ce chapitre ne cite ni Zézé ni Chatllow. Précision au point 2 : la démonstration traduit l'exemple concret du cours en action réelle, faute de prompt dédié dans la fiche.
