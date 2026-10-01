// Garde-fous des sections « Présentation du formateur » et « Installation des outils » (migration 0055).
// Lancer : node --test supabase/contenu/section-0-debut.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  construireSql0055,
  lireFormateur,
  lireOutils,
  FICHIER_MIGRATION_0055,
  TITRE_FORMATEUR,
  TITRE_OUTILS,
} from "../../scripts/generer-section-0.mjs";

const formateur = lireFormateur();
const outils = lireOutils();
const LANGAGES = ["prompt", "bash", "powershell", "claude", "markdown", "json", "text"];

function fencesOk(texte) {
  let ouvert = false;
  for (const l of texte.split("\n")) {
    const m = /^```(\S*)\s*$/.exec(l);
    if (!m) continue;
    if (!ouvert) {
      assert.ok(LANGAGES.includes(m[1]), `langage inconnu : ${m[1]}`);
      ouvert = true;
    } else ouvert = false;
  }
  assert.equal(ouvert, false, "bloc de code non fermé");
}

test("chaque section a ses chapitres, ses points clés, un bloc à faire et ses questions", () => {
  for (const [nom, t, n] of [["formateur", formateur, 2], ["outils", outils, 5]]) {
    assert.equal((t.match(/^## Chapitre \d+ :/gm) || []).length, n, `${nom} : nombre de chapitres`);
    assert.equal((t.match(/^\*\*Points clés\*\*/gm) || []).length, n, `${nom} : points clés`);
    assert.equal((t.match(/^### À faire maintenant :/gm) || []).length, n, `${nom} : blocs à faire`);
    assert.match(t, /^## Questions pour les apprenants/m);
    fencesOk(t);
  }
});

test("rien d'interne, aucun secret, aucune demande de coller un secret", () => {
  const interdits = [/module-installs/i, /jarvis/i, /yassine/i, /skool/i, /workspace/i, /longrich/i, /chatllow/i, /brouillon/i, /rédigé par claude/i];
  for (const t of [formateur, outils]) {
    for (const re of interdits) assert.doesNotMatch(t, re, `motif interdit : ${re}`);
    assert.doesNotMatch(t, /sk-[A-Za-z0-9]{16,}|eyJ[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{20,}|sb_secret_/);
    assert.doesNotMatch(t, /colle (ici )?(ta|ton|tes|la|le) (clé|mot de passe|jeton|secret)/i);
  }
});

test("le formateur n'affirme que des faits déjà présents dans le cours", () => {
  assert.match(formateur, /Guinée Forestière/);
  assert.match(formateur, /Claude Code/);
  // Aucune date, aucun chiffre biographique, aucun diplôme, aucune promesse de résultat.
  assert.doesNotMatch(formateur, /\b(19|20)\d{2}\b/);
  assert.doesNotMatch(formateur, /\b(ingénieur|docteur|master|licence|diplômé)\w*/i);
  assert.doesNotMatch(formateur, /tu (gagneras|deviendras|vas gagner)|revenus? garantis?|clients? garantis?/i);
});

test("les commandes d'installation sont exactement celles du cours", () => {
  assert.match(outils, /npm install -g @anthropic-ai\/claude-code/);
  assert.match(outils, /npm uninstall -g @anthropic-ai\/claude-code/);
  assert.match(outils, /Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned/);
  assert.match(outils, /git config --global user\.name/);
  for (const t of ["Node.js", "Claude Code", "Visual Studio Code", "Git", "GitHub", "Vercel"]) assert.ok(outils.includes(t), `outil manquant : ${t}`);
});

test("la migration 0055 est à jour, ordonnée et sans SQL destructeur", () => {
  const sql = fs.readFileSync(FICHIER_MIGRATION_0055, "utf8").replace(/\r\n/g, "\n");
  assert.equal(sql, construireSql0055(formateur, outils), "relancer : node scripts/generer-section-0.mjs");
  assert.ok(sql.indexOf("update sections set ordre = -2") < sql.indexOf(`'${TITRE_OUTILS}'`), "déplacer Bienvenue avant d'insérer");
  assert.match(sql, /insert into sections[\s\S]*, -1, 'Présentation du formateur'/);
  assert.match(sql, /, 0, 'Installation des outils'/);
  assert.equal((sql.match(/on conflict \(module_id, ordre\) do nothing/g) || []).length, 2);
  assert.doesNotMatch(sql, /\b(delete from|drop table|drop column|truncate)\b/i);
  assert.ok(sql.includes(TITRE_FORMATEUR));
});
