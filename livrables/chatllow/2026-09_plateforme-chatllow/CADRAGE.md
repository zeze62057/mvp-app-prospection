# Cadrage — Plateforme Chatllow (diagnostic IA + espace client)

Date du cadrage : 2026-09-16.

Nom du projet : **Chatllow**. Nom déjà choisi et utilisé dans tout le workspace (`context/CONTEXT.md`, `livrables/chatllow/README.md`, KPIs du cabinet) : ce n'est pas à retrancher ici. Ce qui manque encore, c'est l'identité visuelle (logo, charte graphique) — voir section 6.

## 1. Type de projet

Application / SaaS (variante décrite dans `livrables/transverse/methode-approche-projet.md`), pas une simple vitrine. Deux briques produit sous une même identité :

1. Un **diagnostic / audit IA interactif en ligne**, en libre-service, pour capter le lead en entrée.
2. Un **espace client** (suivi de mission, livrables, échanges), ouvert une fois le client signé.

## 2. Objectif

Construire la crédibilité générale de Chatllow pour du **trafic froid** : un dirigeant qui découvre Chatllow pour la première fois (recherche, recommandation, réseau) doit percevoir immédiatement un cabinet sérieux et légitime face à des cabinets IA déjà établis, sans qu'un rendez-vous commercial ait encore eu lieu.

Ce n'est explicitement **pas** un outil pensé pour convertir en urgence un prospect déjà chaud identifié : la priorité est la crédibilité de fond, pas la vitesse de closing sur un cas précis.

## 3. Cible

Un dirigeant ou décideur d'une entreprise CAC40 (ou grand compte de profil comparable), qui **cherche activement un prestataire IA** et **compare plusieurs cabinets** avant de choisir. Il n'arrive pas convaincu : il évalue Chatllow face à des alternatives déjà installées sur ce marché.

Conséquence directe sur le ton et la forme : le diagnostic interactif et l'espace client doivent tenir la comparaison avec ce que ce profil a l'habitude de voir chez des cabinets de conseil établis, pas paraître comme un prototype ou un outil interne habillé pour l'extérieur.

## 4. Problème réel résolu

Aujourd'hui, rien dans le workspace ne représente Chatllow publiquement : le seul outil existant côté Chatllow est `livrables/chatllow/2026-09_generateur-audit-ia-chatllow/`, un outil **interne** que Zézé remplit lui-même pendant ou après un rendez-vous commercial déjà obtenu. Il ne s'adresse jamais directement à un prospect froid et ne constitue pas une vitrine.

Cette plateforme comble ce vide : un point d'entrée public qui fait à la fois la démonstration de compétence (le diagnostic, en le faisant vivre à froid par le prospect lui-même) et le suivi professionnel une fois la mission signée (l'espace client), sous la marque Chatllow.

**Distinction à garder en tête pour la suite du projet** : le générateur d'audit existant reste un outil interne (Zézé renseigne les infos recueillies en RDV) et n'est pas remplacé par ce nouveau diagnostic (auto-administré par le prospect lui-même, avant tout contact). Les deux peuvent coexister ; leur éventuelle fusion ou articulation reste à trancher si le besoin apparaît, pas supposée ici.

Autre point de vigilance : `livrables/vivier-ia/2026-09_plateforme-formation-communaute/CADRAGE.md` (projet Vivier Academies) mentionne, en extension future hors V1, une simple **page de présentation Chatllow** visible par les membres de la communauté Vivier Academies, avec un appel à l'action. C'est un objet plus léger et différent de la présente plateforme (une page de renvoi pour une audience déjà captive, pas un site autonome pour du trafic froid). Les deux projets ne doivent pas être confondus ni fusionnés sans décision explicite.

## 5. Priorité

Crédibilité générale d'abord, conversion opportuniste ensuite. Aucun prospect chaud identifié à ce jour ne dicte le calendrier ou le périmètre de ce projet.

## 6. Identité visuelle

**Tranchée le 2026-09-16.** Nom acquis (Chatllow) et charte graphique choisie parmi 5 pistes explorées dans `livrables/chatllow/2026-09_chatllow-identite-visuelle/` (canvas Claude Design) : piste "Signal net" retenue — sans-serif géométrique Space Grotesk, encre `#14161F` + indigo `oklch(62% 0.19 250)`, mini-mark en deux bulles superposées, fond quasi-blanc `#FCFCFB`, typo courante IBM Plex Sans / IBM Plex Mono. Les 4 pistes non retenues restent visibles sur une page "Explorations" du même canvas, gardées pour référence.

## 7. Répartition produit / automatisation

**Produit (Claude Code)**, à affiner en construction :
- Diagnostic / audit IA interactif public (questions, restitution du résultat, capture du lead)
- Espace client authentifié (suivi de mission, dépôt et consultation de livrables, échanges avec Chatllow)

**Automatisation (n8n)** : rien n'est décidé à ce stade. Des besoins probables existeront (notification à Zézé quand un diagnostic est complété, envoi du résultat par email au prospect, éventuelle notification côté espace client), mais aucun n'a été validé avec Zézé. À traiter explicitement à l'étape 5 (construction), pas à deviner ici. Si un besoin d'automatisation est confirmé plus tard, appliquer la règle générale de la méthode : ce qui relève du produit reste dans Claude Code, ce qui relève de la plomberie entre systèmes va dans n8n, décidé avant de construire.

## 8. Périmètre

**Ce qui est acté** :
- Diagnostic IA interactif public, en libre-service
- Espace client (suivi de mission, livrables, échanges) pour les clients signés

**Tranché le 2026-09-16, avant la maquette** :
- Restitution du diagnostic : une recommandation de pilote concret (pas un simple score, pas un rapport générique)
- Après le diagnostic : les deux — email systématique du résultat, plus option de prise de RDV intégrée
- Une vitrine classique précède le diagnostic (accueil, présentation du cabinet, preuves sociales), le diagnostic n'est pas l'entrée directe
- La maquette couvre les deux briques dès cette passe : diagnostic public ET espace client

**Ce qui reste à préciser pendant la maquette (étape 3)**, non tranché à ce jour :
- Contenu exact du diagnostic : quelles questions, combien d'étapes
- Fonctionnalités précises de l'espace client (quels types de livrables, quel niveau d'échange, notifications)

## 9. Contraintes connues

- Aucun délai de lancement, confirmé le 2026-09-16
- Cible CAC40 en comparaison active : exigence de qualité perçue élevée, le soin visuel et le sérieux du ton comptent autant que les fonctionnalités
- Aucune contrainte de budget communiquée

## 10. Points encore à trancher

- **Détail de l'espace client** : nature exacte des livrables et échanges à supporter
- **Relation avec le générateur d'audit interne existant** (`2026-09_generateur-audit-ia-chatllow`) : coexistence simple, fusion partielle, ou remplacement — non tranché

**Tranchés le 2026-09-17** :
- Contenu du diagnostic : 7 questions (les 3 initiales + sponsor du pilote, disponibilité des données, délai souhaité, budget), stockées en jsonb (`reponses`) plutôt qu'en colonnes fixes pour absorber les futures évolutions sans nouvelle migration
- Automatisation n8n : un besoin confirmé — notifier Zézé par email à chaque diagnostic complété (à construire, voir historique)
- Stack technique : Next.js + Supabase (voir CLAUDE.md)

## Historique du cadrage

**2026-09-16** — Premier cadrage complet. Type de projet (Application/SaaS), priorité (crédibilité trafic froid, pas closing urgent), fonction (diagnostic interactif + espace client), cible (dirigeant CAC40 en comparaison active), délai (aucun) et identité (nom Chatllow acquis, charte visuelle manquante) tranchés avec Zézé.

**2026-09-16** — Identité visuelle tranchée : piste "Signal net" retenue (voir `livrables/chatllow/2026-09_chatllow-identite-visuelle/`), sans-serif géométrique Space Grotesk, encre + indigo, mini-mark en bulles superposées. Restitution du diagnostic (recommandation de pilote), parcours post-diagnostic (email + RDV) et présence d'une vitrine classique avant le diagnostic également tranchés, avant de passer à la maquette (étape 3). Le contenu détaillé du diagnostic, le détail de l'espace client, un éventuel besoin d'automatisation n8n et la stack technique restent ouverts.

**2026-09-16** — Maquette cliquable construite (voir `livrables/chatllow/2026-09_plateforme-chatllow/maquette/`) : accueil, diagnostic (3 questions), restitution, prise de RDV, espace client. Relecture explicite pour la cible CAC40 : registre vouvoiement vérifié sur tout le parcours, accents français rétablis partout, mention de confidentialité des réponses ajoutée sur l'accueil, le diagnostic et la restitution (le sujet de la protection des données pèse particulièrement pour cette cible). Un bug de barre de progression et une faute d'accord ont aussi été corrigés lors de cette relecture.

**2026-09-16** — `CLAUDE.md` du projet créé. Stack technique tranchée : Next.js + Supabase, comme Vivier Academies. Passage à l'étape 5 (construction, tâche par tâche).

**2026-09-16** — Première tâche de construction : scaffold Next.js (`app/`, TypeScript, Tailwind v4, App Router) et écran d'accueil réel construit à partir de la maquette (version éditoriale). Vérifié en direct (desktop + mobile), TypeScript et ESLint propres. Périmètre volontairement réduit à l'accueil statique : le schéma Supabase séparé (`chatllow`) est reporté à la tâche qui en aura réellement besoin (persistance du diagnostic), car exposer un nouveau schéma via l'API Data de Supabase demande une configuration dashboard à faire en direct avec Zézé, pas quelque chose à faire de façon autonome maintenant.

**2026-09-16** — Parcours public complet construit en front-end pur (pas encore de persistance) : `/diagnostic` (3 questions, navigation par étapes), `/restitution` (recommandation + envoi email simulé + lien RDV), `/rdv` (choix de créneau + confirmation). Chaque écran testé en cliquant le parcours réel dans le navigateur, TypeScript et ESLint propres à chaque étape. Reste à faire : brancher une vraie persistance (réponses du diagnostic, envoi d'email réel, prise de RDV réelle) une fois le schéma Supabase mis en place avec Zézé.

**2026-09-16** — Identité affinée après inspiration visuelle de iapreneurs.com (fond crème texturé, accent italique serif sur un mot-clé, boutons en pilule) : le style visuel a évolué, mais le ton reste sobre CAC40, tranché explicitement — pas de storytelling fondateur façon "avant/après" façon vente à chaud, et surtout pas de témoignages ou de note Trustpilot tant que Chatllow n'a pas de client réel (règle sur les fausses preuves sociales, déjà actée, confirmée ici). Accueil restylé et vérifié desktop + mobile.

**2026-09-16** — Espace client construit (`/espace-client`) : onglets Suivi de mission / Livrables / Échanges, stepper de mission, liste de livrables, fil de messages. Front-end pur comme le reste du parcours, sans authentification pour l'instant (nécessitera Supabase Auth, à faire en direct avec Zézé). Les 5 écrans de la maquette sont maintenant tous construits en vrai code. Reste : authentification de l'espace client, persistance Supabase de bout en bout, et le contenu de cours/mission réel une fois un client signé.

**2026-09-16** — Restyle crème/pilule/italique étendu aux 4 écrans restants (diagnostic, restitution, RDV, espace client), pour cohérence avec l'accueil. Nuance volontaire : les boutons pilule et l'accent italique restent réservés aux écrans à vocation marketing (diagnostic, restitution, RDV) ; l'espace client (app interne une fois le client signé) garde un traitement plus sobre, boutons rectangulaires classiques, cohérent avec son rôle d'outil plutôt que de vitrine. Vérifié en direct sur les 4 écrans.

**2026-09-17** — Notification email activée de bout en bout. Blocage résolu en direct avec Zézé : pas d'app OAuth Google préconfigurée sur ce n8n auto-hébergé, donc passage à un credential SMTP (mot de passe d'application Gmail) plutôt qu'OAuth — plus rapide à mettre en place. Zézé a activé la validation en 2 étapes sur son compte Google (elle ne l'était pas), généré un mot de passe d'application, connecté le credential SMTP dans n8n, testé le nœud d'envoi (accepté par Gmail), puis publié le workflow. Test final en conditions réelles via l'URL de production confirmé : email bien reçu. L'automatisation diagnostic → notification email est maintenant pleinement opérationnelle.

**2026-09-17** — Automatisation n8n construite : workflow "Chatllow — Notification diagnostic complété" (webhook + envoi Gmail), créé et validé, plus une route `/api/notifier-diagnostic` côté Next.js qui construit le résumé lisible (question + réponse) et relaie vers n8n, appelée en best-effort après chaque insertion Supabase réussie (un échec de notification ne bloque jamais le visiteur). Bloqué sur un point : aucun compte email n'était connecté sur l'instance n8n de Zézé, le nœud Gmail n'a donc pas de credential — confirmé par un test réel (webhook renvoie 404, le workflow reste inactif tant que le credential n'est pas connecté et le workflow publié). Prochaine étape en direct avec Zézé : connecter Gmail dans n8n puis activer le workflow.

**2026-09-17** — Diagnostic étendu de 3 à 7 questions (sponsor du pilote, disponibilité des données, délai souhaité, budget). La table `chatllow_diagnostics` passe de colonnes `reponse_1/2/3` fixes à une colonne `reponses` jsonb, plus adaptée à un questionnaire encore en évolution. Décision prise avec Zézé : besoin d'automatisation n8n confirmé (notification email à chaque diagnostic complété), à construire.

**2026-09-17** — RDV branché à Supabase : table `public.chatllow_rdv` (email, jour, heure), même convention RLS insert-only que le diagnostic. Un champ email obligatoire a été ajouté à la page RDV (elle n'en avait pas avant, impossible de savoir qui réservait quoi). Insertion vérifiée via appel API direct (201 confirmé) ; vérification complète par clic réel toujours en attente, l'outil de navigateur (Playwright) reste déconnecté.

**2026-09-17** — Première persistance réelle branchée : table `public.chatllow_diagnostics` créée dans le même projet Supabase que Vivier Academies (préfixe `chatllow_`, pas de schéma séparé, décision du 2026-09-16 pour éviter une étape manuelle dans le dashboard). RLS activée avec une politique insert-only pour `anon`/`authenticated`, sans politique select (les réponses ne seront lisibles que par un futur outil admin via le service role). Le diagnostic stocke les 3 réponses en `sessionStorage`, la restitution les envoie à Supabase avec l'email au moment de l'envoi (`@supabase/supabase-js` ajouté à l'app, clé anon dans `.env.local`). Le chemin d'insertion est vérifié par un appel API direct identique à celui du code (201 confirmé) ; le test de bout en bout dans le navigateur a été interrompu par une coupure de connexion de l'outil de navigation avant la fin, à refaire pour une vérification complète en conditions réelles.
