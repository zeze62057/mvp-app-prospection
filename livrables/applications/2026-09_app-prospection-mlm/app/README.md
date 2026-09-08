# Kora, front du MVP

> Produit le 2026-09-08 à partir du canvas Claude Design `context/import/Kora - App Prospection MLM.dc.html`.
> Mis à jour le 2026-09-08 : branchement Supabase (mode démo + mode live).

HTML, CSS et JavaScript, sans dépendance ni build. La librairie `@supabase/supabase-js`
est chargée depuis un CDN quand une connexion est nécessaire.

## Deux modes

| Mode | Quand | Données | Auth |
|---|---|---|---|
| **Démo** | `config.js` vide (défaut) | en mémoire (`data.js`), perdues au rechargement | aucune |
| **Live** | `supabaseUrl` + `supabaseAnonKey` renseignés dans `config.js` | Supabase (Postgres + RLS) | email + mot de passe |

Le passage en mode live est décrit dans [`../supabase/README.md`](../supabase/README.md).

## Lancer

Ouvrir un fichier dans un navigateur (double-clic, `file://` fonctionne) :

| Fichier | Écran | Section du canvas |
|---|---|---|
| `index.html` | Page publique de capture + confirmation | C |
| `auth.html` | Connexion agent (mode live uniquement) | — |
| `app.html` | Tableau de bord agent | A |
| `prospect.html?id=<id>` | Détail d'un prospect | B |

En mode live, `app.html` et `prospect.html` redirigent vers `auth.html` si personne n'est connecté.

## Fichiers

| Fichier | Rôle |
|---|---|
| `config.js` | URL et clé anon Supabase. Vide = mode démo |
| `kora-store.js` | Couche d'accès aux données. Une seule API `window.Kora`, deux implémentations (mémoire / Supabase) |
| `data.js` | Statuts, portefeuille de démonstration, icônes, helpers |
| `styles.css` | Design system repris de la planche du canvas |
| `auth.html` / `auth.js` | Écran de connexion |
| `app.html` / `app.js` | Tableau de bord agent |
| `prospect.html` / `prospect.js` | Détail prospect |
| `index.html` / `landing.js` | Page publique de capture |
| `parametres.html` / `parametres.js` | Paramètres agent : comptes réseaux sociaux + message de premier contact |
| `notifications.html` / `notifications.js` | Veille réseaux sociaux : interactions détectées ou saisies, message pré-rempli |
| `diag.html` | Page de diagnostic de la connexion Supabase (ne modifie rien) |

Le module de veille (connexion Facebook / TikTok, détection des commentaires,
limites réelles des API) est décrit dans [`../VEILLE-SOCIALE.md`](../VEILLE-SOCIALE.md).

## Ce qui fonctionne

- **Tableau de bord** : compteurs par statut, recherche, filtre, état vide, ajout manuel (statut Nouveau, source Ajout manuel).
- **Détail** : sélecteur de statut sur les 7 valeurs, ajout d'interaction typée, timeline antéchronologique mêlant interactions et changements de statut, barre d'avancement.
- **Landing** : défilement vers le formulaire, validation du numéro, création du prospect via le RPC `soumettre_prospect_public` (mode live) ou simulation console (mode démo), puis écran de confirmation.
- **Connexion / déconnexion** en mode live.
- Responsive : les artboards 1440 / 390 deviennent des mises en page fluides ; la liste passe en cartes sur mobile.

## Écarts avec le canvas

- Largeurs fixes du canvas remplacées par des mises en page fluides (ruptures à 980 px et 720 px).
- Emplacement photo du hero laissé en placeholder gris (aucun asset fourni).
- Onglet « Ma lignée » et tri « Dernier contact » présents visuellement mais inertes.

## ⚠️ À valider

- **Cible technique.** Statique retenu. Base de référence si portage React ou Next ensuite.
- **Version de supabase-js.** Chargée en `@2` depuis jsDelivr. À épingler sur une version exacte pour la prod, et à héberger en local si l'usage hors ligne devient nécessaire.
- **Attribution des prospects du formulaire public.** La landing lit `?agent=<slug>`, sinon `defaultAgentSlug` de `config.js`. Le mécanisme définitif reste à trancher (voir `../schema-base-de-donnees.md`).
- **Persistance en mode démo.** Aucune. À décider si une démo cliquable a besoin que les ajouts survivent au rechargement (localStorage) en attendant Supabase.
- **Inscription des agents.** Pas d'écran d'inscription. Création manuelle dans Supabase pour l'instant.
