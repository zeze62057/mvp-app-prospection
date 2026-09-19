# Fonctionnalités du MVP, App Prospection MLM

> Livrable produit le 2026-09-07.
> Liste priorisée. "Indispensable MVP" = requis pour une première version utilisable.
> "Amélioration future" = reporté après le MVP.

---

## 1. Gestion des comptes agents

### Indispensable MVP

- Connexion et session d'un agent via Supabase Auth.
- Déconnexion.
- Profil agent minimal : nom complet, email.
- Rattachement d'un agent à son parrain (`parrain_id`), pour porter la hiérarchie multi-niveaux.
- Isolation des données par compte : un agent n'accède qu'à ses prospects et à ceux de sa downline.

### Amélioration future

- Auto-inscription ouverte avec choix ou saisie du parrain par l'agent lui-même.
- Gestion d'un rôle explicite (agent, chef d'équipe, admin).
- Activation et désactivation d'un compte agent, avec règle de reprise de ses prospects.
- Édition avancée du profil (photo, téléphone, bio).
- Réinitialisation de mot de passe en autonomie.

---

## 2. Création et suivi des prospects

### Indispensable MVP

- Création manuelle d'un prospect par l'agent depuis son tableau de bord.
- Rattachement automatique du prospect à l'agent qui le crée.
- Champs de contact : nom, téléphone, email.
- Liste des prospects de l'agent, avec statut visible sur chaque ligne.
- Filtre de la liste par statut et recherche par nom.
- Vue détail d'un prospect.
- Ajout d'interactions de suivi horodatées sur la fiche du prospect (appel, message, rendez-vous, relance, note).
- Timeline de l'historique de suivi sur la vue détail.
- Édition des informations de contact d'un prospect.
- Lecture, par un agent, des prospects de toute sa downline.

### Amélioration future

- Réattribution d'un prospect d'un agent à un autre.
- Import de prospects en masse (CSV).
- Champ "source" marketing du prospect (canal, campagne).
- Champs personnalisés, tags, segments.
- Rappels et relances programmées, notifications.
- Détection et fusion des doublons.
- Export de la liste des prospects.
- Suppression de prospect avec corbeille.

---

## 3. Changement de statut

### Indispensable MVP

- Passage d'un prospect d'un statut à l'autre parmi les sept : Nouveau, Contacté, Dans le tunnel, Intéressé, En négociation, Closé gagné, Closé perdu.
- Changement de statut depuis la vue détail du prospect.
- Historisation de chaque changement de statut (qui, quand, ancien et nouveau statut), visible dans la timeline.

### Amélioration future

- Contrainte de l'ordre du pipeline (interdire les sauts d'étapes non voulus).
- Changement de statut en masse depuis la liste.
- Vue kanban avec déplacement des cartes entre colonnes de statut.
- Statistiques de conversion par étape, temps moyen passé dans chaque statut.

---

## 4. Tunnel de conversion public

### Indispensable MVP

- Une page publique de type landing avec présentation de l'opportunité.
- Formulaire de capture : nom, téléphone, email.
- Création automatique d'un prospect au statut "Nouveau" à la soumission, avec `mode_creation = 'formulaire_public'`.
- Écran ou message de confirmation après envoi.

### Amélioration future

- Plusieurs landing pages ou plusieurs tunnels, avec suivi séparé.
- Une landing par agent, avec lien personnel traçable.
- Personnalisation du contenu de la landing par l'agent.
- Protection anti-spam (captcha, limitation de débit).
- Mention de collecte des données et recueil du consentement.
- Relance automatique par email ou message dès l'entrée d'un prospect "Nouveau".
- Statistiques de la landing (visites, taux de conversion du formulaire).

---

## 5. Closing

### Indispensable MVP

- Statuts "Closé gagné" et "Closé perdu" atteignables depuis le sélecteur de statut.
- Compteur des prospects closés gagnés et closés perdus sur le tableau de bord.

### Amélioration future

- Saisie de données de closing : montant, produit ou offre, date de closing.
- Saisie d'un motif de perte pour les "Closé perdu".
- Tableau de bord de performance : taux de closing, chiffre d'affaires généré, classement des agents d'une lignée.
- Relance planifiée des prospects "Closé perdu" après un délai.

---

## ⚠️ À valider

- **Méthode d'authentification.** Email et mot de passe, ou code OTP par SMS vu le contexte Guinée et l'usage mobile ?
- **Création des comptes agents.** Auto-inscription ouverte, ou création sur invitation par BONJOUR ou un chef de lignée ?
- **Désactivation d'un compte agent.** Que deviennent ses prospects et sa downline ?
- **Définition métier de "Dans le tunnel" et de "closing".** Que recouvrent exactement ces étapes côté processus de vente ?
- **Données de closing.** Le closing implique-t-il de saisir un montant, un produit, une date, un motif de perte, dès le MVP ?
- **Suppression de prospect.** Autorisée dans le MVP, et selon quelles règles ?
- **Consentement sur le formulaire public.** Faut-il une mention de collecte et un opt-in dès le MVP ?
- **Périmètre mobile.** Web responsive suffisant pour le MVP, ou application mobile dédiée attendue plus tard ?
- **Vue équipe.** Un chef de lignée a-t-il besoin, dans le MVP, d'un tableau de bord agrégé de sa downline, ou la lecture des prospects individuels suffit-elle ?
