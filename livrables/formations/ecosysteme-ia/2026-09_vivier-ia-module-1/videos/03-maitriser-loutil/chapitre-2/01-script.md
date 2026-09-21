# Vidéo : CLAUDE.md, le cerveau de votre projet

Module 1, section 3 « Maîtriser l'outil », chapitre 2. Sources : `03-maitriser-loutil.md`, chapitre 2, et `03-maitriser-loutil-prompts.md`, chapitre 2.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait à quoi sert CLAUDE.md, ce qu'on y met, comment le créer, et pourquoi il doit rester vivant.
- **Signal de réussite** : l'étape 3 du guide de réussite demande de « créer un vrai CLAUDE.md pour ce projet ». Le signal de passage est un CLAUDE.md à jour dans le projet de l'élève.
- **Prérequis de l'élève** : avoir suivi le chapitre 1 de la section 3.
- **Durée cible** : entre 6 et 9 minutes.
- **Exemple concret qui porte la vidéo** : le CLAUDE.md d'un projet de site vitrine pour un artisan menuisier (client fictif), créé puis mis à jour quand le client ajoute une boutique en ligne.

## 2. Points à valider avec Zézé avant d'enregistrer

Le chapitre du cours est écrit pour Zézé, pas pour des élèves. Deux passages ont été remplacés, et deux points demandent votre décision. Les « tu » du cours deviennent des « vous » ; les prompts de la fiche restent tels quels.

1. **« Ce workspace en est lui-même un exemple concret : son CLAUDE.md définit qui est Zézé, comment communiquer avec lui, et où se trouvent les différents types de contenu. »** Ce passage parle de votre workspace personnel. Il est supprimé du script : les élèves n'y ont pas accès, et il exposerait votre profil.
2. **L'exemple du changement de nom.** Le cours dit : « Le CLAUDE.md de ce workspace a dû être suivi d'une mise à jour du contenu déjà produit quand l'école a changé de nom, "Entrepreneur Académie" devenu "Vivier IA" le 12 septembre 2026. » C'est l'histoire interne de votre école. La leçon est gardée (un CLAUDE.md à jour ne suffit pas, il faut relire le contenu déjà écrit) mais illustrée par un cas générique : le nom d'un client qui change.
3. **La démonstration.** Elle reprend mot pour mot les deux prompts du chapitre 2 de la fiche pratique (créer le CLAUDE.md du site de la « Menuiserie Dubois », puis le mettre à jour après l'ajout d'une boutique en ligne), dans un **dossier vide et neuf** : le prompt parle d'un « nouveau projet ». Le contenu écrit par Claude Code n'est pas prévisible : lisez-le à voix haute et vérifiez qu'il contient les quatre informations demandées (le client, l'objectif, les conventions, la zone sensible).
4. **Ce qui n'est pas démontré.** Le cours dit que Claude Code lit CLAUDE.md automatiquement au démarrage de chaque session. Le montrer demanderait de relancer une session et de poser une question dont la réponse n'est pas dans le cours : je n'en invente pas. Le point est expliqué à l'oral, pas montré.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce deuxième chapitre de la section sur la maîtrise de l'outil. Aujourd'hui, un fichier qui change tout dans la durée : CLAUDE.md. Nous verrons ce qu'il résout. Ce qu'on y met. Comment le créer. Et pourquoi il doit rester vivant. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:19 | CLAUDE.md est un fichier que Claude Code lit automatiquement au début de chaque session de travail sur un projet. Il résout un problème très concret. Sans lui, il faudrait réexpliquer le contexte du projet à chaque nouvelle conversation. C'est fastidieux, et source d'oublis. | Diapositive 2 : la phrase apparaît seule. Le texte d'appui apparaît au clic. | Clic à « Il résout un problème très concret ». |
| 0:37 | Que met-on dedans ? En général : qui est l'utilisateur, ou le client. Quel est l'objectif du projet. Quelles conventions de code ou de style suivre. Quelles zones du projet sont sensibles, et ne doivent pas être modifiées sans validation explicite. Et comment le projet est structuré, dans ses grandes lignes. | Diapositive 3, un clic par élément (4 clics). | Un clic à chaque élément cité. |
| 0:59 | L'installation est très simple. Créez un fichier texte nommé CLAUDE.md, à la racine du projet. N'importe quel éditeur suffit, y compris VS Code. Aucune configuration supplémentaire n'est nécessaire. Claude Code le détecte et le lit automatiquement, au démarrage de chaque session sur ce projet, dès qu'il existe à cet emplacement précis. | Diapositive 4, un clic par étape (3 clics). | Un clic à chaque étape. |
| 1:21 | Voyons cela sur un cas concret. Je démarre un nouveau projet pour un client fictif : un site vitrine pour un artisan menuisier. Dans un dossier vide, je demande à Claude Code de créer le CLAUDE.md. Je lui donne le client, l'objectif du site, les conventions à suivre, et une zone sensible : ne jamais modifier les tarifs sans validation explicite du client. Voici le fichier créé. Je le relis. Et je vérifie qu'il contient bien ces quatre informations. | VS Code en plein écran : un dossier vide, le terminal avec Claude Code, le prompt, puis le fichier CLAUDE.md ouvert dans l'éditeur. | Ouvrir le dossier vide. Lancer `claude`. Coller le prompt « Créer un CLAUDE.md pour un nouveau projet client » de la fiche. Ouvrir le fichier créé et le lire à voix haute. ⏱ +70 s |
| 3:05 | Le projet évolue. Le client décide d'ajouter une boutique en ligne, pour vendre des petits objets en bois, en plus du site vitrine. Je demande à Claude Code de mettre à jour le CLAUDE.md, sans supprimer les informations déjà présentes sur le projet initial. Je relis le fichier, pour vérifier que le nouvel objectif est ajouté, et que le reste est conservé. | VS Code en plein écran : le terminal, le prompt de mise à jour, puis le CLAUDE.md modifié. | Coller le prompt « Mettre à jour un CLAUDE.md existant » de la fiche. Relire le fichier à voix haute. ⏱ +60 s |
| 4:31 | Un CLAUDE.md rédigé une fois au démarrage, et jamais retouché, perd rapidement sa valeur. Parce qu'il ne reflète plus la réalité du projet. Un bon CLAUDE.md est un document vivant. Il évolue avec le projet. Il se corrige quand une instruction générale est mal comprise par l'agent. Il s'enrichit quand un nouveau besoin récurrent apparaît. Un exemple : si le nom du client change, un CLAUDE.md à jour ne suffit pas. Il faut aussi relire les fichiers déjà produits. Sinon, Claude Code continuera à utiliser l'ancien nom dans tout nouveau contenu. | Diapositive 5, clic 1 : « Figé ». Clic 2 : « Vivant ». | Clic 1 à « rédigé une fois au démarrage ». Clic 2 à « Un bon CLAUDE.md est un document vivant ». |
| 5:10 | Pourquoi c'est décisif sur la durée. Un CLAUDE.md bien tenu permet à Claude Code de rester cohérent sur un projet qui dure des semaines, ou des mois. Avec plusieurs sessions de travail, espacées dans le temps. Parfois par d'autres personnes que vous, si vous déléguez une partie du travail. C'est la mémoire institutionnelle du projet. Indépendante de la mémoire d'une conversation précise. | Diapositive 6 : la phrase apparaît seule. Le texte d'appui apparaît au clic. | Clic à « C'est la mémoire institutionnelle ». |
| 5:37 | Retenons trois points. CLAUDE.md est lu automatiquement au début de chaque session, sans avoir à le redemander. Il contient le contexte permanent du projet, pas les instructions ponctuelles d'une tâche. Et c'est un document vivant, à maintenir à jour au fil du projet, jamais figé. Dans la prochaine vidéo, nous verrons les skills et les slash commands. À tout de suite. | Diapositive 7 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**544 mots prononcés**, soit environ 3,9 minutes de voix, plus 130 secondes de manipulation à l'écran. **Durée estimée : 6:03**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de la démonstration (70 s et 60 s) sont des estimations : l'attente de Claude Code se coupe au montage.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : ce que CLAUDE.md résout, ce qu'on y met, l'installation (fichier texte à la racine, aucune configuration, lecture automatique), le document vivant, l'intérêt sur la durée (mémoire institutionnelle), les trois points clés. Écarts : deux passages remplacés (points 1 et 2), démonstration reprenant les deux prompts de la fiche (point 3).
