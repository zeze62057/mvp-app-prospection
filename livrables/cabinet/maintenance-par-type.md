# Maintenance d'un système, par type de projet

> Compagnon de `methode-approche-projet.md`. Comment maintenir un système déjà construit, pas comment le construire la première fois. Basé sur le Module 1, section 6, chapitre 2 ("Maintenir et faire évoluer un projet dans le temps") : comprendre rapidement un projet existant, évaluer l'impact réel d'un changement avant de l'implémenter, garder une trace claire de chaque évolution.

## Le flux générique

```mermaid
flowchart TD
    A["Demande de changement reçue"] --> B["Relire CLAUDE.md et la structure du projet"]
    B --> C{"Impact clair et limité ?"}
    C -->|"Oui"| D["Gabarit court + cycle Plan/Execute/Validate"]
    C -->|"Non, impact large ou incertain"| E["Explorer le code ou le contenu concerné avant de cadrer"]
    E --> D
    D --> F["Valider réellement, test concret"]
    F --> G{"Comportement attendu confirmé ?"}
    G -->|"Non"| D
    G -->|"Oui"| H["Documenter le changement"]
    H --> I["Livrer / notifier"]
```

Chaque type de projet ajoute une vérification spécifique à ce flux générique, là où le risque réel se situe pour ce type précis.

---

## Site vitrine / landing page

```mermaid
flowchart TD
    A["Demande de changement sur le site"] --> B["Relire CLAUDE.md"]
    B --> C{"Uniquement du texte ou du contenu ?"}
    C -->|"Oui"| D["Modifier directement"]
    C -->|"Non, touche structure ou design"| E["Cadrer avec le gabarit avant de toucher au design existant"]
    E --> F["Cycle Plan, Execute, Validate"]
    D --> G["Vérifier sur mobile et desktop"]
    F --> G
    G --> H["Documenter si le changement est notable"]
    H --> I["Livrer"]
```

**Exemple concret.** Le client (menuiserie) demande d'ajouter une section "Avis clients" sur sa page d'accueil. Ce n'est pas juste du texte, ça touche la structure de la page. On suit donc la branche de droite : on cadre avec le gabarit (contexte, objectif, périmètre, autonomie) avant de toucher au design déjà en place, on construit avec Plan/Execute/Validate, puis on vérifie que la nouvelle section s'affiche bien sur mobile et sur ordinateur avant de livrer. Si le client avait juste demandé de changer un numéro de téléphone dans le texte, on aurait pris la branche de gauche : modification directe, vérification rapide, sans tout le cadrage.

## Application / SaaS (type Kora)

```mermaid
flowchart TD
    A["Demande de changement sur l'application"] --> B["Relire CLAUDE.md et la structure du projet"]
    B --> C{"Touche la base de données ou les droits d'accès ?"}
    C -->|"Oui"| D["Évaluer l'impact sur le schéma et les policies avant de coder"]
    C -->|"Non"| E["Cycle Plan, Execute, Validate direct"]
    D --> E
    E --> F["Tester avec un volume de données réaliste, pas 2 ou 3 lignes"]
    F --> G{"Comportement confirmé ?"}
    G -->|"Non"| E
    G -->|"Oui"| H["Documenter, mettre à jour CLAUDE.md si une convention change"]
    H --> I["Livrer"]
```

**Exemple concret.** BONJOUR demande d'ajouter un champ "budget estimé" sur la fiche prospect de Kora. Ça touche la base de données (une nouvelle colonne) et potentiellement les droits d'accès (qui peut voir ce champ dans la hiérarchie). On évalue d'abord l'impact sur le schéma Supabase et les policies RLS avant d'écrire une ligne de code, puis on construit, puis on teste avec une vraie volumétrie (pas juste les 2-3 prospects de test habituels) pour vérifier que rien ne ralentit ou ne casse avec plus de données. On documente dans CLAUDE.md si ça change une convention (par exemple, si tous les nouveaux champs doivent maintenant suivre un certain format).

## Fullstack (Claude Code + n8n)

```mermaid
flowchart TD
    A["Demande de changement"] --> B{"Ça touche le produit, le workflow n8n, ou les deux ?"}
    B -->|"Produit seul"| C["Traiter côté Claude Code, tester isolé"]
    B -->|"Workflow seul"| D["Traiter côté n8n, tester nœud par nœud"]
    B -->|"Les deux"| E["Traiter séparément, tester chaque côté isolé avant de reconnecter"]
    C --> F["Valider la chaîne complète de bout en bout"]
    D --> F
    E --> F
    F --> G{"Chaîne complète confirmée ?"}
    G -->|"Non"| B
    G -->|"Oui"| H["Documenter, préciser qui maintient quoi"]
    H --> I["Livrer"]
```

**Exemple concret.** Sur le scénario Alpha Conseil (Module 1, section 5), on demande d'envoyer une notification email dès qu'un prospect passe au statut "Signé". Ça touche les deux côtés : le produit (le champ statut, déjà dans l'interface Claude Code) et n8n (le workflow qui détecte ce changement et envoie l'email). On traite les deux séparément, on teste le changement de statut seul dans l'interface, on teste l'envoi d'email seul en déclenchant le workflow n8n à la main, puis on connecte les deux et on valide la chaîne complète : changer réellement un statut dans l'interface et vérifier que l'email arrive bien. On documente qui s'occupe de quoi si ça casse un jour (le produit ou le workflow).

## Automatisation n8n seule

```mermaid
flowchart TD
    A["Demande de changement sur le workflow"] --> B["Relire la documentation du flux, sticky notes"]
    B --> C{"Touche une credential ou un trigger existant ?"}
    C -->|"Oui"| D["Vérifier le scope de la credential, tester le trigger isolé"]
    C -->|"Non"| E["Modifier le nœud concerné"]
    D --> E
    E --> F["Tester nœud par nœud avec des données épinglées"]
    F --> G{"L'Error Trigger couvre toujours le nouveau chemin ?"}
    G -->|"Non"| H["Étendre l'Error Trigger avant de livrer"]
    H --> I["Documenter et livrer"]
    G -->|"Oui"| I
```

**Exemple concret.** Le workflow de qualification commerciale (Module 2, section 2) doit maintenant notifier un nouveau canal Slack plutôt que l'ancien. Ça touche une credential (l'accès Slack) et potentiellement le trigger si le canal détermine aussi quand le workflow se déclenche. On vérifie le scope de la nouvelle credential Slack (accès juste à ce canal, pas à tout l'espace de travail), on teste le nœud Slack isolé avec le nouveau canal, puis on vérifie que l'Error Trigger existant couvre toujours ce nouveau chemin (si l'envoi Slack échoue, est-ce qu'on est encore prévenu ?) avant de documenter et livrer.

## Audit / conseil IA (starter Chatllow)

```mermaid
flowchart TD
    A["Demande de changement sur un starter d'audit"] --> B{"Spécifique à un secteur ou général ?"}
    B -->|"Spécifique à un secteur"| C["Modifier uniquement la copie de ce secteur"]
    B -->|"Général, utile à tous les secteurs"| D["Modifier le starter d'origine Chatllow"]
    D --> E["Répercuter sur les autres secteurs si pertinent"]
    C --> F["Tester le rapport généré"]
    E --> F
    F --> G["Documenter dans le README du starter concerné"]
    G --> H["Livrer"]
```

**Exemple concret.** Tu veux ajouter un champ "budget IA estimé" au rapport généré. C'est utile pour les 6 secteurs (Chatllow, immobilier, hôtellerie, BTP, finance, industrie), pas juste un seul : c'est donc général. On modifie le starter d'origine Chatllow, on teste que le rapport se génère toujours correctement, puis on répercute le même changement sur les 5 autres secteurs, chacun avec son vocabulaire adapté. On documente dans chaque README concerné que ce champ a été ajouté.

## Formation / contenu pédagogique (Vivier IA)

```mermaid
flowchart TD
    A["Demande de changement sur un module de cours"] --> B["Relire la section concernée en entier"]
    B --> C{"Touche le fond du contenu ou juste la forme ?"}
    C -->|"Fond"| D["Vérifier la fidélité au contenu source avant de réécrire"]
    C -->|"Forme"| E["Ajuster directement"]
    D --> F["Mettre à jour la fiche de prompts associée si la méthode change"]
    E --> F
    F --> G["Relire l'ensemble pour la cohérence avec les autres sections"]
    G --> H["Livrer"]
```

**Exemple concret.** Tu remarques une erreur dans l'exemple Alpha Conseil de la section 5 du Module 1 (un chiffre qui ne correspond plus à ce qui est dit ailleurs). C'est une question de fond, pas juste une faute de frappe. On relit toute la section pour vérifier que la correction reste fidèle au contenu source, on corrige, et on vérifie si la fiche de prompts associée (05-fullstack-fil-rouge-prompts.md) référence ce même exemple et doit être ajustée en cohérence. On relit l'ensemble avant de livrer, pour ne pas corriger un détail en créant une incohérence ailleurs.

## Branding / identité visuelle

```mermaid
flowchart TD
    A["Demande de changement sur le logo ou la charte"] --> B{"Changement mineur ou nouvelle direction ?"}
    B -->|"Mineur, un détail"| C["Ajuster directement sur le canvas existant"]
    B -->|"Nouvelle direction"| D["Proposer plusieurs nouvelles pistes, garder les anciennes en référence"]
    C --> E["Vérifier la propagation sur tous les supports existants"]
    D --> F["Attendre validation humaine explicite avant de propager"]
    F --> E
    E --> G["Documenter la nouvelle version dans context/HISTORY.md"]
    G --> H["Livrer"]
```

**Exemple concret.** Tu veux essayer un corail un peu plus foncé sur le logo Vivier IA. C'est un changement mineur, un détail de teinte, pas une nouvelle direction. On ajuste directement sur le canvas Claude Design existant (la pastille de couleur déjà interactive le permet). Mais avant de considérer ça terminé, on vérifie la propagation : le logo est déjà utilisé sur le support de présentation du Module 1 (9 slides), donc ce changement de teinte doit aussi être répercuté là-bas, pas seulement sur le fichier du logo isolé. On documente la nouvelle teinte dans `context/HISTORY.md` une fois tout propagé.

---

## Ce qui ne change jamais entre les types

- Relire le contexte existant avant d'agir, jamais supposer la structure ou les décisions passées
- Une validation réelle avant de considérer le changement terminé, pas une supposition
- Documenter, même brièvement, pour que le prochain changement (par soi-même ou quelqu'un d'autre) reparte d'une base claire
