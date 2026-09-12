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

---

## Ce qui ne change jamais entre les types

- Relire le contexte existant avant d'agir, jamais supposer la structure ou les décisions passées
- Une validation réelle avant de considérer le changement terminé, pas une supposition
- Documenter, même brièvement, pour que le prochain changement (par soi-même ou quelqu'un d'autre) reparte d'une base claire
