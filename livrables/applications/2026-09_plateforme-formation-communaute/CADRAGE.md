# Cadrage — Vivier Academies (plateforme de formation et communauté)

Date du cadrage : 2026-09-12, mis à jour le 2026-09-13. Suivi de construction ajouté le 2026-09-17 (voir section 10), le cadrage lui-même (sections 0 à 9) n'a pas bougé depuis le 2026-09-14.

Nom de la plateforme globale : **Vivier Academies** (tranché le 2026-09-13, aucune collision directe trouvée).

## 0. Architecture

Une seule plateforme, un seul système technique, une seule base de données. Plusieurs **espaces** distincts à l'intérieur, chacun avec son propre contenu et sa propre communauté. Aucun mélange entre les élèves de deux espaces différents.

**Espace** est un concept générique et réutilisable, pas codé en dur pour deux cas particuliers : Zézé veut pouvoir ajouter de nouvelles formations à l'académie plus tard (un nouvel espace, suivant le même schéma), sans reconstruire l'architecture. Conséquence directe sur l'étape 3 (maquette) et sur la construction : la séparation par espace (données, contenu, communauté) doit être un mécanisme générique dès la conception, pas une exception ajoutée après coup pour gérer "juste deux cas".

Les deux premiers espaces prévus :
- **Vivier IA** : programme écosystème IA (Modules 1, 2, futurs modules)
- **Marketing de réseau** (nom générique, volontairement pas "Longrich", voir section 3)

## 1. Type de projet

Application / SaaS (variante Kora), **combinée** à la variante Fullstack (Claude Code + n8n).

Le produit (comptes, contenu, communautés) est entièrement construit dans Claude Code. n8n intervient uniquement sur l'orchestration du paiement Mobile Money vers l'activation d'un compte élève. Cette répartition est explicite et actée : rien ne doit être construit qui la contredise sans repasser par un cadrage.

## 2. Objectif

Construire, par espace, un système à trois niveaux qui fait à la fois de l'acquisition, de la formation, et de la rétention :

1. **Communauté gratuite** : un groupe ouvert (sur approbation) qui sert de haut de tunnel. Zézé y envoie les prospects capturés sur YouTube et ailleurs, les nourrit avec du contenu gratuit pour les amener à payer la formation complète.
2. **Communauté payante privée** : réservée à ceux qui ont payé. Zézé y envoie des exercices et des mises en pratique. Les élèves y interagissent entre eux (messages, vidéos, images).
3. **Page individuelle de l'élève** : son espace personnel de suivi de progression dans les modules de formation, distinct de la communauté où il interagit avec les autres.

Construction voulue de façon incrémentale ("on développe petit à petit"), pas en un seul bloc : contrainte de méthode explicite, à respecter dès le découpage des lots de construction (étape 5 du pipeline).

## 3. Cible

Deux espaces distincts, non mélangés, chacun avec son trio communauté gratuite / communauté payante / page individuelle :

- **Vivier IA** : apprenants du programme écosystème IA, prospectés notamment via YouTube
- **Bâtisseur Pro** (nom tranché le 2026-09-13) : distributeurs Longrich formés par Zézé, **et** distributeurs d'autres entreprises de marketing de réseau que Zézé compte aussi prospecter et former avec ses équipes. Décision explicite : cet espace ne doit **pas** afficher le nom "Longrich", pour rester ouvert à ces autres entreprises. Point de vigilance : proximité de nom avec "Le Bâtisseur" (`formation-lebatisseur.fr`, formation en communication pour dirigeants), secteur différent mais à garder en tête, pas une collision directe.

## 4. Problème réel résolu

Le contenu de formation existe déjà (Modules 1/2 écosystème IA, programme MLM complet). L'enjeu n'est pas de le rendre accessible (un LMS basique suffirait), mais de couvrir tout le cycle : capter des prospects (communauté gratuite), les convertir en clients payants (tunnel intégré), les former (page individuelle), et les retenir dans la durée en créant un effet de communauté qui renforce la marque (communauté payante).

## 5. Priorité

**Ordre de construction tranché le 2026-09-13** : le trio complet (communauté gratuite + communauté payante + page individuelle) se construit d'abord entièrement pour un seul espace, **Vivier IA**, avant de répliquer sur l'espace marketing de réseau. Pas de construction en parallèle sur les deux espaces, et pas de découpage par brique transversale (par exemple "toutes les communautés gratuites des deux espaces d'abord") : un espace de bout en bout, puis l'autre.

À l'intérieur du trio Vivier IA, l'accès fiable au contenu (comptes, paiement, consultation des modules, page individuelle) reste construit avant la communauté payante (exercices, interactions entre élèves), conformément à la volonté de Zézé de développer petit à petit. La communauté gratuite (moteur d'acquisition) fait partie de ce premier trio, son ordre exact par rapport au socle payant reste à préciser au moment du découpage des tâches (étape 5 du pipeline).

## 6. Répartition produit / automatisation

**Produit (Claude Code)** :
- Comptes élèves et gestion des accès, par espace
- Hébergement et consultation du contenu de formation
- Page individuelle de suivi de progression par élève
- Communauté gratuite : contenu ouvert, lien d'invitation, file d'approbation manuelle par Zézé avant intégration
- Communauté payante : espace privé, exercices envoyés par Zézé, interactions entre élèves (messages, vidéos, images)
- Tunnel de vente intégré à la communauté gratuite, avec paiement Mobile Money direct
- Administration : plusieurs niveaux de droits admin, invisibles et inaccessibles aux membres simples
- Compteurs et statistiques de communauté (nombre d'abonnés au minimum, autres paramètres à préciser)
- Souhaité, non bloquant : ajout manuel d'un élève à la formation payante par Zézé, en plus de l'activation automatique par paiement ; si techniquement lourd, peut être abandonné
- Souhaité, à confirmer pour quelle version : un outil d'enregistrement vidéo intégré à la plateforme, pour créer des cours directement dedans
- **Prix des formations modifiables par un admin, à tout moment** (tranché le 2026-09-14) : le prix de chaque espace doit être un réglage admin, jamais codé en dur dans le produit

**Automatisation (n8n)** :
- Événement déclencheur : paiement reçu via Mobile Money (Orange Money ou MTN Money)
- n8n reçoit la confirmation de paiement et orchestre l'activation automatique du compte élève côté produit (déblocage de l'accès, notification de bienvenue). Aucune approbation manuelle sur ce chemin : le paiement suffit à activer l'accès
- Le détail technique de captation du paiement Mobile Money (agrégateur, API disponible en Guinée) reste à investiguer à l'étape de construction, pas à trancher ici

**Précision importante sur l'approbation manuelle** : elle ne concerne que l'entrée dans la **communauté gratuite** (Zézé valide qui rejoint le groupe de prospects). Elle ne s'applique jamais à l'accès à la formation payante, qui reste automatique dès le paiement reçu.

**Paiement en plusieurs tranches, tranché le 2026-09-14** : écarté. Le paiement reste unique (un seul versement Mobile Money = une seule activation), conformément à l'automatisation n8n déjà actée. Zézé a préféré simplifier plutôt que d'introduire un suivi de versements partiels.

## 7. Périmètre

**Probable en V1** (premier lot incrémental, uniquement l'espace **Vivier IA**, voir section 5) :
- Comptes payants activés via Mobile Money et n8n
- Consultation des modules déjà rédigés, page individuelle de progression, **avec lecture vidéo intégrée** (les modules incluent du contenu vidéo, confirmé requis dès la V1, pas une évolution ultérieure)
- Communauté gratuite avec lien d'invitation et approbation manuelle
- Communauté payante (exercices, interactions entre élèves)
- **Version mobile** : la plateforme doit être utilisable sur mobile dès la V1 (confirmé le 2026-09-13), pas seulement desktop. Le format exact (site responsive ou application dédiée) reste à trancher à l'étape 3 (maquette) selon le budget et le délai réels de construction
- **Outil admin "créer une nouvelle formation"** (tranché le 2026-09-14) : un bouton en libre-service pour que Zézé crée lui-même un nouvel espace (avec les mêmes paramètres structurels que les espaces existants), sans redemander de développement. Construit dès la V1 même si le premier usage réel n'arrive qu'au 3e espace, pour qu'il soit prêt le moment venu

**Vient après**, une fois le trio Vivier IA stable :
- Réplication du même trio pour l'espace marketing de réseau
- Lead magnets sur les vidéos, statistiques avancées de communauté
- Outil d'enregistrement vidéo intégré (si retenu)
- Ajout manuel d'élève en formation payante (si retenu)
- **Agent IA de veille et qualification sociale** : détecte les interactions entrantes (commentaires, mentions, messages) sur les réseaux sociaux et route vers la communauté gratuite. Réserve technique explicite : les plateformes sociales limitent fortement l'automatisation de la prospection sortante (messages non sollicités), risque de bannissement de compte. Le réalisable est la détection et la réponse à ce qui arrive, pas le démarchage à froid automatisé. À investiguer en détail au moment de cadrer cette brique précisément, plateforme par plateforme.
- **Vitrine Chatllow** : une page ou section de présentation du cabinet de conseil IA, visible par les membres de la communauté (dirigeants, entrepreneurs, décideurs), avec un appel à l'action (contact, appel découverte). Pas un espace complet avec sa propre communauté ou son propre paiement, une simple page de présentation à faible coût de construction.

**Hors périmètre explicite pour la V1** : aucune exclusion demandée par Zézé (2026-09-13). Au contraire, la version mobile et la lecture vidéo sont confirmées comme requises dès la V1, pas des évolutions ultérieures.

## 8. Contraintes connues

- **Exigence esthétique explicite** : cette plateforme est destinée à être largement promue et doit attirer une clientèle importante. Le soin visuel (Claude Design pour la maquette, étape 3) n'est pas secondaire ici, il conditionne directement l'objectif d'acquisition
- Paiement en Mobile Money (Orange Money, MTN Money), spécifique au marché guinéen
- Construction volontairement incrémentale, pas de "tout en un bloc"
- Le second espace ne doit jamais afficher la marque "Longrich", pour rester ouvert à d'autres entreprises de marketing de réseau
- Aucun délai de lancement, confirmé le 2026-09-13 : pas de date cible pour l'instant
- Version mobile et lecture vidéo intégrée requises dès la V1 (confirmé le 2026-09-13)
- Aucune contrainte de budget communiquée

## 9. Points encore à trancher

- ~~Relation avec le portail existant~~ : tranché le 2026-09-13. `livrables/sites-web/2026-09_portail-academie/` est **absorbé** par Vivier Academies plutôt que maintenu séparément : la nouvelle plateforme devient elle-même la vitrine publique, pour les deux espaces. Le portail existant sera à archiver ou rediriger une fois la vitrine construite (étape 3).
- ~~Identité de la plateforme globale~~ : tranché, voir en-tête du document (Vivier Academies, nom visible de la plateforme qui héberge Vivier IA, Bâtisseur Pro et la vitrine Chatllow).
- ~~Délai de lancement~~ : tranché, aucune contrainte pour l'instant.
- ~~Hors périmètre explicite pour la V1~~ : tranché, rien d'exclu ; mobile et vidéo confirmés requis dès la V1.
- ~~Détail technique de l'intégration Mobile Money~~ : tranché en construction. **Chariow** est l'agrégateur retenu, orchestré via n8n (voir section Construction ci-dessous).
- ~~**"Plusieurs paramètres" de la communauté**~~ : tranché le 2026-09-19, construit (voir section 10). Indicateurs ajoutés : croissance des membres, demandes en attente, progression dans la formation, revenus. Réglages ajoutés : période d'activité, compteur public, message d'accueil et règles
- **Ajout manuel en formation payante** : résolu partiellement — un formulaire admin "Accès payant manuel (filet de sécurité)" existe déjà pour les cas où le tunnel Chariow est indisponible ou un élève a payé autrement
- **Outil d'enregistrement vidéo intégré** : tranché, construit (`EnregistrementVideo` côté admin, capture d'écran directement rattachée à une section)
- **Découpage précis des lots incrémentaux** : sans objet désormais, la construction a avancé au fil de l'eau plutôt que par lots pré-découpés
- **Contenu de cours pour Bâtisseur Pro** : structure complète créée (9 modules, voir Construction), mais aucune vidéo encore enregistrée — reste un travail de Zézé, pas de construction

## 10. Construction (mise à jour du suivi, jusque-là non tenu à jour depuis le cadrage initial)

Le cadrage (sections 0 à 9) a été figé le 2026-09-14. Cette section trace ce qui a réellement été construit depuis, pour que le document reste utile en cours de projet plutôt que de rester bloqué à l'étape de cadrage.

**Espace Vivier IA — trio complet construit** :
- Modèle de données `espaces` générique sur Supabase (RLS, un espace = un identifiant, données et communauté filtrées par cet identifiant)
- Communauté gratuite (fil de posts façon Skool, approbation manuelle)
- Communauté payante (badge Expert, lead magnets sur les vignettes vidéo)
- Page individuelle de progression par élève
- Vitrine publique avec vraies données (FAQ, parcours dynamique, pas de contenu statique codé en dur)
- Tunnel de paiement Mobile Money : côté produit (création de la session) et côté paiement réel, branché sur **Chariow** via **n8n** (webhook `creer-paiement-vivier-ia`, confirmation `successful.sale` avec vérification de signature HMAC qui active l'accès via `/api/webhooks/paiement`)
- Modules 1 (Écosystème Claude, 7 sections), 3, 4 et 5 rédigés intégralement (contenu texte source dans `livrables/formations/ecosysteme-ia/`) ; Module 2 (n8n) a son guide de réussite mais pas encore ses sections en base
- Fonctionnalités additionnelles construites en cours de route, au-delà du périmètre V1 initialement listé : bibliothèque de prompts, ressources (liens et fichiers téléchargeables), masterclass, prise de RDV découverte, contenu éditorial avec workflow brouillon/publication (lié au skill `contenu-vivier-ia`), FAQ et parcours de vitrine pilotés par la base plutôt que codés en dur
- Outils admin construits : création de formation en libre-service, prix modifiable par formation, accès payant manuel (filet de sécurité), enregistrement vidéo directement rattaché à une section
- **Paramètres de communauté (2026-09-19, migration 0024)** :
  - Indicateurs admin par espace, en plus des 4 existants (membres, posts, actifs, conversion) : nouveaux membres sur 7 et 30 jours, demandes d'accès en attente, avancement moyen des élèves avec les 3 sections les plus et les moins terminées, revenus confirmés (total et 30 jours). Calculés en SQL par `stats_admin_espace`, réservée au `service_role` (données commerciales privées)
  - Réglages par espace : période d'activité en jours (7 par défaut), compteur de membres affiché ou non sur la vitrine (affiché par défaut, pour ne rien changer à l'existant), message d'accueil et règles affiché aux membres de la communauté gratuite et payante
  - Le message d'accueil est dans une table à part `messages_accueil` (lecture réservée aux membres de l'espace), pas dans `espaces`, qui est lisible publiquement
  - Les revenus ne comptent que les paiements au statut "confirmé". Un accès accordé à la main par l'admin ne crée pas de paiement et n'y figure donc pas

**Espace Bâtisseur Pro — structure créée, réplication du trio pas encore commencée** :
- Espace créé en base (2026-09-16), vitrine avec contenu réel (pas de placeholder), prix aligné sur Vivier IA (250 000 GNF, modifiable)
- Accès admin de Zézé sur cet espace corrigé le 2026-09-16 (adhésion bloquée en attente, débloquée)
- Contenu de cours créé le 2026-09-16/17 : **9 modules** au total — Module 1 "IA appliquée au marketing de réseau" (module croisé déjà rédigé, 4 sections), Modules 2 à 9 correspondant aux 8 parties du programme marketing de réseau complet (skill `programme-marketing-reseau`, 54 sections au total). Seuls les titres sont en base, comme pour Vivier IA : le contenu réel sera livré par vidéo, à enregistrer par Zézé
- **Pas encore fait** : réplication du trio complet (communauté gratuite / payante / page individuelle spécifiques à cet espace fonctionnent déjà techniquement grâce à l'architecture générique, mais n'ont pas été vérifiées ni peuplées de contenu propre à Bâtisseur Pro), enregistrement des vidéos

**Fil de communauté façon Skool (2026-09-20, lot A sur 4, migration 0026)** :
- Un seul fil pour les zones gratuite et payante : barre « Écrire quelque chose » (titre, texte, catégorie, une image), pastilles de catégories filtrant par `?cat=`, cartes (auteur, date, catégorie avec emoji, épinglé, titre, texte, image, likes, commentaires, dernier commentaire), page du post avec ses commentaires
- Catégories propres à chaque espace, gérées depuis l'admin (nom et emoji). Les posts existants ont repris leur ancien tag comme catégorie. Le champ `posts.tag` reste en base, il est historique
- Likes : ce sont les votes existants (`post_votes`), avec leurs points. Épingler est réservé à l'admin, y compris côté base (trigger)
- Images : bucket privé `posts-images`, 5 Mo, JPG, PNG ou WebP, signature du fichier vérifiée, liens temporaires d'une heure. Aucune URL publique
- Correction découverte en route : un membre ne pouvait lire que son propre profil, donc les auteurs des autres membres s'affichaient tous « Membre ». Une règle (`partage_un_espace`) permet aux membres d'un même espace de se voir (pseudo, rôle, points), et `experts_espace` expose seulement la liste des experts
- **Lots suivants, validés le 2026-09-20** : B photo de profil (upload par le membre), C notifications (likes, commentaires, messages reçus, avec compteur), D messagerie privée entre deux membres du même espace (lisible seulement par eux deux), puis la barre basse mobile (Accueil, Messages, Notifications, profil)
- **Constats hors périmètre, non corrigés** : le compteur « membres » et le classement de la page communauté sont faux dès qu'il y a plusieurs membres (la table `adhesions` n'est lisible que pour ses propres lignes) ; l'en-tête de navigation déborde sur mobile (6 liens sur une ligne)

**Non construit, restant du périmètre "vient après" (section 7)** :
- Lead magnets avancés, statistiques de communauté au-delà des compteurs de base
- Agent IA de veille et qualification sociale (extension future actée)
- Vitrine Chatllow légère au sein de Vivier Academies (à ne pas confondre avec la plateforme Chatllow autonome, un projet distinct — voir `livrables/applications/2026-09_plateforme-chatllow/`)

## Historique du cadrage

**2026-09-12** — Premier tour : type de projet, objectif initial, paiement Mobile Money orchestré via n8n, construction incrémentale, emplacement du projet.

**2026-09-13** — Reprise et clarifications majeures par échanges successifs avec Zézé :
- Architecture tranchée : une plateforme, plusieurs espaces génériques (extensible à de futures formations)
- Reformulation complète du concept de "communauté" : ce n'est pas un seul espace social pour les payants, c'est un système à trois niveaux (communauté gratuite de prospects, communauté payante d'élèves, page individuelle par élève)
- Confirmé : mêmes paramètres pour les deux espaces (Vivier IA et marketing de réseau)
- Confirmé : une vitrine publique est voulue pour les deux espaces, pas seulement Vivier IA
- Confirmé : le second espace ne doit pas porter le nom "Longrich", pour rester ouvert à d'autres entreprises de marketing de réseau
- Confirmé : approbation manuelle uniquement pour la communauté gratuite, accès automatique par paiement pour la partie payante
- Notés comme souhaits non bloquants : ajout manuel d'élève en formation payante, outil d'enregistrement vidéo intégré, lead magnets sur les vidéos

**2026-09-14** — Maquette étendue (8 écrans : trio Vivier IA + bibliothèque de prompts + 2 vitrines Bâtisseur Pro), puis reprise du cadrage sur les décisions de fond notées pendant la maquette :
- Écarté : les prospects créent leur propre communauté sur la plateforme (trois lectures possibles proposées à Zézé, il a préféré retirer l'idée pour l'instant plutôt que trancher)
- Écarté : paiement en plusieurs tranches. Reste un paiement unique
- Tranché : le prix de chaque formation est modifiable par un admin à tout moment, jamais codé en dur
- Tranché : outil admin "créer une nouvelle formation" en libre-service, construit dès la V1
- Restent ouverts : détail technique Mobile Money, paramètres de communauté, ajout manuel en formation payante, outil d'enregistrement vidéo

**Toutes les décisions de fond notées pendant la maquette sont maintenant tranchées ou écartées.** Le cadrage est complet, seuls des détails d'exécution technique restent à préciser en construction (étape 5).

**2026-09-13 (suite)** — Ordre de construction tranché : le trio complet (gratuite + payante + individuelle) se construit d'abord pour l'espace Vivier IA en entier, avant de répliquer sur l'espace marketing de réseau.

**2026-09-13 (suite)** — Ajout confirmé comme extension future (pas V1) : agent IA de veille et qualification sociale, avec réserve technique sur les limites réelles de l'automatisation de prospection sortante sur les réseaux sociaux. Exigence esthétique explicite ajoutée aux contraintes : la plateforme doit être soignée visuellement, elle est pensée pour être largement promue et attirer une clientèle importante.

**2026-09-13 (suite)** — Ajout confirmé comme extension future (pas V1) : une vitrine Chatllow (page de présentation du cabinet avec appel à l'action), visible par la communauté, plus légère qu'un espace complet.

**2026-09-13 (suite)** — Nom de l'espace marketing de réseau tranché : **Bâtisseur Pro**. Piste retenue après exploration de plusieurs options ("MLMpreneur Pro" écarté pour collision directe avec mlmpreneur.com, "Vivier Réseau" et "Essor Réseau" proposés sans collision trouvée). Zézé a choisi Bâtisseur Pro malgré la recommandation de Claude pour Vivier Réseau ; point de vigilance noté sur la proximité avec "Le Bâtisseur" (secteur différent).

**2026-09-13 (suite)** — Nom de la plateforme globale tranché : **Vivier Academies**. "Le Tremplin" et "Constellation" écartés pour collision réelle (tremplindeselus.fr et autres, constellation.academy).

Toutes les identités sont maintenant tranchées : plateforme = Vivier Academies, espace 1 = Vivier IA, espace 2 = Bâtisseur Pro.

**2026-09-13 (suite)** — Dernier tour de cadrage : portail existant absorbé par Vivier Academies (pas maintenu séparément), aucun délai de lancement, aucune exclusion de périmètre demandée. Version mobile et lecture vidéo intégrée confirmées comme requises dès la V1 Vivier IA, pas des évolutions ultérieures.

Il ne reste que des points d'exécution technique à trancher pendant la construction (voir section 9) : le cadrage est considéré comme suffisant pour passer à l'étape 3 (maquette Claude Design).

**2026-09-17** — Ce document n'avait plus été mis à jour depuis la fin du cadrage (2026-09-14), alors que la construction a largement avancé entre-temps (voir section 10, nouvellement ajoutée). Écart constaté et corrigé : le document était resté figé à l'étape 3 alors que le projet est en réalité bien avancé dans l'étape 5 (construction), avec un second espace (Bâtisseur Pro) déjà partiellement répliqué.
