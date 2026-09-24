import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";
import { supprimerContenuAdmin } from "./actions";
import { ilYa } from "@/lib/activite-admin";

const LIMITE = 50;

const champ =
  "rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--sarcelle)]";

// Un texte de recherche ne doit jamais casser le filtre PostgREST : on retire les caracteres
// qui y ont un sens (virgule, parentheses, pourcent).
const nettoyer = (q: string) => q.replace(/[%,()*\\]/g, " ").trim().slice(0, 80);

type LignePost = { id: string; espace_id: string; auteur_id: string; titre: string | null; contenu: string; created_at: string };
type LigneCom = { id: string; auteur_id: string; contenu: string; created_at: string; posts: { espace_id: string } | null };

export default async function ModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ espace?: string; type?: string; q?: string; ok?: string; erreur?: string }>;
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

  const { espace: espaceFiltre = "", type: typeFiltre = "", q = "", ok, erreur } = await searchParams;
  const terme = nettoyer(q);
  const admin = createAdminClient();

  const { data: espaces } = await admin.from("espaces").select("id, nom, slug").order("nom");

  let requetePosts = admin
    .from("posts")
    .select("id, espace_id, auteur_id, titre, contenu, created_at")
    .order("created_at", { ascending: false })
    .limit(LIMITE);
  if (espaceFiltre) requetePosts = requetePosts.eq("espace_id", espaceFiltre);
  if (terme) requetePosts = requetePosts.or(`contenu.ilike.%${terme}%,titre.ilike.%${terme}%`);

  let requeteComs = admin
    .from("commentaires")
    .select("id, auteur_id, contenu, created_at, posts!inner(espace_id)")
    .order("created_at", { ascending: false })
    .limit(LIMITE);
  if (espaceFiltre) requeteComs = requeteComs.eq("posts.espace_id", espaceFiltre);
  if (terme) requeteComs = requeteComs.ilike("contenu", `%${terme}%`);

  const [{ data: posts }, { data: coms }] = await Promise.all([
    typeFiltre === "commentaire" ? { data: [] as LignePost[] } : requetePosts,
    typeFiltre === "post" ? { data: [] as LigneCom[] } : requeteComs,
  ]);
  const lignesPosts = (posts ?? []) as unknown as LignePost[];
  const lignesComs = (coms ?? []) as unknown as LigneCom[];

  const auteurs = [...new Set([...lignesPosts.map((p) => p.auteur_id), ...lignesComs.map((c) => c.auteur_id)])];
  const { data: profils } = auteurs.length ? await admin.from("profils").select("id, pseudo").in("id", auteurs) : { data: [] };
  const pseudoDe = new Map((profils ?? []).map((p) => [p.id as string, p.pseudo as string]));
  const nomEspace = new Map((espaces ?? []).map((e) => [e.id as string, e.nom as string]));

  // Page a recharger apres une suppression : celle-ci, avec les memes filtres.
  const filtresRetour = new URLSearchParams(
    Object.entries({ espace: espaceFiltre, type: typeFiltre, q }).filter(([, v]) => v) as [string, string][]
  ).toString();
  const retour = filtresRetour ? `/admin/moderation?${filtresRetour}` : "/admin/moderation";

  const bouton = (type: "post" | "commentaire", id: string, apercu: string) => (
    <details className="relative">
      <summary className="cursor-pointer list-none rounded-md border border-[var(--ligne)] px-2.5 py-1 text-[11px] font-bold text-[var(--corail-texte)] [&::-webkit-details-marker]:hidden">
        Supprimer
      </summary>
      <form
        action={supprimerContenuAdmin.bind(null, retour, type, id)}
        className="absolute right-0 z-10 mt-1 w-64 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-3 shadow-lg"
      >
        <p className="text-[11.5px]">
          Supprimer définitivement {type === "post" ? "ce post et ses commentaires" : "ce commentaire"} ? « {apercu} »
        </p>
        <p className="mt-1 text-[10.5px] text-[var(--texte-mute)]">L&apos;action est enregistrée dans le journal.</p>
        <button type="submit" className="mt-2 rounded-lg bg-[var(--corail)] px-3 py-1 text-[11.5px] font-bold text-[var(--encre)]">
          Oui, supprimer
        </button>
      </form>
    </details>
  );

  const extrait = (t: string, n = 160) => (t.length > n ? `${t.slice(0, n)}…` : t);

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Posts et commentaires</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        Les {LIMITE} derniers posts et commentaires de la communauté. Tu peux supprimer n&apos;importe lequel, même sans
        signalement. Chaque suppression est enregistrée dans le journal des actions d&apos;admin. Les signalements se
        traitent dans <Link href="/admin#signalements" className="font-bold text-[var(--sarcelle)] underline">Modération</Link>.
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

      <form method="get" className="mt-5 flex flex-wrap items-center gap-2.5">
        <input name="q" defaultValue={q} placeholder="Rechercher dans le texte" aria-label="Rechercher" className={`${champ} min-w-0 flex-1 sm:max-w-xs`} />
        <select name="espace" defaultValue={espaceFiltre} aria-label="Espace" className={champ}>
          <option value="">Tous les espaces</option>
          {(espaces ?? []).map((e) => (
            <option key={e.id as string} value={e.id as string}>
              {e.nom as string}
            </option>
          ))}
        </select>
        <select name="type" defaultValue={typeFiltre} aria-label="Type" className={champ}>
          <option value="">Posts et commentaires</option>
          <option value="post">Posts</option>
          <option value="commentaire">Commentaires</option>
        </select>
        <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-4 py-1.5 text-[12.5px] font-bold text-white">
          Filtrer
        </button>
        {(q || espaceFiltre || typeFiltre) && (
          <Link href="/admin/moderation" className="text-[12px] font-bold text-[var(--texte-mute)] underline">
            Réinitialiser
          </Link>
        )}
      </form>

      {typeFiltre !== "commentaire" && (
        <section className="mt-6">
          <h2 className="font-display text-[16px] font-bold">Posts ({lignesPosts.length})</h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {lignesPosts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-start gap-3 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] text-[var(--texte-mute)]">
                    <b className="text-[var(--texte)]">{pseudoDe.get(p.auteur_id) ?? "Compte supprimé"}</b> · {nomEspace.get(p.espace_id) ?? "?"} ·{" "}
                    {ilYa(p.created_at)}
                  </p>
                  {p.titre && <p className="mt-1 text-[13px] font-bold">{p.titre}</p>}
                  <p className="mt-1 whitespace-pre-wrap break-words text-[12.5px]">{extrait(p.contenu)}</p>
                </div>
                {bouton("post", p.id, extrait(p.titre ?? p.contenu, 60))}
              </li>
            ))}
            {lignesPosts.length === 0 && <li className="text-[12.5px] text-[var(--texte-mute)]">Aucun post.</li>}
          </ul>
        </section>
      )}

      {typeFiltre !== "post" && (
        <section className="mt-8">
          <h2 className="font-display text-[16px] font-bold">Commentaires ({lignesComs.length})</h2>
          <ul className="mt-3 flex flex-col gap-2.5">
            {lignesComs.map((c) => (
              <li key={c.id} className="flex flex-wrap items-start gap-3 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[11.5px] text-[var(--texte-mute)]">
                    <b className="text-[var(--texte)]">{pseudoDe.get(c.auteur_id) ?? "Compte supprimé"}</b> ·{" "}
                    {nomEspace.get(c.posts?.espace_id ?? "") ?? "?"} · {ilYa(c.created_at)}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-[12.5px]">{extrait(c.contenu)}</p>
                </div>
                {bouton("commentaire", c.id, extrait(c.contenu, 60))}
              </li>
            ))}
            {lignesComs.length === 0 && <li className="text-[12.5px] text-[var(--texte-mute)]">Aucun commentaire.</li>}
          </ul>
        </section>
      )}
    </main>
  );
}
