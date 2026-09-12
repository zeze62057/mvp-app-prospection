# Section 5 — 🚀 Déploiement et observabilité

> Fiche pratique associée : [05-deploiement-observabilite-prompts.md](05-deploiement-observabilite-prompts.md).

## Chapitre 1 : Docker & environnement de production

### Pourquoi Docker pour héberger n8n soi-même

Docker encapsule n8n et ses dépendances dans un environnement reproductible, identique sur la machine de développement et sur le serveur de production. Sans cette reproductibilité, "ça marche chez moi mais pas en production" devient un risque réel, causé par une différence de version ou de configuration système entre les deux environnements.

### Ce qui change entre développement et production

En développement, une configuration permissive (pas de HTTPS, accès ouvert) accélère l'itération sans risque réel puisque rien de sensible n'y circule encore. En production, cette même permissivité devient une faille : HTTPS devient obligatoire, l'accès à l'interface n8n doit être restreint, et aucun secret ne doit vivre dans le code ou dans l'image Docker elle-même, seulement dans des variables d'environnement injectées au déploiement.

### Le principe à garder en tête

Le même principe que le Module 1 sur la différence entre prototyper et produire : un environnement de développement rapide à itérer et un environnement de production durci ne sont pas la même chose, et confondre les deux expose inutilement un système réel.

**Points clés**
- Docker rend l'environnement n8n reproductible entre développement et production
- Une configuration permissive en développement devient une faille si elle persiste en production
- Secrets et configuration sensible vivent dans des variables d'environnement, jamais dans le code ou l'image

---

## Chapitre 2 : Sécurité des données, monitoring & health checks

### Sécuriser une instance n8n auto-hébergée

Trois réflexes de base : HTTPS systématique (jamais de trafic en clair), un accès à l'interface n8n restreint (authentification forte, pas ouvert à tout le monde sur internet), et une attention particulière aux URLs de webhook, qui sont par nature publiques et doivent donc valider ce qu'elles reçoivent plutôt que de faire confiance à n'importe quelle requête entrante.

### Pourquoi le monitoring n'est pas optionnel

Le chapitre 5 de la section 2 a insisté sur les échecs silencieux au niveau d'un workflow. Le monitoring répond au même problème au niveau de l'instance entière : savoir si n8n tourne encore, si les workers traitent bien la file d'exécution, avant qu'un client ou un collègue ne le découvre par un automatisme qui ne s'est pas déclenché depuis des heures.

### Les health checks, un signal simple mais décisif

Un health check est une vérification automatique et régulière que l'instance répond correctement (souvent un simple appel HTTP qui doit renvoyer un statut "ok"). Relié à une alerte, il transforme une panne silencieuse en signal immédiat, exactement le rôle que joue un Error Trigger au niveau d'un workflow, mais à l'échelle de l'infrastructure entière.

**Points clés**
- HTTPS, accès restreint, validation des webhooks publics : les trois réflexes de sécurité de base
- Le monitoring répond, au niveau de l'instance, au même problème que l'Error Trigger au niveau d'un workflow
- Un health check relié à une alerte transforme une panne silencieuse en signal immédiat

---

## Chapitre 3 : Backups, snapshots & scalabilité (queues, multi-workers)

### Ce qu'il faut sauvegarder, pas seulement les workflows

Une sauvegarde complète couvre les workflows, mais aussi les credentials et les données d'exécution si elles doivent être conservées. Sauvegarder uniquement les workflows et perdre les credentials revient à devoir tout reconfigurer à la main après un incident, ce qui annule une grande partie de l'intérêt d'avoir une sauvegarde.

### Pourquoi une seule instance finit par ne plus suffire

Une instance n8n unique traite ses exécutions une à la fois (ou avec un parallélisme limité). Tant que le volume reste modeste, ça suffit largement. Passé un certain volume d'exécutions simultanées, les workflows commencent à s'accumuler en attente, avec un retard qui grandit au pire moment, typiquement un pic d'activité.

### Le mode queue et les workers multiples

Le mode "queue" sépare l'instance principale (qui reçoit les déclencheurs) des workers (qui exécutent réellement les workflows), avec une file d'attente entre les deux. Ajouter des workers permet de traiter plus d'exécutions en parallèle, sans changer la logique des workflows eux-mêmes. C'est un changement d'infrastructure, pas un changement de construction.

**Points clés**
- Une sauvegarde complète couvre workflows, credentials, et données d'exécution si nécessaire, pas seulement les workflows
- Une instance unique suffit tant que le volume reste modeste, mais finit par prendre du retard à un volume plus élevé
- Le mode queue avec plusieurs workers traite plus d'exécutions en parallèle, sans toucher à la logique des workflows

---

## Chapitre 4 : Booster les performances avec Redis

### Le rôle de Redis dans une architecture en mode queue

Redis sert d'intermédiaire entre l'instance principale et les workers en mode queue : c'est lui qui porte la file d'attente des exécutions à traiter, permettant à l'instance principale de continuer à recevoir des déclencheurs sans attendre que chaque exécution soit terminée.

### Ce que ça change concrètement

Sans Redis (mode simple, une seule instance), chaque déclenchement attend son tour derrière les précédents. Avec Redis et plusieurs workers, les déclenchements s'accumulent dans la file sans bloquer l'instance principale, et plusieurs workers les traitent en parallèle, ce qui réduit fortement le délai de traitement sous forte charge.

### Quand cette optimisation devient pertinente

Comme pour le mode queue en général, Redis n'apporte un bénéfice réel qu'à partir d'un volume d'exécutions qui justifie cette complexité supplémentaire. Mettre en place Redis et plusieurs workers pour un usage à faible volume ajoute de la complexité d'infrastructure sans bénéfice mesurable, l'inverse du principe de ne pas sur-construire vu en Module 1.

**Points clés**
- Redis porte la file d'attente des exécutions entre l'instance principale et les workers
- Il permet à l'instance principale de continuer à recevoir des déclenchements sans attendre la fin de chaque exécution
- Cette optimisation n'a de sens qu'à partir d'un volume réel qui la justifie, pas par anticipation d'un besoin hypothétique

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi une configuration permissive acceptable en développement devient-elle une faille en production ?
2. Qu'est-ce qu'un health check, et à quoi sert-il concrètement ?
3. Que doit couvrir une sauvegarde complète, au-delà des workflows eux-mêmes ?
4. Quel rôle joue Redis dans une architecture n8n en mode queue ?

### Réflexion
5. Une instance n8n tourne depuis 6 mois sans aucune sauvegarde configurée, et le serveur vient de tomber en panne. Quels éléments précis ont probablement été perdus ?
6. À quel signal concret saurais-tu qu'il est temps de passer en mode queue avec plusieurs workers, plutôt que de rester sur une instance unique ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : en production, des données et systèmes réels sont exposés, une permissivité sans risque en développement devient un vecteur d'attaque ou de fuite réelle
- Q2 : une vérification automatique et régulière que l'instance répond correctement, reliée à une alerte pour transformer une panne silencieuse en signal immédiat
- Q3 : les workflows, les credentials, et les données d'exécution si elles doivent être conservées
- Q4 : il porte la file d'attente des exécutions entre l'instance principale et les workers, permettant un traitement en parallèle sans bloquer la réception de nouveaux déclenchements
- Q5 : probablement les workflows eux-mêmes, les credentials (donc toutes les connexions à reconfigurer), et l'historique des exécutions passées
- Q6 : un retard visible et croissant dans le traitement des exécutions lors des pics d'activité, pas une anticipation théorique sans volume réel pour le justifier
