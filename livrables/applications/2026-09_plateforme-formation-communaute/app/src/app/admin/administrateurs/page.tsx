import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";
import { ilYa } from "@/lib/activite-admin";

const LIBELLE_ACTION: Record<string, string> = {
  supprimer_post: "Post supprimé",
  supprimer_commentaire: "Commentaire supprimé",
  retirer_membre_communaute: "Membre retiré de la communauté",
  reintegrer_membre_communaute: "Membre réintégré",
  promouvoir_admin: "Admin ajouté",
  retirer_role_admin: "Rôle admin retiré",
};

// Liste des admins et journal des actions. Le role se donne et se retire depuis la page Eleves
// (action serveur, confirmation par le pseudo, journal, dernier admin protege par la migration 0047) ;
// un membre ne peut jamais le changer lui-meme (migration 0027, faille corrigee le 2026-09-20).
export default async function AdministrateursPage() {
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
  const [{ data: admins }, { data: listeAuth }] = await Promise.all([
    admin.from("profils").select("id, pseudo, created_at").eq("role", "admin").order("created_at"),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => ({ data: r.data?.users ?? [] })),
  ]);
  const compteParId = new Map((listeAuth ?? []).map((u) => [u.id, u]));

  // Journal des actions sensibles (migration 0046) : lisible ici, cote serveur, jamais par un membre.
  const { data: journal } = await admin
    .from("journal_admin")
    .select("id, admin_id, action, detail, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  const { data: auteursJournal } = (journal ?? []).length
    ? await admin.from("profils").select("id, pseudo").in("id", [...new Set((journal ?? []).map((j) => j.admin_id as string).filter(Boolean))])
    : { data: [] };
  const pseudoAdmin = new Map((auteursJournal ?? []).map((p) => [p.id as string, p.pseudo as string]));

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Administrateurs</h1>
      <p className="mt-1 text-[13px] text-[var(--texte-mute)]">
        {(admins ?? []).length} compte{(admins ?? []).length !== 1 ? "s" : ""} avec les droits admin. Pour ajouter ou retirer
        un admin, utilise le menu « Gérer » d&apos;une ligne de la page{" "}
        <Link href="/admin/eleves" className="font-bold text-[var(--sarcelle)] underline">Élèves</Link>.
      </p>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
        <table className="w-full min-w-[560px] text-left text-[12px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-wide text-[var(--texte-mute)]">
              <th className="px-4 py-3">Compte</th>
              <th className="px-4 py-3">Créé le</th>
              <th className="px-4 py-3">Dernière connexion</th>
            </tr>
          </thead>
          <tbody>
            {(admins ?? []).map((a) => {
              const compte = compteParId.get(a.id as string);
              return (
                <tr key={a.id as string} className="border-t border-[var(--ligne)]">
                  <td className="px-4 py-3">
                    <div className="font-bold">
                      {a.pseudo as string}
                      {a.id === userData.user.id && (
                        <span className="ml-1.5 rounded-[5px] bg-[var(--fond)] px-1.5 py-px font-mono text-[9.5px] font-bold text-[var(--texte-mute)]">
                          toi
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[var(--texte-mute)]">{compte?.email ?? "Aucun compte de connexion"}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">
                    {new Date(a.created_at as string).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">
                    {compte?.last_sign_in_at ? new Date(compte.last_sign_in_at).toLocaleString("fr-FR") : "Jamais"}
                  </td>
                </tr>
              );
            })}
            {(admins ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-[var(--texte-mute)]">
                  Aucun administrateur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 className="font-display mt-10 text-[18px] font-semibold">Journal des actions</h2>
      <p className="mt-1 max-w-2xl text-[12.5px] text-[var(--texte-mute)]">
        Les 50 dernières actions sensibles : suppressions de contenu, retraits de membres, changements de rôle admin.
        Visible des admins seulement.
      </p>
      <ul className="mt-4 flex flex-col gap-2">
        {(journal ?? []).map((j) => (
          <li key={j.id as string} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 text-[12px]">
              <b>{LIBELLE_ACTION[j.action as string] ?? (j.action as string)}</b>
              <span className="text-[var(--texte-mute)]">
                par {pseudoAdmin.get(j.admin_id as string) ?? "compte supprimé"} · {ilYa(j.created_at as string)} ·{" "}
                {new Date(j.created_at as string).toLocaleString("fr-FR")}
              </span>
            </div>
            <p className="mt-1 break-words text-[12px] text-[var(--texte-mute)]">{j.detail as string}</p>
          </li>
        ))}
        {(journal ?? []).length === 0 && <li className="text-[12.5px] text-[var(--texte-mute)]">Aucune action enregistrée.</li>}
      </ul>
    </main>
  );
}
