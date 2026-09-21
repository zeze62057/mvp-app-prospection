# Diapositives : Quand ça casse, debugger et vérifier

6 diapositives. Elles servent d'ouverture, de repères et de récapitulatif. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Quand ça casse, debugger et vérifier | Vivier IA · module 1 · section 2 · chapitre 4. Objectif : réagir efficacement face à une erreur. Plan : 1. Trois réflexes 2. Un exemple 3. Tester tôt |
| 2 | 0:19 | Le réflexe à avoir, pas la peur à éviter | Une erreur n'est pas un échec de la méthode. C'est une étape normale : on apprend à y réagir. |
| 3 | 0:41 | Trois étapes, dans cet ordre | 1. Lire le message : En entier : pas seulement la première ligne, ni un résumé. 2. Isoler le problème : Partout, ou seulement dans un cas précis ? Cela évite de chercher au mauvais endroit. 3. Diagnostiquer avant de corriger : Comprendre la cause, pour ne pas masquer le symptôme. |
| 4 | 1:47 | Un formulaire qui refuse les bons e-mails | 1. Donner le message d'erreur complet : Celui de la console, pas seulement « ça marche pas ». 2. Isoler : Tous les e-mails, ou certains formats, par exemple avec un « + » ? 3. Diagnostiquer avant de corriger : La règle de validation, avant de la corriger à l'aveugle. |
| 5 | 2:28 | Tester tôt coûte moins cher que tard | À chaque étape du workflow Plan, Execute, Validate. PENDANT LA CONSTRUCTION : Bug corrigé tôt, Peu coûteux. Les décisions structurelles restent modifiables. UNE FOIS EN PRODUCTION : Le projet casse, Beaucoup plus cher, surtout en confiance. |
| 6 | 3:00 | Message complet, problème isolé, cause diagnostiquée. | Message complet, problème isolé, cause diagnostiquée. Toujours le message d'erreur complet, jamais un résumé. Isoler avant de corriger : partout, ou cas précis ? Diagnostiquer la cause réelle, pas seulement le symptôme. Prochaine vidéo : premiers pas, outils principaux et permissions. |

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-4.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Quand ça casse, debugger et vérifier | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Le réflexe à avoir, pas la peur à éviter | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 3 Trois étapes, dans cet ordre | Un clic par carte (3 clics) |
  | 4 Un formulaire qui refuse les bons e-mail | Un clic par ligne (3 clics) |
  | 5 Tester tôt coûte moins cher que tard | Clic 1 : « PENDANT LA CONSTRUCTION ». Clic 2 : « UNE FOIS EN PRODUCTION » |
  | 6 Message complet, problème isolé, cause d | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  13 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 6 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
