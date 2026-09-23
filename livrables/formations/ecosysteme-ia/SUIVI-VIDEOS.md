# Suivi des vidéos de formation, écosystème IA

> Tenu à jour par le skill `creer-video-formation`. Un chapitre = une vidéo. États : `à faire`, `script prêt`, `enregistré`, `en ligne`.
> Seul Zézé atteste qu'une vidéo est enregistrée ou en ligne : le skill ne passe jamais un chapitre à ces deux états de sa propre initiative.

**126 chapitres** : 3 dans la Section 0 (avant les modules), 123 répartis dans les 5 modules. Les dossiers de travail sont dans `<module>/videos/<section>/chapitre-<N>/`.

## Section 0 : bienvenue

Source : `2026-09_vivier-ia-section-0-bienvenue/01-bienvenue.md`. Contenu original rédigé le 2026-09-22 (voir le README du dossier), pas encore relu par Zézé. Placée avant le Module 1, hors des 5 modules du programme.

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Présentation de la formation | script prêt | 2026-09-22 | estimée 2:14 | Contenu original, rien à neutraliser. Chapitre conceptuel, diapositives seules, sans démonstration. 6 diapositives, 0 alerte. |
| Chapitre 2 : Comment bien suivre la formation | script prêt | 2026-09-22 | estimée 2:22 | Contenu original, rien à neutraliser. 1 point à valider : la phrase sur l'absence de délai est une déduction, pas une décision explicite de Zézé, à confirmer avant enregistrement. Chapitre conceptuel, diapositives seules. 6 diapositives, 0 alerte. |
| Chapitre 3 : Installer votre assistant personnel | script prêt | 2026-09-22 | estimée 4:21 | 4 points a valider avant enregistrement. Le mecanisme repose desormais sur un vrai module reutilisable, module-installs/kit-starter-vivier-academies/ (packagé le 22/09, remplace jarvis-install de Yassine SDIRI, nom Jarvis jamais utilisé). Demonstration reelle : /install puis rechargement. Dernier chapitre de la section. 5 diapositives, 0 alerte. |

## Module 1 : écosystème Claude

### Section 1 — 🧱 Les Fondations

Source : `2026-09_vivier-ia-module-1/01-fondations.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Pourquoi Claude Code va changer votre métier | script prêt | 2026-09-21 | estimée 8:35 | Pilote du skill. 3 points à valider avant enregistrement (voir `videos/01-fondations/chapitre-1/01-script.md`). |
| Chapitre 2 : Le terminal et l'IDE, votre nouvel espace de travail | script prêt | 2026-09-21 | estimée 5:35 | 3 points à valider avant enregistrement (exemple neutralisé, démonstration réelle ou non, raccourci AZERTY). PowerPoint fait avec l'outil `_outils-video`. À valider par Zézé avant le chapitre 3. |
| Chapitre 3 : Git et GitHub, le filet de sécurité du code | script prêt | 2026-09-21 | estimée 6:29 | 4 points à valider avant enregistrement (exemple `/commit` neutralisé, demande du premier commit, config Git globale, jeton GitHub). 8 diapositives. À valider par Zézé avant le chapitre 4. |
| Chapitre 4 : Vercel et OVH, mettre en ligne en quelques minutes | script prêt | 2026-09-21 | estimée 6:15 | 4 points à valider avant enregistrement (affirmation "Afrique" chez OVH à vérifier, exemple Vivier IA, démonstration du déploiement, libellés d'interface et achat OVH). 7 diapositives. Dernier chapitre de la section 1. À valider par Zézé avant la section 2. |

### Section 2 — 🧠 La Méthode

Source : `2026-09_vivier-ia-module-1/02-methode.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Agentic Coding vs Vibe Coding, la vraie différence | script prêt | 2026-09-21 | estimée 4:05 | 2 points à valider (Chatllow neutralisé, affirmation du cours sur les démonstrations en ligne), pas de démonstration. 7 diapositives. |
| Chapitre 2 : L'art de donner des instructions à Claude Code | script prêt | 2026-09-21 | estimée 7:21 | 3 points à valider (exemple du générateur d'audit remplacé, site de démonstration fictif fourni, résultat de Claude Code imprévisible). Démonstration avec les prompts de la fiche. 7 diapositives. |
| Chapitre 3 : Le workflow Plan, Execute, Validate | script prêt | 2026-09-21 | estimée 8:29 | 4 points à valider (Alpha Conseil et Playwright, site de démonstration, vérification dans le navigateur sans Playwright, plan imprévisible). Démonstration avec les prompts de la fiche. 7 diapositives. |
| Chapitre 4 : Quand ça casse, debugger et vérifier | script prêt | 2026-09-21 | estimée 3:27 | 2 points à valider (pas de démonstration, définitions ajoutées). Chapitre court. 6 diapositives. |

### Section 3 — 🕹️ Maîtriser l'outil

Source : `2026-09_vivier-ia-module-1/03-maitriser-loutil.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Premiers pas, outils principaux et permissions | script prêt | 2026-09-21 | estimée 4:19 | 2 points à valider (démonstration limitée au prompt d'autonomie de la fiche, interface des autorisations non citée). 7 diapositives. |
| Chapitre 2 : CLAUDE.md, le cerveau de votre projet | script prêt | 2026-09-21 | estimée 6:03 | 4 points à valider (deux passages remplacés : ton workspace et le changement de nom de l'école ; démonstration avec les 2 prompts de la fiche dans un dossier vide ; lecture automatique non montrée). 7 diapositives. |
| Chapitre 3 : Skills et Slash Commands, vos raccourcis personnalisés | script prêt | 2026-09-21 | estimée 7:22 | 5 points à valider (commandes et skills de ton workspace remplacés, cas réel Chatllow non utilisé, deux demandes de test hors cours, contenu créé imprévisible). Démonstration avec les 2 prompts de la fiche. 6 diapositives. |
| Chapitre 4 : MCP, connecter Claude Code à votre écosystème | script prêt | 2026-09-22 | estimée 4:14 | 4 points à valider avant enregistrement (exemple d'usage neutralisé, phrase Playwright reformulée, prompts Notion/Chatllow et Supabase/Kora de la fiche non utilisés, démonstration réelle confirmée). Démonstration en direct : connexion réelle du serveur MCP Playwright sur le dossier de démonstration. 6 diapositives, 0 alerte. |
| Chapitre 5 : Hooks, automatiser Claude Code | script prêt | 2026-09-22 | estimée 4:22 | 1 point à valider avant enregistrement (git init nécessaire sur le dossier de démonstration, valeur fictive dans le .env de test). Aucune neutralisation cette fois, le chapitre ne cite aucun élément du workspace. Démonstration réelle : hook configuré par Claude Code puis testé (commit bloqué). 6 diapositives, 0 alerte. |
| Chapitre 6 : Structurer son projet, l'arborescence qui scale | script prêt | 2026-09-22 | estimée 4:07 | 1 point à valider avant enregistrement (2 exemples tirés du workspace, dont un lié à Longrich, retirés et remplacés par la démonstration sur le site artisan). Démonstration réelle : audit puis réorganisation de l'arborescence par Claude Code, avec les 2 prompts de la fiche. 5 diapositives, 0 alerte. |
| Chapitre 7 : Gérer les coûts intelligemment | script prêt | 2026-09-22 | estimée 3:17 | 1 point à valider avant enregistrement (référence au fichier 04-quotidien.md du workspace retirée). Dernier chapitre de la section : signal de passage complet rappelé, exercice de fin de section de la fiche cité. Démonstration réelle : découpage d'une tâche en étapes par Claude Code (proposition lue, non exécutée). 6 diapositives, 0 alerte. |

### Section 4 — ⚡ Claude Code au quotidien

Source : `2026-09_vivier-ia-module-1/04-quotidien.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Second Brain, organiser son quotidien | script prêt | 2026-09-22 | estimée 4:14 | 4 points à valider avant enregistrement, le chapitre le plus personnel du programme jusqu'ici (mécanisme décrit sans dire ce workspace, 4 activités réelles de Zézé remplacées par une formulation générique, exemple du renommage réel remplacé par un exemple hypothétique, persona de démo changé pour un coach MLM fictif, distinct de l'artisan des sections précédentes). Démonstration réelle : second brain créé puis rechargé. 6 diapositives, 0 alerte. |
| Chapitre 2 : Préparer vos livrables professionnels | script prêt | 2026-09-22 | estimée 3:46 | 3 points a valider avant enregistrement (neutralisation Chatllow/CAC40, demonstration reelle confirmee sur Menuiserie Dubois et exemple hotellerie, texte du prompt 2 remplace par l'exemple du cours). 6 diapositives, 0 alerte. |
| Chapitre 3 : Gérer votre propre business (compta, processus, KPIs) | script prêt | 2026-09-22 | estimée 2:58 | Dernier chapitre de la section. 3 points a valider avant enregistrement (application directe neutralisee, exemple/chemin interne neutralise, persona coach MLM pour la demonstration). Signal de passage complet de la section 4 rappele. 6 diapositives, 0 alerte. |

### Section 5 — 🚀 Le Fullstack, projet fil rouge

Source : `2026-09_vivier-ia-module-1/05-fullstack-fil-rouge.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : De Lovable à Claude Code, la transition production | script prêt | 2026-09-22 | estimée 2:53 | Premier chapitre de la section fil rouge. 2 points a valider (demonstration reelle, aucune neutralisation necessaire). Cree le dossier /alpha-conseil reutilise dans les chapitres 3 a 6. 6 diapositives, 0 alerte. |
| Chapitre 2 : L'architecture fullstack n8n + Claude Code | script prêt | 2026-09-22 | estimée 2:35 | 3 points a valider (notifier Zeze -> vous notifier, client CAC40 -> client grand compte, demonstration de discussion sans fichier cree). 6 diapositives, 0 alerte. |
| Chapitre 3 : MCP Playwright, votre navigateur au service du dev | script prêt | 2026-09-22 | estimée 2:44 | 3 points a valider (cabinet Chatllow -> cabinet de conseil, demo jouee sur le formulaire simple du chapitre 1, MCP Playwright doit etre connecte avant enregistrement). 6 diapositives, 0 alerte. |
| Chapitre 4 : Build Phase 1, formulaire d'intake client | script prêt | 2026-09-22 | estimée 3:44 | 3 points a valider (aucune neutralisation, 3 prompts Plan/Execute/Validate joues en direct dans l'ordre, resultat de Claude Code non previsible a repeter avant enregistrement). 4 diapositives, 0 alerte. |
| Chapitre 5 : Build Phase 2, dashboard de suivi | script prêt | 2026-09-22 | estimée 3:14 | 3 points a valider (aucune neutralisation, 2 prompts joues en direct, resultat non previsible a repeter). 4 diapositives, 0 alerte. |
| Chapitre 6 : Build Phase 3, page de statut et livraison finale | script prêt | 2026-09-22 | estimée 3:21 | Dernier chapitre de la section. 3 points a valider (aucune neutralisation, 2 prompts joues en direct, mise en ligne reelle non rejouee, seule sa verification l'est). Signal de passage complet de la section 5 rappele. 5 diapositives, 0 alerte. |

### Section 6 — 💸 Le Business

Source : `2026-09_vivier-ia-module-1/06-business.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Préparer une livraison client (checklist, sécurité, handoff) | script prêt | 2026-09-22 | estimée 2:13 | 3 points a valider (aucune neutralisation, pas de prompt dedie dans la fiche donc demo tiree de l'exemple concret du cours, verification fonctionnelle non rejouee deja faite en section 5). 5 diapositives, 0 alerte. |
| Chapitre 2 : Maintenir et faire évoluer un projet dans le temps | script prêt | 2026-09-22 | estimée 2:14 | 2 points a valider (aucune neutralisation, demo d'ecriture sur le scenario Batir Conseil SARL de la fiche, sans lien technique avec /alpha-conseil). 5 diapositives, 0 alerte. |
| Chapitre 3 : Ce que vous pouvez vendre (et ce que vous ne devriez pas) | script prêt | 2026-09-23 | estimée 1:42 | 2 points a valider (CAC40 -> grands comptes, chapitre conceptuel sans demonstration). 6 diapositives, 0 alerte. |
| Chapitre 4 : Construire votre bibliothèque de starters réutilisables | script prêt | 2026-09-23 | estimée 2:36 | Dernier chapitre de la section. 3 points a valider (chemins internes et Chatllow neutralises, client Chatllow/Longrich -> client similaire, demo appliquee au fil rouge sans prompt dedie). Signal de passage complet de la section 6 rappele. 6 diapositives, 0 alerte. |

### Section 7 — 💡 Hacks & vidéos bonus

Source : `2026-09_vivier-ia-module-1/07-hacks-bonus.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Sub-agents avancés | à faire |  |  |  |
| Chapitre 2 : Claude Code au-delà de n8n | à faire |  |  |  |
| Chapitre 3 : Plugins et Extensions | à faire |  |  |  |

## Module 2 : n8n

### Section 1 — 🔍 Découvrir n8n

Source : `2026-09_vivier-ia-module-2-n8n/01-decouvrir-n8n.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Découverte de n8n | à faire |  |  |  |
| Chapitre 2 : Credentials & connexions | à faire |  |  |  |
| Chapitre 3 : Les Triggers | à faire |  |  |  |
| Chapitre 4 : Logique & types de nœuds | à faire |  |  |  |
| Chapitre 5 : Les nœuds clés | à faire |  |  |  |
| Chapitre 6 : Les bons réflexes | à faire |  |  |  |

### Section 2 — 🎛️ n8n avancé

Source : `2026-09_vivier-ia-module-2-n8n/02-n8n-avance.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Les APIs et le nœud HTTP Request | à faire |  |  |  |
| Chapitre 2 : Manipulation des données | à faire |  |  |  |
| Chapitre 3 : Données binaires | à faire |  |  |  |
| Chapitre 4 : Organisation des workflows & sous-workflows | à faire |  |  |  |
| Chapitre 5 : Gestion des erreurs | à faire |  |  |  |
| Chapitre 6 : Astuces avancées + atelier demandes commerciales | à faire |  |  |  |

### Section 3 — 🤖 IA et agents IA dans n8n

Source : `2026-09_vivier-ia-module-2-n8n/03-ia-agents-n8n.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : IA & automatisation 2.0 | à faire |  |  |  |
| Chapitre 2 : Les modèles d'IA (LLM, cloud vs local, choix du modèle) | à faire |  |  |  |
| Chapitre 3 : Prompts & messages système | à faire |  |  |  |
| Chapitre 4 : Langchain | à faire |  |  |  |
| Chapitre 5 : Nœuds IA spécialisés | à faire |  |  |  |
| Chapitre 6 : Agents IA (mémoire, contexte, exemple complet) | à faire |  |  |  |
| Chapitre 7 : Tools & Prompt Engineering | à faire |  |  |  |
| Chapitre 8 : Le RAG + construire un bon RAG | à faire |  |  |  |
| Chapitre 9 : Bonus — l'IA multimodale (vision, audio, PDF) | à faire |  |  |  |

### Section 4 — 🕹️ Construire un agent IA complet

Source : `2026-09_vivier-ia-module-2-n8n/04-agent-ia-complet.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Approche multi-agents & architecture cohérente | à faire |  |  |  |
| Chapitre 2 : Agent routeur & tools (commercial, contact, RDV) | à faire |  |  |  |
| Chapitre 3 : Récupération des infos & assemblage final | à faire |  |  |  |

### Section 5 — 🚀 Déploiement et observabilité

Source : `2026-09_vivier-ia-module-2-n8n/05-deploiement-observabilite.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Docker & environnement de production | à faire |  |  |  |
| Chapitre 2 : Sécurité des données, monitoring & health checks | à faire |  |  |  |
| Chapitre 3 : Backups, snapshots & scalabilité (queues, multi-workers) | à faire |  |  |  |
| Chapitre 4 : Booster les performances avec Redis | à faire |  |  |  |

### Section 6 — ✅ Projet complet

Source : `2026-09_vivier-ia-module-2-n8n/06-projet-complet.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Choix du process & objectifs (brief) | à faire |  |  |  |
| Chapitre 2 : Build MVP, logique & injection de données | à faire |  |  |  |
| Chapitre 3 : Agent automatisé de bout en bout | à faire |  |  |  |

### Section 7 — 💡 Hacks et astuces n8n (bonus)

Source : `2026-09_vivier-ia-module-2-n8n/07-hacks-astuces.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Mises à jour & organisation des workflows | à faire |  |  |  |
| Chapitre 2 : Sécuriser et tester ses workflows | à faire |  |  |  |
| Chapitre 3 : Notes de la communauté | à faire |  |  |  |

## Module 3 : mindset business ia

### Section 1 — 🧠 Mindset de l'Early Adopter

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/01-mindset-early-adopter.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : C'est quoi un Early Adopter ? | à faire |  |  |  |
| Chapitre 2 : Accepter l'incertitude et le changement | à faire |  |  |  |
| Chapitre 3 : Prendre la responsabilité de son apprentissage | à faire |  |  |  |
| Chapitre 4 : Visualiser les opportunités à long terme | à faire |  |  |  |
| Chapitre 5 : Se libérer des croyances limitantes techniques | à faire |  |  |  |
| Chapitre 6 : Ne pas craindre l'échec | à faire |  |  |  |
| Chapitre 7 : Toujours choisir le chemin difficile | à faire |  |  |  |

### Section 2 — ✨ L'opportunité IA

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/02-opportunite-ia.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Pourquoi nous sommes encore tôt dans cette révolution | à faire |  |  |  |
| Chapitre 2 : L'impact de l'IA sur la société et les entreprises | à faire |  |  |  |
| Chapitre 3 : Repérer ses propres opportunités avec l'IA | à faire |  |  |  |

### Section 3 — ⚙️ Les Fondations

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/03-fondations.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Définir l'IA simplement | à faire |  |  |  |
| Chapitre 2 : L'IA générative et ses types d'applications | à faire |  |  |  |
| Chapitre 3 : Les fournisseurs de la GenAI | à faire |  |  |  |

### Section 4 — 🕹️ Le Prompt Engineering

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/04-prompt-engineering.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Les fondamentaux du Prompt Engineering | à faire |  |  |  |
| Chapitre 2 : La méthode « Prompt Système » | à faire |  |  |  |

### Section 5 — 🛤️ Choisir son chemin

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/05-choisir-son-chemin.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : L'importance de faire un choix | à faire |  |  |  |
| Chapitre 2 : Déterminer ses objectifs selon son profil | à faire |  |  |  |
| Chapitre 3 : Créer un plan d'action clair | à faire |  |  |  |

### Section 6 — 🧰 Développer vos compétences

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/06-developper-competences.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Découvrir l'automatisation (débutant) | à faire |  |  |  |
| Chapitre 2 : Automatiser comme un pro (avancé) | à faire |  |  |  |
| Chapitre 3 : Découverte des agents IA (basique) | à faire |  |  |  |
| Chapitre 4 : Création d'agents IA (avancé) | à faire |  |  |  |

### Section 7 — 🚀 Votre Premier Projet IA

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/07-premier-projet-ia.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Onboarding client : bien démarrer | à faire |  |  |  |
| Chapitre 2 : Cadrage du projet : définir un projet pertinent | à faire |  |  |  |
| Chapitre 3 : Construire son MVP et sa V1 | à faire |  |  |  |
| Chapitre 4 : Tests & optimisation : faire évoluer son projet | à faire |  |  |  |
| Chapitre 5 : Livraison : maximiser la valeur de son premier projet | à faire |  |  |  |

### Section 8 — 💸 Acquisition Client (intro)

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/08-acquisition-client.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Les fondations pour réussir | à faire |  |  |  |
| Chapitre 2 : Offre & tarification | à faire |  |  |  |
| Chapitre 3 : Warm outreach (prospection chaude) | à faire |  |  |  |
| Chapitre 4 : Outbound marketing (prospection froide) | à faire |  |  |  |
| Chapitre 5 : Inbound marketing (création de contenu) | à faire |  |  |  |
| Chapitre 6 : Construire sa machine d'acquisition | à faire |  |  |  |
| Chapitre 7 : Conduire l'appel découverte & vendre | à faire |  |  |  |
| Chapitre 8 : Systématiser, déléguer, scaler | à faire |  |  |  |

### Section 9 — 💥 Solutions IA

Source : `2026-09_vivier-ia-module-3-mindset-business-ia/09-solutions-ia.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Générateur de contrat | à faire |  |  |  |
| Chapitre 2 : Traitement des candidatures | à faire |  |  |  |
| Chapitre 3 : Agent IA de réservation | à faire |  |  |  |
| Chapitre 4 : Mettre une application No-Code en ligne | à faire |  |  |  |

## Module 4 : rgpd ai act

### Section 1 — 🛡️ Le Cadre

Source : `2026-09_vivier-ia-module-4-rgpd-ai-act/01-le-cadre.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Objectifs & Présentation | à faire |  |  |  |
| Chapitre 2 : Rappels RGPD & AI Act | à faire |  |  |  |

### Section 2 — 🔍 Travailler en Sécurité

Source : `2026-09_vivier-ia-module-4-rgpd-ai-act/02-travailler-en-securite.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Identifier les données à risques | à faire |  |  |  |
| Chapitre 2 : Cartographier et classifier les usages | à faire |  |  |  |

### Section 3 — ⚙️ Déployer sans barrières

Source : `2026-09_vivier-ia-module-4-rgpd-ai-act/03-deployer-sans-barrieres.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Bonnes pratiques | à faire |  |  |  |

## Module 5 : lemlist prospection

### Section 1 — 👨‍🔬 Mise en place & Warm-up

Source : `2026-09_vivier-ia-module-5-lemlist-prospection/01-mise-en-place-warmup.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Introduction, roadmap, mindset et état d'esprit | à faire |  |  |  |
| Chapitre 2 : Présentation de Lemlist et ses alternatives | à faire |  |  |  |
| Chapitre 3 : Présentation complète de l'outil | à faire |  |  |  |
| Chapitre 4 : Configurer son compte | à faire |  |  |  |
| Chapitre 5 : Lancer le Warm-up + point délivrabilité | à faire |  |  |  |

### Section 2 — 📈 Lancer vos premières campagnes

Source : `2026-09_vivier-ia-module-5-lemlist-prospection/02-premieres-campagnes.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Créer sa séquence d'emails de prospection avec l'IA | à faire |  |  |  |
| Chapitre 2 : Créer sa première base de données via People Database | à faire |  |  |  |
| Chapitre 3 : Créer et lancer sa première campagne (de A à Z) | à faire |  |  |  |
| Chapitre 4 : La suite, répondre aux emails, Tracking Sheet & CRM | à faire |  |  |  |

### Section 3 — 👥 Lemlist Avancé & Copywriting

Source : `2026-09_vivier-ia-module-5-lemlist-prospection/03-avance-copywriting.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Lancer une campagne IA | à faire |  |  |  |
| Chapitre 2 : Focus A/B testing | à faire |  |  |  |
| Chapitre 3 : Focus sur les personnalisations (variables IA, liquid syntax & images dynamiques) | à faire |  |  |  |
| Chapitre 4 : Scénarios plus complexes | à faire |  |  |  |

### Section 4 — ⚙️ Aller plus loin

Source : `2026-09_vivier-ia-module-5-lemlist-prospection/04-aller-plus-loin.md`

| Chapitre | État | Date | Durée réelle | Notes |
|---|---|---|---|---|
| Chapitre 1 : Data — scraping, enrichissement & nettoyage | à faire |  |  |  |

