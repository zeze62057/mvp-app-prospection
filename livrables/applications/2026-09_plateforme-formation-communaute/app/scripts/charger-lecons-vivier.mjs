// Charge le texte des lecons des modules 1 a 5 de Vivier IA dans sections.contenu
// (espace vivier-ia). Cree les sections manquantes des modules 2 a 5.
//
// Usage :
//   node scripts/charger-lecons-vivier.mjs                          essai a blanc : rapport, AUCUNE ecriture en base
//   node scripts/charger-lecons-vivier.mjs --rapport <fichier>      idem, et ecrit toutes les occurrences a traiter dans <fichier>
//   node scripts/charger-lecons-vivier.mjs --sortie <dossier>       idem, et ecrit chaque lecon nettoyee dans <dossier>
//   node scripts/charger-lecons-vivier.mjs --ecrire                 ecrit en base (refuse si un motif a traiter subsiste)
//
// Source : livrables/formations/ecosysteme-ia/
//
// Difference avec charger-lecons.mjs (Batisseur Pro) : ces cours enseignent
// Claude Code. CLAUDE.md, les skills, les fichiers .md et "Claude Code" sont donc
// du contenu de cours legitime, pas des fuites internes. Seules les references au
// workspace de Zeze (ses marques, ses fichiers, ses notes d'auteur) sont a traiter.
//
// Etape 1 (ce fichier, tel quel) : aucun remplacement automatique de texte, sauf
// la structure (titre H1 retire, corriges enseignant coupes). Le rapport liste
// chaque occurrence a traiter pour relecture. Les regles de remplacement
// (REECRITURES) se remplissent apres validation, puis --ecrire devient possible.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { Client } from "pg";

const args = process.argv.slice(2);
const ECRIRE = args.includes("--ecrire");
const val = (nom) => (args.includes(nom) ? args[args.indexOf(nom) + 1] : null);
const SORTIE = val("--sortie");
const RAPPORT = val("--rapport");
const ESPACE = "vivier-ia";

const RACINE = fileURLToPath(new URL("../../../../formations/ecosysteme-ia/", import.meta.url));

const MODULES = [
  { module: 1, dossier: "2026-09_vivier-ia-module-1", fichiers: ["01-fondations", "02-methode", "03-maitriser-loutil", "04-quotidien", "05-fullstack-fil-rouge", "06-business", "07-hacks-bonus"] },
  { module: 2, dossier: "2026-09_vivier-ia-module-2-n8n", fichiers: ["01-decouvrir-n8n", "02-n8n-avance", "03-ia-agents-n8n", "04-agent-ia-complet", "05-deploiement-observabilite", "06-projet-complet", "07-hacks-astuces"] },
  { module: 3, dossier: "2026-09_vivier-ia-module-3-mindset-business-ia", fichiers: ["01-mindset-early-adopter", "02-opportunite-ia", "03-fondations", "04-prompt-engineering", "05-choisir-son-chemin", "06-developper-competences", "07-premier-projet-ia", "08-acquisition-client", "09-solutions-ia"] },
  { module: 4, dossier: "2026-09_vivier-ia-module-4-rgpd-ai-act", fichiers: ["01-le-cadre", "02-travailler-en-securite", "03-deployer-sans-barrieres", "04-ateliers-pratiques"] },
  { module: 5, dossier: "2026-09_vivier-ia-module-5-lemlist-prospection", fichiers: ["01-mise-en-place-warmup", "02-premieres-campagnes", "03-avance-copywriting", "04-aller-plus-loin"] },
];
const ATTENDU = MODULES.reduce((n, m) => n + m.fichiers.length, 0); // 31

// Reecritures : voir reecritures-vivier.mjs (regles validees par Zeze).
import { REECRITURES } from "./reecritures-vivier.mjs";

// Motifs a traiter avant publication. Chacun doit etre reecrit (REECRITURES) ou
// explicitement accepte (ACCEPTES) apres relecture. --ecrire refuse tant qu'un
// motif non accepte subsiste. Ne sont PAS des motifs : CLAUDE.md, .claude/, skills,
// slash commands, "Claude Code" (contenu de cours legitime).
const A_TRAITER = [
  ["longrich", /longrich/i, "marque Longrich"],
  ["workspace", /workspace/i, "reference au workspace"],
  ["chemin", /livrables\/|context\/|module-installs|2026-09_/i, "chemin de fichier du workspace"],
  ["ancien-nom", /entrepreneur acad/i, "ancien nom de l'ecole"],
  ["zeze", /z[eé]z[eé]/i, "reference a Zeze"],
  ["chatllow", /chatllow/i, "marque Chatllow"],
  ["kora", /\bkora\b/i, "outil Kora"],
  ["enseignant", /enseignant/i, "mention de l'enseignant"],
  ["corrige", /[eé]l[eé]ments de correction|corrig[eé]s? (?:de |type|reserv|réserv)/i, "corrige"],
  ["compagnon", /compagnon de|fiche pratique|-prompts\.md/i, "renvoi a un fichier compagnon"],
  ["note-auteur", /r[eé]dig[eé] par claude|pas encore test[eé]|contenu de cours original|au moment de la r[eé]daction|ce module a [eé]t[eé] r[eé]dig/i, "note d'auteur"],
  ["travail-interne", /construit r[eé]cemment|mis en place r[eé]cemment|dans ce parcours|notre workspace|nos livrables|\bchariow\b/i, "reference a un travail interne"],
];
// Motifs relus et acceptes tels quels (id -> true). A remplir apres validation.
const ACCEPTES = {};

const lire = (dossier, f) => readFileSync(join(RACINE, dossier, f + ".md"), "utf8").replace(/\r\n/g, "\n");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
const jaccard = (a, b) => {
  const A = new Set(norm(a).split(/\s+/).filter((w) => w.length > 2));
  const B = new Set(norm(b).split(/\s+/).filter((w) => w.length > 2));
  return [...A].filter((w) => B.has(w)).length / (new Set([...A, ...B]).size || 1);
};

// Titre : "# Section 3 — 🛡️ Le Cadre" -> "Le Cadre" (emoji et prefixe retires).
const RE_H1 = /^# Section (\d+)\s*[—–:-]\s*(.+)$/;
const sansEmoji = (s) => s.replace(/^[^\p{L}\p{N}]+/u, "").trim();

// Retire le H1 et coupe les blocs de corrige enseignant (jusqu'au prochain titre de niveau 1 ou 2).
function extraire(texte, cle) {
  const lignes = texte.split("\n");
  const h1 = lignes.findIndex((l) => l.startsWith("# "));
  const m = h1 >= 0 ? lignes[h1].match(RE_H1) : null;
  if (!m) throw new Error(`${cle} : titre "# Section N — ..." introuvable`);
  const titre = sansEmoji(m[2]);
  const gardees = [];
  let coupe = false;
  let nbCorriges = 0;
  for (const l of lignes.slice(h1 + 1)) {
    if (/^#{2,4}\s*[ÉE]l[ée]ments de correction/i.test(l)) { coupe = true; nbCorriges++; continue; }
    if (coupe && /^#{1,2}\s/.test(l)) coupe = false;
    if (!coupe) gardees.push(l);
  }
  const corps = gardees.join("\n").replace(/^\s+/, "").replace(/(\n\s*-{3,}\s*)+$/g, "").trim();
  return { titre, corps, nbCorriges };
}

// 1. Lecture et assemblage
const lecons = []; // { module, ordre, cle, titre, texte, nbCorriges }
for (const M of MODULES) {
  M.fichiers.forEach((f, i) => {
    const cle = `M${M.module}.${i + 1}`;
    const { titre, corps, nbCorriges } = extraire(lire(M.dossier, f), cle);
    lecons.push({ module: M.module, ordre: i + 1, cle, titre, texte: corps, nbCorriges });
  });
}

// Applique les reecritures. Une regle peut etre un texte exact ou un motif ; chaque
// application est journalisee (avant/apres) et une regle qui ne trouve rien est signalee.
const changements = [];
const appliquees = new Set();
for (const l of lecons) {
  for (const r of REECRITURES) {
    const re = r.avant instanceof RegExp ? new RegExp(r.avant.source, r.avant.flags.includes("g") ? r.avant.flags : r.avant.flags + "g") : null;
    if (re) {
      l.texte = l.texte.replace(re, (m) => {
        appliquees.add(r.id);
        changements.push({ id: r.id, ou: l.cle, avant: m, apres: r.apres });
        return r.apres;
      });
    } else if (l.texte.includes(r.avant)) {
      const nb = l.texte.split(r.avant).length - 1;
      l.texte = l.texte.split(r.avant).join(r.apres);
      appliquees.add(r.id);
      for (let k = 0; k < nb; k++) changements.push({ id: r.id, ou: l.cle, avant: r.avant, apres: r.apres });
    }
  }
}
const reglesSansEffet = REECRITURES.filter((r) => !appliquees.has(r.id)).map((r) => r.id);

// 2. Occurrences a traiter
const occurrences = []; // { id, nom, cle, ligne, extrait }
for (const l of lecons) {
  l.texte.split("\n").forEach((ligne, i) => {
    for (const [id, re, nom] of A_TRAITER) {
      const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
      let m;
      while ((m = g.exec(ligne))) {
        const a = Math.max(0, m.index - 70);
        occurrences.push({ id, nom, cle: l.cle, ligne: i + 1, extrait: ligne.slice(a, m.index + m[0].length + 70).trim() });
      }
    }
  });
}
const bloquantes = occurrences.filter((o) => !ACCEPTES[o.id]);

// 3. Etat de la base (lecture seule)
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
  if (!ECRIRE) await client.query("set default_transaction_read_only = on");
  const colonne = await client.query("select 1 from information_schema.columns where table_name='sections' and column_name='contenu'");
  const mods = (await client.query(
    `select m.id, m.ordre, m.titre from modules m join espaces e on e.id = m.espace_id where e.slug = $1 order by m.ordre`, [ESPACE]
  )).rows;
  const secs = (await client.query(
    `select m.ordre as mo, s.id, s.ordre as so, s.titre, s.a_contenu from sections s
       join modules m on m.id = s.module_id join espaces e on e.id = m.espace_id
      where e.slug = $1 order by m.ordre, s.ordre`, [ESPACE]
  )).rows;

  const problemes = [];
  const ecartsTitre = [];
  let aCreer = 0;
  for (const M of MODULES) {
    if (!mods.find((m) => m.ordre === M.module)) problemes.push(`module ${M.module} absent de la base`);
    const db = secs.filter((s) => s.mo === M.module);
    if (db.length > M.fichiers.length) problemes.push(`module ${M.module} : ${db.length} sections en base, ${M.fichiers.length} fichiers`);
    aCreer += Math.max(0, M.fichiers.length - db.length);
    lecons.filter((l) => l.module === M.module).forEach((l, i) => {
      const s = db[i];
      if (s) {
        const sim = jaccard(l.titre, s.titre);
        if (sim < 0.34) ecartsTitre.push(`${l.cle} fichier « ${l.titre} »  <>  base « ${s.titre} » (${sim.toFixed(2)})`);
      }
    });
  }

  const mots = lecons.reduce((n, l) => n + l.texte.split(/\s+/).length, 0);
  console.log("=== RAPPORT ===");
  console.log(`Colonne sections.contenu presente : ${colonne.rowCount ? "oui" : "NON (appliquer la migration 0023)"}`);
  console.log(`Lecons construites : ${lecons.length} (attendu ${ATTENDU}) | mots : ${mots}`);
  console.log(`Sections deja en base : ${secs.length} | sections a creer : ${aCreer}`);
  console.log(`Blocs de corrige enseignant coupes : ${lecons.reduce((n, l) => n + l.nbCorriges, 0)}`);
  console.log(`Problemes de correspondance : ${problemes.length ? "\n  - " + problemes.join("\n  - ") : "aucun"}`);
  console.log(`Ecarts de titre (fichier vs base, a verifier a l'oeil) : ${ecartsTitre.length ? "\n  - " + ecartsTitre.join("\n  - ") : "aucun"}`);
  console.log(`\nReecritures : ${REECRITURES.length} regles, ${changements.length} remplacements appliques`);
  console.log(`Regles sans effet (texte introuvable, a corriger) : ${reglesSansEffet.length ? reglesSansEffet.join(", ") : "aucune"}`);

  console.log(`\nOccurrences a traiter : ${bloquantes.length} (acceptees : ${occurrences.length - bloquantes.length})`);
  for (const [id, , nom] of A_TRAITER) {
    const o = occurrences.filter((x) => x.id === id);
    if (!o.length) continue;
    const fichiers = new Set(o.map((x) => x.cle)).size;
    console.log(`  ${id.padEnd(12)} ${String(o.length).padStart(4)} occurrence(s) dans ${String(fichiers).padStart(2)} lecon(s)  (${nom})${ACCEPTES[id] ? " [accepte]" : ""}`);
  }

  if (RAPPORT) {
    const out = [`# Occurrences restantes a traiter (${bloquantes.length})`, ""];
    for (const [id, , nom] of A_TRAITER) {
      const o = occurrences.filter((x) => x.id === id);
      if (!o.length) continue;
      out.push(`## ${id} : ${nom} (${o.length})`, "");
      for (const x of o) out.push(`- ${x.cle} l.${x.ligne} : ${x.extrait}`);
      out.push("");
    }
    out.push(`# Journal des reecritures (${changements.length})`, "", "Chaque remplacement, pour relecture.", "");
    for (const c of changements) out.push(`### [${c.id}] ${c.ou}`, `- avant : ${c.avant}`, `- apres : ${c.apres}`, "");
    writeFileSync(RAPPORT, out.join("\n"));
    console.log(`\nRapport des occurrences ecrit dans : ${RAPPORT}`);
  }
  if (SORTIE) {
    mkdirSync(SORTIE, { recursive: true });
    for (const l of lecons) writeFileSync(join(SORTIE, `module${l.module}-${String(l.ordre).padStart(2, "0")}.md`), `# ${l.titre}\n\n${l.texte}\n`);
    console.log(`Lecons nettoyees ecrites dans : ${SORTIE}`);
  }

  const bloquant = problemes.length > 0 || bloquantes.length > 0 || reglesSansEffet.length > 0 || lecons.length !== ATTENDU || !colonne.rowCount;
  if (!ECRIRE) {
    console.log(`\nESSAI A BLANC : aucune ecriture en base.${bloquant ? " (des points sont a traiter avant --ecrire)" : ""}`);
  } else if (bloquant) {
    console.log("\nECRITURE REFUSEE : traiter les points ci-dessus d'abord.");
    code = 1;
  } else {
    await client.query("begin");
    for (const M of MODULES) {
      const mod = mods.find((m) => m.ordre === M.module);
      for (const l of lecons.filter((x) => x.module === M.module)) {
        // Cree la section si elle n'existe pas (ordre unique par module), sinon garde son titre.
        await client.query(
          `insert into sections (module_id, ordre, titre, contenu) values ($1, $2, $3, $4)
           on conflict (module_id, ordre) do update set contenu = excluded.contenu`,
          [mod.id, l.ordre, l.titre, l.texte]
        );
      }
    }
    await client.query("commit");
    const v = await client.query("select count(*) from sections s join modules m on m.id=s.module_id join espaces e on e.id=m.espace_id where e.slug=$1 and s.a_contenu", [ESPACE]);
    console.log(`\nECRIT : ${lecons.length} lecons. Sections avec contenu en base pour ${ESPACE} : ${v.rows[0].count}`);
  }
} catch (err) {
  console.error("Echec :", err.message);
  try { await client.query("rollback"); } catch {}
  code = 1;
} finally {
  await client.end();
}
process.exit(code);
