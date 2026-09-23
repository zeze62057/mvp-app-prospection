import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "../communaute/actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { FilCommunaute } from "@/components/communaute/fil/FilCommunaute";
import { MessageAccueil } from "@/components/communaute/MessageAccueil";
import { OngletsFlottants } from "@/components/navigation/OngletsFlottants";
import { CartePostulerExpert } from "@/components/communaute/CartePostulerExpert";
import { CarteCommunaute } from "@/components/communaute/CarteCommunaute";
import { CarteProchainsEvenements } from "@/components/communaute/CarteProchainsEvenements";
import { CarteClassement } from "@/components/communaute/CarteClassement";
import { CarteEncouragement } from "@/components/communaute/CarteEncouragement";
import { couleurAvatar } from "@/lib/avatar";
import type { AccesPayant, CandidatureExpert, StatsCommunaute } from "@/types/membre";

export default async function CommunautePayantePage({
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
      <button type="submit" className="shrink-0 whitespace-nowrap text-xs text-[var(--texte-mute)] underline">
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

  const [{ data: monProfil }, { data: statsRpc }] = await Promise.all([
    supabase.from("profils").select("pseudo, role").eq("id", userData.user.id).maybeSingle(),
    // Liste des eleves via une fonction : acces_payant n'est lisible que pour sa propre
    // ligne, donc la liste directe ne montrait que soi-meme (migration 0031).
    supabase.rpc("stats_communaute", { p_espace: espace.id }),
  ]);

  const stats = statsRpc as StatsCommunaute | null;
  const membres = stats?.eleves ?? [];

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <div className="flex items-center gap-2">
          <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
          <span className="rounded-[6px] bg-[var(--encre)] px-2 py-0.5 font-mono text-[9.5px] tracking-wide text-[var(--sarcelle-light)]">
            eleves
          </span>
        </div>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/progression`} className="hover:text-[var(--sarcelle)]">
            Ma progression
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Communaute payante
          </span>
          <Link href={`/${espace.slug}/membres`} className="hover:text-[var(--sarcelle)]">
            Membres
          </Link>
          <Link href={`/${espace.slug}/a-propos`} className="hover:text-[var(--sarcelle)]">
            À propos
          </Link>
          <Link href={`/${espace.slug}/calendrier`} className="hover:text-[var(--sarcelle)]">
            Calendrier
          </Link>
          <Link href={`/${espace.slug}/formation`} className="hover:text-[var(--sarcelle)]">
            Formation
          </Link>
          <Link href={`/${espace.slug}/expert`} className="hover:text-[var(--sarcelle)]">
            Devenir Expert
          </Link>
        </div>
        {boutonDeconnexion}
      </div>

      <OngletsFlottants espaceSlug={espace.slug} />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-7 md:grid-cols-[1fr_300px]">
        <div>
          <MessageAccueil espaceId={espace.id} />

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

          <FilCommunaute
            supabase={supabase}
            espace={espace}
            zone="payante"
            userId={userData.user.id}
            auteurPseudo={monProfil?.pseudo ?? "Moi"}
            estAdmin={monProfil?.role === "admin"}
            categorieId={cat ?? null}
            recherche={q ?? null}
          />
        </div>

        <div className="flex flex-col gap-4">
          <CarteCommunaute
            espaceNom={espace.nom}
            espaceSlug={espace.slug}
            nbMembres={stats?.nb_membres ?? 0}
            nbEleves={stats?.nb_eleves ?? 0}
            banniereUrl={
              espace.banniere_path
                ? supabase.storage.from("bannieres-espaces").getPublicUrl(espace.banniere_path).data.publicUrl
                : null
            }
          />

          <CarteProchainsEvenements supabase={supabase} espace={espace} userId={userData.user.id} />

          <CarteClassement espaceSlug={espace.slug} classement={stats?.classement ?? []} />

          <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
            <div className="font-display mb-3.5 text-[13px] font-bold">Membres</div>
            {membres.map((m) => (
              <Link
                key={m.id}
                href={`/${espace.slug}/membres/${m.id}`}
                className="flex items-center gap-2.5 py-1.5 hover:text-[var(--sarcelle)]"
              >
                <div className="h-7 w-7 flex-shrink-0 rounded-full" style={{ background: couleurAvatar(m.id) }} />
                <span className="text-xs font-bold">{m.pseudo}</span>
              </Link>
            ))}
            {membres.length === 0 && (
              <p className="text-xs text-[var(--texte-mute)]">Tu es le premier ici.</p>
            )}
            <Link
              href={`/${espace.slug}/membres`}
              className="mt-2.5 block font-mono text-[11.5px] font-bold text-[var(--sarcelle)]"
            >
              Voir tous les membres →
            </Link>
          </div>

          <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
            <div className="font-display mb-3.5 text-[13px] font-bold">A propos</div>
            <p className="text-[11.5px] leading-[1.5] text-[var(--texte-mute)]">
              Espace reserve aux eleves ayant debloque la formation complete {espace.nom}.
            </p>
          </div>

          <CarteEncouragement espaceNom={espace.nom} />
        </div>
      </div>
    </div>
  );
}
