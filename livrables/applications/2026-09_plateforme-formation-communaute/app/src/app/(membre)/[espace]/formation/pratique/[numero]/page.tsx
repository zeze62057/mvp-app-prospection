import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CouvertureModule } from "@/components/formation/CouvertureModule";
import { getEspaceParSlug } from "@/lib/espaces";
import {
  ESPACE_MODULES_INTERACTIFS,
  TITRES_MODULES_INTERACTIFS,
  numeroModuleInteractif,
} from "@/lib/modules-interactifs";
import { createClient } from "@/lib/supabase/server";
import type { AccesPayant } from "@/types/membre";

// Module interactif d'un chapitre de la formation : le fichier d'origine, intact, affiche
// dans un cadre. Il est servi par /api/modules-interactifs/[fichier], qui reverifie l'acces.
// Meme gate payant que /formation.
export default async function ModuleInteractifPage({
  params,
}: {
  params: Promise<{ espace: string; numero: string }>;
}) {
  const { espace: slug, numero: brut } = await params;
  const numero = numeroModuleInteractif(brut);
  if (slug !== ESPACE_MODULES_INTERACTIFS || numero === null) notFound();

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
          module interactif — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Module reserve aux eleves</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Les modules interactifs sont accessibles une fois la formation complete debloquee.
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
    <div className="flex min-h-screen flex-col bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 sm:px-7">
        <div className="min-w-0">
          <Link href={`/${espace.slug}/formation`} className="text-xs font-bold text-[var(--texte-mute)] hover:text-[var(--sarcelle)]">
            ← Retour au programme
          </Link>
          <p className="font-display mt-1 truncate text-[14.5px] font-bold">
            Module {numero} interactif — {TITRES_MODULES_INTERACTIFS[numero]}
          </p>
        </div>
        <a
          href={`/api/modules-interactifs/fiche-module-${numero}.pdf`}
          target="_blank"
          rel="noopener"
          className="shrink-0 rounded-[9px] border border-[var(--ligne)] px-3.5 py-2 text-xs font-bold text-[var(--sarcelle-texte)] hover:border-[var(--sarcelle)]"
        >
          Fiche du module (PDF)
        </a>
      </div>
      <CouvertureModule numero={numero} banniere className="h-[120px] w-full rounded-none sm:h-[170px]" />
      <iframe
        title={`Module ${numero} interactif`}
        src={`/api/modules-interactifs/module-${numero}.html`}
        className="w-full flex-1 border-0"
        style={{ minHeight: "calc(100vh - 64px)" }}
      />
    </div>
  );
}
