// Audite un fichier de reglages Claude Code (settings.json) : lecture seule, aucun reseau.
// Usage : node auditer-reglages.mjs <fichier-settings.json>
// Chaque controle cite la regle de la documentation officielle Claude Code (permissions, settings) ou marque "raisonnement".
// Limite : un fichier sans alerte n'est pas prouve sur. Un fichier de reglages n'est pas une frontiere complete.
import { readFileSync } from "node:fs";

const fichier = process.argv[2];
if (!fichier) {
  console.error("Usage : node auditer-reglages.mjs <fichier-settings.json>");
  process.exit(2);
}

const constats = []; // { niveau, texte }
const ajouter = (niveau, texte) => constats.push({ niveau, texte });

let texte;
try {
  texte = readFileSync(fichier, "utf8");
} catch {
  console.error(`Fichier introuvable : ${fichier}`);
  process.exit(2);
}
let reglages;
try {
  reglages = JSON.parse(texte);
} catch (e) {
  console.log(`ERREUR     JSON invalide (${e.message}). Les reglages sont du JSON strict : pas de commentaire, pas de virgule en trop.`);
  process.exit(1);
}

const perms = reglages.permissions ?? {};
const allow = perms.allow ?? [];
const deny = perms.deny ?? [];

// 1. Fichiers de secrets proteges ?
if (!deny.some((r) => /^Read\(.*\.env/.test(r))) {
  ajouter("ATTENTION", "aucune regle deny Read sur .env (exemple : \"Read(./.env)\" et \"Read(./.env.*)\")");
}

// 2. Regles allow trop larges
for (const r of allow) {
  if (r === "Bash" || r === "Bash(*)") ajouter("ERREUR", `${r} autorise TOUTES les commandes du terminal`);
  else if (r === "WebFetch") ajouter("ATTENTION", `${r} autorise toutes les lectures web`);
  else if (/^Bash\((git|npx|npm|node|python3?|sh|bash|docker|devbox|direnv|mise) \*\)$/.test(r)) {
    const doc = /^Bash\(git /.test(r)
      ? "documentation : Bash(git *) autorise toutes les commandes git"
      : /^Bash\((npx|devbox|direnv|mise|docker) /.test(r)
        ? "documentation : ces lanceurs executent leurs arguments comme une commande, la regle couvre tout ce qui suit"
        : "raisonnement : un interpreteur execute n'importe quel script";
    ajouter("ATTENTION", `${r} est trop large (${doc}). Ecrivez la commande exacte.`);
  } else if (/^Bash\(\S+ \* \S+/.test(r)) {
    ajouter("ATTENTION", `${r} : un * avant la fin de la commande couvre aussi les options (documentation : Claude Code avertit au demarrage)`);
  }
  if (/^mcp__\*$/.test(r) || /^(\*|B\*)$/.test(r)) {
    ajouter("ATTENTION", `${r} : un allow avec joker sans prefixe mcp__<serveur>__ est ignore par Claude Code (documentation), il ne fait rien`);
  }
  if (/^(Write|NotebookEdit|Glob|MultiEdit)\(.+\)$/.test(r)) {
    ajouter("ATTENTION", `${r} : Claude Code ne consulte jamais les chemins de cet outil (documentation). Utilisez Edit(...) ou Read(...)`);
  }
  if (/^Bash\(command:/.test(r) || /^(Read|Edit)\((file_path|path):/.test(r)) {
    ajouter("ATTENTION", `${r} : ce format est ignore par Claude Code (documentation). Utilisez Bash(commande *), Read(./chemin)`);
  }
  if (/^(Read|Edit)\(\/[^/]/.test(r)) {
    ajouter("ATTENTION", `${r} : un seul / au debut n'est PAS un chemin absolu (documentation), c'est relatif a la source des reglages. Absolu : //chemin`);
  }
}
for (const r of deny) {
  if (/^(Write|NotebookEdit|Glob|MultiEdit)\(.+\)$/.test(r)) {
    ajouter("ATTENTION", `${r} (deny) : chemin jamais consulte pour cet outil (documentation). Utilisez Edit(...) ou Read(...)`);
  }
  if (/^Bash\(/.test(r)) {
    ajouter("INFO", `${r} : une regle deny Bash arrete la forme habituelle, pas /usr/bin/... ni sh -c '...' (documentation). Ce n'est pas une frontiere : ajoutez le bac a sable.`);
  }
}

// 3. Mode de permission
if (perms.defaultMode === "bypassPermissions") {
  ajouter("ERREUR", "defaultMode bypassPermissions : plus aucune demande d'accord. La documentation le reserve aux conteneurs et machines virtuelles isolees. (Dans un settings de projet, il n'est de toute facon pas applique.)");
}
if (perms.defaultMode === "auto" ) {
  ajouter("INFO", "defaultMode auto dans un fichier de projet n'est pas applique (documentation) : reglez-le dans vos reglages utilisateur ou en ligne de commande");
}
if (perms.disableBypassPermissionsMode !== "disable") {
  ajouter("INFO", "pensez a \"disableBypassPermissionsMode\": \"disable\" pour vous interdire le mode sans demandes");
}

// 4. Serveurs MCP du projet
if (reglages.enableAllProjectMcpServers === true) {
  ajouter("ATTENTION", "enableAllProjectMcpServers : approuve tous les serveurs MCP d'un projet sans demande (documentation). Preferez enabledMcpjsonServers avec les noms voulus.");
}

if (constats.length === 0) {
  console.log("Aucun signal. Ce n'est PAS une preuve que les reglages sont sûrs.");
  process.exit(0);
}
const ordre = { ERREUR: 0, ATTENTION: 1, INFO: 2 };
constats.sort((a, b) => ordre[a.niveau] - ordre[b.niveau]);
for (const c of constats) console.log(`${c.niveau.padEnd(10)} ${c.texte}`);
const graves = constats.filter((c) => c.niveau !== "INFO").length;
console.log(graves === 0 ? "\nAucune erreur ni attention. Les INFO sont des rappels." : `\n${graves} point(s) a corriger.`);
process.exit(graves === 0 ? 0 : 1);
