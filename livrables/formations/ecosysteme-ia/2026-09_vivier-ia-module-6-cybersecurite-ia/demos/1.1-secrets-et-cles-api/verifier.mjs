// Verifie le projet de demo (ou ton propre projet) SANS jamais afficher la valeur d'un secret.
// Usage : node verifier.mjs <dossier-du-projet>
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const dossier = resolve(process.argv[2] ?? ".");
const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: dossier, stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return null; // git renvoie un code d'erreur quand rien ne correspond
  }
};

if (git("rev-parse", "--git-dir") === null) {
  console.error(`Pas un depot Git : ${dossier}`);
  process.exit(2);
}

const resultats = [];
const test = (ok, bien, mal) => resultats.push({ ok, texte: ok ? bien : mal });

// 1. .env est-il ignore ?
test(
  git("check-ignore", ".env") !== null || !existsSync(join(dossier, ".env")),
  ".env est ignore par Git (ou n'existe pas)",
  ".env n'est PAS ignore : ajoute-le au .gitignore",
);

// 2. Un fichier de secrets est-il suivi par Git (hors modeles) ?
const suivis = (git("ls-files") ?? "")
  .split("\n")
  .filter((f) => /(^|\/)\.env(\.|$)/i.test(f) && !/\.(example|sample|template)$/i.test(f));
test(suivis.length === 0, "aucun fichier .env reel n'est suivi par Git", `fichiers de secrets suivis : ${suivis.join(", ")}`);

// 3. Un fichier de secrets est-il dans l'historique ?
const historique = git("log", "--all", "--oneline", "--", ".env");
test(!historique, "aucun .env dans l'historique", "un .env existe dans l'historique : si le depot a ete envoye, revoque les cles");

// 4. Une cle ecrite en dur dans le code ? (motifs simples, valeurs jamais affichees)
const motif = /(cle|key|token|secret|password|mot_de_passe)\w*\s*[:=]\s*["'][^"']{12,}["']/i;
const enDur = [];
const parcourir = (d) => {
  for (const nom of readdirSync(d)) {
    if ([".git", "node_modules"].includes(nom)) continue;
    const p = join(d, nom);
    if (statSync(p).isDirectory()) parcourir(p);
    else if (/\.(js|mjs|ts|tsx|py|json|md)$/.test(nom) && !nom.startsWith(".env")) {
      readFileSync(p, "utf8").split("\n").forEach((ligne, i) => {
        if (motif.test(ligne)) enDur.push(`${p.slice(dossier.length + 1)}:${i + 1}`);
      });
    }
  }
};
parcourir(dossier);
test(enDur.length === 0, "aucune cle ecrite en dur dans le code", `cle possible en dur (fichier:ligne) : ${enDur.join(", ")}`);

for (const r of resultats) console.log(`${r.ok ? "OK    " : "ERREUR"}  ${r.texte}`);
const erreurs = resultats.filter((r) => !r.ok).length;
console.log(erreurs === 0 ? "\nBravo : projet propre." : `\n${erreurs} probleme(s) a corriger.`);
process.exit(erreurs === 0 ? 0 : 1);
