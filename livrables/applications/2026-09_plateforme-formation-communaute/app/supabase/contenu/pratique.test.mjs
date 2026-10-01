// Garde-fous des blocs « À faire maintenant » ajoutés aux leçons (voir scripts/generer-pratique-cours.mjs).
// Lancer : node --test supabase/contenu/pratique.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  construireSql,
  lireSource,
  lireToutesLesSources,
  reperDuBloc,
  FICHIER_MIGRATION,
  RE_UUID,
} from "../../scripts/generer-pratique-cours.mjs";

const blocs = lireToutesLesSources();
// Langages que la page de leçon sait afficher avec le bon type de carte (voir composants-lecon.tsx).
const LANGAGES = new Set(["prompt", "bash", "powershell", "claude", "markdown", "json", "text"]);

test("il y a du contenu et chaque bloc a une section valide et un numéro", () => {
  assert.ok(blocs.length >= 100, `seulement ${blocs.length} blocs`);
  for (const b of blocs) {
    assert.match(b.section, RE_UUID, `section invalide : ${b.section}`);
    assert.ok(Number.isInteger(b.chapitre) && b.chapitre >= 1, `chapitre invalide : ${b.fichier}`);
    assert.ok(["Chapitre", "Atelier"].includes(b.genre));
  }
});

test("chaque bloc commence par son repère « À faire maintenant : », unique dans sa section", () => {
  const vus = new Set();
  for (const b of blocs) {
    const repere = reperDuBloc(b.texte);
    assert.ok(repere, `repère manquant : section ${b.section}, chapitre ${b.chapitre}`);
    const cle = `${b.section}|${repere}`;
    assert.ok(!vus.has(cle), `repère en double : ${repere}`);
    vus.add(cle);
  }
});

test("un seul bloc par chapitre", () => {
  const vus = new Set();
  for (const b of blocs) {
    const cle = `${b.section}|${b.genre}|${b.chapitre}`;
    assert.ok(!vus.has(cle), `deux blocs pour ${cle}`);
    vus.add(cle);
  }
});

test("les blocs de code sont fermés et n'utilisent que des langages connus", () => {
  for (const b of blocs) {
    const lignes = b.texte.split("\n");
    let ouvert = false;
    for (const l of lignes) {
      const m = /^```(\S*)\s*$/.exec(l);
      if (!m) continue;
      if (!ouvert) {
        assert.ok(LANGAGES.has(m[1]), `langage inconnu « ${m[1]} » : ${reperDuBloc(b.texte)}`);
        ouvert = true;
      } else {
        ouvert = false;
      }
    }
    assert.equal(ouvert, false, `bloc de code non fermé : ${reperDuBloc(b.texte)}`);
  }
});

test("chaque bloc contient au moins une carte à copier", () => {
  for (const b of blocs) {
    assert.match(b.texte, /^```\S+/m, `aucune carte à copier : ${reperDuBloc(b.texte)}`);
  }
});

test("aucun secret réel ni valeur sensible", () => {
  const motifs = [/sk-[A-Za-z0-9]{16,}/, /eyJ[A-Za-z0-9_-]{20,}/, /ghp_[A-Za-z0-9]{20,}/, /sb_secret_/, /AKIA[0-9A-Z]{12,}/];
  for (const b of blocs) for (const m of motifs) assert.doesNotMatch(b.texte, m, `secret possible : ${reperDuBloc(b.texte)}`);
});

test("aucun délimiteur qui casserait la migration SQL", () => {
  for (const b of blocs) {
    for (const d of ["$b$", "$r$", "$f$", "$q$", "$c$", "$m$"]) assert.ok(!b.texte.includes(d), `${d} dans ${reperDuBloc(b.texte)}`);
    assert.doesNotMatch(b.texte, /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/, "caractère de contrôle");
  }
});

test("aucune apostrophe typographique ni tiret long dans les commandes copiables", () => {
  for (const b of blocs) {
    const re = /^```(bash|powershell|claude|json)\s*\n([\s\S]*?)\n```/gm;
    let m;
    while ((m = re.exec(b.texte))) {
      assert.doesNotMatch(m[2], /[’“”—–]/, `caractère typographique dans une commande : ${reperDuBloc(b.texte)}`);
    }
  }
});

test("les prompts n'invitent jamais à coller un secret dans le chat", () => {
  for (const b of blocs) {
    const re = /^```prompt\s*\n([\s\S]*?)\n```/gm;
    let m;
    while ((m = re.exec(b.texte))) {
      assert.doesNotMatch(m[1], /colle (ici )?(ta|ton|tes|la|le) (clé|cle|mot de passe|jeton|token|secret)/i, `demande un secret : ${reperDuBloc(b.texte)}`);
    }
  }
});

test("la migration versionnée est à jour avec les sources", () => {
  const attendu = construireSql(blocs);
  const reel = fs.readFileSync(FICHIER_MIGRATION, "utf8").replace(/\r\n/g, "\n");
  assert.equal(reel, attendu, "relancer : node scripts/generer-pratique-cours.mjs");
});

test("la migration est idempotente, additive et sans SQL destructeur", () => {
  const sql = fs.readFileSync(FICHIER_MIGRATION, "utf8");
  assert.doesNotMatch(sql, /\b(drop table|drop column|delete from|truncate)\b/i);
  assert.ok((sql.match(/position\(v_repere in v_contenu\) > 0 then return/g) || []).length === blocs.length, "garde d'idempotence manquante");
});

test("lireSource lit sections, chapitres et ateliers", () => {
  const src = "@@ SECTION 11111111-1111-1111-1111-111111111111 Titre\n\n@@ CHAPITRE 1\n### À faire maintenant : a\ntexte\n\n@@ ATELIER 2\n### À faire maintenant : b\n";
  const r = lireSource(src);
  assert.equal(r.length, 2);
  assert.deepEqual(r.map((x) => [x.chapitre, x.genre]), [[1, "Chapitre"], [2, "Atelier"]]);
});
