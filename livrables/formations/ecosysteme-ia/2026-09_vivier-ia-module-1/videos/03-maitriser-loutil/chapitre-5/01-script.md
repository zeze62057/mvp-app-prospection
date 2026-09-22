# Vidéo : Hooks, automatiser Claude Code

Module 1, section 3 « Maîtriser l'outil », chapitre 5. Sources : `03-maitriser-loutil.md`, chapitre 5, et `03-maitriser-loutil-prompts.md`, chapitre 5.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait ce qu'est un hook, en quoi il diffère d'une instruction ponctuelle, et sait en demander un à Claude Code plutôt que l'écrire à la main.
- **Signal de réussite** : le guide de réussite (étape 3) ne demande pas de configurer un hook à ce stade. Le chapitre le dit lui-même : pertinent une fois un besoin de fiabilité identifié par l'expérience, pas dès le premier jour. Pas de signal de passage obligatoire pour ce chapitre.
- **Prérequis de l'élève** : avoir suivi les chapitres 1 à 4 de la section 3.
- **Durée cible** : entre 4 et 7 minutes. Chapitre court comme le précédent : un concept, une nuance sur le bon moment de l'utiliser, une seule démonstration.
- **Exemple concret qui porte la vidéo** : demander à Claude Code de configurer un hook qui bloque un commit Git contenant un `.env` ou une clé, puis vérifier réellement qu'il bloque une tentative.

## 2. Points à valider avec Zézé avant d'enregistrer

Contrairement aux chapitres précédents de cette section, **rien à neutraliser cette fois** : ni le chapitre ni sa fiche ne citent votre workspace, un client ou un produit réel.

1. **La démonstration initialise Git.** Le dossier de démonstration (`C:\demo-g`, repris depuis le chapitre 2) n'a pas encore de dépôt Git. `git init` est nécessaire avant de tester le hook. Ce n'est pas dans le cours de cette section, mais c'est une manipulation neutre, déjà vue à la section 1, chapitre 3.
2. **Le fichier `.env` de test contient une valeur fictive uniquement** (par exemple `FAKE_KEY=test`), jamais une vraie clé, conformément à la règle du skill sur les secrets à l'écran.
3. **Le prompt de la fiche est repris mot pour mot**, y compris sa question complémentaire sur la désactivation temporaire.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce cinquième chapitre de la section sur la maîtrise de l'outil. Aujourd'hui, les Hooks : comment automatiser un comportement systématique. Nous verrons ce qui les distingue d'une instruction ponctuelle. Des exemples concrets. Et un hook réel, configuré et testé en direct. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:19 | Un hook est une règle automatique, qui se déclenche à un moment précis du fonctionnement de Claude Code. Avant qu'un outil s'exécute. Après qu'une réponse soit donnée. Quand une session se termine. La différence avec une instruction donnée en conversation : un hook s'applique systématiquement. Sans dépendre du fait qu'on ait pensé à le redemander ce jour-là. | Diapositive 2, clic 1 : la carte « Une instruction ». Clic 2 : la carte « Un hook ». | Deux clics, un par carte. |
| 0:44 | Quelques exemples. Forcer une vérification avant tout commit Git. Empêcher une action dans un dossier particulièrement sensible, comme un dossier de clés d'API. Déclencher une notification quand une tâche longue se termine en arrière-plan. Chacun répond à un besoin de fiabilité qu'on ne veut plus laisser dépendre de la vigilance du moment. | Diapositive 3, un clic par carte (3 clics). | Un clic par carte. |
| 1:06 | Les hooks se configurent dans un fichier settings.json. Celui du projet, partagé avec l'équipe, ou une version locale, personnelle. Sous une clé hooks, avec le moment de déclenchement, et la commande à lancer à ce moment précis. La syntaxe demande de la rigueur. Le plus fiable : demander à Claude Code de la configurer, plutôt que l'écrire à la main. | Diapositive 4, un clic par ligne (3 clics). | Un clic à chaque ligne. |
| 1:32 | Je demande directement à Claude Code de configurer ce hook pour moi. Bloquer tout commit qui ajouterait un fichier .env, ou une clé d'API en clair. Je regarde où il a écrit la règle. Et je lui demande comment la désactiver temporairement, si j'en ai vraiment besoin un jour. | VS Code en plein écran : le prompt, puis le fichier `settings.json` créé, ouvert dans l'éditeur. | Initialiser Git sur le dossier (`git init`). Coller le prompt du chapitre 5 de la fiche. Ouvrir le `settings.json` créé. ⏱ +45 s |
| 2:38 | Je crée maintenant un fichier .env de test, avec une valeur fictive, jamais une vraie clé. Je tente un commit qui l'inclut. Le hook bloque bien la tentative, exactement comme demandé. | Terminal : création du `.env` de test, `git add`, tentative de commit, message de blocage. | Créer un `.env` avec une valeur fictive. Tenter `git add` et un commit. Montrer le blocage. ⏱ +40 s |
| 3:31 | C'est un mécanisme plus avancé que les précédents de ce chapitre. Pertinent surtout une fois qu'on a identifié, par l'expérience, un comportement qu'on veut garantir à chaque fois. Un débutant n'a pas besoin de configurer un hook dès son premier projet. Il doit simplement savoir que ce mécanisme existe. | Diapositive 5 (une phrase, avec un appui). | Un clic pour l'appui. |
| 3:52 | Retenons l'essentiel. Un hook est une règle automatique, déclenchée à un moment précis, pas une instruction ponctuelle. Il garantit un comportement systématique, indépendant de la vigilance du moment. Le guide de réussite ne vous demande pas d'en configurer un dès maintenant. Gardez ce chapitre en tête, pour le jour où un besoin récurrent de fiabilité apparaîtra. Dans la prochaine vidéo, structurer son projet, l'arborescence qui scale. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**413 mots prononcés**, soit environ 3,0 minutes de voix, plus 85 secondes de manipulation à l'écran. **Durée estimée : 4:22**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de la démonstration (45 s et 40 s) sont des estimations, en particulier le temps de rédaction du hook par Claude Code, variable.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : la définition du hook (règle automatique, moment précis, systématique), les trois exemples cités (commit, dossier sensible, notification), l'installation (`settings.json`, clé `hooks`, moment de déclenchement, recommandation de le faire configurer par Claude Code), le point sur l'introduction au bon moment (mécanisme avancé, pas nécessaire dès le premier projet), et le prompt de démonstration (repris mot pour mot). Aucun écart de neutralisation cette fois : le chapitre ne cite aucun élément du workspace de Zézé.
