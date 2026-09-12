# Fiche pratique — Vrais prompts, déploiement et observabilité

> Compagnon de [05-deploiement-observabilite.md](05-deploiement-observabilite.md). S'appuie sur la skill `n8n-self-hosting` déjà disponible dans cet environnement pour le déploiement concret.

---

## Auditer la sécurité d'une instance avant de la considérer prête

```
Avant de considérer cette instance n8n prête pour la production,
vérifie et confirme-moi un par un : HTTPS est bien actif sur l'accès à
l'interface, l'accès à l'interface n'est pas ouvert sans authentification
forte, et les URLs de webhook valident bien ce qu'elles reçoivent plutôt
que de faire confiance à n'importe quelle requête entrante. Pour chaque
point, dis-moi si c'est en place, absent, ou si tu ne peux pas le
vérifier depuis ici.
```

## Mettre en place un health check relié à une alerte

```
Configure un health check sur cette instance n8n : une vérification
automatique toutes les [X minutes] que l'instance répond correctement,
et une notification [email ou Slack, précise le canal] si elle ne
répond pas après 2 tentatives consécutives. Explique-moi en une phrase
comment tester que l'alerte fonctionne réellement sans attendre une
vraie panne.
```

## Décider s'il est temps de passer en mode queue

```
Voici le nombre d'exécutions de cette instance n8n sur les 4 dernières
semaines [colle les chiffres ou décris la charge observée]. Sur cette
base, dis-moi honnêtement si un passage en mode queue avec plusieurs
workers est déjà justifié, ou si l'instance unique actuelle suffit
encore. Ne recommande pas ce changement par principe, uniquement si le
volume réel le justifie.
```

---

## Exercice pour l'apprenant

Sur une instance n8n que tu as accès (ou une instance de test), lance le premier prompt de cette fiche et note honnêtement les réponses, même si elles révèlent qu'un des 3 points de sécurité n'est pas en place. Corrige ce qui manque avant de passer au health check.
