# Diapositives : Build Phase 1, formulaire d'intake client

4 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Build Phase 1, formulaire d'intake client | Vivier IA · module 1 · section 5 · chapitre 4. Objectif : construire et tester la première brique. Plan : 1. Ce que ça enseigne 2. Pourquoi en premier 3. Plan, Execute, Validate |
| 2 | 0:14 | Trois choses en pratique | 1. Cadrer : Les champs nécessaires, ni plus ni moins. 2. Valider : Un email ressemble à un email. 3. Connecter : Où vont les données, et ensuite. |
| 3 | 0:31 | Pourquoi cette brique en premier | Autonome, concrète, représentative du module. Testable seule, résultat visible immédiatement, cadrage et validation comme partout ailleurs. |
| 4 | 3:29 | Une phase testée, pas seulement codée. | Une phase testée, pas seulement codée. Premier point de contact structuré avec l'extérieur. Cadrer, valider, connecter : les trois réflexes de cette phase. Construite et testée avec Plan, Execute, Validate. Prochaine vidéo : Phase 2, le dashboard de suivi. |

- De 0:47 à 2:34, la démonstration (Plan, Execute, Validate) se fait dans VS Code, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-4.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Build Phase 1, formulaire d'intake clien | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Trois choses en pratique | Un clic par carte (3 clics) |
  | 3 Pourquoi cette brique en premier | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 4 Une phase testée, pas seulement codée. | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  8 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 4 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que le plan proposé par Claude Code couvre bien les 4 champs et le stockage JSON local.
  - Que le test Playwright confirme réellement une nouvelle entrée dans le fichier JSON, pas une simple affirmation.
