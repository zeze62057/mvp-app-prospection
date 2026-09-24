// Courbe d'evolution en SVG a la main, meme logique que AnneauProgression :
// pas de librairie de graphiques dans le projet, inutile d'en ajouter une pour
// une seule courbe. Donnees reelles fournies par la page (comptage mensuel).
export function GrapheEvolution({ points }: { points: { libelle: string; valeur: number }[] }) {
  const largeur = 640;
  const hauteur = 220;
  const marge = 28;
  const max = Math.max(1, ...points.map((p) => p.valeur));
  const pas = points.length > 1 ? (largeur - marge * 2) / (points.length - 1) : 0;

  const coord = (i: number, valeur: number) => {
    const x = marge + i * pas;
    const y = hauteur - marge - (valeur / max) * (hauteur - marge * 2);
    return { x, y };
  };

  const chemin = points
    .map((p, i) => {
      const { x, y } = coord(i, p.valeur);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const totalPeriode = points.reduce((s, p) => s + p.valeur, 0);

  if (totalPeriode === 0) {
    return <p className="py-10 text-center text-[12.5px] text-[var(--texte-mute)]">Aucune inscription sur cette période.</p>;
  }

  return (
    <svg viewBox={`0 0 ${largeur} ${hauteur}`} className="w-full" role="img" aria-label="Évolution des inscriptions sur 12 mois">
      <path d={chemin} fill="none" stroke="var(--sarcelle)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => {
        const { x, y } = coord(i, p.valeur);
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--sarcelle)" />;
      })}
      {points.map((p, i) => {
        const { x } = coord(i, p.valeur);
        return (
          <text key={i} x={x} y={hauteur - 6} textAnchor="middle" fontSize="9.5" fill="var(--texte-mute)" fontFamily="var(--font-mono)">
            {p.libelle}
          </text>
        );
      })}
    </svg>
  );
}
