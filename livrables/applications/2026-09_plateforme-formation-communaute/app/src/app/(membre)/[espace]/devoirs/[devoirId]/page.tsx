import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import type { AccesPayant, Devoir, DevoirRemise } from "@/types/membre";
import { FormulaireRemiseDevoir } from "@/components/progression/FormulaireRemiseDevoir";

export default async function DevoirPage({
  params,
}: {
  params: Promise<{ espace: string; devoirId: string }>;
}) {
  const { espace: slug, devoirId } = await params;
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
  if (!acces?.actif) redirect(`/${espace.slug}/progression`);

  const { data: devoir } = await supabase
    .from("devoirs")
    .select("*")
    .eq("id", devoirId)
    .eq("espace_id", espace.id)
    .maybeSingle<Devoir>();
  if (!devoir) notFound();

  const { data: remise } = await supabase
    .from("devoirs_remises")
    .select("*")
    .eq("devoir_id", devoirId)
    .eq("profil_id", userData.user.id)
    .maybeSingle<DevoirRemise>();

  const enRetard = new Date(devoir.date_limite).getTime() < new Date().getTime();

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <Link href={`/${espace.slug}/progression`} className="text-xs font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
          ← Retour à ma progression
        </Link>
      </div>

      <div className="mx-auto max-w-2xl px-7 py-8">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">devoir</p>
        <h1 className="font-display mt-2 text-2xl font-semibold">{devoir.titre}</h1>
        <p className={`mt-1.5 text-[12.5px] font-bold ${enRetard && !remise ? "text-[var(--corail)]" : "text-[var(--texte-mute)]"}`}>
          Date limite : {new Date(devoir.date_limite).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
          {enRetard && !remise ? " — en retard" : ""}
        </p>
        <p className="mt-4 whitespace-pre-wrap text-[13.5px] leading-relaxed text-[var(--texte)]">{devoir.consigne}</p>

        {remise?.note !== null && remise?.note !== undefined ? (
          <div className="mt-6 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-display text-[14px] font-bold">Ta note</span>
              <span className="font-mono text-xl font-extrabold text-[var(--sarcelle)]">{remise.note} / 20</span>
            </div>
            {remise.commentaire && (
              <p className="text-[12.5px] text-[var(--texte-mute)]">{remise.commentaire}</p>
            )}
          </div>
        ) : (
          <div className="mt-6">
            <FormulaireRemiseDevoir espaceSlug={espace.slug} devoirId={devoir.id} remiseExistante={remise ?? null} />
          </div>
        )}
      </div>
    </div>
  );
}
