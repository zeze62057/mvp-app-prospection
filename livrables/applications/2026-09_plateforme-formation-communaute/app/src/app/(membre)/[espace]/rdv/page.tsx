import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "../communaute/actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { BoutonDemanderAdhesion } from "@/components/communaute/BoutonDemanderAdhesion";
import { BoutonReserver, BoutonAnnuler } from "@/components/rdv/BoutonRdv";
import type { Adhesion, CreneauRdv } from "@/types/membre";

// RDV : appel decouverte 1:1 avec Zeze, communaute gratuite (voir
// migration 0013). Meme gating que /prompts et /masterclass.
export default async function RdvPage({
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
          rdv — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Rejoins la communaute
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Cree un compte ou connecte-toi pour reserver un appel decouverte.
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
      <button type="submit" className="shrink-0 whitespace-nowrap text-xs text-[var(--texte-mute)] underline">
        Se deconnecter
      </button>
    </form>
  );

  if (!adhesion) {
    return (
      <main className="mx-auto max-w-md p-16">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          rdv — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Dernier pas</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ton compte est cree. Demande l&apos;acces a la communaute gratuite
          pour reserver un appel decouverte.
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
          rdv — {espace.nom}
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

  const { data: creneaux } = await supabase
    .from("creneaux_rdv")
    .select("*")
    .eq("espace_id", espace.id)
    .gt("date_heure", new Date().toISOString())
    .order("date_heure", { ascending: true })
    .returns<CreneauRdv[]>();

  const tesRdv = (creneaux ?? []).filter((c) => c.reserve_par === userData.user.id);
  const disponibles = (creneaux ?? []).filter((c) => c.reserve_par === null);

  function formaterDate(iso: string) {
    const d = new Date(iso);
    return (
      d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) +
      " — " +
      d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    );
  }

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/communaute`} className="hover:text-[var(--sarcelle)]">
            Communaute
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            RDV
          </span>
        </div>
        {boutonDeconnexion}
      </div>

      <div className="mx-auto max-w-3xl px-7 py-8">
        <p className="font-display text-[23px] font-extrabold tracking-tight">
          Appel decouverte
        </p>
        <p className="mt-1.5 text-[13px] text-[var(--texte-mute)]">
          Reserve un creneau pour un appel individuel avec {espace.nom}.
        </p>

        {tesRdv.length > 0 && (
          <>
            <p className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
              Tes rendez-vous
            </p>
            <div className="flex flex-col gap-3">
              {tesRdv.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-2xl border border-[var(--sarcelle)] bg-[var(--fond-carte)] p-5"
                >
                  <div>
                    <p className="font-display text-base font-bold">{formaterDate(c.date_heure)}</p>
                    <a href={c.lien} target="_blank" rel="noreferrer" className="text-xs font-bold text-[var(--sarcelle)] underline">
                      Lien pour rejoindre
                    </a>
                  </div>
                  <BoutonAnnuler espaceSlug={espace.slug} creneauId={c.id} />
                </div>
              ))}
            </div>
          </>
        )}

        <p className="mb-3 mt-8 font-mono text-[11px] uppercase tracking-wide text-[var(--sarcelle)]">
          Creneaux disponibles
        </p>
        <div className="flex flex-col gap-3">
          {disponibles.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5"
            >
              <p className="font-display text-base font-bold">{formaterDate(c.date_heure)}</p>
              <BoutonReserver espaceSlug={espace.slug} creneauId={c.id} />
            </div>
          ))}
          {disponibles.length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">
              Aucun creneau disponible pour l&apos;instant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
