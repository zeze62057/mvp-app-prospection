# Section 3 — 🕹️ Maîtriser l'outil

> Fiche pratique associée : [03-maitriser-loutil-prompts.md](03-maitriser-loutil-prompts.md), un vrai prompt par chapitre technique.

## Chapitre 1 : Premiers pas, outils principaux et permissions

### Comment Claude Code agit concrètement

Claude Code agit sur ta machine par le biais d'outils précis : lire un fichier, en écrire un, exécuter une commande, chercher dans le projet, naviguer dans une structure de dossiers, etc. Chaque outil a un rôle délimité, ce n'est pas une intelligence qui agit "en général" sur ta machine sans contrôle.

### Le système de permission, un principe de sécurité, pas une gêne

Chaque action sensible peut demander ta validation avant de s'exécuter. Ce n'est pas une contrainte gênante ajoutée par prudence excessive, c'est un principe de sécurité fondamental construit dans l'outil. Une action réversible et sans risque (lire un fichier, chercher un mot dans le code) peut se faire librement, sans ralentir le travail. Une action à impact plus large ou irréversible (supprimer un fichier, exécuter une commande qui modifie des données, pousser du code en ligne visible par d'autres) mérite ta validation explicite, parce que revenir en arrière serait coûteux ou impossible.

### Exemple concret

Claude Code propose de supprimer un fichier qui semble inutilisé dans un projet client. Une lecture rapide de la proposition montre que ce fichier est en fait référencé par la configuration de déploiement Vercel. Refuser cette action et demander une vérification avant évite une panne de mise en ligne. À l'inverse, une simple lecture de fichier ou une recherche dans le code ne présente aucun risque : valider ce type d'action sans y réfléchir longuement ne pose aucun problème.

### Les deux excès à éviter

Comprendre ce système dès le début évite deux excès symétriques. Le premier : accepter systématiquement tout sans lire, ce qui annule complètement l'intérêt de la permission, puisque tu deviens un simple bouton "oui" automatique. Le second : refuser systématiquement par méfiance excessive, ce qui ralentit inutilement le travail et te fait perdre le bénéfice de vitesse que Claude Code apporte.

### Le bon réflexe à construire dès les premiers projets

Le bon réflexe, à installer dès les tout premiers pas : lire ce qui est proposé, comprendre l'impact concret de l'action (qu'est-ce qui change si je dis oui, est-ce réversible), puis décider. Ce réflexe devient rapidement automatique et rapide avec l'expérience, mais il ne doit jamais disparaître complètement, même sur un projet que tu connais bien.

**Points clés**
- Chaque outil a un rôle précis (lire, écrire, exécuter, chercher)
- Les actions sensibles demandent une validation explicite, les actions sûres non
- Lire avant de valider : ni confiance aveugle, ni méfiance systématique

---

## Chapitre 2 : CLAUDE.md, le cerveau de votre projet

### Ce que ce fichier résout

CLAUDE.md est un fichier que Claude Code lit automatiquement au début de chaque session de travail sur un projet. Il résout un problème très concret : sans lui, il faudrait réexpliquer le contexte du projet à chaque nouvelle conversation, ce qui est fastidieux et source d'oublis.

### Ce qu'on y met typiquement

Ce qu'on y met en général : qui est l'utilisateur ou le client, quel est l'objectif du projet, quelles conventions de code ou de style suivre, quelles zones du projet sont sensibles et ne doivent pas être modifiées sans validation explicite, et comment le projet est structuré dans ses grandes lignes. Ce workspace en est lui-même un exemple concret : son CLAUDE.md définit qui est Zézé, comment communiquer avec lui, et où se trouvent les différents types de contenu.

### Exemple concret

Le CLAUDE.md de ce workspace a dû être suivi d'une mise à jour du contenu déjà produit quand l'école a changé de nom, "Entrepreneur Académie" devenu "Vivier IA" le 12 septembre 2026. Sans relecture des fichiers existants après ce changement, Claude Code aurait continué à utiliser l'ancien nom dans tout nouveau contenu produit, exactement le problème repéré et corrigé dans les fiches de ce Module 1. Un CLAUDE.md à jour ne suffit pas seul, il faut aussi vérifier que le contenu déjà écrit suit le changement.

### Un document vivant, pas un document figé

C'est un document vivant : il évolue avec le projet, se corrige quand une instruction générale s'avère mal comprise par l'agent, s'enrichit quand un nouveau besoin récurrent apparaît. Un CLAUDE.md rédigé une fois au démarrage et jamais retouché perd rapidement de sa valeur, parce qu'il ne reflète plus la réalité actuelle du projet.

### Pourquoi c'est décisif sur la durée

Un CLAUDE.md bien tenu est ce qui permet à Claude Code de rester cohérent sur un projet qui dure des semaines ou des mois, avec plusieurs sessions de travail espacées dans le temps, parfois par d'autres personnes que toi si tu délègues une partie du travail. C'est la mémoire institutionnelle du projet, indépendante de la mémoire d'une conversation précise.

**Points clés**
- Lu automatiquement au début de chaque session, sans avoir à le redemander
- Contient le contexte permanent du projet, pas les instructions ponctuelles d'une tâche
- Document vivant, à maintenir à jour au fil du projet, jamais figé

---

## Chapitre 3 : Skills et Slash Commands, vos raccourcis personnalisés

### Deux mécanismes de personnalisation

Deux mécanismes permettent de personnaliser et d'accélérer le travail avec Claude Code au-delà d'une simple conversation ponctuelle. Ils répondent à des besoins différents, et les confondre fait qu'on choisit parfois le mauvais outil pour la bonne intention.

### Le Slash Command, un raccourci d'action

Un Slash Command est une instruction préécrite, déclenchée par une commande courte (par exemple `/commit` ou `/prime`), qui exécute une séquence d'actions définies à l'avance, toujours dans le même ordre. Utile pour des tâches répétitives et bien cadrées : faire un point de contexte en début de session, préparer un commit Git propre selon une procédure précise, lancer une routine du matin. La force du Slash Command est sa prévisibilité : il fait toujours la même chose, de la même façon.

### Le Skill, un savoir-faire mobilisable

Un Skill est plus large qu'une commande : c'est un ensemble d'instructions et de connaissances que Claude Code peut mobiliser pour une mission précise, parfois déclenché automatiquement quand la situation correspond à sa description, parfois seulement sur demande explicite comme on l'a vu avec le skill `programme-ecosysteme-ia` de ce workspace. Un skill peut contenir une méthode complète (comment faire une veille personnalisée, comment gérer un programme de formation), pas seulement une suite d'actions mécaniques. Il laisse plus de place au jugement de l'agent dans le cadre donné.

### Exemple concret

`/commit` est un Slash Command : il fait toujours la même séquence, statut Git, vérification de secrets, proposition de plan, validation, commit, peu importe le projet ou le contenu modifié. Le skill `programme-marketing-reseau`, lui, ne fait pas toujours la même chose : selon la question posée (situer un sujet dans le programme, proposer une séquence de formation à un distributeur débutant, croiser avec l'IA), il mobilise le même savoir de base mais l'applique différemment à chaque fois, avec du jugement contextuel.

### La différence à retenir, et comment choisir

La différence à retenir : la commande automatise un geste précis et répétitif, le skill encapsule un savoir-faire plus large qui demande encore un peu de jugement contextuel. Si la tâche est toujours identique, une commande suffit. Si la tâche demande d'adapter une méthode à chaque situation, un skill est plus approprié.

**Points clés**
- Slash Command : raccourci pour une séquence d'actions précise et toujours identique
- Skill : savoir-faire mobilisable, avec du jugement contextuel, déclenché automatiquement ou sur demande
- Les deux évitent de répéter les mêmes explications à chaque session

---

## Chapitre 4 : MCP, connecter Claude Code à votre écosystème

### Le problème que MCP résout

Sans connexion externe, Claude Code ne travaille que sur ce qui est présent localement, sur ta machine : les fichiers du projet, rien d'autre. Or une grande partie du travail réel se passe ailleurs : dans Notion, dans une boîte mail, dans un tableur partagé, dans un outil de design.

### Ce que MCP (Model Context Protocol) permet

MCP est le mécanisme qui permet à Claude Code de se connecter à des outils et services extérieurs au projet local : Notion, Google Drive, n8n, Canva, une base de données, et bien d'autres. Avec un serveur MCP connecté, l'agent peut lire et écrire dans ces services externes directement, avec ton autorisation préalable, comme s'ils faisaient partie intégrante de sa boîte à outils habituelle.

### Exemple concret tiré de ce workspace

C'est ce qui permet des cas d'usage comme ceux mis en place récemment dans ce workspace : un agent qui rédige des posts LinkedIn et les enregistre directement dans une base Notion, puis un second agent qui génère un visuel via Canva et l'attache à la bonne page, sans aucune intervention manuelle de copier-coller entre systèmes. Sans MCP, chacune de ces étapes aurait demandé un aller-retour manuel entre plusieurs outils ouverts séparément.

### Le point de vigilance qui grandit avec chaque connexion

Plus on connecte de services, plus il faut être rigoureux sur ce qu'on autorise à modifier, et vérifier que l'agent respecte bien le périmètre donné : ne pas inventer une propriété qui n'existe pas dans une base, ne pas modifier ce qui n'a pas été explicitement demandé, ne pas supposer qu'une action a réussi sans la vérifier. Ce sont exactement les garde-fous appliqués aux agents de ce workspace connectés à Notion et Canva.

**Points clés**
- MCP connecte Claude Code à des outils et services externes au projet local
- Permet d'agir directement dans ces services, pas seulement de travailler en local
- Plus de connexions veut dire plus de vigilance sur le périmètre réellement autorisé

---

## Chapitre 5 : Hooks, automatiser Claude Code

### Ce qu'un hook change par rapport à une instruction

Les hooks sont des règles automatiques qui se déclenchent à des moments précis du fonctionnement de Claude Code : avant qu'un outil s'exécute, après qu'une réponse soit donnée, quand une session se termine, etc. La différence essentielle avec une instruction donnée dans une conversation : un hook s'applique de façon systématique, sans dépendre du fait qu'on ait pensé à le redemander ce jour-là, ou qu'on soit fatigué et qu'on ait oublié une vérification habituelle.

### Des exemples concrets d'utilisation

Un hook permet, par exemple, de forcer une vérification systématique avant tout commit Git, d'empêcher certaines actions dans certains dossiers particulièrement sensibles (comme un dossier contenant des clés d'API), ou de déclencher une notification quand une tâche longue se termine en arrière-plan. Chacun de ces cas répond à un besoin de fiabilité qu'on ne veut plus laisser dépendre de la vigilance humaine du moment.

Un hook qui bloque toute modification directe du fichier `.env` répond exactement à ce principe : plutôt que de compter sur la vigilance de chaque session pour ne jamais toucher aux clés d'API, la règle s'applique systématiquement, même un jour de fatigue ou d'inattention.

### Un mécanisme à introduire au bon moment

C'est un mécanisme plus avancé que les précédents de ce chapitre, pertinent surtout une fois qu'on a identifié, par l'expérience, un comportement qu'on veut garantir à chaque fois, pas seulement de temps en temps quand on y pense. Un apprenant débutant n'a pas besoin de configurer des hooks dès son premier projet. Il doit simplement savoir que ce mécanisme existe, pour le jour où un besoin récurrent de fiabilité se fait sentir, typiquement après avoir été échaudé une première fois par un oubli.

**Points clés**
- Hook = règle automatique déclenchée à un moment précis du fonctionnement, pas une instruction ponctuelle
- Garantit un comportement systématique, indépendant de la vigilance du moment
- Pertinent une fois un besoin de fiabilité récurrent identifié par l'expérience, pas dès le premier jour

---

## Chapitre 6 : Structurer son projet, l'arborescence qui scale

### L'impact concret d'une bonne organisation

La façon dont un projet est organisé en dossiers et fichiers, son "arborescence", a un impact direct sur la capacité de Claude Code, et sur la tienne, à s'y retrouver quand le projet grossit. Ce n'est pas une question esthétique, c'est une question d'efficacité mesurable au fil des semaines.

### Ce que sépare une bonne structure

Une bonne structure sépare clairement les grandes responsabilités : le code de l'application d'un côté, la documentation de l'autre, les fichiers de configuration à part, les éléments livrés (finis) distincts des éléments de travail en cours. Ce workspace applique ce principe avec sa séparation entre `context/` (ce qui te concerne), `livrables/` (ce que Claude produit), et `.claude/` (la configuration de l'assistant lui-même).

### Exemple concret

Ce workspace applique ce principe concrètement : `livrables/ecole/ecosysteme-ia/` et `livrables/ecole/marketing-reseau/` séparent deux filières de cours bien distinctes, plutôt que de tout mélanger dans un seul dossier `ecole/`. Quand un second module a été ajouté (Module 2, n8n), il a pu prendre sa place naturellement dans `ecosysteme-ia/`, à côté du Module 1, sans avoir besoin de réorganiser le reste du dossier.

### Ce qui se passe quand cette structure manque

Un projet mal structuré, où tout est mélangé dans un seul dossier sans logique, devient de plus en plus lent à faire évoluer, même avec un agent IA très compétent, parce que chaque instruction doit composer avec un désordre croissant : l'agent doit deviner où se trouve telle chose, risque de modifier le mauvais fichier, ou de dupliquer une logique qui existait déjà ailleurs sans le savoir.

### Le principe de "l'arborescence qui scale"

"L'arborescence qui scale" veut dire une organisation qui reste compréhensible même quand le projet passe de 10 à 100 fichiers, sans réorganisation complète à chaque palier de croissance. Le bon réflexe est de poser cette structure dès le tout début du projet, même de façon simple, plutôt que d'attendre que le désordre devienne un problème visible pour la corriger après coup, ce qui coûte alors beaucoup plus cher en temps.

**Points clés**
- L'organisation des dossiers impacte directement l'efficacité du travail avec l'agent
- Séparer clairement code, documentation, configuration, et livrables finis
- Poser une structure dès le début plutôt que corriger le désordre après coup

---

## Chapitre 7 : Gérer les coûts intelligemment

### Une dimension économique à ne pas ignorer

Utiliser Claude Code a un coût, lié à l'usage réel qui en est fait. Ignorer cette dimension peut transformer un projet rentable sur le papier en projet qui coûte en réalité plus cher à produire qu'il ne rapporte, surtout si l'agent effectue beaucoup d'itérations inutiles faute d'un bon cadrage.

### Les leviers concrets de maîtrise

Plusieurs leviers permettent de maîtriser ce coût sans sacrifier la qualité du résultat final. Cadrer les instructions précisément, comme vu en section 2, évite les allers-retours inutiles : une instruction floue coûte cher en itérations, puisque l'agent doit deviner, se tromper, puis recommencer. Découper les grosses tâches en étapes vérifiables plutôt que de tout demander d'un coup évite d'avoir à tout recommencer en cas d'erreur détectée tardivement. Réserver les tâches les plus lourdes (recherche extensive, génération de gros volumes de contenu) aux moments où elles sont réellement nécessaires évite de gaspiller de la capacité sur des besoins qui pourraient être traités plus simplement.

### Exemple concret

Demander à l'agent de régénérer entièrement les 7 sections d'un module parce qu'un seul paragraphe est mal formulé coûte inutilement cher en itérations et en temps. Cibler précisément le paragraphe à corriger, exactement comme fait pour `04-quotidien.md` dans ce workspace, donne le même résultat final pour une fraction du coût.

### Pourquoi ça compte particulièrement pour une activité facturée

Pour un cabinet de conseil ou toute activité facturée à des clients, cette maîtrise des coûts fait directement partie du calcul de rentabilité d'un projet, au même titre que le temps humain passé. Un produit livré vite mais avec un usage d'IA mal maîtrisé peut manger une marge qui semblait pourtant confortable au moment du devis. C'est une compétence de gestion, pas seulement une compétence technique.

**Points clés**
- Le coût d'usage doit entrer dans le calcul de rentabilité d'un projet client, pas être ignoré
- Un cadrage précis réduit fortement les itérations coûteuses
- Découper les tâches limite le risque de devoir tout recommencer après une erreur tardive

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
- Q3 : commande = séquence d'actions précise et toujours identique, skill = savoir-faire plus large, avec jugement contextuel, parfois auto-déclenché
- Q4 : connecter Claude Code à des services externes (Notion, Canva...) pour agir directement dedans, exemple : agent qui écrit dans Notion et attache une image Canva
- Q5 : forcer une vérification avant chaque commit, empêcher une action dans un dossier sensible
- Q6/Q7/Q8 : pas de réponse unique, évaluer la pertinence et la clarté du raisonnement
