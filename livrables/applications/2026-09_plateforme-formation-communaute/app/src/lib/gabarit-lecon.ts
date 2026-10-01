// Modèle de leçon proposé dans l'éditeur admin quand une section vient d'être créée (texte vide).
// Il est mis dans l'éditeur, pas dans la base : rien n'est visible des élèves avant « Enregistrer ».
// Les parties entre crochets sont à remplacer. Même structure que les leçons existantes, pour que le
// rendu (en-tête, cartes à copier, points clés) soit identique.

export function gabaritLecon(titre: string): string {
  const t = titre.trim() || "Titre du chapitre";
  return `## Chapitre 1 : ${t}

### Ce que tu vas apprendre

[Deux ou trois phrases courtes : le problème de départ, et ce que l'élève saura faire à la fin du chapitre.]

### Comment ça marche

[Explique l'idée simplement, avec un exemple concret tiré d'un cas réel.]

### Exemple concret

[Un cas précis, avec des chiffres ou des noms fictifs.]

**Points clés**
- [Premier point à retenir]
- [Deuxième point à retenir]
- [Troisième point à retenir]

### À faire maintenant : [ce que l'élève fait]

[Une phrase qui dit quoi faire.]

\`\`\`prompt
[Le prompt à copier. Remplace ce qui est entre crochets avant de l'envoyer.]
\`\`\`

Tu dois voir [le résultat attendu, en une phrase].

---

## Questions pour les apprenants

### Compréhension
1. [Question sur l'idée principale]
2. [Question sur un point précis]

### Réflexion
3. [Question qui demande d'appliquer le chapitre à sa propre situation]
`;
}

// Blocs que les boutons de l'éditeur insèrent d'un clic, à la fin du texte.
export const BLOCS_LECON = {
  chapitre: `\n\n---\n\n## Chapitre [numéro] : [titre]\n\n### [Premier sous-titre]\n\n[Texte.]\n\n**Points clés**\n- [Point à retenir]\n`,
  prompt: `\n\n### À faire maintenant : [ce que l'élève fait]\n\n\`\`\`prompt\n[Le prompt à copier.]\n\`\`\`\n\nTu dois voir [le résultat attendu].\n`,
  commande: `\n\n\`\`\`bash\n[la commande à copier]\n\`\`\`\n`,
  commandeClaude: `\n\n\`\`\`claude\n/[commande à taper dans Claude Code]\n\`\`\`\n`,
  modele: `\n\n\`\`\`markdown\n[Le texte ou le fichier modèle à copier]\n\`\`\`\n`,
  pointsCles: `\n\n**Points clés**\n- [Point à retenir]\n- [Point à retenir]\n`,
} as const;

// Vrai tant qu'il reste des parties du modèle à remplir : l'éditeur prévient avant d'enregistrer.
// Les crochets d'un prompt (« [ton activité] ») commencent par une minuscule : ils sont voulus, pas comptés.
// Sont comptés : un crochet qui commence par une majuscule, ou un crochet dans un titre.
export function resteDesCrochets(texte: string): boolean {
  return /\[[A-ZÀ-Ý][^\]\n]{2,}\]/.test(texte) || /^#{1,6} .*\[[^\]\n]+\]/m.test(texte);
}
