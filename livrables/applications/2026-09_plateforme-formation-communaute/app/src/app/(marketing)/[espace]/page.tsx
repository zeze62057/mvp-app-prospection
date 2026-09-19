import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createAdminClient } from "@/lib/supabase/admin";
import { TexteRiche } from "@/lib/texte-riche";

export default async function VitrinePage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const c = espace.contenu_vitrine ?? {};
  const admin = createAdminClient();

  const [{ count: nbMembres }, { data: modulesData }, { data: temoignages }] = await Promise.all([
    admin.from("adhesions").select("*", { count: "exact", head: true }).eq("espace_id", espace.id).eq("statut", "approuve"),
    admin.from("modules").select("id, sections(id)").eq("espace_id", espace.id),
    admin
      .from("temoignages")
      .select("id, note, texte, profils(pseudo)")
      .eq("espace_id", espace.id)
      .eq("autorise_partage", true)
      .order("note", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const nbModulesDisponibles = (modulesData ?? []).filter(
    (m) => ((m as unknown as { sections: unknown[] }).sections ?? []).length > 0
  ).length;

  return (
    <div className="bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between px-6 py-6 sm:px-16">
        <span className="font-display text-lg font-semibold">Vivier Academies</span>
        <Link
          href={`/${espace.slug}/communaute`}
          className="text-sm font-semibold text-[var(--texte-mute)] hover:text-[var(--texte)]"
        >
          Se connecter
        </Link>
      </div>

      <div className="flex flex-col gap-14 px-6 pb-20 pt-2 sm:px-16 lg:flex-row lg:items-start lg:gap-16">
        <div className="flex-1 pt-9">
          {c.hero_kicker && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(43,140,130,0.25)] bg-[rgba(43,140,130,0.09)] py-1.5 pl-2.5 pr-3 font-mono text-[11.5px] tracking-wide text-[var(--sarcelle)]">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--corail)]" />
              {c.hero_kicker}
            </div>
          )}
          {c.hero_titre && (
            <h1 className="font-display mb-5 max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
              <TexteRiche texte={c.hero_titre} />
            </h1>
          )}
          {c.hero_sous_titre && (
            <p className="mb-8 max-w-md text-[16.5px] leading-relaxed text-[var(--texte-mute)]">
              {c.hero_sous_titre}
            </p>
          )}

          <div className="mb-3.5 flex flex-wrap items-center gap-4">
            <Link
              href={`/${espace.slug}/communaute`}
              className="rounded-[10px] bg-[var(--encre)] px-6 py-4 text-[14.5px] font-bold text-[var(--sur-encre)] shadow-[0_10px_24px_rgba(17,56,50,0.22)] transition-transform hover:-translate-y-0.5"
            >
              Rejoindre la communaute gratuite
            </Link>
            <span className="text-xs text-[var(--texte-mute)]">
              Sur approbation — reponse sous 24h
            </span>
          </div>

          <div className="mt-8 flex max-w-md items-center gap-3 border-t border-[var(--ligne)] pt-5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--sarcelle)] to-[var(--encre)] font-display text-[13px] font-bold text-[var(--sur-encre)]">
              ZB
            </div>
            <div className="text-xs leading-snug">
              <b className="font-bold text-[var(--texte)]">Zeze Bilivogui</b>
              <span className="block text-[var(--texte-mute)]">Fondateur de {espace.nom}</span>
            </div>
          </div>
        </div>

        <div className="w-full flex-shrink-0 lg:w-[420px]">
          {c.terminal_lignes && c.terminal_lignes.length > 0 && (
            <div className="overflow-hidden rounded-2xl bg-[var(--encre)] shadow-[0_30px_70px_rgba(17,56,50,0.32)]">
              <div className="flex items-center gap-2 bg-[var(--encre-2)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--corail)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--sarcelle-light)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[rgba(234,245,242,0.3)]" />
                {c.terminal_titre && (
                  <span className="ml-1.5 font-mono text-[11px] text-[var(--sur-encre-mute)]">
                    {c.terminal_titre}
                  </span>
                )}
              </div>
              <div className="px-5 py-6 font-mono text-[12.5px] leading-[1.85] text-[var(--sur-encre)]">
                {c.terminal_lignes.map((ligne, i) => (
                  <div key={i} className={i === 0 ? "" : "mt-2.5 opacity-90"}>
                    {i === 0 ? (
                      <>
                        <span className="text-[var(--sarcelle-light)]">❯</span> {ligne}
                      </>
                    ) : (
                      ligne
                    )}
                  </div>
                ))}
                {c.terminal_lien && (
                  <div className="mt-2.5">
                    → <span className="text-[var(--corail)]">{c.terminal_lien}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-3.5">
            <div className="flex-1 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3.5">
              <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
                {nbMembres ?? 0}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--texte-mute)]">membres de la communaute</div>
            </div>
            <div className="flex-1 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3.5">
              <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
                {nbModulesDisponibles}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--texte-mute)]">module{nbModulesDisponibles !== 1 ? "s" : ""} disponible{nbModulesDisponibles !== 1 ? "s" : ""}</div>
            </div>
          </div>
        </div>
      </div>

      {c.parcours_titre && (
        <div className="bg-[var(--encre)] px-6 py-16 text-[var(--sur-encre)] sm:px-16">
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle-light)]">
            le parcours
          </p>
          <h2 className="font-display mb-11 max-w-xl text-2xl font-semibold sm:text-[29px]">
            {c.parcours_titre}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <p className="mb-3.5 font-mono text-[13px] text-[var(--corail)]">01 / rejoindre</p>
              <p className="font-display mb-2.5 text-base font-bold">Communaute gratuite</p>
              <p className="text-[13.5px] leading-relaxed text-[var(--sur-encre-mute)]">
                {c.parcours_etape1}
              </p>
            </div>
            <div className="sm:border-l sm:border-[rgba(234,245,242,0.14)] sm:pl-8">
              <p className="mb-3.5 font-mono text-[13px] text-[var(--corail)]">02 / debloquer</p>
              <p className="font-display mb-2.5 text-base font-bold">Formation complete</p>
              <p className="text-[13.5px] leading-relaxed text-[var(--sur-encre-mute)]">
                {c.parcours_etape2}
              </p>
            </div>
            <div className="sm:border-l sm:border-[rgba(234,245,242,0.14)] sm:pl-8">
              <p className="mb-3.5 font-mono text-[13px] text-[var(--corail)]">03 / construire</p>
              <p className="font-display mb-2.5 text-base font-bold">Communaute payante</p>
              <p className="text-[13.5px] leading-relaxed text-[var(--sur-encre-mute)]">
                {c.parcours_etape3}
              </p>
            </div>
          </div>
        </div>
      )}

      {(c.fondateur_lede || (c.fondateur_paragraphes && c.fondateur_paragraphes.length > 0)) && (
        <div className="flex flex-col gap-10 px-6 py-16 sm:px-16 lg:flex-row lg:items-center lg:gap-14">
          <div className="relative h-[300px] flex-shrink-0 lg:w-[340px]">
            {c.fondateur_tag && (
              <div className="absolute -top-3.5 left-6 z-10 -rotate-3 rounded-lg bg-[var(--corail)] px-3 py-1.5 font-mono text-[10.5px] font-bold text-[var(--encre)]">
                {c.fondateur_tag}
              </div>
            )}
            <div className="absolute left-0 top-2.5 z-[2] h-[240px] w-[200px] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(17,56,50,0.14)]">
              <Image
                src="/zeze-bilivogui.jpg"
                alt={`Zeze Bilivogui, fondateur de ${espace.nom}`}
                width={200}
                height={240}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="absolute bottom-0 right-0 z-[1] flex h-[130px] w-[160px] items-center justify-center rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-3.5 text-center font-mono text-[11px] text-[var(--texte-mute)] shadow-[0_18px_40px_rgba(17,56,50,0.14)]">
              Capture d&apos;un
              <br />deploiement reel
            </div>
          </div>
          <div className="flex-1">
            <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
              le fondateur
            </p>
            {c.fondateur_lede && (
              <p className="mb-4 text-lg font-semibold text-[var(--texte)]">{c.fondateur_lede}</p>
            )}
            {(c.fondateur_paragraphes ?? []).map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-[var(--texte-mute)]">
                <TexteRiche texte={p} />
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-16 sm:px-16">
        <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
          preuve, pas promesse
        </p>
        <h2 className="font-display mb-8 max-w-xl text-2xl font-semibold sm:text-[29px]">
          Ce que dit la communaute
        </h2>
        {temoignages && temoignages.length > 0 ? (
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {temoignages.map((t) => (
              <div key={t.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="h-[30px] w-[30px] flex-shrink-0 rounded-full bg-[var(--sarcelle)]" />
                  <span className="text-[12.5px] font-bold">
                    {(t.profils as unknown as { pseudo: string } | null)?.pseudo ?? "Membre"}
                  </span>
                </div>
                <div className="mb-3 font-mono text-xs text-[var(--corail)]">
                  {"★".repeat(t.note)}
                  <span className="text-[var(--ligne)]">{"★".repeat(5 - t.note)}</span>
                </div>
                <p className="text-[13px] leading-relaxed text-[var(--texte)]">{t.texte}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm italic text-[var(--texte-mute)]">
            Les premiers temoignages de la communaute arrivent bientot.
          </p>
        )}
      </div>

      {c.faq && c.faq.length > 0 && (
        <div className="px-6 py-16 sm:px-16">
          <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
            questions frequentes
          </p>
          <h2 className="font-display mb-8 max-w-xl text-2xl font-semibold sm:text-[29px]">
            Ce que tu te demandes probablement
          </h2>
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {c.faq.map((item, i) => (
              <details
                key={i}
                className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5 [&[open]>summary]:mb-2.5"
              >
                <summary className="cursor-pointer text-[14.5px] font-bold text-[var(--texte)]">
                  {item.question}
                </summary>
                <p className="text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
                  {item.reponse.replace("{{prix}}", `${espace.prix.toLocaleString("fr-FR")} ${espace.devise}`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {c.offre_texte && (
        <div className="mx-6 mb-16 flex flex-col items-start gap-5 rounded-[20px] bg-gradient-to-br from-[var(--corail)] to-[#FF9068] p-8 text-[var(--encre)] sm:mx-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wide opacity-75">
              offre de lancement · places limitees
            </p>
            <p className="font-display max-w-lg text-[19px] font-bold">
              <TexteRiche texte={c.offre_texte} />
            </p>
          </div>
          <Link
            href={`/${espace.slug}/communaute`}
            className="whitespace-nowrap rounded-[10px] bg-[var(--encre)] px-6 py-3.5 text-[13.5px] font-extrabold text-[var(--sur-encre)]"
          >
            Rejoindre maintenant
          </Link>
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-2 border-t border-[var(--ligne)] px-6 py-7 font-mono text-[11.5px] text-[var(--texte-mute)] sm:flex-row sm:items-center sm:px-16">
        <span>vivier academies</span>
        <span>le vivier des talents ia francophones</span>
      </div>
    </div>
  );
}
