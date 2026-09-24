import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";

const PAR_PAGE = 25;
const JOUR_MS = 24 * 60 * 60 * 1000;

type Statut = "en_attente" | "confirme" | "echoue";
const LIBELLE: Record<Statut, string> = { en_attente: "en attente", confirme: "confirmé", echoue: "échoué" };
const STYLE: Record<Statut, string> = {
  confirme: "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]",
  echoue: "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]",
  en_attente: "bg-[var(--fond)] text-[var(--texte-mute)]",
};

// Lecture seule, volontairement : seul le webhook /api/webhooks/paiement (appele par n8n apres
// verification chez Chariow) confirme un paiement. Confirmer a la main creerait un acces payant
// sans argent recu ; le filet de securite existant est "Acces payant manuel" dans /admin.
export default async function PaiementsPage({
  searchParams,
}: {
  searchParams: Promise<{ statut?: string; espace?: string; page?: string }>;
}) {
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

  const { statut: statutFiltre = "", espace: espaceFiltre = "", page: pageBrute = "1" } = await searchParams;
  const admin = createAdminClient();

  // ponytail: tout est lu en une fois (plafond 1000 lignes Supabase) ; passer a une requete
  // paginee cote base des que les paiements se comptent en centaines.
  const [{ data: paiements }, { data: espaces }, { data: profils }, { data: listeAuth }] = await Promise.all([
    admin
      .from("paiements")
      .select("id, profil_id, espace_id, montant, devise, statut, reference_chariow, created_at, confirme_at")
      .order("created_at", { ascending: false }),
    admin.from("espaces").select("id, nom").order("nom"),
    admin.from("profils").select("id, pseudo"),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => ({ data: r.data?.users ?? [] })),
  ]);

  const nomEspace = new Map((espaces ?? []).map((e) => [e.id as string, e.nom as string]));
  const pseudoDe = new Map((profils ?? []).map((p) => [p.id as string, p.pseudo as string]));
  const emailDe = new Map((listeAuth ?? []).map((u) => [u.id, u.email ?? ""]));

  const maintenant = new Date().getTime();
  const tous = paiements ?? [];
  const portee = tous.filter((p) => !espaceFiltre || p.espace_id === espaceFiltre);

  // Revenus confirmes par devise (une seule en pratique : GNF).
  const revenus = new Map<string, number>();
  portee
    .filter((p) => p.statut === "confirme")
    .forEach((p) => revenus.set(p.devise as string, (revenus.get(p.devise as string) ?? 0) + (p.montant as number)));
  const texteRevenus = revenus.size
    ? [...revenus].map(([d, m]) => `${m.toLocaleString("fr-FR")} ${d}`).join(" + ")
    : "0 GNF";

  const nb = (s: Statut) => portee.filter((p) => p.statut === s).length;
  const enAttente = portee.filter((p) => p.statut === "en_attente");
  const plusAncien = enAttente.reduce<number | null>((min, p) => {
    const t = new Date(p.created_at as string).getTime();
    return min === null || t < min ? t : min;
  }, null);
  const ageJours = plusAncien !== null ? Math.floor((maintenant - plusAncien) / JOUR_MS) : null;

  const visibles = portee.filter((p) => !statutFiltre || p.statut === statutFiltre);
  const nbPages = Math.max(1, Math.ceil(visibles.length / PAR_PAGE));
  const page = Math.min(nbPages, Math.max(1, parseInt(pageBrute, 10) || 1));
  const affiches = visibles.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  const lien = (n: number) => {
    const params = new URLSearchParams();
    if (statutFiltre) params.set("statut", statutFiltre);
    if (espaceFiltre) params.set("espace", espaceFiltre);
    if (n > 1) params.set("page", String(n));
    const s = params.toString();
    return s ? `/admin/paiements?${s}` : "/admin/paiements";
  };

  const cartes = [
    { libelle: "Revenus confirmés", valeur: texteRevenus },
    { libelle: "Confirmés", valeur: String(nb("confirme")) },
    {
      libelle: "En attente",
      valeur: String(nb("en_attente")),
      sous: ageJours !== null ? `le plus ancien date de ${ageJours} jour${ageJours !== 1 ? "s" : ""}` : undefined,
    },
    { libelle: "Échoués", valeur: String(nb("echoue")) },
  ];

  const champ =
    "rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--sarcelle)]";

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin pseudo={profil?.pseudo ?? ""} />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Paiements</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        Lecture seule : seul le webhook appelé par n8n confirme un paiement, après vérification chez Chariow. Pour accorder un accès
        sans paiement, utilise « Accès payant manuel » dans le tableau de bord.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3.5 xl:grid-cols-4">
        {cartes.map((c) => (
          <div key={c.libelle} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <div className="font-display text-xl font-extrabold text-[var(--sarcelle)]">{c.valeur}</div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">{c.libelle}</div>
            {c.sous && <div className="mt-1 text-[10.5px] text-[var(--texte-mute)]">{c.sous}</div>}
          </div>
        ))}
      </div>

      <form method="get" className="mt-6 flex flex-wrap items-center gap-2.5">
        <select name="statut" defaultValue={statutFiltre} aria-label="Statut" className={champ}>
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirme">Confirmé</option>
          <option value="echoue">Échoué</option>
        </select>
        <select name="espace" defaultValue={espaceFiltre} aria-label="Espace" className={champ}>
          <option value="">Tous les espaces</option>
          {(espaces ?? []).map((e) => (
            <option key={e.id as string} value={e.id as string}>
              {e.nom as string}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-4 py-1.5 text-[12.5px] font-bold text-white">
          Filtrer
        </button>
        {(statutFiltre || espaceFiltre) && (
          <Link href="/admin/paiements" className="text-[12px] font-bold text-[var(--texte-mute)] underline">
            Réinitialiser
          </Link>
        )}
        <span className="text-[12px] text-[var(--texte-mute)]">
          {visibles.length} paiement{visibles.length !== 1 ? "s" : ""}
        </span>
      </form>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
        <table className="w-full min-w-[760px] text-left text-[12px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-wide text-[var(--texte-mute)]">
              <th className="px-4 py-3">Élève</th>
              <th className="px-4 py-3">Espace</th>
              <th className="px-4 py-3 text-right">Montant</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Réf. Chariow</th>
              <th className="px-4 py-3">Créé le</th>
              <th className="px-4 py-3">Confirmé le</th>
            </tr>
          </thead>
          <tbody>
            {affiches.map((p) => {
              const statut = p.statut as Statut;
              const averifier =
                statut === "en_attente" && maintenant - new Date(p.created_at as string).getTime() > JOUR_MS;
              return (
                <tr key={p.id as string} className="border-t border-[var(--ligne)] align-top">
                  <td className="px-4 py-3">
                    <div className="font-bold">{pseudoDe.get(p.profil_id as string) ?? "Compte supprimé"}</div>
                    {emailDe.get(p.profil_id as string) && (
                      <div className="text-[11px] text-[var(--texte-mute)]">{emailDe.get(p.profil_id as string)}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">{nomEspace.get(p.espace_id as string) ?? "?"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold">
                    {(p.montant as number).toLocaleString("fr-FR")} {p.devise as string}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-[5px] px-1.5 py-px font-mono text-[9.5px] font-bold ${STYLE[statut]}`}>
                      {LIBELLE[statut]}
                    </span>
                    {averifier && (
                      <span
                        title="En attente depuis plus de 24 h : checkout probablement abandonné ou en échec"
                        className="ml-1.5 rounded-[5px] bg-[rgba(255,122,77,0.14)] px-1.5 py-px font-mono text-[9.5px] font-bold text-[var(--corail-texte)]"
                      >
                        à vérifier
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-[var(--texte-mute)]">
                    {(p.reference_chariow as string | null) ?? "aucune"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">
                    {new Date(p.created_at as string).toLocaleString("fr-FR")}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">
                    {p.confirme_at ? new Date(p.confirme_at as string).toLocaleString("fr-FR") : "-"}
                  </td>
                </tr>
              );
            })}
            {affiches.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--texte-mute)]">
                  Aucun paiement ne correspond à ces filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {nbPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[12px] font-bold">
          {page > 1 ? <Link href={lien(page - 1)}>← Précédent</Link> : <span />}
          <span className="font-mono text-[11px] text-[var(--texte-mute)]">
            Page {page} sur {nbPages}
          </span>
          {page < nbPages ? <Link href={lien(page + 1)}>Suivant →</Link> : <span />}
        </div>
      )}
    </main>
  );
}
