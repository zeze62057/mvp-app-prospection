import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { urlsAvatars } from "@/lib/avatars";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";
import { AvatarAdmin } from "@/components/admin/AvatarAdmin";

// "Formateurs" = les Experts : membres payants approuves comme Expert d'un espace (badge et
// recrutement Expert de la communaute payante). Lecture seule : les candidatures se traitent
// dans le tableau de bord (Candidatures Expert).
export default async function FormateursPage() {
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

  const admin = createAdminClient();
  const [{ data: experts }, { count: candidatures }, comptesAuth] = await Promise.all([
    admin
      .from("acces_payant")
      .select("profil_id, paye_at, profils(id, pseudo, points, avatar_path), espaces(nom)")
      .eq("actif", true)
      .eq("est_expert", true)
      .order("paye_at", { ascending: false }),
    admin.from("candidatures_expert").select("*", { count: "exact", head: true }).eq("statut", "en_attente"),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => r.data?.users ?? []),
  ]);

  type P = { id: string; pseudo: string; points: number; avatar_path: string | null } | null;
  const profilDe = (x: unknown) => x as P;
  const emailDe = new Map(comptesAuth.map((u) => [u.id, u.email ?? ""]));
  const photos = await urlsAvatars((experts ?? []).map((e) => profilDe(e.profils)).filter((p): p is NonNullable<P> => !!p));

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Formateurs</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        Les Experts : des membres payants approuvés comme Expert d&apos;un espace. {(experts ?? []).length} au total,{" "}
        {candidatures ?? 0} candidature{(candidatures ?? 0) !== 1 ? "s" : ""} en attente
        {(candidatures ?? 0) > 0 && (
          <>
            {" "}
            (<Link href="/admin#candidatures-expert" className="font-bold text-[var(--sarcelle)] underline">à traiter</Link>)
          </>
        )}
        .
      </p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
        <table className="w-full min-w-[560px] text-left text-[12px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-wide text-[var(--texte-mute)]">
              <th className="px-4 py-3">Expert</th>
              <th className="px-4 py-3">Espace</th>
              <th className="px-4 py-3">Membre payant depuis</th>
              <th className="px-4 py-3 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {(experts ?? []).map((e, i) => {
              const p = profilDe(e.profils);
              return (
                <tr key={`${e.profil_id}-${i}`} className="border-t border-[var(--ligne)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {p && <AvatarAdmin id={p.id} pseudo={p.pseudo} url={photos.get(p.id)} />}
                      <div className="min-w-0">
                        <div className="font-bold">{p?.pseudo ?? "Compte supprimé"}</div>
                        {emailDe.get(e.profil_id as string) && (
                          <div className="text-[11px] text-[var(--texte-mute)]">{emailDe.get(e.profil_id as string)}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{(e.espaces as unknown as { nom: string } | null)?.nom ?? "?"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">
                    {new Date(e.paye_at as string).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold">{p?.points ?? 0}</td>
                </tr>
              );
            })}
            {(experts ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--texte-mute)]">
                  Aucun Expert pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
