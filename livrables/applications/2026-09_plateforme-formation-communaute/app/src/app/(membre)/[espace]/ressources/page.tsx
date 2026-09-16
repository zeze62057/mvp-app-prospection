import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import type { AccesPayant, Ressource, TermeGlossaire } from "@/types/membre";

// Ressources de la formation payante (outils, fichiers, glossaire) :
// reservees a l'acces payant, contrairement aux prompts qui sont l'aimant
// a prospects gratuit (voir migration 0010 vs 0011, decision explicite de
// Zeze le 2026-09-16). Meme gate que /progression.
export default async function RessourcesPage({
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
          ressources — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Formation pas encore debloquee
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Les outils, fichiers et le glossaire sont reserves aux eleves ayant
          debloque la formation complete.
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

  const { data: ressources } = await supabase
    .from("ressources")
    .select("*")
    .eq("espace_id", espace.id)
    .order("type")
    .order("ordre")
    .returns<Ressource[]>();

  const { data: glossaire } = await supabase
    .from("glossaire")
    .select("*")
    .eq("espace_id", espace.id)
    .order("ordre")
    .returns<TermeGlossaire[]>();

  const liens = (ressources ?? []).filter((r) => r.type === "lien");
  const fichiers = (ressources ?? []).filter((r) => r.type === "fichier");

  const fichiersAvecUrl = await Promise.all(
    fichiers.map(async (f) => {
      if (!f.chemin_storage) return { ...f, urlSignee: null as string | null };
      const { data } = await supabase.storage
        .from("ressources-fichiers")
        .createSignedUrl(f.chemin_storage, 3600);
      return { ...f, urlSignee: data?.signedUrl ?? null };
    })
  );

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-7 py-4">
        <span className="font-display text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex gap-6 font-mono text-[13px] font-bold text-[var(--texte-mute)]">
          <Link href={`/${espace.slug}/progression`} className="hover:text-[var(--sarcelle)]">
            Ma progression
          </Link>
          <Link href={`/${espace.slug}/formation`} className="hover:text-[var(--sarcelle)]">
            Formation
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Ressources
          </span>
          <Link href={`/${espace.slug}/expert`} className="hover:text-[var(--sarcelle)]">
            Devenir Expert
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-7 py-8">
        <p className="font-display text-[23px] font-extrabold tracking-tight">
          Ressources
        </p>

        <p className="mb-3.5 mt-8 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
          Outils
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {liens.map((r) => (
            <a
              key={r.id}
              href={r.url ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 hover:border-[var(--sarcelle)]"
            >
              <p className="font-display text-sm font-bold">{r.titre}</p>
              <p className="mt-1 text-xs text-[var(--texte-mute)]">{r.description}</p>
            </a>
          ))}
          {liens.length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">Aucun outil pour l&apos;instant.</p>
          )}
        </div>

        <p className="mb-3.5 mt-10 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
          Telechargements
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {fichiersAvecUrl.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
            >
              <div>
                <p className="font-display text-sm font-bold">{f.titre}</p>
                <p className="mt-1 text-xs text-[var(--texte-mute)]">{f.description}</p>
              </div>
              {f.urlSignee && (
                <a
                  href={f.urlSignee}
                  className="whitespace-nowrap rounded-lg bg-[var(--encre)] px-3 py-1.5 text-xs font-bold text-[var(--sur-encre)]"
                >
                  Telecharger
                </a>
              )}
            </div>
          ))}
          {fichiersAvecUrl.length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">Aucun fichier pour l&apos;instant.</p>
          )}
        </div>

        <p className="mb-3.5 mt-10 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
          Glossaire
        </p>
        <div className="flex flex-col gap-2.5">
          {(glossaire ?? []).map((g) => (
            <div key={g.id} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
              <p className="font-display text-sm font-bold">{g.terme}</p>
              <p className="mt-1 text-xs text-[var(--texte-mute)]">{g.definition}</p>
            </div>
          ))}
          {(glossaire ?? []).length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">Glossaire vide pour l&apos;instant.</p>
          )}
        </div>
      </div>
    </div>
  );
}
