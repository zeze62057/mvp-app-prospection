# Fiche pratique — Après l'audit : interpréter, répondre, procéder

> Compagnon de [06-business.md](06-business.md). Cette fiche part d'un rapport déjà généré par un des starters `generateur-audit-ia-*` (voir `livrables/applications/`) et explique comment passer de ce rapport à une mission réellement vendue et livrée. Scénario fil conducteur : le starter BTP, avec un client fictif "Bâtir Conseil SARL".

---

## Partie 1 — Lire le rapport sans le prendre au pied de la lettre

Le rapport généré a 5 sections. Chacune se lit différemment, aucune ne se recopie telle quelle dans un vrai document client :

| Section du rapport | Ce qu'elle te dit réellement |
|---|---|
| Résumé exécutif | La photo de départ, à reformuler dans tes mots, pas à recopier |
| Constat (outils déjà utilisés) | Ce qu'il ne faut **pas** remplacer, une contrainte d'intégration |
| Opportunités identifiées | Un menu de pistes possibles, pas une offre à livrer en bloc |
| Approche recommandée | Une posture stratégique selon la maturité IA, pas encore une tâche concrète |
| Prochaines étapes | Texte générique le plus faible du rapport, à personnaliser entièrement, jamais à envoyer tel quel |

---

## Partie 2 — Choisir UN pilote, pas la liste entière

Le piège classique : présenter toutes les opportunités en vrac et laisser le client choisir. Ce n'est plus un audit, c'est une liste de courses, et ça dilue la valeur de Chatllow.

**Méthode de sélection**, directement tirée du texte que génère le rapport au niveau de maturité "aucun" : choisir le pilote au **plus fort impact perçu** et au **risque d'échec le plus faible**, jamais plusieurs pilotes en même temps.

**Exemple réel (starter BTP)** : rapport généré pour "Bâtir Conseil SARL", PME, maturité "ponctuel", 4 tâches listées (chiffrage de devis, suivi d'avancement de chantier, reporting sécurité, planification des équipes).
- Chiffrage de devis : récurrent, chronophage, une erreur se corrige avant envoi au client final → bon candidat pilote
- Reporting sécurité : un pilote mal construit ici pèse plus lourd en cas d'erreur → pas un bon premier pilote, à garder pour une phase 2

---

## Partie 3 — Traduire le pilote choisi en mission cadrée

Une fois le pilote choisi, on retombe directement sur le gabarit de la section 2 (Méthode), parce qu'une opportunité d'audit n'est pas encore une instruction pour Claude Code :
```
Contexte : Bâtir Conseil SARL, devis actuellement rédigés à la main dans
Excel, 3 gammes de prestations types (rénovation légère, gros œuvre,
second œuvre).

Objectif : un outil qui pré-remplit un devis à partir de quelques
informations saisies (surface, type de travaux, gamme), sur le modèle
des 3 gammes déjà utilisées par l'entreprise.

Périmètre : uniquement les devis sur les 3 gammes types identifiées.
Les devis sur-mesure complexes restent rédigés manuellement pour l'instant.

Autonomie : tu peux proposer la structure technique de l'outil, mais je
veux valider avec le client avant mise en service réelle.
```
C'est seulement à partir de ce gabarit rempli que le cycle Plan, Execute, Validate (section 2) démarre pour construire réellement le pilote.

---

## Partie 4 — Rédiger une proposition personnalisée avec Claude

Le texte "Prochaines étapes" du rapport est générique, on ne l'envoie jamais tel quel. Un prompt réel pour transformer le rapport en proposition vendable :
```
Voici le rapport d'audit généré pour Bâtir Conseil SARL (colle le rapport
complet ici). J'ai choisi de proposer en pilote le chiffrage de devis
assisté, pas les autres opportunités listées pour l'instant. Rédige une
proposition courte (une demi-page) à envoyer au client : le constat en
une phrase, le pilote proposé avec un délai réaliste de 2 semaines, et
une ouverture claire vers une phase 2 possible sur le suivi de chantier
ou le reporting sécurité, sans s'y engager dès maintenant.
```

---

## Partie 5 — Après la livraison du pilote

Une fois le pilote livré, on ne s'arrête pas à la facture : checklist de livraison (chapitre 1, section 6) appliquée, puis ouverture vers la suite (chapitre 2, section 6, la maintenance et l'évolution comme revenu récurrent) plutôt que de considérer la mission comme close définitivement.
```
Le pilote de chiffrage de devis est livré et validé par le client.
Rédige-moi un court message de suivi à envoyer 2 semaines après la mise
en service, qui demande un retour d'usage concret (temps gagné, ce qui
manque) et qui ouvre naturellement sur la proposition de phase 2 déjà
évoquée (suivi de chantier ou reporting sécurité), sans forcer la vente.
```

---

## Exercice pour l'apprenant

Prends un rapport généré par un des starters `generateur-audit-ia-*` de ce workspace (Chatllow, immobilier, hôtellerie, BTP, finance, ou industrie), avec des données de test de ton choix. Applique les 5 parties de cette fiche dans l'ordre : lis le rapport section par section, choisis un seul pilote en justifiant ton choix, traduis-le en gabarit, rédige la proposition avec Claude, puis imagine le message de suivi post-livraison.
