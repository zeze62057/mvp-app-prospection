import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deconnexion } from "../communaute/actions";
import { EcranConnexion } from "@/components/communaute/EcranConnexion";
import { FilCommunaute } from "@/components/communaute/fil/FilCommunaute";
import { MessageAccueil } from "@/components/communaute/MessageAccueil";
import { OngletsFlottants } from "@/components/navigation/OngletsFlottants";
import { CartePostulerExpert } from "@/components/communaute/CartePostulerExpert";
import { BandeauCommunaute } from "@/components/communaute/BandeauCommunaute";
import { CarteProchainsEvenements } from "@/components/communaute/CarteProchainsEvenements";
import { CarteClassement } from "@/components/communaute/CarteClassement";
import { CarteEncouragement } from "@/components/communaute/CarteEncouragement";
import { couleurAvatar } from "@/lib/avatar";
import { CompteurAnime } from "@/components/progression/CompteurAnime";
import { salutationConakry } from "@/lib/salutation";
import type { CSSProperties } from "react";
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
          <EcranConnexion espace={espace} />
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

  // Stats reelles pour le bandeau d'accueil : "en ligne maintenant" de la capture de
  // reference est omis, aucun suivi de presence n'existe dans l'app.
  const debutMois = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();
  const maintenant = new Date().toISOString();
  const [{ count: nbDiscussionsMois }, { count: nbMasterclassAvenir }, { data: avisPourMoyenne }] =
    await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }).eq("espace_id", espace.id).eq("zone", "payante").gte("created_at", debutMois),
      supabase.from("masterclasses").select("*", { count: "exact", head: true }).eq("espace_id", espace.id).gte("date_heure", maintenant),
      // Client admin : la lecture des avis n'est pas ouverte aux membres via RLS (voir vitrine).
      createAdminClient().from("temoignages").select("note").eq("espace_id", espace.id).eq("autorise_partage", true),
    ]);
  const noteMoyenne =
    avisPourMoyenne && avisPourMoyenne.length > 0
      ? avisPourMoyenne.reduce((total, a) => total + a.note, 0) / avisPourMoyenne.length
      : null;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <div className="flex items-center gap-2">
          <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
          <span className="rounded-[6px] bg-[var(--encre)] px-2 py-0.5 font-mono text-[9.5px] tracking-wide text-[var(--sarcelle-light)]">
            eleves
          </span>
        </div>
        {boutonDeconnexion}
      </div>

      <OngletsFlottants espaceSlug={espace.slug} />

      {/* Bandeau d'accueil : meme style que le tableau de bord eleve. Que des donnees reelles (pseudo, accroche,
          statut Expert). Les animations sont dans globals.css et s'arretent pour qui a demande moins d'animations. */}
      <div
        className="relative overflow-hidden px-4 py-9 text-[var(--sur-encre)] sm:px-7 sm:py-11"
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(95,199,184,0.4), transparent 50%), radial-gradient(circle at 96% 10%, rgba(255,122,77,0.24), transparent 45%), radial-gradient(rgba(234,245,242,0.12) 1.5px, transparent 1.5px) 0 0 / 20px 20px, linear-gradient(135deg, #16443c, #0b2622)",
        }}
      >
        <div className="anim-entree relative mx-auto max-w-5xl">
          <svg
            aria-hidden
            className="anim-flotte pointer-events-none absolute -right-2 -top-8 hidden h-[230px] w-[230px] sm:block"
            viewBox="0 0 120 120"
            fill="none"
          >
            <circle cx="45" cy="75" r="22" stroke="#5FC7B8" strokeOpacity="0.5" strokeWidth="9" />
            <line x1="61" y1="59" x2="95" y2="25" stroke="#5FC7B8" strokeOpacity="0.5" strokeWidth="9" strokeLinecap="round" />
            <circle className="anim-lueur" cx="95" cy="25" r="9" fill="#FF7A4D" />
          </svg>
          <div className="relative sm:max-w-[62%]">
            <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-light)]">communauté payante</p>
            <h1 className="font-display mt-1.5 text-[28px] font-extrabold leading-tight tracking-tight sm:text-[36px]">
              {salutationConakry()}{" "}
              <span className="text-[var(--sarcelle-light)]">{monProfil?.pseudo ?? "parmi les élèves"}</span>{" "}
              <span className="anim-salue" aria-hidden>
                👋
              </span>
            </h1>
            {espace.tagline && (
              <p className="mt-2 text-[13.5px] text-[var(--sur-encre-mute)]">{espace.tagline}</p>
            )}
            {acces.est_expert && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(255,122,77,0.35)] bg-[rgba(255,122,77,0.14)] px-4 py-2 font-mono text-xs font-bold text-[var(--corail)]">
                ★ Expert {espace.nom}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* "En ligne maintenant" de la capture de reference est omis : aucun suivi de presence n'existe. */}
      <div className="mx-auto flex max-w-5xl flex-wrap gap-3.5 p-7 pb-0">
        <div className="anim-entree carte-vivante min-w-[140px] flex-1 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-4" style={{ "--d": "120ms" } as CSSProperties}>
          <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
            <CompteurAnime valeur={stats?.nb_eleves ?? 0} />
          </div>
          <div className="mt-0.5 text-xs text-[var(--texte-mute)]">élève{(stats?.nb_eleves ?? 0) !== 1 ? "s" : ""}</div>
        </div>
        <div className="anim-entree carte-vivante min-w-[140px] flex-1 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-4" style={{ "--d": "200ms" } as CSSProperties}>
          <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
            <CompteurAnime valeur={nbDiscussionsMois ?? 0} />
          </div>
          <div className="mt-0.5 text-xs text-[var(--texte-mute)]">discussion{(nbDiscussionsMois ?? 0) !== 1 ? "s" : ""} ce mois</div>
        </div>
        <div className="anim-entree carte-vivante min-w-[140px] flex-1 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-4" style={{ "--d": "280ms" } as CSSProperties}>
          <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
            <CompteurAnime valeur={nbMasterclassAvenir ?? 0} />
          </div>
          <div className="mt-0.5 text-xs text-[var(--texte-mute)]">événement{(nbMasterclassAvenir ?? 0) !== 1 ? "s" : ""} à venir</div>
        </div>
        {noteMoyenne !== null && (
          <div className="anim-entree carte-vivante min-w-[140px] flex-1 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-5 py-4" style={{ "--d": "360ms" } as CSSProperties}>
            <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">
              <CompteurAnime valeur={noteMoyenne} decimales={1} />/5
            </div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">satisfaction des membres</div>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-7 pt-7">
        <BandeauCommunaute
          espaceNom={espace.nom}
          nbMembres={stats?.nb_membres ?? 0}
          nbEleves={stats?.nb_eleves ?? 0}
        />
      </div>

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
