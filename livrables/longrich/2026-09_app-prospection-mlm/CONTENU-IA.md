# Kora — Positionnement + contenu IA quotidien

> Ajout du 2026-09-08. Aider les agents (souvent débutants) à publier sur
> les réseaux : un questionnaire de positionnement, puis un post texte
> généré chaque jour par Claude, adapté au positionnement de l'agent.

---

## 1. Point bloquant : la clé API Claude n'est pas configurée

La génération appelle l'API Anthropic depuis une fonction Edge Supabase.
La clé est lue depuis la variable d'environnement **`ANTHROPIC_API_KEY`**
(secret Supabase), jamais en dur dans le code.

**Aujourd'hui `ANTHROPIC_API_KEY` n'est renseignée nulle part** (le `.env`
racine contient un placeholder `sk-ant-xxxx…`). Tant qu'elle n'est pas
posée comme secret Supabase, le bouton « Générer » affiche un message
clair (« la génération IA n'est pas encore activée ») et ne simule rien.

### Pour activer

```
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...    # la vraie clé
supabase functions deploy generer-contenu
```

Sans CLI : Dashboard Supabase → **Edge Functions** → nouvelle fonction
`generer-contenu` → coller `supabase/functions/generer-contenu/index.ts`
(fichier autonome) → laisser **« Verify JWT » activé** → Deploy. Puis
**Edge Functions → Secrets** → ajouter `ANTHROPIC_API_KEY`.

### Coût (à décider par BONJOUR)

La fonction utilise `claude-opus-5` (choix par défaut recommandé). Pour un
usage quotidien avec régénérations, c'est le poste de coût principal. Pour
le réduire d'environ 2,5x : dans `generer-contenu/index.ts`, remplacer
`"model": "claude-opus-5"` par `"model": "claude-sonnet-5"` et ajouter
`"output_config": { "effort": "low" }` dans le corps de la requête.
Décision métier, non prise à ta place.

---

## 2. Ce qui est livré

### Base de données — `supabase/migration-contenu-ia.sql`

| Objet | Rôle |
|---|---|
| `agents.positionnement_situation`, `agents.positionnement_ton` | Le positionnement de l'agent (clés courtes, libellés côté app) |
| `contenus_generes` | Une ligne par génération (`hook`, `texte`, `ton`, `situation`, `source`, `jour`). RLS : chaque agent ne voit / n'écrit que les siens |
| `canva_templates` | Un `template_id` Canva par ton (5 lignes créées vides). RLS : lecture pour tous les agents, écriture réservée à BONJOUR (`parrain_id is null`) |

### Fonction Edge — `supabase/functions/generer-contenu/index.ts`

- Identifie l'agent via son JWT, lit son positionnement.
- Construit le prompt à partir de **dictionnaires précis** (une description
  concrète par situation, une directive par ton) — jamais un prompt
  générique. Les 6 situations et 5 tons sont câblés dans la fonction.
- Appelle `https://api.anthropic.com/v1/messages` (HTTP direct, pas de SDK :
  environnement Deno, appel simple non-streaming).
- Attend un JSON `{ "hook", "texte" }` ; parsing robuste avec repli.
- Enregistre dans `contenus_generes` et renvoie le contenu.
- Erreurs mappées : clé absente / invalide, positionnement absent, quota,
  surcharge, refus. Aucune simulation.

### Front

| Fichier | Rôle |
|---|---|
| `positionnement.html` / `.js` | Questionnaire (situation + ton). **Passage obligatoire au 1er login** : `app.js` redirige vers cette page tant que le positionnement est vide. Modifiable ensuite. |
| `contenu.html` / `.js` | « Mon contenu du jour » : affiche le post du jour ou un bouton « Générer », bouton **Régénérer**, copie du texte, bloc **Image (Canva)** montrant l'état du template pour le ton de l'agent |
| `parametres.js` | Carte « Mon positionnement » (affiche l'actuel + lien vers `positionnement.html`) |
| `kora-store.js` | `Kora.positionnement.get/set`, `Kora.contenu.dujour/generer/canvaTemplate` (démo + live) ; constantes `KORA_SITUATIONS`, `KORA_TONS` |
| `app.html`, `prospect.html`, `notifications.html`, `parametres.html` | Onglet **Contenu** dans la navigation |

Le contenu est mis en cache par jour : `contenu.dujour()` renvoie le plus
récent d'aujourd'hui ; « Régénérer » crée une nouvelle ligne et l'affiche.

---

## 3. Module image Canva — architecture prête, autofill à finaliser

- La table `canva_templates` associe **un template Canva par ton**. BONJOUR
  la remplit (`template_id`, `champ_texte` = nom du champ de texte du
  template où insérer le hook) quand les templates sont créés.
- `contenu.html` lit déjà cette table et affiche l'état (« à venir » ou
  l'identifiant du template).
- **L'autofill Canva lui-même n'est pas implémenté** : il faut un jeton
  Canva Connect + l'**API Autofill** (accès partenaire / entreprise). À
  brancher comme une fonction Edge séparée (`canva-autofill`) une fois le
  jeton et les templates disponibles, en réutilisant le `hook` déjà
  renvoyé par `generer-contenu`. Rien dans le reste de la fonctionnalité
  n'attend ce module.

---

## 4. Non défini (signalé, non improvisé)

- **Modération / contenu interdit** côté génération : aucune règle
  spécifiée au-delà des garde-fous mis dans le prompt (pas de promesse de
  gains, pas d'« argent facile »). À préciser si besoin.
- **Fréquence réelle** : « une fois par jour ou à la demande ». Ici :
  génération à la demande, cache par jour. Pas de cron qui pré-génère.

---

## 5. À faire par BONJOUR

1. **SQL** : coller `supabase/migration-contenu-ia.sql` → Run.
2. **Secret** : `ANTHROPIC_API_KEY` = la vraie clé (Dashboard → Edge
   Functions → Secrets, ou `supabase secrets set`).
3. **Fonction** : déployer `generer-contenu` (« Verify JWT » activé).
4. **Tester en local / préversion**, puis dire à Claude de pousser.

Tant que 2 et 3 ne sont pas faits : le questionnaire et l'écran
fonctionnent, mais « Générer » renvoie « génération IA pas encore
activée ».
