import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAttentes } from "@/lib/attentes-admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";

// "Notifications" de l'admin = ce qui attend une action de sa part. Ce ne sont pas les
// notifications des membres (migration 0029) : celles-la sont privees a chaque membre.
export default async function NotificationsPage() {
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

  const attentes = await getAttentes(createAdminClient());
  const total = attentes.reduce((s, a) => s + a.n, 0);

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin pseudo={profil?.pseudo ?? ""} nbAttente={total} />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Notifications</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        {total > 0
          ? `${total} élément${total !== 1 ? "s" : ""} attend${total !== 1 ? "ent" : ""} une action de ta part.`
          : "Rien n'attend ton action pour le moment."}
      </p>

      <ul className="mt-6 flex max-w-2xl flex-col gap-3">
        {attentes.map((a) => (
          <li
            key={a.cle}
            className={`flex items-center justify-between gap-4 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 ${a.n === 0 ? "opacity-60" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 font-mono text-[13px] font-bold ${
                  a.n > 0 ? "bg-[var(--corail)] text-[var(--encre)]" : "bg-[var(--fond)] text-[var(--texte-mute)]"
                }`}
              >
                {a.n}
              </span>
              <span className="text-[13px] font-bold">{a.libelle}</span>
            </div>
            {a.n > 0 && (
              <Link href={a.href} className="flex-shrink-0 text-[12px] font-bold text-[var(--sarcelle)]">
                {a.action} →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
