# Section 5 — 🚀 Déploiement et observabilité

> Fiche pratique associée : [05-deploiement-observabilite-prompts.md](05-deploiement-observabilite-prompts.md).

## Chapitre 1 : Docker & environnement de production

### Pourquoi Docker pour héberger n8n soi-même

Docker encapsule n8n et ses dépendances dans un environnement reproductible, identique sur la machine de développement et sur le serveur de production. Sans cette reproductibilité, "ça marche chez moi mais pas en production" devient un risque réel, causé par une différence de version ou de configuration système entre les deux environnements.

### Ce qui change entre développement et production

En développement, une configuration permissive (pas de HTTPS, accès ouvert) accélère l'itération sans risque réel puisque rien de sensible n'y circule encore. En production, cette même permissivité devient une faille : HTTPS devient obligatoire, l'accès à l'interface n8n doit être restreint, et aucun secret ne doit vivre dans le code ou dans l'image Docker elle-même, seulement dans des variables d'environnement injectées au déploiement.

### Le principe à garder en tête

Le même principe que le Module 1 sur la différence entre prototyper et produire : un environnement de développement rapide à itérer et un environnement de production durci ne sont pas la même chose, et confondre les deux expose inutilement un système réel.

### Installation pratique

**Installer Docker**
- Windows et Mac : télécharge Docker Desktop sur docker.com, installe comme une application classique.
- Linux : `curl -fsSL https://get.docker.com | sh` (script d'installation officiel), ou le gestionnaire de paquets de la distribution utilisée.

**Aller plus loin : déployer n8n en production sur un serveur**
La mise en place complète (Docker Compose, HTTPS automatique via un reverse proxy, mode queue avec plusieurs workers si le volume le justifie) est un sujet à part entière, au-delà de ce chapitre d'introduction. Un guide pas à pas existe pour déployer n8n proprement sur un VPS (OVH ou équivalent), demande-le explicitement le moment venu plutôt que d'improviser une configuration de production sans checklist.

### La méthode Hostinger, retour d'expérience de Zézé

Voici comment Zézé a lui-même installé son premier serveur n8n, chez l'hébergeur Hostinger, sans passer par une configuration Docker manuelle :

1. **Créer un VPS chez Hostinger.** Choisir une offre VPS (serveur privé virtuel), pas un hébergement mutualisé classique : n8n a besoin de tourner en continu comme une application, ce qu'un hébergement mutualisé ne permet pas.
2. **Utiliser l'installateur en un clic.** Hostinger propose, dans son catalogue d'applications pour VPS, une installation automatique de n8n : Docker et n8n sont alors installés et configurés à la place de l'apprenant, sans ligne de commande à taper. C'est le chemin le plus rapide pour un premier serveur, au prix de moins de contrôle fin sur la configuration que la méthode Docker Compose manuelle vue plus haut.
3. **Accéder à l'instance.** Une fois l'installation terminée, n8n est accessible via l'adresse IP du VPS (généralement suivie d'un numéro de port), avant même qu'un nom de domaine soit connecté.
4. **Connecter un nom de domaine et activer le HTTPS** (étape que Zézé n'a pas encore faite au moment de la rédaction de ce chapitre, mais qui reste la suite logique) : dans le gestionnaire DNS du domaine, créer un enregistrement de type A qui pointe vers l'adresse IP du VPS, puis, une fois la propagation DNS effective, utiliser le nom de domaine plutôt que l'IP pour accéder à n8n. Un certificat HTTPS peut ensuite être activé, soit via un outil intégré à Hostinger s'il en propose un pour les VPS, soit avec un reverse proxy comme Caddy (qui gère le HTTPS automatiquement). Après ce changement, penser à mettre à jour les variables d'environnement de n8n concernées (l'URL de base de l'éditeur et l'URL des webhooks), sans quoi les webhooks continuent de pointer vers l'ancienne adresse IP.

**Points de vigilance pour un premier déploiement**, notamment quand c'est une découverte de l'outil comme ce fut le cas ici : vérifier que le pare-feu du VPS autorise bien le port utilisé par n8n (ou les ports 80/443 si un reverse proxy est en place), et ne pas confondre la mise à jour de n8n proposée par l'installateur en un clic avec une mise à jour manuelle d'un conteneur Docker (les deux méthodes gèrent les versions différemment, mélanger les deux peut casser l'installation). L'interface exacte de Hostinger évolue avec le temps : les noms précis des menus peuvent changer, chercher l'option équivalente plutôt que suivre une capture d'écran figée.

### Exemple concret

Un backend n8n construit pour un client Chatllow tourne d'abord en local, avec des credentials de test et un accès ouvert, pendant la phase de construction. Avant la mise en service réelle, cette même instance est redéployée sur OVH via Docker, avec HTTPS activé et les vraies credentials injectées en variables d'environnement, jamais copiées dans le code.

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

### Exemple concret

Un health check appelle l'instance n8n de Chatllow toutes les 5 minutes. Si trois vérifications consécutives échouent, un message part automatiquement sur Slack : "instance n8n injoignable depuis 15 minutes". Sans ce mécanisme, la panne ne serait découverte que lorsqu'un client signale qu'une automatisation ne fonctionne plus, souvent des heures plus tard.

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

### Installation pratique

**Exporter une sauvegarde des workflows et credentials en ligne de commande**
```
n8n export:workflow --all --output=backup-workflows.json
n8n export:credentials --all --output=backup-credentials.json
```
Ces commandes s'exécutent depuis l'instance n8n elle-même (en local ou sur le serveur), et produisent des fichiers à conserver ailleurs que sur ce même serveur (stockage externe, autre machine), pour qu'une panne du serveur n'emporte pas aussi la sauvegarde.

### Exemple concret

Si Vivier IA grandit et que des centaines d'apprenants déclenchent chaque jour des automatisations (confirmation d'inscription, rappel de session, suivi de progression), une seule instance n8n commence à prendre du retard aux heures de pointe. Passer en mode queue avec 2 ou 3 workers absorbe ce pic, sans changer un seul workflow existant.

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

### Installation pratique

Pour tester rapidement Redis en local avant de l'intégrer à une configuration Docker Compose complète :
```
docker run -p 6379:6379 redis
```
En production, Redis rejoint le même fichier `docker-compose.yml` que n8n et ses workers, ce n'est pas un service séparé à gérer indépendamment.

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
