import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";
import { ilYa } from "@/lib/activite-admin";
import { approuverPublication, refuserPublication, basculerApprobation } from "./actions";

// File d'attente des publications (migration 0048) et reglage par espace. Un post en attente n'est
// visible que de son auteur ; il apparait ici, avec son contenu complet, jusqu'a la decision.
export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase.from("profils").select("role").eq("id", userData.user.id).maybeSingle();
  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">Cette page est reservee aux admins.</p>
      </main>
    );
  }

  const { ok, erreur } = await searchParams;
  const admin = createAdminClient();

  const [{ data: espaces }, { data: posts }] = await Promise.all([
    admin.from("espaces").select("id, nom, approuver_publications").order("nom"),
    admin
      .from("posts")
      .select("id, espace_id, auteur_id, titre, contenu, zone, created_at, image_path, video_url, lien_url, fichier_nom")
      .eq("statut", "en_attente")
      .order("created_at", { ascending: true }),
  ]);
  const auteurs = [...new Set((posts ?? []).map((p) => p.auteur_id as string))];
  const { data: profils } = auteurs.length ? await admin.from("profils").select("id, pseudo").in("id", auteurs) : { data: [] };
  const pseudoDe = new Map((profils ?? []).map((p) => [p.id as string, p.pseudo as string]));
  const nomEspace = new Map((espaces ?? []).map((e) => [e.id as string, e.nom as string]));

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Publications à approuver</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        Quand l&apos;approbation est activée pour un espace, le post d&apos;un membre reste invisible des autres jusqu&apos;à ta
        décision. Tes propres posts sont publiés tout de suite. Modifier un post déjà publié le remet en attente.
      </p>

      {ok && (
        <p role="status" className="mt-4 rounded-lg bg-[rgba(43,140,130,0.12)] px-4 py-2.5 text-[12.5px] font-bold text-[var(--sarcelle-texte)]">
          {ok}
        </p>
      )}
      {erreur && (
        <p role="alert" className="mt-4 rounded-lg bg-[rgba(255,122,77,0.14)] px-4 py-2.5 text-[12.5px] font-bold text-[var(--corail-texte)]">
          {erreur}
        </p>
      )}

      <h2 className="font-display mt-6 text-[16px] font-bold">Réglage par espace</h2>
      <ul className="mt-3 flex max-w-2xl flex-col gap-2.5">
        {(espaces ?? []).map((e) => (
          <li key={e.id as string} className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3">
            <span className="min-w-0 flex-1 text-[13px] font-bold">{e.nom as string}</span>
            <span
              className={`rounded-[5px] px-2 py-0.5 font-mono text-[10.5px] font-bold ${
                e.approuver_publications
                  ? "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]"
                  : "bg-[var(--fond)] text-[var(--texte-mute)]"
              }`}
            >
              {e.approuver_publications ? "approbation active" : "publication directe"}
            </span>
            <form action={basculerApprobation}>
              <input type="hidden" name="espace_id" value={e.id as string} />
              <input type="hidden" name="activer" value={e.approuver_publications ? "non" : "oui"} />
              <button type="submit" className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-[11.5px] font-bold">
                {e.approuver_publications ? "Désactiver" : "Activer"}
              </button>
            </form>
          </li>
        ))}
      </ul>
      <p className="mt-2 max-w-2xl text-[11.5px] text-[var(--texte-mute)]">
        Désactiver ne publie pas les posts déjà en attente : ils restent dans la file ci-dessous jusqu&apos;à ta décision.
      </p>

      <h2 className="font-display mt-8 text-[16px] font-bold">En attente ({(posts ?? []).length})</h2>
      <ul className="mt-3 flex max-w-3xl flex-col gap-3">
        {(posts ?? []).map((p) => (
          <li key={p.id as string} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <p className="text-[11.5px] text-[var(--texte-mute)]">
              <b className="text-[var(--texte)]">{pseudoDe.get(p.auteur_id as string) ?? "Compte supprimé"}</b> ·{" "}
              {nomEspace.get(p.espace_id as string) ?? "?"} · zone {p.zone === "payante" ? "payante" : "gratuite"} ·{" "}
              {ilYa(p.created_at as string)}
            </p>
            {p.titre && <p className="mt-1.5 text-[14px] font-bold">{p.titre as string}</p>}
            <p className="mt-1.5 whitespace-pre-wrap break-words text-[13px] leading-relaxed">{p.contenu as string}</p>
            {(p.image_path || p.video_url || p.lien_url || p.fichier_nom) && (
              <p className="mt-2 font-mono text-[10.5px] text-[var(--texte-mute)]">
                Pièces jointes :{" "}
                {[
                  p.image_path ? "image" : null,
                  p.video_url ? "vidéo YouTube" : null,
                  p.lien_url ? `lien ${p.lien_url}` : null,
                  p.fichier_nom ? `fichier ${p.fichier_nom}` : null,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            <div className="mt-3 flex gap-2">
              <form action={approuverPublication}>
                <input type="hidden" name="post_id" value={p.id as string} />
                <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-3.5 py-1.5 text-[12px] font-bold text-white">
                  Approuver
                </button>
              </form>
              <form action={refuserPublication}>
                <input type="hidden" name="post_id" value={p.id as string} />
                <button type="submit" className="rounded-lg border border-[var(--ligne)] px-3.5 py-1.5 text-[12px] font-bold text-[var(--corail-texte)]">
                  Refuser
                </button>
              </form>
            </div>
          </li>
        ))}
        {(posts ?? []).length === 0 && <li className="text-[12.5px] text-[var(--texte-mute)]">Aucune publication en attente.</li>}
      </ul>
    </main>
  );
}
