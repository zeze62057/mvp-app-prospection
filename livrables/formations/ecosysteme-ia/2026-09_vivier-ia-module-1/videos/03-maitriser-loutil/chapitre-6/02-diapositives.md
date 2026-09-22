# Diapositives : Structurer son projet, l'arborescence qui scale

5 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Structurer son projet, l'arborescence | Vivier IA · module 1 · section 3 · chapitre 6. Objectif : auditer et réorganiser pour de vrai. Plan : 1. L'impact concret 2. Ce qui manque sans elle 3. Un audit réel |
| 2 | 0:19 | Des responsabilités distinctes | 1. Le code : Ce qui fait fonctionner le produit. 2. Documentation : Ce qui explique, à part du code. 3. Configuration : Les réglages, séparés du reste. |
| 3 | 0:56 | Le désordre coûte cher, même à l'agent | Un projet mal structuré ralentit tout le monde. BONNE STRUCTURE : L'agent s'y retrouve, Chaque chose a sa place, prévisible. STRUCTURE QUI MANQUE : Le désordre grandit, Mauvais fichier modifié, logique dupliquée sans le savoir. |
| 4 | 3:15 | Le principe | Une arborescence qui scale. Compréhensible de 10 à 100 fichiers, posée dès le début, pas corrigée après coup. |
| 5 | 3:33 | Une place pour chaque chose, dès le début. | Une place pour chaque chose, dès le début. Séparer clairement code, documentation, configuration et livrables. Une mauvaise structure ralentit le travail même avec un agent compétent. Poser une structure dès le début, plutôt que corriger le désordre après coup. Prochaine vidéo : gérer les coûts intelligemment. |

- De 1:20 à 2:13, la démonstration (audit de l'arborescence, proposition, validation, réorganisation réelle) se fait dans VS Code et le navigateur, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-6.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Structurer son projet, l'arborescence | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Des responsabilités distinctes | Un clic par carte (3 clics) |
  | 3 Le désordre coûte cher, même à l'agent | Clic 1 : « BONNE STRUCTURE ». Clic 2 : « STRUCTURE QUI MANQUE » |
  | 4 Le principe | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 5 Une place pour chaque chose, dès le débu | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  10 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 5 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que le site de démonstration recharge sans erreur 404 après la réorganisation (chemins CSS notamment).
  - La structure exacte que Claude Code va proposer n'est pas garantie : avoir un plan B si elle diverge trop du script.
