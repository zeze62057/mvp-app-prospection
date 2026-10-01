// Génère la migration qui ajoute la section 0 « Bienvenue » au Module 1 de Vivier IA.
// Source unique : supabase/contenu/section-0/bienvenue.md (déjà nettoyée pour les élèves : sans note
// d'auteur, sans corrigé enseignant, sans chemin interne, avec ses blocs « À faire maintenant »).
//
//   node scripts/generer-section-0.mjs
//
// La migration est additive et idempotente : elle crée la section d'ordre 0 si elle n'existe pas,
// et ne touche jamais à une section existante.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SOURCE = path.join(RACINE, "supabase", "contenu", "section-0", "bienvenue.md");
export const FICHIER_MIGRATION = path.join(RACINE, "supabase", "migrations", "0054_section_0_bienvenue.sql");
export const TITRE = "Bienvenue";

export function lireContenu() {
  return fs.readFileSync(SOURCE, "utf8").replace(/\r\n/g, "\n").trim();
}

export function construireSql(contenu) {
  if (contenu.includes("$c$")) throw new Error("Le contenu contient le délimiteur $c$.");
  return `-- Section 0 « ${TITRE} » du Module 1 de Vivier IA : présentation de la formation, comment bien la suivre,
-- installation de l'assistant personnel avec le Kit Startup.
-- GENERE par scripts/generer-section-0.mjs depuis supabase/contenu/section-0/bienvenue.md : ne pas modifier à la main.
--
-- Additif et idempotent : la section d'ordre 0 est créée si elle n'existe pas, jamais modifiée si elle existe.
-- L'ordre 0 la place avant les sections 1 à 7 (les pages trient par ordre). Aucune autre ligne n'est touchée.

insert into sections (module_id, ordre, titre, contenu)
select m.id, 0, '${TITRE}', $c$${contenu}$c$
from modules m
join espaces e on e.id = m.espace_id
where e.slug = 'vivier-ia' and m.ordre = 1
on conflict (module_id, ordre) do nothing;
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(FICHIER_MIGRATION, construireSql(lireContenu()), "utf8");
  console.log(`Migration écrite : ${path.relative(RACINE, FICHIER_MIGRATION)}`);
}
