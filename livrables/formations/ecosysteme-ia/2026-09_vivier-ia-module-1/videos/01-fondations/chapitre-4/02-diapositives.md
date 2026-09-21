# Diapositives : Vercel et OVH, mettre en ligne en quelques minutes

7 diapositives. Elles servent d'ouverture, de repères et de récapitulatif : le déploiement se montre à l'écran, dans le tableau de bord de Vercel, sans diapositive. Les numéros suivent le script (`01-script.md`).

## Plan

| N° | Apparaît à | Titre | Texte exact sur la diapositive |
|---|---|---|---|
| 1 | 0:00 | Vercel et OVH, mettre en ligne en quelques minutes | **Module 1, Section 1, Chapitre 4.** Objectif : choisir votre hébergeur, puis déployer une page sur Vercel. Plan : 1. Vercel et OVH. 2. Le choix. 3. Le déploiement. |
| 2 | 0:18 | Pourquoi mettre en ligne | Un projet n'est livré que lorsqu'il est en ligne. Pas seulement quand le code fonctionne en local, sur votre machine. |
| 3 | 0:40 | Vercel et OVH, qui fait quoi ? | Le choix dépend du projet. **Vercel** : rapidité et simplicité, sites et applications web modernes, déploiement automatique. **OVH** : contrôle et infrastructure, serveur dédié, base de données auto-hébergée, contraintes spécifiques. |
| 4 | 1:24 | L'exemple concret | **Site vitrine** : site statique, push GitHub, Vercel. **Backend n8n** : Docker et workers, contrôle serveur, OVH. Le choix dépend du projet. |
| 5 | 2:07 | Déployer sur Vercel | 1. Créer un compte gratuit : sur vercel.com, idéalement avec votre compte GitHub. 2. Ajouter un projet : tableau de bord, « Add New Project », puis le dépôt GitHub. 3. Valider la configuration : Vercel détecte votre projet et propose une configuration par défaut. 4. Chaque git push redéploie le site : sur la branche principale, sans action manuelle supplémentaire. |
| 6 | 5:05 | Créer un compte OVH | 1. Créer un compte : sur ovh.com. 2. Choisir l'offre adaptée au besoin réel : hébergement web mutualisé pour un site simple, VPS pour un backend comme n8n. |
| 7 | 5:50 | À retenir | Vercel pour aller vite, OVH pour garder le contrôle. Vercel : rapide, automatisé, adapté aux projets web standards. OVH : plus de contrôle, adapté aux besoins d'infrastructure spécifiques. Un projet n'est livré que lorsqu'il est accessible en ligne. **Prochaine vidéo** : Agentic Coding vs Vibe Coding, la vraie différence. |

Entre les diapositives 5 et 6 (de 3:05 à 5:05), la démonstration du déploiement se fait dans le tableau de bord de Vercel, sans diapositive.

## Fichier PowerPoint (2026-09-21)

- **Fichier** : `diapositives-chapitre-4.pptx`, dans ce dossier. Produit par l'outil commun `../../../../_outils-video/` à partir de `diapositives.json` (texte des diapositives et notes de l'orateur).
- **Charte et animations** : identiques aux chapitres précédents. Détail dans le `README.md` de l'outil.
- **Animations** :

  | Diapositive | Déclenchement |
  |---|---|
  | 1 Titre | Tout seul à l'ouverture : logo, surtitre, titre, objectif, puis les trois pastilles |
  | 2 Pourquoi | La phrase seule à l'ouverture, puis un clic pour le texte d'appui |
  | 3 Vercel et OVH | Clic 1 : « Vercel ». Clic 2 : « OVH » |
  | 4 Exemple concret | La ligne « Site vitrine » visible. Clic 1 : « Backend n8n ». Clic 2 : la phrase finale |
  | 5 Déployer sur Vercel | Un clic par étape (4 clics) |
  | 6 Compte OVH | Un clic par étape (2 clics) |
  | 7 À retenir | Le titre seul à l'ouverture, puis un clic par point et un clic pour la prochaine vidéo (4 clics) |

  53 effets au total, 15 clics.
- **Contrôle** : le fichier a été ouvert avec PowerPoint, qui a bien lu les 53 effets, les clics et les transitions (comptage vérifié diapositive par diapositive). Les 7 diapositives ont été exportées en image et regardées. **Le déroulé animé n'a pas été joué en mode diaporama** : à tester avant l'enregistrement.
- **À vérifier le jour de l'enregistrement** : le libellé « Add New Project » de la diapositive 5 (point 4 de la section « Points à valider » du script). Si l'interface de Vercel a changé, corrigez `diapositives.json` et reconstruisez.
