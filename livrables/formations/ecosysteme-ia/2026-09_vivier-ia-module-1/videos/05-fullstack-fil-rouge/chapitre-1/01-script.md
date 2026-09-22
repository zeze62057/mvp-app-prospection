# Vidéo : De Lovable à Claude Code, la transition production

Module 1, section 5 « Le Fullstack, projet fil rouge », chapitre 1 sur 6, premier de la section. Sources : `05-fullstack-fil-rouge.md`, chapitre 1, et `05-fullstack-fil-rouge-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève sait pourquoi et quand basculer d'un outil de prototypage rapide vers Claude Code, et a vu cette transition en direct sur le projet fil rouge de la section.
- **Prérequis de l'élève** : avoir Claude Code installé et accessible. Aucun autre prérequis.
- **Durée cible** : entre 5 et 8 minutes.
- **Exemple concret qui porte la vidéo** : le projet fil rouge Alpha Conseil (cabinet de conseil fictif), qui sert de fil conducteur à toute la section 5. Ce chapitre construit le tout premier fichier du projet.
- **Continuité avec la suite de la section** : le dossier créé dans cette vidéo (`/alpha-conseil`) est réutilisé tel quel dans les chapitres 3, 4, 5 et 6 de cette même section. Ne pas le supprimer après l'enregistrement.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Démonstration réelle confirmée** : le prompt de la fiche (reconstruire un prototype Lovable décrit en texte, pas un vrai fichier Lovable) est repris mot pour mot et joué en direct, pour créer `/alpha-conseil`.
2. **Aucune référence à Chatllow ou à Zézé dans ce chapitre** : le texte source ne cite personne nommément, le scénario Alpha Conseil est déjà neutre. Rien à neutraliser ici.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans la section 5, le fullstack, votre projet fil rouge. C'est la section la plus pratique du module : un projet concret unique, mené du début à la fin, sur les 6 prochains chapitres. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:16 | Beaucoup d'entrepreneurs découvrent d'abord des outils comme Lovable, qui permettent de prototyper une interface très vite, sans coder. C'est un excellent point d'entrée : tester une idée, montrer une maquette à un client potentiel, valider un concept avant d'investir plus de temps. | Diapositive 2 (une phrase, avec un appui). | Un clic pour l'appui. |
| 0:34 | La limite arrive au moment de la production réelle. Des données sensibles, une sécurité réelle, une évolution dans le temps, une intégration avec d'autres outils. Ces outils de prototypage optimisent la vitesse de démonstration, pas la robustesse à long terme. | Diapositive 3 (avant-après : prototype contre production). | Aucune. |
| 0:51 | Claude Code prend le relais à ce moment précis, pas avant. On garde l'idée validée, éventuellement l'interface comme référence visuelle, et on reconstruit une base solide, qui peut évoluer sur plusieurs mois sans se heurter aux limites d'un outil de démonstration. | Diapositive 4, un clic par carte (3 clics). | Un clic par carte. |
| 1:09 | Mettons ça en pratique. Voici le projet fil rouge de cette section : Alpha Conseil, un cabinet de conseil fictif. Je décris à Claude Code le prototype Lovable imaginé pour son formulaire d'intake, et je lui demande de le reconstruire en HTML, CSS et JavaScript simple. | VS Code en plein écran : le prompt collé, puis le fichier généré, ouvert dans le navigateur. | Coller le prompt de la fiche (reconstruction du prototype Lovable) dans un dossier neuf `/alpha-conseil`. Ouvrir le fichier généré dans le navigateur. ⏱ +50 s |
| 2:18 | Ce n'est pas une copie visuelle du prototype. C'est une base pensée pour évoluer : une vraie connexion à une base de données et de vraies validations viendront dans les prochains chapitres. Ce dossier `/alpha-conseil` va nous suivre sur toute la section. | Diapositive 5 (une phrase, avec un appui). | Un clic pour l'appui. |
| 2:36 | Retenons l'essentiel. Prototyper vite avec les outils adaptés au prototypage. Produire avec les outils adaptés à la production. Ne pas confondre les deux étapes. Dans la prochaine vidéo, l'architecture qui combine Claude Code et n8n. À tout de suite. | Diapositive 6 : récapitulatif et prochaine vidéo. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**287 mots prononcés**, soit environ 2,0 minutes de voix, plus 50 secondes de manipulation à l'écran. **Durée estimée : 2:53**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Le temps de démonstration (50 s) est une estimation.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : le point de départ courant (Lovable), la limite en production, le relais pris par Claude Code, le principe de méthode, l'exemple Alpha Conseil repris tel quel. Aucun écart : ce chapitre ne cite ni Zézé ni Chatllow, rien à neutraliser.
