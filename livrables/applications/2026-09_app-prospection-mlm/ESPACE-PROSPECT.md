# Kora — Espace prospect, communauté et meetings

> Ajout du 2026-09-08. Décision : **fondations d'abord**. Les prospects
> doivent pouvoir se connecter avant qu'on ouvre une communauté et des
> meetings. Mécanisme de connexion retenu : **lien d'accès envoyé par
> WhatsApp** (aucun provider email/SMS, l'agent envoie le lien lui-même).

Ce document suit l'avancement, étape par étape.

---

## Ce qui existait déjà et n'existe PAS (rappel)

| Supposé par la demande | Réalité |
|---|---|
| Connexion des prospects | N'existait pas. **Construite à l'étape 1 ci-dessous.** |
| Canal de message individuel automatique (WhatsApp/email) | N'existe pas. 360dialog en pause, pas d'email. L'invitation individuelle = texte + lien pré-remplis, envoyés à la main par l'agent (comme la veille). |
| Système de relance à fréquence variable ("tous les 2-3 jours", "suivi 1 mois") | **N'existe pas dans le code.** Aucun cron, aucun champ. Classé "amélioration future" dans `fonctionnalites-mvp.md`. L'étape 3 posera un drapeau `présent → relance quotidienne`, mais **aucun moteur ne l'appliquera** tant que le système de relance n'est pas construit. |
| Règles de modération de la communauté | **Non définies.** Décision prise pour la v1 : chacun supprime ses propres messages, BONJOUR peut supprimer n'importe quel message. Signalement, bannissement, contenu interdit : **non traités**, à définir. |

---

## Étape 1 — Connexion prospect (livrée, à tester)

### Principe

1. Sur la fiche d'un prospect, l'agent clique **« Générer le lien d'accès »**.
2. L'app appelle la RPC `creer_acces_prospect(prospect_id)` → un jeton à
   usage unique (valable 7 jours) est créé, l'agent obtient un message
   pré-rempli avec le lien `.../rejoindre?t=<jeton>`.
3. L'agent copie ce message et l'envoie au prospect par WhatsApp.
4. Le prospect ouvre le lien → `rejoindre.html` appelle la fonction Edge
   `prospect-login` → compte auth créé au premier passage, jeton consommé,
   session ouverte → redirection vers `espace.html`.
5. `espace.html` : accueil du prospect (coquille ; communauté et meetings
   viendront aux étapes 2 et 3).

### Fichiers livrés

| Fichier | Rôle |
|---|---|
| `supabase/migration-espace-prospect.sql` | `prospects.user_id`, table `acces_prospect`, `est_un_agent()` / `est_un_prospect()`, RPC `creer_acces_prospect` |
| `supabase/functions/prospect-login/index.ts` | Échange le jeton contre une session (crée le compte au 1er passage) |
| `app/rejoindre.html` + `rejoindre.js` | Page d'atterrissage du lien d'accès |
| `app/espace.html` + `espace.js` | Espace prospect (coquille) |
| `app/prospect.js` | Bouton « Générer le lien d'accès » dans la fiche prospect |
| `app/kora-store.js` | `Kora.prospects.creerAccesLien(id)` |

### Sécurité / isolation

- `acces_prospect` : RLS activée **sans aucune policy** → inaccessible via
  l'API. Seules la fonction Edge (service role) et la RPC SECURITY DEFINER
  y touchent.
- `creer_acces_prospect` vérifie que l'agent est propriétaire du prospect
  (ou dans sa downline). Sinon `prospect_hors_perimetre`.
- Une **session prospect** a `auth.uid()` = `prospects.user_id`, mais
  **aucune ligne `agents`**. Les policies CRM actuelles filtrent toutes sur
  `agent_id = auth.uid()` ou `est_dans_ma_downline(...)` : une session
  prospect ne remplit ni l'un ni l'autre → elle **ne voit rien du CRM**
  (prospects, interactions, tableau de bord). Vérifié au niveau logique ;
  à re-vérifier concrètement au test.
- Compte prospect : email synthétique `p-<uuid>@prospects.kora.local`,
  jamais utilisé pour un envoi. `email_confirm: true` (pas de mail de
  confirmation).
- ⚠️ Le jeton est stocké **en clair** dans `acces_prospect`. Acceptable
  pour un MVP (table inaccessible), à hasher en v2.

### Ce que BONJOUR doit faire pour activer l'étape 1

1. **SQL** : coller `supabase/migration-espace-prospect.sql` dans
   Supabase → SQL Editor → Run. Les 3 requêtes de contrôle en fin de
   script doivent renvoyer des lignes.
2. **Fonction Edge** :
   ```
   supabase functions deploy prospect-login --no-verify-jwt
   ```
   (Aucun secret supplémentaire : `SUPABASE_URL` et
   `SUPABASE_SERVICE_ROLE_KEY` sont injectés automatiquement.)
3. **`config.js`** : `publicBaseUrl` est déjà renseigné, rien à changer.

### Test de bout en bout (à faire par BONJOUR)

1. Se connecter comme agent, ouvrir une fiche prospect qui a un numéro.
2. « Générer le lien d'accès » → un message avec un lien apparaît → Copier.
3. Ouvrir ce lien dans une **fenêtre de navigation privée** (simule le
   téléphone du prospect).
4. Attendu : « Ouverture de ton accès… » puis redirection vers
   `espace.html` avec « Bienvenue \<prénom\> ».
5. Rouvrir le **même** lien → doit afficher « Ce lien a déjà servi ».
6. Depuis la session prospect, tenter d'ouvrir `/app.html` → doit
   renvoyer vers `auth.html` ou afficher un espace vide (pas le CRM).

### Points à valider au test (je ne peux pas les vérifier sans navigateur)

- `generateLink({ type: "magiclink" })` + `verifyOtp({ token_hash })` :
  c'est le motif documenté pour une session sans email, mais à confirmer
  sur ton projet.
- La création de compte via `auth.admin.createUser` avec un email
  synthétique : vérifier qu'aucun réglage d'Auth ne la bloque
  (ex. « restrict signups », domaines email autorisés).

---

## Étape 2 — Communauté (à venir, après validation de l'étape 1)

- Tables `communaute_messages`, `communaute_membres`.
- Espace unique partagé. Agents : lecture + écriture. Prospects connectés :
  lecture + écriture (via `est_un_prospect()`).
- Trigger : passage d'un prospect à `dans_le_tunnel` → insertion dans
  `communaute_membres` + message système « X a rejoint ».
- Modération v1 : suppression de son propre message ; BONJOUR peut tout
  supprimer.
- Front : `communaute.html` (vue agent) + section dans `espace.html` (vue
  prospect).

## Étape 3 — Meetings + présence + relance (à venir)

- Tables `meetings` (`portee` `officiel` / `agent`), `meeting_participations`.
- RLS : meetings `officiel` visibles par tous ; meeting d'agent visible
  par son seul organisateur ; seul BONJOUR (`parrain_id is null`) crée un
  `officiel`.
- Création d'un meeting → annonce auto dans la communauté + message
  individuel pré-rempli par prospect ciblé (envoi manuel).
- Interface de pointage de présence après le meeting.
- Cocher « présent » → `prospects.relance_quotidienne = true` (trigger).
  **Le champ est posé, rien ne l'applique** tant que le moteur de relance
  n'existe pas → à signaler comme dépendance ouverte.

---

## Résumé pour BONJOUR (étape 1)

- **Fichier SQL à exécuter** : `supabase/migration-espace-prospect.sql`
- **Fonction Edge à déployer** : `prospect-login` (`--no-verify-jwt`)
- **Push GitHub** : **PAS ENCORE**. Le code de l'étape 1 est commité en
  local seulement ; il faut d'abord que tu testes le flux de connexion
  (voir ci-dessus). Une fois validé, je pousse sur `main` et Vercel
  redéploie.
