# Déploiement de l'app sur Vercel

> But : servir l'app en `https://` pour supprimer les blocages liés à `file://`
> (chargement Supabase, session Auth, tests fiables).

L'app est 100 % statique (HTML + CSS + JS, aucun build). Le déploiement est
donc simple, mais il demande **une action de ta part** : Claude ne peut pas
déployer (pas de CLI Vercel sur la machine, et Vercel exige une connexion à
ton compte via navigateur).

---

## Ce que Claude a préparé

- `app/vercel.json` : déclare « aucun build », sert les fichiers du dossier
  `app/` tels quels, garde les URLs en `.html`, ajoute quelques en-têtes de
  sécurité.
- Rien d'autre n'est nécessaire côté code.

---

## Étape 0 — Prérequis

1. Le dépôt doit être sur GitHub (le `git push` est en attente de l'URL du
   dépôt privé à créer). Sans ça, passe par l'**Option B** (CLI) plus bas.
2. Un compte Vercel : https://vercel.com/signup → « Continue with GitHub »
   (le plus simple, réutilise ton compte GitHub).

---

## Étape 1 — Importer le projet dans Vercel (via GitHub)

1. https://vercel.com/new
2. « Import Git Repository » → choisis le dépôt `jarvis-starter-kit`.
   (Si Vercel ne le voit pas : « Adjust GitHub App Permissions » et autorise
   l'accès au dépôt.)
3. Écran de configuration :
   - **Root Directory** : clique « Edit » et saisis
     `livrables/applications/2026-09_app-prospection-mlm/app`
   - **Framework Preset** : `Other`
   - **Build Command** : laisser vide
   - **Output Directory** : laisser vide (ou `.`)
   - **Install Command** : laisser vide
4. **Environment Variables** : **ne rien mettre** (voir la section
   « Clés Supabase » ci-dessous, c'est volontaire).
5. « Deploy ». Au bout d'environ 30 secondes, Vercel affiche l'URL, du type
   `https://jarvis-starter-kit-xxxx.vercel.app`.

Les pages seront alors :

| Page | URL |
|---|---|
| Connexion agent | `https://<ton-url>.vercel.app/auth.html` |
| Tableau de bord | `https://<ton-url>.vercel.app/app.html` |
| Détail prospect | `https://<ton-url>.vercel.app/prospect.html?id=<uuid>` |
| Formulaire public (tunnel) | `https://<ton-url>.vercel.app/index.html?agent=bonjour` |
| Paramètres | `https://<ton-url>.vercel.app/parametres.html` |
| Veille | `https://<ton-url>.vercel.app/notifications.html` |
| Diagnostic | `https://<ton-url>.vercel.app/diag.html` |

---

## Clés Supabase : pourquoi rien dans les variables Vercel

La demande initiale était de mettre les clés Supabase dans les variables
d'environnement Vercel. Sur un site **statique sans build**, ça ne fonctionne
pas : un fichier `config.js` servi tel quel ne peut pas lire une variable
d'environnement. La valeur finit **forcément** dans le HTML/JS envoyé au
navigateur, quel que soit le chemin.

Ce n'est pas un problème de sécurité :

- La clé présente dans `app/config.js` est la clé **publishable** (publique
  par conception). La doc Supabase elle-même la place dans le code front.
  Elle est protégée par la RLS (Row Level Security) de la base.
- La clé **secrète** (`sb_secret_...`) n'est **nulle part** dans le dépôt
  (seulement dans `.env` à la racine, qui est ignoré par Git). Elle ne doit
  jamais être mise ni dans le code, ni dans Vercel.

**Recommandation : garder `config.js` tel quel.** Le déploiement marche
directement, et les tests en local (`file://` ou Live Server) continuent de
fonctionner.

> Si tu veux malgré tout sortir la clé publique du dépôt : il faut ajouter un
> `package.json` + un script de build qui régénère `config.js` depuis des
> variables Vercel. Ça casse les tests locaux tant qu'on n'a pas lancé le
> build, ça ajoute une pièce mobile, et la même clé publique se retrouve de
> toute façon dans le bundle livré. Dis-le si tu préfères cette voie, Claude
> la mettra en place.

---

## Étape 2 — Après le premier déploiement : renseigner `publicBaseUrl`

Le message de premier contact de la veille (jeton `[lien]`) et les liens de
tunnel ont besoin de connaître l'URL publique. Une fois l'URL Vercel connue :

1. Ouvre `app/config.js`.
2. Renseigne :
   ```js
   publicBaseUrl: "https://<ton-url>.vercel.app",
   ```
3. Commit + push. Vercel redéploie tout seul.

Tant que ce champ est vide, l'app déduit l'URL depuis la page courante, ce
qui marche pour la navigation mais donne des liens moins propres dans les
messages.

---

## Étape 3 — Tester (à faire après le déploiement)

Dans l'ordre, sur la nouvelle URL :

1. `/diag.html` → toutes les lignes doivent être `[OK]` sauf la connexion
   utilisateur si tu n'es pas encore loggé (`[ATTENTION]`, normal).
2. `/index.html?agent=bonjour` → la landing s'affiche, le nom de l'agent
   apparaît, le formulaire se soumet et affiche l'écran de remerciement.
3. `/auth.html` → connexion avec l'email + mot de passe de l'agent BONJOUR
   (compte créé dans Supabase → Authentication → Users).
4. `/app.html` → le tableau de bord se charge, la liste des prospects
   s'affiche (ou l'état vide), **sans** « Chargement impossible ».
5. `/prospect.html?id=<uuid d'un prospect réel>` → la fiche se charge.
   (Ouvrir `prospect.html` sans `?id` affichera une erreur : c'est une limite
   connue, pas le bug Supabase.)

---

## Ce qui NE change PAS avec ce déploiement

- La base Supabase : rien à modifier. L'auth email/mot de passe ne dépend
  d'aucune URL de redirection, et l'API Supabase accepte déjà toutes les
  origines (`Access-Control-Allow-Origin: *`).
- Les fonctions Edge de la veille Facebook : elles restent à déployer
  séparément sur Supabase (voir `VEILLE-SOCIALE.md`), Vercel n'y touche pas.

---

## Option B — Déployer sans passer par GitHub (CLI Vercel)

À utiliser si tu ne veux pas mettre le dépôt sur GitHub tout de suite.
Nécessite Node.js.

```bash
# 1. Installer Node.js (https://nodejs.org, version LTS)
# 2. Dans un terminal :
cd "livrables/applications/2026-09_app-prospection-mlm/app"
npx vercel login          # ouvre le navigateur pour se connecter
npx vercel                # premier déploiement (preview)
npx vercel --prod         # déploiement en production, renvoie l'URL finale
```

Répondre aux questions : « Set up and deploy » → oui ; « Which scope » → ton
compte ; « Link to existing project » → non ; « project name » → au choix ;
« directory » → `.` ; le reste par défaut.

---

## Résumé des actions qui te reviennent (BONJOUR)

1. Créer le dépôt GitHub privé et donner l'URL à Claude (pour le `git push`).
2. Créer / ouvrir un compte Vercel.
3. Importer le dépôt dans Vercel avec le **Root Directory** ci-dessus.
4. Récupérer l'URL et me la donner : Claude renseigne `publicBaseUrl` et on
   teste ensemble.
