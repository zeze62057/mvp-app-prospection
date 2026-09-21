# Le Prompt Engineering

## Chapitre 1 : Les fondamentaux du Prompt Engineering

### Ce que le Module 1 a déjà posé, généralisé ici

Le Module 1 a enseigné le gabarit à 4 éléments (contexte, objectif, périmètre, autonomie) spécifiquement pour Claude Code. Ce chapitre généralise le même principe à n'importe quel usage de l'IA générative, pas seulement le code : une instruction précise produit un résultat exploitable, une instruction floue produit un résultat approximatif qu'il faut ensuite corriger, ce qui coûte plus de temps au total.

### Les éléments qui font la différence dans un bon prompt

Au-delà du gabarit à 4 éléments, un bon prompt précise le format de sortie attendu (une liste, un texte suivi, un tableau), le ton souhaité, et des exemples quand la tâche s'y prête (montrer un exemple du résultat voulu accélère souvent plus qu'une longue description abstraite).

### L'itération, pas la perfection au premier essai

Un premier prompt n'est presque jamais parfait, et ce n'est pas grave : l'itération rapide (observer le résultat, ajuster l'instruction, redemander) est plus efficace que de chercher à écrire l'instruction parfaite dès le départ. C'est le même principe que le cycle Plan/Execute/Validate du Module 1, appliqué au prompt lui-même.

### Exemple concret

Demander "écris-moi un post LinkedIn sur l'IA" produit un résultat générique. Demander "écris un post LinkedIn de 150 mots pour Camille Durand, coach en marketing de réseau, ton direct sans jargon, qui explique pourquoi les distributeurs devraient utiliser l'IA pour leur liste de noms, avec un appel à l'action en fin de post" produit un résultat directement exploitable.

**Points clés**
- Le gabarit à 4 éléments du Module 1 s'applique à tout usage de l'IA générative, pas seulement au code
- Format de sortie, ton, et exemples concrets font une vraie différence dans la qualité d'un prompt
- Itérer rapidement sur un prompt imparfait est plus efficace que chercher la perfection au premier essai

---

## Chapitre 2 : La méthode « Prompt Système »

### La distinction déjà posée côté n8n, ici généralisée

Le Module 2 (section 3, chapitre 3) a distingué le prompt utilisateur (ce qui varie à chaque exécution) du message système (ce qui reste constant). La méthode "Prompt Système" applique ce même principe à tout usage régulier de l'IA, pas seulement dans un nœud n8n : écrire une fois un cadre stable, réutilisé ensuite pour chaque nouvelle demande du même type.

### Ce qu'un prompt système bien construit contient

Le rôle exact attendu de l'IA dans ce contexte précis, les contraintes à respecter systématiquement (ton, longueur, ce qu'il ne faut jamais faire), et la conduite à tenir en cas d'incertitude (demander une clarification plutôt qu'inventer une réponse).

### Pourquoi cette méthode change la régularité du résultat

Sans prompt système, chaque nouvelle demande repart de zéro, avec un risque de ton ou de qualité incohérente d'une fois à l'autre. Avec un prompt système stable, chaque nouvelle demande hérite automatiquement du même cadre, ce qui rend le résultat beaucoup plus régulier dans le temps, un peu comme un CLAUDE.md pour un projet Claude Code (Module 1).

### Exemple concret

Pour la production régulière de contenu YouTube de vulgarisation IA, un prompt système écrit une fois ("tu es un assistant qui aide à structurer un script YouTube de vulgarisation IA en français, ton pédagogique et accessible, toujours avec un exemple concret, jamais de jargon non expliqué") évite de redéfinir ce cadre à chaque nouvelle vidéo.

**Points clés**
- La distinction prompt utilisateur / message système, déjà vue en n8n, s'applique à tout usage régulier de l'IA
- Un bon prompt système précise le rôle, les contraintes constantes, et la conduite en cas d'incertitude
- Un prompt système stable rend le résultat régulier dans le temps, comme un CLAUDE.md pour un projet

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi une instruction précise coûte-t-elle finalement moins de temps qu'une instruction floue ?
2. Quels éléments, au-delà du gabarit à 4 éléments, améliorent un bon prompt ?
3. Quelle est la différence entre un prompt utilisateur et un prompt système ?
4. Pourquoi un prompt système rend-il un résultat plus régulier dans le temps ?

### Réflexion
5. Choisis une tâche que tu fais répéter souvent à une IA (rédaction de post, résumé, réponse type). Rédige un prompt système pour cette tâche.
6. Explique à un futur apprenant de Vivier IA, en une phrase, pourquoi itérer sur un prompt vaut mieux que chercher la perfection au premier essai.
