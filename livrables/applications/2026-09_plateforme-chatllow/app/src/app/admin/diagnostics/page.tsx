import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-chatllow";
import { CoqueAdmin } from "@/components/admin/CoqueAdmin";
import { QUESTIONS } from "@/lib/diagnostic-questions";

export const metadata = { title: "Diagnostics reçus — Administration Chatllow" };

const dateHeure = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function DiagnosticsPage() {
  await verifierAdmin();
  const { data } = await createAdminClient()
    .from("chatllow_diagnostics")
    .select("id, email, reponses, pilote_recommande, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const liste = data ?? [];

  return (
    <CoqueAdmin section="diagnostics" titre="Diagnostics reçus" sousTitre="Les réponses des visiteurs qui ont terminé le diagnostic public. Confidentiel : visible de vous seul.">
      {liste.length === 0 ? (
        <p className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-6 py-10 text-center text-[13.5px] text-[var(--texte-mute)]">
          Aucun diagnostic reçu pour l&apos;instant.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {liste.map((d) => {
            const reponses = Array.isArray(d.reponses) ? (d.reponses as string[]) : [];
            return (
              <li key={d.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <a href={`mailto:${d.email}`} className="font-[family-name:var(--font-display)] text-[15px] font-semibold">{d.email}</a>
                  <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--texte-mute)]">{dateHeure(d.created_at)}</span>
                </div>
                <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">Pilote recommandé : <b className="text-[var(--texte)]">{d.pilote_recommande ?? "aucun"}</b></p>
                <details className="mt-3">
                  <summary className="cursor-pointer text-[12.5px] font-semibold text-[oklch(45%_0.19_250)]">Voir les {QUESTIONS.length} réponses</summary>
                  <dl className="mt-3 flex flex-col gap-3">
                    {QUESTIONS.map((q, i) => (
                      <div key={q.question}>
                        <dt className="text-[12px] text-[var(--texte-mute)]">{q.question}</dt>
                        <dd className="text-[13px] font-semibold">{reponses[i] ?? "Sans réponse"}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </CoqueAdmin>
  );
}
