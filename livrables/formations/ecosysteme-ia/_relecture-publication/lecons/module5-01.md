# Mise en place & Warm-up

## Chapitre 1 : Introduction, roadmap, mindset et état d'esprit

### Ce que ce module ajoute par rapport à la section Acquisition du Module 3

Le Module 3 (section 8) a posé les fondations transversales de l'acquisition, dont l'outbound marketing en particulier. Ce module va plus loin avec un outil dédié, Lemlist, spécialisé dans la prospection par email froid à grande échelle, avec l'IA intégrée pour la personnalisation.

### L'état d'esprit à adopter avant de commencer

La prospection froide par email demande de la patience avant les premiers résultats : un compte email neuf ou peu utilisé n'a pas la confiance nécessaire auprès des fournisseurs de messagerie pour envoyer massivement sans risquer d'atterrir en spam, d'où l'étape de warm-up (chapitre 5) avant toute vraie campagne. Vouloir sauter cette étape pour aller plus vite est l'erreur la plus fréquente des débutants sur cet outil.

### La roadmap de ce module

Configurer le compte et chauffer la boîte email (section 1), lancer une première campagne simple (section 2), puis approfondir la personnalisation et les scénarios avancés (section 3), avant d'aborder l'enrichissement de données en profondeur (section 4).

**Points clés**
- Ce module approfondit l'outbound marketing du Module 3 avec un outil dédié à la prospection par email froid
- Le warm-up avant toute campagne est une étape obligatoire, la sauter est l'erreur la plus fréquente des débutants
- La roadmap va de la configuration de base vers les scénarios avancés, pas l'inverse

---

## Chapitre 2 : Présentation de Lemlist et ses alternatives

### Ce que fait Lemlist précisément

Lemlist est un outil de prospection multicanal (email principalement, avec des options LinkedIn et appel), qui automatise l'envoi de séquences de messages personnalisés, suit les ouvertures et réponses, et intègre des fonctionnalités d'IA pour la génération et la personnalisation de contenu.

### Les alternatives à connaître, sans figer un choix définitif

Instantly, Smartlead, et Apollo sont des alternatives courantes, avec des positionnements légèrement différents (certaines plus orientées volume à bas coût, d'autres plus orientées base de données intégrée). Comme pour les fournisseurs d'IA vus au Module 3, le paysage des outils évolue, connaître les critères de choix compte plus que mémoriser un classement figé.

### Les critères pour choisir entre ces outils

La qualité de la délivrabilité (le taux de messages qui arrivent réellement en boîte de réception plutôt qu'en spam), la facilité d'intégration avec les outils déjà utilisés (CRM, n8n pour l'automatisation), et le coût selon le volume d'envoi prévu.

**Points clés**
- Lemlist automatise des séquences de prospection multicanal avec suivi et personnalisation IA intégrée
- Instantly, Smartlead, Apollo sont des alternatives courantes, avec des positionnements différents
- La délivrabilité, l'intégration avec l'existant, et le coût selon le volume sont les critères de choix qui comptent

---

## Chapitre 3 : Présentation complète de l'outil

### Les briques principales de l'interface

**Campaigns** : où se construisent les séquences de messages et se suivent leurs performances. **People Database** : la base de recherche et d'enrichissement de prospects (approfondie au chapitre 2 de la section suivante). **Sequences** : le déroulé temporel des messages (email 1, relance à J+3, email 2, etc.). **Tracking** : le suivi des ouvertures, clics, et réponses.

### La logique d'ensemble avant le détail

Avant de configurer quoi que ce soit, comprendre la logique globale : une campagne s'appuie sur une liste de prospects (People Database ou import), suit une séquence de messages programmés dans le temps, et chaque étape peut être conditionnée à la réponse ou non du prospect (un message de relance qui ne part que si le prospect n'a pas répondu, par exemple).

**Points clés**
- Campaigns, People Database, Sequences, Tracking : les 4 briques principales de l'interface
- Une campagne combine toujours une liste de prospects et une séquence de messages programmés dans le temps
- Les étapes d'une séquence peuvent être conditionnées à la réponse ou non du prospect

---

## Chapitre 4 : Configurer son compte

### Le lien direct avec le domaine utilisé

L'email d'envoi doit s'appuyer sur un domaine avec une bonne réputation (idéalement un domaine professionnel dédié, pas un email personnel générique), et une configuration technique correcte (SPF, DKIM, DMARC) qui prouve aux fournisseurs de messagerie que l'envoi est légitime et non usurpé.

### Installation pratique

**Configurer les bases d'un compte Lemlist**
1. Créer un compte sur lemlist.com, connecter la boîte email d'envoi (idéalement un domaine professionnel dédié à la prospection, pas la boîte principale de l'activité).
2. Dans les paramètres du domaine (chez l'hébergeur DNS, comme vu pour n8n au Module 2, section 5), configurer les enregistrements SPF, DKIM, et DMARC recommandés par Lemlist pour ce domaine.
3. Vérifier dans l'interface Lemlist que la configuration est reconnue comme valide avant de passer à l'étape de warm-up.

**Points clés**
- L'email d'envoi doit s'appuyer sur un domaine avec une bonne réputation, idéalement dédié à la prospection
- SPF, DKIM, DMARC sont les enregistrements techniques qui prouvent la légitimité de l'envoi aux fournisseurs de messagerie
- Vérifier la validité de la configuration avant de passer à l'étape suivante, pas après avoir commencé à envoyer

---

## Chapitre 5 : Lancer le Warm-up + point délivrabilité

### Ce que le warm-up fait concrètement

Le warm-up envoie et reçoit automatiquement de petits volumes d'emails entre comptes pour construire progressivement une réputation d'expéditeur légitime, avant tout envoi réel à des prospects. Sans cette étape, une boîte email neuve qui commence directement par un envoi massif se fait très souvent classer en spam, même avec un excellent message.

### La délivrabilité, la métrique à surveiller en continu

La délivrabilité mesure la part des messages envoyés qui arrivent réellement en boîte de réception, par opposition aux spams ou aux rejets. Une baisse de délivrabilité pendant une campagne est un signal à traiter immédiatement (réduire le volume, revoir le contenu), pas un chiffre à ignorer tant que les réponses continuent d'arriver.

### Installation pratique

**Lancer et suivre le warm-up**
1. Dans Lemlist, activer la fonctionnalité de warm-up pour la boîte email configurée au chapitre précédent.
2. Laisser tourner le warm-up au moins 2 à 3 semaines avant tout envoi de campagne réelle, en surveillant le score de réputation affiché dans l'interface.
3. Une fois un score de réputation stable atteint, passer à un volume d'envoi progressif plutôt qu'un démarrage à pleine capacité dès la première campagne.

**Points clés**
- Le warm-up construit une réputation d'expéditeur avant tout envoi réel, en échangeant automatiquement de petits volumes
- Une boîte neuve qui envoie massivement sans warm-up se fait très souvent classer en spam
- La délivrabilité se surveille en continu, une baisse est un signal à traiter immédiatement

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi le warm-up est-il une étape obligatoire avant toute vraie campagne ?
2. Cite les 4 briques principales de l'interface Lemlist.
3. Que prouvent les enregistrements SPF, DKIM, DMARC aux fournisseurs de messagerie ?
4. Qu'est-ce que la délivrabilité, et pourquoi la surveiller en continu ?

### Réflexion
5. Un apprenant veut lancer sa première campagne dès la création de son compte, sans attendre le warm-up. Quel risque concret court-il, selon ce chapitre ?
