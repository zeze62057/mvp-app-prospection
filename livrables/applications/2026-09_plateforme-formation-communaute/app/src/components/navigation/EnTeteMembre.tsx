import Link from "next/link";

// En-tete simple des pages membres secondaires (profil, notifications, messages).
export function EnTeteMembre({
  espaceSlug,
  espaceNom,
  titre,
  retour,
}: {
  espaceSlug: string;
  espaceNom: string;
  titre: string;
  retour?: { href: string; libelle: string };
}) {
  return (
    <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-4 sm:px-7">
      <div className="min-w-0">
        <Link href={`/${espaceSlug}/communaute`} className="font-display text-[14.5px] font-bold">
          {espaceNom}
        </Link>
        <span className="ml-3 font-mono text-[12px] text-[var(--texte-mute)]">{titre}</span>
      </div>
      {retour && (
        <Link href={retour.href} className="font-mono text-[13px] font-bold text-[var(--sarcelle)]">
          {retour.libelle}
        </Link>
      )}
    </div>
  );
}
