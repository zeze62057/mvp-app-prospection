# Diapositives : Hooks, automatiser Claude Code

6 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Hooks, automatiser Claude Code | Vivier IA · module 1 · section 3 · chapitre 5. Objectif : configurer un hook réel. Plan : 1. Une règle automatique 2. Des exemples concrets 3. Un hook testé en direct |
| 2 | 0:19 | Systématique, pas ponctuel | La différence tient à la régularité. UNE INSTRUCTION : Dépend du moment, S'applique si on pense à la redemander ce jour-là. UN HOOK : S'applique toujours, Se déclenche au même moment, à chaque fois, sans exception. |
| 3 | 0:44 | Trois besoins de fiabilité | 1. Avant un commit : Forcer une vérification systématique avant chaque commit Git. 2. Dossier sensible : Empêcher une action dans un dossier de clés d'API. 3. Tâche terminée : Déclencher une notification quand une tâche longue se termine. |
| 4 | 1:06 | Un fichier, une règle | 1. Le fichier, partagé ou personnel : `.claude/settings.json` 2. Le moment de déclenchement (exemple) : `PreToolUse` 3. Le chemin le plus fiable : Demander à Claude Code de configurer le hook, plutôt que l'écrire à la main. |
| 5 | 3:31 | Quand l'introduire | Pas besoin d'un hook dès le premier projet. Un mécanisme à réserver au jour où un besoin récurrent de fiabilité se fait sentir. |
| 6 | 3:52 | Une règle automatique, pas une instruction. | Une règle automatique, pas une instruction. Hook : une règle qui se déclenche à un moment précis, systématiquement. Indépendant de la vigilance du moment, contrairement à une instruction ponctuelle. Pertinent une fois un besoin de fiabilité identifié, pas dès le premier jour. Prochaine vidéo : structurer son projet, l'arborescence qui scale. |

- De 1:32 à 2:38, la démonstration (configuration du hook par Claude Code, puis test avec un faux .env) se fait dans VS Code et le terminal, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-5.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Hooks, automatiser Claude Code | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Systématique, pas ponctuel | Clic 1 : « UNE INSTRUCTION ». Clic 2 : « UN HOOK » |
  | 3 Trois besoins de fiabilité | Un clic par carte (3 clics) |
  | 4 Un fichier, une règle | Un clic par ligne (3 clics) |
  | 5 Quand l'introduire | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 6 Une règle automatique, pas une instructi | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  13 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 6 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que le `.env` de test ne contient qu'une valeur fictive, jamais un vrai identifiant ou une vraie clé.
  - Que `git init` a bien été fait avant la démonstration, ou le prévoir dans le minutage si filmé en direct.
