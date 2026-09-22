# Diapositives : L'architecture fullstack n8n + Claude Code

6 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : une partie de la vidéo se passe à l'écran, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | L'architecture n8n + Claude Code | Vivier IA · module 1 · section 5 · chapitre 2. Objectif : répartir un projet entre produit et automatisations. Plan : 1. Deux briques complémentaires 2. La logique de répartition 3. Une démonstration réelle |
| 2 | 0:13 | Le produit et la plomberie | Chacune avec un rôle bien distinct. CLAUDE CODE : Le produit, Interface, logique métier, base de données. N8N : Les automatisations, Emails, notifications, synchronisations, IA en tâche de fond. |
| 3 | 0:30 | Deux questions à se poser | 1. Visible par l'utilisateur ? : Construit et maintenu dans le code. 2. Plomberie entre systèmes ? : Géré par n8n, visuel et modifiable. |
| 4 | 0:48 | Après la soumission | 1. Confirmation par email : Envoyé au prospect. 2. Notification : Vous ou votre équipe, par Slack. 3. Suivi CRM : Ligne ajoutée automatiquement. 4. Qualification par IA : Chaud, tiède ou froid, selon les réponses. |
| 5 | 2:07 | Pourquoi c'est adapté | Un client grand compte ajuste ses processus sans redéveloppement. Le workflow visuel s'ouvre et s'ajuste directement, sans toucher au code. |
| 6 | 2:21 | Le produit d'un côté, la plomberie de l'autre. | Le produit d'un côté, la plomberie de l'autre. Claude Code construit le produit, n8n orchestre les automatisations. Séparer les deux facilite la maintenance future. Adapté à des livraisons rapides, avec de l'évolutivité derrière. Prochaine vidéo : MCP Playwright, votre navigateur au service du dev. |

- De 1:07 à 2:07, la démonstration (clarification de la répartition Claude Code / n8n) se fait dans VS Code, sans diapositive.

## Fichier PowerPoint

- **Fichier** : `diapositives-chapitre-2.pptx`, dans ce dossier. Produit par l'outil commun `livrables/formations/ecosysteme-ia/_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur). On modifie le JSON puis on reconstruit, jamais le `.pptx`.
- **Charte et animations** : identiques aux autres chapitres. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 L'architecture n8n + Claude Code | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les pastilles |
  | 2 Le produit et la plomberie | Clic 1 : « CLAUDE CODE ». Clic 2 : « N8N » |
  | 3 Deux questions à se poser | Un clic par carte (2 clics) |
  | 4 Après la soumission | Un clic par carte (4 clics) |
  | 5 Pourquoi c'est adapté | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 6 Le produit d'un côté, la plomberie de l' | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  13 clics au total.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les effets, les clics et les transitions de chaque diapositive. Les alertes de mise en page ont été traitées, et la planche d'aperçu des 6 diapositives a été regardée. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** :
  - Que la liste d'automatisations proposée par Claude Code reste cohérente avec les exemples du script (email de confirmation, notification, CRM, qualification IA), même si le texte exact diffère.
