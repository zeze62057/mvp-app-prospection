import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-chatllow";
import { CoqueAdmin } from "@/components/admin/CoqueAdmin";
import { FormulaireNouveauClient } from "@/components/admin/FormulaireNouveauClient";

export const metadata = { title: "Clients — Administration Chatllow" };

const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  await verifierAdmin();
  const { ok, erreur } = await searchParams;
  const admin = createAdminClient();
  const [{ data: clients }, { data: projets }, { data: livrables }, users] = await Promise.all([
    admin.from("chatllow_clients").select("profil_id, entreprise, contact, created_at").order("created_at", { ascending: false }),
    admin.from("chatllow_projets").select("client_id"),
    admin.from("chatllow_livrables").select("client_id"),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => r.data?.users ?? []),
  ]);
  const email = new Map(users.map((u) => [u.id, u.email ?? ""]));
  const compte = (lignes: { client_id: string }[] | null, id: string) => (lignes ?? []).filter((l) => l.client_id === id).length;

  return (
    <CoqueAdmin section="clients" titre="Clients" sousTitre="Les entreprises qui ont accès à l'espace client Chatllow." ok={ok} erreur={erreur}>
      <FormulaireNouveauClient />

      <h2 className="font-[family-name:var(--font-display)] mt-8 text-[16px] font-semibold">
        Clients ({(clients ?? []).length})
      </h2>
      {(clients ?? []).length === 0 ? (
        <p className="mt-3 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-6 py-10 text-center text-[13.5px] text-[var(--texte-mute)]">
          Aucun client pour l&apos;instant. Créez le premier avec le formulaire ci-dessus.
        </p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead>
              <tr className="font-[family-name:var(--font-mono)] text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
                <th className="px-4 py-3">Entreprise</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right">Projets</th>
                <th className="px-4 py-3 text-right">Documents</th>
                <th className="px-4 py-3">Depuis</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {(clients ?? []).map((c) => (
                <tr key={c.profil_id} className="border-t border-[var(--ligne)]">
                  <td className="px-4 py-3 font-semibold">{c.entreprise}</td>
                  <td className="px-4 py-3">
                    {c.contact}
                    <div className="text-[11.5px] text-[var(--texte-mute)]">{email.get(c.profil_id)}</div>
                  </td>
                  <td className="px-4 py-3 text-right">{compte(projets, c.profil_id)}</td>
                  <td className="px-4 py-3 text-right">{compte(livrables, c.profil_id)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">{date(c.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/clients/${c.profil_id}`} className="rounded-full border border-[var(--ligne)] px-3.5 py-1.5 text-[12px] font-semibold hover:bg-[var(--indigo-soft)]">
                      Ouvrir →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CoqueAdmin>
  );
}
