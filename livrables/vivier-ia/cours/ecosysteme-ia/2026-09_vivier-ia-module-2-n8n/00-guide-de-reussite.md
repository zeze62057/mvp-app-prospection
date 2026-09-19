# Fiche pratique — Réussir le Module 2

> Ce n'est pas un résumé du cours, c'est un chemin. Les 7 sections du module contiennent la théorie et les questions de compréhension. Cette fiche dit dans quel ordre les pratiquer, avec quoi, et à quel signal concret on sait qu'on peut passer à la suite. Prérequis : avoir pratiqué le Module 1, au moins le gabarit à 4 éléments et le cycle Plan/Execute/Validate, ce module s'appuie dessus en continu.

## Le piège à éviter avant de commencer

Le même piège que le Module 1 : lire les 7 sections d'une traite, trouver ça clair, et penser que c'est acquis. n8n se comprend en construisant de vrais workflows qui s'exécutent réellement, pas en lisant la description d'un nœud. Chaque étape ci-dessous a une action concrète associée, pas seulement une lecture.

---

## Étape 1 — Découvrir n8n (section 1)

**À lire** : les 6 chapitres, en entier une seule fois.

**À faire, pas seulement lire** :
- Installer n8n : n8n Cloud (compte sur n8n.io) ou en local avec `npx n8n` (voir chapitre 1)
- Créer au moins une credential, même simple (chapitre 2)
- Tester un Webhook avec la commande curl du chapitre 3, et observer la donnée reçue directement dans l'éditeur
- Construire un premier mini-workflow à 3 étapes (déclencheur, un nœud qui transforme la donnée, une sortie), sur l'exemple Chatllow du chapitre 1 ou sur un besoin perso

**Signal de passage à l'étape suivante** : tu as une instance n8n qui tourne, une credential créée par toi, et un workflow simple qui s'exécute avec un résultat que tu as observé, pas juste lu en théorie.

---

## Étape 2 — n8n avancé (section 2)

**À lire** : les 6 chapitres.

**À faire** : utiliser [02-n8n-avance-prompts.md](02-n8n-avance-prompts.md).
- Ajouter un nœud HTTP Request pointant vers `https://jsonplaceholder.typicode.com/users` ou `https://httpbin.org/post` (chapitre 1), l'exécuter, lire le résultat affiché
- Utiliser un nœud Set pour reformuler au moins un champ avec une expression `{{ }}` (chapitre 2)
- Mettre en place un Error Trigger dans un workflow séparé, et le relier comme "Error Workflow" d'un workflow de test (chapitre 5)

**Signal de passage** : un appel HTTP Request réussi affiché dans n8n, une expression Set qui fonctionne, et un Error Trigger réellement relié à un workflow (pas seulement décrit en théorie).

---

## Étape 3 — IA et agents IA dans n8n (section 3)

**À lire** : les 9 chapitres. C'est la section la plus dense du module, ne pas la survoler.

**À faire** : utiliser [03-ia-agents-n8n-prompts.md](03-ia-agents-n8n-prompts.md).
- Créer une credential IA (Claude ou OpenAI) ou installer Ollama en local (chapitre 2)
- Construire un nœud IA simple (un Basic LLM Chain par exemple, chapitre 5), avec un prompt utilisateur et un message système clairement distincts (chapitre 3)

**Signal de passage** : un nœud IA exécuté avec un vrai appel, dont la réponse change selon un message système que tu as toi-même écrit, pas un exemple copié du cours.

---

## Étape 4 — Construire un agent IA complet (section 4)

**À lire** : les 3 chapitres.

**À faire** : utiliser [04-agent-ia-complet-prompts.md](04-agent-ia-complet-prompts.md), en poursuivant l'agent de support Chatllow esquissé en section 3.
- Construire un agent routeur avec au moins 2 destinations distinctes (par exemple commercial / contact)
- Tester avec plusieurs messages formulés différemment (direct, vague, ambigu), et vérifier que chacun atterrit sur la bonne destination

**Signal de passage** : un agent routeur fonctionnel, testé avec au moins 3 messages différents dont un ambigu, avec le bon acheminement à chaque fois.

---

## Étape 5 — Déploiement et observabilité (section 5)

**À lire** : les 4 chapitres.

**À faire** :
- Installer Docker (chapitre 1)
- Si pas déjà fait, lire attentivement le retour d'expérience de Zézé sur l'installation via Hostinger (chapitre 1) : c'est la méthode la plus accessible pour un premier serveur n8n réel
- Exporter une sauvegarde des workflows et credentials en ligne de commande, `n8n export:workflow --all` et `n8n export:credentials --all` (chapitre 3)

**Signal de passage** : Docker installé et vérifié (`docker --version` répond), et un export de sauvegarde réellement produit sur le disque, pas juste la commande lue.

---

## Étape 6 — Projet complet (section 6)

**À lire** : les 3 chapitres.

**À faire** : utiliser [06-projet-complet-prompts.md](06-projet-complet-prompts.md).
- Choisir un vrai processus de ton activité (Chatllow ou Longrich) à automatiser
- Écrire son brief avec le gabarit à 4 éléments du Module 1 (chapitre 1)
- Construire le MVP en couvrant d'abord le chemin principal, et le tester avec des données réalistes et imparfaites, pas seulement le cas le plus propre (chapitre 2)

**Signal de passage** : un brief écrit sur un vrai besoin de ton activité, et un MVP qui fonctionne dessus, testé avec au moins un cas de donnée imparfaite.

---

## Étape 7 — Hacks et astuces n8n (bonus) (section 7)

**À lire** : les 3 chapitres, seulement une fois les étapes 1 à 6 pratiquées, pas avant. Ce sont des raffinements, pas des fondations.

**À faire** : pas d'action obligatoire ici, comme pour la section bonus du Module 1. C'est le moment de faire une première revue de sécurité sur ta propre instance : quelles credentials sont encore utilisées, quels workflows ne tournent plus (chapitre 2).

---

## Auto-évaluation de fin de module

Le module est réellement acquis, pas seulement lu, si tu peux répondre oui aux 5 points suivants :
1. Tu as une instance n8n qui tourne (locale ou en ligne), avec au moins un workflow réel construit par toi
2. Tu as testé un HTTP Request réel, une expression Set, et un Error Trigger réellement branché à un workflow
3. Tu as un nœud ou un agent IA qui répond à partir d'un message système que tu as toi-même écrit
4. Tu as un agent routeur testé avec plusieurs messages différents, avec le bon acheminement à chaque fois
5. Tu as un brief écrit avec le gabarit à 4 éléments sur un vrai besoin de ton activité, et un MVP qui fonctionne dessus

Si un de ces points est non, la bonne réaction n'est pas de continuer vers le module suivant, c'est de revenir à l'étape correspondante et de la pratiquer réellement avant d'avancer.

---

## Erreurs fréquentes à éviter

- **Configurer un HTTP Request à l'aveugle**, sans lire la documentation de l'API avant : ça produit des erreurs qui ressemblent à des bugs n8n alors que c'est une mauvaise lecture de la doc (section 2, chapitre 1)
- **Aller trop vite vers le nœud Code** avant d'essayer Set, IF, Merge : un workflow couvert de nœuds Code redevient aussi difficile à maintenir qu'un script traditionnel (section 1, chapitre 5)
- **Construire un agent IA généraliste qui fait tout**, plutôt que des agents spécialisés séparés : le message système grossit jusqu'à devenir contradictoire (section 4, chapitre 1)
- **Lire la section 7 (bonus) en premier par curiosité** : elle suppose les fondations acquises, elle crée de la confusion si elle est lue trop tôt
- **Pratiquer uniquement sur les prompts fournis** sans jamais les transposer sur un vrai besoin de Chatllow ou Longrich : l'étape 6 (projet complet) existe justement pour ça, ne pas la sauter
