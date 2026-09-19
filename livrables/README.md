# Livrables

> Tout ce que Claude produit pour Zézé est rangé ici, **par type**. Pour retrouver un projet par activité, voir le tableau plus bas.

---

## Règle d'or : inputs vs outputs

| Type | Emplacement | Exemples |
|------|-------------|----------|
| **Inputs** (ce que tu fournis à Claude) | `context/import/` | PDF, exports Notion, transcriptions, captures, CSV |
| **Outputs** (ce que Claude produit pour toi) | `livrables/` | sites, applications, scripts, propositions commerciales, supports de cours |

Claude ne dépose jamais un livrable ailleurs que dans `livrables/`. Les documents bruts que tu apportes restent dans `context/import/`.

---

## Organisation du dossier

```
livrables/
├── agents/               Fiches des agents (rôle, quand les lancer, où est le fichier actif)
├── skills/               Fiches des skills (idem)
├── applications/         Applications et plateformes : Kora, Chatllow, Vivier Academies, e-commerce, générateurs d'audit
├── formations/           Cours et programmes : écosystème IA, marketing de réseau, livre MLM
├── sites-web/            Landing pages et portail
├── identites-visuelles/  Logos et chartes graphiques : Chatllow, Vivier IA
├── cabinet/              Propositions, devis et audits clients Chatllow
├── youtube/              Chaîne YouTube : briefs, scripts, hooks, calendrier
├── pilotage-business/    Suivi des activités : KPIs, facturation
└── transverse/           Ce qui sert à tous les projets : méthode d'approche, mémoire de l'agent LinkedIn
```

Chaque dossier a son propre `README.md` qui précise ce qu'on y met.

> **Agents et skills** : Claude Code ne les charge que depuis `.claude/agents/` et `.claude/skills/`. Les dossiers `agents/` et `skills/` d'ici contiennent des fiches qui renvoient vers ces fichiers actifs. Ne jamais déplacer les fichiers actifs.

---

## Retrouver un projet par activité

| Activité | Où c'est rangé |
|----------|----------------|
| **Chatllow** (cabinet de conseil IA) | `applications/` (plateforme Chatllow, 6 générateurs d'audit), `identites-visuelles/` (identité Chatllow), `cabinet/` (propositions et audits clients) |
| **Vivier IA** (école) | `applications/` (plateforme Vivier Academies : Vivier IA et Bâtisseur Pro), `formations/` (cours), `sites-web/` (landing, portail), `identites-visuelles/` (identité Vivier IA) |
| **Longrich** (marketing de réseau) | `applications/` (Kora, suivi formation Longrich), `formations/marketing-reseau/` (programme 50 chapitres, module IA, livre MLM) |
| **E-commerce** | `applications/2026-09_plateforme-ecommerce/` |
| **YouTube** | `youtube/` |
| **Pilotage** (KPIs, facturation) | `pilotage-business/` |

---

## Où ranger un nouveau livrable ?

1. C'est un outil, une plateforme ou un script : `applications/`.
2. C'est un cours, un programme ou un support de formation : `formations/`.
3. C'est une page web publique : `sites-web/`.
4. C'est un logo ou une charte graphique : `identites-visuelles/`.
5. C'est un document client Chatllow (proposition, devis, audit) : `cabinet/`.
6. Ça sert à plusieurs projets (méthode, modèle, mémoire d'agent) : `transverse/`.
7. Rien ne convient : demander avant de créer un nouveau dossier à la racine.

---

## Convention de nommage des projets

Un projet = un sous-dossier dans le dossier de son type, nommé ainsi :

```
AAAA-MM_nom-du-projet-en-kebab-case/
```

- `AAAA-MM` : année et mois de démarrage du projet
- `nom-du-projet` : court, explicite, en minuscules, mots séparés par des tirets. Il porte l'activité quand c'est utile (`plateforme-chatllow`, `app-prospection-mlm`)
- Pas d'accents, pas d'espaces, pas de majuscules

Exemples :

```
livrables/applications/2026-10_bot-veille-actus/
livrables/formations/ecosysteme-ia/2026-11_vivier-ia-module-6-nom/
livrables/cabinet/2026-10_proposition-client-cac40/
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
