import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";

export default async function CommunauteGratuitePage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);

  if (!espace) notFound();

  return (
    <main className="p-16">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
        communaute gratuite — {espace.slug}
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold">
        Fil de la communaute
      </h1>
      <p className="mt-8 text-sm text-[var(--texte-mute)]">
        Placeholder — a reconstruire d&apos;apres maquette/Communaute.dc.html.
      </p>
    </main>
  );
}
