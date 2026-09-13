---
name: programme-ecosysteme-ia
description: >-
  Base de référence du programme de formation complet sur l'écosystème IA de
  Zézé (5 modules : Claude Code, n8n, Mindset Early Adopter & Business IA,
  RGPD/AI Act, Lemlist), organisée par ordre de priorité, doublons
  supprimés. Se déclenche uniquement quand Zézé le demande explicitement,
  par exemple "utilise le programme", "où est-ce que je place ce sujet dans
  le programme", "aide-moi à construire Vivier IA avec ce programme",
  "quels modules il me manque". Sert de référence pour structurer et faire
  évoluer le contenu de Vivier IA (école de l'IA en francophonie,
  anciennement "Entrepreneur Académie"), pas de contenu de cours détaillé
  (seuls les titres de chapitres sont disponibles).
---

# Skill : Programme Écosystème IA

## Mission

Servir de base de référence structurée pour Vivier IA, l'école de l'IA francophone que Zézé construit (anciennement "Entrepreneur Académie", renommée le 12 septembre 2026). Ce skill ne se déclenche jamais automatiquement, seulement quand Zézé le demande explicitement.

Ce fichier contient uniquement une **table des matières** (titres de modules et de chapitres), pas le contenu détaillé de chaque leçon. Ne jamais inventer de contenu de cours qui n'est pas dans cette liste : si Zézé demande le détail d'un chapitre, dis clairement que seul le titre est disponible ici et demande-lui la source si il veut aller plus loin.

## Comment utiliser ce programme

Selon la demande de Zézé, ce skill sert à :
- **Situer un sujet** : dans quel module et quel chapitre un thème donné se trouve
- **Repérer des trous** : quels sujets utiles pour Entrepreneur Académie ne sont couverts par aucun des 5 modules
- **Proposer une séquence pédagogique** : dans quel ordre enseigner ces modules à des apprenants francophones, en tenant compte du profil visé (débutant, entrepreneur, futur consultant)
- **Comparer avec le positionnement de Vivier IA** : ce qui colle à la vulgarisation IA en francophonie que vise Zézé, ce qui est trop technique ou hors sujet, ce qui pourrait être un module payant premium vs un module d'appel gratuit

Quand tu proposes une structure ou une priorisation, dis toujours pourquoi (quel objectif de Zézé ou quel profil d'apprenant ça sert), ne te contente pas de réordonner sans justification.

---

## Ordre de priorité retenu (à date du 11 septembre 2026)

Priorisé selon le besoin prioritaire actuel de Zézé (développement sur l'écosystème Claude), son usage déjà actif de n8n, et le positionnement CAC40 de Chatllow (RGPD pertinent pour rassurer ces clients). Cet ordre est un point de départ, pas une vérité figée : redemande la priorisation si le contexte de Zézé a changé (voir `context/CONTEXT.md`).

1. Écosystème Claude
2. n8n
3. Mindset Early Adopter & Business IA
4. RGPD / AI Act
5. Lemlist / prospection froide

---

## Module 1 — Écosystème Claude

> À la fin : livrer des produits complets à des clients, du terminal au déploiement, et faire de chaque projet un starter réutilisable et revendable.

### 🧱 Les Fondations
- Pourquoi Claude Code va changer votre métier
- Le terminal et l'IDE : votre nouvel espace de travail
- Git et GitHub : le filet de sécurité du code
- Vercel et OVH : mettre en ligne en quelques minutes

### 🧠 La Méthode
- Agentic Coding vs Vibe Coding, la vraie différence
- L'art de donner des instructions à Claude Code
- Le workflow Plan, Execute, Validate
- Quand ça casse, debugger et vérifier

### 🕹️ Maîtriser l'outil
- Premiers pas : outils principaux et permissions
- CLAUDE.md : le cerveau de votre projet
- Skills et Slash Commands : vos raccourcis personnalisés
- MCP : connecter Claude Code à votre écosystème
- Hooks : automatiser Claude Code
- Structurer son projet : l'arborescence qui scale
- Gérer les coûts intelligemment

### ⚡ Claude Code au quotidien
- Second Brain : organiser son quotidien
- Préparer vos livrables professionnels
- Gérer votre propre business (compta, processus, KPIs)

### 🚀 Le Fullstack — projet fil rouge
- De Lovable à Claude Code : la transition production
- L'architecture fullstack n8n + Claude Code
- MCP Playwright : votre navigateur au service du dev
- Build Phase 1 : formulaire d'intake client
- Build Phase 2 : dashboard de suivi
- Build Phase 3 : page de statut et livraison finale

### 💸 Le Business
- Préparer une livraison client (checklist, sécurité, handoff)
- Maintenir et faire évoluer un projet dans le temps
- Ce que vous pouvez vendre (et ce que vous ne devriez pas)
- Construire votre bibliothèque de starters réutilisables

### 💡 Hacks & vidéos bonus
- Sub-agents avancés
- Claude Code au-delà de n8n
- Plugins et Extensions

---

## Module 2 — n8n

### 🔍 Découvrir n8n
- Découverte de n8n
- Credentials & connexions
- Les Triggers
- Logique & types de nœuds
- Les nœuds clés
- Les bons réflexes

### 🎛️ n8n avancé
- Les APIs et le nœud HTTP Request
- Manipulation des données
- Données binaires
- Organisation des workflows & sous-workflows
- Gestion des erreurs
- Astuces avancées + atelier demandes commerciales

### 🤖 IA et agents IA dans n8n
- IA & automatisation 2.0
- Les modèles d'IA (LLM, cloud vs local, choix du modèle)
- Prompts & messages système
- Langchain
- Nœuds IA spécialisés
- Agents IA (mémoire, contexte, exemple complet)
- Tools & Prompt Engineering
- Le RAG + construire un bon RAG (Qdrant, chunking, query expansion)
- Bonus : l'IA multimodale (vision, audio, PDF)

### 🕹️ Construire un agent IA complet
- Approche multi-agents & architecture cohérente
- Agent routeur & tools (commercial, contact, RDV)
- Récupération des infos & assemblage final

### 🚀 Déploiement et observabilité
- Docker & environnement de production
- Sécurité des données, monitoring & health checks
- Backups, snapshots & scalabilité (queues, multi-workers)
- Booster les performances avec Redis

### ✅ Projet complet
- Choix du process & objectifs (brief)
- Build MVP, logique & injection de données
- Agent automatisé de bout en bout

### 💡 Hacks et astuces n8n (bonus)
- Mises à jour & organisation des workflows
- Sécuriser et tester ses workflows
- Notes de la communauté

---

## Module 3 — Mindset Early Adopter & Business IA

### 🧠 Mindset de l'Early Adopter
- C'est quoi un Early Adopter ?
- Accepter l'incertitude et le changement
- Prendre la responsabilité de son apprentissage
- Visualiser les opportunités à long terme
- Se libérer des croyances limitantes techniques
- Ne pas craindre l'échec
- Toujours choisir le chemin difficile

### ✨ L'opportunité IA
- Pourquoi nous sommes encore tôt dans cette révolution
- L'impact de l'IA sur la société et les entreprises
- Repérer ses propres opportunités avec l'IA

### ⚙️ Les Fondations
- Définir l'IA simplement
- L'IA générative et ses types d'applications
- Les fournisseurs de la GenAI

### 🕹️ Le Prompt Engineering
- Les fondamentaux du Prompt Engineering
- La méthode « Prompt Système »

### 🛤️ Choisir son chemin
- L'importance de faire un choix
- Déterminer ses objectifs selon son profil
- Créer un plan d'action clair

### 🧰 Développer vos compétences
- Découvrir l'automatisation (débutant)
- Automatiser comme un pro (avancé)
- Découverte des agents IA (basique)
- Création d'agents IA (avancé)

### 🚀 Votre Premier Projet IA
- Onboarding client : bien démarrer
- Cadrage du projet : définir un projet pertinent
- Construire son MVP et sa V1
- Tests & optimisation : faire évoluer son projet
- Livraison : maximiser la valeur de son premier projet

### 💸 Acquisition Client (intro)
- Les fondations pour réussir
- Offre & tarification
- Warm outreach (prospection chaude)
- Outbound marketing (prospection froide)
- Inbound marketing (création de contenu)
- Construire sa machine d'acquisition
- Conduire l'appel découverte & vendre
- Systématiser, déléguer, scaler

### 💥 Solutions IA
- Générateur de contrat
- Traitement des candidatures
- Agent IA de réservation
- Mettre une application No-Code en ligne

---

## Module 4 — RGPD / AI Act

> À la fin : transformer le RGPD en argument de vente, repartir avec les réflexes, scripts et livrables pour rassurer ses clients et signer en toute conformité.

### 🛡️ Le Cadre
- Objectifs & Présentation
- Rappels RGPD & AI Act

### 🔍 Travailler en Sécurité
- Identifier les données à risques
- Cartographier et classifier les usages

### ⚙️ Déployer sans barrières
- Bonnes pratiques

### 🔧 Ateliers pratiques
- Paramétrer les LLM
- Nettoyer la donnée
- Traitement et évaluation de CV
- Sécuriser un LLM en Cloud
- Extraction d'informations pertinentes depuis une image

---

## Module 5 — Lemlist / prospection froide

> À la fin : remplir son carnet de clients par la prospection par email.

### 📖 Vocabulaire de base de ce parcours

### 👨‍🔬 Mise en place & Warm-up
- Introduction, roadmap, mindset et état d'esprit
- Présentation de Lemlist et ses alternatives
- Présentation complète de l'outil
- Configurer son compte
- Lancer le Warm-up + point délivrabilité

### 📈 Lancer vos premières campagnes
- Créer sa séquence d'emails de prospection avec l'IA
- Créer sa première base de données via People Database
- Créer et lancer sa première campagne (de A à Z)
- La suite : répondre aux emails, Tracking Sheet & CRM

### 👥 Lemlist Avancé & Copywriting
- Lancer une campagne IA
- Focus A/B testing
- Focus sur les personnalisations (variables IA, liquid syntax & images dynamiques)
- Scénarios plus complexes

### ⚙️ Aller plus loin
- Data : scraping, enrichissement & nettoyage

---

## Règles importantes

- Ce fichier est une table des matières, pas un cours. Ne jamais inventer le contenu détaillé d'un chapitre non développé ici.
- Ne jamais présenter ce programme comme celui de Vivier IA déjà finalisé : c'est une référence externe à adapter, pas le programme final de Zézé.
- Si Zézé signale que ce programme a changé (nouveaux modules, réordonnancement), propose de mettre ce fichier à jour plutôt que de garder une version obsolète.
- Pas de tirets longs (em dashes) dans les réponses.
- Communication en français systématique.
