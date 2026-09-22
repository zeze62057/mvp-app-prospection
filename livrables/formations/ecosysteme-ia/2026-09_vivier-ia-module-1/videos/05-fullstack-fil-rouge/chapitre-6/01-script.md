# Vidéo : Build Phase 3, page de statut et livraison finale

Module 1, section 5 « Le Fullstack, projet fil rouge », chapitre 6 sur 6, dernier de la section. Sources : `05-fullstack-fil-rouge.md`, chapitre 6, et `05-fullstack-fil-rouge-prompts.md`.
Format : écran filmé avec voix off. Adresse aux élèves : vouvoiement.

## 1. Cadrage

- **Objectif d'apprentissage** : à la fin, l'élève a fermé la boucle du projet fil rouge avec une page de statut, et a vérifié une checklist de livraison finale complète.
- **Signal de réussite** (signal de passage complet de la section 5, `00-guide-de-reussite.md`) : les 3 phases fonctionnent ensemble, testées réellement, sur un projet montrable à quelqu'un.
- **Prérequis de l'élève** : avoir suivi les chapitres 4 et 5 de cette section (dossier `/alpha-conseil` avec formulaire et dashboard).
- **Durée cible** : entre 7 et 10 minutes.
- **Exemple concret qui porte la vidéo** : la page de statut d'Alpha Conseil, dernière brique du projet fil rouge.

## 2. Points à valider avec Zézé avant d'enregistrer

1. **Aucune référence à Chatllow ou à Zézé dans ce chapitre** : rien à neutraliser.
2. **Démonstration réelle confirmée** : les 2 prompts de la fiche (page de statut, puis checklist de livraison finale) sont repris mot pour mot et joués en direct, dans l'ordre, sur le dossier `/alpha-conseil`.
3. **La mise en ligne réelle (Vercel ou OVH) n'est pas démontrée dans cette vidéo** : le cours mentionne la mise en ligne comme partie de la livraison finale, mais la checklist du chapitre 6 se contente de vérifier que le projet est "prêt à être déployé", sans le déployer réellement. Le déploiement a déjà été vu en section 1.

## 3. Script minuté

Rythme retenu : 140 mots par minute pour la voix off, plus le temps de manipulation à l'écran indiqué en secondes.

| Minute | Ce que vous dites | Ce qu'on voit à l'écran | Action à faire |
|---|---|---|---|
| 0:00 | Bonjour, et bienvenue dans ce sixième et dernier chapitre du projet fil rouge. Dernière brique : une page de statut, qui referme la boucle de tout ce qu'on a construit. | Diapositive 1 (titre, objectif et plan). Tout s'anime seul. | Aucune. Ton posé. |
| 0:13 | Cette page permet à une entreprise cliente de suivre où en est sa demande, sans avoir à demander directement au consultant. Les données saisies en phase 1, suivies en interne en phase 2, sont maintenant exposées de façon lisible à la personne extérieure concernée. | Diapositive 2 (une phrase, avec un appui). | Un clic pour l'appui. |
| 0:32 | Fermons la boucle. Je demande une page de statut publique, accessible par un lien unique par demande, qui affiche à l'entreprise cliente uniquement sa propre demande, sans donner accès aux autres. Lecture seule du fichier JSON existant. | VS Code en plein écran : le prompt collé, puis la page de statut construite et testée. | Coller le premier prompt de la fiche (page de statut). Vérifier qu'une autre demande n'est pas accessible depuis ce lien. ⏱ +50 s |
| 1:38 | Avant de livrer, une checklist en 4 points : les 3 phases fonctionnent ensemble, testées avec Playwright. Une documentation non technique existe. Aucune donnée sensible n'est exposée publiquement. Le projet est prêt à être déployé. | VS Code : le deuxième prompt collé, puis Claude Code qui confirme chaque point un par un. | Coller le deuxième prompt (checklist de livraison finale). Lire chaque point confirmé, partiel, ou manquant. ⏱ +40 s |
| 2:33 | La livraison finale n'est pas qu'une question de code qui fonctionne. Vérification complète avec Playwright, documentation claire, mise en ligne réelle, comme vu en section 1. C'est le moment où tous les chapitres du module convergent en un seul livrable. | Diapositive 3, un clic par carte (3 clics). | Un clic par carte. |
| 2:50 | Vous voilà au bout de la section 5. Les 3 phases fonctionnent ensemble, testées réellement, sur un projet que vous pourriez montrer à quelqu'un. C'est le signal de passage à la section suivante. | Diapositive 4 (récapitulatif du signal de passage complet de la section 5). | Aucune. |
| 3:04 | Retenons l'essentiel. La page de statut ferme la boucle. La livraison finale combine vérification, documentation, mise en ligne. C'est la synthèse pratique de tout ce module. Prochaine section : le business, préparer une livraison client. À tout de suite. | Diapositive 5 : récapitulatif et prochaine section. Le titre apparaît seul, puis un clic par point. | Un clic par point, puis un clic pour l'annonce. |

## 4. Durée estimée

**258 mots prononcés**, soit environ 1,8 minutes de voix, plus 90 secondes de manipulation à l'écran. **Durée estimée : 3:21**, avant coupes au montage.

Le rythme de 140 mots par minute est une hypothèse. Après le premier enregistrement, corrigez-le avec votre débit réel. Les temps de démonstration (50 s, 40 s) sont des estimations.

## 5. Relecture de fidélité

Chaque affirmation du script a été comparée au chapitre source et à la fiche : le rôle de la dernière brique, comment elle referme la boucle, ce que veut dire livraison finale, le signal de passage complet de la section 5 repris mot pour mot de `00-guide-de-reussite.md`, les 2 prompts de démonstration. Aucun écart : ce chapitre ne cite ni Zézé ni Chatllow, rien à neutraliser. Précision au point 3 : la mise en ligne réelle n'est pas rejouée, seule sa vérification l'est.
