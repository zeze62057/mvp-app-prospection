import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "./actions";
import { EcranConnexion } from "@/components/communaute/EcranConnexion";
import { BoutonDemanderAdhesion } from "@/components/communaute/BoutonDemanderAdhesion";
import { FilCommunaute } from "@/components/communaute/fil/FilCommunaute";
import { MessageAccueil } from "@/components/communaute/MessageAccueil";
import { AccueilGratuite } from "@/components/communaute/AccueilGratuite";
import { BandeauGratuite } from "@/components/communaute/BandeauGratuite";
import { CarteProchainsEvenements } from "@/components/communaute/CarteProchainsEvenements";
import { CarteClassement } from "@/components/communaute/CarteClassement";
import { CarteEncouragement } from "@/components/communaute/CarteEncouragement";
import { BandeauFormationDebloquee } from "@/components/communaute/BandeauFormationDebloquee";
import type { Adhesion, StatsCommunaute } from "@/types/membre";

export default async function CommunauteGratuitePage({
  params,
  searchParams,
}: {
  params: Promise<{ espace: string }>;
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const { espace: slug } = await params;
  const { cat, q } = await searchParams;
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
          <EcranConnexion espace={espace} />
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
      <button type="submit" className="shrink-0 whitespace-nowrap text-xs text-[var(--texte-mute)] underline">
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

  const [{ data: monProfil }, { data: statsRpc }] = await Promise.all([
    supabase.from("profils").select("pseudo, role").eq("id", userData.user.id).maybeSingle(),
    // Compteur et classement via une fonction : la table adhesions n'est lisible que pour
    // ses propres lignes, donc les compter directement donnait toujours 1 (migration 0031).
    supabase.rpc("stats_communaute", { p_espace: espace.id }),
  ]);
  const stats = statsRpc as StatsCommunaute | null;

  // Élève qui a déjà payé : au lieu de « Débloque », un bandeau de reprise de la formation.
  const { data: accesPayant } = await supabase
    .from("acces_payant")
    .select("actif")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle();
  let reprise: { faites: number; total: number; prochain: { id: string; titre: string } | null } | null = null;
  if (accesPayant?.actif) {
    const { data: modules } = await supabase.from("modules").select("id, ordre").eq("espace_id", espace.id);
    const ordreModule = new Map((modules ?? []).map((m) => [m.id, m.ordre as number]));
    const [{ data: sections }, { data: faitesRows }] = await Promise.all([
      ordreModule.size
        ? supabase
            .from("sections")
            .select("id, module_id, ordre, titre, video_path, a_contenu")
            .in("module_id", [...ordreModule.keys()])
        : Promise.resolve({ data: [] as { id: string; module_id: string; ordre: number; titre: string; video_path: string | null; a_contenu: boolean }[] }),
      supabase.from("progression").select("section_id").eq("profil_id", userData.user.id),
    ]);
    const terminees = new Set((faitesRows ?? []).map((p) => p.section_id));
    const triees = [...(sections ?? [])].sort(
      (a, b) => (ordreModule.get(a.module_id) ?? 0) - (ordreModule.get(b.module_id) ?? 0) || a.ordre - b.ordre
    );
    // Même règle que la page Formation : un chapitre est ouvrable s'il a du contenu ou une vidéo.
    const ouvrables = triees.filter((x) => x.a_contenu || !!x.video_path);
    reprise = {
      faites: ouvrables.filter((x) => terminees.has(x.id)).length,
      total: ouvrables.length,
      prochain: ouvrables.find((x) => !terminees.has(x.id)) ?? null,
    };
  }

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        {boutonDeconnexion}
      </div>


      <div className="mx-auto flex max-w-5xl flex-col gap-5 px-7 pt-7">
        <AccueilGratuite
          pseudo={monProfil?.pseudo ?? ""}
          nbMembres={stats?.nb_membres ?? 0}
          nbEleves={stats?.nb_eleves ?? 0}
        />
        <BandeauGratuite espaceNom={espace.nom} />
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-7 md:grid-cols-[1fr_300px]">
        <div>
          {reprise ? (
            <BandeauFormationDebloquee
              pseudo={monProfil?.pseudo ?? "toi"}
              espaceSlug={espace.slug}
              faites={reprise.faites}
              total={reprise.total}
              prochain={reprise.prochain}
            />
          ) : (
          <Link
            href={`/${espace.slug}/tunnel`}
            className="relative mb-[18px] flex items-center justify-between overflow-hidden rounded-[14px] bg-[var(--encre)] px-6 py-5 text-[var(--sur-encre)]"
          >
            <div>
              <b className="font-display block text-[14.5px] font-bold">
                Debloque la formation complete
              </b>
              <span className="text-xs text-[var(--sur-encre-mute)]">
                Paiement Mobile Money, acces active dès reception.
              </span>
            </div>
            <span className="whitespace-nowrap rounded-[9px] bg-[var(--corail)] px-[18px] py-2.5 text-[12.5px] font-extrabold text-[var(--encre)]">
              Debloquer
            </span>
          </Link>
          )}

          <MessageAccueil espaceId={espace.id} />

          <FilCommunaute
            supabase={supabase}
            espace={espace}
            zone="gratuite"
            userId={userData.user.id}
            auteurPseudo={monProfil?.pseudo ?? "Moi"}
            estAdmin={monProfil?.role === "admin"}
            categorieId={cat ?? null}
            recherche={q ?? null}
          />
        </div>

        <div className="flex flex-col gap-4">
          <CarteProchainsEvenements supabase={supabase} espace={espace} userId={userData.user.id} />

          <CarteClassement espaceSlug={espace.slug} classement={stats?.classement ?? []} />

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
            <Link
              href={`/${espace.slug}/membres`}
              className="block rounded-lg px-2.5 py-2.5 text-[12.5px] text-[var(--texte-mute)] hover:bg-[var(--fond)]"
            >
              Membres
            </Link>
            <Link
              href={`/${espace.slug}/profil`}
              className="block rounded-lg px-2.5 py-2.5 text-[12.5px] text-[var(--texte-mute)] hover:bg-[var(--fond)]"
            >
              Mon profil
            </Link>
          </div>

          <CarteEncouragement espaceNom={espace.nom} />
        </div>
      </div>
    </div>
  );
}
