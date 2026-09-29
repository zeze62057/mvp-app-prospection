// Audit statique du code de la plateforme. Lecture seule : ne modifie rien.
// Ne renvoie jamais la valeur d'un secret, seulement fichier, ligne et type.
import { execFileSync, execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";

const SECRETS = [
  ["cle Supabase secrete", /sb_secret_[A-Za-z0-9_-]{10,}/],
  ["cle Anthropic", /sk-ant-[A-Za-z0-9_-]{20,}/],
  ["jeton JWT (service_role ou anon en dur)", /eyJ[A-Za-z0-9_-]{15,}\.eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{10,}/],
  ["cle privee", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["mot de passe Postgres dans une URL", /postgres(?:ql)?:\/\/[^:\s/]+:[^@\s]{4,}@/],
];

const git = (root, ...args) =>
  execFileSync("git", ["-C", root, ...args], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const trouve = (severite, regle, fichier, ligne, detail, correction) => ({
  severite, regle, fichier, ligne, detail, correction,
});

export function auditerCode(racineApp) {
  const constats = [];
  const racineGit = git(racineApp, "rev-parse", "--show-toplevel").trim();
  const suivis = git(racineApp, "ls-files", "--full-name", "--", ".").split("\n").filter(Boolean);
  const abs = (f) => join(racineGit, f);
  const rel = (f) => relative(racineGit, abs(f)).replaceAll("\\", "/");

  // 1. Fichiers d'environnement suivis par git
  for (const f of git(racineGit, "ls-files").split("\n")) {
    if (/(^|\/)\.env(\.|$)/.test(f) && !/\.example$/.test(f))
      constats.push(trouve("critique", "env-suivi-par-git", f, 0,
        "Fichier d'environnement suivi par git.", "git rm --cached, faire tourner les cles concernees."));
  }

  // 2. Secrets en clair, 3. comparaison de secret non constante, 4. controle d'acces
  for (const f of suivis) {
    if (!/\.(ts|tsx|js|mjs|json|sql|md|env\.example)$/.test(f) || f.includes("package-lock")) continue;
    let texte;
    try { texte = readFileSync(abs(f), "utf8"); } catch { continue; }
    const lignes = texte.split("\n");
    lignes.forEach((l, i) => {
      for (const [type, re] of SECRETS)
        if (re.test(l) && !/\.example$/.test(f))
          constats.push(trouve("critique", "secret-en-clair", rel(f), i + 1,
            `Motif de ${type} (valeur masquee).`, "Retirer du depot, faire tourner la cle, lire depuis l'environnement."));
      if (/(!==|===|!=|==)\s*process\.env\.[A-Z_]*(SECRET|TOKEN|KEY)/.test(l) ||
          /process\.env\.[A-Z_]*(SECRET|TOKEN|KEY)[A-Z_]*\s*(!==|===)/.test(l))
        constats.push(trouve("moyen", "comparaison-secret-non-constante", rel(f), i + 1,
          "Secret compare avec ===/!== : sensible aux attaques par mesure du temps.",
          "Utiliser crypto.timingSafeEqual sur des Buffers de meme longueur."));
    });

    const estRoute = /\/route\.ts$/.test(f);
    const estAction = /^\s*["']use server["']/m.test(texte);
    const aControle = /(auth\.getUser|getUser\(|x-webhook-secret|estAdmin|verifierAdmin|exigerAdmin|requireAdmin|est_admin|role\s*===?\s*["']admin)/.test(texte);
    if ((estRoute || estAction) && !aControle)
      constats.push(trouve(estRoute ? "eleve" : "moyen", estRoute ? "route-sans-controle-acces" : "action-serveur-sans-controle-acces",
        rel(f), 1, "Aucun controle explicite repere (heuristique) : la protection repose peut-etre sur le RLS Supabase seul.",
        "Verifier a la main : si volontairement publique, l'annoter ; sinon ajouter la verification serveur."));

    if (/createAdminClient\(/.test(texte) && !/lib\/supabase\/admin\.ts$/.test(f) && !aControle)
      constats.push(trouve("eleve", "service-role-sans-controle", rel(f), 1,
        "Utilise le client service_role (contourne le RLS) sans controle d'acces repere.",
        "Verifier l'identite de l'appelant avant tout usage du client admin."));
  }

  // 5. Dependances
  try {
    let sortie;
    try { sortie = execSync("npm audit --json", { cwd: racineApp, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }); }
    catch (e) { sortie = e.stdout; } // npm audit sort en erreur s'il trouve des failles
    const v = JSON.parse(sortie)?.metadata?.vulnerabilities ?? {};
    for (const niveau of ["critical", "high", "moderate"])
      if (v[niveau])
        constats.push(trouve(niveau === "critical" ? "critique" : niveau === "high" ? "eleve" : "moyen",
          "dependances-vulnerables", "package.json", 0, `${v[niveau]} vulnerabilite(s) ${niveau}.`,
          "npm audit pour le detail, puis mise a jour ciblee (proposition, pas automatique)."));
  } catch { constats.push(trouve("info", "npm-audit-indisponible", "package.json", 0, "npm audit n'a pas pu s'executer (reseau ?).", "Relancer.")); }

  const ordre = { critique: 0, eleve: 1, moyen: 2, info: 3 };
  return constats.sort((a, b) => ordre[a.severite] - ordre[b.severite]);
}
