import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import type { AccesPayant, Ressource, TermeGlossaire } from "@/types/membre";

// Ressources de la formation payante (outils, fichiers, glossaire) :
// reservees a l'acces payant, contrairement aux prompts qui sont l'aimant
// a prospects gratuit (voir migration 0010 vs 0011, decision explicite de
// Zeze le 2026-09-16). Meme gate que /progression.

// Kits de Vivier IA a telecharger. La place est reservee des maintenant : le kit apparait des qu'un
// fichier du meme titre est depose dans les ressources (page admin). Les titres doivent rester identiques.
const SLUG_KITS = "vivier-ia";
const KITS = [
  {
    titre: "Kit Startup",
    accroche: "Tout pour démarrer ton projet au bon rythme : fichiers de départ, modèles et consignes prêts à l'emploi.",
    icone: "🚀",
  },
  {
    titre: "Agent assistant personnel",
    accroche: "Ton agent d'assistant personnel prêt à installer : dossiers, instructions et réglages déjà préparés.",
    icone: "🤖",
  },
];

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
        .createSignedUrl(f.chemin_storage, 3600, { download: true });
      return { ...f, urlSignee: data?.signedUrl ?? null };
    })
  );

  const avecKits = espace.slug === SLUG_KITS;
  const titresKits = new Set(KITS.map((k) => k.titre));
  const kits = avecKits
    ? KITS.map((k) => ({ ...k, fichier: fichiersAvecUrl.find((f) => f.titre === k.titre && f.urlSignee) ?? null }))
    : [];
  const autresFichiers = avecKits ? fichiersAvecUrl.filter((f) => !titresKits.has(f.titre)) : fichiersAvecUrl;

  const titreSection = "font-display flex items-center gap-3 text-[20px] font-extrabold tracking-tight";
  const barre = <span aria-hidden="true" className="h-6 w-1.5 shrink-0 rounded-full bg-[var(--corail)]" />;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-8 sm:px-7">
        <header className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[var(--encre)] via-[var(--encre-2)] to-[var(--sarcelle)] p-6 text-[var(--sur-encre)] shadow-[0_10px_28px_rgba(0,0,0,0.2)] sm:p-8">
          <span aria-hidden="true" className="pointer-events-none absolute -right-12 -top-14 h-48 w-48 rounded-full bg-[rgba(255,255,255,0.07)]" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 right-20 h-40 w-40 rounded-full border-[16px] border-[rgba(255,255,255,0.06)]" />
          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-full w-1.5 bg-[var(--corail)]" />
          <div className="relative">
            <span className="rounded-full bg-[var(--corail)] px-2.5 py-1 font-mono text-[10.5px] font-extrabold uppercase tracking-wide text-[var(--encre)]">
              Boîte à outils
            </span>
            <h1 className="font-display mt-4 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">
              Tout ce qu&apos;il te faut pour passer à l&apos;action
            </h1>
            <p className="mt-2 max-w-xl text-[13.5px] text-[var(--sur-encre-mute)]">
              Les outils à installer, les kits à télécharger et le glossaire pour comprendre chaque mot.
            </p>
          </div>
        </header>

        {avecKits && (
          <section>
            <h2 className={titreSection}>{barre} Kits à télécharger</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {kits.map((k) => (
                <div
                  key={k.titre}
                  className="relative flex flex-col overflow-hidden rounded-[18px] border border-[var(--sarcelle)]/40 bg-[var(--fond-carte)] shadow-[0_6px_20px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[var(--sarcelle)] to-[var(--encre-2)] px-5 py-4 text-[var(--sur-encre)]">
                    <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,255,255,0.16)] text-[24px]">
                      {k.icone}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-[16.5px] font-extrabold leading-tight">{k.titre}</div>
                      <span
                        className={`mt-1 inline-block rounded-full px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wide ${
                          k.fichier ? "bg-[var(--corail)] text-[var(--encre)]" : "bg-[rgba(255,255,255,0.18)]"
                        }`}
                      >
                        {k.fichier ? "Disponible" : "Bientôt disponible"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <p className="text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
                      {k.fichier?.description || k.accroche}
                    </p>
                    {k.fichier?.urlSignee ? (
                      <a
                        href={k.fichier.urlSignee}
                        className="mt-auto inline-flex items-center justify-center gap-2 rounded-[10px] bg-[var(--corail)] px-5 py-3 text-[13px] font-extrabold text-[var(--encre)] shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-transform hover:-translate-y-0.5"
                      >
                        ⬇ Télécharger le kit
                      </a>
                    ) : (
                      <div className="mt-auto rounded-[10px] border border-dashed border-[var(--ligne)] px-5 py-3 text-center text-[12.5px] font-semibold text-[var(--texte-mute)]">
                        Le fichier sera déposé ici très bientôt
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className={titreSection}>{barre} Outils à installer</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {liens.map((r) => (
              <a
                key={r.id}
                href={r.url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="group flex items-start gap-3.5 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 shadow-[0_3px_12px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-[var(--sarcelle)]"
              >
                <span
                  aria-hidden="true"
                  className="font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--encre)] text-[18px] font-extrabold text-[var(--corail)]"
                >
                  {r.titre.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="font-display flex items-center gap-1.5 text-[14.5px] font-extrabold">
                    {r.titre}
                    <span className="text-[12px] text-[var(--sarcelle)] opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">{r.description}</p>
                </div>
              </a>
            ))}
            {liens.length === 0 && (
              <p className="text-sm text-[var(--texte-mute)]">Aucun outil pour l&apos;instant.</p>
            )}
          </div>
        </section>

        {autresFichiers.length > 0 && (
          <section>
            <h2 className={titreSection}>{barre} Autres téléchargements</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {autresFichiers.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
                >
                  <div className="min-w-0">
                    <p className="font-display text-[14.5px] font-extrabold">{f.titre}</p>
                    <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">{f.description}</p>
                  </div>
                  {f.urlSignee && (
                    <a
                      href={f.urlSignee}
                      className="shrink-0 whitespace-nowrap rounded-lg bg-[var(--corail)] px-3.5 py-2 text-xs font-extrabold text-[var(--encre)]"
                    >
                      ⬇ Télécharger
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className={titreSection}>{barre} Glossaire</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {(glossaire ?? []).map((g) => (
              <div
                key={g.id}
                className="rounded-2xl border border-[var(--ligne)] border-l-[5px] border-l-[var(--sarcelle)] bg-[var(--fond-carte)] p-4"
              >
                <p className="font-display text-[14.5px] font-extrabold">{g.terme}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">{g.definition}</p>
              </div>
            ))}
            {(glossaire ?? []).length === 0 && (
              <p className="text-sm text-[var(--texte-mute)]">Glossaire vide pour l&apos;instant.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
