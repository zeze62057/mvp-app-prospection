import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";
import { lienSur } from "@/lib/lien-profil";

// Trois onglets flottants sous la rangee d'onglets de la communaute : Chatllow (site du cabinet),
// Batisseur Pro (sa communaute) et Vivier IA (le paiement, ou la communaute payante pour un eleve
// qui a deja paye). Ce sont des liens vers deux produits precis, pas une regle generique : les
// slugs des deux espaces sont donc nommes ici, en un seul endroit.
const SLUG_VIVIER = "vivier-ia";
const SLUG_BATISSEUR = "batisseur-pro";

// Adresse du site Chatllow, a renseigner dans NEXT_PUBLIC_LIEN_CHATLLOW (.env.local et Vercel).
// Tant qu'elle est absente ou invalide, l'onglet reste visible mais n'est pas cliquable.
const LIEN_CHATLLOW = lienSur(process.env.NEXT_PUBLIC_LIEN_CHATLLOW);

const base =
  "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-[12.5px] font-bold transition-colors";
const neutre =
  "border-[var(--ligne)] bg-[var(--fond-carte)] text-[var(--texte)] hover:border-[var(--sarcelle)] hover:text-[var(--sarcelle)]";
const actif = "border-[var(--encre)] bg-[var(--encre)] text-[var(--sur-encre)]";
const appel = "border-[var(--corail)] bg-[var(--corail)] text-[var(--encre)] hover:opacity-90";

export async function OngletsFlottants({ espaceSlug }: { espaceSlug: string }) {
  // Un eleve deja passe par le paiement va directement a la communaute payante.
  let vivierPaye = false;
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (userData.user) {
    const vivier = await getEspaceParSlug(SLUG_VIVIER);
    if (vivier) {
      const { data } = await supabase.rpc("a_acces_zone", {
        p_profil: userData.user.id,
        p_espace: vivier.id,
        p_zone: "payante",
      });
      vivierPaye = data === true;
    }
  }

  const lienVivier = vivierPaye ? `/${SLUG_VIVIER}/communaute-payante` : `/${SLUG_VIVIER}/tunnel`;

  return (
    <nav
      aria-label="Accès rapide"
      className="sticky top-0 z-30 border-b border-[var(--ligne)] bg-[var(--fond)]/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl items-center gap-2 overflow-x-auto px-4 py-2 sm:px-7 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {LIEN_CHATLLOW ? (
          <a href={LIEN_CHATLLOW} target="_blank" rel="noopener noreferrer" className={`${base} ${neutre}`}>
            Chatllow ↗
          </a>
        ) : (
          <span
            className={`${base} cursor-not-allowed border-dashed border-[var(--ligne)] text-[var(--texte-mute)]`}
            title="Le lien Chatllow n'est pas encore renseigné"
          >
            Chatllow
          </span>
        )}
        <Link
          href={`/${SLUG_BATISSEUR}/communaute`}
          aria-current={espaceSlug === SLUG_BATISSEUR ? "page" : undefined}
          className={`${base} ${espaceSlug === SLUG_BATISSEUR ? actif : neutre}`}
        >
          Bâtisseur Pro
        </Link>
        <Link href={lienVivier} className={`${base} ${vivierPaye ? neutre : appel}`}>
          Vivier IA
        </Link>
      </div>
    </nav>
  );
}
