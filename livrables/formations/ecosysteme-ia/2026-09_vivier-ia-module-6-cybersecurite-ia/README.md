# Module 6 : Cybersécurité IA (Vivier IA)

> Squelette validé le 2026-09-25, à relire. Chapitres 1.1 et 1.2 testés (2026-09-25), les autres restent à cadrer. Méthode et limites : skill `formation-cybersecurite-ia`.

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
| 1.2 | [L'injection de prompt : directe et indirecte](partie-1-claude-et-agents/02-injection-de-prompt.md) | Un agent qui lit du contenu extérieur (pages, e-mails, résultats d'outils) et l'obéit | OWASP Top 10 pour les applications LLM, documentation Anthropic sur la sécurité | testé le 2026-09-25 (sources lues, détecteur testé, un essai d'agent non représentatif), relecture de Zézé à faire |
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

## Démos et projets par chapitre

Chaque chapitre a une **démo** (dossier local avec de faux secrets, exécuté sur la machine de l'élève, jamais sur un tiers) et un **projet** (livrable que l'élève produit sur son propre système). Dossier : `demos/`. Une démo n'est écrite qu'après le chapitre correspondant, puis testée.

| # | Démo prévue | Projet prévu | État |
|---|-------------|--------------|------|
| 0.1 | Aucune (chapitre de cadre) | Lettre d'autorisation remplie pour son propre projet | à concevoir |
| 0.2 | Aucune (chapitre de cadre) | Carte des actifs, attaquants et impacts, sur une page | à concevoir |
| 1.1 | [Projet factice avec 4 erreurs de secrets, script de vérification](demos/1.1-secrets-et-cles-api/README.md) | [Registre des secrets](demos/1.1-secrets-et-cles-api/registre-des-secrets.md) | démo testée le 2026-09-25 |
| 1.2 | [Page piégée factice, détecteur de contenu caché, observation d'un agent](demos/1.2-injection-de-prompt/README.md) | [Règles pour un agent qui lit du contenu extérieur](demos/1.2-injection-de-prompt/regles-agent-contenu-externe.md) | démo testée le 2026-09-25 |
| 1.3 | Essais de règles `allow` et `deny` sur un dossier factice | Fichier de réglages de permissions de son projet | à concevoir |
| 1.4 | Lecture d'un skill factice avant installation, repérer les accès excessifs | Fiche de lecture d'un skill ou d'un serveur MCP tiers | à concevoir |
| 1.5 | Classer 10 exemples de données : peut-on les écrire à une IA ? | Règle personnelle « ce que j'écris à l'IA » | à concevoir |
| 1.6 | Récepteur de webhook local qui vérifie une signature avec un faux secret | Checklist de webhook pour son automatisation | à concevoir |
| 2.1 | Mini-application locale avec deux rôles, tenter (chez soi) de se donner le rôle admin | Tableau des rôles de son application et de ce que chacun peut faire | à concevoir |
| 2.2 | Base locale de test avec règles d'accès, essais avec de vrais rôles dans une transaction annulée | Jeu de tests des règles d'accès de sa propre base | à concevoir |
| 2.3 | Table avec données sensibles, retrait des droits colonne par colonne | Inventaire des données sensibles de son appli et de leur exposition | à concevoir |
| 2.4 | Stockage privé local, lien temporaire qui expire | Plan d'accès aux fichiers de ses clients | à concevoir |
| 2.5 | Faux paiement : le prix envoyé par le navigateur est ignoré par le serveur | Liste des décisions faites côté serveur dans son paiement | à concevoir |
| 2.6 | Deux produits, une base : vérifier qu'un compte partagé ne peut pas être supprimé | Règles de comptes partagés de ses produits | à concevoir |
| 2.7 | Déclencheur qui refuse de retirer le dernier admin, lecture du journal | Journal des actions sensibles de son appli | à concevoir |
| 2.8 | Projet factice : repérer une clé serveur exposée côté navigateur | Fiche de déploiement : variables publiques, variables serveur, protection du site | à concevoir |
| 3.1 | Aucune | Registre des risques d'une petite entreprise | à concevoir |
| 3.2 | Aucune (renvoi Module 4) | Fiche de conformité renvoyant au Module 4 | à concevoir |
| 3.3 | Faux e-mail d'hameçonnage fourni, à analyser en groupe | Atelier de sensibilisation de 45 minutes prêt à animer | à concevoir |
| 3.4 | Simulation d'incident sur un projet factice (chronologie fournie) | Plan de réponse à incident sur une page | à concevoir |
| 3.5 | Sauvegarde et restauration d'une base locale | Compte rendu d'un test de restauration réel | à concevoir |
| 3.6 | Audit des dépendances d'un projet factice | Rapport d'audit des dépendances de son projet | à concevoir |
| 3.7 | Aucune | Proposition et trame de rapport d'audit (offre Chatllow) | à concevoir |
| 4.1 | Aucune (cadre légal) | Lettre d'autorisation et règles d'engagement | à concevoir |
| 4.2 | Vérifier sa propre application (rôles, règles d'accès, secrets, en-têtes) | Liste des constats classés par gravité | à concevoir |
| 4.3 | Laboratoire local fourni : application volontairement fragile, sur la machine de l'élève seulement | Rapport sur le laboratoire | à concevoir |
| 4.4 | Aucune | Rapport d'audit complet avec plan de correction (= projet fil rouge) | à concevoir |

Règles des démos : faux secrets seulement, aucun accès réseau vers un tiers, scripts qui n'affichent jamais une valeur secrète, chaque commande testée avant publication.

## Projet fil rouge

**Audit de sécurité d'un projet réel.** L'élève audite l'un de ses propres projets, avec la trame du chapitre 3.7 et les vérifications du chapitre 4.2, puis livre un rapport avec un plan de correction. Cas de démonstration : Vivier Academies, avec l'accord de Zézé.

---

## Décisions et questions ouvertes

- **Textes de loi** : il faut identifier la loi applicable pour chaque pays de l'élève (Guinée, France, autres). À faire avec un juriste. Aucun article de loi n'est cité de mémoire.
- **Laboratoire du chapitre 4.3** : à concevoir. Il doit s'exécuter en local et ne jamais viser un tiers.
- **Vidéos** : le module n'a pas de vidéo. Le skill `creer-video-formation` s'utilisera après la relecture des chapitres.
- **Nombre de chapitres** : 27 titres proposés (2 + 6 + 8 + 7 + 4). Le module peut être resserré si tu préfères un premier lot plus court.
