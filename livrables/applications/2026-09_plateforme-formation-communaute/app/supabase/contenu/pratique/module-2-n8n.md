@@ SECTION 11c9f4f0-428a-460e-a926-33bdc05ce4e9  Découvrir n8n

@@ CHAPITRE 1
### À faire maintenant : lancer n8n sur ton ordinateur

Pour apprendre et tester, sans rien payer. Il faut Node.js, déjà installé au Module 1. Dans un terminal :

```bash
npx n8n
```

Attends que le terminal affiche une adresse, puis ouvre-la dans ton navigateur :

```text
http://localhost:5678
```

Tu dois voir l'écran de création de compte de n8n. Cette version locale sert à apprendre, pas à travailler avec de vrais clients.

Pour lire un workflow sans le construire, demande de l'aide :

```prompt
Explique-moi ce workflow n8n comme à un débutant : quel est son déclencheur, quelles transformations il fait sur la donnée, et quelle est sa sortie. Voici sa description : [décris ou colle le workflow].
```

@@ CHAPITRE 2
### À faire maintenant : bien nommer et cadrer tes credentials

```prompt
Je vais créer des credentials dans n8n pour ces services : [liste des services].
Pour chacun, propose : 1) un nom clair (service + usage), 2) les permissions minimales à demander, 3) ce que je dois faire pour la supprimer proprement si je n'en ai plus besoin. N'écris et ne demande aucune clé secrète : je les colle moi-même dans n8n.
```

Tu dois recevoir une liste de noms et de permissions. Colle toi-même les clés dans n8n, jamais dans le chat.

@@ CHAPITRE 3
### À faire maintenant : tester un Webhook et planifier une exécution

Dans n8n, ajoute un nœud Webhook et clique sur « Listen for test event ». Puis, dans un terminal, envoie une requête de test. Remplace `<url-du-webhook>` par l'adresse de test affichée :

```bash
curl -X POST <url-du-webhook> -H "Content-Type: application/json" -d "{\"nom\": \"Test\"}"
```

n8n doit afficher la donnée reçue dans l'éditeur.

Pour planifier une exécution avec une expression cron, par exemple chaque lundi à 9 h :

```text
0 9 * * 1
```

Pour t'aider à choisir un trigger :

```prompt
Je veux automatiser : [décris le processus].
Quel trigger n8n correspond à l'événement réel (Webhook, Schedule, App Trigger ou Manual) ? Explique ton choix en deux phrases et dis pourquoi les trois autres conviennent moins.
```

@@ CHAPITRE 5
### À faire maintenant : choisir les bons nœuds

```prompt
Mon automatisation : [décris-la].
Liste les nœuds n8n dont j'ai besoin, dans l'ordre, parmi HTTP Request, Set, IF, Merge et NoOp. Pour chaque nœud, dis ce qu'il fait ici en une phrase. Dis aussi si le nœud Code est vraiment nécessaire : propose d'abord une solution sans code.
```

Tu dois recevoir une suite de nœuds, avec une solution sans code quand c'est possible.

@@ CHAPITRE 6
### À faire maintenant : appliquer les bons réflexes

```prompt
Voici mon workflow n8n : [décris les nœuds dans l'ordre].
Propose : 1) un nom clair pour chaque nœud (ce qu'il fait), 2) des données de test réalistes à épingler (pin data), sans aucune vraie donnée client, 3) le texte d'une note autocollante qui documente le workflow : à quoi il sert, ce qu'il déclenche, ce qu'il ne faut pas toucher.
```

Tu dois recevoir des noms, des données fictives et une note prête à coller dans n8n.

@@ SECTION 599598eb-7048-4b2b-9011-72a33e20a136  n8n avancé

@@ CHAPITRE 1
### À faire maintenant : ton premier appel d'API

Ajoute un nœud **HTTP Request**, méthode **GET**, et colle cette adresse. Elle renvoie une liste de faux utilisateurs :

```text
https://jsonplaceholder.typicode.com/users
```

Exécute le nœud : la liste s'affiche dans n8n. Pour vérifier un corps de requête, utilise ce service qui renvoie ce qu'on lui envoie :

```text
https://httpbin.org/post
```

Pour une vraie API, fais d'abord lire la documentation :

```prompt
Je veux appeler l'API de [service]. Lis la documentation officielle et dis-moi : l'adresse à appeler, la méthode, l'authentification demandée, les paramètres obligatoires, et comment la pagination fonctionne. N'invente rien : si une information n'est pas dans la documentation, dis-le.
```

@@ CHAPITRE 2
### À faire maintenant : façonner tes données

```prompt
J'ai ces données en entrée dans n8n : [colle un exemple fictif].
Je veux obtenir : [décris le résultat voulu]. Propose la configuration du nœud Set (Edit Fields) champ par champ, avec les expressions {{ }} nécessaires. N'utilise le nœud Code que si c'est impossible autrement.
```

Tu dois recevoir une liste de champs avec leurs expressions, à recopier dans le nœud.

@@ CHAPITRE 3
### À faire maintenant : retrouver un fichier perdu

```prompt
Dans mon workflow n8n, un fichier (donnée binaire) disparaît ou n'est pas trouvé après le nœud [nom du nœud]. Voici l'enchaînement des nœuds : [décris-le].
Vérifie dans cet ordre : 1) le nom de la propriété binaire, 2) un nœud Merge qui perd le binaire, 3) un nœud qui ne transmet que le JSON. Dis-moi lequel est le plus probable et comment le corriger.
```

@@ CHAPITRE 4
### À faire maintenant : extraire un sous-workflow

```prompt
Dans mes workflows n8n, je répète cette logique : [décris-la].
Propose un sous-workflow : 1) un nom qui commence par un verbe, 2) les entrées typées qu'il reçoit, 3) ce qu'il renvoie, 4) le mode d'exécution à choisir, « each » ou « all », et pourquoi.
```

@@ CHAPITRE 5
### À faire maintenant : ne plus rater une erreur

Dans n8n :
1. Crée un workflow séparé nommé `Alertes erreurs`.
2. Ajoute-y un nœud **Error Trigger**, suivi d'un email ou d'un message Slack.
3. Dans le workflow à surveiller, ouvre « Settings » et choisis `Alertes erreurs` dans « Error Workflow ».

Puis rédige le message d'alerte :

```prompt
Écris le message d'alerte d'un workflow d'erreurs n8n. Il doit dire : quel workflow a échoué, à quelle heure, quel nœud a échoué, et le message d'erreur. Donne-moi le texte avec les expressions {{ }} de n8n à utiliser pour chaque information.
```

@@ CHAPITRE 6
### À faire maintenant : atelier des demandes commerciales

```prompt
Conçois le workflow n8n qui traite les demandes commerciales entrantes. Le déroulé : un trigger, la normalisation des données, la qualification (chaud, tiède, froid), le routage vers la bonne personne, et la gestion d'erreur avec un Error Trigger. Pour chaque étape, donne le nœud à utiliser et sa configuration. Propose les critères de qualification en précisant qu'ils seront à ajuster après les premières semaines.
```

Tu dois recevoir un workflow étape par étape, avec les critères de qualification.

@@ SECTION 9c9fda01-544e-40af-877c-c4453b9a4794  IA et agents IA dans n8n

@@ CHAPITRE 2
### À faire maintenant : brancher un modèle d'IA

**Un modèle cloud.** Crée une clé API sur le site du fournisseur, puis colle-la **toi-même** dans n8n : menu « Credentials », « Add Credential », choisis Anthropic ou OpenAI. Ne colle jamais la clé dans le chat.

**Un modèle local avec Ollama.** Après avoir installé Ollama (ollama.com), télécharge un modèle :

```bash
ollama pull llama3
```

Dans n8n, le nœud Ollama se connecte par défaut à cette adresse :

```text
http://localhost:11434
```

Change-la si Ollama tourne sur une autre machine que n8n.

Pour choisir entre cloud et local :

```prompt
Mon cas : [décris l'usage]. Mes contraintes : sensibilité des données [faible/moyenne/forte], volume [par jour], budget [montant], rapidité attendue [secondes].
Recommande cloud, local, ou un mélange, en trois lignes. Dis ce que je dois vérifier dans les conditions du fournisseur avant de lui envoyer des données.
```

@@ CHAPITRE 3
### À faire maintenant : écrire un message système

Copie ce modèle et remplis-le. Il se colle dans le champ « message système » d'un nœud IA.

```text
Rôle : tu es [rôle précis, par exemple assistant de qualification des demandes commerciales].

Ce que tu fais : [la tâche, en une ou deux phrases].

Format de sortie : réponds uniquement avec [le format exact, par exemple un JSON avec les champs « niveau » et « raison »].

Si tu n'es pas sûr : dis-le clairement. N'invente jamais une information. Si la demande sort de ton rôle, réponds « hors périmètre ».
```

Pour le faire améliorer :

```prompt
Voici mon message système n8n : [colle-le]. Relis-le : le rôle est-il clair, le format de sortie est-il précis, la conduite en cas d'incertitude est-elle écrite ? Propose une version améliorée, sans l'allonger inutilement.
```

@@ CHAPITRE 5
### À faire maintenant : choisir un nœud spécialisé

```prompt
Ma tâche récurrente : [décris-la].
Dis-moi quel nœud IA n8n convient le mieux : Basic LLM Chain, Text Classifier, Information Extractor ou Summarization Chain. Explique en deux phrases pourquoi un agent complet serait ici inutile, ou dans quel cas il deviendrait nécessaire.
```

@@ CHAPITRE 6
### À faire maintenant : concevoir un agent de support

```prompt
Conçois un agent IA de support client dans n8n pour [activité]. Décris : 1) le modèle et son message système, 2) la mémoire, en précisant qu'elle est limitée à chaque session pour ne jamais mélanger deux conversations, 3) les tools dont il a besoin, 4) quand il passe la main à un humain. Ne construis rien : donne-moi le plan à valider.
```

@@ CHAPITRE 7
### À faire maintenant : décrire un tool pour un agent

L'agent choisit un tool d'après son nom et sa description. Copie ce modèle :

```text
Nom : [verbe + objet, par exemple chercher_commande]

Description : utilise ce tool quand [situation précise]. Il reçoit [les informations attendues]. Il renvoie [ce qu'il rend]. Ne l'utilise pas pour [cas à exclure].
```

Pour contrôler tes tools :

```prompt
Voici les tools de mon agent n8n avec leurs descriptions : [colle-les]. Y en a-t-il qui se ressemblent, qui sont vagues, ou en trop ? Propose une version plus courte et plus précise.
```

@@ CHAPITRE 8
### À faire maintenant : lancer une base vectorielle pour ton RAG

Pour tester en local, il faut Docker. Lance Qdrant :

```bash
docker run -p 6333:6333 qdrant/qdrant
```

Il est ensuite accessible à cette adresse :

```text
http://localhost:6333
```

Pour préparer ton RAG :

```prompt
Je construis un RAG avec n8n sur ces documents : [décris-les]. Propose : 1) comment découper les documents en morceaux en respectant leurs limites naturelles (titres, paragraphes), 2) la taille de morceau à tester au départ, 3) cinq questions de test dont je connais la réponse pour vérifier la qualité.
```

@@ SECTION 71d1da32-b9e3-4f5b-84ca-2b9bb069e0a3  Construire un agent IA complet

@@ CHAPITRE 1
### À faire maintenant : découper en agents spécialisés

```prompt
Mon système d'agents doit gérer : [décris les demandes à traiter].
Découpe-le en agents spécialisés. Pour chacun : sa mission unique, son message système en trois phrases, et ce qu'il ne doit jamais faire. Puis écris les règles communes à tous : le ton, quand passer la main à un humain, le format des réponses.
```

Tu dois recevoir une équipe d'agents avec des règles communes écrites noir sur blanc.

@@ CHAPITRE 2
### À faire maintenant : écrire le message système du routeur

Copie ce modèle :

```text
Tu es un routeur. Tu ne traites jamais la demande toi-même.
Lis le message reçu et réponds uniquement par l'un de ces mots :
- COMMERCIAL : demande de devis, de prix ou d'offre
- CONTACT : demande d'information générale ou de coordonnées
- RDV : demande de rendez-vous
- AUTRE : tout le reste
Si tu hésites, réponds AUTRE.
```

Adapte les trois destinations à ton projet, puis teste :

```prompt
Voici le message système de mon routeur : [colle-le]. Invente dix messages clients variés, dont trois ambigus et deux hors sujet. Dis vers quelle destination chacun serait envoyé et signale les cas où le routeur risque de se tromper.
```

@@ CHAPITRE 3
### À faire maintenant : valider l'assemblage

```prompt
Prépare un plan de test pour mon système multi-agents. Propose vingt messages réalistes et variés (formulations différentes, fautes, messages courts, messages ambigus). Pour chacun, indique le résultat attendu. Ajoute ensuite la checklist de livraison : fonctionnement, sécurité, transmission au client.
```

Tu dois recevoir une grille de test à dérouler message par message.

@@ SECTION 9fa0470c-fc31-4c92-89bd-8cc55b8b70c3  Déploiement et observabilité

@@ CHAPITRE 1
### À faire maintenant : installer Docker

Sous Windows et Mac, télécharge Docker Desktop sur docker.com et installe-le comme une application normale. Sous Linux, le script d'installation officiel :

```bash
curl -fsSL https://get.docker.com | sh
```

Vérifie ensuite que Docker répond :

```bash
docker --version
```

Pour préparer un déploiement de production, demande-le explicitement :

```prompt
Je veux déployer n8n en production sur un VPS avec Docker. Donne-moi la checklist complète étape par étape : Docker Compose, HTTPS automatique, variables d'environnement pour les secrets, accès restreint. Ne laisse aucune configuration permissive de développement. Avance une étape à la fois et attends mon accord.
```

@@ CHAPITRE 2
### À faire maintenant : sécuriser et surveiller

```prompt
Audite la sécurité de mon instance n8n auto-hébergée. Vérifie : HTTPS actif, accès restreint (qui peut ouvrir l'interface), webhooks publics validés, secrets hors du code. Puis propose un health check simple relié à une alerte, pour être prévenu immédiatement en cas de panne. Donne-moi la liste de ce que je dois vérifier moi-même, point par point.
```

@@ CHAPITRE 3
### À faire maintenant : sauvegarder ton n8n

Ces commandes s'exécutent depuis l'instance n8n elle-même :

```bash
n8n export:workflow --all --output=backup-workflows.json
n8n export:credentials --all --output=backup-credentials.json
```

Attention : le fichier des credentials contient tes accès. Garde-le dans un stockage privé, **hors du serveur n8n**, et ne le mets jamais sur GitHub ni dans un chat.

Pour planifier la sauvegarde :

```prompt
Propose une routine de sauvegarde pour mon n8n : ce qu'il faut sauvegarder (workflows, credentials, données d'exécution si nécessaire), à quelle fréquence, où stocker les copies, et comment tester une restauration. N'écris aucun mot de passe dans la réponse.
```

@@ CHAPITRE 4
### À faire maintenant : essayer Redis en local

Pour tester rapidement Redis avant de l'intégrer à ton fichier `docker-compose.yml` :

```bash
docker run -p 6379:6379 redis
```

En production, Redis rejoint le même `docker-compose.yml` que n8n et ses workers.

```prompt
Mon n8n traite environ [nombre] exécutions par jour. Dis-moi honnêtement si le mode queue avec Redis et plusieurs workers est justifié maintenant, ou s'il vaut mieux attendre. Donne les chiffres qui devraient me faire changer d'avis.
```

@@ SECTION adfd2908-a9bc-4038-a315-c1ee937be410  Projet complet

@@ CHAPITRE 1
### À faire maintenant : écrire ton brief

```prompt
Contexte : [ton activité et le processus candidat].
Objectif : à la fin, ceci doit être vrai : [résultat mesurable].
Périmètre : ce qui est inclus : [liste]. Ce qui reste hors périmètre : [liste].
Autonomie : propose-moi le plan et attends mon accord avant de construire.

Aide-moi à choisir le bon processus à automatiser en premier : récurrent, chronophage, à faible risque d'erreur. Compare mes candidats et recommande-en un. Puis écris le brief complet.
```

Tu dois recevoir un processus recommandé et un brief à valider.

@@ CHAPITRE 2
### À faire maintenant : construire le MVP

```prompt
Mon brief : [colle le brief].
Construis d'abord le chemin principal seulement, sans les cas particuliers. Dis-moi comment les données existantes entrent dans le système : import ponctuel ou flux continu. Prépare dix jeux de données de test réalistes et imparfaits (champ manquant, doublon, faute de frappe), sans aucune vraie donnée client.
```

@@ CHAPITRE 3
### À faire maintenant : livrer l'agent de bout en bout

```prompt
Assemble les briques de mon projet en un agent automatisé de bout en bout. Puis passe la checklist de livraison : fonctionnement testé sur des cas variés, sécurité (aucun secret exposé, accès limités), transmission au client (documentation, accès, contact). Réponds par « fait », « à faire » ou « non vérifié » à chaque point, et propose comment documenter le projet pour qu'il devienne un starter.
```

@@ SECTION 244dab35-ef6a-4b5f-876b-2d1029b989a7  Hacks et astuces n8n (bonus)

@@ CHAPITRE 1
### À faire maintenant : mettre à jour sans casser

```prompt
Je dois mettre à jour n8n. Écris la procédure : 1) sauvegarder les workflows et les credentials, 2) tester la mise à jour sur une autre instance que la production, 3) vérifier les workflows critiques après la mise à jour, 4) comment revenir en arrière si quelque chose casse. Ajoute une proposition de dossiers et de tags pour ranger mes workflows, et la liste de ceux à archiver.
```

@@ CHAPITRE 2
### À faire maintenant : faire la revue périodique

```prompt
Prépare ma checklist de revue mensuelle de n8n : credentials inutilisées ou trop larges, workflows inactifs à désactiver ou archiver, erreurs récurrentes, workflows qui ont cessé de fonctionner sans bruit. Pour chaque point, dis où regarder dans n8n et ce qui doit m'alerter.
```

@@ CHAPITRE 3
### À faire maintenant : inspecter un template avant de l'utiliser

```prompt
J'ai trouvé ce template n8n dans la communauté : [colle son contenu ou sa description].
Avant que je l'importe, inspecte-le : quels nœuds il contient, quelles credentials et quelles permissions il demande, s'il appelle des adresses externes, et ce qui est plus large que nécessaire. Dis-moi s'il est sûr de l'importer et ce que je dois retirer.
```
