import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";

const JOUR_MS = 24 * 60 * 60 * 1000;
const PERIODES: Record<string, string> = { "7": "7 derniers jours", "30": "30 derniers jours", "365": "12 derniers mois" };

// Comptages seulement (decision du 2026-09-24, voir migration 0030) : la colonne `contenu` n'est
// jamais selectionnee, et aucun identifiant de membre ne sort de ce fichier. Pas de detail par
// conversation ni par membre : sur une petite communaute il designerait des personnes.
export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase
    .from("profils")
    .select("role, pseudo")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">Cette page est reservee aux admins.</p>
      </main>
    );
  }

  const { periode: periodeBrute = "30" } = await searchParams;
  const periode = periodeBrute in PERIODES ? periodeBrute : "30";
  const jours = Number(periode);
  const maintenant = new Date().getTime();
  const debut = maintenant - jours * JOUR_MS;
  const debutPrecedent = debut - jours * JOUR_MS;

  const admin = createAdminClient();
  // ponytail: plafonne a 1000 lignes (limite Supabase) ; passer a un agregat SQL au-dela.
  const [{ data: messages }, { data: espaces }, { count: signalesOuverts }] = await Promise.all([
    admin
      .from("messages")
      .select("espace_id, expediteur_id, destinataire_id, created_at, lu_at")
      .gte("created_at", new Date(debutPrecedent).toISOString()),
    admin.from("espaces").select("id, nom").order("nom"),
    admin.from("signalements").select("*", { count: "exact", head: true }).eq("type", "message").eq("statut", "ouvert"),
  ]);

  const ms = (iso: string) => new Date(iso).getTime();
  const courants = (messages ?? []).filter((m) => ms(m.created_at as string) >= debut);
  const precedents = (messages ?? []).filter((m) => ms(m.created_at as string) < debut);

  const conversations = (liste: typeof courants) =>
    new Set(
      liste.map((m) => `${m.espace_id}:${[m.expediteur_id, m.destinataire_id].sort().join("-")}`)
    ).size;
  const nbConversations = conversations(courants);
  const nbConversationsPrec = conversations(precedents);
  const nbEcrivains = new Set(courants.map((m) => m.expediteur_id as string)).size;
  const nbLus = courants.filter((m) => m.lu_at !== null).length;
  const partLus = courants.length > 0 ? Math.round((nbLus / courants.length) * 100) : null;

  // Variation en %, seulement si la periode precedente a au moins une valeur.
  const variation = (cur: number, prec: number) => (prec > 0 ? Math.round(((cur - prec) / prec) * 100) : null);

  const cartes = [
    { libelle: "Messages envoyés", valeur: String(courants.length), variation: variation(courants.length, precedents.length) },
    {
      libelle: "Conversations actives",
      valeur: String(nbConversations),
      sous: "un couple de membres dans un espace",
      variation: variation(nbConversations, nbConversationsPrec),
    },
    { libelle: "Membres qui ont écrit", valeur: String(nbEcrivains), variation: null },
    {
      libelle: "Messages lus",
      valeur: partLus !== null ? `${partLus}%` : "Donnée non disponible",
      sous: partLus !== null ? `${nbLus} sur ${courants.length}` : undefined,
      variation: null,
    },
  ];

  const parEspace = (espaces ?? []).map((e) => ({
    nom: e.nom as string,
    nb: courants.filter((m) => m.espace_id === e.id).length,
  }));

  const champ =
    "rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--sarcelle)]";

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin pseudo={profil?.pseudo ?? ""} />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Messages</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        Activité de la messagerie privée, en chiffres seulement. Tu ne vois jamais un message, ni qui écrit à qui : une
        conversation privée n&apos;est lisible que par ses deux participants.
      </p>

      <form method="get" className="mt-5 flex flex-wrap items-center gap-2.5">
        <select name="periode" defaultValue={periode} aria-label="Période" className={champ}>
          {Object.entries(PERIODES).map(([valeur, libelle]) => (
            <option key={valeur} value={valeur}>
              {libelle}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-4 py-1.5 text-[12.5px] font-bold text-white">
          Afficher
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        {cartes.map((c) => (
          <div key={c.libelle} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">{c.valeur}</div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">{c.libelle}</div>
            {c.sous && <div className="mt-1 text-[10.5px] text-[var(--texte-mute)]">{c.sous}</div>}
            {c.variation !== null && (
              <div className={`mt-1 text-[10.5px] font-bold ${c.variation >= 0 ? "text-[var(--sarcelle)]" : "text-[var(--corail)]"}`}>
                {c.variation === 0 ? "→ stable" : `${c.variation > 0 ? "↗ +" : "↘ "}${c.variation}%`} vs période précédente
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
          <div className="mb-3 font-display text-[14px] font-bold">Messages par espace</div>
          <ul className="flex flex-col gap-1.5 text-[12.5px]">
            {parEspace.map((e) => (
              <li key={e.nom} className="flex justify-between gap-3">
                <span>{e.nom}</span>
                <span className="font-mono font-bold">{e.nb}</span>
              </li>
            ))}
            {parEspace.length === 0 && <li className="text-[var(--texte-mute)]">Aucun espace.</li>}
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
          <div className="mb-3 font-display text-[14px] font-bold">Messages signalés</div>
          <p className="text-[12.5px] text-[var(--texte-mute)]">
            {signalesOuverts ?? 0} signalement{(signalesOuverts ?? 0) !== 1 ? "s" : ""} de message en attente. Tu ne vois que
            l&apos;extrait copié au moment du signalement.
          </p>
          <Link href="/admin#signalements" className="mt-3 inline-block text-[12px] font-bold text-[var(--sarcelle)]">
            Ouvrir la modération →
          </Link>
        </div>
      </div>
    </main>
  );
}
