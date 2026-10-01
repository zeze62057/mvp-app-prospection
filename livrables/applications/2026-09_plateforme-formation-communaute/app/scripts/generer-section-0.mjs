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

// ---- Migration 0055 : « Présentation du formateur » et « Installation des outils » ----------------
// Ordre voulu avant le Module 1 : Bienvenue, Présentation du formateur, Installation des outils.
// « Bienvenue » (ordre 0 depuis 0054) passe à -2, la présentation prend -1, l'installation prend 0.
// Les pages trient par ordre : les valeurs négatives s'affichent avant 1. Appliquer 0054 avant 0055.
export const SOURCE_FORMATEUR = path.join(RACINE, "supabase", "contenu", "section-0", "formateur.md");
export const SOURCE_OUTILS = path.join(RACINE, "supabase", "contenu", "section-0", "outils.md");
export const FICHIER_MIGRATION_0055 = path.join(RACINE, "supabase", "migrations", "0055_section_0_formateur_outils.sql");
export const TITRE_FORMATEUR = "Présentation du formateur";
export const TITRE_OUTILS = "Installation des outils";

export function lireFormateur() {
  return fs.readFileSync(SOURCE_FORMATEUR, "utf8").replace(/\r\n/g, "\n").trim();
}
export function lireOutils() {
  return fs.readFileSync(SOURCE_OUTILS, "utf8").replace(/\r\n/g, "\n").trim();
}

function insertion(ordre, titre, contenu, delim) {
  if (contenu.includes(`$${delim}$`)) throw new Error(`Le contenu de « ${titre} » contient le délimiteur $${delim}$.`);
  return `insert into sections (module_id, ordre, titre, contenu)
select m.id, ${ordre}, '${titre}', $${delim}$${contenu}$${delim}$
from modules m
join espaces e on e.id = m.espace_id
where e.slug = 'vivier-ia' and m.ordre = 1
on conflict (module_id, ordre) do nothing;
`;
}

export function construireSql0055(formateur, outils) {
  return `-- Début de formation : « ${TITRE_FORMATEUR} » et « ${TITRE_OUTILS} », avant le Module 1 de Vivier IA.
-- GENERE par scripts/generer-section-0.mjs depuis supabase/contenu/section-0/ : ne pas modifier à la main.
--
-- Ordre final : Bienvenue (-2), ${TITRE_FORMATEUR} (-1), ${TITRE_OUTILS} (0), puis les sections 1 à 7.
-- Additif et idempotent : « Bienvenue » est déplacée une seule fois, chaque nouvelle section n'est créée que
-- si sa place est libre, aucune section de contenu existante n'est modifiée. Appliquer 0054 avant celle-ci.

update sections set ordre = -2
where ordre = 0 and titre = 'Bienvenue'
  and module_id = (select m.id from modules m join espaces e on e.id = m.espace_id where e.slug = 'vivier-ia' and m.ordre = 1);

${insertion(-1, TITRE_FORMATEUR, formateur, "f")}
${insertion(0, TITRE_OUTILS, outils, "o")}`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(FICHIER_MIGRATION, construireSql(lireContenu()), "utf8");
  fs.writeFileSync(FICHIER_MIGRATION_0055, construireSql0055(lireFormateur(), lireOutils()), "utf8");
  console.log(`Migrations écrites : ${path.relative(RACINE, FICHIER_MIGRATION)}, ${path.relative(RACINE, FICHIER_MIGRATION_0055)}`);
}
