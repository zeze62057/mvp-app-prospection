@@ SECTION 10ed64cb-1b4b-41e2-8acf-be2407148a82  Le Fullstack, projet fil rouge

@@ CHAPITRE 1
### À faire maintenant : passer du prototype à la production

Tu as une maquette faite dans un outil de prototypage. Colle ce prompt, avec une capture ou une description de ta maquette :

```prompt
J'ai validé une maquette de [nom du projet] dans un outil de prototypage. Elle ne partira pas en production : elle sert seulement de référence visuelle.
Reconstruis l'écran [nom de l'écran] avec une vraie validation des données, un vrai stockage et une sécurité réelle. Avant de coder, propose-moi un plan et liste ce que tu gardes de la maquette et ce que tu changes. Attends mon accord.
```

Tu dois recevoir un plan qui sépare l'apparence (gardée) et le fonctionnement (reconstruit).

@@ CHAPITRE 2
### À faire maintenant : répartir produit et automatisations

```prompt
Mon projet : [décris-le en deux phrases].
Fais deux listes. 1) Ce qui doit être construit dans le code de l'application : ce que l'utilisateur voit et utilise. 2) Ce qui doit être automatisé avec n8n : envois d'emails, notifications, synchronisations, rapports planifiés. Pour chaque ligne, explique en une phrase pourquoi elle va dans cette liste. N'écris pas de code.
```

Tu dois obtenir deux listes justifiées. Relis-les : une automatisation modifiable sans redéployer va du côté n8n.

@@ CHAPITRE 3
### À faire maintenant : brancher Playwright et tester pour de vrai

Si ce n'est pas déjà fait, crée le fichier `.mcp.json` à la racine du projet :

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

Relance Claude Code et accepte la connexion. Puis colle ce prompt :

```prompt
Lance l'application en local. Avec Playwright, ouvre la page [adresse locale], remplis le formulaire avec des données de test, envoie-le, puis vérifie ce qui s'affiche vraiment à l'écran. Teste aussi un cas invalide (un email mal écrit). Dis-moi ce que tu as observé, pas ce que le code laisse supposer.
```

Tu dois recevoir un compte rendu de ce qui a été observé dans le navigateur, y compris le cas invalide.

@@ CHAPITRE 4
### À faire maintenant : construire le formulaire d'intake

Commence par le plan :

```prompt
Construis la phase 1 de mon projet : un formulaire d'intake pour [type de client].
Avant de coder : 1) propose les champs à demander, avec une phrase pour justifier chacun (pas un de plus que nécessaire), 2) décris la validation de chaque champ, 3) dis où les données seront enregistrées et ce qui se passe après l'envoi. Attends mon accord.
```

Après ton accord, passe à la construction et à la vérification :

```prompt
Construis le formulaire selon le plan validé. Puis, avec Playwright, teste-le : un envoi valide, un email invalide, un champ obligatoire vide. Dis-moi le résultat de chaque test.
```

Tu dois voir trois résultats de test : un envoi accepté et deux refus clairs.

@@ CHAPITRE 5
### À faire maintenant : construire le dashboard de suivi

```prompt
Construis la phase 2 : un dashboard qui affiche les données collectées par le formulaire. Il doit avoir : un statut par ligne, un historique des changements de statut, une recherche, un tri et un filtre par statut. Il doit rester lisible avec plusieurs centaines de lignes.
Avant de coder, propose la structure des données et la disposition de l'écran. Attends mon accord.
```

Après validation et construction, demande la vérification :

```prompt
Avec Playwright, ouvre le dashboard avec des données de test. Vérifie la recherche, le tri, le filtre et le changement de statut. Dis-moi ce qui marche et ce qui ne marche pas.
```

Tu dois recevoir une liste des fonctions vérifiées une par une.

@@ CHAPITRE 6
### À faire maintenant : finir la page de statut et livrer

```prompt
Construis la phase 3 : une page de statut qui permet à un client de suivre l'avancement de sa demande, sans voir les données des autres clients. Elle doit être claire et rassurante. Avant de coder, dis comment le client accède à sa page et ce qu'il peut y voir. Attends mon accord.
```

Puis, avant de livrer, lance la vérification complète :

```prompt
Fais la vérification finale de tout le parcours avec Playwright : formulaire, dashboard, page de statut. Vérifie aussi qu'aucune clé ni aucun mot de passe n'apparaît dans le code. Écris ensuite un guide d'une page qui explique au client comment utiliser sa page de statut. Dis-moi ce que tu n'as pas pu vérifier.
```

Tu dois recevoir un compte rendu complet et un guide client prêt à relire.

@@ SECTION 7c1f1590-8ec8-44e8-8608-1bc0991d7f67  Le Business

@@ CHAPITRE 1
### À faire maintenant : passer la checklist de livraison

```prompt
Je livre [nom du projet] à [client]. Passe la checklist de livraison et réponds à chaque point par « fait », « à faire » ou « non vérifié » :
1) Fonctionnement : le parcours utilisateur complet est testé en conditions réelles.
2) Sécurité : aucune clé, aucun mot de passe, aucun fichier .env dans le code ni dans l'historique Git. Les accès sont limités aux bonnes personnes.
3) Transmission : les accès du client sont configurés, la documentation d'utilisation existe, un contact est indiqué.
Ne corrige rien pour l'instant. Donne-moi seulement l'état de chaque point.
```

Tu dois recevoir un tableau honnête, avec les points non vérifiés signalés.

@@ CHAPITRE 2
### À faire maintenant : faire évoluer un projet livré

```prompt
Un client me demande : [décris la demande].
Avant de modifier quoi que ce soit : 1) relis CLAUDE.md et résume la structure du projet, 2) dis quelles parties du système cette demande touche (exports, calculs, écrans liés), 3) propose un plan et une estimation du risque. Attends mon accord.
```

Après la modification, garde une trace :

```prompt
Ajoute une entrée au journal du projet : la date, la demande du client, ce qui a été changé, et les fichiers touchés.
```

Tu dois recevoir une analyse d'impact avant la moindre modification.

@@ CHAPITRE 3
### À faire maintenant : rendre une promesse tenable

```prompt
Voici la promesse que je veux faire à un client : « [colle ta promesse] ».
Dis-moi si elle est tenable avec une méthode Plan, Execute, Validate. Signale ce qui est risqué (garantie de résultat, délai, périmètre flou). Puis réécris-la en une version honnête que je peux tenir, avec un premier palier testable.
```

Tu dois recevoir ta promesse corrigée, avec ce qui a été retiré et pourquoi.

@@ CHAPITRE 4
### À faire maintenant : transformer un projet en starter

```prompt
Je veux transformer ce projet client en starter réutilisable.
1) Liste tout ce qui est propre à ce client (noms, données, textes, couleurs, clés). 2) Propose comment le généraliser sans copier aucune information confidentielle. 3) Écris un fichier STARTER.md : à quoi sert ce starter, pour quel type de besoin, et pour quels cas il n'est pas adapté. Ne modifie aucun fichier avant mon accord.
```

Tu dois recevoir une liste de ce qui est confidentiel et un plan de généralisation.

@@ SECTION a68f9b49-ad81-4daf-a867-5bca00a20489  Hacks et vidéos bonus

@@ CHAPITRE 1
### À faire maintenant : créer ton premier sub-agent

Un sub-agent est un fichier dans le dossier `.claude/agents/`. Demande à Claude Code de le créer avec toi :

```prompt
Crée un sub-agent dans .claude/agents/ nommé [nom], dédié uniquement à [sa mission unique, par exemple rédiger des posts]. Écris son périmètre : ce qu'il fait, ce qu'il ne fait jamais, et ses garde-fous (ne jamais inventer une information, ne jamais dire qu'une action a réussi sans l'avoir vérifiée). Montre-moi le fichier avant de l'enregistrer.
```

Tu dois voir un fichier court et précis. Teste-le ensuite :

```prompt
Utilise le sub-agent [nom] pour [une petite tâche de test]. Dis-moi ce qu'il a fait.
```

@@ CHAPITRE 2
### À faire maintenant : choisir l'architecture selon le besoin

```prompt
Mon projet : [décris-le]. Mon besoin d'automatisation : [décris-le].
Compare trois options : 1) Claude Code seul, 2) Claude Code connecté à des services par MCP, 3) Claude Code avec n8n. Pour chacune, dis ce qu'elle apporte et ce qu'elle complique. Recommande-en une, pour ce besoin précis, en deux phrases. Ne choisis pas n8n par défaut.
```

Tu dois recevoir une recommandation argumentée, pas un choix d'habitude.

@@ CHAPITRE 3
### À faire maintenant : installer et évaluer un plugin

Ces commandes se tapent **dans Claude Code**, pas dans le terminal.

Voir et parcourir les plugins disponibles :

```claude
/plugin
```

Ajouter la marketplace communautaire :

```claude
/plugin marketplace add anthropics/claude-plugins-community
```

Ajouter la marketplace de démonstration :

```claude
/plugin marketplace add anthropics/claude-code
```

Installer un plugin, en remplaçant les deux noms :

```claude
/plugin install nom-du-plugin@nom-de-la-marketplace
```

Avant d'installer, regarde trois choses dans l'onglet « Discover » : le coût en contexte, la date de dernière mise à jour, et la liste de ce que le plugin va installer. N'installe jamais un plugin dont tu ne connais pas la source.

Pour te faire aider à évaluer :

```prompt
Je pense installer le plugin [nom]. Aide-moi à décider : qu'ajoute-t-il (commands, agents, skills, hooks, serveurs MCP) ? Répond-il à un besoin réel de mon projet ? Quels risques prend-on en l'installant ? Ne l'installe pas, donne-moi seulement ton avis.
```
