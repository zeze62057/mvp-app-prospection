# Section 5 — 🚀 Le Fullstack, projet fil rouge

> Fiche pratique associée : [05-fullstack-fil-rouge-prompts.md](05-fullstack-fil-rouge-prompts.md), les vrais prompts du projet fil rouge Alpha Conseil, phase par phase.

> Cette section applique tout ce qui précède sur un projet concret unique, mené du début à la fin. C'est la section la plus pratique du module.

## Chapitre 1 : De Lovable à Claude Code, la transition production

### Un point de départ courant

Beaucoup d'entrepreneurs découvrent d'abord des outils "no-code" ou de génération rapide type Lovable, qui permettent de prototyper une interface très vite, sans écrire de code. C'est un excellent point d'entrée : tester une idée en quelques heures, montrer une maquette interactive à un associé ou un client potentiel, valider qu'un concept tient la route avant d'y investir plus de temps.

### Où la limite apparaît

La limite arrive au moment de la production réelle : un client qui doit gérer de vraies données sensibles, une sécurité réelle et pas seulement esthétique, une évolution dans le temps avec de nouvelles fonctionnalités, une intégration avec d'autres outils métier déjà en place chez le client. Ces outils de prototypage rapide sont rarement pensés pour cette étape, parce que ce n'est pas leur objectif premier : ils optimisent la vitesse de démonstration, pas la robustesse à long terme.

### Le relais pris par Claude Code

Claude Code prend le relais à ce moment précis, pas avant. On garde l'idée validée par le prototype, éventuellement l'interface pensée dans l'outil de prototypage comme référence visuelle à s'inspirer, et on reconstruit avec une base solide et extensible, qui peut évoluer sur plusieurs mois et intégrer des systèmes tiers (base de données réelle, automatisations, paiement en ligne, etc.) sans se heurter aux limites structurelles d'un outil pensé pour la démonstration rapide.

### Le principe de méthode à retenir

Ce chapitre pose donc un principe simple mais souvent oublié : prototyper vite avec les outils adaptés au prototypage, puis passer en production avec les outils adaptés à la production, sans confondre les deux étapes ni essayer de faire vivre indéfiniment un prototype comme s'il était un produit fini. Beaucoup de projets échouent en essayant de faire l'inverse : pousser un prototype toujours plus loin au lieu de basculer au bon moment.

### Exemple concret

Pour le projet fil rouge Alpha Conseil, un premier écran de formulaire d'intake peut être maquetté dans Lovable en une heure, pour valider avec le client à quoi ressemblera l'expérience. Une fois cette maquette approuvée, ce n'est pas ce prototype qui part en production : Claude Code reconstruit le formulaire avec une vraie validation des données, un vrai stockage, et une vraie sécurité, en gardant la maquette comme simple référence visuelle.

**Points clés**
- Lovable et équivalents : excellents pour prototyper vite, pas pour la production durable
- Claude Code prend le relais pour la production réelle, extensible sur la durée
- Ne pas confondre l'outil de validation d'idée et l'outil de livraison finale

---

## Chapitre 2 : L'architecture fullstack n8n + Claude Code

### Deux briques complémentaires

Le projet fil rouge de cette section combine deux briques complémentaires, chacune avec un rôle bien distinct. Claude Code construit l'application elle-même : l'interface que voit l'utilisateur, la logique métier, la base de données. n8n orchestre les automatisations et connecte les systèmes externes : envoi d'emails, notifications, synchronisation entre outils, appels à des IA pour du traitement en tâche de fond qui n'a pas besoin d'interaction immédiate.

### La logique derrière cette répartition

Cette répartition suit une logique claire, pas un choix arbitraire. Ce qui est directement visible et utilisé par l'utilisateur final, le produit en tant que tel, est construit et maintenu dans le code, avec toute la rigueur que ça demande. Ce qui relève de la plomberie entre systèmes, déclencher une action quand un événement précis se produit, automatiser un processus métier récurrent, est géré par n8n, de façon visuelle et modifiable sans avoir besoin de redéployer le code de l'application.

### Exemple concret sur le formulaire d'intake

Claude Code construit le formulaire lui-même : les champs, la validation, l'enregistrement en base de données. C'est le produit.

Une fois le formulaire soumis, plusieurs choses doivent se passer automatiquement. C'est là que n8n intervient. Envoyer un email de confirmation au prospect. Notifier Zézé sur Slack ou par email qu'un nouveau lead vient d'arriver. Ajouter automatiquement la ligne dans un CRM ou un Google Sheet de suivi. Éventuellement, faire appel à une IA pour qualifier le lead avant même qu'un humain le regarde, chaud, tiède ou froid selon les réponses données.

Sans n8n, il faudrait coder chacune de ces automatisations directement dans l'application. Possible, mais chaque petit ajustement demanderait de retoucher le code et de redéployer. Avec n8n, ces automatisations sont visuelles, séparées du code, et modifiables en quelques clics.

### Exemple concret sur le dashboard

Le dashboard lui-même, filtres, tri, affichage des prospects, est construit par Claude Code : c'est l'interface.

Mais un rapport hebdomadaire automatique envoyé par email tous les lundis matins, "voici les 5 nouveaux prospects de la semaine, voici ceux sans réponse depuis 3 jours", relève de n8n. Ça tourne sur une planification, ça touche un système externe (l'email), et ça n'a pas besoin d'interaction en temps réel avec l'utilisateur.

### Pourquoi c'est adapté à un cabinet de conseil

Un client CAC40 va vouloir, au fil du temps, ajuster ses processus métier : changer le seuil qui déclenche une alerte, ajouter une notification vers un nouvel outil interne, modifier le contenu d'un email automatique. Si tout ça était codé en dur dans l'application, chaque changement demanderait un nouveau développement facturé et un redéploiement. Avec n8n, le client, ou Zézé en maintenance, ouvre le workflow visuel et ajuste directement, sans toucher au code de l'application.

### Le lien avec ce qu'on a vu jusqu'ici

Cette architecture illustre directement le chapitre "Claude Code au-delà de n8n" qu'on verra en section 7 : n8n n'est pas une contrainte imposée, c'est un choix pertinent quand le besoin correspond précisément à ce qu'il fait de mieux, l'orchestration visuelle entre systèmes.

**Points clés**
- Claude Code construit le produit, n8n orchestre les automatisations et connexions externes
- Séparer "produit" et "plomberie entre systèmes" facilite la maintenance future
- Architecture adaptée à des livraisons rapides avec de l'évolutivité derrière, sans tout redévelopper

---

## Chapitre 3 : MCP Playwright, votre navigateur au service du dev

### Ce que Playwright fait concrètement

Playwright est un outil qui permet de piloter un navigateur web de façon automatisée : ouvrir une page, cliquer sur un bouton, remplir un formulaire, vérifier ce qui s'affiche réellement à l'écran. Connecté à Claude Code via MCP, il donne à l'agent la capacité de tester réellement une application comme le ferait un utilisateur humain, plutôt que de se fier uniquement à une lecture statique du code source.

### Un changement de nature pour la validation

C'est un changement de nature important pour la phase Validate du workflow vu en section 2. Sans cet outil, la validation se limite souvent à dire "je crois que ça marche parce que le code semble correct en le relisant". Avec Playwright, on peut affirmer quelque chose de plus solide : "j'ai vérifié en ouvrant réellement la page, en remplissant le formulaire avec des données de test, et en observant le résultat effectivement produit à l'écran".

### Son usage précis dans le projet fil rouge

Pour ce projet fil rouge en particulier, cet outil sert à valider chaque phase de build (le formulaire, le dashboard, la page de statut) en conditions réelles avant de considérer cette phase comme terminée. Ça réduit fortement le risque de découvrir un problème seulement au moment de la livraison finale au client, moment où le corriger coûte le plus cher en temps et en confiance perdue.

### Une compétence qui dépasse ce seul projet

Cette capacité de test automatisé en conditions réelles n'est pas propre au projet fil rouge : c'est une compétence transférable à tout projet futur qui a une interface utilisateur, ce qui couvre la grande majorité des livraisons qu'un cabinet comme Chatllow produira.

**Points clés**
- Playwright pilote un vrai navigateur, exactement comme le ferait un utilisateur humain
- Connecté via MCP, Claude Code peut tester réellement, pas seulement relire le code et supposer
- Réduit le risque de découvrir des problèmes trop tard, au moment le plus coûteux

---

## Chapitre 4 : Build Phase 1, formulaire d'intake client

### Le rôle de cette première brique

Premier bloc concret du projet fil rouge : construire le formulaire qui capture les informations d'un nouveau client ou prospect, ce qu'on appelle l'intake. C'est souvent le tout premier point de contact structuré entre un client potentiel et le système que tu as construit, ce qui en fait une pièce particulièrement sensible même si elle semble simple en apparence.

### Ce que cette phase enseigne en pratique

Cette phase enseigne trois choses en pratique. D'abord, cadrer précisément quelles informations collecter et pourquoi : pas plus que nécessaire, chaque champ doit avoir une utilité claire et justifiable, sans quoi on décourage inutilement la personne qui remplit le formulaire. Ensuite, structurer la validation des données saisies : un email doit ressembler réellement à un email, un champ obligatoire doit l'être réellement et pas seulement en apparence. Enfin, connecter ce formulaire à la suite du système : où vont concrètement les données une fois soumises, et que se passe-t-il ensuite.

### Pourquoi cette brique en premier

C'est une excellente première brique de projet fil rouge pour trois raisons précises : elle est autonome, on peut la tester seule sans dépendre du reste ; elle est concrète, le résultat est immédiatement visible et utilisable par quiconque la teste ; et elle est représentative des enjeux de tout le reste du module, cadrage clair, validation rigoureuse, connexion réfléchie au reste de l'architecture.

**Points clés**
- Premier point de contact structuré du système avec l'extérieur
- Cadrer précisément les champs nécessaires, ni plus ni moins que le besoin réel
- Valider les données saisies et définir clairement où elles vont ensuite

---

## Chapitre 5 : Build Phase 2, dashboard de suivi

### Le rôle de cette deuxième brique

Deuxième bloc du projet fil rouge : une interface qui permet de visualiser et suivre les données collectées à la phase précédente. Dans la continuité du formulaire d'intake, ça peut être par exemple un dashboard qui montre les prospects entrés, leur statut actuel, et leur historique d'interactions.

### Des enjeux différents de la phase précédente

Cette phase enseigne des enjeux assez différents de la phase 1. Il faut organiser une quantité d'informations croissante pour qu'elle reste lisible dans le temps, avec des filtres, une recherche, un tri pertinent. Il faut représenter un état qui évolue, comme des statuts qui changent et un historique de ces changements, pas juste une photo figée à un instant donné. Et il faut penser l'expérience de la personne qui va utiliser ce dashboard au quotidien, pas une seule fois de façon ponctuelle.

### Pourquoi c'est ici que "scale" prend tout son sens

C'est précisément ici que la notion de produit "qui scale", évoquée au chapitre 6 de la section 3, prend tout son sens de façon concrète et pas seulement théorique. Un dashboard pensé pour afficher 10 lignes de données fonctionne différemment, dans sa conception même, d'un dashboard pensé pour en accueillir plusieurs centaines. Anticiper cette croissance dès la construction évite une refonte coûteuse plus tard, quand le volume de données aura effectivement grandi et que le dashboard initial montrera ses limites.

**Points clés**
- Visualiser et suivre les données dans le temps, pas seulement les afficher à un instant T
- Filtres, recherche, tri deviennent nécessaires dès que le volume de données grandit
- Penser l'usage quotidien et répété, pas juste l'affichage ponctuel d'une démonstration

---

## Chapitre 6 : Build Phase 3, page de statut et livraison finale

### La dernière brique du projet fil rouge

Dernier bloc du projet fil rouge : une page de statut, qui permet typiquement à un client externe de suivre où en est sa demande ou son projet, sans avoir à demander directement et répétitivement à l'agence ou au consultant en charge.

### Comment cette phase referme la boucle

Cette phase referme la boucle du projet fil rouge en connectant les trois briques construites successivement : les données saisies en phase 1 via le formulaire d'intake, organisées et suivies en interne en phase 2 via le dashboard, sont maintenant exposées de façon lisible et rassurante à la personne extérieure directement concernée. C'est un excellent exemple concret de la promesse posée dès le tout premier chapitre du module : un produit complet, du terminal jusqu'au déploiement, livré à un client réel.

### Ce que "livraison finale" veut dire précisément

La livraison finale n'est pas qu'une question technique de code qui fonctionne. Elle inclut la vérification complète du parcours, notamment via Playwright vu au chapitre 3, la documentation du fonctionnement pour que le client s'y retrouve seul, et la mise en ligne réelle du projet, via Vercel ou OVH comme vu en section 1. C'est précisément le moment où tous les chapitres précédents du module convergent en un seul livrable cohérent, plutôt que de rester des notions séparées apprises indépendamment les unes des autres.

**Points clés**
- La page de statut ferme la boucle : le client voit l'avancement sans avoir à solliciter directement
- La livraison finale combine vérification rigoureuse, documentation claire, et mise en ligne réelle
- C'est la synthèse pratique où convergent tous les chapitres précédents du module 1

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
