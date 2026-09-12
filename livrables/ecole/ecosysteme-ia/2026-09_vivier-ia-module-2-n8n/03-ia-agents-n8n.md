# Section 3 — 🤖 IA et agents IA dans n8n

> Fiche pratique associée : [03-ia-agents-n8n-prompts.md](03-ia-agents-n8n-prompts.md).

## Chapitre 1 : IA & automatisation 2.0

### Le changement de nature qu'apporte l'IA dans un workflow

Un workflow n8n classique exécute des règles fixes : un IF teste une condition écrite à l'avance, un Switch couvre des cas prévus. L'IA change cette logique : un nœud IA peut juger, résumer, classer, ou décider dans des cas que personne n'a explicitement codés, à partir d'une compréhension du langage naturel plutôt que d'une règle rigide.

### Ce que ça permet de traiter différemment

Qualifier une demande commerciale vague (vu en section 2) ne demande plus de lister à la main tous les mots-clés possibles d'une "demande urgente", un nœud IA peut juger l'urgence à partir du texte librement écrit par le prospect. La contrepartie : une règle fixe est prévisible à 100%, un jugement IA l'est moins, ce qui demande de penser différemment la validation (vu au chapitre 5 de la section 2 sur la gestion d'erreurs, encore plus pertinent ici).

**Points clés**
- L'IA permet un jugement contextuel là où seule une règle fixe était possible avant
- Elle traite bien l'ambigu et le non prévu à l'avance, au prix d'une prévisibilité moindre qu'une règle fixe
- La validation et la supervision deviennent encore plus importantes qu'avec une logique 100% déterministe

---

## Chapitre 2 : Les modèles d'IA (LLM, cloud vs local, choix du modèle)

### Le choix cloud vs local

Un modèle **cloud** (Claude, GPT et équivalents) s'utilise via une API, sans infrastructure à gérer, facturé à l'usage. Un modèle **local** (via Ollama par exemple) tourne sur ton propre matériel, sans dépendre d'un service externe, mais demande du matériel adapté et une maintenance propre.

### Les critères qui tranchent le choix

La sensibilité des données pèse lourd : une donnée qui ne doit jamais sortir de l'infrastructure du client pousse vers le local. Le volume d'usage et le budget orientent aussi : un cloud facturé à l'appel peut devenir coûteux à très grande échelle, un local a un coût fixe d'infrastructure mais devient plus rentable au-delà d'un certain volume. La latence et la qualité du résultat comptent également : un modèle cloud de pointe dépasse souvent un modèle local équivalent en qualité de réponse.

### Pas un choix figé pour tout un projet

Le choix n'est pas binaire pour l'ensemble d'un projet : un même système n8n peut utiliser un modèle cloud pour une tâche qui demande de la qualité (rédaction, jugement fin) et un modèle local pour une tâche répétitive à très grand volume (classification simple), selon ce que chaque nœud IA du workflow demande réellement.

**Points clés**
- Cloud : pas d'infrastructure à gérer, facturé à l'usage. Local : infrastructure à maintenir, coût fixe
- Sensibilité des données, volume, budget, latence : les critères qui orientent le choix
- Un même projet peut combiner plusieurs modèles selon ce que chaque tâche demande réellement

---

## Chapitre 3 : Prompts & messages système

### Deux rôles différents dans un appel IA

Le **prompt utilisateur** change à chaque exécution : c'est la donnée spécifique à traiter (le texte de la demande commerciale, par exemple). Le **message système** reste constant quel que soit l'exécution : il définit le rôle de l'IA, ses contraintes, le format de réponse attendu. Confondre les deux est une erreur fréquente chez les débutants, qui mettent tout dans un seul bloc de texte sans distinguer ce qui varie de ce qui ne varie pas.

### Le message système, équivalent du CLAUDE.md pour un nœud IA

Le message système d'un nœud IA joue le même rôle que le CLAUDE.md d'un projet Claude Code vu en Module 1 : il pose le contexte permanent (qui est l'IA dans ce workflow, quelles règles suivre, quel format de sortie) pour que chaque exécution n'ait pas besoin de le répéter. Un message système bien écrit réduit fortement les réponses hors-sujet ou mal formatées.

### Ce qu'un bon message système précise

Le rôle exact de l'IA dans ce contexte précis, le format de sortie attendu (texte libre, JSON structuré, une liste), ce qu'elle doit faire en cas d'incertitude (demander une clarification plutôt qu'inventer une réponse), et les limites explicites de ce qu'elle ne doit pas faire.

**Points clés**
- Prompt utilisateur = ce qui varie à chaque exécution, message système = ce qui reste constant
- Le message système joue le rôle du CLAUDE.md pour un nœud IA
- Un bon message système précise le rôle, le format de sortie, et la conduite en cas d'incertitude

---

## Chapitre 4 : Langchain

### Le framework sous les nœuds IA de n8n

Langchain est la bibliothèque logicielle que n8n utilise en coulisses pour ses nœuds liés à l'IA. Pas besoin de coder directement en Langchain pour utiliser n8n, mais connaître son vocabulaire aide à comprendre ce que configure réellement chaque nœud visuel.

### Le vocabulaire à connaître

Une **chain** est une séquence d'appels à un modèle, parfois avec des étapes intermédiaires. Une **memory** conserve le contexte d'une conversation entre plusieurs échanges. Un **tool** est une capacité que l'IA peut invoquer (chercher une information, appeler une API) plutôt que de se limiter à répondre en texte. Un **agent** combine un modèle, une memory, et des tools pour décider lui-même des étapes à suivre.

### Pourquoi ce vocabulaire aide concrètement

Quand un nœud n8n propose un champ "Memory" ou "Tools", ce n'est pas une fonctionnalité isolée, c'est directement la notion Langchain correspondante. Comprendre le concept général évite de redécouvrir par essai-erreur ce qu'un champ de configuration fait réellement.

**Points clés**
- Langchain est le framework sous-jacent des nœuds IA de n8n, pas à coder directement mais utile à comprendre
- Chain, memory, tool, agent : le vocabulaire qui explique ce que configurent les nœuds visuels
- Reconnaître ce vocabulaire dans l'interface n8n accélère la compréhension des options disponibles

---

## Chapitre 5 : Nœuds IA spécialisés

### Préférer un nœud spécialisé à un agent généraliste

Pour une tâche précise et récurrente, un nœud IA spécialisé est souvent préférable à un agent généraliste configuré pour tout faire. C'est le même principe que les sub-agents spécialisés du Module 1 : un périmètre clair réduit le risque de dérive et simplifie la maintenance.

### Les nœuds spécialisés courants

**Basic LLM Chain** : un appel simple à un modèle, pour une tâche directe sans logique complexe. **Text Classifier** : range un texte dans une catégorie prédéfinie (urgent/non urgent, positif/négatif). **Information Extractor** : extrait des champs structurés d'un texte libre (nom, date, montant). **Summarization Chain** : condense un texte long en résumé, utile pour traiter de gros volumes de contenu avant de les faire lire à quelqu'un.

### Quand basculer vers un agent complet

Un nœud spécialisé suffit tant que la tâche a un périmètre fixe et connu à l'avance. Un agent complet (chapitre suivant) devient pertinent quand la tâche demande de choisir elle-même entre plusieurs actions possibles, ce qu'un nœud spécialisé ne fait pas.

**Points clés**
- Un nœud IA spécialisé, au périmètre clair, est préférable à un agent généraliste pour une tâche récurrente précise
- Basic LLM Chain, Text Classifier, Information Extractor, Summarization Chain : les nœuds spécialisés courants
- Un agent complet devient pertinent seulement quand la tâche demande de choisir elle-même entre plusieurs actions

---

## Chapitre 6 : Agents IA (mémoire, contexte, exemple complet)

### Ce qu'ajoute un agent par rapport à un nœud spécialisé

Un nœud Agent combine un modèle, une mémoire, et des tools, pour décider lui-même des étapes à suivre plutôt que de suivre une séquence fixe. Il convient aux tâches où le chemin à suivre n'est pas connu à l'avance et dépend de ce qu'il découvre en cours de route.

### La mémoire, ce qu'elle conserve et pourquoi elle est scopée

La mémoire d'un agent conserve le contexte d'une conversation entre plusieurs échanges, généralement rattachée à un identifiant de session (`sessionId`) pour que deux conversations différentes ne se mélangent jamais. Sans cette mémoire, chaque message serait traité indépendamment, sans savoir ce qui a été dit juste avant.

### Exemple complet, un agent de support client

Un agent de support reçoit une question, consulte sa mémoire pour le contexte de la conversation en cours, utilise un tool pour chercher dans une base de connaissances (souvent un RAG, vu au chapitre 8) si la réponse n'est pas déjà connue, et répond en conservant le fil de la conversation pour l'échange suivant. Chaque brique (modèle, mémoire, tool) a un rôle précis dans cet exemple, aucune n'est superflue.

**Points clés**
- Un agent combine modèle, mémoire, et tools, pour décider lui-même du chemin à suivre
- La mémoire est scopée par session, pour ne jamais mélanger deux conversations différentes
- Un agent de support client illustre comment ces briques se combinent sur un cas réel

---

## Chapitre 7 : Tools & Prompt Engineering

### Donner des capacités à un agent au-delà du texte

Un tool est une action que l'agent peut choisir d'invoquer : appeler un autre workflow n8n, chercher une information dans une base, exécuter un calcul précis. Sans tools, un agent ne peut que répondre en texte à partir de ce qu'il sait déjà, ce qui limite fortement son utilité réelle.

### Le nom et la description d'un tool font partie du prompt

L'agent choisit quel tool invoquer en se basant sur son nom et sa description, pas sur son fonctionnement interne qu'il ne voit pas. Un tool mal nommé ou mal décrit ("Tool1", "fait un truc") sera mal utilisé ou jamais invoqué, même si sa logique interne est parfaitement correcte. Rédiger cette description avec le même soin qu'une instruction à Claude Code (Module 1, section 2) change directement la fiabilité de l'agent.

### Le prompt engineering appliqué aux tools

Au-delà du message système général, chaque tool mérite sa propre description précise : quand l'utiliser, quel format de données il attend, ce qu'il renvoie. Un agent avec 5 tools bien décrits est plus fiable qu'un agent avec 15 tools vaguement décrits, même si le second semble plus "capable" sur le papier.

**Points clés**
- Un tool étend un agent au-delà du texte : appeler un workflow, chercher une info, calculer
- L'agent choisit un tool selon son nom et sa description, à rédiger avec le même soin qu'une instruction à Claude Code
- Moins de tools bien décrits valent mieux que beaucoup de tools vaguement décrits

---

## Chapitre 8 : Le RAG + construire un bon RAG

### Le problème que le RAG résout

Un modèle IA ne connaît que ce qui tient dans son prompt à un instant donné, il ne "sait" rien en dehors de ça sans aide. Le RAG (Retrieval Augmented Generation) résout ce problème : au moment d'une question, on va chercher l'information pertinente dans une base de connaissances, et on l'ajoute au prompt avant de générer la réponse, plutôt que de tout écrire à l'avance dans un message système déjà trop long.

### Les trois briques d'un RAG

**Chunking** : découper les documents source en morceaux de taille gérable, ni trop gros (perd en précision de recherche) ni trop petits (perd le contexte). **Base vectorielle** (Qdrant, ou équivalent) : stocke ces morceaux sous une forme qui permet de chercher par sens, pas seulement par mot-clé exact. **Query expansion** : reformule la question posée pour améliorer la recherche, une question courte et ambiguë cherchant souvent moins bien qu'une version légèrement enrichie.

### Ce qui distingue un bon RAG d'un RAG médiocre

Un RAG mal construit renvoie des morceaux de documents hors sujet, qui polluent la réponse finale plutôt que de l'améliorer. Un bon chunking (qui respecte les limites naturelles du contenu, pas une coupure arbitraire tous les 500 caractères) et une recherche bien réglée font l'essentiel de la différence, plus que le choix du modèle de génération final.

**Points clés**
- Le RAG va chercher l'information pertinente au moment de la question, plutôt que de tout mettre dans le prompt à l'avance
- Chunking, base vectorielle, query expansion : les trois briques qui déterminent la qualité du RAG
- Un chunking qui respecte les limites naturelles du contenu compte plus que le choix du modèle final

---

## Chapitre 9 : Bonus — l'IA multimodale (vision, audio, PDF)

### Étendre un agent au-delà du texte pur

Un modèle multimodal traite aussi des images, de l'audio, ou des documents structurés comme des PDF, pas seulement du texte brut. Ça ouvre des cas d'usage que l'automatisation textuelle seule ne couvre pas.

### Cas d'usage concrets

**Vision** : analyser une photo (un justificatif, un produit, une capture d'écran) pour en extraire une information. **Audio** : transcrire un message vocal ou un appel avant de le traiter comme du texte classique. **PDF** : extraire le contenu d'un document structuré (une facture, un contrat) pour en tirer des champs précis, plutôt que de le faire lire manuellement.

### Une extension, pas un point de départ

Ces capacités s'ajoutent à une base déjà solide (prompts clairs, tools bien décrits, gestion d'erreur), elles ne la remplacent pas. Un agent multimodal mal cadré reproduit les mêmes défauts qu'un agent textuel mal cadré, simplement sur un type de donnée différent.

**Points clés**
- Vision, audio, PDF : trois extensions qui élargissent ce qu'un agent peut traiter directement
- Chaque extension répond à un cas d'usage précis, pas une fonctionnalité à activer par défaut
- Ces capacités s'ajoutent à une base solide, elles ne compensent pas un mauvais cadrage

---

## Questions pour les apprenants

### Compréhension
1. Quelle différence l'IA introduit-elle par rapport à un IF ou un Switch classique ?
2. Donne 2 critères qui orientent le choix entre un modèle cloud et un modèle local.
3. Quelle est la différence entre le prompt utilisateur et le message système ?
4. Pourquoi le nom et la description d'un tool font-ils partie du prompt d'un agent ?
5. Cite les 3 briques qui déterminent la qualité d'un RAG.

### Réflexion
6. Pour un agent de support Chatllow, donne un exemple concret de tool qu'il faudrait lui donner, avec une description précise (nom + quand l'utiliser).
7. Un agent IA configuré avec 15 tools vaguement décrits répond souvent à côté. Quel chapitre explique ce problème, et quelle serait la correction à apporter ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : l'IA permet un jugement contextuel sur des cas non prévus à l'avance, là où IF/Switch suivent une règle fixe écrite d'avance
- Q2 : sensibilité des données (local si données très sensibles), volume/budget (cloud facturé à l'usage vs coût fixe du local), qualité/latence attendue
- Q3 : le prompt utilisateur varie à chaque exécution (la donnée à traiter), le message système reste constant (rôle, contraintes, format attendu)
- Q4 : l'agent choisit un tool à invoquer en se basant sur son nom et sa description, pas sur son fonctionnement interne qu'il ne voit pas
- Q5 : chunking, base vectorielle, query expansion
- Q6 : pas de réponse unique, évaluer la précision de la description (nom clair, condition d'usage explicite)
- Q7 : chapitre 7 (Tools & Prompt Engineering) ; correction : réduire le nombre de tools et rédiger des descriptions précises plutôt que vagues
