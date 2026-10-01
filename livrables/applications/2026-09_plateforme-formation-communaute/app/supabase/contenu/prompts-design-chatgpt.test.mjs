// Verifie le contenu des prompts avant toute publication.
// Lancer depuis app/ :  node --test supabase/contenu/prompts-design-chatgpt.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { PROMPTS, ESPACE } from "./prompts-design-chatgpt.mjs";
import { construireApercu, construireSql, LIBELLES } from "../../scripts/generer-prompts-design-chatgpt.mjs";

const racine = fileURLToPath(new URL("../../", import.meta.url));
const lire = (chemin) => readFileSync(racine + chemin, "utf8").replace(/\r\n/g, "\n");

const GRATUITES = ["design_maquettes", "design_identite", "design_site", "design_supports", "design_ameliorer", "design_vers_code"];
const PAYANTES = ["codex_migration", "chatgpt_ameliorer", "chatgpt_integrer", "chatgpt_securite"];
const TOUTES = [...GRATUITES, ...PAYANTES];

test("catégories : seulement les 10 nouvelles, chacune avec son libellé, et toutes représentées", () => {
  assert.equal(ESPACE, "vivier-ia");
  for (const p of PROMPTS) assert.ok(TOUTES.includes(p.categorie), `catégorie inconnue : ${p.categorie}`);
  for (const c of TOUTES) {
    assert.ok(LIBELLES[c], `libellé manquant : ${c}`);
    assert.ok(PROMPTS.some((p) => p.categorie === c), `aucun prompt dans ${c}`);
  }
});

test("accès : Claude Design est gratuit, Codex et ChatGPT sont payants, sans exception", () => {
  for (const p of PROMPTS) {
    const attendu = GRATUITES.includes(p.categorie) ? "gratuite" : "payante";
    assert.equal(p.acces, attendu, `${p.titre} : accès ${p.acces}, attendu ${attendu}`);
  }
});

test("volume : au moins 30 prompts gratuits et 40 prompts payants", () => {
  assert.ok(PROMPTS.filter((p) => p.acces === "gratuite").length >= 30);
  assert.ok(PROMPTS.filter((p) => p.acces === "payante").length >= 40);
});

test("forme : titres et contenus présents, longueurs raisonnables, titres uniques", () => {
  const titres = new Set();
  for (const p of PROMPTS) {
    assert.ok(typeof p.titre === "string" && p.titre.trim().length >= 8 && p.titre.length <= 120, `titre : ${p.titre}`);
    assert.ok(typeof p.contenu === "string" && p.contenu.trim().length >= 150, `contenu trop court : ${p.titre}`);
    assert.ok(p.contenu.length <= 2600, `contenu trop long (${p.contenu.length}) : ${p.titre}`);
    assert.ok(!titres.has(p.titre), `titre en double : ${p.titre}`);
    titres.add(p.titre);
  }
});

test("outil indiqué : tout prompt payant commence par un outil entre crochets reconnu", () => {
  const outils = /^\[(Claude Code ou Codex|Claude Code|Codex|ChatGPT)\] /;
  for (const p of PROMPTS.filter((x) => x.acces === "payante" && !/^(Comprendre|Choisir|Plafonner|Travailler|Comparer)/.test(x.titre))) {
    assert.match(p.titre, outils, `outil manquant : ${p.titre}`);
  }
  for (const p of PROMPTS.filter((x) => x.categorie === "design_vers_code" && /^\[/.test(x.titre))) assert.match(p.titre, /^\[Claude Code\] /);
});

test("aucun nom de modèle figé : ils changent trop vite pour être écrits dans un prompt", () => {
  for (const p of PROMPTS) {
    const texte = `${p.titre}\n${p.contenu}`;
    assert.ok(!/\bgpt[-\s]?\d/i.test(texte), `nom de modèle OpenAI dans : ${p.titre}`);
    assert.ok(!/claude[-\s](opus|sonnet|haiku|fable)/i.test(texte), `nom de modèle Claude dans : ${p.titre}`);
    assert.ok(!/\bo[134]-(mini|pro|preview)\b/i.test(texte), `nom de modèle dans : ${p.titre}`);
  }
});

test("aucun secret : pas de clé, de jeton ni de mot de passe dans le contenu", () => {
  const motifs = [/sk-[A-Za-z0-9_-]{16,}/, /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, /-----BEGIN [A-Z ]*PRIVATE KEY/, /AKIA[0-9A-Z]{16}/, /gh[pousr]_[A-Za-z0-9]{30,}/, /postgres(ql)?:\/\/[^:\s]+:[^@\s]{4,}@/];
  for (const p of PROMPTS) for (const m of motifs) assert.ok(!m.test(`${p.titre}\n${p.contenu}`), `secret possible dans : ${p.titre}`);
});

test("sécurité de l'écriture : pas de balise SQL ni de caractère de contrôle, pas de tiret long", () => {
  for (const p of PROMPTS) {
    const texte = `${p.titre}\n${p.contenu}`;
    assert.ok(!texte.includes("$p$"), `balise SQL dans : ${p.titre}`);
    assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(texte), `caractère de contrôle dans : ${p.titre}`);
    assert.ok(!texte.includes("—"), `tiret long dans : ${p.titre}`);
  }
});

test("promesses honnêtes : un prompt d'API demande de lire la documentation et ne fige aucun prix", () => {
  for (const p of PROMPTS.filter((x) => ["Première connexion", "sortie structurée", "appeler une fonction", "propres documents", "recherche web", "images", "voix haute", "fil d'une conversation", "erreurs, les délais"].some((k) => x.titre.includes(k)))) {
    assert.match(p.contenu, /documentation officielle/i, `lire la documentation : ${p.titre}`);
  }
  for (const p of PROMPTS) assert.ok(!/\d+([.,]\d+)?\s?(\$|€|dollars?|euros?)\s?(par|\/)/i.test(p.contenu), `prix figé dans : ${p.titre}`);
});

test("crochets : chaque emplacement à remplacer est bien formé (ni vide, ni coupé, ni démesuré)", () => {
  // Beaucoup de prompts n'ont aucun crochet : ils agissent directement sur le projet de l'élève (audit, revue...).
  // Ce qui compte : quand il y a des crochets, ils doivent être clairs, sinon l'élève enverrait le prompt tel quel.
  // Seuls les crochets d'outil au début d'un titre ("[Codex] ...") sont exclus : ce ne sont pas des emplacements.
  for (const p of PROMPTS) {
    const texte = p.contenu;
    assert.equal((texte.match(/\[/g) ?? []).length, (texte.match(/\]/g) ?? []).length, `crochets non appariés : ${p.titre}`);
    for (const m of texte.matchAll(/\[([^\]]*)\]/g)) {
      const dedans = m[1].trim();
      assert.ok(dedans.length >= 2, `emplacement vide dans : ${p.titre}`);
      assert.ok(dedans.length <= 140, `emplacement trop long (${dedans.length}) dans : ${p.titre}`);
    }
  }
});

test("la migration 0052 et l'aperçu sont à jour avec le fichier source (jamais modifiés à la main)", () => {
  assert.equal(lire("supabase/migrations/0052_prompts_design_chatgpt.sql"), construireSql());
  assert.equal(lire("supabase/contenu/CONTENU-PROMPTS.md"), construireApercu());
});

test("migration 0052 : une insertion par prompt, idempotente, limitée à l'espace de l'école", () => {
  const s = construireSql();
  assert.equal((s.match(/^insert into prompts/gm) ?? []).length, PROMPTS.length);
  assert.equal((s.match(/not exists/g) ?? []).length, PROMPTS.length);
  assert.equal((s.match(/e\.slug = 'vivier-ia'/g) ?? []).length, PROMPTS.length);
  assert.ok(!/\b(delete|drop|truncate|update)\b/i.test(s.replace(/--.*$/gm, "").replace(/\$p\$[\s\S]*?\$p\$/g, "")), "la migration ne doit rien supprimer ni modifier");
});
