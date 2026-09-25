import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-chatllow";
import { CoqueAdmin } from "@/components/admin/CoqueAdmin";

export const metadata = { title: "Rendez-vous — Administration Chatllow" };

const dateHeure = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function RendezVousPage() {
  await verifierAdmin();
  const { data } = await createAdminClient()
    .from("chatllow_rdv")
    .select("id, email, jour, heure, created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  const liste = data ?? [];

  return (
    <CoqueAdmin section="rendez-vous" titre="Demandes de rendez-vous" sousTitre="Les créneaux demandés depuis la page de rendez-vous. Répondez par e-mail pour confirmer.">
      {liste.length === 0 ? (
        <p className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-6 py-10 text-center text-[13.5px] text-[var(--texte-mute)]">
          Aucune demande de rendez-vous pour l&apos;instant.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
          <table className="w-full min-w-[520px] text-left text-[13px]">
            <thead>
              <tr className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Créneau demandé</th>
                <th className="px-4 py-3">Reçu le</th>
              </tr>
            </thead>
            <tbody>
              {liste.map((r) => (
                <tr key={r.id} className="border-t border-[var(--ligne)]">
                  <td className="px-4 py-3">
                    <a href={`mailto:${r.email}`} className="font-semibold">{r.email}</a>
                  </td>
                  <td className="px-4 py-3">{r.jour} à {r.heure}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">{dateHeure(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CoqueAdmin>
  );
}
