// Demo 1.1 : fabrique un projet factice qui a DEJA fait les erreurs classiques.
// Tout est faux : aucune vraie cle, aucun reseau, rien ne sort de ta machine.
// Usage : node preparer.mjs [dossier]   (defaut : <dossier temporaire>/projet-demo-secrets)
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const cible = resolve(process.argv[2] ?? join(tmpdir(), "projet-demo-secrets"));

if (existsSync(join(cible, ".git")) === false && existsSync(cible)) {
  console.error(`Le dossier existe deja et n'est pas un projet de demo : ${cible}`);
  process.exit(1);
}
rmSync(cible, { recursive: true, force: true });
mkdirSync(cible, { recursive: true });

const git = (...args) => execFileSync("git", args, { cwd: cible, stdio: "pipe" }).toString();

// Erreur 1 : une cle ecrite en dur dans le code.
writeFileSync(
  join(cible, "app.js"),
  `// Petit script de demo\nconst CLE_API = "FAUX-sk-demo-0000000000000000";\nconsole.log("Appel de l'API avec la cle", CLE_API.slice(0, 8) + "...");\n`,
);
// Erreur 2 : un .env que le .gitignore n'ignore pas.
writeFileSync(
  join(cible, ".env"),
  `CLE_API=FAUX-sk-demo-1111111111111111\nMOT_DE_PASSE_BASE=FAUX-motdepasse-demo\n`,
);
// Un modele correct, pour comparer.
writeFileSync(join(cible, ".env.example"), `CLE_API=\nMOT_DE_PASSE_BASE=\n`);
// .gitignore incomplet a dessein.
writeFileSync(join(cible, ".gitignore"), `node_modules/\n`);

git("init", "-q", "-b", "main");
git("config", "user.name", "Eleve Demo");
git("config", "user.email", "eleve@demo.invalid");
git("config", "core.autocrlf", "false");
// Erreur 3 : "git add ." envoie tout, y compris .env.
git("add", ".");
git("commit", "-q", "-m", "Premier commit du projet de demo");

console.log(`Projet de demo pret : ${cible}`);
console.log(`Ouvre un terminal dedans :  cd "${cible}"`);
console.log("Suis ensuite le README de la demo.");
