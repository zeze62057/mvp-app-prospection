// Charge le texte des lecons du programme marketing de reseau dans
// sections.contenu (espace Batisseur Pro, modules 2 a 9).
//
// Usage :
//   node scripts/charger-lecons.mjs                    essai a blanc : rapport, AUCUNE ecriture en base
//   node scripts/charger-lecons.mjs --sortie <dossier>  idem, et ecrit chaque lecon nettoyee dans <dossier>
//   node scripts/charger-lecons.mjs --ecrire            ecrit en base (refuse si un motif interdit subsiste)
//
// Source : livrables/formations/marketing-reseau/2026-09_programme-marketing-reseau/
// Ces textes ont ete rediges pour le workspace de Zeze : ils citent des outils
// internes, des fichiers, une marque (Longrich) et des corriges reserves a
// l'enseignant. Ce script les nettoie AVANT publication et refuse d'ecrire si
// un motif interdit subsiste. Relancable sans risque (met a jour, n'ajoute pas).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { Client } from "pg";

const args = process.argv.slice(2);
const ECRIRE = args.includes("--ecrire");
const iSortie = args.indexOf("--sortie");
const SORTIE = iSortie !== -1 ? args[iSortie + 1] : null;
const ESPACE = "batisseur-pro";

const DOSSIER = fileURLToPath(
  new URL("../../../../formations/marketing-reseau/2026-09_programme-marketing-reseau/", import.meta.url)
);

// Partie du programme -> fichiers -> ordre du module dans la plateforme.
const PARTIES = [
  { partie: 1, module: 2, fichier: "01-partie-1-bases-du-succes.md", exemples: "01-partie-1-exemples-pratiques.md" },
  { partie: 2, module: 3, fichier: "02-partie-2-developper-equipe.md", exemples: "02-partie-2-exemples-pratiques.md" },
  { partie: 3, module: 4, fichier: "03-partie-3-theorie-a-la-pratique.md" },
  { partie: 4, module: 5, fichier: "04-partie-4-leadership-pratique.md" },
  { partie: 5, module: 6, fichier: "05-partie-5-guider-faire-grandir.md" },
  { partie: 6, module: 7, fichier: "06-partie-6-communication-leader.md" },
  { partie: 7, module: 8, fichier: "07-partie-7-leadership-croissance.md" },
  { partie: 8, module: 9, fichier: "08-partie-8-leadership-haut-niveau.md" },
];

// Titres des 4 sections du Module 1 (module croise IA x marketing de reseau),
// utilises pour reecrire les renvois "module croise, section N".
const SECTIONS_MODULE_1 = {
  1: "Pourquoi croiser IA et marketing de réseau",
  2: "L'IA pour prospecter, parrainer et closer",
  3: "L'IA pour coacher et faire grandir son équipe",
  4: "L'IA pour la communication de leader",
};

// Reecritures ciblees (texte exact -> remplacement). Appliquees avant la regle generale.
const REECRITURES = [
  {
    id: "R1",
    avant: "avec un exemple concret déjà construit dans ce workspace : l'outil de suivi formation Longrich, qui donne au leader",
    apres: "avec l'exemple d'un outil de suivi simple, qui donne au leader",
  },
  {
    id: "R2",
    avant: "avec l'exemple de l'agent LinkedIn déjà construit dans ce workspace, qui fait de la veille et prépare",
    apres: "avec l'exemple d'un assistant IA qui fait de la veille et prépare",
  },
  {
    id: "R3",
    avant: `de l'outil de suivi formation Longrich (module croisé, section 3, chapitre 1) est un exemple concret`,
    apres: `d'un outil de suivi de formation (Module 1, « ${SECTIONS_MODULE_1[3]} ») est un exemple concret`,
  },
  {
    id: "R4",
    avant: "un outil de suivi structuré (comme celui construit pour la formation Longrich) donne",
    apres: "un outil de suivi structuré donne",
  },
  { id: "R5", avant: "Chez Longrich, je suis payée sur des ventes", apres: "Dans mon entreprise, je suis payée sur des ventes" },
  { id: "R6", avant: "pour ta propre activité Longrich, que dirais-tu", apres: "pour ta propre activité, que dirais-tu" },
];

// Regle generale : "module croise, section N, chapitre M (\"Titre\")" -> renvoi au Module 1.
const RE_MODULE_CROISE = /module croisé, section (\d), chapitre (\d+)(?: \("([^"]+)"\))?/gi;

// Motifs qui ne doivent JAMAIS rester dans un texte publie sur cet espace.
const INTERDITS = [
  [/longrich/i, "marque Longrich"],
  [/workspace/i, "reference au workspace"],
  [/livrables\//i, "chemin de fichier"],
  [/z[eé]z[eé]/i, "reference a Zeze"],
  [/entrepreneur acad/i, "ancien nom de l'ecole"],
  [/module crois/i, "renvoi interne au module croise"],
  [/\bskills?\b/i, "reference a un skill"],
  [/\.md\b/i, "nom de fichier"],
  [/fiche pratique associ/i, "renvoi a une fiche"],
  [/compagnon de/i, "renvoi a un fichier compagnon"],
  [/chatllow/i, "autre marque du workspace"],
  [/\bkora\b/i, "autre outil du workspace"],
  [/claude code/i, "reference a Claude Code"],
  [/r[eé]serv[eé] à l'enseignant/i, "corrige reserve a l'enseignant"],
  [/[eé]l[eé]ments de correction/i, "corrige reserve a l'enseignant"],
];

const lire = (f) => readFileSync(join(DOSSIER, f), "utf8").replace(/\r\n/g, "\n");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
const jaccard = (a, b) => {
  const A = new Set(norm(a).split(/\s+/).filter((w) => w.length > 2));
  const B = new Set(norm(b).split(/\s+/).filter((w) => w.length > 2));
  const inter = [...A].filter((w) => B.has(w)).length;
  return inter / (new Set([...A, ...B]).size || 1);
};

// Decoupe un fichier en blocs "## Chapitre X.Y ..." ; un bloc s'arrete au prochain "## " de tout type.
function decouper(texte, re) {
  const blocs = [];
  let cur = null;
  for (const l of texte.split("\n")) {
    if (l.startsWith("## ")) {
      const m = l.match(re);
      cur = m ? { partie: +m[1], num: +m[2], titre: m[3].trim(), lignes: [] } : { autre: l.slice(3).trim(), lignes: [] };
      blocs.push(cur);
    } else if (cur) cur.lignes.push(l);
  }
  return blocs;
}
const RE_CHAPITRE = /^## Chapitre (\d+)\.(\d+)\s*[:—–-]\s*(.+)$/;
const RE_EXEMPLE = /^## Chapitre (\d+)\.(\d+)\s*[—–-]\s*(.+)$/;

const corps = (lignes) => lignes.join("\n").replace(/^\s+|\s+$/g, "").replace(/\n-{3,}\s*$/, "").trim();
const changements = [];

function nettoyer(texte, etiquette) {
  let t = texte;
  for (const r of REECRITURES) {
    if (t.includes(r.avant)) {
      t = t.replace(r.avant, r.apres);
      changements.push({ id: r.id, ou: etiquette, avant: r.avant, apres: r.apres });
    }
  }
  t = t.replace(RE_MODULE_CROISE, (m, sec, _chap, titreChap) => {
    const apres = `Module 1, « ${SECTIONS_MODULE_1[sec] ?? "?"} »` + (titreChap ? ` (« ${titreChap} »)` : "");
    changements.push({ id: "G", ou: etiquette, avant: m, apres });
    return apres;
  });
  return t;
}

// 1. Lecture et assemblage des lecons
const lecons = []; // { partie, module, num, titre, texte }
for (const P of PARTIES) {
  const blocs = decouper(lire(P.fichier), RE_CHAPITRE);
  const chapitres = blocs.filter((b) => b.num);
  const questions = blocs.find((b) => b.autre === "Questions pour les apprenants");
  const exemples = P.exemples ? decouper(lire(P.exemples), RE_EXEMPLE) : [];
  const exercice = exemples.find((b) => b.autre && b.autre.startsWith("Exercice pour l'apprenant"));

  chapitres.forEach((c, i) => {
    let t = corps(c.lignes);
    const ex = exemples.find((e) => e.num === c.num && e.partie === c.partie);
    if (ex) t += `\n\n## ${ex.titre}\n\n${corps(ex.lignes)}`;
    if (i === chapitres.length - 1) {
      if (exercice) t += `\n\n## ${exercice.autre}\n\n${corps(exercice.lignes)}`;
      if (questions) {
        const brut = questions.lignes.join("\n");
        const coupe = brut.split(/\n### Éléments de correction[^\n]*/)[0]; // exclut le corrige enseignant
        t += `\n\n## Questions pour les apprenants\n\n${corps(coupe.split("\n"))}`;
      }
    }
    lecons.push({ partie: P.partie, module: P.module, num: c.num, titre: c.titre, texte: nettoyer(t, `${c.partie}.${c.num}`) });
  });
}

// 2. Controles de contenu
const violations = [];
for (const l of lecons) for (const [re, nom] of INTERDITS) if (re.test(l.texte)) violations.push(`${l.partie}.${l.num} : ${nom} -> "${(l.texte.match(re) || [""])[0]}"`);

// 3. Correspondance avec les sections en base (lecture seule)
const env = {};
readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n").forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
});
const client = new Client({
  host: "aws-0-eu-central-1.pooler.supabase.com",
  port: 5432,
  user: "postgres.uomcecactzqfxdhsfyey",
  password: env.SUPABASE_DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
});
await client.connect();
let code = 0;
try {
  const colonne = await client.query("select 1 from information_schema.columns where table_name='sections' and column_name='contenu'");
  const { rows } = await client.query(
    `select m.ordre as mo, s.id, s.ordre as so, s.titre from sections s
       join modules m on m.id = s.module_id join espaces e on e.id = m.espace_id
      where e.slug = $1 order by m.ordre, s.ordre`,
    [ESPACE]
  );
  const problemes = [];
  const cibles = []; // { id, texte }
  const ecartsTitre = [];
  for (const P of PARTIES) {
    const db = rows.filter((r) => r.mo === P.module);
    const ls = lecons.filter((l) => l.partie === P.partie).sort((a, b) => a.num - b.num);
    if (db.length !== ls.length) problemes.push(`module ${P.module} : ${db.length} sections en base, ${ls.length} chapitres dans le programme`);
    ls.forEach((l, i) => {
      if (l.num !== i + 1) problemes.push(`partie ${P.partie} : numerotation irreguliere au chapitre ${l.num}`);
      const s = db[i];
      if (!s) return;
      const sim = jaccard(l.titre, s.titre);
      if (sim < 0.34) ecartsTitre.push(`${l.partie}.${l.num} programme « ${l.titre} »  <>  base « ${s.titre} » (${sim.toFixed(2)})`);
      cibles.push({ id: s.id, texte: l.texte, cle: `${l.partie}.${l.num}` });
    });
  }

  const mots = lecons.reduce((n, l) => n + l.texte.split(/\s+/).length, 0);
  console.log("=== RAPPORT ===");
  console.log(`Colonne sections.contenu presente : ${colonne.rowCount ? "oui" : "NON (appliquer la migration 0023)"}`);
  console.log(`Lecons construites : ${lecons.length} (attendu 50) | mots : ${mots}`);
  console.log(`Sections ciblees en base (modules 2 a 9) : ${cibles.length}`);
  console.log(`Problemes de correspondance : ${problemes.length ? "\n  - " + problemes.join("\n  - ") : "aucun"}`);
  console.log(`Ecarts de titre entre programme et base (a verifier a l'oeil) : ${ecartsTitre.length ? "\n  - " + ecartsTitre.join("\n  - ") : "aucun"}`);
  console.log(`\nChangements de texte appliques : ${changements.length}`);
  for (const c of changements) console.log(`  [${c.id}] ${c.ou}\n     avant : ${c.avant.slice(0, 200)}\n     apres : ${c.apres.slice(0, 200)}`);
  console.log(`\nMotifs interdits restants : ${violations.length ? "\n  - " + violations.join("\n  - ") : "aucun"}`);

  if (SORTIE) {
    mkdirSync(SORTIE, { recursive: true });
    for (const l of lecons) writeFileSync(join(SORTIE, `module${l.module}-${l.partie}.${String(l.num).padStart(2, "0")}.md`), `# ${l.titre}\n\n${l.texte}\n`);
    console.log(`\nLecons nettoyees ecrites dans : ${SORTIE}`);
  }

  const bloquant = problemes.length > 0 || violations.length > 0 || lecons.length !== 50 || cibles.length !== 50;
  if (!ECRIRE) {
    console.log(`\nESSAI A BLANC : aucune ecriture en base.${bloquant ? " (des problemes sont a corriger avant --ecrire)" : ""}`);
  } else if (bloquant || !colonne.rowCount) {
    console.log("\nECRITURE REFUSEE : corriger les problemes ci-dessus d'abord.");
    code = 1;
  } else {
    await client.query("begin");
    for (const c of cibles) await client.query("update sections set contenu = $1 where id = $2", [c.texte, c.id]);
    await client.query("commit");
    const v = await client.query("select count(*) from sections s join modules m on m.id=s.module_id join espaces e on e.id=m.espace_id where e.slug=$1 and s.a_contenu", [ESPACE]);
    console.log(`\nECRIT : ${cibles.length} sections mises a jour. Sections avec contenu en base pour ${ESPACE} : ${v.rows[0].count}`);
  }
} catch (err) {
  console.error("Echec :", err.message);
  try { await client.query("rollback"); } catch {}
  code = 1;
} finally {
  await client.end();
}
process.exit(code);
