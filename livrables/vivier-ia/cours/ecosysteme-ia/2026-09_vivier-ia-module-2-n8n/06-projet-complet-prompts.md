# Fiche pratique — Vrais prompts, projet complet n8n

> Compagnon de [06-projet-complet.md](06-projet-complet.md). Exemple fil conducteur : automatiser le suivi des distributeurs Longrich formés à l'IA.

---

## Rédiger le brief avant de construire

```
Je veux automatiser le suivi des distributeurs Longrich que je forme à
l'IA. Contexte : aujourd'hui je note manuellement qui a suivi quelle
session dans un tableau. Objectif : un workflow qui enregistre
automatiquement la présence à une session et envoie un récapitulatif
hebdomadaire. Périmètre : uniquement le suivi de présence pour cette
première version, pas encore de notation ou d'évaluation des acquis.
Autonomie : tu peux choisir l'implémentation technique, mais je veux
valider le format du récapitulatif avant la première vraie semaine.
Avant de construire quoi que ce soit, reformule ce brief pour confirmer
que tu l'as bien compris.
```

## Construire le MVP sur le chemin principal

```
Construis la version MVP de ce workflow : un trigger [Webhook ou
formulaire, à préciser] qui enregistre une présence, puis un
récapitulatif envoyé chaque [jour de la semaine] par email. Ne gère pas
encore les cas particuliers (distributeur qui ne s'est jamais inscrit
avant, doublon de présence) pour cette version. Teste le chemin
principal avec 3 ou 4 présences de test avant de considérer le MVP
terminé.
```

## Assembler la checklist de livraison

```
Ce workflow de suivi est fonctionnellement terminé. Avant de le
considérer livré, vérifie et confirme un par un : le chemin principal
fonctionne avec des données réalistes (pas seulement le cas le plus
propre), un Error Trigger est en place si une étape échoue, et rédige-
moi une note de handoff qui explique où trouver les credentials utilisées
et quoi faire si je ne reçois pas le récapitulatif hebdomadaire un jour
donné.
```

---

## Exercice pour l'apprenant

Reprends ce fil conducteur ou remplace-le par un vrai besoin de ton activité. Rédige les 3 prompts de cette fiche adaptés à ton cas, dans l'ordre (brief, MVP, checklist de livraison), avant de les lancer réellement si tu as accès à une instance n8n.
