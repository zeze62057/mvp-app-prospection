import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { basculerObjectifAtteint, supprimerObjectif } from "./actions";
import { FormulaireObjectif } from "@/components/progression/FormulaireObjectif";

type ObjectifEleve = { id: string; texte: string; atteint: boolean; created_at: string };

export default async function ObjectifsPage({
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

  const { data: objectifs } = await supabase
    .from("objectifs_eleve")
    .select("id, texte, atteint, created_at")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .order("created_at", { ascending: false })
    .returns<ObjectifEleve[]>();

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <Link href={`/${espace.slug}/progression`} className="text-xs font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
          ← Retour à ma progression
        </Link>
      </div>

      <div className="mx-auto max-w-xl px-7 py-8">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">mes objectifs</p>
        <h1 className="font-display mt-2 text-2xl font-semibold">Ce que je veux atteindre</h1>
        <p className="mt-1.5 text-[12.5px] text-[var(--texte-mute)]">
          Des objectifs personnels, pour toi seul. Coche-les une fois atteints.
        </p>

        <div className="mt-6">
          <FormulaireObjectif espaceSlug={espace.slug} />
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          {(objectifs ?? []).length === 0 && (
            <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
              Aucun objectif pour le moment.
            </p>
          )}
          {(objectifs ?? []).map((o) => (
            <div key={o.id} className="flex items-center gap-3 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
              <form action={basculerObjectifAtteint.bind(null, espace.slug, o.id, !o.atteint)}>
                <button
                  type="submit"
                  aria-label={o.atteint ? "Marquer comme non atteint" : "Marquer comme atteint"}
                  className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
                    o.atteint ? "bg-[var(--sarcelle)] text-[var(--sur-encre)]" : "border border-[var(--ligne)] text-transparent"
                  }`}
                >
                  ✓
                </button>
              </form>
              <span className={`flex-1 text-[13.5px] ${o.atteint ? "text-[var(--texte-mute)] line-through" : ""}`}>
                {o.texte}
              </span>
              <form action={supprimerObjectif.bind(null, espace.slug, o.id)}>
                <button type="submit" className="text-xs font-bold text-[var(--corail)] underline">
                  Supprimer
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
