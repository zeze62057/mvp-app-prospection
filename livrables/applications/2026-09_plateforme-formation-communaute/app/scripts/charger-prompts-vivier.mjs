// Charge les prompts des fiches pratiques (fichiers *-prompts.md) des modules 1 et 2
// de Vivier IA dans la bibliotheque de prompts (table prompts, espace vivier-ia).
//
// Usage :
//   node scripts/charger-prompts-vivier.mjs                       essai a blanc : rapport, AUCUNE ecriture en base
//   node scripts/charger-prompts-vivier.mjs --rapport <fichier>   idem, et ecrit la liste complete + occurrences + doublons
//   node scripts/charger-prompts-vivier.mjs --ecrire              ecrit en base (refuse si un motif a traiter subsiste)
//
// Un prompt = un bloc de code des fiches. Les blocs precedes de "Instruction floue
// (a eviter)" sont des contre-exemples : ils ne sont pas charges. Le texte est
// "deplie" (les fiches sont coupees a ~70 caracteres par ligne). Meme regles de
// nettoyage que les lecons (reecritures-vivier.mjs) : les fiches partagent leurs exemples.
// Relancable sans risque : un prompt de meme titre et meme categorie est mis a jour.
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { Client } from "pg";
import { REECRITURES_PROMPTS } from "./reecritures-prompts-vivier.mjs";

const args = process.argv.slice(2);
const ECRIRE = args.includes("--ecrire");
const val = (nom) => (args.includes(nom) ? args[args.indexOf(nom) + 1] : null);
const RAPPORT = val("--rapport");
const ESPACE = "vivier-ia";
const RACINE = fileURLToPath(new URL("../../../../formations/ecosysteme-ia/", import.meta.url));

// Categorie de la bibliotheque pour chaque fiche. 'n8n' demande la migration 0025.
const SOURCES = [
  { dossier: "2026-09_vivier-ia-module-1", fichier: "02-methode-prompts", categorie: "methode" },
  { dossier: "2026-09_vivier-ia-module-1", fichier: "03-maitriser-loutil-prompts", categorie: "fondations" },
  { dossier: "2026-09_vivier-ia-module-1", fichier: "04-quotidien-prompts", categorie: "quotidien" },
  { dossier: "2026-09_vivier-ia-module-1", fichier: "05-fullstack-fil-rouge-prompts", categorie: "methode" },
  { dossier: "2026-09_vivier-ia-module-1", fichier: "06-business-prompts", categorie: "business" },
  { dossier: "2026-09_vivier-ia-module-2-n8n", fichier: "02-n8n-avance-prompts", categorie: "n8n" },
  { dossier: "2026-09_vivier-ia-module-2-n8n", fichier: "03-ia-agents-n8n-prompts", categorie: "n8n" },
  { dossier: "2026-09_vivier-ia-module-2-n8n", fichier: "04-agent-ia-complet-prompts", categorie: "n8n" },
  { dossier: "2026-09_vivier-ia-module-2-n8n", fichier: "05-deploiement-observabilite-prompts", categorie: "n8n" },
  { dossier: "2026-09_vivier-ia-module-2-n8n", fichier: "06-projet-complet-prompts", categorie: "n8n" },
];

// Meme liste que charger-lecons-vivier.mjs (contenu legitime : CLAUDE.md, .claude/, skills).
const A_TRAITER = [
  ["longrich", /longrich/i, "marque Longrich"],
  ["workspace", /workspace/i, "reference au workspace"],
  // context/ n'est pas un motif ici : c'est la convention de second brain enseignee par le cours.
  ["chemin", /livrables\/|module-installs|2026-09_/i, "chemin de fichier du workspace"],
  ["ancien-nom", /entrepreneur acad/i, "ancien nom de l'ecole"],
  ["zeze", /z[eé]z[eé]/i, "reference a Zeze"],
  ["chatllow", /chatllow/i, "marque Chatllow"],
  ["kora", /\bkora\b/i, "outil Kora"],
  ["enseignant", /enseignant/i, "mention de l'enseignant"],
  ["compagnon", /compagnon de|fiche pratique|-prompts\.md/i, "renvoi a un fichier compagnon"],
  ["travail-interne", /construit r[eé]cemment|mis en place r[eé]cemment|dans ce parcours|notre workspace|nos livrables|\bchariow\b/i, "reference a un travail interne"],
];

const lire = (d, f) => readFileSync(join(RACINE, d, f + ".md"), "utf8").replace(/\r\n/g, "\n");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ");
const mots = (s) => new Set(norm(s).split(/\s+/).filter((w) => w.length > 3));
const jaccard = (a, b) => {
  const A = mots(a), B = mots(b);
  return [...A].filter((w) => B.has(w)).length / (new Set([...A, ...B]).size || 1);
};

// Les fiches sont coupees a ~70 caracteres : on rejoint les lignes d'un meme paragraphe,
// en gardant les sauts de paragraphe et les listes.
function deplier(bloc) {
  const lignes = bloc.split("\n");
  let out = "";
  lignes.forEach((l, i) => {
    if (i === 0) { out = l; return; }
    const prec = lignes[i - 1];
    if (l.trim() === "" || prec.trim() === "") out += "\n" + l;
    else if (/^\s*([-*•]|\d+[.)])\s/.test(l)) out += "\n" + l;
    else if (/[A-Za-zÀ-ÿ]-$/.test(prec) && /^[a-zà-ÿ]/.test(l)) out += l; // "rédige-\nmoi"
    else out += " " + l.trim();
  });
  return out.trim();
}

// Extraction : un bloc de code garde = un prompt. Titre = titre ### le plus proche (sinon ##).
function extraire(texte, source) {
  const lignes = texte.split("\n");
  const prompts = [];
  let h2 = "", h3 = "";
  for (let i = 0; i < lignes.length; i++) {
    const l = lignes[i];
    if (/^## /.test(l)) { h2 = l.slice(3).trim(); h3 = ""; continue; }
    if (/^### /.test(l)) { h3 = l.slice(4).trim(); continue; }
    if (!l.startsWith("```")) continue;
    let j = i + 1;
    while (j < lignes.length && !lignes[j].startsWith("```")) j++;
    const bloc = lignes.slice(i + 1, j).join("\n");
    // Etiquette : derniere ligne non vide avant le bloc ("**Instruction floue (a eviter)**").
    let k = i - 1;
    while (k >= 0 && lignes[k].trim() === "") k--;
    const etiquette = k >= 0 && !/^#{1,6} /.test(lignes[k]) ? lignes[k].replace(/\*\*/g, "").trim() : "";
    i = j;
    prompts.push({ source, h2, h3, etiquette, brut: bloc });
  }
  return prompts;
}

const toutes = [];
for (const s of SOURCES) toutes.push(...extraire(lire(s.dossier, s.fichier), s));

const contreExemples = toutes.filter((p) => /floue|[àa] [eé]viter/i.test(p.etiquette));
let retenus = toutes.filter((p) => !contreExemples.includes(p));

// Titres : "Exemple 1 — Ajouter une fonctionnalite" -> "Ajouter une fonctionnalite".
const nettoyerTitre = (t) => t.replace(/^(Exemple \d+|Étape \d+|Partie \d+|Chapitre \d+)\s*[—–:-]\s*/i, "").trim();

// Plusieurs blocs sous un meme titre (ex. Plan, puis Execute, puis Validate) forment UN
// seul prompt : un fragment comme "Le plan me va, vas-y." n'a aucun sens seul. Les blocs
// sont separes par une ligne "--- etape ---" tiree de l'etiquette du bloc dans la fiche.
const groupes = new Map();
for (const p of retenus) {
  const cle = `${p.source.fichier}|${p.h3 || p.h2}`;
  if (!groupes.has(cle)) groupes.set(cle, []);
  groupes.get(cle).push(p);
}
retenus = [...groupes.values()].map((blocs) => {
  const [premier, ...suite] = blocs;
  // Etiquette courte : "3. Validate. Une fois l'execution terminee, ..." -> "3. Validate".
  const etape = (b) => b.etiquette.replace(/^\(|\)\s*$/g, "").replace(/\s*:\s*$/, "").trim().split(". ").slice(0, 2).join(". ") || "suite";
  const brut = [premier.brut, ...suite.map((b) => `--- ${etape(b)} ---\n\n${b.brut}`)].join("\n\n");
  return { ...premier, brut, titre: nettoyerTitre(premier.h3 || premier.h2), nbBlocs: blocs.length };
});
for (const p of retenus) p.contenu = deplier(p.brut);

// Correctifs sur des prompts DEJA en ligne (charges par la migration 0010) : une reference
// au workspace de Zeze y est visible des eleves. Appliques avec --ecrire, idempotents.
const CORRECTIFS_EN_BASE = [
  {
    titre: "Démarrer un second brain pour une activité",
    avant: ", sur le même principe que ce workspace :",
    apres: ", avec trois fichiers :",
  },
];

// Reecritures (memes principes que les lecons) puis controle des motifs.
const changements = [];
const appliquees = new Set();
for (const p of retenus) {
  for (const r of REECRITURES_PROMPTS) {
    const cible = r.sur === "titre" ? "titre" : "contenu";
    if (typeof r.avant === "string" ? p[cible].includes(r.avant) : r.avant.test(p[cible])) {
      const avant = p[cible];
      p[cible] = typeof r.avant === "string" ? p[cible].split(r.avant).join(r.apres) : p[cible].replace(new RegExp(r.avant.source, "g" + r.avant.flags.replace("g", "")), r.apres);
      appliquees.add(r.id);
      changements.push({ id: r.id, ou: `${p.source.fichier} / ${p.titre}`, avant: r.avant.toString(), apres: r.apres, longueur: avant.length - p[cible].length });
    }
  }
}
const reglesSansEffet = REECRITURES_PROMPTS.filter((r) => !appliquees.has(r.id)).map((r) => r.id);

// Prompts a ne pas charger (decision editoriale documentee dans reecritures-prompts-vivier.mjs)
import { EXCLUS } from "./reecritures-prompts-vivier.mjs";
const exclus = retenus.filter((p) => EXCLUS.some((e) => p.titre.includes(e.titre) && p.source.fichier === e.fichier));
retenus = retenus.filter((p) => !exclus.includes(p));

let occurrences = [];
for (const p of retenus) {
  for (const [id, re, nom] of A_TRAITER) {
    const g = new RegExp(re.source, re.flags + "g");
    for (const champ of ["titre", "contenu"]) {
      let m;
      while ((m = g.exec(p[champ]))) {
        const a = Math.max(0, m.index - 60);
        occurrences.push({ p, id, nom, ou: `${p.source.fichier} / ${p.titre} [${champ}]`, extrait: p[champ].slice(a, m.index + m[0].length + 60).replace(/\n/g, " ") });
      }
    }
  }
}

// Etat de la base (lecture seule)
const env = {};
readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n").forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
});
const client = new Client({
  host: "aws-0-eu-central-1.pooler.supabase.com", port: 5432, user: "postgres.uomcecactzqfxdhsfyey",
  password: env.SUPABASE_DB_PASSWORD, database: "postgres", ssl: { rejectUnauthorized: false },
});
await client.connect();
let code = 0;
try {
  if (!ECRIRE) await client.query("set default_transaction_read_only = on");
  const esp = (await client.query("select id from espaces where slug = $1", [ESPACE])).rows[0];
  const existants = (await client.query("select id, categorie, titre, contenu, ordre from prompts where espace_id = $1", [esp.id])).rows;
  const def = (await client.query("select pg_get_constraintdef(oid) as d from pg_constraint where conrelid = 'prompts'::regclass and contype = 'c' and pg_get_constraintdef(oid) ilike '%categorie%'")).rows[0]?.d ?? "";
  const n8nOk = def.includes("n8n");

  // Doublons : meme categorie et contenu tres proche d'un prompt deja en base -> non recharge.
  for (const p of retenus) {
    const meme = existants.find((e) => e.categorie === p.source.categorie && e.titre === p.titre);
    if (meme) { p.action = "mise a jour"; p.id = meme.id; continue; }
    const proche = existants.map((e) => ({ e, s: jaccard(e.contenu, p.contenu) })).sort((a, b) => b.s - a.s)[0];
    if (proche && proche.s >= 0.55) { p.action = "doublon"; p.doublonDe = `« ${proche.e.titre} » (${proche.s.toFixed(2)})`; }
    else p.action = "creation";
  }
  // Un doublon n'est pas charge : ses occurrences ne bloquent pas.
  occurrences = occurrences.filter((o) => o.p.action !== "doublon");
  const aCreer = retenus.filter((p) => p.action === "creation");
  const aMaj = retenus.filter((p) => p.action === "mise a jour");
  const doublons = retenus.filter((p) => p.action === "doublon");
  const parCat = {};
  for (const p of aCreer) parCat[p.source.categorie] = (parCat[p.source.categorie] ?? 0) + 1;
  const problemes = [];
  if (!n8nOk && retenus.some((p) => p.source.categorie === "n8n")) problemes.push("categorie 'n8n' absente de la contrainte de la table prompts (appliquer la migration 0025)");

  console.log("=== RAPPORT ===");
  console.log(`Blocs de code trouves : ${toutes.length} | contre-exemples ecartes (a eviter) : ${contreExemples.length} | exclus : ${exclus.length}`);
  console.log(`Prompts retenus : ${retenus.length} | a creer : ${aCreer.length} | a mettre a jour : ${aMaj.length} | doublons ecartes : ${doublons.length}`);
  console.log(`Par categorie (creations) : ${Object.entries(parCat).map(([c, n]) => `${c} ${n}`).join(", ") || "aucune"}`);
  console.log(`Prompts deja en base pour ${ESPACE} : ${existants.length}`);
  console.log(`Reecritures : ${REECRITURES_PROMPTS.length} regles, ${changements.length} remplacements | regles sans effet : ${reglesSansEffet.length ? reglesSansEffet.join(", ") : "aucune"}`);
  console.log(`Problemes : ${problemes.length ? "\n  - " + problemes.join("\n  - ") : "aucun"}`);
  console.log(`\nOccurrences a traiter : ${occurrences.length}`);
  for (const [id, , nom] of A_TRAITER) {
    const o = occurrences.filter((x) => x.id === id);
    if (o.length) console.log(`  ${id.padEnd(16)} ${String(o.length).padStart(3)} (${nom})`);
  }

  if (RAPPORT) {
    const out = ["# Prompts a charger", ""];
    for (const p of retenus) out.push(`- [${p.action}] ${p.source.categorie} | ${p.source.fichier} | ${p.titre} (${p.contenu.length} car.)${p.doublonDe ? " ~ doublon de " + p.doublonDe : ""}`);
    out.push("", `# Occurrences restantes (${occurrences.length})`, "");
    for (const o of occurrences) out.push(`- [${o.id}] ${o.ou} : ${o.extrait}`);
    out.push("", "# Contre-exemples ecartes", "");
    for (const p of contreExemples) out.push(`- ${p.source.fichier} | ${p.h3 || p.h2} | ${p.etiquette}`);
    out.push("", `# Journal des reecritures (${changements.length})`, "");
    for (const c of changements) out.push(`- [${c.id}] ${c.ou}`);
    out.push("", "# Contenu complet", "");
    for (const p of retenus) out.push(`## ${p.source.categorie} : ${p.titre}`, "", p.contenu, "");
    writeFileSync(RAPPORT, out.join("\n"));
    console.log(`\nRapport ecrit dans : ${RAPPORT}`);
  }

  const bloquant = occurrences.length > 0 || problemes.length > 0 || reglesSansEffet.length > 0;
  if (!ECRIRE) {
    console.log(`\nESSAI A BLANC : aucune ecriture en base.${bloquant ? " (des points sont a traiter avant --ecrire)" : ""}`);
  } else if (bloquant) {
    console.log("\nECRITURE REFUSEE : traiter les points ci-dessus d'abord.");
    code = 1;
  } else {
    await client.query("begin");
    for (const c of CORRECTIFS_EN_BASE) {
      const r = await client.query(
        "update prompts set contenu = replace(contenu, $1, $2) where espace_id = $3 and titre = $4 and position($1 in contenu) > 0",
        [c.avant, c.apres, esp.id, c.titre]
      );
      console.log(`Correctif sur « ${c.titre} » : ${r.rowCount} ligne(s)`);
    }
    const ordreParCat = {};
    for (const e of existants) ordreParCat[e.categorie] = Math.max(ordreParCat[e.categorie] ?? 0, e.ordre);
    for (const p of aMaj) await client.query("update prompts set contenu = $1 where id = $2", [p.contenu, p.id]);
    for (const p of aCreer) {
      const cat = p.source.categorie;
      ordreParCat[cat] = (ordreParCat[cat] ?? 0) + 1;
      await client.query("insert into prompts (espace_id, categorie, titre, contenu, ordre) values ($1,$2,$3,$4,$5)", [esp.id, cat, p.titre, p.contenu, ordreParCat[cat]]);
    }
    await client.query("commit");
    const v = await client.query("select categorie, count(*)::int as n from prompts where espace_id = $1 group by categorie order by categorie", [esp.id]);
    console.log(`\nECRIT : ${aCreer.length} crees, ${aMaj.length} mis a jour. En base : ${v.rows.map((r) => `${r.categorie} ${r.n}`).join(", ")}`);
  }
} catch (err) {
  console.error("Echec :", err.message);
  try { await client.query("rollback"); } catch {}
  code = 1;
} finally {
  await client.end();
}
process.exit(code);
