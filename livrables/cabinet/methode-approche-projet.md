# Méthode — Comment aborder un projet, du début à la fin

> Trame réutilisable pour tout projet (Chatllow, Kora, e-commerce, Vivier IA...), construite à partir de la méthode enseignée dans le Module 1 (Écosystème Claude, voir `livrables/ecole/ecosysteme-ia/2026-09_entrepreneur-academie-module-1/`) et le Module 2 (n8n, voir `livrables/ecole/ecosysteme-ia/2026-09_vivier-ia-module-2-n8n/`), ainsi que des projets réels déjà menés dans ce workspace.

## Le pipeline générique

9 étapes, pas toutes nécessaires sur chaque projet (voir les variantes par type plus bas).

1. **Cadrage initial** — comprendre le besoin réel avant de poser la moindre brique : à qui ça s'adresse, quel problème ça résout, quelle est la vraie priorité. Poser des questions plutôt que deviner.
2. **Nom / identité, si nécessaire** — uniquement si le projet a besoin de sa propre identité (pas systématique). Explorer plusieurs pistes, vérifier qu'aucune n'existe déjà, ne jamais imposer un choix définitif seul.
3. **Maquette / design** — dans Claude Design avant le code, pour tout ce qui a une interface visible. Jamais l'inverse.
4. **CLAUDE.md** — créé dès l'ouverture du projet, avant la première tâche de construction. Contexte, objectif, conventions, zones sensibles.
5. **Construction, tâche par tâche** — le gabarit à 4 éléments (Contexte, Objectif, Périmètre, Autonomie) pour cadrer chaque tâche, puis le cycle Plan, Execute, Validate pour l'exécuter.
6. **Validation réelle** — tester en conditions réelles (navigateur, données de test), jamais supposer qu'une tâche annoncée "terminée" est correcte.
7. **Livraison** — checklist en 3 points : fonctionnel, sécurité, handoff (le plus souvent négligé).
8. **Suivi** — la relation continue après la livraison : maintenance, évolution, potentiel revenu récurrent.
9. **Capitalisation** — si le projet se répète ou ressemble à un besoin futur, le généraliser en starter réutilisable plutôt que tout reconstruire la prochaine fois.

## Par type de projet

### Site vitrine / landing page

- Étape 2 souvent sautée : le client a généralement déjà un nom
- Étape 3 importante : le visuel est l'essentiel de la valeur perçue
- Étape 5 allégée : peu de tâches, souvent un seul fil rouge court (formulaire, quelques pages)
- Étape 7 : handoff simple, l'essentiel est d'expliquer comment modifier le texte soi-même

### Application / SaaS (type Kora)

- Étape 3 cruciale, plusieurs écrans à cadrer avant de coder
- Étape 5 : architecture à poser tôt (base de données, éventuellement n8n pour les automatisations), fil rouge à 2-3 phases (ex. intake, dashboard, statut)
- Étape 6 renforcée : tester avec des données de test en volume, pas seulement 2-3 lignes
- Étape 7 renforcée : sécurité des données (RLS, accès), pas seulement "ça marche"
- Étape 9 : rarement généralisable tel quel, sauf si pensé comme starter dès le départ

### Fullstack (Claude Code + n8n, type projet fil rouge)

- Étape 1 : poser explicitement la répartition avant de construire quoi que ce soit : ce qui relève du produit (Claude Code) et ce qui relève de la plomberie entre systèmes (n8n), jamais supposer implicitement (Module 1, section 5, chapitre 2)
- Étape 3 : une maquette pour la partie produit (Claude Design) et un schéma de flux pour la partie n8n (Module 2, section 1), les deux ensemble, pas l'un à la place de l'autre
- Étape 5 : construire les deux parties séparément et les tester chacune seule avant de les connecter (par exemple, tester un webhook par un appel direct avant de le relier au vrai bouton de l'interface)
- Étape 6 renforcée : valider la chaîne complète de bout en bout (déclencheur réel → traitement n8n → effet visible dans le produit), avec un outil de test réel type MCP Playwright si l'interface le permet (Module 1, section 5, chapitre 3)
- Étape 7 : la checklist de livraison couvre les deux côtés à la fois, fonctionnel et sécurité du produit (accès, données) et de l'automatisation (credentials scopées, Error Trigger) ; le handoff précise qui maintient quoi, le produit, le workflow n8n, ou les deux
- Étape 9 : les starters produit (Claude Code) et les sous-workflows n8n grandissent dans deux bibliothèques séparées, mais la documentation d'un projet fullstack référence toujours les deux

### Automatisation (n8n / workflow)

- Étape 1 : identifier précisément l'événement déclencheur réel (Webhook, Schedule, App Trigger) avant de choisir un trigger pour la facilité de configuration plutôt que pour la justesse (Module 2, section 1)
- Étape 2 généralement absente, sauf si le workflow devient un produit à part entière
- Étape 3 remplacée par un schéma du flux (déclencheurs, étapes, sorties), pas une maquette visuelle
- Étape 4 : le CLAUDE.md se double d'une documentation directement sur le canevas (sticky notes), et de credentials centralisées et nommées clairement, pas dispersées dans chaque nœud (Module 2, sections 1 et 7)
- Étape 5 : Claude Code et n8n séparés par responsabilité (produit vs plomberie entre systèmes). Tester chaque nœud avant d'enchaîner le suivant. Pour une logique qui demande du jugement contextuel plutôt qu'une règle fixe, un nœud IA spécialisé ou un agent routeur plutôt qu'un agent généraliste qui fait tout (Module 2, sections 3 et 4)
- Étape 6 : tester avec des données de test réalistes et imparfaites (données épinglées), pas seulement le cas le plus propre
- Étape 7 : un Error Trigger qui prévient réellement d'un échec plutôt qu'un échec silencieux, documentation du flux et point de contact si ça casse. Si le workflow est critique ou à fort volume, sécuriser et rendre observable l'instance (HTTPS, health check, sauvegardes) avant la mise en service (Module 2, sections 2 et 5)
- Étape 9 : un sous-workflow bien conçu (entrées typées, nommage descriptif) est directement l'équivalent n8n d'un starter réutilisable (Module 2, section 2)

### Audit / conseil IA (mission Chatllow)

- Étape 2 absente : le livrable porte la marque du cabinet, pas la sienne
- Étape 3 remplacée par la réutilisation d'un starter déjà existant (voir les générateurs d'audit IA de `livrables/applications/`)
- Étape 5 courte : souvent un seul outil ou document, cycle rapide
- Étape 7 : ne jamais envoyer le texte générique brut, toujours le personnaliser en choisissant un seul pilote à proposer (voir `06-business-prompts.md` du Module 1)
- Étape 9 : c'est l'essence du modèle, une bibliothèque de starters sectoriels qui grandit à chaque mission

### Formation / contenu pédagogique (type Vivier IA)

- Étape 2 importante si le contenu devient un produit à part (comme Vivier IA)
- Pas de "code" à proprement parler, mais la même discipline de cadrage avant de rédiger une section
- Étape 5 : une section à la fois, points clés + un exemple concret, jamais le texte intégral recopié sans synthèse
- Étape 6 renforcée : relecture systématique pour vérifier la fidélité au contenu source, pas seulement la forme
- Étape 9 : des fiches de prompts réutilisables pour le prochain module

### Branding / identité visuelle (logo, charte)

- Toujours plusieurs concepts proposés, jamais un seul définitif d'entrée (au moins 2-3 directions réellement différentes)
- Si le retour porte sur les couleurs, laisser essayer en direct (tweaks interactifs dans Claude Design) plutôt que deviner une palette de plus à l'aveugle
- Les pistes non retenues se gardent pour référence (page "Explorations"), elles ne se suppriment pas
- La validation finale est toujours une décision humaine explicite, jamais supposée à partir d'un silence

## Ce qui ne change jamais, quel que soit le type

- Le cadrage avant l'exécution (étape 1) et la validation réelle avant de considérer une tâche finie (étape 6) ne se sautent sur aucun type de projet
- Le handoff (étape 7) est systématiquement la partie la plus négligée sous la pression d'un délai, et celle qui pèse le plus sur la satisfaction perçue
- Capitaliser (étape 9) n'est utile que si c'est fait honnêtement : généraliser sans jamais exposer d'information confidentielle d'un client précédent
