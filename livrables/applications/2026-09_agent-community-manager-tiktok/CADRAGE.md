# Cadrage : agent community manager TikTok pour la formation écosystème IA

Cadrage du 2026-09-21. Étape 1 de `livrables/transverse/methode-approche-projet.md` (type : automatisation avec un agent). **Rien n'est construit à ce stade.**

> **État : EN PAUSE depuis le 2026-09-21.** Zézé a demandé de mettre le projet de côté pour travailler d'abord sur la plateforme, et d'y revenir ensuite. **Pour reprendre** : relire les sections 3 et 4 (contraintes TikTok), poser à Zézé les trois questions restées sans réponse (type et nom du compte TikTok ; budget mensuel pour la génération vidéo IA ; page exacte du lien en biographie), puis lancer l'essai de 3 vidéos décrit dans la section 8. Aucune donnée ni aucun accès n'a été demandé ou créé.

## 1. Le besoin

Un agent qui tient le rôle de community manager de la formation écosystème IA (Vivier IA) sur TikTok : il publie des vidéos pour faire connaître la formation et attirer des élèves.

## 2. Ce que Zézé a décidé (2026-09-21)

| Sujet | Choix |
|---|---|
| Rôle de l'agent | **Publier les vidéos** |
| « Prospecter » | **Attirer par le contenu** (vidéos, lien en bio, page d'inscription), pas de messages privés ni de follows automatiques |
| Origine des vidéos | **Générées par IA** |
| Autonomie | ~~Publication automatique, revue hebdomadaire~~, **remplacé le 2026-09-21 par : validation de Zézé avant chaque publication** (TikTok interdit la publication automatique, voir la section 4) |
| Compte TikTok | **Existe déjà** (type et nom à préciser) |
| Lien en biographie | **Vers la page** d'inscription de la plateforme Vivier Academies (à confirmer : vitrine ou page d'inscription précise) |

## 3. Ce que la documentation TikTok impose (vérifié le 2026-09-21)

1. **Un client d'API non audité ne publie qu'en privé.** « All content posted by unaudited clients will be restricted to private viewing mode. » Pour publier en public, l'application doit passer un audit ([documentation officielle](https://developers.tiktok.com/doc/content-posting-api-get-started)). Sources secondaires : l'audit prend 2 à 4 semaines, avec plusieurs allers-retours, et un client non audité ne peut servir qu'à 5 utilisateurs par 24 heures ([PostPeer](https://www.postpeer.dev/blog/best-tiktok-posting-api), [Mixpost](https://docs.mixpost.app/services/social/tik-tok/direct-post-audit/)).
2. **La publication automatique sans confirmation manuelle est interdite.** Les règles de partage exigent que l'utilisateur consente explicitement à l'envoi, voie un aperçu, et choisisse lui-même la confidentialité et les réglages d'interaction pour chaque publication ([Content Sharing Guidelines](https://developers.tiktok.com/docs/en/content-sharing-guidelines)). L'application doit aussi afficher le pseudo du compte cible avant la publication.
3. **Pas de promotion dans la vidéo elle-même** : les règles interdisent d'ajouter un logo, un filigrane, un lien ou un texte promotionnel au contenu posté par l'application. Le lien d'inscription passe par la biographie du compte.
4. **Pas d'API officielle pour les messages privés** : ni envoi ni réception. Les outils qui automatisent les messages ou les follows passent par des méthodes non officielles, contraires aux conditions de TikTok, avec un risque de bannissement du compte ([source](https://www.linkdm.com/blog/is-dm-automation-available-on-tiktok)). Zézé a écarté cette voie.
5. **Non vérifié** : les règles de TikTok sur l'étiquetage des contenus générés par IA. Les pages consultées n'en parlent pas. À vérifier dans les règles de la communauté avant la première publication.

## 4. Le point qui bloque le choix « publication auto, revue hebdo »

Les points 1 et 2 sont incompatibles avec ce mode : une application ne peut pas publier seule en public, et l'audit que TikTok exige vérifie justement ce consentement à chaque publication. **Une revue hebdomadaire après coup ne suffit pas** : il faut une validation avant chaque publication.

Ce que l'agent peut faire malgré tout, de façon légitime :
- préparer chaque semaine un lot complet : script, vidéo générée, légende, hashtags, jour de publication ;
- ranger le tout dans une file d'attente (une base Notion « Posts TikTok », sur le modèle de l'agent LinkedIn) avec des statuts : proposé, validé, programmé, publié ;
- envoyer la vidéo validée vers TikTok ou vers un outil de programmation déjà audité, **pour que Zézé confirme en un geste** ;
- préparer les statistiques de la semaine pour la revue hebdomadaire.

Deux façons de réduire l'effort de Zézé à presque rien, à vérifier avant de choisir :
- **Outil de programmation tiers déjà audité par TikTok** (type Buffer ou équivalent) : l'agent y dépose les contenus, Zézé approuve le lot une fois par semaine. À vérifier : que l'outil choisi supporte bien TikTok, son prix, et s'il exige lui-même une confirmation par publication.
- **Application TikTok à soi, auditée** : possible, mais 2 à 4 semaines de démarches, avec la contrainte du point 2. Non recommandé au démarrage.

## 5. Architecture proposée (à valider)

1. **L'agent** (fiche dans `livrables/agents/`, fichier actif dans `.claude/agents/`), sur le modèle de `agent-linkedin`. Il écrit les scripts **uniquement à partir du contenu validé de la formation** : aucune promesse de résultat ni de revenu, aucune affirmation qui ne soit pas dans le cours.
2. **La génération vidéo par IA** : outil à choisir (voix, images ou avatar), avec un budget. Chaque vidéo est regardée avant d'entrer dans la file.
3. **La file d'attente Notion** : « Posts TikTok », avec les statuts ci-dessus.
4. **La publication** : validation humaine avant chaque publication (point 4 ci-dessus).
5. **Le tunnel** : lien en biographie vers la page d'inscription ou la liste d'attente de Vivier Academies.
6. **Le suivi** : un point hebdomadaire sur les vues, les commentaires et les inscriptions.

## 6. Garde-fous

- Aucune publication sans validation humaine préalable.
- Liste de sujets interdits et de promesses interdites (revenus, résultats garantis), à écrire avec Zézé.
- Plafond de publications par semaine.
- Un interrupteur : Zézé peut arrêter l'agent à tout moment, sans perte de contenu.
- Le compte TikTok et les accès (jetons, clés) restent chez Zézé. Aucun secret dans le chat : lecture depuis les fichiers locaux, comme pour les autres projets.

## 7. Points à valider avec Zézé (rien n'est tranché)

1. ~~Le mode de publication~~ **Tranché : validation avant chaque publication.** Reste à choisir : avec ou sans outil de programmation tiers audité.
2. **Le compte TikTok** : il existe. Reste à préciser : personnel ou Business, et son nom.
3. **L'outil de génération vidéo IA et le budget mensuel** (non tranchés). Le rendu, la langue française et l'authenticité sont des points à tester sur 2 ou 3 essais avant tout engagement.
4. ~~La cible du lien en biographie~~ **Tranché : la page de la plateforme.** Reste à confirmer laquelle exactement (vitrine ou page d'inscription).
5. **Le rythme** : combien de vidéos par semaine ? Quels thèmes ? Quel ton ?
6. **L'état de la formation** : elle est encore en construction, aucune vidéo de cours n'est enregistrée. Ce qu'on annonce doit rester exact (formation « en préparation » ou « ouverte » selon la date).
7. **L'étiquetage IA** : vérifier les règles de TikTok avant la première publication (point 5 de la section 3).

## 8. Suite prévue (étapes de la méthode, une à la fois)

1. Zézé tranche les points de la section 7.
2. Nom et identité du compte, si nécessaire (étape 2), et charte visuelle des vidéos.
3. Schéma du flux (étape 3, pas de maquette) : de l'idée à la publication validée.
4. `CLAUDE.md` du projet et fiche de l'agent (étape 4).
5. Construction tâche par tâche (étape 5), en commençant par **l'essai d'un lot de 3 vidéos IA** pour juger le rendu. Toute manipulation sur les comptes de Zézé (compte TikTok, outil tiers, Notion) se fait en direct avec lui, étape par étape.
6. Validation réelle (étape 6) : une publication de test en privé avant toute publication publique.
