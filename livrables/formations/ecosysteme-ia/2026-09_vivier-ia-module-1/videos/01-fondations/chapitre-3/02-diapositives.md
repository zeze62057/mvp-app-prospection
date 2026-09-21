# Diapositives : Git et GitHub, le filet de sécurité du code

8 diapositives (une de plus que la limite habituelle : l'installation de Git, sa configuration et GitHub tiennent mal sur moins de trois écrans). Elles servent d'ouverture, de repères et de récapitulatif : le premier commit se montre à l'écran, dans VS Code, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Git et GitHub, le filet de sécurité du code | **Module 1, Section 1, Chapitre 3.** Objectif : comprendre le filet de sécurité, puis faire votre premier commit. Plan : 1. Git et GitHub. 2. Trois réflexes. 3. L'installation. |
| 2 | 0:20 | Git et GitHub, qui fait quoi ? | Git garde l'historique. GitHub l'héberge en ligne. **Git** : l'historique du projet, chaque état est un commit, une photo datée du code. **GitHub** : l'hébergement en ligne, sauvegarde, partage et collaboration. |
| 3 | 0:42 | Le filet de sécurité | **Sans Git** : modification, ça casse, parfois irréversible. **Avec Git** : modification, ça casse, retour à l'état d'avant. Presque rien n'est perdu définitivement. |
| 4 | 1:05 | Trois réflexes, à installer dès le départ | 1. Committer régulièrement : à chaque étape stable du projet, pas seulement à la fin. 2. Des messages clairs : ils expliquent le pourquoi du changement, pas juste « modif ». 3. Pousser vers GitHub : une sauvegarde hors de votre machine, vous validez avant de pousser. Reste affichée jusqu'à 2:18. |
| 5 | 2:18 | Installer Git | 1. Windows : l'installateur, options par défaut, `git-scm.com`. 2. Mac : macOS propose l'installation si Git est absent, `git --version`. 3. Linux (Debian, Ubuntu) : `sudo apt install git`. |
| 6 | 3:04 | Configurer Git | À faire une seule fois. 1. `git config --global user.name "Votre Nom"`. 2. `git config --global user.email "votre.email@exemple.com"`. |
| 7 | 3:30 | Mettre votre projet sur GitHub | 1. Créer un compte : gratuit, sur github.com. 2. Créer un dépôt : un dépôt vide, depuis le site. 3. Connecter votre projet : puis pousser le premier commit, Claude Code peut le faire pour vous. 4. S'authentifier avec un jeton d'accès personnel : Settings, Developer settings, Personal access tokens. |
| 8 | 6:05 | À retenir | Git protège votre projet, GitHub le sauvegarde. Git garde un historique réversible du projet. GitHub héberge et sécurise cet historique en ligne. Committez souvent, avec des messages clairs, et validez avant de pousser. **Prochaine vidéo** : Vercel et OVH, mettre en ligne en quelques minutes. |

Entre les diapositives 7 et 8 (de 4:37 à 6:05), la démonstration du premier commit se fait dans VS Code, sans diapositive.

## Fichier PowerPoint (2026-09-21)

- **Fichier** : `diapositives-chapitre-3.pptx`, dans ce dossier. Produit par l'outil commun `../../../../_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur).
- **Charte et animations** : identiques aux chapitres 1 et 2. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Titre | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les trois pastilles |
  | 2 Git et GitHub | Clic 1 : « Git ». Clic 2 : « GitHub » |
  | 3 Filet de sécurité | La ligne « Sans Git » visible. Clic 1 : « Avec Git ». Clic 2 : la phrase finale |
  | 4 Trois réflexes | Un clic par réflexe (3 clics) |
  | 5 Installer Git | Un clic par système (3 clics) |
  | 6 Configurer Git | Un clic par commande (2 clics) |
  | 7 GitHub | Un clic par étape (4 clics) |
  | 8 À retenir | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  70 effets au total, 20 clics.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les 70 effets, les clics et les transitions (comptage vérifié diapositive par diapositive). Les 8 diapositives ont été exportées en image et regardées. Sur la diapositive 7, les étapes sont regroupées dans des cadres, faute de quoi chaque détail semblait aussi proche de la ligne suivante que de la sienne. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À ne pas faire pendant l'enregistrement** : exécuter les commandes de la diapositive 6, ni créer de jeton à partir de la diapositive 7 (points 3 et 4 de la section « Points à valider » du script).
