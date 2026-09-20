import Link from "next/link";
import type { CategoriePost } from "@/types/membre";

// Pastilles horizontales scrollables : filtrent le fil par categorie via ?cat=<id>.
// Ce sont de simples liens : le filtre reste dans l'URL, partageable, sans JavaScript.
export function PastillesCategories({
  base,
  categories,
  categorieActive,
}: {
  base: string; // chemin du fil, sans query
  categories: CategoriePost[];
  categorieActive: string | null;
}) {
  if (categories.length === 0) return null;

  const classe = (actif: boolean) =>
    `whitespace-nowrap rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold transition-colors ${
      actif
        ? "border-[var(--encre)] bg-[var(--encre)] text-[var(--sur-encre)]"
        : "border-[var(--ligne)] bg-[var(--fond-carte)] text-[var(--texte-mute)] hover:text-[var(--texte)]"
    }`;

  return (
    <nav
      aria-label="Catégories"
      className="-mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <Link href={base} className={classe(!categorieActive)} scroll={false}>
        Tout
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={`${base}?cat=${c.id}`}
          className={classe(categorieActive === c.id)}
          scroll={false}
        >
          {c.emoji ? `${c.emoji} ` : ""}
          {c.libelle}
        </Link>
      ))}
    </nav>
  );
}
