# Schéma de base de données Supabase, MVP App Prospection MLM

> Livrable produit le 2026-09-07.
> Base : Supabase (Postgres + Auth + RLS). Proposition à valider avant migration.

---

## Conventions

- Nommage en `snake_case`, tables au pluriel.
- Clés primaires en `uuid` (`gen_random_uuid()`).
- Dates en `timestamptz`, colonnes `created_at` et `updated_at` sur chaque table, `updated_at` maintenu par trigger.
- RLS activé sur toutes les tables. Aucune table n'est accessible sans policy.
- Les valeurs de statut sont gérées par un type `enum` Postgres pour empêcher les valeurs hors liste.

---

## Vue d'ensemble

| Table | Rôle |
|-------|------|
| `agents` | Comptes des agents (BONJOUR et ses filleuls), profil lié à `auth.users`, lien de parrainage |
| `prospects` | Les prospects, rattachés à l'agent qui les gère, avec leur statut courant |
| `interactions` | Historique de suivi : chaque échange ou action réalisée sur un prospect |
| `changements_statut` | Journal d'audit des transitions de statut d'un prospect |

---

## Type enum : statut du prospect

```sql
create type prospect_statut as enum (
  'nouveau',
  'contacte',
  'dans_le_tunnel',
  'interesse',
  'en_negociation',
  'close_gagne',
  'close_perdu'
);
```

Correspondance avec le pipeline demandé :

| Valeur stockée | Libellé affiché |
|----------------|-----------------|
| `nouveau` | Nouveau |
| `contacte` | Contacté |
| `dans_le_tunnel` | Dans le tunnel |
| `interesse` | Intéressé |
| `en_negociation` | En négociation |
| `close_gagne` | Closé gagné |
| `close_perdu` | Closé perdu |

## Type enum : mode de création du prospect

```sql
create type mode_creation_prospect as enum (
  'manuel',
  'formulaire_public'
);
```

Sert uniquement à tracer laquelle des deux voies de création documentées a été
utilisée. Ce n'est pas un canal marketing (voir `⚠️ À valider`).

---

## Table `agents`

Profil applicatif de l'agent. La ligne est créée à l'inscription et son `id`
reprend l'`id` de `auth.users`.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `uuid` | PK, `references auth.users(id) on delete cascade` | Identité de l'agent |
| `nom_complet` | `text` | `not null` | Nom affiché de l'agent |
| `email` | `text` | | Repris de l'authentification, pour affichage |
| `parrain_id` | `uuid` | `references agents(id)`, nullable | Agent qui a parrainé cet agent. `null` pour la racine (BONJOUR) |
| `actif` | `boolean` | `not null default true` | Compte actif ou désactivé (comportement précis en `⚠️ À valider`) |
| `created_at` | `timestamptz` | `not null default now()` | |
| `updated_at` | `timestamptz` | `not null default now()` | Maintenu par trigger |

Index : `agents(parrain_id)`.

La hiérarchie multi-niveaux est portée par la colonne auto-référente `parrain_id`.
La chaîne des parrains d'un agent, remontée récursivement, définit qui peut voir
ses prospects.

---

## Table `prospects`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `agent_id` | `uuid` | `not null references agents(id)` | Agent qui gère ce prospect. Rattachement obligatoire, base de l'isolation des données |
| `nom` | `text` | `not null` | Nom du prospect |
| `telephone` | `text` | | Numéro du prospect |
| `email` | `text` | | Email du prospect |
| `statut` | `prospect_statut` | `not null default 'nouveau'` | Étape courante dans le pipeline |
| `mode_creation` | `mode_creation_prospect` | `not null` | `manuel` ou `formulaire_public` |
| `created_at` | `timestamptz` | `not null default now()` | |
| `updated_at` | `timestamptz` | `not null default now()` | Maintenu par trigger |

Contrainte : `check (telephone is not null or email is not null)`, pour garantir au
moins un moyen de contact. À confirmer (voir `⚠️ À valider`).

Index : `prospects(agent_id)`, `prospects(statut)`, `prospects(agent_id, statut)`.

Un prospect créé via le formulaire public arrive obligatoirement avec
`statut = 'nouveau'` et `mode_creation = 'formulaire_public'`.

---

## Table `interactions`

Historique de suivi. Une ligne par échange ou action réalisée sur un prospect
(appel, message, rendez-vous, relance, note libre).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `prospect_id` | `uuid` | `not null references prospects(id) on delete cascade` | Prospect concerné |
| `agent_id` | `uuid` | `not null references agents(id)` | Agent auteur de l'action |
| `type` | `text` | | Nature de l'interaction. Liste de valeurs à définir (voir `⚠️ À valider`) |
| `contenu` | `text` | | Texte libre de l'agent |
| `created_at` | `timestamptz` | `not null default now()` | Date de l'interaction |

Index : `interactions(prospect_id, created_at)`.

---

## Table `changements_statut`

Journal d'audit des transitions de statut, pour retracer l'avancement d'un prospect
dans le pipeline sur la vue détail.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | `uuid` | PK | |
| `prospect_id` | `uuid` | `not null references prospects(id) on delete cascade` | Prospect concerné |
| `agent_id` | `uuid` | `not null references agents(id)` | Agent qui a effectué le changement |
| `ancien_statut` | `prospect_statut` | nullable | `null` à la création du prospect |
| `nouveau_statut` | `prospect_statut` | `not null` | Statut après le changement |
| `created_at` | `timestamptz` | `not null default now()` | |

Index : `changements_statut(prospect_id, created_at)`.

Alimentation proposée : trigger `after insert or update of statut on prospects` qui
insère automatiquement une ligne. Alternative possible : ne pas créer cette table et
enregistrer les changements de statut comme des `interactions` typées (voir
`⚠️ À valider`).

---

## Isolation des données et RLS

Objectif : chaque agent accède à ses prospects et à ceux de toute sa downline
(filleuls, sous-filleuls, en récursif), en lecture. L'écriture reste réservée à
l'agent propriétaire par défaut.

### Fonction de downline

Une fonction `security definer` qui indique si un agent cible fait partie de la
downline de l'utilisateur courant :

```sql
create or replace function est_dans_ma_downline(cible uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  with recursive downline as (
    select id from agents where parrain_id = auth.uid()
    union all
    select a.id from agents a
    join downline d on a.parrain_id = d.id
  )
  select exists (select 1 from downline where id = cible);
$$;
```

### Policies

**`agents`**
- `select` : `id = auth.uid() or est_dans_ma_downline(id)`
- `update` : `id = auth.uid()`
- `insert` : géré à l'inscription (voir `⚠️ À valider` sur le mode de création des comptes)

**`prospects`**
- `select` : `agent_id = auth.uid() or est_dans_ma_downline(agent_id)`
- `insert` : `agent_id = auth.uid()`
- `update` : `agent_id = auth.uid()`
- `delete` : `agent_id = auth.uid()` (autorisation de suppression à confirmer)

**`interactions`** et **`changements_statut`**
- `select` : autorisé si le prospect parent est visible par l'utilisateur (sous-requête sur `prospects` avec la même règle que ci-dessus)
- `insert` : `agent_id = auth.uid()` et prospect parent visible

### Voie du formulaire public

Le formulaire public n'a pas d'utilisateur authentifié, donc les policies ci-dessus
le bloquent. La création passe par une fonction `security definer` ou une Edge
Function dédiée, exposée sans session, qui :
1. force `statut = 'nouveau'` et `mode_creation = 'formulaire_public'`,
2. renseigne `agent_id` selon la règle d'attribution retenue (voir `⚠️ À valider`),
3. n'accepte que les champs `nom`, `telephone`, `email`.

---

## Double voie de création des prospects, résumé

| Voie | Déclencheur | `agent_id` | `statut` initial | `mode_creation` |
|------|-------------|-----------|------------------|-----------------|
| Ajout manuel | Agent connecté depuis son tableau de bord | `auth.uid()` | libre, `nouveau` par défaut | `manuel` |
| Formulaire public | Soumission sur la landing page | selon règle à définir | `nouveau` forcé | `formulaire_public` |

---

## ⚠️ À valider

- **Attribution des prospects du formulaire public.** Le rattachement d'un prospect à un agent est obligatoire, mais le formulaire public n'a pas d'agent connecté. Options non tranchées : une landing par agent avec un identifiant d'agent dans l'URL, OU toutes les soumissions vers BONJOUR ou un agent par défaut, OU une file "à attribuer" qui impose de rendre `agent_id` nullable et d'ajouter un écran d'affectation. Aucune option n'est retenue ici.
- **Champs de contact du prospect.** Le brief ne précise pas les champs. Proposés : `nom`, `telephone`, `email`. À confirmer, et préciser si `ville`, `réseau social`, `profession` ou autre sont attendus, et lesquels sont obligatoires.
- **Champ "source" marketing.** Faut-il, en plus de `mode_creation`, un champ décrivant le canal ou la campagne d'origine du prospect (bouche à oreille, Facebook, WhatsApp, événement) ? Non ajouté pour l'instant.
- **Plusieurs tunnels.** Faut-il gérer plusieurs landing pages ou plusieurs tunnels distincts, avec suivi séparé ? Le schéma actuel suppose un seul formulaire public.
- **Table `changements_statut` dédiée ou interactions typées.** Deux modélisations possibles pour l'historique des changements de statut. Choix à arbitrer.
- **Données de closing.** "Closé gagné" et "Closé perdu" sont pour l'instant de simples statuts. Faut-il stocker un montant, un produit, une date de closing, un motif de perte ? Si oui, prévoir une table `closings` ou des colonnes dédiées.
- **Rôles explicites.** Faut-il une colonne `role` sur `agents` (agent, chef d'équipe, admin) en plus de la hiérarchie `parrain_id` ?
- **Suppression et conservation.** La suppression d'un prospect est-elle autorisée ? Faut-il un consentement ou une mention de collecte sur le formulaire public, et une durée de conservation ?
- **Implémentation de la downline.** Fonction récursive (simple, plus lente à grande échelle) ou table de fermeture `agent_hierarchie(ancetre_id, descendant_id, profondeur)` maintenue par trigger (plus rapide, plus de code). À trancher selon le volume attendu.
- **Transitions de statut.** Le passage d'un statut à l'autre est-il libre entre les 7 valeurs, ou faut-il contraindre l'ordre du pipeline (machine à états) ?
- **Désactivation d'un compte agent.** Que deviennent ses prospects et sa downline quand `actif` passe à `false` ?
