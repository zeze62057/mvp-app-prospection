import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { BoutonPayer } from "@/components/tunnel/BoutonPayer";
import type { AccesPayant } from "@/types/membre";

export default async function TunnelPage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect(`/${espace.slug}/communaute`);

  const { data: acces } = await supabase
    .from("acces_payant")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<AccesPayant>();

  if (acces?.actif) {
    return (
      <main className="mx-auto max-w-md p-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          tunnel de paiement — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Deja debloque</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Tu as deja acces a la formation complete {espace.nom}.
        </p>
        <Link
          href={`/${espace.slug}/communaute-payante`}
          className="mt-8 inline-block rounded-[9px] bg-[var(--encre)] px-5 py-2.5 text-sm font-bold text-[var(--sur-encre)]"
        >
          Voir la communaute payante
        </Link>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fond)] p-6">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-[20px] border border-[var(--ligne)] bg-[var(--fond-carte)] shadow-[0_30px_70px_rgba(17,56,50,0.14)] sm:flex-row">
        <div className="flex-shrink-0 bg-[var(--encre)] p-9 text-[var(--sur-encre)] sm:w-[300px]">
          <span className="font-display mb-9 block text-[13px] font-bold">{espace.nom}</span>
          <p className="mb-2.5 font-mono text-[10.5px] uppercase tracking-wide text-[var(--sarcelle-light)]">
            formation complete
          </p>
          <p className="font-display mb-2 text-2xl font-extrabold">{espace.tagline}</p>
          <p className="font-display mb-5 text-3xl font-extrabold text-[var(--sarcelle-light)]">
            {espace.prix.toLocaleString("fr-FR")}
            <span className="ml-1 font-mono text-xs font-normal text-[var(--sur-encre-mute)]">
              {espace.devise}
            </span>
          </p>
          <ul className="flex flex-col gap-2.5 text-[12.5px] leading-relaxed">
            {[
              "Tous les modules debloques",
              "Page de progression personnelle",
              "Communaute payante avec exercices",
              "Acces immediat apres paiement",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2">
                <span className="text-[var(--sarcelle-light)]">✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 p-9">
          <p className="font-display mb-1 text-base font-bold">Paiement Mobile Money</p>
          <p className="mb-6 text-xs text-[var(--texte-mute)]">
            Tu seras redirige vers la page de paiement securisee (Orange Money, MTN Money, ou autre moyen disponible).
          </p>
          <BoutonPayer espaceSlug={espace.slug} montant={espace.prix} devise={espace.devise} />
        </div>
      </div>
    </div>
  );
}
