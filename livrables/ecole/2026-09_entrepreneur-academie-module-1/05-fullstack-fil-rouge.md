# Section 5 — 🚀 Le Fullstack, projet fil rouge

> Cette section applique tout ce qui précède sur un projet concret unique, mené du début à la fin. C'est la section la plus pratique du module.

## Chapitre 1 : De Lovable à Claude Code, la transition production

Beaucoup d'entrepreneurs découvrent d'abord des outils "no-code" ou de génération rapide type Lovable, qui permettent de prototyper une interface très vite, sans écrire de code. C'est excellent pour tester une idée, montrer une maquette interactive, valider un concept.

La limite arrive au moment de la production réelle : un client qui doit gérer de vraies données, une sécurité réelle, une évolution dans le temps, une intégration avec d'autres outils métier. Ces outils de prototypage rapide sont rarement pensés pour cette étape.

Claude Code prend le relais à ce moment précis : on garde l'idée validée, éventuellement l'interface pensée dans l'outil de prototypage comme référence visuelle, et on reconstruit avec une base solide, extensible, qui peut évoluer sur plusieurs mois et intégrer des systèmes tiers (base de données réelle, automatisations, paiement, etc.).

Ce chapitre pose donc un principe de méthode : prototyper vite avec les outils adaptés au prototypage, puis passer en production avec les outils adaptés à la production, sans confondre les deux étapes.

**Points clés**
- Lovable et équivalents : excellents pour prototyper vite
- Claude Code : pris le relais pour la production réelle, durable
- Ne pas confondre l'outil de validation d'idée et l'outil de livraison finale

---

## Chapitre 2 : L'architecture fullstack n8n + Claude Code

Le projet fil rouge de cette section combine deux briques complémentaires : Claude Code construit l'application (interface, logique, base de données), n8n orchestre les automatisations et connecte les systèmes externes (envoi d'emails, notifications, synchronisation entre outils, appels à des IA pour du traitement en tâche de fond).

Cette répartition suit une logique claire : ce qui est directement visible et utilisé par l'utilisateur final (le produit) est construit et maintenu dans le code, pendant que ce qui est de la plomberie entre systèmes (déclencher une action quand un événement se produit, automatiser un processus métier) est géré par n8n, de façon visuelle et modifiable sans redéploiement du code.

C'est une architecture particulièrement adaptée à un cabinet de conseil comme Chatllow : elle permet de livrer un produit fonctionnel rapidement (Claude Code), tout en gardant une couche d'automatisation flexible et évolutive (n8n) que le client, ou toi-même en maintenance, peut ajuster sans redévelopper l'application.

**Points clés**
- Claude Code construit le produit, n8n orchestre les automatisations et connexions
- Séparer "produit" et "plomberie entre systèmes" facilite la maintenance
- Architecture adaptée à des livraisons rapides avec évolutivité derrière

---

## Chapitre 3 : MCP Playwright, votre navigateur au service du dev

Playwright est un outil qui permet de piloter un navigateur web automatiquement : ouvrir une page, cliquer, remplir un formulaire, vérifier ce qui s'affiche. Connecté à Claude Code via MCP, il donne à l'agent la capacité de tester réellement une application comme le ferait un utilisateur humain, plutôt que de se fier uniquement à une lecture du code.

C'est un changement de nature pour la phase de validation vue au chapitre "Plan, Execute, Validate" : au lieu de dire "je crois que ça marche parce que le code semble correct", on peut dire "j'ai vérifié en ouvrant réellement la page, en remplissant le formulaire, et en observant le résultat".

Pour le projet fil rouge, cet outil sert particulièrement à valider chaque phase de build (formulaire, dashboard, page de statut) en conditions réelles avant de la considérer terminée, ce qui réduit fortement le risque de découvrir un problème seulement au moment de la livraison au client.

**Points clés**
- Playwright pilote un vrai navigateur, comme un utilisateur humain
- Connecté via MCP, Claude Code peut tester réellement, pas seulement lire le code
- Réduit le risque de problèmes découverts trop tard

---

## Chapitre 4 : Build Phase 1, formulaire d'intake client

Premier bloc concret du projet fil rouge : construire le formulaire qui capture les informations d'un nouveau client ou prospect (intake). C'est souvent le premier point de contact structuré entre un client et le système.

Ce que cette phase enseigne en pratique : cadrer précisément quelles informations collecter et pourquoi (pas plus que nécessaire, chaque champ doit avoir une utilité claire), structurer la validation des données saisies (un email doit ressembler à un email, un champ obligatoire doit l'être réellement), et connecter ce formulaire à la suite du système (où vont les données une fois soumises).

C'est une excellente première brique de projet fil rouge parce qu'elle est autonome (on peut la tester seule), concrète (le résultat est immédiatement visible et utilisable), et représentative des enjeux du reste du module : cadrage clair, validation, connexion au reste de l'architecture.

**Points clés**
- Premier point de contact structuré du système
- Cadrer précisément les champs nécessaires, ni plus ni moins
- Valider les données et définir où elles vont ensuite

---

## Chapitre 5 : Build Phase 2, dashboard de suivi

Deuxième bloc : une interface qui permet de visualiser et suivre les données collectées (par exemple, dans la lignée du formulaire d'intake, un dashboard qui montre les prospects entrés, leur statut, leur historique).

Cette phase enseigne des enjeux différents de la phase 1 : organiser une quantité d'informations pour qu'elle reste lisible (filtres, recherche, tri), représenter un état qui évolue dans le temps (statuts, historique de changement), et penser l'expérience de la personne qui va utiliser ce dashboard au quotidien, pas seulement une fois.

C'est ici que la notion de produit "qui scale" prend tout son sens concrètement : un dashboard pensé pour 10 lignes de données fonctionne différemment d'un dashboard pensé pour en accueillir des centaines. Anticiper cette croissance dès la construction évite une refonte coûteuse plus tard.

**Points clés**
- Visualiser et suivre les données dans le temps, pas seulement les afficher
- Filtres, recherche, tri deviennent nécessaires dès que le volume grandit
- Penser l'usage quotidien, pas juste l'affichage ponctuel

---

## Chapitre 6 : Build Phase 3, page de statut et livraison finale

Dernier bloc du projet fil rouge : une page de statut, qui permet typiquement à un client externe de suivre où en est sa demande ou son projet, sans avoir à demander directement à l'agence ou au consultant.

Cette phase referme la boucle du projet fil rouge en connectant les trois briques : les données saisies en phase 1, organisées et suivies en interne en phase 2, sont maintenant exposées de façon lisible et rassurante à la personne extérieure concernée. C'est un excellent exemple de la promesse du module 1 dans son ensemble : un produit complet, du terminal au déploiement, livré à un client.

La livraison finale n'est pas que technique : elle inclut la vérification complète (via Playwright notamment), la documentation du fonctionnement, et la mise en ligne réelle (Vercel ou OVH, vu en section 1). C'est le moment où tous les chapitres précédents du module convergent en un seul livrable cohérent.

**Points clés**
- La page de statut ferme la boucle : le client voit l'avancement sans solliciter directement
- La livraison finale combine vérification, documentation, mise en ligne
- C'est la synthèse pratique de tout le module 1

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi passer d'un outil comme Lovable à Claude Code au moment de la production réelle ?
2. Dans l'architecture fullstack de ce module, que fait Claude Code, que fait n8n ?
3. Qu'apporte MCP Playwright par rapport à une simple relecture du code ?
4. Quelles sont les trois phases de build du projet fil rouge, en une phrase chacune ?

### Réflexion (exercice de synthèse)
5. Imagine un projet client réel pour Chatllow ou pour un distributeur Longrich. Décris en quelques lignes à quoi ressembleraient ses trois phases de build (intake, dashboard, statut), adaptées à ce cas précis.
6. À quel moment précis de ce projet fil rouge la phase "Validate" du workflow (section 2) intervient-elle le plus, et pourquoi ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : les outils de prototypage rapide ne sont pas pensés pour la production réelle (données réelles, sécurité, évolutivité, intégrations)
- Q2 : Claude Code construit le produit (interface, logique, données), n8n orchestre automatisations et connexions externes
- Q3 : il permet de tester réellement en pilotant un navigateur, pas seulement de supposer que le code est correct
- Q4 : Phase 1 = capturer les informations client (intake) ; Phase 2 = visualiser et suivre ces données (dashboard) ; Phase 3 = exposer l'avancement au client externe (statut)
- Q5 : pas de réponse unique, évaluer la cohérence et la pertinence pour le cas choisi
- Q6 : surtout en phase 3, via Playwright, avant la livraison finale, mais aussi à la fin de chaque phase pour ne pas accumuler les problèmes
