import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { deconnexion } from "../communaute/actions";
import { sInscrire, seDesinscrire } from "./actions";
import { FormulaireAuth } from "@/components/communaute/FormulaireAuth";
import { BoutonDemanderAdhesion } from "@/components/communaute/BoutonDemanderAdhesion";
import { OngletsFlottants } from "@/components/navigation/OngletsFlottants";
import { chargerNiveaux } from "@/lib/niveaux-donnees";
import { libelleDuNiveau } from "@/lib/niveaux";
import type { Adhesion, Masterclass } from "@/types/membre";

// Masterclass : evenements en direct a venir, communaute gratuite (voir
// migration 0012). Meme gating que /prompts, duplique volontairement
// plutot que factorise (voir note dans prompts/page.tsx).
export default async function MasterclassPage({
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
          masterclass — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">
          Rejoins la communaute
        </h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Cree un compte ou connecte-toi pour voir les prochaines masterclass.
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
          masterclass — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Dernier pas</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Ton compte est cree. Demande l&apos;acces a la communaute gratuite
          pour voir les prochaines masterclass.
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
          masterclass — {espace.nom}
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

  const { data: masterclasses } = await supabase
    .from("masterclasses")
    .select("*")
    .eq("espace_id", espace.id)
    .gt("date_heure", new Date().toISOString())
    .order("date_heure", { ascending: true })
    .returns<Masterclass[]>();

  const { data: inscriptions } = await supabase
    .from("inscriptions_masterclass")
    .select("masterclass_id")
    .eq("profil_id", userData.user.id);

  const idsInscrits = new Set((inscriptions ?? []).map((i) => i.masterclass_id));

  // Masterclass a venir dont le niveau minimum n'est pas atteint : la base ne renvoie que le titre,
  // la date et le niveau requis (migration 0036), jamais le lien ni la description.
  const [{ data: verrouillees }, niveaux, { data: monProfil }] = await Promise.all([
    supabase.rpc("masterclasses_verrouillees", { p_espace: espace.id }),
    chargerNiveaux(supabase, espace.id),
    supabase.from("profils").select("points").eq("id", userData.user.id).maybeSingle(),
  ]);
  const aDebloquer = ((verrouillees ?? []) as { id: string; titre: string; date_heure: string; niveau_min: number }[]).map(
    (m) => {
      const requis = niveaux.find((n) => n.niveau === m.niveau_min);
      return {
        ...m,
        libelleNiveau: libelleDuNiveau(m.niveau_min, niveaux),
        manque: requis ? Math.max(requis.points_requis - (monProfil?.points ?? 0), 0) : null,
      };
    }
  );

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-4 sm:px-7">
        <span className="font-display shrink-0 text-[14.5px] font-bold">{espace.nom}</span>
        <div className="flex min-w-0 gap-6 overflow-x-auto whitespace-nowrap font-mono text-[13px] font-bold text-[var(--texte-mute)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href={`/${espace.slug}/communaute`} className="hover:text-[var(--sarcelle)]">
            Communaute
          </Link>
          <span className="border-b-2 border-[var(--sarcelle)] pb-1 text-[var(--sarcelle)]">
            Masterclass
          </span>
          <Link href={`/${espace.slug}/calendrier`} className="hover:text-[var(--sarcelle)]">
            Calendrier
          </Link>
        </div>
        {boutonDeconnexion}
      </div>

      <OngletsFlottants espaceSlug={espace.slug} />

      <div className="mx-auto max-w-3xl px-7 py-8">
        <p className="font-display text-[23px] font-extrabold tracking-tight">
          Prochaines masterclass
        </p>
        <p className="mt-1.5 text-[13px] text-[var(--texte-mute)]">
          Sessions en direct, inscris-toi pour recevoir le lien.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          {(masterclasses ?? []).map((m) => {
            const inscrit = idsInscrits.has(m.id);
            const date = new Date(m.date_heure);
            return (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5"
              >
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--sarcelle)]">
                    {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                    {" — "}
                    {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <p className="font-display mt-1.5 text-base font-bold">{m.titre}</p>
                  {m.description && (
                    <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">{m.description}</p>
                  )}
                </div>
                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                  {inscrit && (
                    <a
                      href={m.lien}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[var(--sarcelle)] underline"
                    >
                      Lien pour rejoindre
                    </a>
                  )}
                  <form action={inscrit ? seDesinscrire.bind(null, espace.slug, m.id) : sInscrire.bind(null, espace.slug, m.id)}>
                    <button
                      type="submit"
                      className={`rounded-lg px-3.5 py-2 text-xs font-bold ${
                        inscrit
                          ? "border border-[var(--ligne)] text-[var(--texte-mute)]"
                          : "bg-[var(--corail)] text-[var(--encre)]"
                      }`}
                    >
                      {inscrit ? "Tu participes ✓ (annuler)" : "Je participe"}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
          {aDebloquer.map((m) => {
            const date = new Date(m.date_heure);
            return (
              <div
                key={m.id}
                className="rounded-2xl border border-dashed border-[var(--ligne)] bg-[var(--fond-carte)] p-5 opacity-90"
              >
                <p className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
                  {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                  {" — "}
                  {date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="font-display mt-1.5 text-base font-bold">
                  <span aria-hidden="true">🔒 </span>
                  {m.titre}
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">
                  Réservée au niveau « {m.libelleNiveau} ».
                  {m.manque !== null && m.manque > 0 && (
                    <> Encore {m.manque} point{m.manque > 1 ? "s" : ""} pour la débloquer : ils viennent des likes reçus sur tes posts.</>
                  )}
                </p>
              </div>
            );
          })}
          {(masterclasses ?? []).length === 0 && aDebloquer.length === 0 && (
            <p className="text-sm text-[var(--texte-mute)]">
              Aucune masterclass programmee pour l&apos;instant.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
