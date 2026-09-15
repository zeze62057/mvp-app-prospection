import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "./actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { BoutonDemanderAdhesion } from "@/components/communaute/BoutonDemanderAdhesion";
import { FilPosts } from "@/components/communaute/FilPosts";
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

  const enTete = (
    <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
      communaute gratuite — {espace.nom}
    </p>
  );

  if (!userData.user) {
    return (
      <main className="mx-auto max-w-md p-16">
        {enTete}
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
        {enTete}
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Dernier pas
        </h1>
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
        {enTete}
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
        {enTete}
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
    .order("created_at", { ascending: false })
    .returns<Post[]>();

  const auteurIds = [...new Set((posts ?? []).map((p) => p.auteur_id))];
  const { data: profils } = auteurIds.length
    ? await supabase.from("profils").select("id, pseudo").in("id", auteurIds)
    : { data: [] };

  const pseudosParAuteur = Object.fromEntries(
    (profils ?? []).map((p) => [p.id, p.pseudo])
  );

  return (
    <main className="mx-auto max-w-2xl p-16">
      <div className="flex items-center justify-between">
        {enTete}
        {boutonDeconnexion}
      </div>
      <h1 className="font-display mt-4 text-3xl font-semibold">
        Fil de la communaute
      </h1>
      <div className="mt-8">
        <FilPosts espaceSlug={espace.slug} posts={posts ?? []} pseudosParAuteur={pseudosParAuteur} />
      </div>
    </main>
  );
}
