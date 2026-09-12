# Section 1 — 🔍 Découvrir n8n

## Chapitre 1 : Découverte de n8n

### Ce que n8n fait réellement

n8n est un outil d'automatisation visuel : on construit un "workflow" en reliant des nœuds entre eux sur un canevas, plutôt qu'en écrivant du code ligne par ligne. Chaque nœud fait une chose précise (envoyer un email, lire une ligne de tableur, appeler une API), et les flèches entre les nœuds représentent le chemin que suit la donnée, d'une étape à l'autre.

### Où n8n se situe par rapport à Claude Code

Le Module 1 a posé la distinction : Claude Code construit le produit (l'interface, la logique métier, la base de données), n8n orchestre les automatisations et les connexions entre systèmes externes. Ce n'est pas un outil concurrent de Claude Code, c'est un outil complémentaire, pertinent quand le besoin est précisément de l'orchestration visuelle entre plusieurs services, pas de la construction d'un produit.

### Pourquoi n8n plutôt qu'un autre outil d'automatisation

Des outils comme Zapier ou Make font un travail proche, mais deux différences comptent pour toi. D'abord, n8n peut s'auto-héberger : au-delà d'un certain volume d'exécutions, ça devient nettement moins cher qu'un abonnement mensuel par tâche. Ensuite, n8n laisse la possibilité d'écrire du code personnalisé (nœud Code) quand la logique devient trop spécifique pour les nœuds visuels standards, ce qu'un outil plus fermé ne permet pas aussi facilement.

### L'anatomie d'un workflow

Un workflow n8n a toujours la même structure logique : un déclencheur (ce qui démarre le workflow), une série de nœuds qui transforment ou transportent la donnée, et éventuellement une ou plusieurs sorties (une action finale, un résultat stocké). Comprendre un workflow déjà construit, c'est d'abord repérer ce triptyque avant de s'attarder sur le détail de chaque nœud.

**Points clés**
- n8n construit des automatisations visuelles, Claude Code construit le produit : les deux sont complémentaires, pas concurrents
- L'auto-hébergement et le nœud Code sont les deux avantages qui distinguent n8n d'un outil plus fermé comme Zapier
- Tout workflow se lit comme : déclencheur, puis transformation de la donnée, puis sortie

---

## Chapitre 2 : Credentials & connexions

### Ce qu'est une credential

Une credential est un identifiant stocké de façon sécurisée dans n8n (une clé d'API, un jeton OAuth, un mot de passe) qui permet à un nœud de se connecter à un service externe sans que cet identifiant soit réécrit à chaque fois. Une fois créée, une credential se réutilise dans n'importe quel workflow qui a besoin du même service.

### Pourquoi centraliser plutôt que copier-coller une clé partout

Centraliser une credential évite deux problèmes concrets. D'abord, si la clé change (renouvellement, révocation), elle se met à jour à un seul endroit plutôt que dans dix workflows différents. Ensuite, ça évite qu'une clé sensible se retrouve copiée en clair dans un nœud Code ou une note, où elle serait bien plus exposée qu'à l'intérieur du système de credentials dédié.

### Le même principe de vigilance que pour MCP

Le Module 1 a insisté sur la vigilance nécessaire avec MCP : plus on connecte d'outils externes, plus il faut être rigoureux sur ce qu'on autorise. La credential n8n est l'équivalent côté automatisation. Une credential mal scopée (qui donne accès à plus que nécessaire) est un risque silencieux : elle fonctionne très bien au quotidien, jusqu'au jour où un workflow mal conçu l'utilise pour faire quelque chose qu'on n'avait pas anticipé.

### Bonnes pratiques à installer dès le départ

Nommer chaque credential de façon explicite (le service et l'usage, pas juste "API Key 1"), limiter les permissions accordées au strict nécessaire quand le service le permet, et supprimer une credential dès qu'elle n'est plus utilisée par aucun workflow actif, plutôt que de la laisser traîner indéfiniment.

**Points clés**
- Une credential centralise un identifiant de connexion, réutilisable dans plusieurs workflows
- Centraliser évite la duplication d'une clé sensible et simplifie sa mise à jour
- Même vigilance que pour MCP : limiter les permissions au strict nécessaire, nommer clairement, nettoyer ce qui n'est plus utilisé

---

## Chapitre 3 : Les Triggers

### Le trigger, point de départ obligatoire

Tout workflow n8n commence par un trigger : le nœud qui répond à la question "qu'est-ce qui déclenche cette automatisation dans le monde réel ?". Sans trigger clairement identifié, un workflow n'est qu'une suite d'étapes sans raison de s'exécuter.

### Les familles de triggers courantes

**Webhook** : le workflow se déclenche quand une requête HTTP arrive à une URL précise, typiquement depuis un formulaire, une autre application, ou un service tiers qui notifie un événement. **Schedule** : le workflow se déclenche à intervalle régulier (toutes les heures, chaque lundi à 9h), utile pour des tâches récurrentes de vérification ou de synchronisation. **App Trigger** : certains services (Google Sheets, Notion, Gmail) ont leur propre nœud de déclenchement, qui surveille un événement précis dans cette app (une nouvelle ligne, un nouvel email). **Manual** : déclenchement à la main, utile uniquement en phase de test, jamais en production.

### Choisir le bon trigger, pas le plus pratique à configurer

Le réflexe à éviter : choisir un trigger parce qu'il est facile à mettre en place, plutôt que parce qu'il correspond réellement à l'événement déclencheur du besoin. Un Schedule toutes les 5 minutes pour simuler une réaction "en temps réel" à un webhook qu'on n'a pas pris le temps de configurer correctement est un choix qui coûte cher en complexité cachée (latence, appels inutiles) sur la durée.

**Points clés**
- Un workflow sans trigger clair n'a pas de raison de s'exécuter
- Webhook, Schedule, App Trigger, Manual : quatre familles à connaître, chacune pour un usage différent
- Choisir le trigger qui correspond réellement à l'événement, pas celui qui est le plus simple à configurer dans l'immédiat

---

## Chapitre 4 : Logique & types de nœuds

### Deux grandes familles de nœuds

Un nœud d'**action** fait quelque chose dans le monde réel ou dans un service externe : envoyer un email, créer une ligne dans une base, appeler une API. Un nœud de **logique** ne touche à rien à l'extérieur, il oriente ou transforme le flux de données à l'intérieur du workflow : IF (une branche selon une condition), Switch (plusieurs branches possibles), Merge (fusionner deux flux), Filter (ne garder que certains éléments).

### Comment circule la donnée entre les nœuds

Chaque nœud reçoit une liste d'éléments ("items") en entrée, et produit une liste d'éléments en sortie, qui devient l'entrée du nœud suivant. Comprendre un workflow qui ne fonctionne pas comme prévu commence presque toujours par regarder ce qui circule réellement entre deux nœuds précis, pas en relisant toute la logique d'un coup.

### Pourquoi la distinction action/logique aide à lire un workflow inconnu

Face à un workflow déjà construit par quelqu'un d'autre (ou par soi-même plusieurs mois plus tôt), repérer d'abord les nœuds d'action donne la liste des effets réels du workflow. Repérer ensuite les nœuds de logique donne les conditions dans lesquelles ces effets se produisent. Cette lecture en deux temps est plus rapide que d'essayer de tout comprendre nœud par nœud dans l'ordre.

**Points clés**
- Nœud d'action : un effet réel à l'extérieur. Nœud de logique : une orientation du flux de données, sans effet extérieur
- La donnée circule en liste d'éléments, d'un nœud à l'autre
- Lire un workflow inconnu : d'abord les actions (les effets), puis la logique (les conditions de ces effets)

---

## Chapitre 5 : Les nœuds clés

### Une poignée de nœuds couvre la majorité des besoins

Il n'est pas nécessaire de connaître les centaines de nœuds disponibles dans n8n pour être opérationnel. Une poignée de nœuds génériques couvre la grande majorité des besoins de départ, avant même de toucher aux nœuds spécifiques à chaque service.

### Les nœuds à connaître en priorité

**HTTP Request** : appelle n'importe quelle API externe, même sans nœud dédié pour ce service précis, c'est souvent le nœud le plus universel de tous. **Set** (ou Edit Fields) : façonne les données, renomme ou recalcule des champs, avant de les transmettre à l'étape suivante. **Code** : pour une logique trop spécifique pour les nœuds visuels, en JavaScript ou Python, une échappatoire à garder pour les cas qui le justifient vraiment, pas un réflexe par défaut. **IF** et **Merge** : déjà vus au chapitre précédent, omniprésents dans presque tout workflow un peu élaboré. **NoOp** (No Operation) : un nœud qui ne fait rien, utile pour organiser visuellement un workflow complexe ou marquer un point de passage.

### Le risque d'aller trop vite vers le nœud Code

Un nœud Code résout presque tout, ce qui en fait une tentation constante. Le réflexe à garder : essayer d'abord la solution avec les nœuds visuels standards (Set, IF, Merge), et ne passer au Code que quand c'est réellement la solution la plus simple. Un workflow couvert de nœuds Code redevient aussi difficile à maintenir qu'un script traditionnel, ce qui annule une partie de l'intérêt de n8n.

**Points clés**
- HTTP Request, Set, Code, IF, Merge, NoOp : les nœuds à connaître avant tous les autres
- HTTP Request permet de se connecter à n'importe quelle API, même sans nœud dédié
- Le nœud Code est une échappatoire à garder pour les cas qui le justifient, pas un réflexe par défaut

---

## Chapitre 6 : Les bons réflexes

### Tester nœud par nœud, pas le workflow entier d'un coup

Le même principe que le cycle Plan, Execute, Validate du Module 1 s'applique ici directement : exécuter un nœud à la fois et vérifier son résultat avant d'enchaîner le suivant, plutôt que de construire tout le workflow puis découvrir en une seule fois où ça casse.

### Nommer ses nœuds, pas garder les noms par défaut

Un workflow avec cinq nœuds nommés "Set", "Set1", "Set2", "IF", "IF1" devient illisible en quelques semaines, même pour celui qui l'a construit. Renommer chaque nœud selon ce qu'il fait réellement ("Formater le nom du prospect", "Vérifier si email valide") coûte quelques secondes et change complètement la vitesse à laquelle on comprend le workflow plus tard.

### Épingler des données de test (pin data)

Plutôt que de redéclencher un vrai webhook ou une vraie donnée à chaque test, n8n permet d'épingler ("pin") un exemple de données sur un nœud, pour rejouer le reste du workflow sur ce même jeu de test de façon répétée. Ça évite de polluer un système réel (envoyer un vrai email de test cinquante fois) pendant la construction.

### Documenter avec des notes autocollantes

Les "sticky notes" de n8n permettent d'annoter directement le canevas : pourquoi telle branche existe, ce qu'un nœud particulier attend en entrée, un point d'attention pour la prochaine modification. Un workflow documenté se comprend sans avoir à rouvrir chaque nœud un par un, exactement le même rôle que joue un CLAUDE.md pour un projet Claude Code.

**Points clés**
- Tester nœud par nœud, comme le cycle Plan/Execute/Validate, plutôt que tout construire puis tout découvrir d'un coup
- Nommer chaque nœud selon ce qu'il fait, pas garder les noms par défaut
- Épingler des données de test pour ne pas polluer un système réel pendant la construction
- Documenter avec des sticky notes, le CLAUDE.md du workflow

---

## Questions pour les apprenants

### Compréhension
1. Quelle est la différence de rôle entre n8n et Claude Code, selon l'architecture vue en Module 1 ?
2. Pourquoi centraliser les credentials plutôt que de ressaisir une clé dans chaque workflow ?
3. Cite les 4 familles de triggers et donne un exemple d'usage pour chacune.
4. Quelle est la différence entre un nœud d'action et un nœud de logique ?
5. Pourquoi éviter de passer trop vite au nœud Code ?

### Réflexion
6. Un apprenant construit un workflow entier avant de tester le moindre nœud, et découvre une erreur à la toute fin. Quel principe du chapitre 6 aurait évité cette situation ?
7. Imagine un besoin d'automatisation pour Chatllow ou pour Longrich : quel serait le trigger le plus adapté, et pourquoi ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : n8n orchestre les automatisations et connexions externes, Claude Code construit le produit (interface, logique, données)
- Q2 : évite la duplication d'une clé sensible, simplifie sa mise à jour, réduit le risque d'exposition
- Q3 : Webhook (réception HTTP depuis un service tiers), Schedule (tâche récurrente), App Trigger (événement dans une app précise), Manual (test uniquement)
- Q4 : nœud d'action = effet réel à l'extérieur, nœud de logique = oriente ou transforme le flux de données sans effet extérieur
- Q5 : un workflow couvert de nœuds Code redevient difficile à maintenir, annule une partie de l'intérêt visuel de n8n
- Q6 : tester nœud par nœud plutôt que tout construire puis tout découvrir en une fois
- Q7 : pas de réponse unique, évaluer la cohérence entre l'événement réel déclencheur et le trigger choisi
