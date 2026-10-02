// Fabrique la vignette de la vidéo de présentation (1280x720, JPEG) à partir de vignette/index.html.
//   node vignette.mjs
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const dossier = path.dirname(fileURLToPath(import.meta.url));
const TYPES = { ".html": "text/html; charset=utf-8", ".jpg": "image/jpeg", ".png": "image/png", ".css": "text/css" };
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
const nav = await chromium.launch();
const page = await nav.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(`http://127.0.0.1:${serveur.address().port}/vignette/index.html`);
await page.evaluate("document.fonts.ready");
await page.waitForTimeout(800);
fs.mkdirSync(path.join(dossier, "sortie"), { recursive: true });
const fichier = path.join(dossier, "sortie", "vignette.jpg");
await page.screenshot({ path: fichier, type: "jpeg", quality: 88 });
await nav.close();
serveur.close();
console.log(`${fichier} (${(fs.statSync(fichier).size / 1024).toFixed(0)} Ko)`);
