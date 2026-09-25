---
name: formation-cybersecurite-ia
description: >-
  Construit et fait évoluer le Module 6 "Cybersécurité IA" de Vivier IA, la formation complète de Zézé sur la
  sécurité de Claude et des agents IA, des applications web, des entreprises, et sur les tests d'intrusion
  dans un cadre légal. Se déclenche quand Zézé demande "le module cybersécurité", "un chapitre de sécurité",
  "sécuriser Claude", "sécuriser un agent ou un serveur MCP", "auditer la sécurité d'un projet ou d'une
  entreprise", "prépare le chapitre X du Module 6", ou veut une leçon, une checklist ou un exercice de sécurité
  pour ses élèves. Ne produit jamais de contenu offensif opérationnel ni de test sur un système sans autorisation.
---

# Formation Cybersécurité IA (Module 6 de Vivier IA)

Programme, squelette et suivi : `livrables/formations/ecosysteme-ia/2026-09_vivier-ia-module-6-cybersecurite-ia/README.md`.
À lire en premier à chaque session. Ce skill donne la méthode et les limites, le README donne le contenu.

## Mission

Produire, chapitre par chapitre, une formation que l'élève peut appliquer tout de suite à ses propres projets
et à ceux d'une entreprise. À la fin du module, l'élève sait : identifier ses risques, sécuriser un projet IA
(agents, application web), et livrer un audit de sécurité simple dans un cadre légal.

## Limites qui ne se négocient pas

1. **Autorisation d'abord.** Tout test d'intrusion se fait sur le système de l'élève ou avec une autorisation
   écrite du propriétaire, avec un périmètre défini. Chaque chapitre offensif commence par ce rappel.
2. **Défense avant attaque.** On explique un risque pour le corriger. Pas d'exploit prêt à l'emploi, pas de
   charge malveillante, pas de contournement de protection, pas de contenu de type ransomware, vol de données,
   déni de service, ni ciblage d'une personne ou d'une organisation. Les exercices se font sur un laboratoire
   local fourni avec le module ou sur le propre projet de l'élève.
3. **Rien d'inventé.** Chaque affirmation technique ou réglementaire est vérifiée dans une source officielle
   (documentation Anthropic, Supabase, Vercel, OWASP, NIST, textes de loi) avant d'entrer dans un chapitre.
   Sans source vérifiée, on écrit "à vérifier" et on ne l'enseigne pas. Ne jamais citer un chiffre de menace,
   une loi ou un article de mémoire.
4. **Aucun secret dans un chapitre.** Ni clé, ni mot de passe, ni identifiant réel. Les exemples utilisent des
   valeurs factices, clairement marquées.
5. **Cas réels anonymisés.** Les études de cas viennent des vrais projets de Zézé (voir le README), sans
   donnée personnelle ni secret. Un cas où Zézé s'est trompé est présenté comme une leçon, sans dramatiser.
6. **Tiers non vérifié = lu avant installé.** Un skill, un plugin ou un serveur MCP tiers se lit en entier avant
   toute installation ; ses accès sont réduits au strict nécessaire. C'est aussi un chapitre du module.

## Méthode par chapitre

1. **Cadrer** : objectif du chapitre en une phrase, public (élève débutant ou intermédiaire), lien avec les
   autres modules (Module 4 RGPD et AI Act pour le juridique, Module 1 pour Claude Code).
2. **Sourcer** : lister les sources officielles à consulter, les lire, noter ce qui est confirmé et ce qui ne
   l'est pas.
3. **Rédiger** : phrases courtes (règle de Zézé), un exemple concret ancré dans un cas réel, une sous-section
   "Installation pratique" avec les vraies commandes quand un outil est présenté.
4. **Faire pratiquer** : un exercice sur le propre système de l'élève ou sur le laboratoire, avec un signal de
   réussite clair. Utiliser le skill `pratiquer-technique` pour le vérifier avec Zézé en direct.
5. **Vérifier** : relire contre les sources, tester chaque commande, refuser tout contenu qui sortirait des
   limites ci-dessus.
6. **Publier** : fiche pour la plateforme et, si demandé, vidéo avec le skill `creer-video-formation`. Le
   chargement en base se fait comme les autres cours, après relecture de Zézé.

## Ce que ce skill ne fait pas

- Il n'exécute jamais d'analyse, de scan ou de test sur un système qui n'est pas explicitement celui de Zézé
  ou de l'élève, ni sur un service en ligne d'un tiers.
- Il ne remplace pas un avis juridique : il renvoie vers un professionnel pour toute obligation légale précise.
- Il n'utilise pas le skill tiers `cybersecurity-expert` comme source de vérité : ce dernier est une référence
  secondaire, générique et non vérifiée.

## Suivi

Chaque chapitre a un état dans le README du module (à cadrer, sources lues, rédigé, testé, relu, publié).
Mettre à jour cet état à la fin de chaque session, avec la date.
