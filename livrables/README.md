# Livrables

> Tout ce que Claude produit pour Zézé est rangé ici, **par activité**.

---

## Règle d'or : inputs vs outputs

| Type | Emplacement | Exemples |
|------|-------------|----------|
| **Inputs** (ce que tu fournis à Claude) | `context/import/` | PDF, exports Notion, transcriptions, captures, CSV |
| **Outputs** (ce que Claude produit pour toi) | `livrables/` | sites, applications, scripts, propositions commerciales, supports de cours |

Claude ne dépose jamais un livrable ailleurs que dans `livrables/`. Les documents bruts que tu apportes restent dans `context/import/`.

---

## Organisation du dossier

Un dossier par activité. Tout ce qui touche une activité (application, site, identité visuelle, contenu) vit dans son dossier, quel que soit le type de livrable.

```
livrables/
├── chatllow/           Cabinet de conseil IA : plateforme, générateurs d'audit, identité visuelle, propositions
├── vivier-ia/          École de l'IA : plateforme Vivier Academies, sites, identité visuelle, cours/
├── longrich/           Marketing de réseau : Kora, suivi formation, programme 50 chapitres, livre MLM
├── ecommerce/          Plateforme e-commerce multi-vendeurs (nom à définir)
├── youtube/            Chaîne YouTube : briefs, scripts, hooks, calendrier
├── pilotage-business/  Suivi des activités : KPIs, facturation
└── transverse/         Ce qui sert à tous les projets : méthode d'approche, mémoire de l'agent LinkedIn
```

Chaque dossier d'activité a son propre `README.md` qui précise ce qu'on y met.

> **Cas du marketing de réseau** : le programme de formation et le livre vivent dans `longrich/`. Le module "IA appliquée au marketing de réseau" est un module de l'école, il est dans `vivier-ia/cours/marketing-reseau/`.

### Où ranger un nouveau livrable ?

1. Il appartient à une activité (Chatllow, Vivier IA, Longrich...) : dans le dossier de cette activité.
2. Il sert à plusieurs activités (méthode, modèle, mémoire d'agent) : dans `transverse/`.
3. Aucune activité ne convient : demander avant de créer un nouveau dossier à la racine.

---

## Convention de nommage des projets

Un projet = un sous-dossier dans le dossier de son activité, nommé ainsi :

```
AAAA-MM_nom-du-projet-en-kebab-case/
```

- `AAAA-MM` : année et mois de démarrage du projet
- `nom-du-projet` : court, explicite, en minuscules, mots séparés par des tirets
- Pas d'accents, pas d'espaces, pas de majuscules

Exemples :

```
livrables/chatllow/2026-10_proposition-client-cac40/
livrables/vivier-ia/2026-11_module-6-prompting/
livrables/longrich/2026-09_bot-veille-actus/
livrables/youtube/2026-09_serie-20-premieres-videos/
```

### Fichiers isolés (hors projet)

Pour un livrable unique qui ne mérite pas un dossier projet, on nomme le fichier directement :

```
AAAA-MM-JJ_nom-du-livrable.ext
```

Exemple : `livrables/youtube/2026-09-06_hooks-video-intro-ia.md`

---

## Bonnes pratiques

- Un `README.md` à la racine de chaque dossier projet pour décrire son but et son statut
- On archive plutôt que supprimer : préfixer un vieux projet par `_archive_` si besoin
- Les fichiers de travail temporaires ne vont pas ici, ils restent hors du workspace
- Avant de déplacer un projet : chercher son chemin dans `CLAUDE.md`, `.claude/` et `context/` pour ne casser aucune référence
