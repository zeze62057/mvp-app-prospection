# Diapositives : Build Phase 2, dashboard de suivi

4 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Build Phase 2, dashboard de suivi | Vivier IA · module 1 · section 5 · chapitre 5. Objectif : un dashboard qui tient à plus grande échelle. Plan : 1. Des enjeux différents 2. La notion de scale 3. Testé à 50 entrées |
| 2 | 0:12 | Trois défis de cette phase | 1. Organiser : Filtres, recherche, tri pertinent. 2. Représenter : Un état qui évolue, avec historique. 3. Penser l'usage : Quotidien et répété, pas ponctuel. |
| 3 | 0:28 | 10 lignes ou 200 | Deux conceptions différentes, pas juste plus de données. PENSÉ POUR 10 LIGNES : Fonctionne pour la démo, Montre ses limites quand le volume grandit. PENSÉ POUR 200 : Anticipé dès la construction, Évite une refonte coûteuse plus tard. |
| 4 | 2:55 | Testé à l'échelle, pas juste à la démo. | Testé à l'échelle, pas juste à la démo. Visualiser et suivre les données dans le temps. Filtres, recherche, tri, nécessaires dès que le volume grandit. Anticiper la croissance évite une refonte coûteuse. Prochaine vidéo : Phase 3, la page de statut et la livraison finale. |

- De 0:44 à 1:53, la démonstration (cadrage du dashboard, puis test à 50 entrées) se fait dans VS Code, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-5.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Build Phase 2, dashboard de suivi | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Trois défis de cette phase | Un clic par carte (3 clics) |
  | 3 10 lignes ou 200 | Clic 1 : « PENSÉ POUR 10 LIGNES ». Clic 2 : « PENSÉ POUR 200 » |
  | 4 Testé à l'échelle, pas juste à la démo. | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  9 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 4 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que le dashboard affiche bien la recherche par entreprise, le filtre par budget, et le statut modifiable.
  - Que la recherche et les filtres fonctionnent réellement avec 50 entrées, pas seulement avec les entrées de départ.
