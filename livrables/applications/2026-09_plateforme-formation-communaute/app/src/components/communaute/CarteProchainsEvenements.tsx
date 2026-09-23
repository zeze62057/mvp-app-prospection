import Link from "next/link";
import type { SupabaseClient } from "@supabase/supabase-js";
import { chargerEvenements } from "@/lib/calendrier-donnees";
import { heure, parseMois } from "@/lib/calendrier";

const LIBELLE_TYPE = { masterclass: "Masterclass", rdv: "Appel découverte" } as const;
const TEINTE_TYPE = {
  masterclass: "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]",
  rdv: "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]",
} as const;

// Apercu des prochains evenements en colonne de droite. Reutilise chargerEvenements
// (source du calendrier complet), pas de nouvelle requete ni de nouvelle table.
// ponytail: limite au mois courant, un evenement du mois suivant n'apparait qu'apres
// le changement de mois. A revoir si Zeze planifie loin a l'avance.
export async function CarteProchainsEvenements({
  supabase,
  espace,
  userId,
}: {
  supabase: SupabaseClient;
  espace: { id: string; slug: string };
  userId: string;
}) {
  let aVenir: Awaited<ReturnType<typeof chargerEvenements>> = [];
  let erreur = false;
  try {
    const maintenant = new Date().toISOString();
    const tous = await chargerEvenements(supabase, espace, userId, parseMois(undefined));
    aVenir = tous.filter((e) => e.debut >= maintenant).slice(0, 3);
  } catch {
    erreur = true;
  }

  return (
    <div className="rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-[18px]">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="font-display text-[13px] font-bold">Prochains événements</div>
        <Link href={`/${espace.slug}/calendrier`} className="font-mono text-[11px] font-bold text-[var(--sarcelle)]">
          Voir tout →
        </Link>
      </div>
      {erreur && (
        <p className="text-[11.5px] text-[var(--corail)]">Impossible de charger les événements.</p>
      )}
      {!erreur && aVenir.length === 0 && (
        <p className="text-[11.5px] text-[var(--texte-mute)]">Aucun événement pour le moment.</p>
      )}
      {aVenir.map((e) => (
        <Link
          key={e.type + e.id}
          href={e.page}
          className="mb-2.5 flex items-center gap-2.5 last:mb-0 hover:text-[var(--sarcelle)]"
        >
          <div className={`flex w-11 flex-shrink-0 flex-col items-center rounded-lg py-1 ${TEINTE_TYPE[e.type]}`}>
            <span className="text-[15px] font-extrabold leading-none">
              {new Date(e.debut).toLocaleDateString("fr-FR", { day: "numeric" })}
            </span>
            <span className="font-mono text-[9px] uppercase">
              {new Date(e.debut).toLocaleDateString("fr-FR", { month: "short" })}
            </span>
          </div>
          <div className="min-w-0">
            <div className="truncate text-[12px] font-bold">{e.titre}</div>
            <div className="font-mono text-[10.5px] text-[var(--texte-mute)]">
              {heure(e.debut)} · {LIBELLE_TYPE[e.type]}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
