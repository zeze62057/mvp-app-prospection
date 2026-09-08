# Kora — mise en place Supabase

> Objectif : passer l'app du mode démo (données en mémoire) au mode live
> (Postgres + Auth + RLS). Aucune ligne de commande, tout se fait dans l'interface
> supabase.com.

---

## 1. Créer le projet

1. Aller sur https://supabase.com, se connecter, **New project**.
2. Nom : `kora`. Choisir une région proche (Europe de l'Ouest par exemple).
3. Définir un mot de passe de base de données (le noter, il n'est pas réutilisé par l'app).
4. Attendre la fin du provisioning (1 à 2 minutes).

## 2. Créer le schéma

1. Menu de gauche : **SQL Editor** → **New query**.
2. Copier tout le contenu de [`schema.sql`](schema.sql), coller, **Run**.
3. Vérifier qu'il n'y a pas d'erreur. Le panneau **Table Editor** doit maintenant
   montrer `agents`, `prospects`, `interactions`, `changements_statut`.

## 3. Activer la connexion par email et mot de passe

1. Menu **Authentication** → **Providers** → **Email** : activé (c'est le défaut).
2. **Authentication** → **Providers** → **Email** → décocher **Confirm email**
   si vous voulez pouvoir vous connecter sans passer par un lien de confirmation
   (pratique pour le MVP, à réactiver plus tard).

## 4. Créer l'agent BONJOUR

1. **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email et mot de passe de BONJOUR. Cocher **Auto Confirm User**.
3. Le trigger `on_auth_user_created` crée automatiquement la ligne dans `agents`.
4. Copier l'**UID** de l'utilisateur (colonne UID dans la liste).

## 5. Charger les données de démonstration (facultatif)

1. Ouvrir [`seed.sql`](seed.sql), remplacer la valeur de `v_bonjour` par l'UID copié.
2. SQL Editor → coller → **Run**. 7 prospects et 12 interactions sont créés.

Sans cette étape, l'app démarre avec un portefeuille vide (l'état vide s'affiche).

## 6. Brancher le front

1. **Project Settings** → **API**. Relever :
   - **Project URL** (`https://xxxx.supabase.co`)
   - **Project API keys** → clé **anon public** (jamais `service_role`).
2. Ouvrir `../app/config.js` et renseigner `supabaseUrl` et `supabaseAnonKey`.
3. Recharger `../app/auth.html` dans le navigateur, se connecter avec l'email et
   le mot de passe de BONJOUR. Redirection vers le tableau de bord.

Tant que `config.js` reste vide, l'app continue de tourner en mode démo.

## 7. Tester le tunnel public

- Ouvrir `../app/index.html` (ou `index.html?agent=bonjour`), remplir le formulaire.
- Le RPC `soumettre_prospect_public` crée un prospect au statut `nouveau`,
  `mode_creation = 'formulaire_public'`, rattaché à l'agent dont le `slug` est `bonjour`.
- Il apparaît dans le tableau de bord de BONJOUR après rechargement.

---

## Ce que fait le schéma

| Élément | Rôle |
|---|---|
| `prospect_statut` (enum) | Les 7 statuts du pipeline, dans l'ordre |
| `mode_creation_prospect` (enum) | `manuel` ou `formulaire_public` |
| `agents.parrain_id` | Hiérarchie multi-niveaux (racine = BONJOUR, `parrain_id` nul) |
| `agents.slug` | Identifiant d'agent porté par l'URL de la landing publique |
| `est_dans_ma_downline()` | Fonction récursive, `SECURITY DEFINER`, utilisée par la RLS |
| Trigger `prospects_log_statut` | Écrit une ligne `changements_statut` à chaque création et chaque changement de statut |
| Trigger `interactions_touch_prospect` | Met à jour `prospects.updated_at` à chaque interaction (pilote « dernier contact ») |
| Trigger `on_auth_user_created` | Crée la ligne `agents` à l'inscription |
| Policies RLS | Lecture pour le propriétaire et toute sa downline, écriture pour le propriétaire seul |
| `soumettre_prospect_public()` | RPC `SECURITY DEFINER` appelable avec la clé anon, pour le formulaire public |

## ⚠️ À valider

- **Inscription de nouveaux agents.** Le schéma crée le profil à l'inscription, mais aucun écran d'inscription n'est fourni. À décider : inscription ouverte, ou création manuelle par BONJOUR dans le dashboard Supabase, ou page d'invitation.
- **Rattachement du parrain.** `parrain_id` doit être renseigné à la main pour l'instant (Table Editor). Un vrai flux d'affiliation reste à définir.
- **Slug des agents.** Défini à la main. Un agent sans `slug` ne peut pas recevoir de prospects via formulaire public.
- **Anti-spam du formulaire public.** Le RPC n'a ni captcha ni limitation de débit. À ajouter avant une vraie mise en ligne.
- **Confirmation d'email.** Désactivée pour le MVP dans les étapes ci-dessus. À rétablir ensuite.
- **Downline récursive.** Implémentée en fonction récursive. Si le volume d'agents devient important, envisager une table de fermeture (voir `../schema-base-de-donnees.md`).
- **Réattribution et suppression de prospects.** Politiques `update`/`delete` réservées au propriétaire. Pas de réattribution possible en l'état.
