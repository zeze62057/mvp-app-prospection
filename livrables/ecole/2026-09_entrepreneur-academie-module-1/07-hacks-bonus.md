# Section 7 — 💡 Hacks & vidéos bonus

## Chapitre 1 : Sub-agents avancés

Un sub-agent est un agent Claude Code spécialisé, avec sa propre mission précise et son propre contexte, qu'un agent principal peut déléguer et invoquer. Plutôt que de tout faire faire à un seul agent généraliste, on peut construire une équipe d'agents spécialisés qui travaillent ensemble.

L'intérêt de cette approche : chaque sub-agent peut être très précisément cadré sur sa mission (par exemple, un agent dédié uniquement à la rédaction de contenu, un autre dédié uniquement à la génération de visuels), ce qui réduit le risque de dérive hors périmètre, et permet un enchaînement automatique d'étapes complexes sans intervention humaine à chaque maillon.

C'est exactement le principe illustré dans ce workspace : un agent rédige des posts LinkedIn et les enregistre, puis déclenche automatiquement un second agent spécialisé qui génère l'affiche correspondante. Chacun a une mission unique, un périmètre clair, et des garde-fous propres à sa spécialité.

**Points clés**
- Un sub-agent a une mission précise et son propre contexte
- Spécialiser réduit le risque de dérive et permet l'enchaînement automatique
- Utile pour des workflows à plusieurs étapes distinctes et récurrentes

---

## Chapitre 2 : Claude Code au-delà de n8n

Le module a beaucoup insisté sur la combinaison Claude Code et n8n, mais ce n'est pas la seule architecture possible. Claude Code peut se connecter, via MCP, à de nombreux autres écosystèmes selon le besoin réel du projet : des plateformes de design (Canva), des espaces de documentation et de gestion (Notion, Google Drive), des outils de communication (Slack), ou des services métier spécifiques à un secteur.

Le principe pédagogique de ce chapitre : n8n est un excellent choix par défaut pour l'automatisation, mais le bon réflexe est toujours de partir du besoin réel du client ou du projet, pas de l'outil qu'on maîtrise déjà par habitude. Un projet peut très bien n'avoir besoin d'aucune automatisation n8n et se suffire d'une connexion directe entre Claude Code et un ou deux services externes.

Ce chapitre invite donc à élargir le regard après avoir appris une architecture précise (module Fullstack), pour ne pas la considérer comme la seule solution valable en toute situation.

**Points clés**
- n8n n'est pas la seule option d'automatisation possible avec Claude Code
- De nombreux écosystèmes se connectent via MCP selon le besoin réel
- Toujours partir du besoin du projet, pas de l'outil déjà maîtrisé par habitude

---

## Chapitre 3 : Plugins et Extensions

Claude Code peut être étendu par des plugins et extensions qui ajoutent des capacités supplémentaires sans devoir tout reconstruire depuis zéro : des intégrations avec des IDE spécifiques, des outils de vérification de code supplémentaires, des connecteurs vers des services spécialisés.

Ce chapitre, en fin de module, invite à ne pas voir Claude Code comme un outil figé mais comme un écosystème qui continue d'évoluer, avec de nouvelles capacités qui apparaissent régulièrement. La compétence à développer ici n'est pas de mémoriser chaque plugin existant à un instant donné, mais de savoir où chercher et comment évaluer si un plugin ou une extension répond à un besoin réel du projet en cours.

C'est un bon chapitre de clôture parce qu'il rappelle que ce module 1 pose des fondations solides et une méthode durable, mais que l'écosystème autour continuera de bouger, et qu'une veille régulière (comme le fait l'agent LinkedIn de ce workspace sur les sujets IA) fait partie intégrante du métier.

**Points clés**
- Les plugins et extensions étendent les capacités sans tout reconstruire
- L'écosystème Claude Code évolue en continu
- Savoir chercher et évaluer une extension compte plus que tout mémoriser

---

## Questions pour les apprenants

### Compréhension
1. Qu'est-ce qu'un sub-agent, et pourquoi en spécialiser plusieurs plutôt que d'utiliser un seul agent généraliste ?
2. Pourquoi le chapitre insiste-t-il sur le fait que n8n n'est "pas la seule option" ?
3. Que doit-on retenir sur les plugins et extensions, plus que la liste de ceux qui existent aujourd'hui ?

### Réflexion (synthèse de fin de module)
4. En repensant à l'ensemble du module 1, quel chapitre te semble le plus directement applicable à ton activité actuelle (Chatllow, Kora, ou autre) ? Pourquoi ?
5. Si tu devais expliquer ce module en une seule phrase à un futur apprenant d'Entrepreneur Académie, que dirais-tu ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : agent avec mission précise et contexte propre ; spécialiser réduit le risque de dérive et permet l'enchaînement automatique d'étapes
- Q2 : pour éviter de considérer une architecture apprise comme la seule solution valable, toujours partir du besoin réel du projet
- Q3 : savoir chercher et évaluer une extension utile, plus que mémoriser une liste figée dans un écosystème qui évolue
- Q4/Q5 : pas de réponse unique, évaluer la pertinence et l'appropriation personnelle du contenu
