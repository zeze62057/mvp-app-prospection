# Livrables

> Tout ce que Claude produit pour Zézé est rangé ici.

---

## Règle d'or : inputs vs outputs

| Type | Emplacement | Exemples |
|------|-------------|----------|
| **Inputs** (ce que tu fournis à Claude) | `context/import/` | PDF, exports Notion, transcriptions, captures, CSV |
| **Outputs** (ce que Claude produit pour toi) | `livrables/` | sites, scripts, briefs vidéos, propositions commerciales, supports de cours |

Claude ne dépose jamais un livrable ailleurs que dans `livrables/`. Les documents bruts que tu apportes restent dans `context/import/`.

---

## Organisation du dossier

```
livrables/
├── sites-web/       Sites internet (vitrine, landing pages, portfolios)
├── applications/    Outils, scripts, automatisations, SaaS
├── youtube/         Briefs vidéos, scripts, hooks, calendrier éditorial
├── cabinet/         Livrables pour le cabinet de conseil Chatllow
└── ecole/           Livrables pour l'Entrepreneur Académie
```

Chaque sous-dossier a son propre `README.md` qui précise ce qu'on y met.

---

## Convention de nommage des projets

Un projet = un sous-dossier dans le dossier thématique concerné, nommé ainsi :

```
AAAA-MM_nom-du-projet-en-kebab-case/
```

- `AAAA-MM` : année et mois de démarrage du projet
- `nom-du-projet` : court, explicite, en minuscules, mots séparés par des tirets
- Pas d'accents, pas d'espaces, pas de majuscules

Exemples :

```
livrables/sites-web/2026-09_landing-cabinet-chatllow/
livrables/youtube/2026-09_serie-20-premieres-videos/
livrables/cabinet/2026-10_proposition-client-cac40/
livrables/applications/2026-09_bot-veille-actus/
livrables/ecole/2026-11_module-1-prompting/
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
