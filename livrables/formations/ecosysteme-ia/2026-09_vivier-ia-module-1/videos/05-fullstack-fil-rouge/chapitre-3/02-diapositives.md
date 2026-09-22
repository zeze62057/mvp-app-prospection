# Diapositives : MCP Playwright, votre navigateur au service du dev

6 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | MCP Playwright, votre navigateur au service du dev | Vivier IA · module 1 · section 5 · chapitre 3. Objectif : tester réellement, pas seulement relire le code. Plan : 1. Ce que fait Playwright 2. Un changement pour Validate 3. Une démonstration réelle |
| 2 | 0:12 | Ce que fait playwright | Piloter un navigateur, comme un utilisateur humain. Ouvrir une page, cliquer, remplir un formulaire, vérifier ce qui s'affiche réellement. |
| 3 | 0:30 | Pour la phase Validate | Deux façons très différentes d'affirmer que ça marche. SANS PLAYWRIGHT : Une supposition, « Le code semble correct en le relisant ». AVEC PLAYWRIGHT : Une observation, « J'ai vérifié en ouvrant réellement la page ». |
| 4 | 1:52 | Après la démonstration | Ce qui a été observé à l'écran, pas « le code a l'air correct ». Playwright valide chaque phase de build : le formulaire, le dashboard, la page de statut. |
| 5 | 2:12 | Au-delà de ce seul projet | 1. Transférable : À tout projet avec une interface. 2. La majorité des livraisons : D'un cabinet de conseil. |
| 6 | 2:26 | Tester réellement, pas supposer. | Tester réellement, pas supposer. Playwright pilote un vrai navigateur. Connecté via MCP, Claude Code teste, sans supposer. Réduit le risque de découvrir un problème trop tard. Prochaine vidéo : Phase 1, le formulaire d'intake client. |

- De 0:49 à 1:52, la démonstration (Playwright ouvre le formulaire, remplit les champs, vérifie la confirmation) se fait dans VS Code et le navigateur, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-3.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 MCP Playwright, votre navigateur au serv | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Ce que fait playwright | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 3 Pour la phase Validate | Clic 1 : « SANS PLAYWRIGHT ». Clic 2 : « AVEC PLAYWRIGHT » |
  | 4 Après la démonstration | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 5 Au-delà de ce seul projet | Un clic par carte (2 clics) |
  | 6 Tester réellement, pas supposer. | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  10 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 6 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que Claude Code rapporte bien ce qu'il a observé à l'écran (pas une supposition), avec le détail des 4 champs remplis et la confirmation affichée.
