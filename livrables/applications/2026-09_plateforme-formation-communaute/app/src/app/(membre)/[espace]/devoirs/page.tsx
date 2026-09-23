import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import type { AccesPayant, Devoir, DevoirRemise } from "@/types/membre";

// Liste de tous les devoirs de l'espace (module par module), avec le statut et la
// note de l'eleve connecte : couvre a la fois "Mes devoirs" et "Mes notes" de la
// capture de reference (Skillora), la note n'existant chez nous que par devoir.
export default async function DevoirsPage({
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
  if (!acces?.actif) redirect(`/${espace.slug}/progression`);

  const [{ data: devoirs }, { data: remises }] = await Promise.all([
    supabase.from("devoirs").select("*").eq("espace_id", espace.id).order("date_limite").returns<Devoir[]>(),
    supabase.from("devoirs_remises").select("*").eq("profil_id", userData.user.id).returns<DevoirRemise[]>(),
  ]);
  const remiseParDevoir = new Map((remises ?? []).map((r) => [r.devoir_id, r]));
  const maintenant = new Date().getTime();

  const notesObtenues = (remises ?? []).filter((r) => r.note !== null).map((r) => r.note as number);
  const moyenne = notesObtenues.length > 0 ? notesObtenues.reduce((s, n) => s + n, 0) / notesObtenues.length : null;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <Link href={`/${espace.slug}/progression`} className="text-xs font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
          ← Retour à ma progression
        </Link>
      </div>

      <div className="mx-auto max-w-2xl px-7 py-8">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">mes devoirs</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold">Devoirs et notes</h1>
          {moyenne !== null && (
            <p className="text-[13px] font-bold text-[var(--sarcelle)]">Moyenne : {moyenne.toFixed(1)} / 20</p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          {(devoirs ?? []).length === 0 && (
            <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
              Aucun devoir pour le moment.
            </p>
          )}
          {(devoirs ?? []).map((d) => {
            const remise = remiseParDevoir.get(d.id) ?? null;
            const enRetard = !remise && new Date(d.date_limite).getTime() < maintenant;
            let statut: { libelle: string; classe: string };
            if (remise?.note !== null && remise?.note !== undefined) {
              statut = { libelle: `${remise.note} / 20`, classe: "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]" };
            } else if (remise) {
              statut = { libelle: "Rendu", classe: "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]" };
            } else if (enRetard) {
              statut = { libelle: "En retard", classe: "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]" };
            } else {
              statut = { libelle: "À rendre", classe: "bg-[var(--fond)] text-[var(--texte-mute)]" };
            }
            return (
              <Link
                key={d.id}
                href={`/${espace.slug}/devoirs/${d.id}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 hover:border-[var(--sarcelle)]"
              >
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] font-bold">{d.titre}</div>
                  <div className="mt-0.5 font-mono text-[10.5px] text-[var(--texte-mute)]">
                    Limite : {new Date(d.date_limite).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  </div>
                </div>
                <span className={`shrink-0 rounded-[5px] px-2 py-1 font-mono text-[10.5px] font-bold ${statut.classe}`}>
                  {statut.libelle}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
