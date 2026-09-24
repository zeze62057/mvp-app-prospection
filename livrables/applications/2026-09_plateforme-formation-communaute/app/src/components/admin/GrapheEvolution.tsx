// Courbe d'evolution en SVG a la main, meme logique que AnneauProgression : pas de librairie de
// graphiques dans le projet, inutile d'en ajouter une pour une seule courbe. Donnees reelles
// fournies par la page. Axe vertical gradue, grille, remplissage sous la courbe, bulle sur le
// dernier point ; chaque point garde une infobulle native (survol). `pasLibelle` : un libelle sur
// N, pour une courbe journaliere.
export function GrapheEvolution({
  points,
  pasLibelle = 1,
  etiquette = "Demandes d'adhésion",
}: {
  points: { libelle: string; valeur: number }[];
  pasLibelle?: number;
  etiquette?: string;
}) {
  const largeur = 640;
  const hauteur = 230;
  const margeGauche = 40;
  const margeDroite = 24;
  const haut = 22;
  const bas = 30;

  const max = Math.max(1, ...points.map((p) => p.valeur));
  // Plafond "rond" (1, 2, 5, 10, 20, 50...) pour des graduations lisibles.
  const magnitude = 10 ** Math.floor(Math.log10(max));
  const plafond = [1, 2, 5, 10].map((m) => m * magnitude).find((v) => v >= max) ?? max;
  const nbPas = plafond <= 4 ? plafond : 4; // petits effectifs : graduations entieres seulement
  const graduations = Array.from({ length: nbPas + 1 }, (_, i) => (plafond * i) / nbPas);

  const pas = points.length > 1 ? (largeur - margeGauche - margeDroite) / (points.length - 1) : 0;
  const x = (i: number) => margeGauche + i * pas;
  const y = (valeur: number) => hauteur - bas - (valeur / plafond) * (hauteur - bas - haut);

  const chemin = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.valeur).toFixed(1)}`).join(" ");
  const aire = `${chemin} L${x(points.length - 1).toFixed(1)},${y(0)} L${x(0).toFixed(1)},${y(0)} Z`;

  if (points.reduce((s, p) => s + p.valeur, 0) === 0) {
    return <p className="py-10 text-center text-[12.5px] text-[var(--texte-mute)]">Aucune donnée sur cette période.</p>;
  }

  const dernier = points[points.length - 1];
  const bulleX = Math.min(x(points.length - 1), largeur - margeDroite - 14);

  return (
    <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="w-full" role="img" aria-label={`Évolution : ${etiquette}`}>
      <defs>
        <linearGradient id="aire-evolution" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sarcelle)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--sarcelle)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {graduations.map((g) => (
        <g key={g}>
          <line x1={margeGauche} x2={largeur - margeDroite} y1={y(g)} y2={y(g)} stroke="var(--ligne)" strokeWidth="1" />
          <text x={margeGauche - 8} y={y(g) + 3} textAnchor="end" fontSize="9.5" fill="var(--texte-mute)" fontFamily="var(--font-mono)">
            {Number.isInteger(g) ? g : g.toFixed(1)}
          </text>
        </g>
      ))}

      <path d={aire} fill="url(#aire-evolution)" />
      <path d={chemin} fill="none" stroke="var(--sarcelle)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {points.map((p, i) => (
        <circle key={i} cx={x(i)} cy={y(p.valeur)} r={points.length > 15 ? 2.5 : 3.5} fill="var(--sarcelle)">
          <title>{`${p.libelle} : ${p.valeur}`}</title>
        </circle>
      ))}

      <g>
        <rect x={bulleX - 16} y={y(dernier.valeur) - 26} width="32" height="18" rx="9" fill="var(--encre)" />
        <text x={bulleX} y={y(dernier.valeur) - 14} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--sur-encre)" fontFamily="var(--font-mono)">
          {dernier.valeur}
        </text>
      </g>

      {points.map((p, i) =>
        i % pasLibelle !== 0 && i !== points.length - 1 ? null : (
          <text key={i} x={x(i)} y={hauteur - 8} textAnchor="middle" fontSize="9.5" fill="var(--texte-mute)" fontFamily="var(--font-mono)">
            {p.libelle}
          </text>
        )
      )}
    </svg>
  );
}
