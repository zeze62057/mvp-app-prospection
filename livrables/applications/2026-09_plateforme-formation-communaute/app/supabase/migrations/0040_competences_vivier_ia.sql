-- Ajoute la liste des competences acquises a la vitrine de Vivier IA.
--
-- Cle generique ("competences_titre" / "competences"), lue par la vitrine comme
-- parcours_titre ou faq : un espace sans ces cles n'affiche simplement pas la
-- section (voir page.tsx). Bâtisseur Pro n'est pas touche, son programme est
-- different (9 modules du programme marketing de reseau, pas ces 5 modules).
--
-- Contenu tire des objectifs reels des 5 modules (skill programme-ecosysteme-ia),
-- pas invente. Fusion `||` : les autres cles de contenu_vitrine restent intactes.
-- Idempotente : la rejouer ecrit les memes valeurs.

update espaces
set contenu_vitrine = contenu_vitrine || $json${
  "competences_titre": "Ce que tu sauras faire",
  "competences": [
    "Livrer un produit complet avec Claude Code, du terminal au déploiement",
    "Construire et déployer un agent IA automatisé de bout en bout avec n8n",
    "Cadrer, construire et vendre ton premier projet IA à un client",
    "Sécuriser un projet IA et transformer le RGPD en argument de vente",
    "Remplir ton carnet de clients par la prospection email"
  ]
}$json$::jsonb
where slug = 'vivier-ia';
