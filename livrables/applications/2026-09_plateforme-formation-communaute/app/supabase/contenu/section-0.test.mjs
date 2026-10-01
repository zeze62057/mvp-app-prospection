// Garde-fous de la section 0 « Bienvenue » (voir scripts/generer-section-0.mjs).
// Lancer : node --test supabase/contenu/section-0.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { construireSql, lireContenu, FICHIER_MIGRATION, TITRE } from "../../scripts/generer-section-0.mjs";

const contenu = lireContenu();

test("trois chapitres, des points clés et des questions", () => {
  assert.equal((contenu.match(/^## Chapitre \d+ :/gm) || []).length, 3);
  assert.equal((contenu.match(/^\*\*Points clés\*\*/gm) || []).length, 3);
  assert.match(contenu, /^## Questions pour les apprenants/m);
});

test("un bloc « À faire maintenant » par chapitre, placé avant le chapitre suivant", () => {
  const parties = contenu.split(/\n---\n\n(?=## )/);
  assert.equal(parties.length, 4);
  for (const p of parties.slice(0, 3)) assert.match(p, /^### À faire maintenant : .+/m);
});

test("rien d'interne ne reste : notes d'auteur, corrigés, chemins, marques tierces", () => {
  const interdits = [
    /éléments de correction/i, /réservé à l'enseignant/i, /fiche pratique associée/i, /-prompts\.md/i,
    /module-installs/i, /jarvis/i, /yassine/i, /sdiri/i, /skool/i, /workspace/i, /rédigé par claude/i,
    /brouillon/i, /longrich/i, /chatllow/i, /\bzézé\b/i,
  ];
  for (const re of interdits) assert.doesNotMatch(contenu, re, `motif interdit : ${re}`);
});

test("les blocs de code sont fermés et n'utilisent que des langages connus", () => {
  let ouvert = false;
  for (const l of contenu.split("\n")) {
    const m = /^```(\S*)\s*$/.exec(l);
    if (!m) continue;
    if (!ouvert) {
      assert.ok(["prompt", "bash", "powershell", "claude", "markdown", "json", "text"].includes(m[1]), `langage inconnu : ${m[1]}`);
      ouvert = true;
    } else ouvert = false;
  }
  assert.equal(ouvert, false);
});

test("aucun secret, aucune demande de coller un secret", () => {
  assert.doesNotMatch(contenu, /sk-[A-Za-z0-9]{16,}|eyJ[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|sb_secret_/);
  assert.doesNotMatch(contenu, /colle (ici )?(ta|ton|tes|la|le) (clé|mot de passe|jeton|secret)/i);
});

test("le Kit Startup est cité avec son nom exact et son fichier INSTALL.md", () => {
  assert.match(contenu, /Kit Startup/);
  assert.match(contenu, /INSTALL\.md/);
});

test("la migration est à jour, additive et ne modifie aucune section existante", () => {
  const sql = fs.readFileSync(FICHIER_MIGRATION, "utf8").replace(/\r\n/g, "\n");
  assert.equal(sql, construireSql(contenu), "relancer : node scripts/generer-section-0.mjs");
  assert.match(sql, /on conflict \(module_id, ordre\) do nothing/);
  assert.doesNotMatch(sql, /\b(update sections|delete from|drop table|truncate)\b/i);
  assert.ok(sql.includes(`'${TITRE}'`));
});
