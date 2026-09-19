# Section 9 — 💥 Solutions IA

> Quatre solutions concrètes et transposables, qui combinent les briques déjà vues (Claude Code, n8n, gabarit à 4 éléments) sur des besoins business précis, plutôt que d'introduire de nouveaux concepts.

## Chapitre 1 : Générateur de contrat

### Le besoin que cette solution résout

Rédiger un contrat pour chaque nouveau client à partir de zéro prend du temps et introduit un risque d'oubli d'une clause importante. Un générateur de contrat combine un prompt système (Module 3, section 4) qui connaît la structure standard attendue, et les informations spécifiques du client à insérer.

### L'architecture typique de cette solution

Un formulaire ou un webhook n8n (Module 2) reçoit les informations variables (nom du client, montant, durée, périmètre de la mission), un nœud IA génère le contrat à partir d'un prompt système contenant le gabarit juridique de base, et le document généré est envoyé pour relecture humaine avant signature, jamais envoyé directement sans vérification.

### Le point de vigilance non négociable

Un contrat généré par IA doit toujours passer par une relecture humaine avant envoi au client, particulièrement sur les clauses sensibles (responsabilité, propriété intellectuelle). L'IA accélère la rédaction, elle ne remplace jamais la validation juridique finale.

**Points clés**
- Un générateur de contrat combine un prompt système stable et les informations variables du client
- L'architecture type : formulaire ou webhook, génération IA, relecture humaine obligatoire avant envoi
- La relecture humaine avant signature n'est jamais optionnelle, particulièrement sur les clauses sensibles

---

## Chapitre 2 : Traitement des candidatures

### Le besoin que cette solution résout

Trier manuellement un grand nombre de candidatures pour un poste ou pour recruter des distributeurs Longrich prend un temps disproportionné par rapport à sa valeur, exactement le type de processus identifié comme prioritaire au chapitre 3 de la section 2 de ce module.

### L'architecture typique de cette solution

Un Information Extractor (Module 2, section 3, chapitre 5) extrait les champs structurés d'un CV ou d'une candidature libre (expérience, compétences, disponibilité), un nœud de logique classe les candidatures selon des critères définis à l'avance, et seules les candidatures qualifiées remontent à un humain pour la décision finale.

### Le point de vigilance : le biais et la discrimination

Un système de tri automatique reproduit fidèlement les critères qu'on lui donne, y compris s'ils introduisent un biais involontaire (âge, origine, genre). Définir des critères strictement liés à la compétence et au poste, et faire relire ces critères par quelqu'un d'autre avant mise en service, réduit ce risque.

**Points clés**
- Le tri de candidatures est un processus répétitif à fort volume, prioritaire selon la grille du chapitre 3, section 2
- L'architecture type : extraction de champs structurés, classement selon des critères définis, décision finale humaine
- Le risque de biais dans les critères de tri doit être vérifié explicitement avant mise en service

---

## Chapitre 3 : Agent IA de réservation

### Le besoin que cette solution résout

Planifier un rendez-vous par échange de messages successifs ("quand es-tu disponible ?", "et mardi ?", "non plutôt jeudi") consomme du temps sur une tâche entièrement standardisable. Un agent de réservation automatise cet échange en se connectant directement à un agenda réel.

### L'architecture typique, déjà esquissée au Module 2

Cette solution reprend directement le tool "RDV" de l'agent routeur vu au Module 2 (section 4) : un agent qui accède à un agenda réel (jamais des créneaux inventés, un point de vigilance déjà souligné à ce moment) pour proposer et confirmer un rendez-vous sans intervention manuelle.

### Le point de vigilance : la confirmation finale

Un agent de réservation doit toujours confirmer explicitement le rendez-vous pris (par email ou message), pour que les deux parties aient une trace claire, et pour détecter immédiatement une erreur de créneau avant que ça ne devienne un rendez-vous manqué.

**Points clés**
- Un agent de réservation automatise un échange de messages entièrement standardisable
- Cette solution reprend directement le tool "RDV" de l'agent routeur déjà vu au Module 2
- Une confirmation explicite du rendez-vous pris reste indispensable, pour éviter une erreur silencieuse

---

## Chapitre 4 : Mettre une application No-Code en ligne

### Ce que "no-code" veut dire ici, et sa complémentarité avec Claude Code

Un outil no-code (comme un constructeur de site ou d'application visuel) permet de mettre en ligne rapidement une interface sans écrire de code. Ce n'est pas un concurrent de Claude Code vu au Module 1, c'est un choix pertinent quand le besoin est simple et standard, alors que Claude Code devient pertinent dès que le besoin sort du cadre standard proposé par l'outil no-code.

### Quand choisir le no-code plutôt que Claude Code

Un besoin très standard (une landing page simple, un formulaire de capture basique) se construit souvent plus vite en no-code. Dès que le besoin demande une logique métier spécifique, une base de données sur mesure, ou une intégration précise (comme vu tout au long du Module 1), Claude Code redevient le bon outil.

### Exemple concret

Une landing page de capture pour un webinaire ponctuel se prête bien à un outil no-code, rapide à mettre en ligne. Le tunnel de prospection complet avec pipeline et suivi hiérarchique (comme l'application Kora) dépasse largement ce qu'un outil no-code standard permet, et relève directement de Claude Code.

**Points clés**
- Le no-code est complémentaire à Claude Code, pas concurrent : pertinent pour un besoin simple et standard
- Dès qu'une logique métier spécifique ou une intégration précise est nécessaire, Claude Code redevient le bon outil
- Choisir entre les deux dépend de la nature du besoin, pas d'une préférence par défaut

---

## Questions pour les apprenants

### Compréhension
1. Pourquoi un contrat généré par IA doit-il toujours passer par une relecture humaine avant envoi ?
2. Quel risque un système de tri automatique de candidatures doit-il vérifier explicitement ?
3. Quelle brique déjà vue au Module 2 l'agent de réservation réutilise-t-il directement ?
4. Comment choisir entre un outil no-code et Claude Code pour un nouveau besoin ?

### Réflexion (synthèse de fin de module)
5. Parmi les 4 solutions de cette section, laquelle serait la plus utile immédiatement pour Chatllow ou pour Longrich ? Pourquoi ?
6. En repensant à l'ensemble du Module 3, quelle section te semble la plus directement applicable à ta situation actuelle ?

### Éléments de correction (réservé à l'enseignant)
- Q1 : l'IA accélère la rédaction mais ne remplace jamais la validation juridique finale, particulièrement sur les clauses sensibles
- Q2 : le risque de biais involontaire dans les critères de tri (âge, origine, genre), à faire relire par quelqu'un d'autre avant mise en service
- Q3 : le tool "RDV" de l'agent routeur du Module 2, section 4, qui accède à un agenda réel plutôt que des créneaux inventés
- Q4 : un besoin simple et standard se prête au no-code, un besoin avec logique métier spécifique ou intégration précise relève de Claude Code
- Q5/Q6 : pas de réponse unique, évaluer la pertinence et l'appropriation personnelle de la réponse
