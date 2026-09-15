import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";

export default async function CommunautePayantePage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);

  if (!espace) notFound();

  // TODO: verifier ici que l'utilisateur a bien paye avant d'afficher le
  // contenu (accord CADRAGE.md section 6 : acces automatique par paiement,
  // jamais par approbation manuelle).

  return (
    <main className="p-16">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--corail)]">
        communaute payante — {espace.slug}
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold">
        Communaute payante
      </h1>
      <p className="mt-8 text-sm text-[var(--texte-mute)]">
        Placeholder — a reconstruire d&apos;apres maquette/CommunautePayante.dc.html.
      </p>
    </main>
  );
}
