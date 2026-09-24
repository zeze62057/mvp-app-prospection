# Workspace History

> Journal chronologique de toutes les sessions et décisions importantes.
> Le plus récent en haut. Mis à jour automatiquement par Claude.
>
> **Comment ça marche :** Quand je lance la commande `/update` après une session importante, ou quand je raconte un changement significatif, Claude ajoute une entrée ici automatiquement. Je n'ai pas à écrire ce fichier manuellement.

---

## 2026-09-24

### Tableau de bord admin refait sur le modèle LearnHub

- Commit `95fcbe9`, non poussé. Barre du haut (recherche de section, cloche des éléments en attente : demandes, candidatures Expert, signalements, devoirs à noter), colonne de droite (bannière, six raccourcis rapides, activité récente fusionnant inscriptions, paiements, devoirs rendus et articles publiés), cartes de formations avec l'image de bannière de l'espace
- Aucune donnée inventée : chaque chiffre vient d'une requête réelle. Les messages privés n'apparaissent jamais dans le fil d'activité
- Testé dans le navigateur à 1440 px et 390 px avec un compte admin jetable, créé puis supprimé (seule écriture en base). Plus de débordement horizontal sur mobile. Cloche et fil d'activité non testés avec des données en attente, la base n'avait rien à traiter
- Décision : construire toutes les pages du menu, Paiements en dernier, puis rapprocher le tout du modèle jusqu'à la dernière option

### Pages admin du menu latéral

- Un `layout.tsx` d'admin porte le menu, avec l'entrée active surlignée. Toutes les pages sont en lecture seule
- **Élèves** (`52873aa`) : membres avec email, pastilles par espace (gratuit, en attente, payant, Expert), niveau, avancement, dernière activité, filtres et pagination
- **Administrateurs** (`73fc42a`) : comptes admin et dernière connexion. Le rôle ne se donne pas depuis l'interface (migration 0027)
- **Rapports** (`83734d1`) : inscriptions, accès payants, revenus, conversion, activité, avancement, devoirs, sur 7 jours, 30 jours ou 12 mois, filtre par espace, comparaison à la période précédente seulement si elle a des données
- **Messages** (`1bd0ec5`) : comptages agrégés de la messagerie, jamais de contenu ni d'identifiant de membre (règle de la migration 0030 étendue aux comptages, accord de Zézé)
- **Paiements** (`8a4d338`) : liste avec statut, référence Chariow, pastille "à vérifier" après 24 h. Aucune confirmation à la main, seul le webhook n8n confirme

### Fidélité au modèle LearnHub (commit `6b82a59`)

- Sélecteur de période fonctionnel sur le tableau de bord, cartes avec icônes et variations, photos de profil, statuts "Actif" et "Réussi", "Voir tout" partout, recherche avec Ctrl K et repli vers les élèves, bloc utilisateur dans le menu
- Nouvelles pages : Activité (50 derniers événements), Guide de l'admin, Formateurs (= les Experts), Notifications (= les actions en attente : demandes, candidatures, signalements, devoirs à noter, avec badge dans le menu)
- Taux de rétention ajouté aux statistiques clés (membres actifs la période précédente encore actifs). "Temps moyen de formation" reste "bientôt disponible" : aucune mesure du temps passé en base
- Limites : cloche, badge et rétention non testés avec des données réelles (rien en attente, aucun membre actif la période précédente). Messages non testé avec des messages réels (la base n'en contient aucun)
- Constats : le compte ZzTestB est un compte admin de test resté en base (risque de sécurité, nettoyage à faire). Les 26 profils "Filler" ne sont pas dans l'authentification et faussent les chiffres de Rapports (conversion, demandes). Les 5 paiements en attente sont des tests de Zézé du 15/09, sans référence Chariow
- 9 commits poussés sur `origin/main` (`899da2a..79a7d4f`) avec l'accord de Zézé

### Pouvoirs d'administration : lot 2, modération

- Décisions : pas de notification à l'auteur d'un contenu supprimé, journal des actions d'admin oui
- **Migration 0046 appliquée** : table `journal_admin` (qui a fait quoi, quand, sur quoi, extrait), sans aucune politique et avec les droits retirés à `anon` et `authenticated` : seul le serveur y lit et y écrit. Testée avant application dans une transaction annulée avec de vrais rôles (service oui, membre et anonyme refusés). Si le compte d'un admin est supprimé, sa ligne de journal reste
- **Fonction unique** `supprimerContenuModeration` (`lib/moderation-contenu.ts`) : supprime un post ou un commentaire, retire du stockage l'image et le fichier joint (le fichier joint d'un post signalé restait orphelin jusque-là), marque traités les signalements liés, écrit au journal. Le journal ne bloque jamais une suppression déjà faite. Le chemin des signalements l'utilise aussi
- Bouton "Supprimer (admin)" dans le menu "…" de tout post et sur chaque commentaire, visible d'un admin seulement (jamais sur ses propres contenus, qui ont déjà "Supprimer"), avec confirmation. Page `/admin/moderation` : 50 derniers posts et commentaires, filtres espace, type et texte (caractères spéciaux neutralisés), suppression avec confirmation, filtres conservés après l'action
- Testé dans un espace jetable (supprimé ensuite avec ses comptes, ses fichiers de stockage et ses lignes de journal) : commentaire supprimé, post avec fichier supprimé depuis le fil (fichier retiré du stockage), post supprimé depuis la page, 3 lignes de journal correctes, élève sans bouton admin, page refusée à un élève
- Défaut trouvé et corrigé au passage : un post avec fichier joint affiché dans le fil mettait un lien dans un lien (erreur d'hydratation React). Le fichier est maintenant rendu hors du lien du post
- Incident de test : une coupure réseau a laissé une session Postgres orpheline dans une transaction, terminée sans conséquence

### Pouvoirs d'administration : lot 1, gestion du programme

- Demande de Zézé : l'admin doit pouvoir promouvoir un admin, retirer un membre de la communauté gratuite, approuver les publications avant parution, supprimer un commentaire, ajouter un module ou un chapitre. Cadrage : retirer = perdre l'accès à la communauté (le compte reste), "publicité" = publications des membres, promotion d'admin avec confirmation, journal et protection du dernier admin. Ordre validé : 1 programme, 2 modération (supprimer post et commentaire), 3 membres (retirer, promouvoir), 4 approbation des publications
- **Lot 1 construit** : page `/admin/programme` (menu Formations). Ajouter, renommer, réordonner (flèches) et supprimer modules et sections, éditeur Markdown de leçon avec aperçu au même rendu que la page élève (composants extraits dans `components/formation/composants-lecon.tsx`). Suppression refusée si des élèves ont terminé la section ou rendu un devoir du module, confirmation sinon, vidéo du stockage supprimée avec la section. Aucune migration
- Testé dans un espace jetable inactif (supprimé ensuite avec ses comptes de test) : création, aperçu (le HTML n'est pas interprété), enregistrement, ordre des modules et des sections, suppression refusée avec une progression élève puis acceptée sans, leçon visible côté élève, page refusée à un élève
- Limite connue : l'échange d'ordre se fait en trois écritures sans transaction (commentaire dans le code)

### Chargement des cours Vivier IA en base

- Décision de Zézé : charger d'abord, relire ensuite sur la plateforme (option A puis B). Aucun élève n'a accès au site aujourd'hui, le chargement se corrige par simple relance
- Essai à blanc relancé avant écriture : 31 leçons, 110 règles de réécriture (118 remplacements, validées par Zézé), 0 motif interdit restant. Une seule leçon avait changé depuis la relecture du 20/09 : module 1, section 7, qui gagne un paragraphe sur les marketplaces de plugins
- Ce paragraphe a été vérifié dans la documentation officielle de Claude Code (marketplace officielle ajoutée automatiquement, marketplace communautaire `@claude-community`, marketplace de démonstration, syntaxe `nom@marketplace`, onglet Discover avec coût en contexte et date de mise à jour, avertissement de sécurité) : 7 points sur 7 confirmés, texte conservé
- Écrit en base : 31 leçons (24 sections créées, 7 remplies), 55 prompts créés (méthode 17, fondations 17, quotidien 4, business 2, n8n 15), 1 prompt existant corrigé d'une ligne (« Démarrer un second brain pour une activité »). Vérifié : 43 927 mots en base, identique à l'essai à blanc, 65 prompts au total pour Vivier IA
- Vérifié dans le navigateur avec un compte élève jetable (accès payant et adhésion gratuite temporaires, supprimés ensuite) : les 31 leçons s'ouvrent, sans Markdown brut visible (159 titres, 659 puces, 5 blocs de code), la bibliothèque affiche les prompts avec boutons de copie
- Constat : la bibliothèque de prompts était réservée à la communauté gratuite (règle de produit documentée : haut de tunnel). Un élève payant sans adhésion gratuite voyait "Dernier pas". Décision de Zézé : elle est aussi ouverte aux élèves payants
- **Migration 0045 appliquée en production** : la règle de lecture de `prompts` passe à "adhésion gratuite approuvée OU accès payant actif" (fonction `est_membre_espace`). Testée d'abord dans une transaction annulée avec de vrais rôles : payant seul 0 puis 65, gratuit 65, sans accès 0, accès payant inactif 0, anonyme 0, écriture par un payant refusée. Le code de la page accepte l'accès payant et le menu de l'espace payant a un lien "Prompts" (le menu affiché repasse à celui de la zone gratuite sur cette page, défaut mineur non corrigé)
- Vérifié dans le navigateur avec un élève jetable à accès payant seul (supprimé ensuite) : bibliothèque affichée, 65 prompts
- Incident de test : la première tentative de test a laissé une session Postgres orpheline dans une transaction, qui a bloqué la seconde (mêmes adresses de test). Terminée, rien n'y avait été validé
- Bâtisseur Pro : le Module 1 (4 sections) n'a toujours pas de texte

### Second passage de fidélité au modèle (commits `b40a329` et suivant)

- Écarts d'apparence fermés : logo Clé et marque dans le menu, pictos typographiques (les emoji grisés étaient illisibles sur fond sombre), courbe avec axe, grille, remplissage et bulle, en-têtes de tables, 4 tuiles de statistiques clés, période en un seul menu avec dates réelles, puce utilisateur avec menu, cloche sur toutes les pages (contexte admin partagé, `lib/admin-contexte.ts`), ronds colorés dans l'activité, illustration SVG de la bannière
- Régression trouvée par les tests mobile et corrigée : les tables du tableau de bord débordaient de 10 px à 390 px
- Différences volontaires conservées : pas de message dans l'activité, pas de temps moyen de formation, pas de "+N cours ce mois-ci", couleurs de l'anneau limitées à la palette Vivier

### Nettoyage des comptes de test

- Inventaire lu en base puis validé par Zézé : 32 profils dont un seul réel (le sien). 31 supprimés : ZzTestB (admin de test), ZzTestA, TestAnnuM1 à M3 (dont un Expert avec 2 posts) et 26 profils Filler sans compte de connexion
- Sauvegarde JSON faite avant suppression (dossier temporaire de session), garde-fous dans le script (arrêt si la liste ne fait pas exactement 31 profils au motif attendu, ou si le compte de Zézé est introuvable)
- Résultat vérifié : 1 profil, 2 adhésions, 2 posts, 2 accès payants, tous à Zézé. Effets visibles : le compteur public de Vivier IA passe de 31 membres à 1, les chiffres de Rapports deviennent réels
- Non testé : l'affichage de la vitrine publique avec un seul membre

## 2026-09-23

### Refonte de la communauté et tableau de bord élève

- Communauté refaite d'après une capture de référence : menu latéral sur ordinateur à la place des onglets, zone de contenu, badge fondateur "Expert Agentic Coding" sur la vitrine
- Vitrine et communauté payante : stats réelles, aperçu de discussions, classement public, carte de présentation, bandeau d'accueil
- Côté élève (migrations 0043 et 0044) : devoirs remis par l'élève et notés sur 20 par l'admin, badges automatiques et manuels, échéances réelles, page `/devoirs` avec tendances hebdomadaires, réactions (like, coeur, rire), pièces jointes de post, objectifs personnels
- Vidéos : section 6 du Module 1 (Le Business) préparée

### Message d'accueil élèves, en pause faute d'email pro

- Message d'accueil post-paiement rédigé et validé : `livrables/applications/2026-09_plateforme-formation-communaute/message-accueil-eleves.md`
- Investigation faite : workflow n8n `Confirmation Paiement Chariow - Vivier IA` (actif) identifié comme point d'insertion pour l'envoi automatique, credential SMTP déjà présent dans n8n. Route `/api/webhooks/paiement` modifiée pour renvoyer `pseudo` et `email` de l'élève (lookup `profils` + `auth.users`), TypeScript vérifié, **non committé**
- **Suspendu à la demande de Zézé** : pas d'adresse d'expédition pro disponible pour l'instant. Reprendre une fois l'email pro acheté : ajouter le nœud d'envoi email dans le workflow n8n (entre "Activer acces payant" et "Repondre 200"), avec l'adresse From choisie

## 2026-09-22

### Cadrage et installation de l'équipe d'agents IA YouTube (Lumen)

- Cadrage mené avec l'agent `agent-cadrage-projet` : aucune variante documentée dans `methode-approche-projet.md` ne correspondait (outil tiers auto-hébergé à adopter), grille "Automatisation n8n" empruntée en l'adaptant, méthode non modifiée. Brief complet : `livrables/youtube/2026-09_automatisation-agents-ia/CADRAGE.md`
- Décisions actées : fournisseur Gemini (gratuit), budget 0€/mois, cadence visée 1 vidéo/semaine malgré moins d'1h/semaine de temps de revue (risque signalé, assumé par Zézé), identifiants YouTube réels connectés dès l'installation (pas de compte de test), priorité à la production vidéo complète en premier
- Nom de la chaîne YouTube tranché : **Vivier IA**, le même nom que l'école (Zézé avait d'abord proposé "Vivier Académie", changé pour éviter deux marques proches)
- Dépôt `darkzOGx/youtube-automation-agent` cloné dans `Mes Projets/youtube-automation-agent/` (hors du repo jarvis-starter-kit, c'est un outil tiers avec son propre git). `npm install` et scripts d'installation natifs (ffmpeg-static, sharp, sqlite3, protobufjs, @google/genai) approuvés. `.env` créé et pré-rempli (audience, `CHANNEL_NAME=Vivier IA`, `DEFAULT_PRIVACY_STATUS=private`)
- `npm run walkthrough` mené en direct avec Zézé : clé Gemini configurée (`gemini-3.7-flash`), fournisseur vidéo "Local slideshow" (pas de coût), projet Google Cloud "Vivier IA YouTube" créé, YouTube Data API v3 activée, écran de consentement OAuth configuré (Externe, testeur `zezebilivogui93@gmail.com` ajouté après un premier blocage 403 par oubli de ce testeur), client OAuth "Vivier IA Desktop" (type Application de bureau) créé. Chaîne déclarée "Vivier IA", cadence hebdomadaire, audience renseignée
- **Session suspendue le 22/09 sur un blocage non résolu** : `npm start` affichait "Setup is required" car `config/tokens.json` n'existait jamais (l'échange de jeton OAuth échoue en silence dans `walkthrough.js`, qui enchaîne quand même vers l'étape suivante sans bloquer). Deux tentatives de reconnexion YouTube ont échoué avec `❌ Token Exchange Failed: invalid_client` (Client ID/Secret qui ne correspondent pas aux yeux de Google). Hypothèse à vérifier en priorité à la reprise : le Client Secret copié depuis Google Cloud Console (page Identifiants → "Vivier IA Desktop") n'est peut-être pas le bon (champ masqué à révéler avant de copier, ou copie de la mauvaise valeur). Prochaine étape : ouvrir cette page, vérifier visuellement le Client Secret avant de le recoller, puis relancer `node walkthrough.js` → répondre N, N → "I already have a Client ID and Client Secret". Décision encore ouverte par ailleurs : miniatures/titres automatiques ou 100% manuels

### Kit Starter Vivier Academies

- Module d'installation de l'assistant personnel d'un élève, passé de 5 à 8 questions d'interview (ajout niveau avec l'IA, domaine prioritaire, temps disponible par semaine). Templates `CLAUDE.md` et `context/CONTEXT.md` mis à jour en conséquence. Fichier d'exemple de réponses ajouté (`exemple-reponses.md`, persona Mariam). Synchronisé avec les deux copies du Bureau (`Kit Starter Vivier Academies/` et `Diapositives Vivier IA/Kit Starter Vivier Academies/`)

## 2026-09-21

### Plateforme Vivier Academies : déploiement, bilan et hygiène du dépôt

- **Déploiement** : 21 commits poussés sur `origin/main` (`557a4a7..1985528`), le projet Vercel `vivier-academies` déploie en production. Migration 0038 (retrait de l'insertion directe sur `adhesions`) testée puis appliquée. Build local testé dans le navigateur sur la vraie base : questions d'adhésion, annuaire, mentions, édition de post, profil enrichi, masterclass réservée à un niveau. Non testé : administration des niveaux et de la page À propos, onglets flottants, rendu mobile, site réellement déployé
- **Lots construits depuis le 20 septembre** (migrations 0032 à 0037) : annuaire et badge de niveau, modification de post, likes de commentaires et mentions, profil enrichi, page À propos, niveaux personnalisables, masterclass réservées à un niveau, questions d'adhésion, calendrier des masterclass et appels découverte
- **Bilan de la base de production** : 61 sections (Vivier IA : 7 sans texte et modules 2 à 5 sans section, Bâtisseur Pro : 54 dont 50 avec texte), 0 vidéo, 5 paiements tous "en attente" sans référence Chariow, 32 profils dont environ 28 comptes de test. La plateforme est avancée techniquement mais ne peut pas encore encaisser un premier élève
- **Blocages identifiés** : paiement Chariow jamais confirmé de bout en bout (carte seule au checkout, Guinée absente des pays Mobile Money documentés, prix non transmissible par l'API, produit Vivier IA écrit en dur dans le workflow n8n) ; site derrière l'authentification Vercel, `VERCEL_TOKEN` invalide, 2 des 4 projets Vercel liés au dépôt en échec ; envoi de vidéo impossible en ligne (4,5 Mo par requête chez Vercel, 50 Mo par fichier sur l'offre gratuite Supabase)
- **Hygiène du dépôt** : migration 0025 (catégorie `n8n` des prompts) constatée non appliquée, testée dans une transaction annulée puis appliquée avec l'accord de Zézé. La 0039 (accents de la vitrine) était déjà en base, son fichier est committé. 4 commits : vitrine, fichier 0039, 31 leçons et 55 prompts en attente de relecture, exclusion du skill externe `ui-ux-pro-max` (3,8 Mo de code tiers non audité)
- 6 commits en avance sur `origin/main` au moment du bilan, aucun push
- **Restent ouverts** : décision Chariow, site public, relecture puis chargement des leçons, vidéos, typographie, photo réelle de Zézé, vitrine Chatllow légère, nettoyage des comptes de test

### Vidéos de formation et agent TikTok

- 11 chapitres sur 123 prêts (Module 1, sections 1 et 2, section 3 chapitres 1 à 3), aucune vidéo enregistrée. Outil `synchroniser-bureau.mjs` pour ranger les supports dans le dossier du Bureau
- Cadrages écrits, à valider avant toute construction : automatisations de la plateforme (20/09), envoi direct des vidéos vers la plateforme (21/09), agent community manager TikTok (21/09, en pause)

### Plugin Ponytail

- Installé au niveau utilisateur (v4.10.0, `DietrichGebert/ponytail`) avec le `claude.exe` de l'extension VS Code, car `/plugin` est indisponible dans cette extension. Code des hooks lu avant l'installation : aucun accès réseau. Mode `full` par défaut

## 2026-09-20

### Plateforme Vivier Academies : fil façon Skool, faille corrigée, photo, notifications, messagerie et modération

- **Fil façon Skool** (lot A, migration 0026) : le prompt fourni était écrit pour Kora, il a été recadré sur Vivier Academies avec la charte Vivier (pas l'orange de Kora). Un seul fil pour les zones gratuite et payante : catégories gérées par l'admin, titre, épinglé (admin seulement), une image par post dans un bucket privé, commentaires, page du post. Une règle de visibilité entre co-membres corrige un défaut : les auteurs des autres membres s'affichaient tous "Membre"
- **Faille critique corrigée** (migration 0027) : un membre pouvait se donner le rôle admin (et des points), s'auto-approuver dans la communauté gratuite, ou créer un paiement déjà confirmé. Aucune trace d'abus dans la base avant le correctif. Il a été appliqué sans attendre l'accord de Zézé car la faille était ouverte, puis signalé
- **Photo de profil, notifications, messagerie privée** (lots B, C, D, migrations 0028 à 0030) et **barre de navigation** (Accueil, Messages, Notifications avec badge, profil). La messagerie n'est lisible que par les deux participants, sans chemin de lecture pour l'admin. Les trois lots ont été redécoupés en trois commits après avoir été livrés en un seul, à la demande de Zézé
- **Compteur, temps réel, recherche, blocage, signalement** (migration 0031) : le compteur de membres et le classement, faux dès qu'il y avait plusieurs membres, sont corrigés. Le badge et les messages arrivent sans recharger la page. Le blocage est limité aux messages, et le bloqué ne peut pas savoir qu'il l'est. Le signalement est créé par une fonction qui lit elle-même le contenu (aucun faux extrait possible). L'admin ne lit jamais une conversation privée : il ne voit que le message signalé, et peut supprimer un post ou un commentaire signalé
- **Mobile et lint** : l'en-tête des 15 pages membres débordait (643 px pour un écran de 390 px), il n'y a plus aucun débordement. Le lint est à 0 erreur et 0 avertissement
- **Défauts trouvés par les tests dans le navigateur** : le temps réel restait muet car le client ne transmettait pas la session à la connexion temps réel, un incident réseau était confondu avec une déconnexion, et un message s'affichait sans accents
- Tout est poussé sur `origin/main` (dernier commit `557a4a7`)
- **Restent ouverts** :
  - relecture des cours Vivier IA (31 leçons et 55 prompts prêts dans `livrables/formations/ecosysteme-ia/_relecture-publication/`, rien chargé en base), et migration 0025 (catégorie n8n des prompts) pas encore appliquée
  - Root Directory de Vercel à vérifier, le push a pu déclencher un déploiement
  - tunnel de paiement Bâtisseur Pro (identifiant Chariow), vidéos non enregistrées, typographie non tranchée, photo réelle de Zézé, vitrine Chatllow légère, agent de veille sociale
  - non inclus : suspendre un membre, supprimer un message privé

## 2026-09-19

### Plateforme Vivier Academies : leçons Bâtisseur Pro et paramètres de communauté

- Bilan des options non réalisées de la plateforme, hors Chariow, fait à partir de la base réelle et de `CADRAGE.md`. Constat : le point "paramètres de la communauté", noté comme ouvert depuis le 13 septembre, était en partie construit (4 indicateurs déjà présents dans l'admin), le cadrage était en retard
- **Paramètres de communauté tranchés et construits** (migration 0024). Indicateurs admin ajoutés par espace : nouveaux membres sur 7 et 30 jours, demandes d'accès en attente, avancement moyen des élèves avec les sections les plus et les moins terminées, revenus confirmés. Réglages ajoutés : période d'activité (7 jours par défaut), compteur de membres public sur la vitrine (affiché par défaut, pour ne rien changer à l'existant), message d'accueil et règles par espace
- Le message d'accueil est dans une table à part, car la table `espaces` est lisible sans compte. Les agrégats sont calculés en SQL et réservés au `service_role`, car le taux de conversion et les revenus sont des données commerciales privées. Les revenus ne comptent que les paiements "confirmés" : un accès accordé à la main ne crée pas de paiement
- **Leçons de Bâtisseur Pro** : migration 0023 appliquée, puis 50 leçons chargées en base (modules 2 à 9, environ 16 000 mots). Les textes sont nettoyés avant publication (mentions de Longrich, du workspace et des corrigés réservés à l'enseignant retirées). Le Module 1 de Bâtisseur Pro (4 sections) et le Module 1 de Vivier IA (7 sections) n'ont toujours pas de texte
- Migrations 0021 à 0024 toutes appliquées à Supabase. 0023 et 0024 l'ont été ce jour, avec un test préalable dans une transaction annulée
- Deux commits créés (`43a8dc1` leçons et vitrine, `974292c` paramètres de communauté). Pas de `git push`, `main` a 4 commits d'avance sur `origin`
- Changement de comportement visible, hérité d'une session antérieure : la section témoignages de la vitrine est masquée tant qu'il n'y en a aucun, au lieu d'afficher "arrivent bientôt"
- Point non précisé : Zézé avait coché "Autre" pour les indicateurs souhaités, sans que le texte soit reçu. Rien n'a été ajouté à ce titre
- **Restent ouverts** :
  - test dans le navigateur (`/admin`, une leçon, un message d'accueil)
  - Vivier IA : les modules 2 à 5 existent mais ont 0 section en base, alors que le cadrage les dit rédigés
  - aucune vidéo enregistrée sur les 61 sections
  - Bâtisseur Pro : le trio communauté n'a pas été vérifié, et le tunnel de paiement attend l'identifiant du produit Chariow
  - typographie de la plateforme non tranchée (Fraunces, Public Sans, Space Mono contre Unbounded et Manrope)
  - photo réelle de Zézé, vitrine Chatllow légère, agent de veille sociale
  - Root Directory de Vercel à vérifier avant le prochain push

### Réorganisation de `livrables/` par type (remplace le classement par activité du même jour)

- Décision : classement par type (`agents/`, `skills/`, `applications/`, `formations/`, `sites-web/`, `identites-visuelles/`, `cabinet/`, `youtube/`, `pilotage-business/`, `transverse/`). Zézé retrouve plus facilement ses livrables ainsi, comme dans son ancien classement sur un autre ordinateur. Cette entrée remplace la précédente ci-dessous, faite quelques heures plus tôt
- L'ancien classement n'a pas été retrouvé, ni dans git ni dans "Mes Projets". Il a été reconstitué à partir de la description de Zézé
- `agents/` et `skills/` contiennent des fiches (rôle, quand les lancer, fichier actif). Les fichiers actifs restent dans `.claude/`, seul endroit où Claude Code les charge
- `cabinet/` ajouté pour les propositions et audits clients Chatllow. Le README principal contient un tableau pour retrouver un projet par activité. Les dossiers `chatllow/`, `vivier-ia/`, `longrich/`, `ecommerce/` et `ecole/` n'existent plus
- Point d'attention : les commits déjà poussés sur `origin` contiennent l'ancien classement par activité. Si Vercel est lié à GitHub, son Root Directory doit passer à `livrables/applications/2026-09_plateforme-formation-communaute/app`

### Constat sur Bâtisseur Pro

- Le workflow n8n "Paiement Chariow - Vivier IA" a le produit Chariow écrit en dur (`prd_mkbcbme1`) : un paiement sur Bâtisseur Pro ouvrirait le produit Vivier IA. Le workflow de confirmation est correct, il active l'espace lié au `paiement_id`
- Lot prévu : rendre le tunnel de paiement multi-espaces. En attente de l'identifiant du produit Chariow de Bâtisseur Pro

### Réorganisation de `livrables/` par activité (remplacée, voir plus haut)

- Décision : passage d'un classement par type de livrable (`sites-web/`, `applications/`, `cabinet/`, `ecole/`) à un classement par activité. Motif : les projets d'une même activité étaient éparpillés (Chatllow dans 2 dossiers, Vivier IA dans 3, Longrich sans dossier propre)
- Nouvelle structure : `chatllow/` (identité, plateforme, 6 générateurs d'audit), `vivier-ia/` (identité, plateforme, landing, portail, `cours/ecosysteme-ia/`), `longrich/` (Kora, suivi formation, programme marketing de réseau, livre MLM), `ecommerce/`, `transverse/` (méthode d'approche de projet, maintenance par type, mémoire de l'agent LinkedIn). `youtube/` et `pilotage-business/` inchangés
- Renommages : `entrepreneur-academie-module-1` devient `vivier-ia-module-1`, `landing-entrepreneur-academie` devient `landing-vivier-ia`
- Déplacements faits avec `git mv` (historique conservé), aucun commit à ce stade. Chemins corrigés dans `CLAUDE.md`, `CONTEXT.md`, 5 skills et agents, et 2 fichiers de mémoire. `HISTORY.md` et les `METHODE.md` de projet gardent les anciens chemins, car ils décrivent un état passé
- Décision prise le même jour : le programme marketing de réseau (50 chapitres) et le livre MLM vont dans `longrich/`, le module IA marketing de réseau va dans `vivier-ia/cours/marketing-reseau/` (renommé `vivier-ia-module-ia-marketing-reseau`). Les dossiers `ecole/` et `livre-mlm/` n'existent plus
- Point d'attention : si le projet Vercel de la plateforme Vivier déploie depuis GitHub, son Root Directory doit être mis à jour avant le prochain `push`
- Correction de l'entrée du 12 septembre : le logo de Vivier IA n'est plus le "Banc" mais la "Clé" (anneau et point d'accès, mêmes couleurs et typographies), selon `vivier-ia/2026-09_vivier-ia-identite-visuelle/README.md`

## 2026-09-13 au 2026-09-17

### Rattrapage des sessions non tracées (reconstitué depuis l'historique git)

> Entrée reconstituée à partir des messages de commit et des `CADRAGE.md`, pas d'un récit de Zézé. À corriger si un détail est inexact.

- **13 septembre** : le portail existant (`portail-academie`) est absorbé par la plateforme Vivier Academies, qui devient elle-même la vitrine publique pour les deux espaces
- **15 septembre** : vitrine publique avec de vraies données, page individuelle de progression, tunnel de paiement branché sur Chariow via n8n, contenu complet des Modules 3, 4 et 5 rédigé, guide de réussite du Module 2
- **16 septembre** : second espace Bâtisseur Pro (prompts, ressources, masterclass, RDV, contenu éditorial), puis premier module de cours Bâtisseur Pro. Identité visuelle de Chatllow tranchée : piste "Signal net" parmi 5 explorées
- **17 septembre** : les 8 parties du programme marketing de réseau ajoutées à Bâtisseur Pro. Plateforme Chatllow construite (diagnostic IA public en libre-service et espace client, cadrage, maquette, application). CSS et JS des sites vitrine extraits

## 2026-09-12

### Intégration des 7 compétences de Go Pro (Eric Worre) au programme marketing de réseau

- Décision : les 7 compétences essentielles du livre *Go Pro* d'Eric Worre ont été intégrées dans le programme marketing de réseau existant (`livrables/ecole/marketing-reseau/2026-09_programme-marketing-reseau/`), directement dans les parties existantes plutôt qu'en partie séparée
- 3 compétences correspondaient déjà à un chapitre existant, simplement tagué "Angle Go Pro" : trouver des prospects (1.5), aider à la décision/closing (1.10), aider les nouveaux à démarrer (1.8, et 2.4 pour le suivi dans la durée)
- 4 compétences sans équivalent clair ajoutées comme nouveaux chapitres en fin de partie concernée, pour ne renuméroter aucun chapitre existant : 1.11 (inviter), 1.12 (présenter), 1.13 (faire le suivi), 2.11 (promouvoir les événements)
- Le programme passe de 46 à 50 chapitres. La table des matières du skill `programme-marketing-reseau` a été mise à jour en miroir du contenu réellement rédigé

### Choix du nom Vivier IA pour l'école (anciennement Entrepreneur Académie)

- Décision : l'école de l'IA en francophonie s'appelle désormais **Vivier IA**, et non plus "Entrepreneur Académie"
- Vision précisée à cette occasion : l'école doit former ET recruter les meilleurs, un vivier de talents plutôt qu'une école grand public classique, sans fermer la porte à l'entrée
- Nom choisi après exploration de plusieurs pistes (Déclic, Essor IA, Baobab, Étincelle IA, Odyssée IA, Akili IA, Pépinière IA, Le Tremplin IA, La Relève IA), vérifiées une par une pour écarter les noms déjà pris dans le paysage des académies IA francophones (très encombré autour de "Académie IA" / "IA Académie"). La Forge IA et Le Cercle IA écartés pour collision réelle avec des entités IA existantes
- `CLAUDE.md` (pas de nom cité) laissé inchangé, `context/CONTEXT.md` mis à jour (nom et vision) dans la section "Détails par activité" et "Mes projets en cours"
- Travail de charte graphique en cours dans Claude Design : 3 premiers concepts de logo produits pour l'ancien nom "Entrepreneur Académie" (Ascension, Réseau, Savoir), jugés pas assez raffinés et construits pour un nom désormais obsolète. Nouveaux concepts à refaire pour "Vivier IA"
- Note technique : Node.js absent de la machine, installé en version portable (sans droits admin) dans `%LOCALAPPDATA%\claude-node-portable` pour pouvoir assembler les canvas Claude Design

### Logo retenu pour Vivier IA : le Banc

- Décision : le logo de Vivier IA est le concept **Banc** (un banc de poissons stylisés, un meneur en tête du groupe), parmi 6 concepts explorés au total (3 pour l'ancien nom, 3 pour Vivier IA)
- Palette retenue : encre `#113832`, banc en sarcelle `#2B8C82`, meneur en corail `#FF7A4D`, fond `#F2F7F5`. Typographie Unbounded (titres) + Manrope (texte courant)
- Processus : palette choisie par essai direct sur des pastilles de couleur interactives dans Claude Design plutôt que par proposition à l'aveugle, après que les premières palettes proposées n'aient pas convaincu
- Canvas final publié avec le logo retenu en page principale, et les 2 pistes non retenues (Sceau institutionnel navy/bronze, Ligature wordmark seul fond sombre) gardées sur une page "Explorations" pour référence, pas supprimées
- Reste à faire : décliner ce logo sur d'autres supports (site, réseaux sociaux, PPTX du Module 1) si besoin, pas encore fait à ce stade

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
