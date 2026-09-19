# Section 3 — ⚙️ Les Fondations

## Chapitre 1 : Définir l'IA simplement

### Une définition utile plutôt qu'une définition savante

L'intelligence artificielle recouvre officiellement un champ très large (reconnaissance d'image, robotique, jeux, génération de texte). Pour un usage business appliqué, la définition utile est plus étroite : un système entraîné sur une grande quantité de données pour reconnaître des motifs et produire une réponse plausible, sans règle écrite à la main pour chaque cas.

### La différence avec un logiciel classique

Un logiciel classique suit des règles écrites explicitement par un développeur : "si X alors Y". Un système d'IA, lui, a appris ses propres règles internes à partir d'exemples, ce qui lui permet de traiter des cas jamais vus explicitement, au prix d'une prévisibilité moindre qu'une règle écrite à la main (le Module 2, chapitre 1 de la section 3, a déjà posé cette même distinction côté n8n).

### Ce que cette définition évite comme confusion

Comprendre l'IA ainsi évite deux excès fréquents : la voir comme une forme de magie qui "comprend" au sens humain du terme, ou au contraire la réduire à un simple logiciel comme un autre. C'est un outil statistique puissant, ni magique ni banal.

**Points clés**
- Définition utile pour le business : un système qui reconnaît des motifs à partir de données, sans règle écrite à la main
- La différence clé avec un logiciel classique : des règles apprises plutôt qu'écrites, au prix d'une prévisibilité moindre
- Éviter les deux excès : la magie supposée, ou la banalisation complète

---

## Chapitre 2 : L'IA générative et ses types d'applications

### Ce qui distingue l'IA générative du reste de l'IA

L'IA générative produit du contenu nouveau (texte, image, code, audio) plutôt que de seulement classer ou prédire une valeur à partir de données existantes. C'est cette capacité de génération qui rend des outils comme Claude directement utilisables pour écrire, coder, ou raisonner sur une demande ouverte.

### Les grandes familles d'applications

**Génération de texte** : rédaction, résumé, réponse à une question, conversation (les LLM comme Claude ou GPT). **Génération de code** : Claude Code en est l'exemple central de ce parcours, mais la même logique s'applique à tout assistant de programmation. **Génération d'image** : à partir d'une description textuelle. **Génération audio** : synthèse vocale, transcription. Chaque famille répond à un besoin différent, avec des modèles souvent spécialisés par famille plutôt qu'un modèle unique qui fait tout.

### Le point commun entre toutes ces familles

Quelle que soit la famille, le principe reste le même : une entrée (un prompt) transformée en une sortie plausible, jamais garantie exacte. La vérification humaine avant usage réel reste nécessaire, quelle que soit la famille d'application concernée.

**Points clés**
- L'IA générative produit du contenu nouveau, contrairement à l'IA qui classe ou prédit seulement
- Texte, code, image, audio : des familles distinctes, souvent avec des modèles spécialisés
- Le principe reste identique partout : une sortie plausible, jamais garantie, qui nécessite une vérification humaine

---

## Chapitre 3 : Les fournisseurs de la GenAI

### Les acteurs à connaître, sans figer une préférence

Anthropic (Claude), OpenAI (GPT), Google (Gemini) sont les fournisseurs les plus visibles côté modèles de texte et de code en 2026. Ce paysage évolue vite, un nouvel acteur ou un nouveau modèle peut changer le classement en quelques mois : connaître les acteurs actuels compte moins que savoir évaluer un nouveau fournisseur le moment venu.

### Les critères pour choisir un fournisseur sur un projet donné

La qualité du résultat sur la tâche précise visée, le coût par usage, la disponibilité en français, la politique de confidentialité des données (particulièrement sensible pour un client CAC40, voir Module 4 sur le RGPD), et l'écosystème d'outils déjà construit autour (comme Claude Code pour l'écosystème Claude, sujet du Module 1).

### Pourquoi ce parcours est construit sur l'écosystème Claude

Le choix de Claude comme fil conducteur de cette formation n'est pas arbitraire : l'écosystème d'outils autour (Claude Code, les Skills, les MCP) est particulièrement mature pour un usage professionnel appliqué, ce qui justifie ce choix pédagogique sans prétendre que c'est le seul fournisseur valable pour tout usage.

**Points clés**
- Anthropic, OpenAI, Google sont les acteurs les plus visibles en 2026, un paysage qui continue d'évoluer vite
- Le bon critère de choix dépend du projet : qualité sur la tâche, coût, confidentialité, écosystème d'outils
- Ce parcours choisit Claude pour la maturité de son écosystème d'outils professionnels, pas comme un jugement définitif sur tout usage

---

## Questions pour les apprenants

### Compréhension
1. Quelle définition utile de l'IA ce chapitre propose-t-il, plutôt qu'une définition savante et large ?
2. Qu'est-ce qui distingue l'IA générative des autres formes d'IA ?
3. Cite 4 familles d'applications de l'IA générative.
4. Cite 3 critères pour choisir un fournisseur d'IA sur un projet donné.

### Réflexion
5. Un client CAC40 hésite entre deux fournisseurs d'IA pour un projet sensible en données personnelles. Quel critère de ce chapitre devrait peser le plus lourd, et pourquoi ?
6. En quoi la distinction "règles écrites vs règles apprises" (chapitre 1) rejoint-elle ce qui a déjà été vu sur l'IA dans n8n au Module 2 ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : un système entraîné sur des données pour reconnaître des motifs et produire une réponse plausible, sans règle écrite à la main pour chaque cas
- Q2 : elle produit du contenu nouveau, plutôt que de seulement classer ou prédire à partir de données existantes
- Q3 : génération de texte, génération de code, génération d'image, génération audio
- Q4 : qualité du résultat sur la tâche, coût par usage, disponibilité en français, confidentialité des données, écosystème d'outils (3 au choix)
- Q5 : la politique de confidentialité des données, particulièrement sensible pour un client CAC40 avec des données réglementées
- Q6 : le Module 2 (section 3, chapitre 1) posait déjà qu'un nœud IA juge à partir d'une compréhension du langage plutôt que d'une règle fixe écrite à l'avance, exactement le même principe
