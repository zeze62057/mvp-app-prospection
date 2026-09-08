# App Prospection MLM, MVP

> Projet démarré le 2026-09-07.
> Cadrage produit par Claude, avant toute écriture de code.

## But

Application de prospection pour le marketing de réseau. Chaque agent (BONJOUR et sa
lignée de filleuls) gère ses propres prospects, suit ses interactions et fait
avancer chaque prospect dans un pipeline de statuts jusqu'au closing. Un formulaire
public sur une landing page alimente automatiquement le pipeline en nouveaux
prospects.

## Stack prévue

- Base de données : Supabase (Postgres, Auth, RLS)
- Front et hébergement : à définir

## Contenu du dossier

| Fichier | Rôle |
|---------|------|
| `schema-base-de-donnees.md` | Schéma Supabase proposé : tables, enum de statut, isolation des données par hiérarchie, double voie de création des prospects |
| `prompt-claude-design.md` | Prompt prêt à copier dans Claude Design pour générer les 3 écrans du MVP |
| `fonctionnalites-mvp.md` | Liste priorisée des fonctionnalités, indispensable MVP vs amélioration future |

## Statut

Cadrage en cours. Chaque fichier contient une section `⚠️ À valider` qui liste les
points métier et techniques à trancher avant le développement.

## Décisions déjà prises

- Visibilité des données : hiérarchie multi-niveaux. Un agent voit ses prospects et
  ceux de toute sa downline (filleuls, sous-filleuls, récursif) en lecture. L'agent
  propriétaire reste seul à écrire par défaut.
