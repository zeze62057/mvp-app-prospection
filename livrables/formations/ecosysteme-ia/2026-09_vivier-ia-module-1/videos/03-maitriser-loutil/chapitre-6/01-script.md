# Vidéo : Structurer son projet, l'arborescence qui scale

Module 1, section 3 « Maîtriser l'outil », chapitre 6. Sources : `03-maitriser-loutil.md`, chapitre 6, et `03-maitriser-loutil-prompts.md`, chapitre 6.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait ce qu'une bonne arborescence de projet change concrètement, et sait faire auditer puis réorganiser la sienne par Claude Code.
- **Signal de réussite** : l'étape 3 du guide de réussite demande de « vérifier l'arborescence du projet et la corriger si elle ne tiendrait pas à 10x sa taille actuelle ». C'est exactement la démonstration de ce chapitre.
- **Prérequis de l'élève** : avoir suivi les chapitres 1 à 5 de la section 3.
- **Durée cible** : entre 4 et 7 minutes, comme les deux chapitres précédents de cette section.
- **Exemple concret qui porte la vidéo** : auditer l'arborescence du site vitrine de l'artisan, puis la faire réorganiser réellement par Claude Code, avec les deux prompts de la fiche.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Les deux exemples « tirés de ce workspace ».** Le cours illustre la séparation des responsabilités avec les dossiers `context/`, `livrables/` et `.claude/` de votre workspace, puis avec la séparation entre `livrables/formations/ecosysteme-ia/` et `livrables/formations/marketing-reseau/` (dont l'ajout du Module 2 sans réorganisation). Ce sont vos dossiers réels, dont un lié à votre activité Longrich. Les deux sont retirés de la narration, remplacés par la démonstration réelle sur le site de l'artisan (les deux prompts de la fiche), qui illustre le même principe sans exposer votre structure.
2. **Rien d'autre à neutraliser** : le reste du chapitre (impact d'une bonne organisation, ce qui se passe quand elle manque, le principe de l'arborescence qui scale) est générique, aucun changement.
3. **La démonstration reprend les deux prompts de la fiche mot pour mot** : l'audit, puis la réorganisation après validation. Le site de démonstration n'a que 2 fichiers aujourd'hui (`index.html`, `style.css`) : Claude Code raisonne sur une taille future (50 fichiers), pas sur l'état actuel, exactement ce que demande le prompt.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce sixième chapitre de la section sur la maîtrise de l'outil. Aujourd'hui, structurer son projet : pourquoi l'arborescence compte. Nous verrons l'impact concret d'une bonne organisation. Ce qui se passe quand elle manque. Et un audit réel de structure, en direct. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:19 | La façon dont un projet est organisé, en dossiers et fichiers, a un impact direct sur votre capacité à vous y retrouver. Et sur celle de Claude Code. Ce n'est pas une question esthétique. C'est une question d'efficacité, mesurable au fil des semaines. | Diapositive 2 (titre seul, sans clic). | Aucune. |
| 0:38 | Une bonne structure sépare clairement les grandes responsabilités. Le code d'un côté. La documentation de l'autre. Les fichiers de configuration à part. Et les éléments déjà livrés, distincts du travail en cours. Cette séparation reste valable, quelle que soit la taille du projet. | Diapositive 2, un clic par carte (3 clics). | Un clic par carte. |
| 0:56 | À l'inverse, un projet mal structuré devient de plus en plus lent à faire évoluer. Même avec un agent très compétent. Chaque instruction doit composer avec un désordre croissant. L'agent doit deviner où se trouve telle chose. Il risque de modifier le mauvais fichier. Ou de dupliquer une logique qui existait déjà, sans le savoir. | Diapositive 3, clic 1 : la carte « Bonne structure ». Clic 2 : la carte « Structure qui manque ». | Deux clics, un par carte. |
| 1:20 | Prenons le site vitrine de l'artisan. Je demande à Claude Code d'auditer son arborescence actuelle. Et de me dire si elle resterait lisible, si le projet passait de 5 fichiers à 50. Plusieurs pages. Des images en nombre. Plusieurs types de contenus. | VS Code en plein écran : le prompt d'audit, puis la réponse de Claude Code. | Coller le prompt « Demander un audit de l'arborescence actuelle » de la fiche. ⏱ +35 s |
| 2:13 | Il me propose une nouvelle structure. Je la valide. Je lui demande de réorganiser les fichiers en conséquence. Et de corriger tous les chemins d'accès que ce déplacement casserait. Liens CSS, images, scripts. Je vérifie que le site fonctionne toujours après. | VS Code : le prompt de réorganisation, puis l'arborescence après déplacement, puis le site rechargé dans le navigateur. | Coller le prompt « Faire exécuter une réorganisation après validation » de la fiche. Vérifier le site après réorganisation. ⏱ +45 s |
| 3:15 | C'est le principe de l'arborescence qui scale. Une organisation qui reste compréhensible, même quand le projet passe de 10 à 100 fichiers. Le bon réflexe : poser cette structure dès le début. Pas attendre que le désordre devienne un problème visible. | Diapositive 4 (une phrase, avec un appui). | Un clic pour l'appui. |
| 3:33 | Retenons l'essentiel. L'organisation des dossiers impacte directement l'efficacité du travail avec l'agent. Séparez clairement code, documentation, configuration et livrables. Et posez une structure dès le début, plutôt que corriger le désordre après coup. L'étape 3 du guide de réussite vous demande justement de vérifier l'arborescence de votre projet, et de la corriger si elle ne tiendrait pas à 10 fois sa taille actuelle. Dans la prochaine vidéo, gérer les coûts intelligemment, dernier chapitre de cette section. À tout de suite. | Diapositive 5 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**390 mots prononcés**, soit environ 2,8 minutes de voix, plus 80 secondes de manipulation à l'écran. **Durée estimée : 4:07**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de la démonstration (35 s et 45 s) sont des estimations : le temps de réflexion de Claude Code sur la proposition de structure est variable.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : l'impact d'une bonne organisation, les quatre responsabilités à séparer, les conséquences d'une structure qui manque (lenteur, mauvais fichier modifié, logique dupliquée), le principe de l'arborescence qui scale, et les deux prompts de démonstration (repris mot pour mot). Écart : les deux exemples « tirés de ce workspace » retirés (point 1), remplacés par la démonstration sur le site de l'artisan, qui illustre le même principe.
