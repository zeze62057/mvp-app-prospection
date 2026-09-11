# Fiche pratique — Vrais prompts, Section 5 (Le Fullstack, projet fil rouge)

> Compagnon de [05-fullstack-fil-rouge.md](05-fullstack-fil-rouge.md). Scénario fil conducteur pour cette fiche : un cabinet de conseil fictif "Alpha Conseil" qui livre à ses clients un système à 3 briques, formulaire d'intake, dashboard de suivi, page de statut. C'est délibérément proche du type de projet que Chatllow produira réellement.

---

## Chapitre 1 — De Lovable à Claude Code

### Repartir d'un prototype pour construire la version production
```
Voici la description d'un prototype fait sous Lovable pour Alpha
Conseil : un formulaire d'intake client avec les champs nom, entreprise,
besoin, budget estimé, et un bouton d'envoi qui affiche un message de
confirmation. Reconstruis cette interface en HTML/CSS/JS simple, sans
framework, dans un dossier /alpha-conseil neuf. Garde l'idée et la
structure de champs du prototype, mais construis une base pensée pour
évoluer (connexion future à une vraie base de données, validations
réelles), pas une simple copie visuelle du prototype.
```

---

## Chapitre 2 — Architecture n8n + Claude Code

### Poser la répartition des responsabilités avant de coder
```
Avant de commencer à construire, aide-moi à clarifier la répartition
entre Claude Code et n8n pour ce projet Alpha Conseil. Le produit
(formulaire, dashboard, page de statut) sera construit avec toi. Liste-
moi les automatisations candidates pour n8n : par exemple notifier
l'équipe par email à chaque nouvelle soumission du formulaire, ou
synchroniser les nouvelles demandes vers une base Notion. Explique pour
chaque candidat pourquoi ça relève de n8n plutôt que d'être codé
directement dans l'application.
```

---

## Chapitre 3 — MCP Playwright

### Faire tester réellement une fonctionnalité, pas juste la relire
```
Le formulaire d'intake est terminé selon toi. Avant de considérer cette
tâche comme faite, utilise Playwright pour ouvrir réellement la page,
remplir les 4 champs avec des données de test, cliquer sur envoyer, et
vérifier que le message de confirmation s'affiche bien. Montre-moi ce
que tu as observé à l'écran, pas seulement "le code a l'air correct".
```

---

## Chapitre 4 — Build Phase 1, formulaire d'intake

### Lancer la phase 1 avec le workflow Plan, Execute, Validate
```
Plan : propose-moi les étapes pour construire le formulaire d'intake
d'Alpha Conseil. Champs : nom, entreprise, besoin (texte libre), budget
estimé (menu déroulant avec 3 tranches). Objectif : à la soumission, les
données sont stockées dans un fichier JSON local pour l'instant (pas de
vraie base de données à ce stade), et un message de confirmation
s'affiche. Ne code rien, donne-moi juste le plan.
```
Une fois le plan validé :
```
Le plan me va, vas-y.
```
Puis validation :
```
Teste le formulaire avec Playwright comme vu au chapitre 3, avec des
données réalistes, et confirme-moi que l'entrée apparaît bien dans le
fichier JSON une fois le formulaire soumis.
```

---

## Chapitre 5 — Build Phase 2, dashboard de suivi

### Cadrer un dashboard qui doit tenir dans la durée, pas juste pour la démo
```
Contexte : les données d'intake sont dans un fichier JSON local (phase
1 terminée). Objectif : un dashboard qui liste chaque demande reçue,
avec recherche par nom d'entreprise, filtre par tranche de budget, et
un statut modifiable (Nouveau, Contacté, Proposition envoyée, Signé,
Perdu). Périmètre : uniquement la lecture et la mise à jour du fichier
JSON existant, ne change pas sa structure de données sans me le dire
d'abord. Pense ce dashboard pour rester lisible même avec 200 demandes,
pas seulement les 3 ou 4 de test qu'on a actuellement.
```

### Vérifier que le dashboard reste utilisable à plus grande échelle
```
Génère 50 entrées de données de test réalistes dans le fichier JSON,
puis ouvre le dashboard avec Playwright et vérifie que la recherche et
les filtres fonctionnent correctement avec ce volume, pas seulement
avec les 3 entrées initiales.
```

---

## Chapitre 6 — Build Phase 3, page de statut et livraison finale

### Fermer la boucle avec la page de statut
```
Contexte : phases 1 et 2 terminées et validées. Objectif : une page de
statut publique, accessible via un lien unique par demande (par exemple
/statut/[id]), qui affiche à l'entreprise cliente uniquement sa propre
demande et son statut actuel, sans donner accès aux autres demandes du
dashboard. Périmètre : lecture seule du fichier JSON, aucune donnée des
autres clients ne doit être accessible depuis cette page.
```

### Checklist de livraison finale
```
Avant de considérer ce projet fil rouge comme livrable, vérifie et
confirme-moi chacun de ces points un par un : (1) les 3 phases
fonctionnent ensemble de bout en bout testé avec Playwright, (2) une
documentation non technique existe pour expliquer au client comment
consulter le dashboard, (3) aucune donnée sensible n'est exposée sur la
page de statut publique, (4) le projet est prêt à être déployé sur
Vercel ou OVH. Pour chaque point, dis-moi si c'est fait, partiellement
fait, ou pas fait, ne réponds pas juste "tout est bon".
```

---

## Exercice pour l'apprenant

Remplace le scénario "Alpha Conseil" par ton propre projet fil rouge (un cas Chatllow réel, un projet pour un distributeur Longrich, ou autre). Reprends les prompts de cette fiche phase par phase, en les adaptant aux vrais champs et au vrai besoin de ton cas, plutôt que de les copier tels quels.
