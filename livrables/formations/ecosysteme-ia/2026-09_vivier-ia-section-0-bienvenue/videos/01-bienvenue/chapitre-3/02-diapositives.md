# Diapositives : Installer votre assistant personnel

5 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Installer votre assistant personnel | Vivier IA · bienvenue · chapitre 3. Objectif : un assistant réel, en une fois. Plan : 1. Comment ça fonctionne 2. Une installation réelle 3. Prêt pour le Module 1 |
| 2 | 0:17 | Pourquoi commencer par ça | Un espace qui vous connaît, sans tout réexpliquer. Utile pour suivre cette formation, et bien au-delà si vous le souhaitez. |
| 3 | 0:38 | Vous n'écrivez rien à la main | 1. Qui vous êtes : Comment vous voulez qu'on vous parle. 2. Votre contexte : Votre situation, vos objectifs. 3. Votre historique : Ce qui a été fait et décidé. |
| 4 | 3:41 | Si vos réponses sont imparfaites | Ce n'est pas grave, rien n'est figé. Ça se corrige et s'enrichit au fil de la formation, comme des notes personnelles. |
| 5 | 3:59 | Vous êtes prêt pour le Module 1. | Vous êtes prêt pour le Module 1. Trois fichiers suffisent : qui vous êtes, votre contexte, votre historique. Une interview guidée les remplit pour vous. Ce n'est pas figé : ça s'enrichit au fil de la formation. Prochaine vidéo : Module 1, la fondation de tout le programme. |

- De 1:00 à 3:05, la démonstration (interview, récapitulatif, création des 3 fichiers, puis rechargement) se fait dans VS Code, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-3.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Installer votre assistant personnel | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Pourquoi commencer par ça | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 3 Vous n'écrivez rien à la main | Un clic par carte (3 clics) |
  | 4 Si vos réponses sont imparfaites | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 5 Vous êtes prêt pour le Module 1. | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  9 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 5 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que les 3 fichiers créés contiennent bien les informations fictives données à Claude Code, pas des inventions.
  - Que le résumé du second prompt correspond fidèlement à ce qui a été écrit dans les fichiers.
