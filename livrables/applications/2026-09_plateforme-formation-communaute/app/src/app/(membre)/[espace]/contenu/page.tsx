import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "../communaute/actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { BoutonDemanderAdhesion } from "@/components/communaute/BoutonDemanderAdhesion";
import type { Adhesion, Contenu } from "@/types/membre";

// Fil de contenu educatif gratuit (voir migration 0014). Meme gating que
// /prompts, /masterclass et /rdv. Pas de formulaire de redaction ici : la
// publication sera geree par un agent programme plus tard (decision de
// Zeze le 2026-09-16), les lignes s'inserent directement en base pour
// l'instant.
export default async function ContenuPage({
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
          contenu — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Rejoins la communaute
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Cree un compte ou connecte-toi pour lire le contenu gratuit.
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
          contenu — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Dernier pas</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ton compte est cree. Demande l&apos;acces a la communaute gratuite
          pour lire le contenu.
        </p>
        <div className="mt-8">
          <BoutonDemanderAdhesion espaceSlug={espace.slug} />
        </div>
        <div className="mt-6">{boutonDeconnexion}</div>
      </main>
    );
  }

  if (adhesion.statut !== "approuve") {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          contenu — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          {adhesion.statut === "en_attente" ? "Demande en attente" : "Demande refusee"}
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          {adhesion.statut === "en_attente"
            ? "Ta demande d'acces a la communaute gratuite est en cours de validation."
            : "Ta demande d'acces n'a pas ete retenue pour l'instant."}
        </p>
        <div className="mt-6">{boutonDeconnexion}</div>
      </main>
    );
  }

  const { data: contenus } = await supabase
    .from("contenus")
    .select("*")
    .eq("espace_id", espace.id)
    .eq("statut", "publie")
    .order("created_at", { ascending: false })
    .returns<Contenu[]>();

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex gap-6 font-mono text-[13px] font-bold text-[var(--texte-mute)]">
          <Link href={`/${espace.slug}/communaute`} className="hover:text-[var(--sarcelle)]">
            Communaute
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Contenu
          </span>
        </div>
        {boutonDeconnexion}
      </div>

      <div className="mx-auto max-w-2xl px-7 py-8">
        <p className="font-display text-[23px] font-extrabold tracking-tight">
          Contenu
        </p>

        <div className="mt-6 flex flex-col gap-5">
          {(contenus ?? []).map((c) => (
            <article key={c.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-6">
              <p className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--sarcelle)]">
                {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <h2 className="font-display mt-1.5 text-lg font-bold">{c.titre}</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm text-[var(--texte-mute)]">{c.corps}</p>
            </article>
          ))}
          {(contenus ?? []).length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">Aucun contenu pour l&apos;instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}
