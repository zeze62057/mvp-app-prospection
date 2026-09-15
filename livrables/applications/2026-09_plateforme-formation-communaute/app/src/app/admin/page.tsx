// Panneau admin : prix modifiables par espace et creation d'un nouvel
// espace en libre-service (voir CADRAGE.md section 6 et 7) restent a
// construire. Cette tranche pose l'approbation manuelle des demandes
// d'acces a la communaute gratuite (regle non negociable du cadrage).

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { approuverAdhesion, refuserAdhesion } from "./actions";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase
    .from("profils")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">
          Cette page est reservee aux admins.
        </p>
      </main>
    );
  }

  const admin = createAdminClient();
  const { data: demandes } = await admin
    .from("adhesions")
    .select("id, statut, created_at, profils(pseudo), espaces(nom)")
    .eq("statut", "en_attente")
    .order("created_at", { ascending: true });

  return (
    <main className="p-16">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--corail)]">
        administration
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold">
        Demandes d&apos;acces en attente
      </h1>

      <ul className="mt-8 flex flex-col gap-3">
        {(demandes ?? []).map((demande) => (
          <li
            key={demande.id}
            className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
          >
            <div>
              <p className="text-sm font-medium">
                {(demande.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}
              </p>
              <p className="text-xs text-[var(--texte-mute)]">
                {(demande.espaces as unknown as { nom: string } | null)?.nom ?? "?"}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={approuverAdhesion.bind(null, demande.id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
                >
                  Approuver
                </button>
              </form>
              <form action={refuserAdhesion.bind(null, demande.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-xs font-medium"
                >
                  Refuser
                </button>
              </form>
            </div>
          </li>
        ))}
        {(demandes ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">
            Aucune demande en attente.
          </p>
        )}
      </ul>

      <p className="mt-16 text-sm text-[var(--texte-mute)]">
        A venir : prix modifiables par espace, bouton &quot;creer une
        nouvelle formation&quot;.
      </p>
    </main>
  );
}
