---
name: contenu-vivier-ia
description: Rédige un brouillon d'article pour l'onglet "Contenu" de la communauté gratuite Vivier Academies, à partir d'une veille actualité IA filtrée pour un public débutant. Se déclenche quand Zézé demande "prépare un article pour Contenu", "rédige le prochain article Vivier IA", "trouve un sujet d'actualité pour la communauté", ou équivalent. Ne publie jamais automatiquement : insère toujours en base avec le statut "brouillon", à valider ensuite par Zézé dans /admin.
---

# Skill : Contenu Vivier IA

## Mission

Produire un brouillon d'article court pour l'onglet "Contenu" de la communauté gratuite Vivier IA (`livrables/applications/2026-09_plateforme-formation-communaute/`), à partir d'une actualité IA réelle et récente. Le public est un **débutant** qui découvre l'IA et Claude Code, pas un professionnel confirmé.

**Ne jamais publier automatiquement.** Le brouillon s'insère toujours avec `statut = 'brouillon'`, invisible des membres tant que Zézé ne l'a pas validé dans `/admin` (décision explicite du 2026-09-16, voir migration `0015_contenus_statut.sql`).

---

## Étape 1 : Rechercher une actualité récente

Utilise la recherche web pour trouver 1 à 3 actualités IA récentes (moins de 7 jours idéalement) qui répondent à ce filtre, pas un filtre personnel à Zézé comme le fait la skill `recherche-actualites` :

- Compréhensible par quelqu'un qui n'a jamais codé
- Utile ou inspirant pour progresser sur Claude Code, l'agentic coding, ou l'IA appliquée au business
- Pas une actualité trop technique (papier de recherche pointu) ni trop généraliste (IA grand public sans rapport avec le cours)

Si rien de pertinent n'est trouvé, le dire honnêtement à Zézé plutôt que de forcer un sujet faible.

## Étape 2 : Rédiger l'article

- **Titre** : court, concret, pas cliché
- **Corps** : 3 à 5 paragraphes courts. Phrases courtes, pas de longues parenthèses imbriquées (voir mémoire `feedback_ecriture_phrases_courtes`)
- Toujours un **exemple concret** ancré dans un cas réel, pas juste le principe abstrait (voir mémoire `feedback_exemples_concrets_cours`)
- Ne jamais inventer un fait ou une source. Ce qui vient de la recherche web reste vérifiable
- Ton : celui déjà utilisé dans le Module 1 (direct, sans jargon non expliqué, tutoiement)

## Étape 3 : Montrer le brouillon à Zézé avant d'écrire en base

Affiche le titre et le corps complet dans la conversation, et attends sa confirmation avant l'étape 4. S'il demande des changements, les appliquer puis remontrer avant d'insérer.

## Étape 4 : Insérer en base comme brouillon

Une fois validé par Zézé, insérer la ligne via un script Node temporaire, sur le modèle déjà utilisé dans ce workspace pour toute opération Supabase ponctuelle (lire `.env.local`, client `service_role`, jamais coller de secret dans la conversation) :

```js
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data: espace } = await admin.from("espaces").select("id").eq("slug", "vivier-ia").single();

const { error } = await admin.from("contenus").insert({
  espace_id: espace.id,
  titre: "TITRE_VALIDE",
  corps: "CORPS_VALIDE",
  statut: "brouillon",
});
console.log("Brouillon insere:", error ?? "OK");
```

Exécuter ce script depuis `livrables/applications/2026-09_plateforme-formation-communaute/app/` (où vit `.env.local`), puis supprimer le fichier temporaire une fois exécuté, comme pour tout script ponctuel de ce workspace.

## Étape 5 : Confirmer à Zézé

Dire clairement que le brouillon est en base, invisible des membres, et qu'il doit aller sur `/admin` (section "Brouillons de contenu") pour le publier.

## Ce qui ne change jamais

- Jamais de publication directe avec `statut = 'publie'` depuis ce skill
- Jamais d'invention de fait ou de source
- Toujours montrer le brouillon complet à Zézé avant l'insertion en base
