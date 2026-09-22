# Vidéo : Installer votre assistant personnel

Section 0 « Bienvenue », chapitre 3 (dernier de la section). Sources : `01-bienvenue.md`, chapitre 3, et `01-bienvenue-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève a un assistant personnel réel (3 fichiers), un workspace organisé (un dossier `projets/` séparé), et sait recharger son assistant en une commande.
- **Signal de réussite** : les 3 fichiers créés, le dossier `projets/` en place, et un rechargement réussi.
- **Prérequis de l'élève** : avoir Claude Code installé et accessible. Aucun autre prérequis, c'est le premier geste pratique de toute la formation.
- **Durée cible** : entre 4 et 7 minutes.
- **Exemple concret qui porte la vidéo** : installer un assistant personnel et organiser le workspace pour un persona fictif (Mariam, en reconversion vers le conseil IA), avec le module `kit-starter-vivier-academies` (une commande `/install`), puis le prompt de rechargement de la fiche.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Ce chapitre remplace `module-installs/jarvis-install/`, un module d'un tiers (Yassine SDIRI).** Le mécanisme filmé (3 fichiers copiés depuis des modèles, interview via `/install`, dossier `projets/`) est une réécriture originale, packagée le 22 septembre 2026 en un vrai module `module-installs/kit-starter-vivier-academies/`. Le nom « Jarvis » n'est jamais utilisé, ni à l'oral ni à l'écran.
2. **Le persona de démonstration est fictif** (Mariam), distinct de celui utilisé plus tard au Module 1, section 4 (le coach en marketing de réseau), pour ne pas créer de confusion entre les deux démonstrations. Informations fictives décidées à l'avance, pour ne pas hésiter en direct.
3. **Les questions posées par Claude Code ne sont pas garanties mot pour mot** : le module INSTALL.md donne le texte exact de chaque question, mais l'agent peut légèrement reformuler. Répéter la démonstration avant l'enregistrement.
4. **La commande `/install` remplace le prompt à copier-coller** de la première version de ce script. Le prompt de rechargement (deuxième prompt de la fiche) reste inchangé, lui, repris mot pour mot.
5. **L'organisation du workspace (dossier `projets/`) est une étape ajoutée le 22 septembre 2026**, distincte de la création de l'assistant : le module l'annonce comme un geste séparé, pas fondu dans l'interview.

## 3. Script minuté

Le rythme retenu est de 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| {{t1}} | Bonjour, et bienvenue dans ce troisième et dernier chapitre de la section Bienvenue. Avant d'entrer dans le Module 1, un geste simple qui va rendre tout le reste plus facile. Installer votre assistant personnel, et organiser votre workspace. En une seule fois, en direct. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| {{t2}} | Un espace qui vous connaît. Qui garde en mémoire votre contexte. Et qui vous aide sans que vous ayez à tout réexpliquer à chaque fois. Vous allez vous en servir pour suivre votre progression dans cette formation. Mais aussi, si vous le souhaitez, pour bien plus large que ça. | Diapositive 2 (une phrase, avec un appui). | Un clic pour l'appui. |
| {{t3}} | Le principe tient en trois fichiers. Un fichier qui dit qui vous êtes, et comment vous voulez qu'on vous parle. Un fichier de contexte, avec votre situation et vos objectifs. Et un journal, qui garde la trace de ce qui a été fait et décidé. Vous n'avez rien à écrire vous-même. | Diapositive 3, un clic par carte (3 clics). | Un clic par carte. |
| {{t4}} | Installons-le maintenant. J'imagine Mariam, qui se reconvertit vers le conseil en IA. Une seule commande suffit. Claude Code me pose ses questions : qui je suis, ce qui m'amène à cette formation, mes objectifs, comment je préfère communiquer. J'y réponds une par une. | VS Code en plein écran : la commande tapée, puis les questions de Claude Code, puis les réponses. | Taper `/install module-installs/kit-starter-vivier-academies`. Répondre avec les informations fictives de Mariam. ⏱ +65 s |
| {{t5}} | Avant d'écrire les fichiers, Claude Code résume ce qu'il a compris. Je vérifie que ça me correspond, et je valide. Les trois fichiers sont créés, à partir de modèles prêts à l'emploi. Je les ouvre, pour vérifier qu'ils contiennent bien mes informations, pas des inventions. | VS Code : le récapitulatif de Claude Code, puis les trois fichiers ouverts dans l'éditeur. | Valider le récapitulatif. Ouvrir CLAUDE.md, context/CONTEXT.md et context/HISTORY.md. ⏱ +25 s |
| {{t6}} | Une dernière chose, avant de terminer. Mon workspace a besoin d'une place claire pour mes futurs projets, séparée de mon assistant. Claude Code crée un dossier projets. C'est là que je construirai tout ce que je pratiquerai, à commencer par le fil rouge du Module 1. | VS Code : le dossier `projets/` créé, avec son README. | Vérifier la création du dossier `projets/`. ⏱ +15 s |
| {{t7}} | Une fois tout en place, je simule une nouvelle session. Je demande à Claude Code de tout relire, et de me résumer qui je suis et où j'en suis. C'est ça, l'équivalent d'un rechargement en une seule commande. | VS Code : le second prompt, puis le résumé produit par Claude Code. | Coller le prompt « Recharger ton assistant » de la fiche. Vérifier que le résumé correspond bien. ⏱ +20 s |
| {{t8}} | Vos premières réponses seront sans doute imparfaites, ou incomplètes. Ce n'est pas grave. Ces fichiers ne sont pas figés, vous pourrez les corriger et les enrichir au fil de la formation, exactement comme des notes personnelles qui s'affinent avec le temps. | Diapositive 4 (une phrase, avec un appui). | Un clic pour l'appui. |
| {{t9}} | Retenons l'essentiel. Trois fichiers pour votre assistant. Un dossier projets pour votre travail. Une interview guidée qui remplit tout ça pour vous. Et rien n'est figé, ça s'enrichit au fil de la formation. Vous êtes prêt. Dans la prochaine vidéo, le Module 1, la fondation de tout le programme. À tout de suite. | Diapositive 5 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

{{duree_estimee}}

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de la démonstration (65 s, 25 s, 15 s, 20 s) sont des estimations : répondre aux questions de Claude Code prend un temps variable selon leur nombre exact.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source, à la fiche, et au module `kit-starter-vivier-academies` : le principe des trois fichiers, l'interview guidée qui les remplit à partir de modèles, la vérification avant écriture, la création du dossier `projets/` comme étape séparée, ce que ça change dès la session suivante, et le fait que rien n'est figé. La commande `/install` correspond exactement à `module-installs/kit-starter-vivier-academies/README.md`. Le prompt de rechargement est repris mot pour mot. Écart : aucun, ce chapitre est un contenu original écrit pour ce programme, pas adapté d'une source personnelle. Points de vigilance : le nom « Jarvis » n'apparaît jamais (point 1), le persona Mariam est distinct de celui du Module 1 section 4 (point 2).
