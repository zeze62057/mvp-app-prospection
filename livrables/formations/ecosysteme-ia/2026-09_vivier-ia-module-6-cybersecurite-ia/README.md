# Module 6 : Cybersécurité IA (Vivier IA)

> Squelette validé le 2026-09-25, à relire. Chapitre 1.1 testé (2026-09-25), les autres restent à cadrer. Méthode et limites : skill `formation-cybersecurite-ia`.

**Promesse.** À la fin, l'élève sait identifier les risques de ses projets, sécuriser Claude, ses agents et son application web, et livrer un audit de sécurité simple à une entreprise, dans un cadre légal.

**Public.** Élèves Vivier IA d'abord. Une version pour les entreprises clientes de Chatllow (offre de conseil sécurité) pourra en être tirée ensuite.

**Ce module complète le Module 4 (RGPD et AI Act)** sans le répéter : le Module 4 traite la conformité et les données, ici on traite les attaques, les défenses et les audits. Les renvois sont notés dans chaque chapitre.

**Règle de sources.** Tout chapitre est vérifié dans une source officielle avant d'être écrit. Les colonnes "Sources à lire" ci-dessous sont des pistes, pas des vérités : rien n'est enseigné avant lecture.

## État d'avancement

| État | Signification |
|------|---------------|
| à cadrer | titre seulement |
| sources lues | sources officielles lues et notées |
| rédigé | texte écrit |
| testé | commandes et exercice essayés |
| relu | relecture de Zézé faite |
| publié | chargé sur la plateforme |

---

## Ordre de priorité

1. Le cadre (éthique, légal, vocabulaire)
2. Partie 1 : sécuriser Claude et les agents IA (ta valeur la plus rare)
3. Partie 2 : sécuriser une application web (tes cas réels)
4. Partie 3 : cybersécurité d'entreprise (ton offre de conseil)
5. Partie 4 : attaque et défense (à faire en dernier : il faut les autres parties d'abord)

---

## Le cadre

| # | Chapitre | Ancrage réel | Sources à lire | État |
|---|----------|--------------|----------------|------|
| 0.1 | Objectifs, règles du jeu et cadre légal (autorisation écrite, périmètre) | Ce que tu testes toi-même, ce que tu ne testes jamais | Textes de loi applicables au pays de l'élève (à identifier avec un juriste) | à cadrer |
| 0.2 | Le modèle de menace : actifs, attaquants, impacts | Cartographier Vivier Academies en une page | NIST CSF | à cadrer |

## Partie 1 : sécuriser Claude et les agents IA

| # | Chapitre | Ancrage réel | Sources à lire | État |
|---|----------|--------------|----------------|------|
| 1.1 | [Secrets et clés API : où ils vivent, où ils ne vont jamais](partie-1-claude-et-agents/01-secrets-et-cles-api.md) | Fichiers `.env` ignorés par Git, clés lues depuis un fichier local, jamais collées dans une conversation | Documentation Anthropic, GitHub sur les secrets | testé le 2026-09-25 (sources lues, commandes Git et règle de refus essayées en direct), relecture de Zézé à faire |
| 1.2 | L'injection de prompt : directe et indirecte | Un agent qui lit du contenu extérieur (pages, e-mails, résultats d'outils) et l'obéit | OWASP Top 10 pour les applications LLM, documentation Anthropic sur la sécurité | à cadrer |
| 1.3 | Permissions des outils et des agents : le moindre privilège | Modes de permission de Claude Code, accès Bash retiré à un skill tiers | Documentation Claude Code (permissions, hooks) | à cadrer |
| 1.4 | Serveurs MCP, skills et plugins tiers : lire avant d'installer | Skill `cybersecurity-expert` lu en entier, `allowed-tools` réduit ; skill de 3,8 Mo exclu faute d'audit | Documentation Claude Code (skills, MCP), dépôts lus | à cadrer |
| 1.5 | Les données confiées à l'IA : ce qui part chez le fournisseur | Classer ce qu'on écrit à l'IA, ce qu'on ne lui écrit jamais (renvoi Module 4) | Politique de données du fournisseur, RGPD (renvoi Module 4) | à cadrer |
| 1.6 | Automatisations n8n et webhooks : ne jamais faire confiance à l'appelant | Le paiement n'est confirmé que par le webhook vérifié, jamais par le navigateur | Documentation n8n, du prestataire de paiement | à cadrer |

## Partie 2 : sécuriser une application web

| # | Chapitre | Ancrage réel | Sources à lire | État |
|---|----------|--------------|----------------|------|
| 2.1 | Comptes, rôles et élévation de privilèges | Une faille corrigée : un membre pouvait se donner le rôle admin depuis le navigateur | OWASP Top 10, documentation Supabase (Auth) | à cadrer |
| 2.2 | Les règles d'accès aux données (RLS) et les tester avec de vrais rôles | Chaque migration testée dans une transaction annulée avec de vrais rôles avant application | Documentation Supabase (RLS), guide des bonnes pratiques Postgres | à cadrer |
| 2.3 | Donner le minimum : colonnes, tables séparées, droits retirés | Le téléphone d'un membre dans une table à part, lisible par lui seul | Documentation Postgres et Supabase | à cadrer |
| 2.4 | Fichiers privés et liens temporaires | Livrables des clients : stockage privé, lien de 60 secondes, propriétaire vérifié | Documentation Supabase (Storage) | à cadrer |
| 2.5 | Paiements : ne jamais croire le navigateur | Prix et statut décidés côté serveur, confirmation par webhook | Documentation du prestataire de paiement | à cadrer |
| 2.6 | Comptes partagés entre deux produits | Base commune Vivier et Chatllow : aucun profil créé pour l'autre produit, aucun compte partagé supprimé | Documentation Supabase (Auth) | à cadrer |
| 2.7 | Protéger le dernier administrateur et journaliser | Déclencheur qui interdit de retirer le dernier admin, journal des actions sensibles | Documentation Postgres | à cadrer |
| 2.8 | Déployer : variables d'environnement, clés publiques et serveur, protection du site | Clé serveur jamais dans le navigateur, mur d'authentification d'hébergeur | Documentation Vercel et Next.js | à cadrer |

## Partie 3 : cybersécurité d'entreprise

| # | Chapitre | Ancrage réel | Sources à lire | État |
|---|----------|--------------|----------------|------|
| 3.1 | Gérer les risques : registre, priorisation | Un registre des risques d'une petite entreprise en une page | NIST CSF, ISO 27001 (norme payante : s'appuyer sur des sources publiques) | à cadrer |
| 3.2 | Conformité : le lien avec le Module 4 | Renvoi (RGPD, AI Act) sans répéter | Module 4, textes officiels | à cadrer |
| 3.3 | Sensibiliser les équipes : hameçonnage, mots de passe, double authentification | Un atelier de 45 minutes prêt à animer | Agence nationale de cybersécurité du pays concerné (à identifier) | à cadrer |
| 3.4 | Répondre à un incident : préparer, détecter, contenir, corriger, apprendre | Un plan d'incident sur une page | NIST (guide de réponse à incident) | à cadrer |
| 3.5 | Sauvegardes et continuité | Test de restauration réel | Documentation du fournisseur de base de données | à cadrer |
| 3.6 | Fournisseurs et chaîne d'approvisionnement : dépendances, plugins, prestataires | Audit des dépendances d'un projet | OWASP, documentation npm | à cadrer |
| 3.7 | Vendre un audit de sécurité (offre Chatllow) | Trame de proposition et de rapport | Aucune : contenu propre à Chatllow | à cadrer |

## Partie 4 : attaque et défense, dans un cadre légal

| # | Chapitre | Ancrage réel | Sources à lire | État |
|---|----------|--------------|----------------|------|
| 4.1 | Le cadre d'un test d'intrusion : autorisation écrite, périmètre, règles d'engagement | Modèle de lettre d'autorisation | Textes de loi, cadres professionnels reconnus | à cadrer |
| 4.2 | Méthode d'un test : cartographier, vérifier, classer les constats | Vérifier sa propre application (rôles, règles d'accès, secrets, en-têtes) | OWASP (guide de test), MITRE ATT&CK et ATLAS | à cadrer |
| 4.3 | Laboratoire local fourni : s'entraîner sans risque | Application volontairement fragile fournie avec le module, exécutée sur la machine de l'élève seulement | À concevoir, jamais un service en ligne d'un tiers | à cadrer |
| 4.4 | Rédiger un rapport d'audit et un plan de correction | Un rapport type, du constat à la correction | NIST, OWASP | à cadrer |

## Projet fil rouge

**Audit de sécurité d'un projet réel.** L'élève audite l'un de ses propres projets, avec la trame du chapitre 3.7 et les vérifications du chapitre 4.2, puis livre un rapport avec un plan de correction. Cas de démonstration : Vivier Academies, avec l'accord de Zézé.

---

## Décisions et questions ouvertes

- **Textes de loi** : il faut identifier la loi applicable pour chaque pays de l'élève (Guinée, France, autres). À faire avec un juriste. Aucun article de loi n'est cité de mémoire.
- **Laboratoire du chapitre 4.3** : à concevoir. Il doit s'exécuter en local et ne jamais viser un tiers.
- **Vidéos** : le module n'a pas de vidéo. Le skill `creer-video-formation` s'utilisera après la relecture des chapitres.
- **Nombre de chapitres** : 27 titres proposés (2 + 6 + 8 + 7 + 4). Le module peut être resserré si tu préfères un premier lot plus court.
