# Diapositives : Skills et Slash Commands, vos raccourcis personnalisés

6 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Skills et Slash Commands, vos raccourcis | Vivier IA · module 1 · section 3 · chapitre 3. Objectif : choisir et créer le bon raccourci. Plan : 1. Deux mécanismes 2. Comment choisir 3. Les créer |
| 2 | 0:19 | Ils ne répondent pas au même besoin | Les confondre, c'est choisir le mauvais outil. SLASH COMMAND : Un raccourci d'action, Une séquence fixe, toujours dans le même ordre. SKILL : Un savoir-faire, Une méthode complète, avec du jugement. |
| 3 | 1:25 | L'exemple : le site d'un artisan | SLASH COMMAND : /nouveau-client, Même séquence, Prévisible SKILL : audit-site-vitrine, Méthode adaptée, Jugement |
| 4 | 1:51 | Une commande ou un Skill ? | Selon que la tâche change ou non. TÂCHE TOUJOURS IDENTIQUE : Une commande, Elle automatise un geste précis et répétitif. TÂCHE À ADAPTER : Un Skill, Il adapte une méthode à chaque situation. |
| 5 | 2:13 | Deux fichiers, un dossier | 1. Un Slash Command : un fichier Markdown : `.claude/commands/nom.md` 2. Un Skill : un dossier avec un fichier SKILL.md : `.claude/skills/nom/SKILL.md` 3. En-tête du SKILL.md : au minimum : Un name et une description claire, qui sert au déclenchement automatique. |
| 6 | 6:56 | Une commande pour répéter, un Skill pour adapter. | Une commande pour répéter, un Skill pour adapter. Slash Command : une séquence précise, toujours identique. Skill : un savoir-faire, avec du jugement contextuel. Les deux évitent de répéter les mêmes explications. Prochaine vidéo : MCP, connecter Claude Code à votre écosystème. |

- De 2:53 à 6:56, la démonstration (création puis lancement du Slash Command, création du Skill) se fait dans VS Code, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-3.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Skills et Slash Commands, vos raccourcis | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Ils ne répondent pas au même besoin | Clic 1 : « SLASH COMMAND ». Clic 2 : « SKILL » |
  | 3 L'exemple : le site d'un artisan | La ligne « SLASH COMMAND » visible. Clic 1 : « SKILL » |
  | 4 Une commande ou un Skill ? | Clic 1 : « TÂCHE TOUJOURS IDENTIQUE ». Clic 2 : « TÂCHE À ADAPTER » |
  | 5 Deux fichiers, un dossier | Un clic par ligne (3 clics) |
  | 6 Une commande pour répéter, un Skill pour | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  12 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 6 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que les deux prompts collés sont bien ceux du chapitre 3 de la fiche pratique, sans modification.
  - Les chemins créés : `.claude/commands/nouveau-client.md` et `.claude/skills/audit-site-vitrine/SKILL.md`.
