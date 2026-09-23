// Bloc decoratif en bas de la colonne de droite, comme sur la capture de reference
// (NovaPulse). Purement statique, pas de lien : rien a mesurer ni a brancher ici.
export function CarteEncouragement({ espaceNom }: { espaceNom: string }) {
  return (
    <div
      className="rounded-[14px] p-[18px] text-[var(--sur-encre)]"
      style={{ background: "linear-gradient(135deg, var(--encre), var(--sarcelle))" }}
    >
      <div className="font-display text-[14px] font-bold">Ensemble, allons plus loin</div>
      <p className="mt-1.5 text-[12px] text-[var(--sur-encre-mute)]">
        Partagez vos idées, inspirez la communauté {espaceNom}.
      </p>
    </div>
  );
}
