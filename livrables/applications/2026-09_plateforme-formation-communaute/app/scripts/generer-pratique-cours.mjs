// Génère la migration qui ajoute, à la fin de chaque chapitre concerné, un bloc « À faire maintenant »
// (prompts et commandes à copier). Source unique : les fichiers Markdown de supabase/contenu/pratique/.
//
//   node scripts/generer-pratique-cours.mjs
//
// Format d'un fichier source :
//   @@ SECTION <uuid de la section>  Titre indicatif
//   @@ CHAPITRE <numéro>
//   ### À faire maintenant : titre du bloc      <- cette ligne sert de repère (jamais deux fois le même)
//   ...texte et blocs de code (```prompt, ```bash, ```powershell, ```markdown, ```json)...
//
// Chaque bloc est inséré juste avant le chapitre suivant (ou avant « Questions pour les apprenants »).
// La migration est idempotente : un bloc déjà présent n'est jamais ajouté deux fois, et rien n'est
// modifié si le repère de chapitre est absent ou ambigu.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DOSSIER_SOURCES = path.join(RACINE, "supabase", "contenu", "pratique");
export const FICHIER_MIGRATION = path.join(RACINE, "supabase", "migrations", "0053_pratique_cours_vivier_ia.sql");

const RE_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

// Lit un fichier source et renvoie [{ section, chapitre, texte }].
export function lireSource(contenu) {
  const blocs = [];
  let section = null;
  let chapitre = null;
  let genre = "Chapitre";
  let lignes = [];
  const clore = () => {
    if (section && chapitre !== null) blocs.push({ section, chapitre, genre, texte: lignes.join("\n").trim() });
    lignes = [];
  };
  for (const ligne of contenu.replace(/\r\n/g, "\n").split("\n")) {
    const s = /^@@ SECTION (\S+)/.exec(ligne);
    // « ATELIER » pour les sections dont les parties s'appellent « Atelier N » au lieu de « Chapitre N ».
    const c = /^@@ (CHAPITRE|ATELIER) (\d+)\s*$/.exec(ligne);
    if (s) {
      clore();
      section = s[1];
      chapitre = null;
    } else if (c) {
      clore();
      chapitre = Number(c[2]);
      genre = c[1] === "ATELIER" ? "Atelier" : "Chapitre";
    } else if (chapitre !== null) {
      lignes.push(ligne);
    }
  }
  clore();
  return blocs;
}

export function reperDuBloc(texte) {
  const premiere = texte.split("\n")[0];
  return /^### À faire maintenant : .+/.test(premiere) ? premiere : null;
}

// Fin du chapitre N : le chapitre N+1 s'il existe, sinon « Questions pour les apprenants ».
// Le repère « chapitre suivant » est complété par la base : on teste les deux, un seul doit exister.
export function reperSuivant(chapitre, genre = "Chapitre") {
  return `\n\n---\n\n## ${genre} ${chapitre + 1} :`;
}
export const REPER_QUESTIONS = "\n\n---\n\n## Questions pour les apprenants";

// Écrit un repère multi-lignes avec chr(10) au lieu de vrais retours à la ligne. L'éditeur SQL de Supabase
// convertit les retours à la ligne d'un texte collé en CRLF : un repère écrit avec de vrais retours ne
// correspondrait plus au contenu stocké (LF) et rien ne serait ajouté, sans erreur. Avec chr(10), le repère
// est identique quelle que soit la façon dont le fichier est collé.
export function sqlAncre(texte) {
  if (texte.includes("'") || texte.includes("\r")) throw new Error(`Repère non sûr : ${texte}`);
  return texte
    .split("\n")
    .map((p) => `'${p}'`)
    .join(" || chr(10) || ")
    .replace(/^'' \|\| /, "")
    .replace(/'' \|\| chr\(10\) \|\| /g, "chr(10) || ");
}

export function construireSql(blocs) {
  const out = [];
  out.push(`-- Blocs « À faire maintenant » dans les chapitres de Vivier IA : prompts et commandes à copier.
-- GENERE par scripts/generer-pratique-cours.mjs depuis supabase/contenu/pratique/ : ne pas modifier à la main.
--
-- Ajoute du contenu à la fin de chaque chapitre concerné, sans rien retirer. Idempotent : un bloc déjà présent
-- n'est pas ajouté une seconde fois, et rien ne change si le repère de chapitre est absent ou ambigu.
-- Les blocs de code sont affichés en cartes avec bouton Copier par la page de leçon.
-- Insensible au collage dans l'éditeur SQL de Supabase (qui convertit les retours à la ligne en CRLF) :
-- les repères utilisent chr(10) et les retours chariot (chr(13)) sont retirés du texte inséré.

-- Nettoyage : les sections d'accueil collées plus tôt dans l'éditeur SQL contiennent des retours chariot parasites.
update sections set contenu = replace(contenu, chr(13), '')
where contenu like '%' || chr(13) || '%'
  and module_id = (select m.id from modules m join espaces e on e.id = m.espace_id where e.slug = 'vivier-ia' and m.ordre = 1);
`);
  for (const b of blocs) {
    const repere = reperDuBloc(b.texte);
    out.push(`-- Section ${b.section}, chapitre ${b.chapitre}
do $m$
declare
  v_bloc text := replace($b$${b.texte}$b$, chr(13), '');
  v_repere text := replace($r$${repere}$r$, chr(13), '');
  v_fin_chapitre text := ${sqlAncre(reperSuivant(b.chapitre, b.genre))};
  v_fin_dernier text := ${sqlAncre(REPER_QUESTIONS)};
  v_contenu text;
  v_fin text;
begin
  select contenu into v_contenu from sections where id = '${b.section}';
  if v_contenu is null or position(v_repere in v_contenu) > 0 then return; end if;
  -- Le chapitre suivant, sinon les questions de fin de section. Un seul repère doit exister, une seule fois.
  if (length(v_contenu) - length(replace(v_contenu, v_fin_chapitre, ''))) = length(v_fin_chapitre) then
    v_fin := v_fin_chapitre;
  elsif (length(v_contenu) - length(replace(v_contenu, v_fin_dernier, ''))) = length(v_fin_dernier)
        and position(${"$"}c${"$"}## ${b.genre} ${b.chapitre + 1} :${"$"}c${"$"} in v_contenu) = 0 then
    v_fin := v_fin_dernier;
  else
    raise notice 'Repère introuvable ou ambigu : section ${b.section}, chapitre ${b.chapitre}. Rien modifié.';
    return;
  end if;
  update sections set contenu = replace(contenu, v_fin, E'\\n\\n' || v_bloc || v_fin) where id = '${b.section}';
end
$m$;
`);
  }
  return out.join("\n");
}

export function lireToutesLesSources() {
  const fichiers = fs.readdirSync(DOSSIER_SOURCES).filter((f) => f.endsWith(".md")).sort();
  return fichiers.flatMap((f) => lireSource(fs.readFileSync(path.join(DOSSIER_SOURCES, f), "utf8")).map((b) => ({ ...b, fichier: f })));
}

export { RE_UUID };

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const blocs = lireToutesLesSources();
  fs.writeFileSync(FICHIER_MIGRATION, construireSql(blocs), "utf8");
  console.log(`${blocs.length} blocs écrits dans ${path.relative(RACINE, FICHIER_MIGRATION)}`);
}
