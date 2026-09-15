import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "../communaute/actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { ComposerPayant } from "@/components/communaute/ComposerPayant";
import { PostCardPayant } from "@/components/communaute/PostCardPayant";
import { CartePostulerExpert } from "@/components/communaute/CartePostulerExpert";
import { couleurAvatar } from "@/lib/avatar";
import type { AccesPayant, CandidatureExpert, Post } from "@/types/membre";

export default async function CommunautePayantePage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  const enTete = (
    <p className="font-mono text-xs uppercase tracking-wide text-[var(--corail)]">
      communaute payante — {espace.nom}
    </p>
  );

  if (!userData.user) {
    return (
      <main className="mx-auto max-w-md p-16">
        {enTete}
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Espace reserve aux eleves
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Connecte-toi pour acceder a la communaute payante.
        </p>
        <div className="mt-8">
          <FormulaireAuth espaceSlug={espace.slug} />
        </div>
      </main>
    );
  }

  const boutonDeconnexion = (
    <form action={deconnexion.bind(null, espace.slug)}>
      <button type="submit" className="text-xs text-[var(--texte-mute)] underline">
        Se deconnecter
      </button>
    </form>
  );

  const { data: acces } = await supabase
    .from("acces_payant")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<AccesPayant>();

  if (!acces || !acces.actif) {
    return (
      <main className="mx-auto max-w-md p-16">
        {enTete}
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Debloque la formation complete
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Cet espace est reserve aux eleves ayant paye la formation{" "}
          {espace.nom}. L&apos;acces s&apos;active automatiquement dès
          reception du paiement.
        </p>
        <Link
          href={`/${espace.slug}/tunnel`}
          className="mt-8 inline-block rounded-[9px] bg-[var(--corail)] px-5 py-2.5 text-sm font-bold text-[var(--encre)]"
        >
          Voir le tunnel de paiement
        </Link>
        <div className="mt-6">{boutonDeconnexion}</div>
      </main>
    );
  }

  const { data: candidature } = await supabase
    .from("candidatures_expert")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<CandidatureExpert>();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("espace_id", espace.id)
    .eq("zone", "payante")
    .order("created_at", { ascending: false })
    .returns<Post[]>();

  const postIds = (posts ?? []).map((p) => p.id);
  const auteurIds = [...new Set((posts ?? []).map((p) => p.auteur_id))];

  const [{ data: profils }, { data: votes }, { data: accesListe }] = await Promise.all([
    auteurIds.length
      ? supabase.from("profils").select("id, pseudo, role, points").in("id", auteurIds)
      : Promise.resolve({ data: [] as { id: string; pseudo: string; role: string; points: number }[] }),
    postIds.length
      ? supabase.from("post_votes").select("post_id, profil_id").in("post_id", postIds)
      : Promise.resolve({ data: [] as { post_id: string; profil_id: string }[] }),
    supabase
      .from("acces_payant")
      .select("est_expert, profils(id, pseudo)")
      .eq("espace_id", espace.id)
      .eq("actif", true)
      .limit(6),
  ]);

  const parAuteur = Object.fromEntries((profils ?? []).map((p) => [p.id, p]));
  const expertsParAuteur = new Set(
    (accesListe ?? [])
      .filter((a) => a.est_expert)
      .map((a) => (a.profils as unknown as { id: string } | null)?.id)
  );
  const votesParPost = new Map<string, string[]>();
  (votes ?? []).forEach((v) => {
    votesParPost.set(v.post_id, [...(votesParPost.get(v.post_id) ?? []), v.profil_id]);
  });

  const membres = (accesListe ?? [])
    .map((a) => a.profils as unknown as { id: string; pseudo: string } | null)
    .filter((p): p is { id: string; pseudo: string } => !!p);

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
          <span className="rounded-[6px] bg-[var(--encre)] px-2 py-0.5 font-mono text-[9.5px] tracking-wide text-[var(--sarcelle-light)]">
            eleves
          </span>
        </div>
        <div className="flex gap-6 font-mono text-[13px] font-bold text-[var(--texte-mute)]">
          <Link href={`/${espace.slug}/progression`} className="hover:text-[var(--sarcelle)]">
            Ma progression
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Communaute payante
          </span>
          <span className="opacity-50" title="A venir">Formation</span>
          <span className="opacity-50" title="A venir">Devenir Expert</span>
        </div>
        {boutonDeconnexion}
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-7 md:grid-cols-[1fr_300px]">
        <div>
          <ComposerPayant espaceSlug={espace.slug} />

          {acces.est_expert ? (
            <div className="mb-[18px] flex items-center justify-between rounded-[14px] border border-dashed border-[var(--corail)] bg-[var(--fond-carte)] px-5 py-[18px]">
              <div>
                <b className="font-display block text-sm">Tu es Expert {espace.nom}</b>
                <span className="text-xs text-[var(--texte-mute)]">
                  Merci pour ton implication dans la communaute.
                </span>
              </div>
              <span className="rounded-[9px] bg-[var(--corail)] px-4 py-2 font-mono text-[11px] font-bold text-[var(--encre)]">
                ★ Expert
              </span>
            </div>
          ) : candidature?.statut === "en_attente" ? (
            <div className="mb-[18px] rounded-[14px] border border-dashed border-[var(--corail)] bg-[var(--fond-carte)] px-5 py-[18px]">
              <b className="font-display block text-sm">Candidature en cours d&apos;examen</b>
              <span className="text-xs text-[var(--texte-mute)]">
                Un admin va etudier ta candidature Expert.
              </span>
            </div>
          ) : candidature?.statut === "refuse" ? (
            <div className="mb-[18px] rounded-[14px] border border-dashed border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-[18px]">
              <b className="font-display block text-sm">Candidature non retenue</b>
              <span className="text-xs text-[var(--texte-mute)]">
                Ce n&apos;est que partie remise, continue a participer.
              </span>
            </div>
          ) : (
            <CartePostulerExpert espaceSlug={espace.slug} espaceNom={espace.nom} />
          )}

          <div>
            {(posts ?? []).map((post) => {
              const auteur = parAuteur[post.auteur_id];
              const votants = votesParPost.get(post.id) ?? [];
              return (
                <PostCardPayant
                  key={post.id}
                  espaceSlug={espace.slug}
                  post={post}
                  auteurPseudo={auteur?.pseudo ?? "Membre"}
                  auteurRole={(auteur?.role as "membre" | "admin") ?? "membre"}
                  auteurPoints={auteur?.points ?? 0}
                  estExpert={expertsParAuteur.has(post.auteur_id)}
                  nbLikes={votants.length}
                  aLike={votants.includes(userData.user.id)}
                />
              );
            })}
            {(posts ?? []).length === 0 && (
              <p className="text-sm text-[var(--texte-mute)]">
                Aucun post pour l&apos;instant. Partage ton premier exercice.
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
            <div className="font-display mb-3.5 text-[13px] font-bold">Membres</div>
            {membres.map((m) => (
              <div key={m.id} className="flex items-center gap-2.5 py-1.5">
                <div className="h-7 w-7 flex-shrink-0 rounded-full" style={{ background: couleurAvatar(m.id) }} />
                <span className="text-xs font-bold">{m.pseudo}</span>
              </div>
            ))}
            {membres.length === 0 && (
              <p className="text-xs text-[var(--texte-mute)]">Tu es le premier ici.</p>
            )}
          </div>

          <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
            <div className="font-display mb-3.5 text-[13px] font-bold">A propos</div>
            <p className="text-[11.5px] leading-[1.5] text-[var(--texte-mute)]">
              Espace reserve aux eleves ayant debloque la formation complete {espace.nom}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
