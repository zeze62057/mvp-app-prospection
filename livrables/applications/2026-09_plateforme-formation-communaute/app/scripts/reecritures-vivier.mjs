// Regles de reecriture des cours Vivier IA (modules 1 a 5) avant publication.
// Utilisees par charger-lecons-vivier.mjs. Chaque regle remplace un texte exact
// (ou un motif) par sa version publiable. Un test dans le script signale toute
// regle qui ne trouve rien (faute de frappe) et tout motif interdit restant.
//
// Choix editoriaux par defaut, a valider par Zeze :
//  - l'eleve est le "tu" : plus aucune phrase ne s'adresse a Zeze lui-meme
//  - Chatllow, dans les scenarios, devient "un cabinet de conseil IA" : ce sont
//    des cas fictifs, ils ne doivent pas laisser croire que le cabinet a deja
//    des clients ni des workflows en service
//  - Longrich devient "marketing de reseau" ou "distributeurs"
//  - le workspace de Zeze disparait des exemples (explications generales a la place)
//  - CLAUDE.md, .claude/, skills, slash commands restent : c'est le sujet du cours
//  - un passage a valider : M3.1 raconte le parcours du fondateur (Guinee Forestiere),
//    conserve a la troisieme personne

const R = (id, avant, apres) => ({ id, avant, apres });

export const REECRITURES = [
  // ---------- Module 1, section 1 ----------
  R("1.1a", "C'est le point le plus important pour toi personnellement, vu où tu veux aller (cabinet de conseil, école).", "C'est le point le plus important si tu vises le conseil, l'accompagnement ou la formation."),
  R("1.1b", "C'est exactement le modèle économique que Chatllow peut exploiter : conseil ET exécution", "C'est exactement le modèle économique d'un cabinet de conseil IA moderne : conseil ET exécution"),
  R("1.1c", ", comme les starters `2026-09_generateur-audit-ia-immobilier` construits dans ce workspace, illustre", " illustre"),
  R("1.1d", "Sur ce workspace précisément, le terminal est l'endroit où tu tapes `/prime` en début de session, et où Claude Code répond \"je vais lire CLAUDE.md et te faire un résumé de ta situation\". L'IDE, lui, sert à vérifier visuellement qu'un fichier comme `04-quotidien.md` a bien été modifié", "Concrètement, le terminal est l'endroit où tu lances Claude Code et où tu lui donnes tes instructions. L'IDE, lui, sert à vérifier visuellement qu'un fichier a bien été modifié"),
  R("1.1e", "C'est exactement le fonctionnement du Slash Command `/commit` de ce workspace :", "C'est exactement le fonctionnement d'un Slash Command `/commit` bien conçu :"),
  R("1.1f", "(le tien, ou celui d'un futur client Chatllow)", "(le tien, ou celui d'un futur client)"),

  // ---------- Module 1, section 2 ----------
  R("1.2a", "ou celui de Chatllow, l'Agentic Coding", "ou celui de ton entreprise, l'Agentic Coding"),
  R("1.2b", "`2026-09_generateur-audit-ia-hotellerie`", "`generateur-audit-ia-hotellerie`"),

  // ---------- Module 1, section 3 ----------
  R("1.3a", "Ce workspace en est lui-même un exemple concret : son CLAUDE.md définit qui est Zézé, comment communiquer avec lui, et où se trouvent les différents types de contenu.", "Un bon CLAUDE.md, par exemple, définit qui tu es, comment l'agent doit communiquer avec toi, et où se trouvent les différents types de contenu."),
  R("1.3b", "Le CLAUDE.md de ce workspace a dû être suivi d'une mise à jour du contenu déjà produit quand l'école a changé de nom, \"Entrepreneur Académie\" devenu \"Vivier IA\" le 12 septembre 2026. Sans relecture des fichiers existants après ce changement, Claude Code aurait continué à utiliser l'ancien nom dans tout nouveau contenu produit, exactement le problème repéré et corrigé dans les fiches de ce Module 1.", "Quand un nom de projet ou de marque change, mettre à jour le CLAUDE.md ne suffit pas : sans relecture des fichiers existants, Claude Code continue d'utiliser l'ancien nom dans tout nouveau contenu produit."),
  R("1.3c", " comme on l'a vu avec le skill `programme-ecosysteme-ia` de ce workspace.", "."),
  R("1.3d", "### Exemple concret tiré de ce workspace", "### Exemple concret"),
  R("1.3e", "C'est ce qui permet des cas d'usage comme ceux mis en place récemment dans ce workspace :", "C'est ce qui permet des cas d'usage comme celui-ci :"),
  R("1.3f", "C'est exactement ce qui a été fait dans ce workspace pour connecter Playwright (chapitre 3 de la section 5)", "C'est exactement ainsi que se connecte Playwright (chapitre 3 de la section 5)"),
  R("1.3g", "Ce sont exactement les garde-fous appliqués aux agents de ce workspace connectés à Notion et Canva.", "Ce sont exactement les garde-fous à appliquer à un agent connecté à Notion ou à Canva."),
  R("1.3h", "Ce workspace applique ce principe avec sa séparation entre `context/` (ce qui te concerne), `livrables/` (ce que Claude produit), et `.claude/` (la configuration de l'assistant lui-même).", "Un exemple courant : un dossier pour ce qui te concerne, un dossier pour ce que Claude produit, et un dossier `.claude/` pour la configuration de l'assistant lui-même."),
  R("1.3i", "Ce workspace applique ce principe concrètement : `livrables/formations/ecosysteme-ia/` et `livrables/formations/marketing-reseau/` séparent deux filières de cours bien distinctes, plutôt que de tout mélanger dans un seul dossier `formations/`. Quand un second module a été ajouté (Module 2, n8n), il a pu prendre sa place naturellement dans `ecosysteme-ia/`, à côté du Module 1, sans avoir besoin de réorganiser le reste du dossier.", "Exemple concret : deux filières de cours bien distinctes vivent dans deux dossiers séparés, plutôt que dans un seul dossier fourre-tout. Quand un second module est ajouté à une filière, il prend sa place à côté du premier, sans avoir besoin de réorganiser le reste."),
  R("1.3j", ", exactement comme fait pour `04-quotidien.md` dans ce workspace, donne", " donne"),

  // ---------- Module 1, section 4 ----------
  R("1.4a", "C'est exactement ce que ce workspace met en place avec trois fichiers complémentaires : `CLAUDE.md` (qui tu es et comment collaborer avec toi), `context/CONTEXT.md` (ton contexte détaillé, tes objectifs, tes projets), et `context/HISTORY.md` (le journal de ce qui a été fait et décidé au fil du temps). Un `/prime` en début de session recharge tout ça d'un coup", "C'est ce que met en place un second brain avec trois fichiers complémentaires : `CLAUDE.md` (qui tu es et comment collaborer avec toi), un fichier de contexte (ton contexte détaillé, tes objectifs, tes projets), et un journal (ce qui a été fait et décidé au fil du temps). Une commande de démarrage en début de session (par exemple `/prime`) recharge tout ça d'un coup"),
  R("1.4b", "Pour quelqu'un qui mène plusieurs activités en parallèle, comme c'est ton cas avec Chatllow, Vivier IA, la chaîne YouTube et Longrich, ce second brain", "Pour quelqu'un qui mène plusieurs activités en parallèle, ce second brain"),
  R("1.4c", "Le 12 septembre 2026, l'école a changé de nom, \"Entrepreneur Académie\" est devenu \"Vivier IA\". Cette décision a été notée dans `context/HISTORY.md`. Résultat concret : n'importe quelle session future, même des mois plus tard, peut retrouver pourquoi ce changement a eu lieu et quand, sans avoir à demander à Zézé de le réexpliquer de mémoire.", "Exemple : un projet change de nom. Cette décision est notée dans le journal du projet. Résultat concret : n'importe quelle session future, même des mois plus tard, peut retrouver pourquoi ce changement a eu lieu et quand, sans avoir à te demander de le réexpliquer de mémoire."),
  R("1.4d", "C'est particulièrement vrai pour un cabinet comme Chatllow qui vise des clients CAC40", "C'est particulièrement vrai pour un cabinet qui vise des clients CAC40"),
  R("1.4e", "Ton activité a plusieurs lignes de revenus en parallèle : Chatllow, Vivier IA, Longrich. Ce chapitre ne reste donc pas théorique pour toi, il s'applique directement.", "Si ton activité a plusieurs lignes de revenus en parallèle, ce chapitre s'applique directement à toi."),
  R("1.4f", "C'est exactement ce qui a été mis en place dans `livrables/pilotage-business/2026-09_suivi-activites/` : un tableau de facturation unique pour les trois activités, plus un tableau de KPIs hebdomadaire par activité (prospects pour Chatllow, vidéos publiées pour Vivier IA, distributeurs formés pour Longrich). Une phrase donnée à Claude Code (\"cette semaine sur Chatllow : 12 prospects contactés, 3 RDV\") suffit", "Concrètement : un tableau de facturation unique pour toutes tes activités, plus un tableau de KPIs hebdomadaire par activité (prospects contactés pour le conseil, vidéos publiées pour la chaîne, personnes formées pour la formation). Une phrase donnée à Claude Code (\"cette semaine sur le conseil : 12 prospects contactés, 3 RDV\") suffit"),

  // ---------- Module 1, section 5 ----------
  R("1.5a", "Notifier Zézé sur Slack ou par email", "Te notifier sur Slack ou par email"),
  R("1.5b", "le client, ou Zézé en maintenance, ouvre", "le client, ou toi en maintenance, ouvre"),
  R("1.5c", "qu'un cabinet comme Chatllow produira.", "qu'un cabinet de conseil IA produira."),
  R("1.5d", "Imagine un projet client réel pour Chatllow ou pour un distributeur Longrich.", "Imagine un projet client réel dans ton domaine."),

  // ---------- Module 1, section 6 ----------
  R("1.6a", "Un distributeur Longrich formé à un outil de suivi de ses filleuls revient", "Un distributeur en marketing de réseau, formé à un outil de suivi de ses filleuls, revient"),
  R("1.6b", "C'est exactement ce que sont devenus les générateurs d'audit IA de ce workspace (`2026-09_generateur-audit-ia-immobilier`, `-hotellerie`, `-btp`, `-finance`, `-industrie`, `-chatllow`) :", "C'est exactement le principe d'un générateur d'audit IA décliné par secteur (immobilier, hôtellerie, BTP, finance, industrie) :"),

  // ---------- Module 1, section 7 ----------
  R("1.7a", "### Un exemple concret tiré de ce workspace", "### Un exemple concret"),
  R("1.7b", "C'est exactement le principe mis en place récemment dans ce workspace :", "C'est exactement le principe d'une chaîne de deux agents :"),
  R("1.7c", "des posts LinkedIn pour Zézé et les enregistre", "des posts LinkedIn et les enregistre"),
  R("1.7d", "Chatllow peut empaqueter en un seul plugin", "Un cabinet peut empaqueter en un seul plugin"),
  R("1.7e", "quelqu'un d'autre que Zézé travaille sur un projet Chatllow", "quelqu'un d'autre que toi travaille sur un projet client"),
  R("1.7f", "comme celle que fait l'agent LinkedIn de ce workspace sur les sujets IA au sens large", "comme celle que peut faire un agent dédié sur les sujets IA au sens large"),
  R("1.7g", " (Chatllow, Kora, ou autre)", ""),

  // ---------- Module 2, section 1 ----------
  R("2.1a", "Un workflow simple pour Chatllow :", "Un workflow simple pour un cabinet de conseil :"),
  R("2.1b", "Le workflow de qualification commerciale de Chatllow (vu en détail", "Le workflow de qualification commerciale d'un cabinet de conseil (vu en détail"),
  R("2.1c", "nommée \"Gmail - Notifications Chatllow\"", "nommée \"Gmail - Notifications\""),
  R("2.1d", "Une demande entrante sur le formulaire de contact Chatllow appelle un Webhook", "Une demande entrante sur un formulaire de contact appelle un Webhook"),
  R("2.1e", "quels distributeurs Longrich n'ont pas encore complété leur formation IA de la semaine", "quels distributeurs n'ont pas encore complété leur formation de la semaine"),
  R("2.1f", "Dans le workflow de qualification commerciale Chatllow, un IF", "Dans un workflow de qualification commerciale, un IF"),
  R("2.1g", "Imagine un besoin d'automatisation pour Chatllow ou pour Longrich :", "Imagine un besoin d'automatisation dans ton activité :"),

  // ---------- Module 2, sections 2 a 4 ----------
  R("2.2a", "(par exemple \"Alertes erreurs Chatllow\")", "(par exemple \"Alertes erreurs\")"),
  R("2.2b", "directement transposable à Chatllow :", "directement transposable à un cabinet de conseil :"),
  R("2.2c", "adapté à une demande reçue pour Chatllow, différent", "adapté à une demande reçue par un cabinet de conseil, différent"),
  R("2.3a", "Pour un agent de support Chatllow, donne", "Pour un agent de support client, donne"),
  R("2.4a", "l'agent de support Chatllow esquissé en section 3", "l'agent de support esquissé en section 3"),
  R("2.4b", "un système de support Chatllow, au-delà", "un système de support, au-delà"),

  // ---------- Module 2, section 5 ----------
  R("2.5a", "### La méthode Hostinger, retour d'expérience de Zézé", "### La méthode Hostinger, un retour d'expérience"),
  R("2.5b", "Voici comment Zézé a lui-même installé son premier serveur n8n", "Voici comment le fondateur de Vivier IA a lui-même installé son premier serveur n8n"),
  R("2.5c", "(étape que Zézé n'a pas encore faite au moment de la rédaction de ce chapitre, mais qui reste la suite logique)", "(la suite logique une fois le serveur en place)"),
  R("2.5d", "construit pour un client Chatllow tourne", "construit pour un client tourne"),
  R("2.5e", "appelle l'instance n8n de Chatllow toutes les 5 minutes", "appelle l'instance n8n toutes les 5 minutes"),

  // ---------- Module 2, sections 6 et 7 ----------
  R("2.6a", "Pour Longrich, un bon premier candidat est l'envoi", "Pour une équipe en marketing de réseau, un bon premier candidat est l'envoi"),
  R("2.6b", "mais Zézé valide le modèle avant la première activation", "mais tu valides le modèle avant la première activation"),
  R("2.6c", "Pour le récapitulatif hebdomadaire Longrich, le MVP", "Pour le récapitulatif hebdomadaire, le MVP"),
  R("2.6d", "exactement comme les starters de la bibliothèque Chatllow vus en Module 1", "exactement comme les starters vus en Module 1"),
  R("2.6e", "de ton activité (Chatllow ou Longrich) qui pourrait", "de ton activité qui pourrait"),
  R("2.7a", "l'instance n8n de Chatllow compte des workflows pour plusieurs clients différents", "une instance n8n peut compter des workflows pour plusieurs clients différents"),
  R("2.7b", "Une revue trimestrielle de l'instance Chatllow révèle", "Une revue trimestrielle de l'instance révèle"),
  R("2.7c", " (Chatllow, Longrich, ou autre)", ""),

  // ---------- Module 3 ----------
  R("3.1a", "Zézé n'a pas grandi dans le code, il a grandi en Guinée Forestière.", "Le fondateur de Vivier IA n'a pas grandi dans le code, il a grandi en Guinée Forestière."),
  R("3.1b", "L'intégration de l'IA au marketing de réseau (Longrich) n'est pas", "L'intégration de l'IA au marketing de réseau n'est pas"),
  R("3.2a", "### Ce que ça signifie pour un cabinet de conseil comme Chatllow", "### Ce que ça signifie pour un cabinet de conseil"),
  R("3.2b", "Sur Longrich, la liste de noms", "En marketing de réseau, la liste de noms"),
  R("3.2c", "s'applique à Chatllow, à Longrich, ou à n'importe quelle activité réelle", "s'applique à n'importe quelle activité réelle"),
  R("3.2d", "à ta propre activité (Chatllow, Longrich, ou YouTube) :", "à ta propre activité :"),
  R("3.4a", "pour Zézé Bilivogui, vulgarisation IA en français, ton direct sans jargon, qui explique pourquoi les distributeurs Longrich devraient", "pour Camille Durand, coach en marketing de réseau, ton direct sans jargon, qui explique pourquoi les distributeurs devraient"),
  R("3.5a", "Zézé mène plusieurs activités en parallèle (YouTube, Chatllow, Vivier IA, Longrich), mais chacune garde un objectif court terme précis et priorisé plutôt que d'avancer sans direction sur les quatre à la fois : 20 vidéos YouTube, un premier client Chatllow, 20 distributeurs Longrich formés.", "Un entrepreneur qui mène plusieurs activités en parallèle (chaîne YouTube, cabinet de conseil, formation, réseau de distributeurs) peut donner à chacune un objectif court terme précis et priorisé plutôt que d'avancer sans direction sur toutes à la fois : 20 vidéos publiées, un premier client, 20 personnes formées."),
  R("3.5b", "Le profil de Zézé combine plusieurs de ces dimensions à la fois : entrepreneur (Chatllow, Vivier IA), formateur (l'école elle-même), et créateur de contenu (YouTube).", "Un profil réel combine souvent plusieurs de ces dimensions à la fois : entrepreneur, formateur, et créateur de contenu."),
  R("3.5c", "comme celui de Zézé", "comme celui d'un entrepreneur-formateur"),
  R("3.5d", "Les 3 objectifs court terme de Zézé (20 vidéos YouTube, premier client Chatllow, 20 distributeurs Longrich formés) sont déjà formulés selon ce principe", "Des objectifs comme « 20 vidéos publiées, un premier client, 20 personnes formées » sont formulés selon ce principe"),
  R("3.5e", "Les objectifs déjà formulés de Zézé illustrent directement ce principe", "Des objectifs chiffrés (20 vidéos, un premier client) illustrent directement ce principe"),
  R("3.6a", "Un débutant en automatisation chez Chatllow commence", "Un débutant en automatisation commence"),
  R("3.6b", "avec l'exemple complet de l'agent de support Chatllow.", "avec l'exemple complet d'un agent de support."),
  R("3.7a", "Pour un premier client Chatllow, l'onboarding", "Pour un premier client, l'onboarding"),
  R("3.7b", "Pour un premier client Chatllow, générer", "Pour un premier client, générer"),
  R("3.7c", "Le premier client Chatllow signé ne représente", "Un premier client signé ne représente"),
  R("3.7d", "l'objectif court terme suivant de Zézé.", "l'objectif court terme suivant."),
  R("3.7e", "pour un client Chatllow dès demain", "pour un client dès demain"),
  R("3.8a", " (Chatllow en particulier)", ""),
  R("3.8b", "Pour Chatllow, un audit initial", "Pour un cabinet de conseil, un audit initial"),
  R("3.8c", "un futur client Chatllow ou un futur apprenant Vivier IA", "un futur client ou un futur apprenant"),
  R("3.8d", "- La chaîne YouTube est un canal d'inbound direct pour Chatllow et Vivier IA", "- Une chaîne YouTube est un canal d'inbound direct pour un cabinet de conseil comme pour une école"),
  R("3.8e", "Pour Chatllow, une machine d'acquisition combinerait", "Pour un cabinet de conseil, une machine d'acquisition combinerait"),
  R("3.8f", "illustre concrètement une machine d'acquisition pour Chatllow", "illustre concrètement une machine d'acquisition pour un cabinet de conseil"),
  R("3.8g", "Pour un appel découverte Chatllow avec un prospect CAC40", "Pour un appel découverte avec un prospect CAC40"),
  R("3.8h", "Pour Chatllow ou pour Vivier IA, esquisse", "Pour ton activité, esquisse"),
  R("3.9a", "ou pour recruter des distributeurs Longrich prend", "ou pour recruter des distributeurs prend"),
  R("3.9b", "(comme l'application Kora)", "(comme une application de prospection multi-niveaux)"),
  R("3.9c", "la plus utile immédiatement pour Chatllow ou pour Longrich ?", "la plus utile immédiatement pour ton activité ?"),

  // ---------- Module 4 ----------
  R("4.2a", "Un projet Chatllow qui traite des CV", "Un projet qui traite des CV"),
  R("4.2b", "Pour le récapitulatif hebdomadaire Longrich (Module 2, section 6)", "Pour le récapitulatif hebdomadaire (Module 2, section 6)"),
  R("4.2c", "de ton activité (Chatllow ou Longrich) :", "de ton activité :"),
  R("4.3a", "Pour un audit Chatllow chez un client CAC40", "Pour un audit chez un client CAC40"),
  R("4.4a", "sur des cas réels transposables à Chatllow ou à Vivier IA.", "sur des cas réels transposables à ton activité."),
  R("4.4b", "sur un projet réel de Chatllow.", "sur un projet réel de ton activité."),
  R("4.4c", "exactement la même discipline que pour les clés Supabase ou Chariow déjà pratiquée dans ce parcours.", "exactement la même discipline que pour les clés d'une base de données ou d'un service de paiement."),

  // ---------- Module 5 ----------
  R("5.2a", "Pour une séquence Chatllow ciblant des décideurs CAC40", "Pour une séquence ciblant des décideurs CAC40"),
  R("5.2b", "Pour Chatllow, une recherche People Database viserait", "Pour un cabinet de conseil, une recherche People Database viserait"),
  R("5.2c", "(Kora, l'application déjà construite dans ce parcours, applique exactement ce principe pour le marketing de réseau)", "(une application de prospection en marketing de réseau applique exactement ce principe)"),
  R("5.2d", "pour une campagne Chatllow ou Longrich, en identifiant", "pour une campagne de ton activité, en identifiant"),
  R("5.2e", "4. Quel outil déjà construit dans ce parcours illustre le principe d'un CRM appliqué à un besoin de prospection ?", "4. Donne un exemple d'outil qui illustre le principe d'un CRM appliqué à un besoin de prospection."),
  R("5.3a", "Pour une campagne Chatllow, tester", "Pour une campagne de conseil, tester"),
  R("5.3b", "Pour Chatllow, un scénario avancé", "Pour un cabinet de conseil, un scénario avancé"),
  R("5.3c", "pour une campagne Chatllow ou Longrich, avec", "pour une campagne de ton activité, avec"),

  // ---------- Renvois vers les fiches pratiques (fichiers *-prompts.md) ----------
  // Ces prompts sont charges dans la bibliotheque de prompts de l'espace : le
  // renvoi pointe vers l'onglet Prompts au lieu d'un nom de fichier.
  R("fiche-inline", " Fiche pratique associée : [06-projet-complet-prompts.md](06-projet-complet-prompts.md).", " Des prompts prêts à l'emploi pour cette section sont dans l'onglet Prompts."),
  R("fiche", /^> Fiche pratique associée : \[[^\]]+\]\([^)]+\)[^\n]*$/m, "> Des prompts prêts à l'emploi pour cette section sont dans l'onglet Prompts."),
];
