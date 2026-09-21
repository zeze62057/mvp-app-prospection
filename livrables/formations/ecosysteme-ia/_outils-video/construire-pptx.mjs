// Construit le PowerPoint anime d'un chapitre a partir de son fichier de description (JSON).
//
//   npm install                                   (une seule fois, dans ce dossier)
//   node construire-pptx.mjs <chemin/diapositives.json>
//
// Le fichier .pptx est ecrit a cote du JSON (nom donne par "sortie"). Voir README.md pour le
// format du JSON et la liste des mises en page.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pptxgen from "pptxgenjs";
import JSZip from "jszip";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const specChemin = path.resolve(process.argv[2] ?? "");
if (!process.argv[2] || !fs.existsSync(specChemin)) {
  console.error("Usage : node construire-pptx.mjs <chemin/diapositives.json>");
  process.exit(1);
}
// Les notes peuvent citer {{tN}} : l'heure de la N-ieme ligne du tableau de 01-script.md (le fichier voisin).
// Cela evite de recopier a la main des heures qui changent a chaque retouche du script.
let specBrut = fs.readFileSync(specChemin, "utf8");
const scriptVoisin = path.join(path.dirname(specChemin), "01-script.md");
if (fs.existsSync(scriptVoisin)) {
  const heures = [...fs.readFileSync(scriptVoisin, "utf8").matchAll(/^\| (\d+:\d\d) \|/gm)].map((m) => m[1]);
  specBrut = specBrut.replace(/\{\{t(\d+)\}\}/g, (_, n) => heures[n - 1] ?? "?:??");
}
const spec = JSON.parse(specBrut);
const sortiePptx = path.join(path.dirname(specChemin), spec.sortie ?? "diapositives.pptx");
const SRC_FOND = path.join(ICI, "assets", "fond-robot.jpg"); // 588 x 330
const SRC_LOGO = path.join(ICI, "assets", "logo-vivier-ia.jpg"); // 1280 x 853
const TMP = path.join(ICI, "_img");
fs.mkdirSync(TMP, { recursive: true });
const avertissements = [];
const avertir = (m) => avertissements.push(m);

// ---------------------------------------------------------------------------
// Fonds : l'image du robot recadree (zoom, position) sous un voile sombre integre a l'image.
// Les diapositives se suivent avec des cadrages differents ; la derniere est teintee.
// ---------------------------------------------------------------------------
const W = 588;
const H = 330;
const RECETTES = [
  { zoom: 1.7, x: 0.22, y: 0.45, voile: 0.84 }, // visage de profil
  { zoom: 2.2, x: 0.88, y: 0.68, voile: 0.8 }, // hexagones a droite
  { zoom: 2, x: 0.12, y: 0.22, voile: 0.88 }, // circuits de la tete
  { zoom: 1.9, x: 0.96, y: 0.96, voile: 0.86 }, // hexagones en bas a droite
  { zoom: 1.4, x: 0.55, y: 0.92, voile: 0.86 }, // bas de l'image
];
const RECETTE_FIN = { zoom: 1.2, x: 0.35, y: 0.5, voile: 0.82, teinte: { hue: 150, saturation: 1.2 } };
const VOILE_COUVERTURE = `
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#113832" stop-opacity="0.05"/>
    <stop offset="0.38" stop-color="#113832" stop-opacity="0.30"/>
    <stop offset="0.52" stop-color="#113832" stop-opacity="0.90"/>
    <stop offset="1" stop-color="#113832" stop-opacity="0.94"/>
  </linearGradient></defs>
  <rect width="1920" height="1080" fill="url(#g)"/>`;

async function fond(nom, r, voileSvg) {
  const cw = Math.round(W / r.zoom);
  const ch = Math.round(H / r.zoom);
  const left = Math.round((W - cw) * r.x);
  const top = Math.round((H - ch) * r.y);
  let img = sharp(SRC_FOND).extract({ left, top, width: cw, height: ch }).resize(1920, 1080, { fit: "cover" });
  if (r.teinte) img = img.modulate({ hue: r.teinte.hue, saturation: r.teinte.saturation });
  const voile = voileSvg ?? `<rect width="1920" height="1080" fill="#113832" fill-opacity="${r.voile}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">${voile}</svg>`;
  const fichier = path.join(TMP, `${nom}.jpg`);
  await img.composite([{ input: Buffer.from(svg) }]).jpeg({ quality: 88 }).toFile(fichier);
  return fichier;
}

// ---------------------------------------------------------------------------
// Logo transparent : fond clair retire, couleurs sombres eclaircies pour un fond sombre.
// ---------------------------------------------------------------------------
const BRUT = await sharp(SRC_LOGO).raw().toBuffer({ resolveWithObject: true });
const { width: LW, height: LH, channels: LC } = BRUT.info;
const pixel = (x, y) => [0, 1, 2].map((k) => BRUT.data[(y * LW + x) * LC + k]);
const FOND_LOGO = pixel(5, 5);
const CLASSES = [
  { origine: [17, 56, 52], nouvelle: [242, 247, 245] }, // texte "Vivier IA"
  { origine: [24, 144, 122], nouvelle: [95, 199, 184] }, // cle et slogan
  { origine: [255, 122, 77], nouvelle: [255, 122, 77] }, // point corail
];
const sortieLogo = Buffer.alloc(LW * LH * 4);
let minx = LW, miny = LH, maxx = 0, maxy = 0;
for (let y = 0; y < LH; y++) {
  for (let x = 0; x < LW; x++) {
    const c = pixel(x, y);
    let meilleur = null;
    for (const cl of CLASSES) {
      const d = [0, 1, 2].map((k) => cl.origine[k] - FOND_LOGO[k]);
      const v = [0, 1, 2].map((k) => c[k] - FOND_LOGO[k]);
      const t = Math.max(0, Math.min(1, (v[0] * d[0] + v[1] * d[1] + v[2] * d[2]) / (d[0] * d[0] + d[1] * d[1] + d[2] * d[2])));
      const rec = [0, 1, 2].map((k) => FOND_LOGO[k] + t * d[k]);
      const residu = Math.hypot(c[0] - rec[0], c[1] - rec[1], c[2] - rec[2]);
      if (!meilleur || residu < meilleur.residu) meilleur = { cl, t, residu };
    }
    let alpha = meilleur.t;
    if (alpha < 0.07) alpha = 0;
    else if (alpha > 0.93) alpha = 1;
    const o = (y * LW + x) * 4;
    sortieLogo[o] = meilleur.cl.nouvelle[0];
    sortieLogo[o + 1] = meilleur.cl.nouvelle[1];
    sortieLogo[o + 2] = meilleur.cl.nouvelle[2];
    sortieLogo[o + 3] = Math.round(alpha * 255);
    if (alpha > 0.3) { minx = Math.min(minx, x); maxx = Math.max(maxx, x); miny = Math.min(miny, y); maxy = Math.max(maxy, y); }
  }
}
const M = 6;
const lx = Math.max(0, minx - M), ly = Math.max(0, miny - M);
const lw = Math.min(LW - lx, maxx - minx + 1 + 2 * M), lh = Math.min(LH - ly, maxy - miny + 1 + 2 * M);
const FICHIER_LOGO = path.join(TMP, "logo-vivier-ia-transparent.png");
await sharp(sortieLogo, { raw: { width: LW, height: LH, channels: 4 } }).extract({ left: lx, top: ly, width: lw, height: lh }).png().toFile(FICHIER_LOGO);
const RATIO_LOGO = lh / lw;

// ---------------------------------------------------------------------------
// Outils de mise en page (canevas 13,333 x 7,5 pouces).
// ---------------------------------------------------------------------------
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Zézé Bilivogui";
pptx.company = "Vivier IA";
pptx.title = spec.titre ?? "Vivier IA";
pptx.subject = spec.sujet ?? "Vivier IA";

const C = { encre: "113832", sarcelle: "2B8C82", sarcelleClair: "5FC7B8", corail: "FF7A4D", fond: "F2F7F5", texteClair: "BFD8D5", encreClaire: "1D4A43" };
const TITRE = "Arial";
const TEXTE = "Calibri";
const CODE = "Courier New";
const ML = 0.889;
const LARGEUR_UTILE = 11.556;

// Espace insecable avant : ; ? ! et » (typographie francaise).
const nb = (s) => s.replace(/ ([:;?!»])/g, " $1");

// Balisage des textes : *mot* passe en couleur d'accent ; \n force un retour a la ligne.
function runs(chaine, couleur, accent = C.corail) {
  const lignes = String(chaine).split("\n");
  const sortie = [];
  lignes.forEach((ligne, i) => {
    ligne.split("*").forEach((seg, k) => {
      if (seg === "") return;
      sortie.push({ text: nb(seg), options: { color: k % 2 === 1 ? accent : couleur } });
    });
    if (i < lignes.length - 1 && sortie.length) sortie[sortie.length - 1].options.breakLine = true;
  });
  return sortie;
}

function texte(slide, contenu, o) {
  const c = typeof contenu === "string" ? nb(contenu) : contenu;
  slide.addText(c, { isTextBox: true, margin: 0, valign: "top", fontFace: TEXTE, ...o });
}
// Attention : dans pptxgenjs, `margin` est en POINTS, ordre [gauche, droite, bas, haut].
function boite(slide, contenu, o) {
  const c = typeof contenu === "string" ? nb(contenu) : contenu;
  slide.addText(c, { shape: pptx.ShapeType.roundRect, rectRadius: o.rayon ?? 0.15, align: "center", valign: "middle", margin: [10, 10, 0, 0], fontFace: TITRE, bold: true, ...o });
}
function logo(slide, o) {
  slide.addImage({ path: FICHIER_LOGO, x: o.x, y: o.y, w: o.w, h: o.w * RATIO_LOGO, altText: "Logo Vivier IA : le vivier des talents IA francophones", objectName: "logo" });
}
const logoPetit = (slide) => logo(slide, { x: 13.333 - 0.55 - 1.3, y: 0.5, w: 1.3 });
function surtitre(slide, s, o = {}) {
  texte(slide, s, { x: ML, y: ML, w: 9.5, h: 0.4, fontSize: 13, bold: true, charSpacing: 1, color: C.sarcelleClair, fontFace: TITRE, ...o });
}
function titreDiapo(slide, t, o = {}) {
  const brut = String(t).replace(/\*/g, "").replace(/\n/g, " ");
  const taille = o.taille ?? (brut.length > 38 ? 28 : 30);
  if (brut.length > 44 && !String(t).includes("\n")) avertir(`Titre long (${brut.length} caracteres) : coupez-le avec \\n pour qu'il ne touche pas le logo : « ${brut} »`);
  texte(slide, runs(t, C.fond), { x: ML, y: 1.35, w: 10.1, h: 0.9, fontSize: taille, bold: true, fontFace: TITRE, ...o });
}
const largeurBoite = (n) => (n <= 4 ? 1.9 : n <= 8 ? 2.6 : n <= 12 ? 3.4 : 4.2);

// Animations. Une etape = un clic (ou un demarrage automatique) ; ses effets partent ensemble,
// chacun avec son delai. Chaque objet anime est retrouve par son nom.
const fondu = (nom, delai = 0, duree = 500) => ({ nom, effet: "fondu", delai, duree });
const balayage = (nom, delai = 0, duree = 700) => ({ nom, effet: "balayage", delai, duree });

// ---------------------------------------------------------------------------
// Mises en page. Chacune recoit (slide, d, i) et renvoie ses etapes d'animation.
// ---------------------------------------------------------------------------
const MISES_EN_PAGE = {
  // Couverture : texte a droite (la tete du robot reste visible a gauche), tout s'anime seul.
  titre(s, d, i) {
    logo(s, { x: 13.333 - 0.7 - 2.3, y: 5.55, w: 2.3 });
    const X = 6.39, Wc = 6.05;
    texte(s, d.surtitre, { x: X, y: 1.1, w: Wc, h: 0.5, fontSize: 13, bold: true, charSpacing: 1, color: C.sarcelleClair, fontFace: TITRE, objectName: `s${i}-surtitre` });
    texte(s, runs(d.titre, C.fond), { x: X, y: 1.85, w: Wc, h: 1.9, fontSize: 34, bold: true, fontFace: TITRE, lineSpacingMultiple: 1.05, objectName: `s${i}-titre` });
    if (String(d.titre).length > 60) avertir(`Titre de couverture long (${String(d.titre).length} caracteres) : il risque de depasser 3 lignes.`);
    texte(s, d.objectif, { x: X, y: 3.75, w: Wc, h: 0.9, fontSize: 17, color: C.texteClair, objectName: `s${i}-objectif` });
    let x = X, y = 4.95;
    const effets = [fondu("logo", 0, 700), fondu(`s${i}-surtitre`, 300), balayage(`s${i}-titre`, 700, 900), fondu(`s${i}-objectif`, 1500)];
    (d.pastilles ?? []).forEach((p, k) => {
      const w = Math.round((0.9 + 0.12 * p.length) * 10) / 10;
      if (x > X && x + w > X + Wc) { x = X; y += 0.7; }
      boite(s, [{ text: `${k + 1}  `, options: { color: C.corail } }, { text: nb(p) }], { x, y, w, h: 0.5, rayon: 0.25, fill: { color: C.encreClaire }, color: C.fond, fontSize: 14, objectName: `s${i}-pastille-${k}` });
      effets.push(fondu(`s${i}-pastille-${k}`, 2100 + k * 400));
      x += w + 0.2;
    });
    return [{ auto: true, effets }];
  },

  // Rangees de cases reliees par des fleches (ex. Avant / Maintenant). La 1re rangee est visible,
  // les suivantes puis la phrase finale arrivent au clic.
  flux(s, d, i) {
    logoPetit(s);
    surtitre(s, d.surtitre);
    if ((d.rangees ?? []).length > 2) avertir("flux : 2 rangees maximum.");
    const steps = [];
    d.rangees.slice(0, 2).forEach((r, k) => {
      const yEtiquette = 1.65 + k * 1.9;
      const y = 2.05 + k * 1.9;
      // Styles : "gris" (cases claires neutres) ou "clair" (cases blanches, une case peut etre mise en avant).
      // "ancien" et "nouveau" sont acceptes comme anciens noms de ces deux styles.
      const nouveau = r.style === "nouveau" || r.style === "clair";
      const cases = r.boites.map((b) => (typeof b === "string" ? { t: b } : b));
      let total = cases.reduce((t, b) => t + largeurBoite(b.t.length), 0) + 1.3 * (cases.length - 1);
      const echelle = total > 11.5 ? 11.5 / total : 1;
      const noms = [];
      texte(s, r.etiquette, { x: ML, y: yEtiquette, w: 5, h: 0.35, fontSize: 13, bold: true, charSpacing: 1, color: C.texteClair, fontFace: TITRE, objectName: `s${i}-r${k}-etiquette` });
      noms.push(`s${i}-r${k}-etiquette`);
      let x = ML;
      cases.forEach((b, j) => {
        const w = largeurBoite(b.t.length) * echelle;
        const accent = nouveau && b.accent;
        boite(s, b.t, { x, y, w, h: 1.0, fontSize: 22, fill: { color: nouveau ? (accent ? C.sarcelle : C.fond) : "E1ECE8" }, color: nouveau ? (accent ? C.fond : C.encre) : "4A6660", objectName: `s${i}-r${k}-b${j}` });
        noms.push(`s${i}-r${k}-b${j}`);
        x += w;
        if (j < cases.length - 1) {
          const fc = nouveau ? C.sarcelleClair : C.texteClair;
          s.addShape(pptx.ShapeType.rightArrow, { x: x + 0.25, y: y + 0.3, w: 0.8, h: 0.4, fill: { color: fc }, line: { color: fc, width: 0.5 }, objectName: `s${i}-r${k}-f${j}` });
          noms.push(`s${i}-r${k}-f${j}`);
          x += 1.3 * echelle;
        }
      });
      if (k > 0) steps.push({ auto: false, effets: noms.map((n, p) => fondu(n, p * 160)) });
    });
    if (d.phrase) {
      texte(s, runs(d.phrase, C.fond), { x: ML, y: 5.55, w: 11.5, h: 0.7, fontSize: 28, bold: true, fontFace: TITRE, objectName: `s${i}-phrase` });
      steps.push({ auto: false, effets: [balayage(`s${i}-phrase`, 0, 800)] });
    }
    return steps;
  },

  // 2 a 4 cartes, une par clic. Avec "code", la carte montre une commande (mise en page 2 colonnes).
  cartes(s, d, i) {
    logoPetit(s);
    surtitre(s, d.surtitre);
    titreDiapo(s, d.titre);
    const n = d.cartes.length;
    if (n < 2 || n > 4) avertir("cartes : 2 a 4 cartes.");
    const avecCode = d.cartes.some((c) => c.code);
    const numerote = d.numerote ?? !avecCode;
    const cw = (LARGEUR_UTILE - 0.4 * (n - 1)) / n;
    const steps = [];
    d.cartes.forEach((c, k) => {
      const x = ML + k * (cw + 0.4);
      const y = numerote ? 2.6 : 2.5;
      const p = `s${i}-c${k}`;
      const h = numerote ? 3.9 : avecCode ? 3.75 : 3.1;
      s.addShape(pptx.ShapeType.roundRect, { x, y, w: cw, h, rectRadius: 0.18, fill: { color: "FFFFFF" }, line: { color: "D3E3DE", width: 1 }, objectName: `${p}-forme` });
      const effets = [fondu(`${p}-forme`, 0, 600)];
      if (numerote) {
        texte(s, String(c.numero ?? k + 1), { x: x + 0.3, y: y + 0.2, w: 1, h: 0.85, fontSize: 44, bold: true, color: C.corail, fontFace: TITRE, objectName: `${p}-num` });
        texte(s, c.titre, { x: x + 0.3, y: y + 1.1, w: cw - 0.6, h: 1.05, fontSize: 20, bold: true, color: C.encre, fontFace: TITRE, objectName: `${p}-titre` });
        texte(s, c.texte, { x: x + 0.3, y: y + 2.3, w: cw - 0.6, h: 1.4, fontSize: 15, color: "2F4F4A", objectName: `${p}-texte` });
        effets.push(fondu(`${p}-num`, 150), fondu(`${p}-titre`, 250), fondu(`${p}-texte`, 400));
      } else {
        texte(s, c.titre, { x: x + 0.35, y: y + 0.3, w: cw - 0.7, h: 0.5, fontSize: 20, bold: true, color: C.encre, fontFace: TITRE, objectName: `${p}-titre` });
        texte(s, c.texte, { x: x + 0.35, y: y + 0.95, w: cw - 0.7, h: 1.2, fontSize: 15, color: "2F4F4A", objectName: `${p}-texte` });
        effets.push(fondu(`${p}-titre`, 150), fondu(`${p}-texte`, 250));
        if (c.code) {
          const lignes = Array.isArray(c.code) ? c.code : [c.code];
          const contenu = lignes.map((l, j) => ({ text: l, options: j < lignes.length - 1 ? { breakLine: true } : {} }));
          boite(s, contenu, { x: x + 0.35, y: y + 2.3, w: cw - 0.7, h: 1.05, rayon: 0.1, fontSize: 13, fontFace: CODE, fill: { color: C.encre }, color: C.fond, align: "left", margin: [16, 16, 0, 0], objectName: `${p}-code` });
          effets.push(balayage(`${p}-code`, 450, 600));
        }
      }
      steps.push({ auto: false, effets });
    });
    return steps;
  },

  // Deux cartes contrastees, l'ancienne facon et la nouvelle.
  "avant-apres"(s, d, i) {
    logoPetit(s);
    surtitre(s, d.surtitre);
    titreDiapo(s, d.titre, { taille: 32 });
    if (d.intro) texte(s, d.intro, { x: ML, y: 2.3, w: 10.5, h: 0.5, fontSize: 18, color: C.texteClair });
    const cw = 5.578;
    const steps = [];
    [["avant", d.avant, C.encreClaire, C.texteClair, C.fond, C.texteClair], ["apres", d.apres, C.corail, C.encre, C.encre, C.encre]].forEach(([cle, c, fond, coulEtiq, coulTitre, coulCorps], k) => {
      const x = ML + k * (cw + 0.4);
      const p = `s${i}-${cle}`;
      s.addShape(pptx.ShapeType.roundRect, { x, y: 3.2, w: cw, h: 2.7, rectRadius: 0.18, fill: { color: fond }, line: { color: fond, width: 0.5 }, objectName: `${p}-forme` });
      texte(s, c.etiquette, { x: x + 0.4, y: 3.5, w: 4, h: 0.35, fontSize: 13, bold: true, charSpacing: 1, color: coulEtiq, fontFace: TITRE, objectName: `${p}-etiquette` });
      texte(s, c.titre, { x: x + 0.4, y: 4.0, w: cw - 0.8, h: 0.6, fontSize: 24, bold: true, color: coulTitre, fontFace: TITRE, objectName: `${p}-titre` });
      texte(s, c.texte, { x: x + 0.4, y: 4.75, w: cw - 0.8, h: 0.9, fontSize: 17, color: coulCorps, objectName: `${p}-texte` });
      steps.push({ auto: false, effets: [fondu(`${p}-forme`, 0, 600), fondu(`${p}-etiquette`, 150), fondu(`${p}-titre`, 250), fondu(`${p}-texte`, 400)] });
    });
    return steps;
  },

  // 1 a 4 lignes numerotees : une etiquette et, au choix, une commande (boite sombre) ou un detail.
  commandes(s, d, i) {
    logoPetit(s);
    surtitre(s, d.surtitre);
    titreDiapo(s, d.titre, { taille: d.taille_titre ?? 28 });
    const n = d.lignes.length;
    if (n > 4) avertir("commandes : 4 lignes maximum.");
    const pas = Math.min(1.3, 3.9 / n);
    const steps = [];
    d.lignes.forEach((l, k) => {
      const y = 2.4 + k * pas;
      const p = `s${i}-l${k}`;
      // Avec un detail (texte, pas une commande), un cadre discret regroupe le numero, l'etiquette et le detail :
      // sans lui, le detail est aussi loin de son etiquette que de la ligne suivante.
      const cadre = Boolean(l.detail);
      const effets = [];
      if (cadre) {
        s.addShape(pptx.ShapeType.roundRect, { x: 1.6, y: y - 0.08, w: 10.9, h: Math.min(0.95, pas - 0.12), rectRadius: 0.12, fill: { color: "FFFFFF", transparency: 90 }, line: { color: C.sarcelle, width: 0.75 }, objectName: `${p}-cadre` });
        effets.push(fondu(`${p}-cadre`, 0, 500));
      }
      texte(s, String(k + 1), { x: ML, y: cadre ? y + 0.03 : y + 0.42, w: 0.7, h: 0.72, fontSize: 26, bold: true, color: C.corail, fontFace: TITRE, valign: "middle", objectName: `${p}-num` });
      texte(s, l.etiquette, { x: 1.75, y: cadre ? y - 0.02 : y, w: 9, h: 0.35, fontSize: 16, bold: true, color: C.texteClair, objectName: `${p}-etiquette` });
      effets.push(fondu(`${p}-num`), fondu(`${p}-etiquette`, 100));
      if (l.commande) {
        if (l.commande.length > 60) avertir(`commandes : commande longue (${l.commande.length} caracteres), elle risque de deborder : ${l.commande}`);
        const w = Math.min(10.4, Math.max(2.2, 0.9 + 0.1667 * l.commande.length));
        boite(s, l.commande, { x: 1.75, y: y + 0.42, w, h: 0.72, rayon: 0.1, fontSize: 20, fontFace: CODE, fill: { color: "0B2622" }, line: { color: C.sarcelle, width: 1.5 }, color: C.fond, align: "left", margin: [18, 18, 0, 0], objectName: `${p}-code` });
        effets.push(balayage(`${p}-code`, 300, 600));
      } else if (l.detail) {
        texte(s, l.detail, { x: 1.75, y: y + 0.3, w: 10.5, h: 0.5, fontSize: 18, color: C.fond, objectName: `${p}-detail` });
        effets.push(fondu(`${p}-detail`, 250));
      }
      steps.push({ auto: false, effets });
    });
    return steps;
  },

  // Titre en deux lignes, jusqu'a 3 points (un par clic), puis une annonce finale.
  points(s, d, i) {
    logoPetit(s);
    surtitre(s, d.surtitre);
    texte(s, runs(d.titre, C.fond), { x: ML, y: 1.5, w: 9.2, h: 1.3, fontSize: 30, bold: true, fontFace: TITRE, objectName: `s${i}-titre` });
    const max = d.final ? 3 : 5;
    if (d.points.length > max) avertir(`points : ${max} points maximum${d.final ? " avec une annonce finale" : ""}.`);
    const steps = [{ auto: true, effets: [balayage(`s${i}-titre`, 0, 800)] }];
    d.points.slice(0, max).forEach((p, k) => {
      texte(s, p, { x: ML, y: 3.25 + k * 0.8, w: 11.4, h: 0.6, fontSize: 22, color: C.texteClair, bullet: true, objectName: `s${i}-point-${k}` });
      steps.push({ auto: false, effets: [fondu(`s${i}-point-${k}`)] });
    });
    if (d.final) {
      boite(s, d.final, { x: ML, y: 5.7, w: LARGEUR_UTILE, h: 0.95, rayon: 0.2, fontSize: 18, fill: { color: C.corail }, color: C.encre, objectName: `s${i}-final` });
      steps.push({ auto: false, effets: [balayage(`s${i}-final`, 0, 700)] });
    }
    return steps;
  },

  // Une grande phrase a retenir, puis une phrase d'appui au clic.
  enonce(s, d, i) {
    logoPetit(s);
    surtitre(s, d.surtitre);
    if (String(d.enonce).length > 110) avertir(`enonce : phrase longue (${String(d.enonce).length} caracteres).`);
    texte(s, runs(d.enonce, C.fond), { x: ML, y: 2.2, w: 10.6, h: 2.4, fontSize: 36, bold: true, fontFace: TITRE, lineSpacingMultiple: 1.05, objectName: `s${i}-enonce` });
    const steps = [{ auto: true, effets: [balayage(`s${i}-enonce`, 0, 900)] }];
    if (d.appui) {
      texte(s, d.appui, { x: ML, y: 4.8, w: 10.6, h: 1.4, fontSize: 20, color: C.texteClair, objectName: `s${i}-appui` });
      steps.push({ auto: false, effets: [fondu(`s${i}-appui`, 0, 600)] });
    }
    return steps;
  },
};

// ---------------------------------------------------------------------------
// Construction.
// ---------------------------------------------------------------------------
const animations = {};
const diapos = spec.diapositives;
let numeroMilieu = 0;
for (let k = 0; k < diapos.length; k++) {
  const d = diapos[k];
  const i = k + 1;
  const mep = MISES_EN_PAGE[d.type];
  if (!mep) throw new Error(`diapositive ${i} : mise en page inconnue « ${d.type} » (disponibles : ${Object.keys(MISES_EN_PAGE).join(", ")})`);
  const s = pptx.addSlide();
  const estCouverture = d.type === "titre";
  const derniere = k === diapos.length - 1 && !estCouverture && diapos.length > 1;
  let recette = derniere ? RECETTE_FIN : RECETTES[numeroMilieu % RECETTES.length];
  if (!estCouverture && !derniere) numeroMilieu++;
  if (d.fond) recette = { ...recette, ...d.fond };
  s.background = { path: estCouverture ? await fond(`fond-${i}`, { zoom: 1, x: 0.5, y: 0.5 }, VOILE_COUVERTURE) : await fond(`fond-${i}`, recette) };
  animations[i] = mep(s, d, i);
  if (d.notes) s.addNotes(d.notes);
  else avertir(`diapositive ${i} : pas de notes de l'orateur.`);
}
await pptx.writeFile({ fileName: sortiePptx });

// ---------------------------------------------------------------------------
// Post-traitement : transition (fondu) et chronologie des animations, ecrites dans le XML.
// ---------------------------------------------------------------------------
const EFFETS = {
  fondu: { presetID: 10, sousType: 0, filtre: "fade" },
  balayage: { presetID: 22, sousType: 8, filtre: "wipe(left)" },
};

function chronologie(etapes, idDe) {
  let n = 2;
  const suivant = () => ++n;
  const xmlEtapes = etapes.map((etape) => {
    const idEtape = suivant();
    const idInterne = suivant();
    const effets = etape.effets.map((e, k) => {
      const spid = idDe(e.nom);
      if (spid === undefined) throw new Error(`objet introuvable pour l'animation : ${e.nom}`);
      const { presetID, sousType, filtre } = EFFETS[e.effet];
      const idEffet = suivant(), idFixe = suivant(), idAnim = suivant();
      const typeNoeud = k === 0 ? (etape.auto ? "afterEffect" : "clickEffect") : "withEffect";
      return (
        `<p:par><p:cTn id="${idEffet}" presetID="${presetID}" presetClass="entr" presetSubtype="${sousType}" fill="hold" nodeType="${typeNoeud}">` +
        `<p:stCondLst><p:cond delay="${e.delai}"/></p:stCondLst><p:childTnLst>` +
        `<p:set><p:cBhvr><p:cTn id="${idFixe}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>` +
        `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>` +
        `<p:to><p:strVal val="visible"/></p:to></p:set>` +
        `<p:animEffect transition="in" filter="${filtre}"><p:cBhvr><p:cTn id="${idAnim}" dur="${e.duree}"/>` +
        `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par>`
      );
    });
    const declencheur = etape.auto ? `<p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>` : `<p:cond delay="indefinite"/>`;
    return (
      `<p:par><p:cTn id="${idEtape}" fill="hold"><p:stCondLst>${declencheur}</p:stCondLst><p:childTnLst>` +
      `<p:par><p:cTn id="${idInterne}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effets.join("")}</p:childTnLst></p:cTn></p:par>` +
      `</p:childTnLst></p:cTn></p:par>`
    );
  });
  return (
    `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>` +
    `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${xmlEtapes.join("")}</p:childTnLst></p:cTn>` +
    `<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>` +
    `<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>` +
    `</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`
  );
}

const zip = await JSZip.loadAsync(fs.readFileSync(sortiePptx));
let nbEffets = 0;
let nbClics = 0;
for (const [num, etapes] of Object.entries(animations)) {
  const nomFichier = `ppt/slides/slide${num}.xml`;
  let xml = await zip.file(nomFichier).async("string");
  const ids = new Map([...xml.matchAll(/<p:cNvPr id="(\d+)" name="([^"]*)"/g)].map((m) => [m[2], m[1]]));
  if (!xml.includes("</p:clrMapOvr>")) throw new Error(`clrMapOvr introuvable dans ${nomFichier}`);
  xml = xml.replace("</p:clrMapOvr>", "</p:clrMapOvr>" + `<p:transition spd="med"><p:fade/></p:transition>` + chronologie(etapes, (nom) => ids.get(nom)));
  zip.file(nomFichier, xml);
  nbEffets += etapes.reduce((t, e) => t + e.effets.length, 0);
  nbClics += etapes.filter((e) => !e.auto).length;
}
fs.writeFileSync(sortiePptx, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
console.log(`OK : ${sortiePptx}`);
console.log(`${diapos.length} diapositives, ${nbEffets} effets, ${nbClics} clics en tout (${(fs.statSync(sortiePptx).size / 1024).toFixed(0)} Ko)`);
avertissements.forEach((a) => console.warn("ATTENTION : " + a));
