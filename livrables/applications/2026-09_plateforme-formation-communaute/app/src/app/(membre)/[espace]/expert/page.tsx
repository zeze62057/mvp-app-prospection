import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { CartePostulerExpert } from "@/components/communaute/CartePostulerExpert";
import type { AccesPayant } from "@/types/membre";

// Page dediee "Devenir Expert" (voir nav de la maquette CommunautePayante.dc.html).
// Contenu reel valide par Zeze le 2026-09-16 : un Expert mentore les autres
// membres, en echange d'un acces privilegie. Meme mecanisme de candidature
// que la carte deja presente dans le fil de la communaute payante
// (postulerExpert), pas duplique.
export default async function ExpertPage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect(`/${espace.slug}/communaute`);

  const { data: acces } = await supabase
    .from("acces_payant")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<AccesPayant>();

  if (!acces?.actif) {
    return (
      <main className="mx-auto max-w-md p-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          devenir expert — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Formation pas encore debloquee
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Le statut Expert est reserve aux eleves ayant debloque la formation complete.
        </p>
        <Link
          href={`/${espace.slug}/tunnel`}
          className="mt-8 inline-block rounded-[9px] bg-[var(--corail)] px-5 py-2.5 text-sm font-bold text-[var(--encre)]"
        >
          Debloquer la formation
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/communaute-payante`} className="hover:text-[var(--sarcelle)]">
            Communaute payante
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Devenir Expert
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-7 py-8">
        <p className="font-display text-[23px] font-extrabold tracking-tight">
          Devenir Expert {espace.nom}
        </p>

        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-6">
          <div>
            <p className="font-display text-sm font-bold">Ce qu&apos;un Expert fait</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
              Mentorer les autres membres de la communaute payante : repondre a leurs
              questions, les aider a debloquer leurs exercices, partager son experience.
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-bold">Ce qu&apos;un Expert recoit</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
              Un acces privilegie au sein de la communaute.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <CartePostulerExpert espaceSlug={espace.slug} espaceNom={espace.nom} />
        </div>
      </div>
    </div>
  );
}
