# Diapositives : L'art de donner des instructions à Claude Code

7 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | L'art de donner des instructions à Claude Code | Vivier IA · module 1 · section 2 · chapitre 2. Objectif : écrire des instructions que l'agent peut réussir. Plan : 1. Les 4 éléments 2. Un exemple en direct 3. Le bon réflexe |
| 2 | 0:20 | Pourquoi ce chapitre compte | La qualité du résultat dépend d'abord de l'instruction. Plus que la puissance du modèle, plus que le temps passé. |
| 3 | 0:43 | Quatre éléments, non négociables | 1. Le contexte : Dans quel projet, pour qui, avec quelles contraintes existantes. 2. L'objectif : Précis : ce qui doit être vrai à la fin de la tâche. 3. Le périmètre : Ce qui est concerné, et surtout ce qu'il ne faut pas toucher. 4. L'autonomie : Le niveau souhaité : demander avant d'agir, ou avancer seul ? |
| 4 | 1:39 | Deux façons de demander la même chose | Ajouter un formulaire de contact sur le site vitrine. INSTRUCTION FLOUE : Une seule phrase, « Ajoute un formulaire de contact sur le site. » INSTRUCTION COMPLÈTE : Les quatre éléments, Contexte, objectif, périmètre, autonomie. |
| 5 | 6:07 | L'erreur classique | Le problème vient de l'instruction, pas de l'agent. « Rends ça plus beau », « corrige le bug » : l'agent doit deviner. |
| 6 | 6:35 | Le réflexe à adopter | Écrivez comme pour un collègue compétent qui découvre le projet aujourd'hui. Il n'a pas le contexte dans la tête : donnez-le lui explicitement. |
| 7 | 6:57 | Quatre éléments, une instruction complète. | Quatre éléments, une instruction complète. Contexte, objectif précis, périmètre, autonomie : non négociables. Instruction floue, résultat approximatif : pas la faute de l'IA. Écrire comme pour un collègue qui découvre le projet. Prochaine vidéo : le workflow Plan, Execute, Validate. |

- De 2:15 à 6:07, la démonstration se fait dans VS Code, sans diapositive : d'abord l'instruction floue sur la copie A du site, puis l'instruction complète sur la copie B.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-2.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 L'art de donner des instructions à Claud | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Pourquoi ce chapitre compte | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 3 Quatre éléments, non négociables | Un clic par carte (4 clics) |
  | 4 Deux façons de demander la même chose | Clic 1 : « INSTRUCTION FLOUE ». Clic 2 : « INSTRUCTION COMPLÈTE » |
  | 5 L'erreur classique | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 6 Le réflexe à adopter | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 7 Quatre éléments, une instruction complèt | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  13 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 7 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que les deux prompts collés sont bien ceux de l'« Exemple 1 » de la fiche, sans modification.
