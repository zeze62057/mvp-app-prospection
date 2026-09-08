# Kora — Veille réseaux sociaux

> Ajout du 2026-09-08. Détecter les interactions de prospects potentiels
> (commentaires, likes) sur les publications d'un agent, et proposer un
> message de premier contact pré-rempli, envoyé **manuellement**.

Ce document décrit ce qui est livré, ce qui fonctionne tout de suite, et
les **limites réelles des API Facebook et TikTok** qui conditionnent le reste.

---

## 1. Résumé exécutif

| Fonction demandée | État |
|---|---|
| Écran paramètres avec « Connecter Facebook » / « Connecter TikTok » | **Livré** (bouton TikTok désactivé, voir §4) |
| Personnalisation du message par agent, avec lien de tunnel injecté | **Livré et fonctionnel** (démo + live) |
| Flux de notifications dans l'espace agent | **Livré et fonctionnel** (démo + live) |
| Bouton « Envoyer le message » : texte pré-rempli + copie + ouverture plateforme | **Livré**, envoi 100 % manuel |
| Saisie manuelle d'une interaction repérée | **Livré et fonctionnel** |
| Détection **automatique** des commentaires Facebook | **Code livré**, ne s'active qu'après hébergement HTTPS + App Review Meta (§3) |
| Détection automatique des **likes** Facebook | **Partiel / non fiable** (§3.6) |
| Détection automatique TikTok (likes ou commentaires) | **Impossible** : aucune API ne l'expose (§4) |
| Envoi automatique de DM | **Volontairement non fait** : interdit par le cahier des charges, et techniquement bloqué par les plateformes (§5) |

En clair : le **socle** (message perso + notifications + saisie manuelle +
flux d'envoi manuel) est utilisable immédiatement. La **détection auto
Facebook** est prête en code mais dépend d'étapes côté Meta qui prennent
des jours à des semaines. La **détection auto TikTok** ne sera pas livrable
tant que TikTok n'ouvre pas d'API de commentaires, ce qui n'est pas le cas
aujourd'hui.

---

## 2. Ce qui est livré

### Front (`app/`)

| Fichier | Rôle |
|---|---|
| `parametres.html` / `parametres.js` | Écran Paramètres : connexions sociales + éditeur du message de premier contact avec aperçu en direct |
| `notifications.html` / `notifications.js` | Flux de veille : liste des interactions, bouton « Envoyer le message », saisie manuelle, conversion en prospect |
| `kora-store.js` | Nouvelles API `Kora.settings`, `Kora.social`, `Kora.notifications` (implémentées en mode démo **et** en mode live) |
| `config.js` | Nouveaux champs `publicBaseUrl`, `facebookAppId`, `facebookOauthCallback` |
| `app.html` / `app.js` / `prospect.html` | Navigation vers « Veille » et « Paramètres », pastille de la cloche sur les non-lus |

Le jeton `[lien]` du message est remplacé par
`<publicBaseUrl>/index.html?agent=<slug>` (ou, si `publicBaseUrl` est vide,
une URL déduite de la page courante). **Note** : la spec initiale parlait de
`prospect.html?slug` ; c'est `index.html?agent=<slug>` qui est le tunnel
public (page de capture). `prospect.html` est l'écran interne de détail.

### Base de données

`supabase/migration-veille-sociale.sql` ajoute :

- `agents.message_modele` : le texte par agent, avec un `default` = le texte demandé.
- `connexions_sociales` : jetons OAuth. **RLS activée, aucune policy** → totalement
  inaccessible via l'API REST. Seules les fonctions Edge (service role) y touchent.
  Les jetons ne transitent **jamais** par le navigateur.
- `oauth_nonce` : jeton anti-CSRF à usage unique pour le flux « Connecter ».
- `notifications` : une ligne par interaction, RLS « chaque agent voit / modifie les siennes ».
- RPC `mon_statut_social()` : renvoie des booléens et libellés publics, pas les jetons.
- RPC `deconnecter_compte_social(reseau)`.

### Fonctions Edge (`supabase/functions/`)

| Fonction | Rôle | `verify_jwt` |
|---|---|---|
| `fb-oauth-start` | Crée le nonce, renvoie l'URL du dialogue OAuth | `true` |
| `fb-oauth-callback` | Échange le code, récupère la Page, abonne au webhook, stocke les jetons | `false` |
| `fb-webhook` | Reçoit les commentaires en temps réel de Facebook | `false` |
| `fb-poll` | Voie fiable : lit périodiquement les commentaires via la Graph API | `false` (protégé par `x-cron-secret`) |

---

## 3. Facebook : procédure de mise en production

### 3.1 Prérequis non négociables

1. **Le compte à surveiller doit être une Page Facebook**, pas un profil
   personnel. Depuis 2018, l'API ne donne **aucun** accès aux publications
   ni aux interactions d'un profil personnel.
2. **L'app Kora doit être hébergée en HTTPS sur un vrai domaine.** `file://`
   et `localhost` sont refusés par Meta en production (localhost est toléré
   en mode développement uniquement). Tant que l'app est ouverte par
   double-clic, **rien de ce module ne peut fonctionner**.
3. Une **politique de confidentialité** accessible en ligne (URL publique).
4. Un compte **Meta for Developers** + une **Business Manager** vérifiée
   pour les permissions avancées.

### 3.2 Créer l'app Meta

1. https://developers.facebook.com → *Mes apps* → *Créer une app* → type **Entreprise**.
2. Ajouter les produits : **Connexion Facebook** et **Webhooks**.
3. *Paramètres → De base* : renseigner domaine, URL de politique de
   confidentialité, e-mail de contact, icône.
4. *Connexion Facebook → Paramètres* : ajouter l'URI de redirection OAuth
   **exacte** :
   `https://<projet>.supabase.co/functions/v1/fb-oauth-callback`

### 3.3 Permissions et App Review

Permissions demandées par `fb-oauth-start` :

| Permission | Utilité | App Review ? |
|---|---|---|
| `pages_show_list` | Lister les Pages de l'agent | Oui |
| `pages_read_engagement` | Lire commentaires / réactions d'une Page | Oui |
| `pages_read_user_content` | Lire le contenu publié par des tiers (commentaires) | Oui |

**App Review = validation manuelle par Meta.** Il faut fournir :

- une capture vidéo (screencast) montrant le parcours complet : un agent
  connecte sa Page, un commentaire apparaît dans Kora, l'agent copie le
  message et répond ;
- une description écrite du cas d'usage ;
- la vérification de l'entreprise (documents légaux).

**Délai réel : de quelques jours à plusieurs semaines**, avec allers-retours.
Les usages « prospection / marketing de réseau / automatisation » sont
**régulièrement refusés ou demandent des justifications supplémentaires**.
Tant que l'app est en **mode développement**, seules les personnes ayant un
**rôle sur l'app** (admin, testeur) peuvent la connecter : c'est suffisant
pour que **Zézé teste avec sa propre Page**, pas pour de vrais filleuls.

### 3.4 Webhook

1. *Webhooks → Page* → *S'abonner à cet objet*.
2. URL de rappel : `https://<projet>.supabase.co/functions/v1/fb-webhook`
3. *Verify token* : une chaîne au hasard, à mettre aussi dans le secret
   `FB_WEBHOOK_VERIFY_TOKEN`.
4. Champ à cocher : **`feed`**.

`fb-oauth-callback` abonne ensuite automatiquement la Page de l'agent
(`POST /{page-id}/subscribed_apps?subscribed_fields=feed`).

### 3.5 Secrets Supabase à définir

```
supabase secrets set \
  FB_APP_ID=xxxxxxxxxxxx \
  FB_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  FB_WEBHOOK_VERIFY_TOKEN=une-chaine-au-hasard \
  APP_PUBLIC_URL=https://kora.gn/app \
  CRON_SECRET=une-autre-chaine-au-hasard
```

`SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` sont injectés automatiquement
dans les fonctions Edge.

Dans `app/config.js` :

```js
publicBaseUrl: "https://kora.gn/app",
facebookAppId: "xxxxxxxxxxxx",
```

### 3.6 Déploiement et cron

```
supabase functions deploy fb-oauth-start
supabase functions deploy fb-oauth-callback --no-verify-jwt
supabase functions deploy fb-webhook --no-verify-jwt
supabase functions deploy fb-poll --no-verify-jwt
```

`config.toml` (à fusionner avec le vôtre) :

```toml
[functions.fb-oauth-start]
verify_jwt = true
[functions.fb-oauth-callback]
verify_jwt = false
[functions.fb-webhook]
verify_jwt = false
[functions.fb-poll]
verify_jwt = false
```

Cron toutes les 15 minutes (SQL Editor, extension `pg_cron` + `pg_net`) :

```sql
select cron.schedule(
  'kora-fb-poll',
  '*/15 * * * *',
  $$ select net.http_post(
       url    := 'https://<projet>.supabase.co/functions/v1/fb-poll',
       headers:= jsonb_build_object('x-cron-secret', '<CRON_SECRET>')
     ); $$
);
```

`fb-poll` est la **voie fiable**. Le webhook est un bonus temps réel : Meta
peut le désactiver en cas d'erreurs répétées, d'où le poller en filet.

### 3.7 Limites réelles de la Graph API (à connaître avant de promettre)

- **Identité du commentateur** : la Graph API renvoie un **nom d'affichage**
  et un **PSID** (identifiant propre à la Page). **Pas de lien de profil,
  pas d'e-mail, pas de téléphone.** Si Meta ne renvoie pas le nom (réglages
  de confidentialité de la personne), Kora affiche « Profil non communiqué
  par Facebook » et **n'invente rien**.
- **Likes / réactions sur une publication** : `/{post-id}/reactions` ne
  renvoie de façon fiable qu'un **total**, pas la liste des personnes.
  `fb-poll` ne traite donc **que les commentaires**. Le webhook `feed`
  remonte bien un évènement `reaction`, mais souvent **sans identité** →
  notification créée avec nom vide, valeur limitée. À considérer comme
  « best effort », pas comme une fonctionnalité garantie.
- **Quotas** : rate limiting « Business Use Case » par Page. Ordre de
  grandeur : ~200 appels/heure × nombre d'utilisateurs, fenêtre glissante,
  variable selon l'ancienneté et la réputation de l'app. Un poll toutes les
  15 min sur 25 publications reste très en dessous. En cas de dépassement,
  Graph renvoie le code d'erreur 4 ou 17 ; `fb-poll` le remonte dans son
  rapport JSON.
- **Expiration des jetons** : le jeton Page dérivé d'un jeton utilisateur
  longue durée est en pratique long-lived, mais peut être invalidé si
  l'agent change son mot de passe, retire l'app, ou si Meta force une
  reconnexion. Prévoir une reconnexion manuelle depuis Paramètres (le
  bouton « Déconnecter » puis « Connecter » suffit).
- **Commentaires imbriqués / masqués / supprimés** : `fb-webhook` ignore
  `verb != "add"`. Les réponses à commentaires arrivent aussi ; elles sont
  traitées comme des commentaires normaux.

---

## 4. TikTok : pourquoi la détection n'est pas livrable

Ce n'est pas un choix de périmètre, c'est une limite de l'API.

| Produit TikTok | Ce qu'il permet | Commentaires / likes ? |
|---|---|---|
| **Login Kit** (OAuth) | Authentifier l'utilisateur | Non |
| **Display API** | Lister **ses propres** vidéos publiques, profil de base (`user.info.basic`, `video.list`) | **Non** : aucune donnée sur les commentaires ni sur les personnes qui likent |
| **Content Posting API** | Publier des vidéos | Non |
| **Research API** | Requêter des commentaires publics | Réservé aux **institutions académiques US/EU**, sur dossier ; pas d'usage commercial ni de suivi temps réel d'un compte |
| **Marketing API / TikTok for Business** | Gérer les commentaires **sur ses propres publicités** | Seulement les annonces payantes, partenariat requis |

**Aucune** de ces API ne permet à un créateur de savoir, via programme, qui
a liké ou commenté une de ses vidéos organiques. Il n'y a pas non plus
d'API de messagerie directe. Construire un « monitoring TikTok » reviendrait
à simuler un comportement qui ne marchera jamais en production, ce que le
cahier des charges interdit explicitement.

**Ce qui est livré pour TikTok** : le bouton « Connecter TikTok » est
présent mais **désactivé**, avec une note qui explique la situation et
renvoie vers la **saisie manuelle**. Si TikTok ouvre une API de
commentaires plus tard, la structure (`connexions_sociales.tiktok_*`,
`notifications.source = 'tiktok'`) est déjà prête.

**Piste réaliste si la veille TikTok devient prioritaire** : la saisie
manuelle assistée (l'agent regarde ses notifications TikTok dans l'app
officielle et enregistre en deux clics dans Kora), déjà disponible dans
l'onglet Veille.

---

## 5. Sécurité et conformité

- **Aucun envoi automatique.** Le bouton « Envoyer le message » se limite à :
  pré-remplir le texte (avec le lien du tunnel), le copier dans le
  presse-papiers, et ouvrir la publication ou Messenger. L'agent envoie
  lui-même. L'automatisation complète des DM est **interdite** dans cette
  mission (risque de blocage des comptes) et, de toute façon, Facebook
  n'autorise pas d'ouvrir une conversation pré-remplie vers un
  commentateur : il faut que la personne ait écrit à la Page en premier,
  dans une fenêtre de 24 h.
- **Jetons jamais exposés au navigateur.** `connexions_sociales` et
  `oauth_nonce` ont la RLS active **sans aucune policy**. Le front ne lit
  jamais un jeton ; il passe par `mon_statut_social()` qui ne renvoie que
  des booléens et des noms de Page.
- **Nonce anti-CSRF** à usage unique et valable 10 minutes sur le flux OAuth.
- **`fb-poll` protégé** par un secret d'en-tête (`x-cron-secret`).
- **Pas d'invention de données prospect.** Si l'API ne renvoie pas le nom,
  le champ reste vide et l'interface l'indique.
- **RGPD / Guinée** : les noms de commentateurs récupérés via l'API sont des
  données personnelles. Prévoir la mention dans la politique de
  confidentialité et une purge des `notifications` anciennes (non fait ici,
  à trancher).

---

## 6. Comment tester

### Maintenant, sans rien déployer (mode démo)

1. Ouvrir `app/notifications.html` : trois interactions d'exemple, testez
   « Envoyer le message » (copie + aperçu du lien), « Ajouter aux
   prospects », « Enregistrer une interaction ».
2. Ouvrir `app/parametres.html` : modifiez le message, vérifiez l'aperçu,
   « Simuler la connexion » pour voir l'état connecté.

### En live, socle uniquement

1. Passer `supabase/migration-veille-sociale.sql` dans le SQL Editor.
2. Se connecter comme agent : le message par défaut est en base, la saisie
   manuelle et le flux d'envoi fonctionnent. Les boutons « Connecter »
   affichent la raison pour laquelle ils sont inactifs.

### En live, détection Facebook

Uniquement après §3 complet (hébergement HTTPS + app Meta + App Review, ou
test en mode développement avec la Page de Zézé).

---

## 7. Reste à trancher

- Choix de la Page quand un agent en administre plusieurs (MVP : la première).
- Politique de rétention des `notifications`.
- Reconnexion automatique à l'expiration du jeton Page (MVP : manuelle).
- Faut-il notifier l'agent (push / e-mail) ou seulement la pastille en app ?
- Traitement des réactions Facebook sans identité : les garder ou les filtrer ?
