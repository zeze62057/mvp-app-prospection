# Vidéo : Le terminal et l'IDE, votre nouvel espace de travail

Module 1, section 1 « Les Fondations », chapitre 2. Source : `01-fondations.md`, chapitre 2.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait à quoi servent le terminal et l'IDE, comment les utiliser ensemble, et il a les deux ouverts côte à côte avec Claude Code lancé dans le terminal.
- **Signal de réussite** : le terminal et l'IDE sont ouverts côte à côte, et Claude Code démarre dans un dossier vide. C'est la première action du guide de réussite (étape 1) : « ouvrir un terminal et l'IDE côte à côte, et lancer Claude Code sur un dossier vide ».
- **Prérequis de l'élève** : avoir suivi le chapitre 1 (Node.js installé et Claude Code installé), et un ordinateur sous Windows, Mac ou Linux.
- **Durée cible** : entre 5 et 7 minutes. Le chapitre est court et sans blocage à traiter.
- **Exemple concret qui porte la vidéo** : vérifier dans l'IDE qu'un fichier a bien été modifié comme demandé, sans tout relire dans le terminal.

## 2. Points à valider avec Zézé avant d'enregistrer

Le chapitre du cours est écrit pour Zézé, pas pour des élèves. Un passage a été adapté, et deux points demandent votre décision. Rien d'autre n'a été changé sur le fond.

1. **L'exemple concret** dit dans le cours : « Sur ce workspace précisément, le terminal est l'endroit où tu tapes `/prime` en début de session, et où Claude Code répond "je vais lire CLAUDE.md et te faire un résumé de ta situation". L'IDE sert à vérifier qu'un fichier comme `04-quotidien.md` a bien été modifié. » Ce passage décrit le workspace personnel de Zézé, avec des fichiers qu'aucun élève n'a. Dans le script, il devient un exemple général : l'élève écrit une demande, Claude Code décrit ce qu'il va faire, puis l'élève ouvre le fichier modifié dans l'IDE pour vérifier. Le principe est identique, les fichiers de Zézé n'apparaissent plus.
2. **Une démonstration réelle est-elle souhaitée ?** Le cours décrit l'exemple sans le montrer. Pour le filmer, il faudrait demander une petite modification à Claude Code, par exemple créer un fichier. Ce genre de demande **n'existe pas dans le cours**. Le script ne l'invente donc pas : l'exemple est raconté sur la diapositive, et la démonstration montre seulement l'installation et l'agencement côte à côte. Si Zézé veut une vraie demande à l'écran, il doit fournir la demande à utiliser, ou valider celle que ce script proposerait.
3. **Le raccourci du terminal.** Le cours donne Ctrl et l'accent grave sur Windows et Linux, Commande et l'accent grave sur Mac. Sur un clavier français AZERTY, l'accent grave n'est pas une touche directe : ce raccourci peut être pénible. Le script montre d'abord le chemin par le menu (Terminal, puis New Terminal), puis cite le raccourci comme dans le cours. À vérifier sur le clavier de Zézé avant d'enregistrer, et à corriger si un autre raccourci fonctionne mieux.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce deuxième chapitre. Aujourd'hui, nous préparons votre poste de travail. Il tient en deux outils : le terminal et l'IDE. Nous verrons à quoi sert chacun. Comment les utiliser ensemble. Puis nous les installerons pas à pas. À la fin, vous aurez les deux ouverts côte à côte. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:22 | Commençons par le terminal. C'est l'endroit où Claude Code s'exécute. Beaucoup y voient une fenêtre noire intimidante. Ce n'est pas cela. C'est votre canal de conversation avec l'agent. Vous écrivez ce que vous voulez. Claude Code répond. Il agit. Il vous montre ce qu'il a fait. Vous n'avez pas besoin de mémoriser des commandes complexes. L'agent les utilise pour vous. Votre travail : lire ce qu'il propose, puis valider ou corriger. | Diapositive 2, clic 1 : la carte « Le terminal ». | Clic au début du paragraphe. |
| 0:53 | Deuxième outil : l'IDE. C'est un environnement de développement, comme VS Code. C'est là que vous voyez les fichiers du projet, et que vous naviguez dedans. Le code généré. La structure des dossiers. Les fichiers de configuration. Claude Code peut s'intégrer directement dans l'IDE, avec une extension. Vous voyez alors les changements en contexte, fichier par fichier. Pas seulement du texte dans le terminal. | Diapositive 2, clic 2 : la carte « L'IDE ». | Clic au début du paragraphe. |
| 1:20 | La bonne pratique du débutant : gardez les deux ouverts en parallèle. Le terminal pour diriger l'agent. L'IDE pour inspecter ce qui a été produit. Rassurez-vous : vous n'avez pas besoin d'écrire du code dans l'IDE. Il suffit de savoir vous y repérer. Quel fichier fait quoi. Où se trouve telle fonctionnalité. | Diapositive 3 : « Le terminal pour diriger, l'IDE pour inspecter ». Le texte d'appui apparaît au clic. | Clic sur « Rassurez-vous ». |
| 1:42 | Voyons cela sur un exemple. Dans le terminal, vous écrivez votre demande. Claude Code répond et vous décrit ce qu'il va faire. Ensuite, vous voulez vérifier qu'un fichier a bien été modifié comme demandé. Dans l'IDE, vous ouvrez directement la ligne concernée. Vous voyez le changement. Vous n'avez pas à tout relire dans le terminal. Puis vous validez, ou vous corrigez. | Diapositive 4 : la ligne « Dans le terminal » est visible ; un clic fait apparaître la ligne « Dans l'IDE », un second clic la phrase finale. | Clic 1 à « Dans l'IDE ». Clic 2 à « Puis vous validez ». |
| 2:09 | Passons à l'installation, en trois étapes. Première étape : téléchargez et installez Visual Studio Code, sur code.visualstudio.com. Il est gratuit. Il existe pour Windows, Mac et Linux. | Diapositive 5, clic 1, puis le navigateur sur code.visualstudio.com. | Afficher la page de téléchargement, sans lancer l'installation. Visual Studio Code est déjà installé sur la machine d'enregistrement. ⏱ +20 s |
| 2:40 | Deuxième étape : ouvrez le terminal intégré, directement dans VS Code. Menu Terminal, puis New Terminal. Le raccourci est Ctrl et l'accent grave sur Windows et sur Linux, Commande et l'accent grave sur Mac. | Diapositive 5, clic 2, puis VS Code ouvert sur un dossier vide. | Menu Terminal, puis New Terminal. Le terminal s'ouvre en bas de la fenêtre. ⏱ +25 s |
| 3:20 | Troisième étape : installez l'extension Claude Code pour VS Code. Ouvrez l'onglet Extensions, puis cherchez Claude Code. Cette extension vous permet de voir les fichiers modifiés directement dans l'éditeur, en plus du terminal. | Diapositive 5, clic 3, puis l'onglet Extensions de VS Code. | Onglet Extensions, recherche « Claude Code ». Montrer la fiche de l'extension. Ne pas cliquer sur Installer si elle l'est déjà. ⏱ +40 s |
| 4:14 | Vérifions que tout est en place. Le terminal est ouvert en bas. Les fichiers du projet sont sur le côté. Je lance Claude Code en tapant claude, dans ce dossier vide. Voilà votre poste de travail : le terminal pour diriger, l'IDE pour inspecter. | VS Code en plein écran : l'explorateur de fichiers, le terminal, puis Claude Code qui démarre. | Taper `claude` dans le terminal intégré. Masquer ou flouter l'adresse e-mail du compte si elle s'affiche. ⏱ +40 s |
| 5:13 | Retenons trois points. Le terminal est le canal de conversation et d'action avec l'agent. L'IDE est la fenêtre d'inspection visuelle du projet. Et se repérer suffit : pas besoin d'écrire le code soi-même. Dans la prochaine vidéo, nous verrons Git et GitHub, le filet de sécurité du code. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**490 mots prononcés**, soit environ 3,5 minutes de voix, plus 125 secondes de manipulation à l'écran. **Durée estimée : 5:35**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel.

## 5. Relecture de fidélité

Chaque affirmation et chaque nom du script a été comparé au chapitre source : le terminal comme canal de conversation, l'agent qui utilise les commandes, valider ou corriger ; l'IDE comme environnement de développement, comme VS Code, avec le code généré, la structure des dossiers et les fichiers de configuration ; l'extension qui montre les changements en contexte, fichier par fichier ; la bonne pratique de garder les deux ouverts ; se repérer sans écrire de code ; les trois étapes d'installation avec `code.visualstudio.com`, le menu Terminal puis New Terminal, les raccourcis, l'extension « Claude Code » ; les trois points clés. La commande `claude` vient du chapitre 1 et du guide de réussite. Les adaptations sont listées dans la section 2.
