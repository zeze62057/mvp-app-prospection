import { TITRES_MODULES_INTERACTIFS } from "@/lib/modules-interactifs";

// Couverture d'un module interactif : fond SVG (public/vignettes/vivier-ia/modules/), texte
// superpose ici car un SVG charge comme image n'affiche pas les polices de la page.
// Le symbole est a droite, le texte a gauche.
export function CouvertureModule({
  numero,
  className,
  banniere = false,
}: {
  numero: number;
  className: string;
  banniere?: boolean;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(/vignettes/vivier-ia/modules/module-${numero}.svg)` }}
      role="img"
      aria-label={`Module ${numero} : ${TITRES_MODULES_INTERACTIFS[numero]}`}
    >
      <div className="relative flex h-full flex-col justify-between p-3.5 text-[#EAF5F2] sm:p-4">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wide text-[#8FE0D3]">Module {numero}</span>
        {banniere ? (
          <p className="font-display max-w-[60%] text-[17px] font-extrabold leading-tight sm:text-[24px]">
            {TITRES_MODULES_INTERACTIFS[numero]}
          </p>
        ) : (
          <span className="font-display text-[34px] font-extrabold leading-none">{String(numero).padStart(2, "0")}</span>
        )}
      </div>
    </div>
  );
}
