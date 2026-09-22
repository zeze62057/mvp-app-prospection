# Kit Starter Vivier Academies

> Le module d'installation de votre assistant personnel, pour bien démarrer la formation Vivier IA.

| Champ | Valeur |
|-------|--------|
| Module | `kit-starter-vivier-academies` |
| Version | v1 |
| Temps d'installation | 5 à 10 minutes |
| Coût | Inclus dans la formation |

---

## Ce que fait ce module

- **Une courte interview guidée** : Claude Code vous pose quelques questions essentielles pour bien vous connaître
- **3 fichiers personnalisés**, copiés depuis les modèles de `templates/` puis remplis avec vos réponses, qui forment votre assistant personnel :
  - `CLAUDE.md` (qui vous êtes, comment vous parler)
  - `context/CONTEXT.md` (votre situation, vos objectifs, vos projets)
  - `context/HISTORY.md` (le journal de ce qui a été fait et décidé)
- **Un workspace organisé dès le départ** : un dossier `projets/`, séparé de votre assistant, pour tout ce que vous construirez en pratiquant la formation
- **Un récapitulatif avant écriture**, pour que vous validiez avant que rien ne soit enregistré

## Contenu du module

```
kit-starter-vivier-academies/
├── README.md              (ce fichier)
├── INSTALL.md              (le script que Claude Code exécute)
└── templates/               (les modèles copiés puis remplis lors de l'installation)
    ├── CLAUDE.md
    ├── context/
    │   ├── CONTEXT.md
    │   └── HISTORY.md
    └── projets/
        └── README.md
```

---

## Comment l'installer

Depuis le dossier où vous voulez installer votre assistant, ouvert dans Claude Code, lancez :

```
/install module-installs/kit-starter-vivier-academies
```

Claude Code lira ce module et démarrera l'interview.

---

## Ce dont vous avez besoin avant de commencer

- 5 à 10 minutes devant vous, sans distraction
- Une idée claire de ce qui vous amène à la formation Vivier IA
- Une connexion Internet (Claude Code en a besoin)

---

## Ce qui se passe après l'installation

Votre assistant est immédiatement opérationnel. Il vous accompagne pour suivre votre progression dans la formation, et si vous le souhaitez, bien au-delà.

Vos premières réponses seront sans doute imparfaites, ou incomplètes. Ce n'est pas grave : ces fichiers ne sont pas figés, vous pourrez les corriger et les enrichir au fil de la formation.

Pour recharger votre assistant en début de session, demandez simplement à Claude Code de relire `CLAUDE.md`, `context/CONTEXT.md` et `context/HISTORY.md`, et de vous résumer où vous en êtes.

---

Kit Starter Vivier Academies, section 0 (Bienvenue) de la formation écosystème IA.
