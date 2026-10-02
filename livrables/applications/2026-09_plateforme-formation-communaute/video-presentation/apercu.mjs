// Aperçu : une capture d'écran de la vidéo à des instants choisis, pour vérifier les scènes sans tout enregistrer.
//   node apercu.mjs 10 40 90      (instants en secondes)
// Sans argument : un instant par scène, vers la fin de chaque scène (quand tout est apparu).
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { construireLigneDeTemps } from "./timeline.mjs";

const dossier = path.dirname(fileURLToPath(import.meta.url));
const TYPES = { ".html": "text/html; charset=utf-8", ".mjs": "text/javascript", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".css": "text/css" };
const serveur = http.createServer((req, res) => {
  const chemin = path.join(dossier, decodeURIComponent(new URL(req.url, "http://x").pathname));
  if (!chemin.startsWith(dossier) || !fs.existsSync(chemin) || fs.statSync(chemin).isDirectory()) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(chemin)] ?? "application/octet-stream" });
  fs.createReadStream(chemin).pipe(res);
});
await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
const port = serveur.address().port;

const narration = JSON.parse(fs.readFileSync(path.join(dossier, "sortie", "narration.json"), "utf8"));
const TL = construireLigneDeTemps(narration);
let instants = process.argv.slice(2).map(Number).filter((n) => !Number.isNaN(n));
if (!instants.length) instants = TL.scenes.map((s) => s.fin - 1.2);

fs.mkdirSync(path.join(dossier, "sortie", "apercu"), { recursive: true });
const nav = await chromium.launch();
const page = await nav.newPage({ viewport: { width: 1920, height: 1080 } });
const erreurs = [];
page.on("pageerror", (e) => erreurs.push(e.message));
for (const t of instants) {
  await page.goto(`http://127.0.0.1:${port}/scenes/index.html?t=${t}`);
  await page.waitForFunction("window.__pret === true", null, { timeout: 30000 });
  await page.waitForTimeout(1900); // laisse finir les transitions
  const f = path.join(dossier, "sortie", "apercu", `t-${String(Math.round(t)).padStart(3, "0")}.png`);
  await page.screenshot({ path: f });
  console.log(f);
}
console.log(erreurs.length ? "ERREURS : " + erreurs.join(" | ") : "aucune erreur JavaScript");
await nav.close();
serveur.close();
