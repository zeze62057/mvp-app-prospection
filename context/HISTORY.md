# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> **Comment ça marche :** Quand je lance la commande `/update` après une session importante, ou quand je raconte un changement significatif, Claude ajoute une entrée ici automatiquement. Je n'ai pas à écrire ce fichier manuellement.

---

## 2026-09-08

### Tunnel public de capture de prospects opérationnel (Kora)

- Constat : le front (`landing.js`, `index.html`, `kora-store.js`) était déjà câblé sur les RPC `soumettre_prospect_public` et `agent_public_nom`, mais la base en service (`schema.sql` strict) ne contenait ni colonne `slug` ni ces fonctions
- Nouveau livrable : `supabase/migration-tunnel-public.sql`, pour la base déjà peuplée. Ajoute `agents.slug` (unique, format exact laissé à valider), met `slug = bonjour` sur la racine, crée `soumettre_prospect_public` (statut `nouveau` et `mode_creation` `formulaire_public` forcés, rattachement par slug) et `agent_public_nom`, plus une limite anti-spam par IP (5 par heure, seuil à valider) via une table `soumissions_publiques` en RLS sans policy
- Règle validée ce jour : slug choisi par l'agent à l'inscription, unique
- reCAPTCHA non fait : demande une clé Google et un appel HTTP sortant (`pg_net` ou Edge Function) indisponibles dans l'environnement. Étapes documentées en commentaire dans le fichier SQL
- Front : ajout du message d'erreur `trop_de_demandes` dans `kora-store.js`
- Migration exécutée par BONJOUR dans le SQL Editor. Test de bout en bout par Claude via curl avec les clés du `.env` : soumission anonyme OK, prospect créé au bon statut, bon mode, bon agent, trigger d'audit OK, cas d'erreur `nom_requis` / `contact_requis` / `agent_introuvable` OK. Données de test supprimées, base laissée propre
- `nom_complet` de l'agent racine renseigné à "Zézé", donc la landing affichera "avec Zézé"
- Restent : essai visuel dans le navigateur, limite IP non testée à saturation, reCAPTCHA, déploiement

### Déblocage de la connexion agent de Kora

- Symptôme : impossible de se connecter sur `auth.html`, l'email ne passait pas
- Cause : aucun compte agent n'existait dans Supabase Auth (l'inscription des agents n'a jamais été mise en place), et le `schema.sql` exécuté ne crée pas la fiche `agents` automatiquement
- Correctif : création manuelle du compte BONJOUR dans Authentication puis Users avec Auto Confirm, puis nouveau livrable `supabase/create-agent-bonjour.sql` qui insère la ligne `agents` racine à partir de `auth.users`
- Résultat : connexion fonctionnelle de bout en bout, nom de l'agent affiché dans le tableau de bord
- Restent ouverts : ouvrir l'app aux filleuls demandera un écran d'inscription ou un trigger `auth.users` vers `agents` (toujours à valider). Données de démo `seed.sql` non chargées, choix pas encore tranché

### Connexion effective de Kora au projet Supabase

- BONJOUR a créé le projet Supabase `swsjyeltuabrqwjaisew` et exécuté le DDL dans le SQL Editor
- Nouveau livrable : `livrables/applications/2026-09_app-prospection-mlm/schema.sql` (à la racine du projet), version strictement conforme à `schema-base-de-donnees.md`. Ne contient QUE les 4 tables validées, les 2 enums, la fonction `est_dans_ma_downline`, les triggers `updated_at` et d'audit de statut, les policies RLS documentées. Tout ce qui était demandé mais absent du schéma validé (table liens d'invitation, colonne `slug`, policy de réattribution par le parrain, fonction du formulaire public) est laissé en commentaires `⚠️ À VALIDER`, non exécuté. Ce fichier diverge donc volontairement de `supabase/schema.sql` (brouillon plus large)
- Revue de code passée sur le branchement Supabase : 9 corrections appliquées (nom d'agent sur la landing, `updated_at` du seed, garde anti-cycle sur la downline, `.catch` manquants sur landing et auth, erreurs réseau qui étaient avalées, historique de statut du seed, mémoïsation de `auth.user()`, `esc()` factorisé dans `data.js`)
- Clés : `.env` global renseigné avec les vraies clés `sb_publishable_` et `sb_secret_`. Le `.env` local du projet est resté vide et sans effet, car l'app statique ne lit aucun `.env`
- `app/config.js` (seul fichier lu par le front) rempli avec l'URL du projet et la clé publishable. Décision : `config.js` non ajouté au `.gitignore`, il sera committé avec la clé publishable, qui est publique par conception
- Test de connexion non réalisable depuis l'environnement Claude Code (pas de Node, pas de psql, daemon Docker éteint). Vérification déléguée à BONJOUR via l'ouverture de `app/auth.html` dans le navigateur

### Branchement Supabase de l'app Kora

- Choix : projet Supabase à créer de zéro, authentification par email et mot de passe
- Livré dans `livrables/applications/2026-09_app-prospection-mlm/supabase/` : `schema.sql` (tables, 2 enums, RLS hiérarchique via fonction récursive `est_dans_ma_downline`, triggers d'audit de statut et de `updated_at`, trigger de création de profil à l'inscription, RPC `soumettre_prospect_public` pour le formulaire public), `seed.sql` (7 prospects de démo), `README.md` (pas à pas d'installation sans ligne de commande)
- Côté front : couche d'accès `kora-store.js` avec une API unique `window.Kora` et deux implémentations. Mode démo (données en mémoire) si `config.js` est vide, mode live Supabase sinon. Ajout de `auth.html` / `auth.js` (connexion), déconnexion dans la barre, garde de route sur le dashboard et le détail en mode live
- `app.js`, `prospect.js`, `landing.js` réécrits en asynchrone pour passer par `Kora`. supabase-js chargé via CDN jsDelivr
- Non tranché : inscription des agents (création manuelle dans Supabase pour l'instant), rattachement du parrain et slug d'agent à saisir à la main, anti-spam du formulaire public, épinglage de la version de supabase-js

### Implémentation front de l'app de prospection (Kora)

- Import du canvas Claude Design `Kora - App Prospection MLM.dc.html` dans `context/import/`, après plusieurs allers-retours sur l'accès Claude Design. Le connecteur MCP design n'était pas disponible dans la session, fichier finalement déposé à la main
- Nom retenu pour l'app dans la maquette : Kora. Accent orange `#E8590C`, police Instrument Sans, pipeline à 7 statuts, liste filtrable (pas de kanban), une landing par agent
- Livrable produit : implémentation front statique dans `livrables/applications/2026-09_app-prospection-mlm/app/`, 9 fichiers HTML/CSS/JS sans dépendance ni build. Trois écrans du canvas : tableau de bord agent, détail prospect avec timeline, page publique de capture
- Fonctionnel côté client : compteurs de pipeline, recherche et filtre, ajout manuel de prospect, changement de statut sur les 7 valeurs, ajout d'interaction typée, timeline antéchronologique, formulaire public avec état de confirmation
- Décision de périmètre : statique, front seul, données en mémoire. Pas de branchement Supabase à ce stade. `data.js` et la soumission du formulaire sont les points d'accroche pour la suite
- Non tranché : rendu validé ou non par Zézé, et prochaine étape (branchement Supabase sur le schéma déjà cadré, ou portage React)

## 2026-09-07

### Cadrage du MVP de l'app de prospection MLM

- Nouveau projet : application de prospection en marketing de réseau pour BONJOUR et sa lignée de filleuls. Chaque agent a son compte et ses prospects
- Base de données retenue : Supabase (Postgres, Auth, RLS)
- Pipeline de statuts imposé : Nouveau, Contacté, Dans le tunnel, Intéressé, En négociation, Closé gagné, Closé perdu
- Deux voies de création d'un prospect : ajout manuel par un agent, ou soumission via un formulaire public de landing qui crée le prospect au statut Nouveau
- Décision prise : visibilité hiérarchique multi-niveaux. Un agent voit ses prospects et ceux de toute sa downline en lecture, l'agent propriétaire reste seul à écrire par défaut
- Décision prise : dossier nommé selon la convention workspace, `livrables/applications/2026-09_app-prospection-mlm/`, plutôt que le nom `MVP-App-Prospection` demandé
- Livrables produits : `schema-base-de-donnees.md`, `prompt-claude-design.md`, `fonctionnalites-mvp.md`, plus un `README.md` de projet. Chaque fichier a une section `⚠️ À valider`
- Points ouverts principaux : attribution des prospects du formulaire public (rattachement à un agent obligatoire mais formulaire anonyme), méthode d'authentification, champs de contact exacts d'un prospect, données de closing à stocker

## 2026-09-06

### Lancement du projet de plateforme e-commerce

- Nouveau projet : plateforme e-commerce multi-vendeurs (marketplace plus créateur de boutiques) pour produits bien-être, marché Guinée et Afrique de l'Ouest
- Modèle : Zézé a sa propre boutique, les autres vendeurs et distributeurs Longrich créent la leur, back-office admin pour piloter la plateforme
- Contraintes retenues : mobile-first, paiement Orange Money / MTN MoMo / à la livraison, prix en GNF, interface en français
- Style visuel : moderne épuré, couleur d'accent vert bien-être
- Étape en cours : prompt rédigé pour concevoir le design dans Claude Design (storefront acheteur, dashboard vendeur, admin plateforme, landing d'inscription vendeur)
- Nom de la plateforme : pas encore choisi

### Structuration du workspace et gestion des secrets

- Création du dossier `livrables/` avec 5 sous-dossiers thématiques (`sites-web/`, `applications/`, `youtube/`, `cabinet/`, `ecole/`), chacun avec son README
- Règle d'or formalisée : inputs dans `context/import/`, outputs dans `livrables/`. Convention de nommage projets : `AAAA-MM_nom-du-projet`
- Mise en place de `.env`, `.env.example` et `.gitignore` à la racine pour gérer les clés d'API (Anthropic, OpenAI, Notion, Google, YouTube, Vercel, GitHub, Stripe) sans risque de fuite. Aucune vraie clé renseignée. Workspace pas encore sous Git
- Précision de contexte : le cabinet de conseil s'appelle **Chatllow**, l'école s'appelle **Entrepreneur Académie**. CONTEXT.md mis à jour en conséquence

## 2026-09-05

### Installation initiale du Jarvis

- Workspace personnalisé pour Zézé Bilivogui, basé à Conakry (Guinée), originaire de Guinée Forestière
- Profil principal : Entrepreneur / Créateur de contenu IA
- Activité : développement de plusieurs projets IA en parallèle (YouTube, cabinet de conseil, academy, Longrich)
- Objectifs court terme identifiés : 20 premières vidéos YouTube, premier client cabinet conseil IA, former 20 distributeurs Longrich
- Vision long terme : entreprise IA lancée, revenus et liberté, référence IA et marketing de réseau en francophonie
- Projets actifs au démarrage : SaaS Claude, formation IA/MLM, academy Claude, expertise écosystème Claude, transition consultant
- Domaine d'aide prioritaire : développement de SaaS et applications Claude
- Style de communication choisi : mélange selon le contexte
