# Diapositives : De Lovable à Claude Code

6 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | De Lovable à Claude Code | Vivier IA · module 1 · section 5 · chapitre 1. Objectif : savoir quand passer du prototype à la production. Plan : 1. Le projet fil rouge 2. La limite du prototype 3. Le relais de Claude Code |
| 2 | 0:16 | Un point de départ courant | Lovable : prototyper une idée en quelques heures. Tester un concept, montrer une maquette, valider avant d'investir plus de temps. |
| 3 | 0:34 | Démonstration ou production | Deux objectifs différents, deux outils différents. PROTOTYPAGE : Vitesse de démo, Données factices, sécurité esthétique. PRODUCTION : Robustesse durable, Données réelles, sécurité réelle, évolutivité. |
| 4 | 0:51 | Ce qu'on garde, ce qu'on reconstruit | 1. On garde : L'idée validée, la référence visuelle. 2. On reconstruit : Une base solide, extensible. 3. On évite : Les limites structurelles d'un outil de démo. |
| 5 | 2:18 | Après la démonstration | Ce n'est pas une copie visuelle, c'est une base pensée pour évoluer. Ce dossier /alpha-conseil vous suivra sur toute la section 5. |
| 6 | 2:36 | Prototyper vite, produire solide. | Prototyper vite, produire solide. Lovable et équivalents : excellents pour prototyper, pas pour produire. Claude Code prend le relais pour la production réelle. Ne pas confondre validation d'idée et livraison finale. Prochaine vidéo : l'architecture Claude Code + n8n. |

- De 1:09 à 2:18, la démonstration (reconstruction du prototype, ouverture dans le navigateur) se fait dans VS Code et le navigateur, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-1.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 De Lovable à Claude Code | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Un point de départ courant | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 3 Démonstration ou production | Clic 1 : « PROTOTYPAGE ». Clic 2 : « PRODUCTION » |
  | 4 Ce qu'on garde, ce qu'on reconstruit | Un clic par carte (3 clics) |
  | 5 Après la démonstration | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 6 Prototyper vite, produire solide. | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  11 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 6 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que le formulaire généré contient bien les 4 champs du prompt (nom, entreprise, besoin, budget estimé) et un bouton d'envoi avec message de confirmation.
  - Qu'aucun framework n'a été ajouté sans le demander.
