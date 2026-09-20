# Cadrage des automatisations, Vivier Academies

Date : 2026-09-20. Statut : brouillon de cadrage, à valider par Zézé avant toute construction. Complète `CADRAGE.md` (qui reste la référence pour le produit) sans le remplacer.

Ce document ne construit rien. Il dit ce qui est déjà automatisé, ce qui pourrait l'être, dans quel ordre, avec quel outil, et propose le prompt du premier lot.

Légende utilisée partout :
- **Outil** : `SQL` (trigger ou fonction Postgres), `Produit` (code Next.js), `n8n` (plomberie entre systèmes).
- **Effort** : S (une session courte), M (une session), L (plusieurs sessions).
- **NOUVELLE MIGRATION** : toute table, colonne ou contrainte à créer. La prochaine migration disponible est la 0032.
- **Dépend de Chariow** : l'automatisation s'appuie sur un événement ou une donnée Chariow. Le sujet Chariow lui-même n'est pas rouvert ici.
- **À confirmer** : hypothèse posée faute d'information, à valider.

---

## 1. Type de projet et lecture de la consigne

**Type** : application / SaaS (variante Kora) combinée à la variante Fullstack (Claude Code + n8n), comme le cadrage de la plateforme. Ce cadrage ne crée pas un nouveau projet, il ajoute une couche d'automatisation à un produit déjà construit (migrations 0001 à 0031). La variante "Automatisation (n8n)" de la méthode s'applique aux workflows eux-mêmes : déclencheur réel identifié avant de choisir un trigger, Error Trigger, tests avec données imparfaites.

**Lecture de ta consigne** ("cadrer les automatisations de la plateforme, il garde d'abord Chariow pour le moment") : Chariow reste l'agrégateur de paiement en place, et son sujet (Mobile Money en Guinée, prix non synchronisable) n'est pas rouvert. Cette lecture me semble juste. Deux précisions :
1. "Garder Chariow" ne veut pas dire "la chaîne de paiement fonctionne". Elle n'a jamais été prouvée de bout en bout (voir 3.3), et c'est le premier chantier.
2. Pour que garder Chariow ne coûte pas cher le jour où ça change, chaque automatisation qui dépend de Chariow est marquée, et le contrat côté produit reste neutre : `/api/webhooks/paiement` ne connaît que `paiement_id` et `statut`, tout le spécifique Chariow vit dans n8n. À conserver.

---

## 2. Décisions déjà actées (contraintes, pas questions)

- Le produit (comptes, contenu, communautés, progression) est dans Claude Code (Next.js 16 + Supabase).
- n8n orchestre le chemin paiement vers activation du compte.
- Paiement unique, jamais en tranches.
- Accès payant automatique dès le paiement, jamais soumis à validation manuelle.
- Approbation manuelle uniquement pour la communauté gratuite.
- Prix modifiable par un admin.
- L'espace Bâtisseur Pro n'affiche jamais le nom "Longrich" : cela vaut aussi pour tous les e-mails et messages sortants (les textes doivent être paramétrés par espace).
- Un article de contenu n'est jamais publié automatiquement (décision du 2026-09-16).
- L'admin ne lit jamais une conversation privée (migration 0031) : une alerte de signalement ne doit donc pas pousser le texte du message vers un canal externe.
- Construction incrémentale, prompt annoncé et validé avant de construire, manipulation réelle sur tes comptes guidée pas à pas en direct, aucun secret collé dans le chat.

**Extension de la répartition, à valider (question 1)** : le cadrage actuel dit que n8n intervient uniquement sur le chemin paiement vers activation. Envoyer des e-mails ou des messages WhatsApp et lancer des tâches planifiées, c'est de la plomberie vers des systèmes externes, donc au même titre du ressort de n8n, mais c'est plus large que ce qui a été acté. Ce document propose cette extension. Sans ton accord explicite, rien de ce qui suit ne doit être construit.

---

## 3. Inventaire de l'existant (vérifié dans le code, la base et n8n)

### 3.1 Ce qui est automatisé aujourd'hui

| Quoi | Où | Déclencheur | Effet | Statut vérifié |
|---|---|---|---|---|
| Création de profil | SQL `handle_new_user` (0002) | Inscription Supabase Auth | Crée la ligne `profils` | En place |
| Points de réputation | SQL `appliquer_vote_points` (0003) | Like reçu ou retiré | Met à jour `profils.points` | En place |
| Notifications internes | SQL `notifier_like`, `notifier_commentaire`, `notifier_message` (0029, 0030) | Like, commentaire, message reçu | Ligne dans `notifications`, jamais créée par le client | En place |
| Temps réel | Supabase Realtime (0031) | Nouvelle ligne `notifications` ou `messages` | Badge et messages sans recharger, sondage de secours toutes les 2 minutes | En place |
| Réservation de créneau RDV | SQL `reserver_creneau` / `annuler_creneau` (0013) | Clic membre | Réservation atomique | En place |
| Création de session de paiement | n8n "Paiement Chariow - Vivier IA" (`lZgdLSfwh9rsbYWP`, actif, 3 nœuds) | Webhook `creer-paiement-vivier-ia` appelé par le tunnel | Crée la session Chariow, renvoie `checkout_url` | 3 exécutions réussies le 2026-09-15 |
| Confirmation de paiement | n8n "Confirmation Paiement Chariow - Vivier IA" (`zYICF7ABAM79pr8R`, actif, 9 nœuds) puis route `/api/webhooks/paiement` | Pulse Chariow, vérification HMAC | Marque le paiement `confirme`, active `acces_payant` | **Aucune exécution réussie**, voir 3.3 |
| Notification diagnostic Chatllow | n8n `jM4k2kLw3wbXFM2c` (hors Vivier Academies) | Fin du diagnostic public | E-mail à Zézé via SMTP | 3 réussies. Sert de modèle : webhook vers SMTP |
| Brouillons d'articles | Skill `contenu-vivier-ia` | Lancé à la main dans une session Claude | Insère un brouillon dans `contenus` | Manuel de bout en bout |

Ce que j'ai cherché et **n'existe pas** : aucune tâche planifiée nulle part (ni `vercel.json`, ni `pg_cron`, ni workflow n8n avec un Schedule Trigger), aucun Error Trigger ni workflow d'erreur sur les 3 workflows n8n, aucun envoi d'e-mail depuis le produit, aucune notification de bienvenue (pourtant prévue à la section 6 de `CADRAGE.md`), aucun envoi WhatsApp. Le seul canal sortant disponible est le credential SMTP de n8n. Les credentials n8n existants : 2 Header Auth (Chariow, secret du webhook), Crypto (HMAC), SMTP.

### 3.2 Ce qui est fait à la main aujourd'hui

- Voir les demandes d'adhésion : ouvrir `/admin`. Personne n'est prévenu qu'une demande arrive.
- Approuver ou refuser une adhésion : action admin **silencieuse**, le demandeur n'est pas informé (`approuverAdhesion` ne fait que changer le statut).
- Traiter les signalements, valider les candidatures Expert, publier les brouillons de contenu : tout passe par l'ouverture de `/admin`.
- Accorder l'accès payant à la main : formulaire "filet de sécurité", silencieux lui aussi (pas de bienvenue).
- Retirer un accès payant : **aucun outil** (SQL direct dans Supabase).
- Rembourser : hors plateforme, chez Chariow.
- Créer les créneaux RDV et les masterclass, les rappeler aux inscrits : aucun rappel n'existe.
- Suivre la progression et relancer les élèves : aucun suivi, aucune relance.
- Envoyer un reçu, un message de bienvenue, une relance de panier : rien.
- Charger les leçons et prompts : scripts `scripts/charger-*.mjs` lancés à la main.
- Générer le rapport de pilotage : les indicateurs existent (`stats_admin_espace`, 0024) mais il faut ouvrir `/admin` pour les lire.

### 3.3 Constats à connaître avant de construire dessus

1. **La chaîne de confirmation n'a jamais réussi.** Sur environ quarante exécutions du workflow de confirmation (toutes datées du 2026-09-15), le filtre "statut succès" renvoie zéro résultat. L'erreur relue sur la dernière (n° 62) : le nœud "Calculer HMAC attendu" ne reçoit pas le corps brut en binaire. Hypothèse à confirmer : l'option "Raw Body" du nœud Webhook n'est pas activée (le paramètre `binaryPropertyName` est posé sans elle). Les événements reçus dans ces exécutions étaient de type `abandoned.sale`, donc aucun `successful.sale` réel n'a été traité par n8n. Conséquence : à ce jour, un élève qui paierait réellement n'obtiendrait probablement pas son accès automatiquement. La base le confirme : les 5 paiements présents sont `en_attente` (constat de la migration 0027).
2. **Le Pulse Chariow est peut-être désactivé.** La documentation Chariow indique qu'après 5 échecs de livraison sur un même envoi, le Pulse est désactivé automatiquement. Les échecs répétés du 15 septembre ont pu déclencher ça. À vérifier dans le tableau de bord Chariow, avec toi, en direct.
3. **Chariow n'envoie pas d'événement de remboursement.** Les événements Pulse documentés sont `successful.sale`, `abandoned.sale` et `failed.sale` (les autres concernent les licences et l'affiliation). Un remboursement ne peut donc pas déclencher une automatisation par Pulse.
4. **Aucun moyen de contacter un membre par un autre canal que l'e-mail, et l'e-mail n'est pas dans `profils`.** L'adresse vit dans `auth.users`. Le téléphone est demandé au tunnel de paiement puis transmis à n8n, mais jamais enregistré chez nous. Aucun numéro WhatsApp n'est donc disponible pour un membre qui n'a pas encore payé.
5. **Ne jamais ajouter de donnée personnelle dans `profils`.** Depuis la migration 0026, tout membre voit les lignes `profils` de ses co-membres, avec **toutes** les colonnes (il n'y a pas de restriction de colonne en lecture). Un numéro de téléphone ou une préférence de contact ajoutés à `profils` seraient lisibles par les autres élèves. Toute donnée de contact doit aller dans une table à part (proposée en 7).
6. **Le montant enregistré n'est pas le montant facturé.** `paiements.montant` reprend `espaces.prix`, alors que Chariow facture son propre prix produit. Tout reçu et tout chiffre de revenus doit s'appuyer sur le montant réel du Pulse, pas sur la base. Dépend de Chariow, signalé seulement.
7. **`accorderAccesPayant` cherche l'utilisateur en parcourant `listUsers()`** sans pagination. Cette liste est paginée par défaut (à vérifier, de l'ordre de 50 par page) : au-delà, le filet de sécurité répondra "aucun compte avec cet email" à tort. Petit correctif à prévoir.
8. **La route `/api/webhooks/paiement` accepte `echoue` après `confirme`** : un événement tardif de type échec pourrait rétrograder le statut d'un paiement déjà confirmé (l'accès, lui, ne serait pas retiré). À protéger dès qu'on branche les événements d'échec.
9. **Le workflow de création de paiement a l'identifiant produit Chariow codé en dur** (`prd_mkbcbme1`, Vivier IA). Le brancher pour Bâtisseur Pro demande un second identifiant produit (déjà connu comme manquant), pas une automatisation nouvelle.

### 3.4 Ce que je n'ai pas pu vérifier

Le réglage de confirmation d'e-mail dans Supabase Auth (donc si un e-mail de confirmation part déjà à l'inscription), l'état réel du Pulse dans Chariow, si Chariow envoie déjà lui-même un reçu à l'acheteur, les quotas du SMTP de n8n (probablement une boîte Gmail personnelle), les tarifs WhatsApp Business pour la Guinée. Tout ce qui en dépend est marqué "à confirmer".

---

## 4. Principes de conception proposés

### 4.1 Qui fait quoi (extension de la répartition actée)

| Rôle | Où | Exemples |
|---|---|---|
| Décider qui doit recevoir quoi, quand, combien de fois | **Produit / SQL** | Règles d'éligibilité, plafonds anti-spam, calcul des candidats, notifications internes (triggers, comme 0029) |
| Recevoir un événement externe, planifier, écrire et envoyer par un canal externe, alerter en cas d'erreur | **n8n** | Pulse Chariow, Schedule, SMTP, WhatsApp, Error Trigger |
| Données et journal | **Supabase** | Tables du produit, jamais dans n8n |

n8n n'a pas de clé de base de données aujourd'hui. Je propose de ne pas lui en donner : c'est le produit qui expose des routes protégées par secret (même mécanisme que `WEBHOOK_PAIEMENT_SECRET`) et qui décide, n8n ne fait que transporter et envoyer.

### 4.2 Comment un événement arrive jusqu'à n8n : trois options

| Option | Fonctionnement | Pour | Contre |
|---|---|---|---|
| **A. Action serveur vers webhook n8n** | L'action du produit (approuver, inscrire...) appelle un webhook n8n, comme le fait déjà `tunnel/actions.ts` | Aucune migration, simple, visible, même mécanisme que l'existant | Un événement hors de l'app (SQL direct) est manqué, pas de reprise si n8n est arrêté, pas de journal |
| **B. Trigger SQL vers `pg_net` vers n8n** | La base pousse l'événement | Capte toute écriture | Configuration côté Supabase, secret stocké en base, difficile à déboguer |
| **C. File d'événements et sondage** | Un trigger écrit dans une table, n8n interroge une route du produit toutes les 2 à 5 minutes, envoie, puis confirme | Reprise garantie, journal, anti-doublon, n8n sans clé de base | Une table et deux routes à construire, latence de quelques minutes |

**Recommandation** : A pour les premiers lots (adhésion, bienvenue, alertes), parce que ça ne demande aucune migration et reste dans ce que tu connais déjà. C dès qu'on introduit des envois planifiés à plafond (relances, rappels), parce que le journal devient indispensable pour ne jamais relancer deux fois. Le choix reste à toi (question 2).

### 4.3 Canal : e-mail, WhatsApp, notification interne

| Canal | Pour | Contre |
|---|---|---|
| **E-mail (SMTP n8n existant)** | Déjà branché, gratuit, texte riche et liens | Ouverture faible en Guinée par rapport à WhatsApp, expéditeur Gmail personnel peu crédible et limité en volume (à confirmer) |
| **WhatsApp lien `wa.me` assisté** | Zéro coût, zéro validation Meta : le rapport à Zézé contient des liens prêts à cliquer avec le message pré-écrit | Manuel, ne passe pas à l'échelle, envoi depuis ton propre numéro |
| **WhatsApp Business Cloud API via n8n** | Automatique, canal dominant dans le marché | Numéro dédié, vérification de l'entreprise Meta, modèles de messages à faire approuver pour écrire hors fenêtre de 24 h, coût par conversation (tarif Guinée à vérifier), il faut d'abord collecter le numéro avec consentement |
| **Notification interne** | Déjà en place, sans coût, temps réel | Vue seulement si le membre revient, donc inutile pour faire revenir |

**Recommandation** : e-mail d'abord pour tout ce qui est transactionnel (bienvenue, approbation, reçu). WhatsApp assisté (`wa.me`) pour les relances de prospects que tu veux personnaliser. WhatsApp Business API plus tard, quand le volume le justifie et que le numéro est collecté (question 3). Toute relance non transactionnelle porte un moyen de ne plus en recevoir.

---

## 5. Catalogue des automatisations candidates

Les colonnes "Migration" listent uniquement ce qui est nouveau. "Aucune" signifie que les tables actuelles suffisent.

### Parcours 1 : Acquisition et inscription

| ID | Automatisation | Déclencheur | Action et canal | Outil | Valeur / Effort | Dépendances et risques | Migration |
|---|---|---|---|---|---|---|---|
| A1 | Bienvenue à la création de compte | Inscription (`inscription`) | E-mail : ce qu'est l'espace, lien pour demander l'adhésion à la communauté gratuite | Produit (appel webhook) + n8n | Moyenne / S | Vérifier d'abord si Supabase Auth envoie déjà un e-mail de confirmation, ne pas en empiler deux | Aucune |
| A2 | Relance d'un compte créé sans demande d'adhésion | Compte de plus de 24 h sans ligne `adhesions` ni `acces_payant` | Un ou deux e-mails (J+1, J+4) avec le lien direct. Après, on arrête | Produit (calcul) + n8n (envoi planifié) | Haute (c'est le trou du tunnel d'acquisition) / M | L'espace d'origine du compte n'est pas enregistré, donc on ne sait pas quel espace promouvoir. Journal indispensable (pas de double relance) | **NOUVELLE MIGRATION** : table `contacts_membres` (espace d'origine, source, préférences) et journal `messages_sortants`, voir 7 |
| A3 | Mesure de la source d'inscription (YouTube, LinkedIn, direct) | Inscription avec paramètre d'URL `?src=` | Enregistre la source, alimente le rapport hebdo | Produit | Haute pour ton objectif des 20 vidéos (savoir quelle vidéo amène qui) / S | Aucune dépendance externe | **NOUVELLE MIGRATION** : colonne dans `contacts_membres` |
| A4 | Collecte du numéro WhatsApp avec consentement | Inscription ou profil, champ optionnel | Enregistre le numéro et le consentement | Produit | Moyenne, prérequis de tout WhatsApp automatique / S | RGPD : consentement explicite, finalité indiquée. Jamais dans `profils` (voir 3.3, point 5) | **NOUVELLE MIGRATION** : colonnes dans `contacts_membres` |

### Parcours 2 : Adhésion et approbation (communauté gratuite)

| ID | Automatisation | Déclencheur | Action et canal | Outil | Valeur / Effort | Dépendances et risques | Migration |
|---|---|---|---|---|---|---|---|
| B1 | Alerte "nouvelle demande d'adhésion" | Insertion `adhesions` en attente | E-mail à Zézé avec lien `/admin`. Escalade unique si la demande a plus de 24 h | Produit (appel webhook) + n8n | Haute : le délai d'approbation est le premier frein à la conversion / S | Reste manuelle par décision, on ne fait que prévenir. Beaucoup de demandes d'un coup : regrouper dans le digest (F2) | Aucune |
| B2 | Retour au demandeur : approuvé ou refusé | Action `approuverAdhesion` / `refuserAdhesion` | E-mail : bienvenue et première action (se présenter dans le fil), message d'accueil de l'espace. Refus : message court et poli | Produit (appel webhook) + n8n. Option : notification interne | Haute (aujourd'hui le demandeur ne sait jamais) / S | Bâtisseur Pro : aucun mot "Longrich". Notification interne = **NOUVELLE MIGRATION** (le type est limité à like, commentaire, message et `acteur_id` est obligatoire), donc reportée | Aucune pour l'e-mail |
| B3 | Message de bienvenue publié dans le fil | Approbation | Post automatique "bienvenue à X" | Produit | Faible, risque de bruit et d'exposition du membre / S | Pas recommandé sans consentement, garder pour plus tard | Aucune |

### Parcours 3 : Paiement et activation d'accès

| ID | Automatisation | Déclencheur | Action et canal | Outil | Valeur / Effort | Dépendances et risques | Migration |
|---|---|---|---|---|---|---|---|
| C0 | **Fiabiliser la chaîne de confirmation** (prérequis) | Voir 3.3, points 1, 2, 8 | Corriger la lecture du corps brut, ignorer proprement les autres événements, vérifier que le Pulse est actif, ne jamais rétrograder un paiement confirmé, tester avec un appel signé | n8n + un correctif de route | Critique / S à M | **Dépend de Chariow** (Pulse actif). Manipulation sur ton compte Chariow et ton n8n : à faire pas à pas en direct | Aucune |
| C1 | Bienvenue élève après activation | Insertion ou passage à actif dans `acces_payant`, quelle qu'en soit la source | E-mail : accès activé, premier module, lien | n8n (chaîné après l'activation) + appel depuis `accorderAccesPayant` | Haute / S | Déclenché par l'activation, pas par Chariow : couvre aussi le filet de sécurité manuel. Vivier IA : ne pas promettre des leçons qui ne sont pas chargées (31 leçons prêtes, pas chargées) | Aucune |
| C2 | Reçu de paiement | `successful.sale` | E-mail avec montant réel, référence, produit | n8n | Moyenne / S | **Dépend de Chariow.** Chariow envoie peut-être déjà un reçu (à confirmer), sinon doublon. Montant à prendre dans le Pulse | Aucune |
| C3 | Alerte "nouvelle vente" à Zézé | Nouvel accès payant | E-mail (et lien `wa.me` vers l'élève pour un mot personnel) | n8n | Moyenne, moral et contrôle / S | Basé sur l'activation, pas sur Chariow, pour couvrir aussi l'accès manuel | Aucune |
| C4 | Relance de paiement abandonné ou échoué | `abandoned.sale` et `failed.sale` (contiennent e-mail, téléphone, lien de paiement) | E-mail à 1 h puis à J+1 avec le lien. Option : `wa.me` prêt à envoyer pour Zézé | n8n | Haute une fois du trafic réel / M | **Dépend de Chariow** (Pulse actif, C0 fait). Efficacité conditionnée au sujet Mobile Money, non rouvert ici : un panier abandonné faute de moyen de paiement ne se récupère pas par un e-mail. Le statut `echoue` ne doit jamais écraser `confirme` | Aucune |
| C5 | Paiement initié mais sans nouvelle depuis 24 h | Ligne `paiements` en attente depuis plus de 24 h | Alerte dans le digest à Zézé | Produit (calcul) + n8n | Faible à moyenne, filet si un Pulse est perdu / S | Dépend de la fiabilité de C0. Le lien de paiement n'est pas stocké | Aucune |
| C6 | Remboursement | Pas d'événement Pulse (voir 3.3, point 3) | Détection manuelle par Zézé. Outil admin "retirer l'accès" + e-mail de confirmation | Produit | Faible fréquence, forte importance / M | **Dépend de Chariow** (aucune notification). Politique à trancher : retrait automatique ou décision manuelle (question 5) | **NOUVELLE MIGRATION** si on veut tracer : le statut de `paiements` n'admet que en attente, confirmé, échoué |
| C7 | Expiration d'accès | Fin d'une durée d'accès | Rappels puis désactivation | n8n + SQL | Sans objet tant que l'accès est à vie | Le cadrage dit paiement unique, pas de durée. Question 4 | **NOUVELLE MIGRATION** seulement si une durée est décidée |

### Parcours 4 : Engagement des élèves

| ID | Automatisation | Déclencheur | Action et canal | Outil | Valeur / Effort | Dépendances et risques | Migration |
|---|---|---|---|---|---|---|---|
| D1 | Relance du "jamais commencé" | Accès actif depuis 48 h, aucune section terminée | E-mail avec le lien de la première leçon | Produit (calcul) + n8n | Haute quand il y aura des élèves (c'est l'activation) / M | **Vivier IA : ses 31 leçons ne sont pas chargées, relancer vers du vide serait nuisible.** Journal et plafond obligatoires | Journal `messages_sortants` (7) |
| D2 | Relance d'inactifs | Aucune progression ni post depuis N jours (réglage existant `periode_activite_jours`, 7 par défaut) | E-mail ou `wa.me`, avec la prochaine section. Maximum 3 relances, 1 par semaine, puis alerte à Zézé | Produit (calcul) + n8n | Moyenne / M | Il n'existe pas de "dernière activité" fiable : à déduire des progressions, posts et commentaires. Risque de harcèlement, d'où le plafond et la désinscription | Journal `messages_sortants` (7) |
| D3 | Série de jours (streak) | Progression quotidienne | Compteur affiché, rappel "ta série est en danger" | Produit | Incertaine / M | Effet de mode, risque de pression, calculable sans table à partir des dates de `progression`. Reporter | Aucune |
| D4 | Jalons de progression | 25, 50, 75, 100 % d'un module ou d'un espace | Notification interne de félicitation, e-mail au 100 % | SQL (trigger sur `progression`, comme 0029) | Moyenne / M | Le type de notification est limité (voir B2) | **NOUVELLE MIGRATION** : étendre le type de `notifications`, rendre `acteur_id` facultatif |
| D5 | Demande de témoignage à la fin | 100 % de l'espace (ou d'un module choisi) | Notification et e-mail vers le formulaire de témoignage déjà construit. Puis alerte à Zézé à la réception | SQL + n8n | Haute pour la preuve sociale (YouTube, Chatllow), mais rien à déclencher tant que personne ne termine / S après D4 | Le formulaire existe déjà (`FormulaireTemoignage`, consentement de partage inclus) | Comme D4 |
| D6 | Question sans réponse | Post sans commentaire depuis 24 h | Ligne dans le digest de Zézé (ou d'un expert) | Produit (calcul) | Haute quand la communauté est petite : chaque silence coûte / S | Aucune | Aucune |
| D7 | Rappel masterclass et RDV découverte | J-1 et 1 h avant `masterclasses.date_heure` pour les inscrits, idem `creneaux_rdv` réservés | E-mail avec le lien, `wa.me` possible. Rappel aussi à Zézé pour chaque RDV | n8n (Schedule) + route produit | Haute (réduit les absences aux lives) / M | Fuseau : Conakry est en UTC sans changement d'heure, ce qui simplifie. Journal (7) | Journal `messages_sortants` (7) |
| D8 | Confirmation d'inscription à une masterclass | Insertion `inscriptions_masterclass` | E-mail avec date, heure, lien | Produit + n8n | Moyenne / S | Aucune | Aucune |

### Parcours 5 : Modération et alertes admin

| ID | Automatisation | Déclencheur | Action et canal | Outil | Valeur / Effort | Dépendances et risques | Migration |
|---|---|---|---|---|---|---|---|
| E1 | Alerte signalement | Appel de `signaler()` (0031) | E-mail à Zézé : type, espace, lien `/admin`. **Sans le texte signalé** | SQL (option A impossible car `signaler` est une fonction SQL) puis n8n | Haute (contenu abusif visible pendant des heures) / M | Vie privée : ne jamais pousser l'extrait d'un message privé hors de la plateforme, l'admin le lit dans `/admin` uniquement. Il faut donc l'option B ou C pour cet événement | Option B : aucune. Option C : file d'événements (7) |
| E2 | Candidature Expert et brouillon de contenu à valider | Insertion `candidatures_expert`, brouillon dans `contenus` | Ligne dans le digest | Produit + n8n | Faible / S | Aucune | Aucune |
| E3 | Signalement ouvert depuis plus de 24 h | Signalement non traité | Relance dans le digest | Produit + n8n | Moyenne / S | Aucune | Aucune |

Suspendre un membre abusif n'existe pas dans le produit (indiqué "non inclus" au cadrage) : c'est une fonctionnalité, pas une automatisation, hors périmètre ici.

### Parcours 6 : Pilotage

| ID | Automatisation | Déclencheur | Action et canal | Outil | Valeur / Effort | Dépendances et risques | Migration |
|---|---|---|---|---|---|---|---|
| F1 | Rapport hebdomadaire à Zézé | Lundi matin (UTC, donc heure de Conakry) | E-mail par espace : nouveaux inscrits, demandes en attente, élèves, avancement moyen, sections les moins terminées (tout cela est déjà calculé par `stats_admin_espace`), plus source des inscrits (A3), inactifs (D2), questions sans réponse (D6) | n8n (Schedule) + route produit qui appelle les fonctions SQL existantes | Moyenne, mais faible effort / S | Les revenus dépendent du montant réel : **Dépend de Chariow** (voir 3.3, point 6). Objectif "20 distributeurs formés" à définir (question 8) | Aucune pour la version de base |
| F2 | Digest quotidien "ce qui attend Zézé" | Chaque matin | Un seul e-mail regroupant B1, C5, D6, E2, E3 (rien à faire = pas d'e-mail) | n8n + route produit | Haute : remplace l'ouverture quotidienne de `/admin` / S à M | Aucune | Aucune |
| F3 | Santé des automatisations | Erreur dans un workflow n8n | E-mail immédiat à Zézé avec le nom du workflow (Error Trigger commun) | n8n | Haute : aujourd'hui les échecs de paiement sont silencieux / S | Exigence de la méthode (étape 7), non respectée à ce jour | Aucune |

### Parcours 7 : Contenu

| ID | Automatisation | Déclencheur | Action et canal | Outil | Valeur / Effort | Dépendances et risques | Migration |
|---|---|---|---|---|---|---|---|
| G1 | "Nouvelle leçon disponible" | Une section reçoit son contenu ou sa vidéo | Notification et e-mail aux élèves de l'espace | SQL + n8n | Moyenne : utile pour Bâtisseur Pro dont les vidéos arrivent au fil de l'eau / M | Il faut distinguer "publiée" de "en cours d'édition" pour ne pas notifier chaque modification | **NOUVELLE MIGRATION** : indicateur ou date de publication sur `sections` (à vérifier avec `contenu` et `video_path` existants) |
| G2 | Publication programmée de leçons ou de prompts | Date | Rendre visible à date fixe | SQL | Faible : le modèle actuel est en libre accès à son rythme, le vrai blocage du chargement des 31 leçons et 55 prompts est ta relecture, pas un manque d'outil | Pas recommandé | Aucune |
| G3 | Brouillon d'article généré chaque semaine | Planning hebdo | Un brouillon dans `contenus`, alerte à Zézé (via E2). **Jamais publié seul** | Routine planifiée (skill `contenu-vivier-ia`) | Moyenne, réalise la décision du 2026-09-16 d'un agent programmé / M | Coût d'appel au modèle à prévoir, veille d'actualité à filtrer | Aucune |
| G4 | "Nouvel article publié" | Passage d'un article à `publie` | Notification et e-mail aux membres | SQL + n8n | Faible à moyenne / S | Même limite de type de notification que B2 | Comme D4 |

### Parcours 8 : Lien avec l'écosystème (seulement ce qui est pertinent)

- **YouTube** : la mesure de source (A3) est le vrai lien utile. Rien d'autre à automatiser maintenant.
- **LinkedIn** : un témoignage avec consentement de partage (D5) peut nourrir l'agent LinkedIn, mais la reprise reste manuelle. Reporter.
- **Chatllow** : le workflow de notification du diagnostic Chatllow sert de modèle technique (webhook vers SMTP), rien à relier. La vitrine Chatllow dans Vivier Academies est une brique future du cadrage principal.
- **Longrich** : l'objectif "20 distributeurs formés" se lit dans le rapport hebdomadaire (F1), pas besoin d'automatisation propre.
- L'agent IA de veille sociale reste une extension distincte, à cadrer séparément.

---

## 6. Priorisation recommandée et découpage en lots

### 6.1 Constat honnête avant l'ordre

Aujourd'hui la plateforme n'a pas de vrais élèves : un seul compte, des paiements de test, les 31 leçons de Vivier IA pas encore chargées. Le goulot d'étranglement est l'acquisition (tes vidéos), pas la rétention. Les automatisations d'engagement (série de jours, relance d'inactifs) seraient prématurées. Ce qui compte d'abord : qu'un visiteur qui paie obtienne son accès, que quelqu'un qui demande à rejoindre reçoive une réponse, et que tu sois prévenu sans avoir à ouvrir `/admin`.

### 6.2 Lots proposés (chacun petit, testable seul, sans dépendre du suivant)

| Lot | Contenu | Migration | Effort | Pourquoi à cette place |
|---|---|---|---|---|
| **1. Fiabiliser la chaîne de paiement** | C0, F3 (Error Trigger commun sur les 3 workflows), correctif de `accorderAccesPayant` (3.3, point 7) | Aucune | S à M | Le pire échec possible est un client qui paie sans accès. Et rien de ce qui touche au paiement ne peut être construit dessus tant que ce n'est pas prouvé |
| **2. Boucler l'adhésion** | B1, B2 (e-mail seulement) | Aucune | S | Le visiteur et toi savez enfin ce qui se passe. Aucune migration, on réutilise le mécanisme du tunnel (option A) |
| **3. Bienvenue et alerte de vente** | C1, C3, puis C2 si Chariow n'envoie pas déjà un reçu | Aucune | S | La suite naturelle du lot 1. C1 et C3 sont indépendants de Chariow |
| **4. Pilotage sans ouvrir `/admin`** | F2 (digest quotidien avec B1, C5, D6, E2, E3), F1 (rapport hebdo) | Aucune | S à M | Première tâche planifiée, premier usage de la route protégée par secret côté produit |
| **5. Relance de panier abandonné** | C4 | Aucune | M | Dépend de Chariow, à faire quand du trafic réel arrive et que le Pulse est fiable |
| **6. Socle d'envois planifiés** | Journal `messages_sortants`, table `contacts_membres`, A3, A4, A2, D7, D8, E1 en option C | **NOUVELLE MIGRATION 0032** (deux tables) | M à L | Premier lot avec migration : on ne le déclenche que quand les besoins de relance et de rappels sont réels |
| **7. Engagement des élèves** | D1, D2, D4, D5 | **NOUVELLE MIGRATION 0033** (types de notification) | M à L | À déclencher quand il y a des élèves à engager, et pas avant que les leçons de Vivier IA soient chargées (question 6) |
| **8+. Contenu et extras** | G1, G3, G4, C6 si une politique de remboursement est décidée, D3 | Selon le cas | M chacun | Après validation de l'intérêt réel |

### 6.3 Choix qui t'appartiennent, avec pour et contre

1. **Lot 1 (invisible) avant lot 2 (visible).** Pour : sécuriser le chemin qui rapporte de l'argent et qui est cassé aujourd'hui. Contre : rien de visible au premier lot, et le lot 2 t'apporterait un effet concret plus tôt. Les deux sont indépendants, tu peux les intervertir. Ma recommandation : lot 1 d'abord.
2. **Mécanisme d'événement A ou C (4.2).** A pour les premiers lots : simple mais sans reprise en cas de panne de n8n. C plus tôt : plus robuste mais une table et deux routes avant la première valeur. Ma recommandation : A jusqu'au lot 5, C au lot 6.
3. **n8n ou produit pour l'envoi.** n8n : tu modifies les textes sans code, cohérent avec ta formation (Module 2), mais un seul serveur à surveiller. Tout dans le produit : moins de pièces, mais il faut un envoi d'e-mail et des tâches planifiées dans l'application, et les textes deviennent du code. Ma recommandation : n8n, avec Error Trigger dès le lot 1.
4. **WhatsApp automatique ou assisté.** Assisté (`wa.me`) : gratuit, immédiat, personnalisable, mais manuel. API : automatique, mais numéro dédié, validation Meta, modèles approuvés, coût. Ma recommandation : assisté maintenant, API plus tard.
5. **Attendre le trafic pour l'engagement (lot 7).** Pour : éviter de construire pour zéro élève. Contre : si la première cohorte arrive sans relance, tu perds les premiers élèves, ceux qui font les témoignages. Seuil proposé : dès une dizaine d'élèves payants actifs.

---

## 7. Données et migrations nouvelles (récapitulatif)

Aucune de ces migrations n'est créée par ce cadrage. Elles se décident lot par lot.

| Migration proposée | Lot | Contenu | Points de vigilance |
|---|---|---|---|
| **0032 (NOUVELLE)** table `messages_sortants` | 6 | `profil_id`, `type`, `clé` (par exemple identifiant de la masterclass), `canal`, `espace_id`, `statut`, date. Unicité sur (profil, type, clé) pour ne jamais envoyer deux fois. Sert aussi de plafond de relances | RLS activée sans aucune policy pour les membres : uniquement `service_role` |
| **0032 (NOUVELLE)** table `contacts_membres` | 6 | `profil_id`, téléphone WhatsApp, consentement, préférence "relances oui ou non", espace d'origine, source | **Jamais dans `profils`** (3.3, point 5). RLS : un membre lit et modifie seulement sa ligne. Consentement explicite |
| **0033 (NOUVELLE)** types de notification | 7 (ou 2 si B2 en notification interne) | Étendre la contrainte de `type` dans `notifications` (jalon, adhésion, contenu...), rendre `acteur_id` facultatif | Les index uniques existants (0029) doivent rester valides |
| **(NOUVELLE)** statut de remboursement | 8+ | Ajouter `rembourse` aux statuts de `paiements` | Seulement si C6 est retenu |
| **(NOUVELLE)** publication de section | 8+ | Indicateur ou date de publication sur `sections` | Seulement si G1 est retenu |
| **(NOUVELLE)** durée d'accès | Sans objet | Date de fin sur `acces_payant` | Seulement si l'accès n'est plus à vie (question 4) |

Nouvelles routes du produit (pas des migrations) à partir du lot 4 : des routes protégées par secret partagé, sur le modèle de `WEBHOOK_PAIEMENT_SECRET`, qui renvoient les candidats calculés par le produit. Le secret vit dans `.env.local` côté produit et dans un credential n8n, jamais dans le chat.

Nouveaux credentials n8n : aucun jusqu'au lot 5 (le SMTP existant suffit). WhatsApp Business demanderait un credential dédié.

---

## 8. Points ouverts, hypothèses

### Points ouverts (à trancher, les défauts sont dans le rapport de mission)

1. L'extension de la répartition : n8n envoie et planifie (section 2).
2. Mécanisme d'événement A puis C (4.2).
3. Canal WhatsApp : assisté d'abord, API plus tard (4.3).
4. Accès à vie ou durée limitée (C7).
5. Remboursement : retrait automatique ou décision manuelle (C6).
6. À partir de quand construire l'engagement des élèves (lot 7).
7. Identité d'envoi des e-mails : la boîte Gmail personnelle actuelle ou un domaine dédié (crédibilité, volume, délivrabilité) avant que le volume augmente.
8. Définition de l'objectif "20 distributeurs formés" pour le rapport (par défaut : accès payant actif dans Bâtisseur Pro).

### Hypothèses posées, marquées à confirmer

- Le Pulse Chariow est peut-être désactivé et l'option Raw Body du nœud Webhook est probablement la cause de l'erreur HMAC (à confirmer lors du lot 1, avec toi).
- Un e-mail de confirmation n'est pas envoyé à l'inscription par Supabase Auth, ou l'est avec le modèle par défaut (à vérifier avant A1).
- Chariow envoie peut-être déjà un reçu (à vérifier avant C2).
- Le SMTP de n8n est un compte Gmail personnel, avec ses limites d'envoi quotidiennes (à confirmer).
- Les textes sortants sont écrits en français, tutoiement, ton direct, et paramétrés par espace (jamais de "Longrich" côté Bâtisseur Pro).
- L'e-mail sert pour tout ce qui est transactionnel ; toute relance porte un moyen de s'en désinscrire.
- Bâtisseur Pro n'a pas d'élève payant tant que son identifiant produit Chariow n'est pas branché : tout ce qui concerne le paiement concerne pour l'instant Vivier IA seulement.

---

## 9. Hors périmètre

- **Chariow** : le choix de l'agrégateur, le Mobile Money en Guinée, la synchronisation du prix, le branchement de Bâtisseur Pro (identifiant produit). Seules les automatisations qui en dépendent sont marquées.
- Paiement en tranches (écarté), suspension de membre, suppression de messages privés (non inclus au cadrage).
- Modération par IA du contenu, agent de veille sociale et prospection sortante automatisée sur les réseaux (extension distincte).
- Vitrine Chatllow dans Vivier Academies, plateforme Chatllow autonome.
- Publication automatique d'articles (décision du 2026-09-16 : jamais).
- Toute lecture par l'admin d'une conversation privée.
- Refonte du produit, nouvelles fonctionnalités de communauté.

---

## 10. Prompt de construction proposé pour le lot 1 (à valider avant exécution)

Gabarit à 4 éléments. Ce lot touche ton compte Chariow et ton instance n8n : il se déroule **pas à pas en direct avec toi**, une étape à la fois, jamais une liste à exécuter seul.

**Contexte**
Vivier Academies (`livrables/applications/2026-09_plateforme-formation-communaute/`, Next.js 16 + Supabase, déployée sur Vercel). Le chemin de paiement est orchestré par n8n (VPS Hostinger) : le workflow "Paiement Chariow - Vivier IA" crée la session Chariow, le workflow "Confirmation Paiement Chariow - Vivier IA" (`zYICF7ABAM79pr8R`) doit recevoir le Pulse `successful.sale`, vérifier la signature HMAC, puis appeler `/api/webhooks/paiement` qui active `acces_payant`. D'après `CADRAGE-AUTOMATISATIONS.md` (3.3), ce second workflow n'a aucune exécution réussie : le nœud "Calculer HMAC attendu" ne reçoit pas le corps brut en binaire. Chariow désactive un Pulse après 5 échecs de livraison, il est peut-être coupé. Aucun secret ne se colle dans le chat : les secrets se lisent dans `.env.local` ou se saisissent par toi dans n8n.

**Objectif**
Prouver, avec un test, qu'un `successful.sale` réel ou simulé correctement signé active l'accès payant de bout en bout, et qu'un échec dans n'importe lequel des workflows te prévient par e-mail. Résultat attendu : à la fin, tu peux dire avec certitude "si quelqu'un paie, il a son accès, et si ça casse je le sais".

**Périmètre**
Inclus :
1. Vérifier avec toi dans le tableau de bord Chariow que le Pulse est actif, le réactiver sinon.
2. Corriger la réception du corps brut et la vérification HMAC dans le workflow de confirmation, et faire répondre 200 aux événements autres que `successful.sale` (`abandoned.sale`, `failed.sale`) sans erreur.
3. Tester en isolant chaque partie : un appel signé au webhook n8n, puis la route `/api/webhooks/paiement` sur un paiement de test, puis la chaîne complète, et vérifier l'effet visible dans le produit (accès actif, statut `confirme`).
4. Empêcher qu'un événement d'échec rétrograde un paiement déjà `confirme` dans la route.
5. Créer un workflow d'erreur commun (Error Trigger vers e-mail à toi, avec le nom du workflow) et le rattacher aux trois workflows Vivier Academies et Chatllow.
6. Corriger la recherche par e-mail de `accorderAccesPayant` pour qu'elle ne dépende pas de la première page de `listUsers()`.

Exclus : tout ce qui concerne le choix de Chariow, Mobile Money, le prix, Bâtisseur Pro, les e-mails de bienvenue ou de reçu, toute migration, tout nouveau workflow autre que le workflow d'erreur.

**Autonomie**
Lecture libre du code, de la base (lecture seule) et de n8n (lecture seule). Avant toute modification d'un workflow en production ou de la route, tu annonces le plan et j'attends ta validation. Les modifications du workflow de confirmation, la réactivation du Pulse et la création du workflow d'erreur se font en dialogue, une étape vérifiée à la fois. Modifier le code du produit (points 4 et 6) est autorisé après validation du plan, avec un commit à part que tu valides. Aucun paiement réel sans ton accord explicite sur le montant. Si une étape échoue ou révèle autre chose que prévu, on s'arrête et on te le dit avant de continuer.

Mode d'exécution : cycle Plan, Execute, Validate. Validation réelle avant de déclarer terminé, jamais supposée.

---

## Historique

**2026-09-20** : premier cadrage des automatisations, à la demande de Zézé ("cadrer les automatisations de la plateforme, il garde d'abord Chariow pour le moment"). Vérifié dans le code (migrations 0001 à 0031, routes, actions admin), dans n8n (3 workflows et historique d'exécutions, lecture seule) et dans la documentation Chariow (types d'événements Pulse). Aucun fichier existant, aucun workflow et aucune donnée n'ont été modifiés.
