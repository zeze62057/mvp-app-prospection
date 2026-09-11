# Section 3 — 🕹️ Maîtriser l'outil

## Chapitre 1 : Premiers pas, outils principaux et permissions

Claude Code agit sur ta machine par le biais d'outils : lire un fichier, en écrire un, exécuter une commande, chercher dans le projet, etc. Chaque outil a un rôle précis, et surtout, chaque action sensible peut demander ta permission avant de s'exécuter.

Ce système de permission n'est pas une contrainte gênante, c'est un principe de sécurité fondamental. Une action réversible et sans risque (lire un fichier, chercher un mot dans le code) peut se faire librement. Une action à impact plus large ou irréversible (supprimer un fichier, exécuter une commande qui modifie des données, pousser du code en ligne) mérite ta validation explicite.

Comprendre ce système dès le début évite deux excès : accepter systématiquement tout sans lire, ce qui annule l'intérêt de la permission, ou refuser systématiquement par méfiance excessive, ce qui ralentit inutilement le travail. Le bon réflexe : lire ce qui est proposé, comprendre l'impact, puis décider.

**Points clés**
- Chaque outil a un rôle précis (lire, écrire, exécuter, chercher)
- Les actions sensibles demandent une validation explicite
- Lire avant de valider, ni confiance aveugle ni méfiance systématique

---

## Chapitre 2 : CLAUDE.md, le cerveau de votre projet

CLAUDE.md est un fichier que Claude Code lit automatiquement au début de chaque session de travail sur un projet. C'est l'endroit où on écrit tout ce que l'agent doit savoir en permanence sur ce projet précis, pour ne pas avoir à le répéter à chaque conversation.

Ce qu'on y met typiquement : qui est l'utilisateur ou le client, quel est l'objectif du projet, quelles conventions de code ou de style suivre, quelles zones du projet sont sensibles et ne doivent pas être modifiées sans validation, comment le projet est structuré.

C'est un document vivant : il évolue avec le projet, se corrige quand une instruction générale s'avère mal comprise, s'enrichit quand un nouveau besoin récurrent apparaît. Un CLAUDE.md bien tenu est ce qui permet à Claude Code de rester cohérent sur un projet qui dure des semaines ou des mois, avec plusieurs sessions de travail espacées dans le temps.

**Points clés**
- Lu automatiquement au début de chaque session
- Contient le contexte permanent du projet, pas les instructions ponctuelles
- Document vivant, à maintenir à jour au fil du projet

---

## Chapitre 3 : Skills et Slash Commands, vos raccourcis personnalisés

Deux mécanismes permettent de personnaliser et d'accélérer le travail avec Claude Code au-delà d'une simple conversation.

Un **Slash Command** est une instruction préécrite, déclenchée par une commande courte (par exemple `/commit` ou `/prime`), qui exécute une séquence d'actions définies à l'avance. Utile pour des tâches répétitives et bien cadrées : faire un point de contexte en début de session, préparer un commit Git propre, lancer une routine du matin.

Un **Skill** est plus large qu'une commande : c'est un ensemble d'instructions et de connaissances que Claude Code peut mobiliser pour une mission précise, parfois déclenché automatiquement quand la situation correspond, parfois seulement sur demande explicite. Un skill peut contenir une méthode complète (comment faire une veille personnalisée, comment gérer un programme de formation), pas seulement une suite d'actions mécaniques.

La différence à retenir : la commande automatise un geste, le skill encapsule un savoir-faire.

**Points clés**
- Slash Command : raccourci pour une séquence d'actions précise
- Skill : savoir-faire mobilisable, déclenché automatiquement ou sur demande
- Les deux évitent de répéter les mêmes explications à chaque session

---

## Chapitre 4 : MCP, connecter Claude Code à votre écosystème

MCP (Model Context Protocol) est le mécanisme qui permet à Claude Code de se connecter à des outils et services extérieurs au projet local : Notion, Google Drive, n8n, Canva, une base de données, etc.

Sans MCP, Claude Code ne travaille que sur ce qui est présent localement, sur ta machine. Avec un serveur MCP connecté, il peut lire et écrire dans ces services externes directement, avec ton autorisation, comme s'ils faisaient partie de sa boîte à outils.

C'est ce qui permet des cas d'usage comme ceux vus dans ce workspace : un agent qui rédige des posts et les enregistre directement dans une base Notion, ou qui génère un visuel via Canva et l'attache à la bonne page. Sans MCP, ces actions demanderaient une intervention manuelle de copier-coller entre systèmes.

Le point de vigilance pédagogique : plus on connecte de services, plus il faut être rigoureux sur ce qu'on autorise à modifier, et vérifier que l'agent respecte bien le périmètre donné (ne pas inventer de propriété, ne pas modifier ce qui n'a pas été demandé).

**Points clés**
- MCP connecte Claude Code à des outils et services externes
- Permet d'agir directement dans ces services, pas seulement en local
- Plus de connexions veut dire plus de vigilance sur le périmètre autorisé

---

## Chapitre 5 : Hooks, automatiser Claude Code

Les hooks sont des règles automatiques qui se déclenchent à des moments précis du fonctionnement de Claude Code : avant qu'un outil s'exécute, après qu'une réponse soit donnée, quand une session se termine, etc.

Un hook permet, par exemple, de forcer une vérification systématique avant tout commit, d'empêcher certaines actions dans certains dossiers sensibles, ou de déclencher une notification quand une tâche longue se termine. Contrairement à une instruction donnée dans une conversation, un hook s'applique de façon systématique, sans dépendre de si on a pensé à le redemander ce jour-là.

C'est un mécanisme plus avancé, pertinent surtout une fois qu'on a identifié un comportement qu'on veut garantir à chaque fois, pas seulement de temps en temps. Un apprenant débutant n'a pas besoin de configurer des hooks dès le premier projet, mais doit savoir que le mécanisme existe pour le jour où un besoin récurrent de fiabilité apparaît.

**Points clés**
- Hook = règle automatique déclenchée à un moment précis du fonctionnement
- Garantit un comportement systématique, sans dépendre d'un rappel manuel
- Pertinent une fois un besoin de fiabilité récurrent identifié, pas dès le premier jour

---

## Chapitre 6 : Structurer son projet, l'arborescence qui scale

La façon dont un projet est organisé en dossiers et fichiers (son "arborescence") a un impact direct sur la capacité de Claude Code, et de toi-même, à s'y retrouver quand le projet grossit.

Une bonne structure sépare clairement les grandes responsabilités : le code de l'application, la documentation, les fichiers de configuration, les éléments livrés versus les éléments de travail en cours. Un projet mal structuré, où tout est mélangé dans un seul dossier, devient de plus en plus lent à faire évoluer, même avec un agent IA compétent, parce que chaque instruction doit composer avec un désordre croissant.

"L'arborescence qui scale" veut dire une organisation qui reste compréhensible même quand le projet passe de 10 à 100 fichiers. Le bon réflexe est de poser cette structure dès le début, même simple, plutôt que d'attendre que le désordre devienne un problème pour la corriger après coup.

**Points clés**
- L'organisation des dossiers impacte directement l'efficacité du travail avec l'agent
- Séparer clairement code, documentation, configuration, livrables
- Poser une structure dès le début plutôt que corriger le désordre plus tard

---

## Chapitre 7 : Gérer les coûts intelligemment

Utiliser Claude Code a un coût, lié à l'usage. Ignorer cette dimension peut transformer un projet rentable en projet qui coûte plus cher à produire qu'il ne rapporte.

Quelques leviers pour maîtriser ce coût sans sacrifier la qualité : cadrer les instructions précisément pour éviter les allers-retours inutiles (une instruction floue coûte cher en itérations), découper les grosses tâches en étapes vérifiables plutôt que de tout demander d'un coup et devoir tout recommencer en cas d'erreur, et réserver les tâches les plus lourdes (recherche extensive, génération de gros volumes) aux moments où elles sont réellement nécessaires.

Pour un cabinet de conseil ou une activité facturée à des clients, cette maîtrise des coûts fait directement partie du calcul de rentabilité d'un projet : un produit livré vite mais avec un usage d'IA mal maîtrisé peut manger la marge prévue.

**Points clés**
- Le coût d'usage doit entrer dans le calcul de rentabilité d'un projet client
- Un cadrage précis réduit les itérations coûteuses
- Découper les tâches limite le risque de tout recommencer

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi le système de permissions de Claude Code n'est-il pas qu'une contrainte gênante ?
2. Que contient un bon fichier CLAUDE.md, et pourquoi doit-il être maintenu à jour ?
3. Quelle est la différence entre un Slash Command et un Skill ?
4. À quoi sert MCP, avec un exemple concret vu dans ce chapitre ?
5. Donne un exemple de situation où un hook serait utile.

### Réflexion
6. Tu démarres un projet pour un client. Liste 3 informations que tu mettrais dans le CLAUDE.md de ce projet dès le premier jour.
7. Pourquoi une mauvaise arborescence de projet peut-elle ralentir le travail même avec un agent IA très compétent ?
8. Propose une règle simple de maîtrise des coûts que tu pourrais appliquer sur ton prochain projet.

### Éléments de correction (réservé à l'enseignant)
- Q1 : elle protège contre des actions à impact large ou irréversible, tout en laissant les actions sûres se faire librement
- Q2 : contexte utilisateur/client, objectif, conventions, zones sensibles, structure ; à jour car le projet évolue et les erreurs de compréhension doivent être corrigées
- Q3 : commande = séquence d'actions précise, skill = savoir-faire plus large, parfois auto-déclenché
- Q4 : connecter Claude Code à des services externes (Notion, Canva...) pour agir directement dedans, exemple : agent qui écrit dans Notion et attache une image Canva
- Q5 : forcer une vérification avant chaque commit, empêcher une action dans un dossier sensible
- Q6/Q7/Q8 : pas de réponse unique, évaluer la pertinence et la clarté du raisonnement
