import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "../communaute/actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { BoutonDemanderAdhesion } from "@/components/communaute/BoutonDemanderAdhesion";
import { BibliothequePrompts } from "@/components/prompts/BibliothequePrompts";
import type { Adhesion, Prompt } from "@/types/membre";

// Bibliotheque de prompts : haut de tunnel, ouverte aux membres de la communaute gratuite et,
// depuis la migration 0045 (2026-09-24), aussi a tout acces payant actif. Meme gating que la
// communaute gratuite (voir communaute/page.tsx) pour le reste, volontairement duplique plutot
// que factorise : les deux pages divergeront probablement une fois plus construites.
export default async function PromptsPage({
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
          prompts — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Rejoins la communaute
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Cree un compte ou connecte-toi pour acceder a la bibliotheque de prompts.
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

  // Un acces payant actif donne aussi acces a la bibliotheque (migration 0045), meme sans
  // adhesion gratuite : le payant recoit au moins ce que recoit le gratuit.
  const { data: acces } = await supabase
    .from("acces_payant")
    .select("actif")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle();
  const aAccesPayant = !!acces?.actif;

  const boutonDeconnexion = (
    <form action={deconnexion.bind(null, espace.slug)}>
      <button type="submit" className="shrink-0 whitespace-nowrap text-xs text-[var(--texte-mute)] underline">
        Se deconnecter
      </button>
    </form>
  );

  if (!adhesion && !aAccesPayant) {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          prompts — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Dernier pas</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ton compte est cree. Demande l&apos;acces a la communaute gratuite
          pour debloquer la bibliotheque de prompts.
        </p>
        <div className="mt-8">
          <BoutonDemanderAdhesion espaceSlug={espace.slug} />
        </div>
        <div className="mt-6">{boutonDeconnexion}</div>
      </main>
    );
  }

  if (adhesion && adhesion.statut !== "approuve" && !aAccesPayant) {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          prompts — {espace.nom}
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

  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("espace_id", espace.id)
    .order("categorie")
    .order("ordre")
    .returns<Prompt[]>();

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/communaute`} className="hover:text-[var(--sarcelle)]">
            Communaute
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Prompts
          </span>
        </div>
        {boutonDeconnexion}
      </div>

      <div className="mx-auto max-w-5xl px-7 py-8">
        <p className="font-display text-[23px] font-extrabold tracking-tight">
          Bibliotheque de prompts
        </p>
        <p className="mt-1.5 max-w-lg text-[13px] text-[var(--texte-mute)]">
          Des prompts prets a l&apos;emploi, tires directement des fiches du cours,
          pour pratiquer des ton arrivee dans la communaute gratuite.
        </p>

        <div className="mt-5 max-w-2xl rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
          <p className="font-display mb-2.5 text-[14px] font-bold">
            Comment bien utiliser ces prompts
          </p>
          <ul className="flex flex-col gap-1.5 text-[12.5px] text-[var(--texte-mute)]">
            <li>
              Remplace toujours les crochets <span className="font-mono text-[var(--texte)]">[...]</span> par tes vraies informations. Un prompt envoye tel quel, crochets inclus, ne sert a rien.
            </li>
            <li>
              Pour une tache reelle, utilise-les dans l&apos;ordre : d&apos;abord le gabarit (categorie Methode), puis &quot;Demander un plan avant de coder&quot;, execute, et termine toujours par &quot;Valider un travail annonce terminee&quot;.
            </li>
            <li>
              L&apos;erreur la plus frequente : sauter la validation. Un agent qui annonce &quot;c&apos;est fait&quot; n&apos;a pas encore prouve que ca fonctionne reellement.
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <BibliothequePrompts prompts={prompts ?? []} />
        </div>
      </div>
    </div>
  );
}
