// Genere, depuis supabase/contenu/prompts-design-chatgpt.mjs :
//   - supabase/migrations/0052_prompts_design_chatgpt.sql  (le contenu, a appliquer APRES la migration 0051)
//   - supabase/contenu/CONTENU-PROMPTS.md                  (un apercu lisible, pour relire les prompts)
// Usage (depuis app/) :  node scripts/generer-prompts-design-chatgpt.mjs
// Les deux fichiers generes sont verifies par le test supabase/contenu/prompts-design-chatgpt.test.mjs :
// modifier le fichier source, puis relancer ce script. Ne jamais modifier la migration a la main.
import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { ESPACE, PROMPTS } from "../supabase/contenu/prompts-design-chatgpt.mjs";

export const LIBELLES = {
  design_maquettes: "Maquettes et écrans",
  design_identite: "Logo et charte",
  design_site: "Site et page d'accueil",
  design_supports: "Supports et réseaux",
  design_ameliorer: "Améliorer et corriger",
  design_vers_code: "De la maquette au code",
  codex_migration: "Migrer vers Codex",
  chatgpt_ameliorer: "Améliorer avec ChatGPT et Codex",
  chatgpt_integrer: "Enrichir avec l'API OpenAI",
  chatgpt_securite: "Sécurité et coûts",
};

const BALISE = "$p$";
const lf = (s) => s.replace(/\r\n/g, "\n").trim();
const sql = (s) => {
  const t = lf(s);
  if (t.includes(BALISE)) throw new Error(`Le texte contient ${BALISE}, impossible de le citer en SQL : ${t.slice(0, 40)}`);
  return `${BALISE}${t}${BALISE}`;
};

// Le rang d'un prompt dans sa categorie suit l'ordre du fichier source, en commencant a 1.
function avecOrdre() {
  const compteur = {};
  return PROMPTS.map((p) => ({ ...p, ordre: (compteur[p.categorie] = (compteur[p.categorie] ?? 0) + 1) }));
}

export function construireSql() {
  const lignes = avecOrdre().map(
    (p) => `insert into prompts (espace_id, categorie, acces, titre, contenu, ordre)
select e.id, '${p.categorie}', '${p.acces}', ${sql(p.titre)}, ${sql(p.contenu)}, ${p.ordre}
from espaces e
where e.slug = '${ESPACE}'
  and not exists (
    select 1 from prompts x where x.espace_id = e.id and x.categorie = '${p.categorie}' and x.titre = ${sql(p.titre)}
  );
`,
  );
  return `-- GENERE par scripts/generer-prompts-design-chatgpt.mjs depuis supabase/contenu/prompts-design-chatgpt.mjs.
-- NE PAS MODIFIER A LA MAIN : modifier le fichier source puis relancer le script.
--
-- Prompts Claude Design (gratuit) et Codex / ChatGPT (payant) de la bibliotheque, espace '${ESPACE}'.
-- A appliquer APRES la migration 0051 (colonne acces, nouvelles categories, regle de lecture).
-- Relancable sans doublon : un prompt de meme espace, meme categorie et meme titre n'est pas reinsere.
-- Si le texte d'un prompt est corrige dans le fichier source, la ligne existante n'est PAS mise a jour par cette
-- migration : la supprimer d'abord, ou ecrire une nouvelle migration.

${lignes.join("\n")}`;
}

export function construireApercu() {
  const parAcces = { gratuite: {}, payante: {} };
  for (const p of avecOrdre()) (parAcces[p.acces][p.categorie] ??= []).push(p);
  const bloc = (titre, sousTitre, groupes) =>
    `## ${titre}\n\n${sousTitre}\n\n` +
    Object.entries(groupes)
      .map(
        ([cat, liste]) =>
          `### ${LIBELLES[cat]} (${liste.length})\n\n` +
          liste.map((p) => `#### ${p.ordre}. ${p.titre}\n\n\`\`\`text\n${lf(p.contenu)}\n\`\`\`\n`).join("\n"),
      )
      .join("\n");
  const total = PROMPTS.length;
  return `# Aperçu des prompts ajoutés : Claude Design et Codex / ChatGPT

> Fichier GÉNÉRÉ depuis \`supabase/contenu/prompts-design-chatgpt.mjs\`. Pour corriger un prompt, modifier la source puis relancer \`node scripts/generer-prompts-design-chatgpt.mjs\`.
> Total : ${total} prompts (${Object.values(parAcces.gratuite).flat().length} gratuits, ${Object.values(parAcces.payante).flat().length} payants).

${bloc("Communauté gratuite : Claude Design", "Visibles par tous les membres, gratuits et payants.", parAcces.gratuite)}
${bloc("Communauté payante : Codex et ChatGPT", "Visibles seulement par les élèves avec un accès payant actif.", parAcces.payante)}`;
}

const racine = fileURLToPath(new URL("..", import.meta.url));
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeFileSync(`${racine}supabase/migrations/0052_prompts_design_chatgpt.sql`, construireSql());
  writeFileSync(`${racine}supabase/contenu/CONTENU-PROMPTS.md`, construireApercu());
  console.log(`Genere : ${PROMPTS.length} prompts -> migrations/0052_prompts_design_chatgpt.sql et contenu/CONTENU-PROMPTS.md`);
}
