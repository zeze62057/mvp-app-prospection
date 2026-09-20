import Link from "next/link";
import { contexteMembre } from "@/lib/contexte-membre";
import { chargerEvenements } from "@/lib/calendrier-donnees";
import {
  cleJour,
  grilleMois,
  grouperParJour,
  heure,
  libelleJour,
  libelleMois,
  moisPrecedent,
  moisSuivant,
  parseMois,
  versParam,
  type EvenementCalendrier,
} from "@/lib/calendrier";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { OngletsFlottants } from "@/components/navigation/OngletsFlottants";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const TYPE = {
  masterclass: { libelle: "Masterclass", pastille: "bg-[var(--corail)]", badge: "bg-[rgba(255,122,77,0.16)] text-[#B4451F]" },
  rdv: { libelle: "Appel découverte", pastille: "bg-[var(--sarcelle)]", badge: "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle)]" },
} as const;

const STATUT: Record<EvenementCalendrier["statut"], string> = {
  inscrit: "Tu participes ✓",
  reserve: "Réservé par toi ✓",
  ouvert: "Ouvert aux inscriptions",
  libre: "Créneau libre",
};

// Calendrier d'un espace : les masterclass et les creneaux d'appel decouverte, mois par mois.
// Une pastille par evenement dans la grille, puis la liste du mois jour par jour. Pas de rappel par
// e-mail : un evenement auquel on participe s'ajoute a son agenda (.ics), qui sonne 30 minutes avant.
export default async function CalendrierPage({
  params,
  searchParams,
}: {
  params: Promise<{ espace: string }>;
  searchParams: Promise<{ mois?: string }>;
}) {
  const { espace: slug } = await params;
  const { mois } = await searchParams;
  const { supabase, espace, userId, estMembre } = await contexteMembre(slug);

  const entete = (
    <EnTeteMembre
      espaceSlug={espace.slug}
      espaceNom={espace.nom}
      titre="Calendrier"
      retour={{ href: `/${espace.slug}/communaute`, libelle: "← Retour au fil" }}
    />
  );

  if (!estMembre) {
    return (
      <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
        {entete}
        <div className="mx-auto max-w-xl p-7 text-center">
          <p className="text-sm text-[var(--texte-mute)]">Le calendrier est réservé aux membres de {espace.nom}.</p>
          <Link
            href={`/${espace.slug}/communaute`}
            className="mt-4 inline-block font-mono text-[13px] font-bold text-[var(--sarcelle)]"
          >
            Rejoindre la communauté →
          </Link>
        </div>
      </div>
    );
  }

  const periode = parseMois(mois);
  const aujourdhui = cleJour(new Date());
  const moisCourant = versParam(parseMois(undefined));
  const evenements = await chargerEvenements(supabase, espace, userId, periode);
  const parJour = grouperParJour(evenements);
  const base = `/${espace.slug}/calendrier`;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      {entete}
      <OngletsFlottants espaceSlug={espace.slug} />

      <div className="mx-auto max-w-3xl p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="font-display text-[23px] font-extrabold tracking-tight">{libelleMois(periode)}</h1>
          <div className="flex items-center gap-2 font-mono text-[12.5px] font-bold">
            <Link
              href={`${base}?mois=${versParam(moisPrecedent(periode))}`}
              aria-label="Mois précédent"
              className="rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 hover:text-[var(--sarcelle)]"
            >
              ←
            </Link>
            {versParam(periode) !== moisCourant && (
              <Link
                href={base}
                className="rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 hover:text-[var(--sarcelle)]"
              >
                Aujourd&apos;hui
              </Link>
            )}
            <Link
              href={`${base}?mois=${versParam(moisSuivant(periode))}`}
              aria-label="Mois suivant"
              className="rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 hover:text-[var(--sarcelle)]"
            >
              →
            </Link>
          </div>
        </div>

        <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-2 sm:p-3" role="grid" aria-label={libelleMois(periode)}>
          <div className="grid grid-cols-7 pb-1 text-center font-mono text-[10.5px] uppercase text-[var(--texte-mute)]" role="row">
            {JOURS.map((j) => (
              <span key={j} role="columnheader">
                {j}
              </span>
            ))}
          </div>
          {grilleMois(periode).map((semaine, i) => (
            <div key={i} className="grid grid-cols-7 gap-1 pb-1" role="row">
              {semaine.map((cle, k) => {
                if (!cle) return <span key={k} role="gridcell" className="min-h-[52px]" />;
                const duJour = parJour.get(cle) ?? [];
                const estAujourdhui = cle === aujourdhui;
                const contenu = (
                  <>
                    <span
                      className={`text-[12.5px] font-bold ${
                        estAujourdhui
                          ? "rounded-full bg-[var(--encre)] px-1.5 py-0.5 text-[var(--sur-encre)]"
                          : "text-[var(--texte)]"
                      }`}
                    >
                      {Number(cle.slice(8))}
                    </span>
                    {duJour.length > 0 && (
                      <span className="mt-1 flex flex-wrap justify-center gap-0.5">
                        {duJour.slice(0, 3).map((e) => (
                          <span key={e.type + e.id} className={`h-1.5 w-1.5 rounded-full ${TYPE[e.type].pastille}`} />
                        ))}
                      </span>
                    )}
                  </>
                );
                const classe =
                  "flex min-h-[52px] flex-col items-center rounded-lg px-1 py-1.5 " +
                  (duJour.length > 0 ? "bg-[var(--fond)] hover:bg-[rgba(43,140,130,0.1)]" : "");
                return duJour.length > 0 ? (
                  <a
                    key={k}
                    role="gridcell"
                    href={`#jour-${cle}`}
                    className={classe}
                    aria-label={`${libelleJour(cle)} : ${duJour.length} événement${duJour.length > 1 ? "s" : ""}`}
                  >
                    {contenu}
                  </a>
                ) : (
                  <span key={k} role="gridcell" className={classe}>
                    {contenu}
                  </span>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap gap-4 font-mono text-[11px] text-[var(--texte-mute)]">
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${TYPE.masterclass.pastille}`} /> Masterclass
          </span>
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${TYPE.rdv.pastille}`} /> Appel découverte
          </span>
        </div>

        <div className="mt-7 flex flex-col gap-6">
          {[...parJour.entries()].map(([cle, liste]) => (
            <section key={cle} id={`jour-${cle}`} className="scroll-mt-20">
              <h2 className="font-display mb-2.5 text-[15px] font-bold">{libelleJour(cle)}</h2>
              <ul className="flex flex-col gap-2.5">
                {liste.map((e) => {
                  const participe = e.statut === "inscrit" || e.statut === "reserve";
                  return (
                    <li
                      key={e.type + e.id}
                      className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[12px] font-bold">{heure(e.debut)}</span>
                        <span className={`rounded-[5px] px-1.5 py-px font-mono text-[10px] font-bold ${TYPE[e.type].badge}`}>
                          {TYPE[e.type].libelle}
                        </span>
                        <span className={`ml-auto text-[11.5px] font-bold ${participe ? "text-[var(--sarcelle)]" : "text-[var(--texte-mute)]"}`}>
                          {STATUT[e.statut]}
                        </span>
                      </div>
                      <p className="font-display mt-1.5 text-[15px] font-bold leading-snug">{e.titre}</p>
                      {e.description && (
                        <p className="mt-1 whitespace-pre-wrap text-[12.5px] text-[var(--texte-mute)]">{e.description}</p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12.5px] font-bold">
                        <Link href={e.page} className="text-[var(--sarcelle)] underline">
                          {participe ? "Gérer" : e.type === "rdv" ? "Réserver" : "Je participe"}
                        </Link>
                        {participe && e.lien && (
                          <a href={e.lien} target="_blank" rel="noopener noreferrer" className="text-[var(--sarcelle)] underline">
                            Lien pour rejoindre
                          </a>
                        )}
                        {participe && (
                          <a
                            href={`/api/calendrier/ics?espace=${espace.slug}&type=${e.type}&id=${e.id}`}
                            className="text-[var(--texte-mute)] underline"
                          >
                            Ajouter à mon agenda (rappel 30 min avant)
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          {evenements.length === 0 && (
            <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
              Rien de prévu en {libelleMois(periode).toLowerCase()}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
