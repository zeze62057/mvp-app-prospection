import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { FormulaireNouveauMotDePasse } from "@/components/communaute/FormulaireNouveauMotDePasse";

// Page d'arrivee du lien "mot de passe oublie" (apres l'echange du code par
// /auth/reinitialisation). Sans session de recuperation, le lien est invalide
// ou expire : on propose de recommencer plutot qu'un formulaire inutilisable.
export default async function ReinitialisationPage({
  params,
  searchParams,
}: {
  params: Promise<{ espace: string }>;
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { espace: slug } = await params;
  const { erreur } = await searchParams;

  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--fond)] px-6 py-14">
      <div className="w-full max-w-md rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-7">
        {userData.user ? (
          <>
            <h1 className="font-display text-[22px] font-bold text-[var(--encre)]">
              Nouveau mot de passe
            </h1>
            <p className="mt-1.5 mb-6 text-[13px] leading-relaxed text-[var(--texte-mute)]">
              Choisis ton nouveau mot de passe pour ton espace {espace.nom}.
            </p>
            <FormulaireNouveauMotDePasse espaceSlug={espace.slug} />
          </>
        ) : (
          <>
            <h1 className="font-display text-[22px] font-bold text-[var(--encre)]">
              Lien expiré
            </h1>
            <p className="mt-1.5 mb-6 text-[13px] leading-relaxed text-[var(--texte-mute)]">
              {erreur === "lien-expire"
                ? "Ce lien de réinitialisation a expiré ou a déjà été utilisé."
                : "Ce lien de réinitialisation n'est pas valide."}{" "}
              Redemande un lien depuis la page de connexion.
            </p>
            <Link
              href={`/${espace.slug}/communaute`}
              className="block rounded-xl bg-[var(--sarcelle)] px-4 py-3 text-center text-[14px] font-bold text-white"
            >
              Retour à la connexion
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
