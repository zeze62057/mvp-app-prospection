import { Fragment } from "react";

// Convention legere pour le contenu vitrine stocke en base :
// "*mot*" -> accent italique (couleur sarcelle), "**mot**" -> gras, "\n" -> saut de ligne.
// Volontairement minimal (pas de vrai markdown) : ce texte vient de nous, pas d'un tiers.
export function TexteRiche({ texte }: { texte: string }) {
  const lignes = texte.split("\n");
  return (
    <>
      {lignes.map((ligne, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {formatterLigne(ligne)}
        </Fragment>
      ))}
    </>
  );
}

function formatterLigne(ligne: string) {
  const morceaux = ligne.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return morceaux.map((m, i) => {
    if (m.startsWith("**") && m.endsWith("**")) {
      return <b key={i}>{m.slice(2, -2)}</b>;
    }
    if (m.startsWith("*") && m.endsWith("*")) {
      return (
        <em key={i} className="text-[var(--sarcelle)]">
          {m.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{m}</Fragment>;
  });
}
