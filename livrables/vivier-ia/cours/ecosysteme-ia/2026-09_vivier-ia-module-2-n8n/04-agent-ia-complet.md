# Section 4 — 🕹️ Construire un agent IA complet

> Fiche pratique associée : [04-agent-ia-complet-prompts.md](04-agent-ia-complet-prompts.md). Fil conducteur de cette section : l'agent de support Chatllow esquissé en section 3, construit ici jusqu'au bout.

## Chapitre 1 : Approche multi-agents & architecture cohérente

### Un seul agent généraliste ou plusieurs agents spécialisés

La section 3 a posé le principe : un nœud IA spécialisé, au périmètre clair, est préférable à un agent généraliste pour une tâche précise. Ce principe se prolonge à l'échelle d'un système complet : plutôt qu'un agent unique chargé de tout faire (répondre aux questions commerciales, gérer les demandes de contact, planifier des rendez-vous), une architecture multi-agents sépare ces responsabilités, exactement comme les sub-agents vus en Module 1.

### Pourquoi cette séparation tient mieux dans le temps

Un agent unique qui gère tout voit son message système grossir à chaque nouveau cas à couvrir, jusqu'à devenir contradictoire ou trop vague pour être vraiment suivi. Des agents séparés, chacun avec un message système court et précis sur son seul périmètre, restent lisibles et corrigibles individuellement, même quand le système entier grandit.

### Garder une cohérence malgré la séparation

Séparer les responsabilités ne veut pas dire que chaque agent invente son propre ton ou ses propres règles. Une cohérence d'ensemble reste nécessaire : le même niveau de politesse, la même façon d'escalader vers un humain en cas de doute, le même format de réponse général. Cette cohérence se pose généralement dans un message système partagé ou dans une convention documentée, pas en espérant que chaque agent y arrive seul.

**Points clés**
- Séparer les responsabilités en plusieurs agents spécialisés plutôt qu'un seul agent généraliste qui fait tout
- Un message système court et précis par agent reste lisible et corrigible, contrairement à un message système qui couvre tout
- La cohérence d'ensemble (ton, escalade, format) se pose explicitement, elle ne vient pas toute seule de la séparation

---

## Chapitre 2 : Agent routeur & tools (commercial, contact, RDV)

### Le rôle unique d'un agent routeur

Un agent routeur a une seule responsabilité : comprendre l'intention derrière un message entrant, et l'orienter vers le bon agent ou le bon tool spécialisé. Il ne traite jamais la demande lui-même, il décide seulement où elle doit aller.

### Les trois destinations de notre exemple

**Commercial** : la demande porte sur une offre, un tarif, une fonctionnalité. **Contact** : une demande générale, une prise de contact sans besoin précis identifié. **RDV** : une demande de planification d'un rendez-vous, directement actionnable. Chacune de ces trois destinations est un tool pour l'agent routeur, généralement un sous-workflow (vu en section 2) appelé via Execute Workflow, ou un autre agent dédié.

### Un message système de routeur reste volontairement simple

Le message système de l'agent routeur ne décrit pas comment chaque destination traite sa part, seulement comment reconnaître à quelle destination une demande appartient. Mélanger les deux (comment router ET comment traiter) fait retomber dans l'agent généraliste que le chapitre précédent cherche justement à éviter.

**Points clés**
- Un agent routeur oriente, il ne traite jamais la demande lui-même
- Commercial, contact, RDV : trois destinations séparées, chacune un tool ou un agent dédié
- Le message système du routeur reste limité à la reconnaissance de l'intention, pas au traitement de chaque cas

---

## Chapitre 3 : Récupération des infos & assemblage final

### Ce que chaque destination a besoin de récupérer

L'agent "commercial" a besoin d'accéder à une base de connaissances sur les offres, typiquement via un RAG (vu au chapitre 8 de la section 3). Le tool "contact" a besoin de consigner la demande dans un système de suivi (CRM, base, ou notification à une équipe). Le tool "RDV" a besoin d'accéder à un agenda pour proposer des créneaux réellement disponibles, pas des créneaux inventés.

### Assembler sans supposer que ça marche

Une fois les trois branches construites séparément, l'assemblage final se valide comme toute tâche du Module 1 : par un test réel, pas par supposition. Faire passer plusieurs messages formulés différemment (direct, vague, ambigu) à travers l'agent routeur, et vérifier que chacun atterrit sur la bonne destination, avant de considérer le système comme terminé.

### La checklist de livraison s'applique aussi à un système d'agents

La checklist du Module 1 (fonctionnel, sécurité, handoff) garde tout son sens ici. Fonctionnel : chaque destination traite réellement ce qu'elle doit traiter. Sécurité : aucun agent n'a accès à plus de données que son périmètre ne l'exige (l'agent "contact" n'a pas besoin de voir le détail des tarifs commerciaux, par exemple). Handoff : documenter clairement comment ajouter une 4e destination le jour où le besoin apparaît, pour que ce système reste maintenable par quelqu'un d'autre que celui qui l'a construit.

**Points clés**
- Chaque destination a un besoin de récupération d'info différent : RAG, CRM, agenda réel
- Valider l'assemblage avec des messages réellement variés, pas un seul cas de test évident
- La checklist fonctionnel/sécurité/handoff du Module 1 s'applique pleinement à un système multi-agents

---

## Questions pour les apprenants

### Compréhension
1. Quelle est la seule responsabilité d'un agent routeur ?
2. Pourquoi un message système qui grossit au fil du temps devient-il un problème ?
3. Donne un exemple de donnée que le tool "RDV" doit récupérer pour fonctionner correctement.

### Réflexion
4. Imagine une 4e destination utile pour un système de support Chatllow, au-delà de commercial/contact/RDV. Quelle information aurait-elle besoin de récupérer ?
5. Un agent routeur envoie parfois une demande commerciale claire vers le tool "contact" par erreur. Où chercherais-tu la cause en priorité, et pourquoi ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : comprendre l'intention d'un message entrant et l'orienter vers le bon agent ou tool, sans jamais traiter la demande lui-même
- Q2 : il devient contradictoire ou trop vague pour être réellement suivi, et plus difficile à corriger qu'un message système court et ciblé
- Q3 : l'accès à un agenda réel, pour proposer des créneaux effectivement disponibles plutôt qu'inventés
- Q4 : pas de réponse unique, évaluer la cohérence entre la destination proposée et l'information qu'elle devrait récupérer
- Q5 : d'abord dans la description du tool "commercial" côté agent routeur (trop vague ou mal formulée), avant de soupçonner le modèle lui-même
