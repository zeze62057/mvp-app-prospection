# Fiche pratique — Vrais prompts, IA et agents IA dans n8n

> Compagnon de [03-ia-agents-n8n.md](03-ia-agents-n8n.md). S'appuie sur la skill `n8n-agents` déjà disponible dans cet environnement pour la conception d'agents, de memory et de tools.

---

## Rédiger un message système pour un nœud IA de qualification

```
Pour le nœud IA de qualification du workflow commercial Chatllow, rédige
un message système clair : le rôle est de juger si une demande entrante
est "urgente" ou "à suivre", à partir du texte libre décrivant le besoin.
Précise le format de sortie attendu (un champ "urgence" avec exactement
les valeurs "urgente" ou "a_suivre", rien d'autre), et précise qu'en cas
de texte trop vague pour juger, il doit renvoyer "a_suivre" par défaut
plutôt que de deviner au hasard.
```

## Créer un agent avec des tools bien décrits

```
Crée un agent IA dans n8n pour répondre aux questions des prospects sur
les offres Chatllow. Donne-lui 2 tools : un premier nommé
"chercher-offre" qui interroge [préciser la source, base ou RAG], à
utiliser quand la question porte sur le contenu d'une offre précise ;
un second nommé "escalader-humain" qui notifie l'équipe commerciale, à
utiliser uniquement si la question sort clairement du périmètre des
offres connues. Rédige pour chaque tool une description précise de
quand l'utiliser, pas juste ce qu'il fait techniquement. Configure une
mémoire scopée par sessionId pour que deux conversations ne se
mélangent jamais.
```

## Diagnostiquer un agent qui répond à côté

```
Cet agent IA a 15 tools et répond souvent hors sujet ou invoque le
mauvais tool. Avant de corriger quoi que ce soit, liste-moi les 15
tools avec leur nom et leur description actuelle, et dis-moi lesquels
ont une description trop vague pour que l'agent sache quand les
utiliser. Propose une réduction du nombre de tools si plusieurs
couvrent un périmètre qui se chevauche, plutôt que de juste réécrire
les 15 descriptions une par une.
```

---

## Exercice pour l'apprenant

Choisis un besoin réel (Chatllow, Longrich, ou un projet perso) qui pourrait bénéficier d'un agent IA avec au moins un tool. Rédige le message système et la description du tool en suivant les 2 premiers prompts de cette fiche, puis relis ta description de tool en te demandant honnêtement si un agent qui ne verrait que ce texte saurait quand l'utiliser.
