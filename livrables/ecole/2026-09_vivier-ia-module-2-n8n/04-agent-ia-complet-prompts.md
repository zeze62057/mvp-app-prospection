# Fiche pratique — Vrais prompts, construire un agent IA complet

> Compagnon de [04-agent-ia-complet.md](04-agent-ia-complet.md). Suite directe de l'agent Chatllow esquissé en section 3.

---

## Poser l'architecture avant de construire quoi que ce soit

```
Avant de construire quoi que ce soit, aide-moi à poser l'architecture
d'un système de support Chatllow avec 3 destinations : commercial
(questions sur les offres), contact (demande générale), RDV
(planification d'un rendez-vous). Pour chacune, dis-moi si ça devrait
être un simple tool appelant un sous-workflow, ou un agent complet à
part avec sa propre mémoire. Ne code rien, donne-moi juste le plan
d'architecture pour que je le valide.
```

## Construire l'agent routeur

```
Crée l'agent routeur : son seul rôle est de lire un message entrant et
de décider laquelle des 3 destinations (commercial, contact, RDV) doit
le traiter, sans jamais répondre lui-même au fond de la demande. Rédige
un message système qui décrit uniquement comment reconnaître chaque
destination, pas comment chaque destination traite sa part. Les 3
destinations sont pour l'instant des tools vides (à compléter ensuite),
je veux d'abord valider que le routage fonctionne seul.
```

## Valider l'assemblage avec des cas réellement variés

```
Teste l'agent routeur avec ces 5 messages, formulés différemment : un
message commercial direct, un message commercial vague sans le mot
"prix" ni "offre", une demande de contact générale, une demande de
rendez-vous explicite, et un message ambigu qui pourrait relever de
plusieurs destinations. Montre-moi pour chacun vers quelle destination
il a été routé, et dis-moi clairement si un résultat te semble
discutable plutôt que de juste annoncer "tout fonctionne".
```

---

## Exercice pour l'apprenant

Ajoute une 4e destination à ce système (par exemple "réclamation" ou "facturation", selon un besoin réel de ton activité). Écris son tool, sa description pour l'agent routeur, et reprends le 3e prompt de cette fiche avec 2 nouveaux messages de test qui devraient atterrir sur cette nouvelle destination.
