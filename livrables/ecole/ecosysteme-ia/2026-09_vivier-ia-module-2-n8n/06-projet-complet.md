# Section 6 — ✅ Projet complet

> Cette section applique tout ce qui précède sur un projet n8n mené du début à la fin, sur le même principe que le projet fil rouge du Module 1. Fiche pratique associée : [06-projet-complet-prompts.md](06-projet-complet-prompts.md).

## Chapitre 1 : Choix du process & objectifs (brief)

### Choisir le bon processus à automatiser en premier

Le Module 1 a enseigné à choisir un pilote au fort impact et au faible risque avant d'étendre une automatisation. Le même principe s'applique ici pour choisir quel processus automatiser en premier avec n8n : un processus récurrent et chronophage, dont une erreur se détecte et se corrige facilement, plutôt qu'un processus critique où une erreur passerait inaperçue longtemps.

### Écrire un brief avant de construire quoi que ce soit

Un brief précise ce que l'automatisation doit accomplir concrètement, ce qui définit un succès mesurable, et surtout ce qui reste explicitement hors périmètre pour cette première version. Sans cette dernière précision, un projet n8n a tendance à s'étendre progressivement à des cas non prévus, jusqu'à devenir aussi difficile à maintenir qu'un système jamais cadré dès le départ.

### Reprendre le gabarit du Module 1 pour ce brief

Le gabarit à 4 éléments (contexte, objectif, périmètre, autonomie) vu en Module 1 s'applique tel quel à un brief n8n : le contexte est le processus actuel (souvent manuel) à automatiser, l'objectif est ce que le workflow doit produire, le périmètre délimite les cas couverts par cette première version, et l'autonomie précise ce qui peut être décidé seul versus ce qui doit être validé avant mise en service réelle.

**Points clés**
- Choisir un processus récurrent, chronophage, et à faible risque d'erreur pour une première automatisation
- Un brief précise l'objectif, ce qui définit un succès mesurable, et ce qui reste hors périmètre
- Le gabarit à 4 éléments du Module 1 s'applique directement pour cadrer ce brief

---

## Chapitre 2 : Build MVP, logique & injection de données

### Construire le chemin principal avant les cas particuliers

Un MVP de workflow couvre d'abord le "happy path" : le déroulé normal, sans les cas d'erreur ou les exceptions rares. Construire d'abord ce chemin principal et le valider permet de s'assurer que la logique de base fonctionne, avant d'ajouter la complexité des cas particuliers qui viendront ensuite, logiquement, une fois le cœur du workflow éprouvé.

### L'injection de données, un point souvent sous-estimé

Comment les données existantes entrent dans le système est une question à part entière : une importation ponctuelle d'un fichier existant n'a pas les mêmes implications qu'un flux de données qui arrive en continu via un webhook. Décider ce point tôt évite de construire une logique qui ne correspond pas à la réalité de comment la donnée arrive réellement.

### Tester le MVP avec des données réalistes, pas des cas parfaits

Le cycle Plan, Execute, Validate du Module 1 s'applique ici : tester le MVP avec des données qui ressemblent à ce qui arrivera réellement (un nom mal formaté, un champ vide, une valeur inattendue), pas uniquement avec le cas le plus propre possible qui ne révèle jamais les failles réelles d'un workflow.

**Points clés**
- Construire et valider le chemin principal avant d'ajouter les cas particuliers
- Décider tôt comment les données existantes entrent dans le système, import ponctuel ou flux continu
- Tester avec des données réalistes et imparfaites, pas seulement le cas le plus propre possible

---

## Chapitre 3 : Agent automatisé de bout en bout

### Assembler les briques des sections précédentes

Un projet complet mobilise les briques vues dans tout le module : un trigger adapté au déclencheur réel (section 1), une logique de données propre et une gestion d'erreur qui prévient réellement (section 2), potentiellement un agent IA pour les décisions contextuelles (section 3), une architecture multi-agents si le périmètre le justifie (section 4), et un déploiement sécurisé et observable si ce projet doit tourner en continu (section 5).

### La livraison suit la même checklist que tout projet

Fonctionnel, sécurité, handoff : la checklist de livraison du Module 1 s'applique aussi à un projet n8n complet. Le handoff précise ici comment quelqu'un d'autre pourrait reprendre ce workflow, où se trouvent les credentials, et quoi faire en cas d'alerte du monitoring.

### Ce projet comme futur starter

Un projet n8n complet, bien documenté et généralisé, devient un starter réutilisable pour un besoin similaire chez un prochain client, exactement comme les starters de la bibliothèque Chatllow vus en Module 1. La capitalisation ne se décide pas après coup, elle se facilite en gardant le projet propre et documenté dès sa construction.

**Points clés**
- Un projet complet assemble les briques de tout le module, pas seulement celles de la dernière section
- La checklist fonctionnel/sécurité/handoff du Module 1 s'applique pleinement à un projet n8n livré
- Un projet bien documenté dès sa construction devient plus facilement un starter réutilisable ensuite

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi choisir un processus à faible risque d'erreur pour une première automatisation ?
2. Que doit préciser un brief, au-delà de l'objectif à atteindre ?
3. Pourquoi construire le chemin principal avant les cas particuliers ?
4. Cite 3 briques des sections précédentes qu'un projet complet peut mobiliser.

### Réflexion (synthèse de fin de module)
5. Choisis un processus réel de ton activité (Chatllow ou Longrich) qui pourrait être automatisé avec n8n. Rédige son brief avec le gabarit à 4 éléments.
6. En repensant à l'ensemble du Module 2, quelle section te semble la plus directement applicable à ton activité actuelle ? Pourquoi ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : une erreur sur un processus à faible risque se détecte et se corrige facilement, contrairement à un processus critique où elle passerait inaperçue longtemps
- Q2 : ce qui définit un succès mesurable, et ce qui reste explicitement hors périmètre pour cette première version
- Q3 : ça valide que la logique de base fonctionne avant d'ajouter la complexité des cas particuliers, qui s'appuient sur un socle déjà éprouvé
- Q4 : trigger adapté, gestion d'erreur qui prévient réellement, agent IA pour les décisions contextuelles, architecture multi-agents si justifié, déploiement sécurisé et observable (3 au choix parmi ces exemples)
- Q5/Q6 : pas de réponse unique, évaluer la cohérence et la pertinence pour le cas choisi
