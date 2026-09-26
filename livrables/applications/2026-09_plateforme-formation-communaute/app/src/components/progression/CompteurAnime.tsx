"use client";

import { useEffect, useRef } from "react";

// Nombre qui monte de 0 a sa valeur au chargement. Le serveur rend deja la valeur finale : sans
// JavaScript, ou pour qui a demande moins d'animations, le chiffre exact reste affiche.
// L'animation ecrit directement dans le texte (pas d'etat React) pour eviter un rendu par image.
export function CompteurAnime({
  valeur,
  decimales = 0,
  duree = 1000,
}: {
  valeur: number;
  decimales?: number;
  duree?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || valeur === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const debut = performance.now() + 350; // meme depart que l'anneau
    let image = 0;
    el.textContent = (0).toFixed(decimales);
    const pas = (maintenant: number) => {
      const p = Math.min(1, Math.max(0, (maintenant - debut) / duree));
      const adouci = 1 - Math.pow(1 - p, 3);
      el.textContent = (valeur * adouci).toFixed(decimales);
      if (p < 1) image = requestAnimationFrame(pas);
    };
    image = requestAnimationFrame(pas);
    return () => cancelAnimationFrame(image);
  }, [valeur, decimales, duree]);

  return <span ref={ref}>{valeur.toFixed(decimales)}</span>;
}
