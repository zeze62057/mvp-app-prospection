import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActivite, ilYa } from "@/lib/activite-admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";

export default async function ActivitePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase
    .from("profils")
    .select("role, pseudo")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">Cette page est reservee aux admins.</p>
      </main>
    );
  }

  const evenements = await getActivite(createAdminClient(), 50);

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Activité récente</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        Les 50 derniers événements : inscriptions, paiements, devoirs rendus et articles publiés. Les messages privés n&apos;y
        figurent jamais.
      </p>

      <div className="mt-6 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
        {evenements.length === 0 ? (
          <p className="text-[12.5px] text-[var(--texte-mute)]">Aucune activité pour le moment.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {evenements.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span aria-hidden className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[15px]" style={{ background: e.couleur }}>
                  {e.icone}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-bold leading-snug">{e.titre}</p>
                  <p className="truncate text-[12px] text-[var(--texte-mute)]">{e.detail}</p>
                </div>
                <div className="flex-shrink-0 text-right font-mono text-[10.5px] text-[var(--texte-mute)]">
                  <div>{ilYa(e.date)}</div>
                  <div>{new Date(e.date).toLocaleDateString("fr-FR")}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
