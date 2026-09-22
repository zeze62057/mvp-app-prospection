# Diapositives : MCP, connecter Claude Code à votre écosystème

6 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | MCP, connecter Claude Code à votre écosystème | Vivier IA · module 1 · section 3 · chapitre 4. Objectif : connecter un serveur MCP réel. Plan : 1. Ce que ça résout 2. Comment le déclarer 3. Une connexion réelle |
| 2 | 0:19 | Le travail réel dépasse le projet local | Une grande partie se passe ailleurs. SANS MCP : Seulement le local, Les fichiers du projet, rien d'autre. AVEC MCP : Des outils connectés, L'agent lit et écrit directement dedans, avec votre autorisation. |
| 3 | 1:00 | Deux agents, zéro copier-coller | Chaque étape se fait directement dans l'outil. RÉDIGER ET ENREGISTRER : Un agent de contenu, Écrit puis enregistre directement dans une base partagée. GÉNÉRER ET ATTACHER : Un second agent, Génère un visuel et l'attache automatiquement au bon endroit. |
| 4 | 1:18 | Un fichier, une autorisation | 1. Le fichier à créer, à la racine du projet : `.mcp.json` 2. Le serveur de cet exemple (Playwright) : `npx @playwright/mcp@latest` 3. Sur Windows, sans Node.js déjà en place : npx doit être accessible dans le PATH, sinon la connexion échoue par timeout. |
| 5 | 3:23 | Plus de connexions, plus de rigueur | 1. Ne pas inventer : Aucune propriété qui n'existe pas déjà dans l'outil connecté. 2. Rien d'implicite : Aucune modification qui n'a pas été explicitement demandée. 3. Toujours vérifier : Confirmer qu'une action a réellement réussi, jamais le supposer. |
| 6 | 3:41 | Des outils extérieurs, sous votre autorisation. | Des outils extérieurs, sous votre autorisation. MCP connecte Claude Code à des services externes au projet local. L'agent agit directement dedans, avec votre autorisation préalable. Plus de connexions veut dire plus de vigilance sur le périmètre. Prochaine vidéo : les Hooks, pour automatiser Claude Code. |

- De 1:39 à 2:36, la démonstration (création de .mcp.json, relance de Claude Code, autorisation, puis ouverture du site dans le navigateur) se fait dans VS Code, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-4.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 MCP, connecter Claude Code à votre écosy | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Le travail réel dépasse le projet local | Clic 1 : « SANS MCP ». Clic 2 : « AVEC MCP » |
  | 3 Deux agents, zéro copier-coller | Clic 1 : « RÉDIGER ET ENREGISTRER ». Clic 2 : « GÉNÉRER ET ATTACHER » |
  | 4 Un fichier, une autorisation | Un clic par ligne (3 clics) |
  | 5 Plus de connexions, plus de rigueur | Un clic par carte (3 clics) |
  | 6 Des outils extérieurs, sous votre autori | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  14 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 6 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que `npx` est bien accessible dans le PATH sur la machine d'enregistrement, testé avant de filmer pour éviter un aléa en direct.
  - Le temps du premier téléchargement du serveur Playwright (variable selon la connexion), à mesurer lors du test à blanc.
