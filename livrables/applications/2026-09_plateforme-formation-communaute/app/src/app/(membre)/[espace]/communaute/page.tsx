import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "./actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { BoutonDemanderAdhesion } from "@/components/communaute/BoutonDemanderAdhesion";
import { Composer } from "@/components/communaute/Composer";
import { MessageAccueil } from "@/components/communaute/MessageAccueil";
import { PostCard } from "@/components/communaute/PostCard";
import { couleurAvatar } from "@/lib/avatar";
import type { Adhesion, Post } from "@/types/membre";

export default async function CommunauteGratuitePage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          communaute gratuite — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Rejoins la communaute
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Cree un compte ou connecte-toi pour demander l&apos;acces.
        </p>
        <div className="mt-8">
          <FormulaireAuth espaceSlug={espace.slug} />
        </div>
      </main>
    );
  }

  const { data: adhesion } = await supabase
    .from("adhesions")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<Adhesion>();

  const boutonDeconnexion = (
    <form action={deconnexion.bind(null, espace.slug)}>
      <button type="submit" className="text-xs text-[var(--texte-mute)] underline">
        Se deconnecter
      </button>
    </form>
  );

  if (!adhesion) {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          communaute gratuite — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Dernier pas</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ton compte est cree. Demande l&apos;acces a la communaute gratuite,
          un admin doit valider ta demande avant que tu puisses voir le fil.
        </p>
        <div className="mt-8">
          <BoutonDemanderAdhesion espaceSlug={espace.slug} />
        </div>
        <div className="mt-6">{boutonDeconnexion}</div>
      </main>
    );
  }

  if (adhesion.statut === "en_attente") {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          communaute gratuite — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Demande en attente
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ta demande d&apos;acces a bien ete recue. Un admin va la valider
          manuellement, tu recevras l&apos;acces au fil dès son approbation.
        </p>
        <div className="mt-6">{boutonDeconnexion}</div>
      </main>
    );
  }

  if (adhesion.statut === "refuse") {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          communaute gratuite — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Demande refusee
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ta demande d&apos;acces n&apos;a pas ete retenue pour l&apos;instant.
        </p>
        <div className="mt-6">{boutonDeconnexion}</div>
      </main>
    );
  }

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("espace_id", espace.id)
    .eq("zone", "gratuite")
    .order("created_at", { ascending: false })
    .returns<Post[]>();

  const postIds = (posts ?? []).map((p) => p.id);
  const auteurIds = [...new Set((posts ?? []).map((p) => p.auteur_id))];

  const [{ data: profils }, { data: votes }, { count: nbMembres }, { data: classement }] =
    await Promise.all([
      auteurIds.length
        ? supabase.from("profils").select("id, pseudo, role, points").in("id", auteurIds)
        : Promise.resolve({ data: [] as { id: string; pseudo: string; role: string; points: number }[] }),
      postIds.length
        ? supabase.from("post_votes").select("post_id, profil_id").in("post_id", postIds)
        : Promise.resolve({ data: [] as { post_id: string; profil_id: string }[] }),
      supabase
        .from("adhesions")
        .select("*", { count: "exact", head: true })
        .eq("espace_id", espace.id)
        .eq("statut", "approuve"),
      supabase
        .from("adhesions")
        .select("profils(id, pseudo, points)")
        .eq("espace_id", espace.id)
        .eq("statut", "approuve"),
    ]);

  const parAuteur = Object.fromEntries((profils ?? []).map((p) => [p.id, p]));
  const votesParPost = new Map<string, string[]>();
  (votes ?? []).forEach((v) => {
    votesParPost.set(v.post_id, [...(votesParPost.get(v.post_id) ?? []), v.profil_id]);
  });

  const classementTrie = (classement ?? [])
    .map((c) => c.profils as unknown as { id: string; pseudo: string; points: number } | null)
    .filter((p): p is { id: string; pseudo: string; points: number } => !!p)
    .sort((a, b) => b.points - a.points)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex gap-6 font-mono text-[13px] font-bold text-[var(--texte-mute)]">
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Communaute
          </span>
          <Link href={`/${espace.slug}/contenu`} className="hover:text-[var(--sarcelle)]">
            Contenu
          </Link>
          <Link href={`/${espace.slug}/ressources`} className="hover:text-[var(--sarcelle)]">
            Ressources
          </Link>
          <Link href={`/${espace.slug}/masterclass`} className="hover:text-[var(--sarcelle)]">
            Masterclass
          </Link>
          <Link href={`/${espace.slug}/prompts`} className="hover:text-[var(--sarcelle)]">
            Prompts
          </Link>
          <Link href={`/${espace.slug}/rdv`} className="hover:text-[var(--sarcelle)]">
            RDV
          </Link>
        </div>
        {boutonDeconnexion}
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-7 md:grid-cols-[1fr_300px]">
        <div>
          <Link
            href={`/${espace.slug}/tunnel`}
            className="relative mb-[18px] flex items-center justify-between overflow-hidden rounded-[14px] bg-[var(--encre)] px-6 py-5 text-[var(--sur-encre)]"
          >
            <div>
              <b className="font-display block text-[14.5px] font-bold">
                Debloque la formation complete
              </b>
              <span className="text-xs text-[var(--sur-encre-mute)]">
                Paiement Mobile Money — {espace.prix.toLocaleString("fr-FR")} {espace.devise}, acces active dès reception.
              </span>
            </div>
            <span className="whitespace-nowrap rounded-[9px] bg-[var(--corail)] px-[18px] py-2.5 text-[12.5px] font-extrabold text-[var(--encre)]">
              Debloquer
            </span>
          </Link>

          <MessageAccueil espaceId={espace.id} />

          <Composer espaceSlug={espace.slug} />

          <div>
            {(posts ?? []).map((post) => {
              const auteur = parAuteur[post.auteur_id];
              const votants = votesParPost.get(post.id) ?? [];
              return (
                <PostCard
                  key={post.id}
                  espaceSlug={espace.slug}
                  post={post}
                  auteurPseudo={auteur?.pseudo ?? "Membre"}
                  auteurRole={(auteur?.role as "membre" | "admin") ?? "membre"}
                  auteurPoints={auteur?.points ?? 0}
                  nbVotes={votants.length}
                  aVote={votants.includes(userData.user.id)}
                />
              );
            })}
            {(posts ?? []).length === 0 && (
              <p className="text-sm text-[var(--texte-mute)]">
                Aucun post pour l&apos;instant. Sois le premier a partager quelque chose.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
            <div className="font-display mb-3.5 text-[13px] font-bold">{espace.nom}</div>
            <div className="flex">
              <div className="flex-1 text-center">
                <div className="font-display text-[19px] font-extrabold text-[var(--sarcelle)]">
                  {nbMembres ?? 0}
                </div>
                <div className="mt-0.5 font-mono text-[9.5px] text-[var(--texte-mute)]">membres</div>
              </div>
              <div className="flex-1 border-l border-[var(--ligne)] text-center">
                <div className="font-display text-[19px] font-extrabold text-[var(--sarcelle)]">
                  {(posts ?? []).length}
                </div>
                <div className="mt-0.5 font-mono text-[9.5px] text-[var(--texte-mute)]">posts</div>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
            <div className="font-display mb-3.5 text-[13px] font-bold">Classement</div>
            {classementTrie.map((c, i) => (
              <div
                key={c.id}
                className={`flex items-center gap-2.5 py-2 ${
                  i < classementTrie.length - 1 ? "border-b border-[var(--ligne)]" : ""
                }`}
              >
                <span className={`w-4 font-mono text-xs font-bold ${i === 0 ? "text-[var(--corail)]" : "text-[var(--texte-mute)]"}`}>
                  {i + 1}
                </span>
                <div className="h-7 w-7 flex-shrink-0 rounded-full" style={{ background: couleurAvatar(c.id) }} />
                <span className="flex-1 text-xs font-bold">{c.pseudo}</span>
                <span className="font-mono text-[11px] text-[var(--texte-mute)]">{c.points} pts</span>
              </div>
            ))}
            {classementTrie.length === 0 && (
              <p className="text-xs text-[var(--texte-mute)]">Pas encore de classement.</p>
            )}
          </div>

          <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
            <div className="font-display mb-3.5 text-[13px] font-bold">Naviguer</div>
            <div className="rounded-lg bg-[rgba(43,140,130,0.1)] px-2.5 py-2.5 text-[12.5px] font-bold text-[var(--sarcelle)]">
              Fil de la communaute
            </div>
            <div className="px-2.5 py-2.5 text-[12.5px] text-[var(--texte-mute)] opacity-50" title="A venir">
              Contenu gratuit
            </div>
            <Link
              href={`/${espace.slug}/tunnel`}
              className="block rounded-lg px-2.5 py-2.5 text-[12.5px] text-[var(--texte-mute)] hover:bg-[var(--fond)]"
            >
              Formation complete
            </Link>
            <div className="px-2.5 py-2.5 text-[12.5px] text-[var(--texte-mute)] opacity-50" title="A venir">
              Mon profil
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
