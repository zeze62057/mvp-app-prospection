import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NIVEAUX_PAR_DEFAUT, niveauDe, type NiveauConfig } from "@/lib/niveaux";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";

const PAR_PAGE = 25;

type StatutEspace = "payant" | "gratuit" | "attente" | "refuse";
const LIBELLE_STATUT: Record<StatutEspace, string> = {
  payant: "payant",
  gratuit: "gratuit",
  attente: "en attente",
  refuse: "refusé",
};
const STYLE_STATUT: Record<StatutEspace, string> = {
  payant: "bg-[rgba(43,140,130,0.12)] text-[var(--sarcelle-texte)]",
  gratuit: "bg-[var(--fond)] text-[var(--texte-mute)]",
  attente: "bg-[rgba(255,122,77,0.14)] text-[var(--corail-texte)]",
  refuse: "bg-[var(--fond)] text-[var(--texte-mute)] line-through",
};

type Pastille = {
  espaceId: string;
  nom: string;
  statut: StatutEspace;
  expert: boolean;
  niveau: string | null;
  avancement: number | null;
};

const normaliser = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export default async function ElevesPage({
  searchParams,
}: {
  searchParams: Promise<{ espace?: string; statut?: string; q?: string; page?: string }>;
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

  const { espace: espaceFiltre = "", statut: statutFiltre = "", q = "", page: pageBrute = "1" } = await searchParams;
  const admin = createAdminClient();

  // ponytail: un seul appel par table, plafonne a 1000 lignes (limite Supabase). Suffisant a
  // l'echelle actuelle (~30 profils) ; passer a un agregat SQL avant quelques centaines d'eleves.
  const [
    { data: profils },
    { data: espaces },
    { data: adhesions },
    { data: acces },
    { data: progression },
    { data: sections },
    { data: lignesNiveaux },
    { data: listeAuth },
  ] = await Promise.all([
    admin.from("profils").select("id, pseudo, role, points, created_at").order("created_at", { ascending: false }),
    admin.from("espaces").select("id, nom").order("nom"),
    admin.from("adhesions").select("profil_id, espace_id, statut"),
    admin.from("acces_payant").select("profil_id, espace_id, actif, est_expert"),
    admin.from("progression").select("profil_id, section_id, completed_at"),
    admin.from("sections").select("id, modules(espace_id)"),
    admin.from("niveaux_espace").select("espace_id, niveau, libelle, points_requis").order("niveau"),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }).then((r) => ({ data: r.data?.users ?? [] })),
  ]);

  const emailParId = new Map((listeAuth ?? []).map((u) => [u.id, u.email ?? ""]));
  const nomEspace = new Map((espaces ?? []).map((e) => [e.id as string, e.nom as string]));

  const niveauxParEspace = new Map<string, NiveauConfig[]>();
  (lignesNiveaux ?? []).forEach((l) => {
    const id = l.espace_id as string;
    niveauxParEspace.set(id, [
      ...(niveauxParEspace.get(id) ?? []),
      { niveau: l.niveau as number, libelle: l.libelle as string, points_requis: l.points_requis as number },
    ]);
  });

  const espaceDeSection = new Map<string, string>();
  const nbSectionsParEspace = new Map<string, number>();
  (sections ?? []).forEach((s) => {
    const e = (s.modules as unknown as { espace_id: string } | null)?.espace_id;
    if (!e) return;
    espaceDeSection.set(s.id as string, e);
    nbSectionsParEspace.set(e, (nbSectionsParEspace.get(e) ?? 0) + 1);
  });

  // Par eleve : sections terminees par espace, et derniere activite.
  const terminees = new Map<string, Map<string, number>>();
  const derniereActivite = new Map<string, string>();
  (progression ?? []).forEach((p) => {
    const pid = p.profil_id as string;
    const e = espaceDeSection.get(p.section_id as string);
    if (e) {
      const parEspace = terminees.get(pid) ?? new Map<string, number>();
      parEspace.set(e, (parEspace.get(e) ?? 0) + 1);
      terminees.set(pid, parEspace);
    }
    const prec = derniereActivite.get(pid);
    if (!prec || p.completed_at > prec) derniereActivite.set(pid, p.completed_at as string);
  });

  const lignes = (profils ?? []).map((p) => {
    const pastilles = new Map<string, Pastille>();
    const points = (p.points as number | null) ?? 0;
    const niveaux = (espaceId: string) => niveauxParEspace.get(espaceId) ?? NIVEAUX_PAR_DEFAUT;

    (adhesions ?? [])
      .filter((a) => a.profil_id === p.id)
      .forEach((a) => {
        const espaceId = a.espace_id as string;
        const statut: StatutEspace = a.statut === "approuve" ? "gratuit" : a.statut === "en_attente" ? "attente" : "refuse";
        pastilles.set(espaceId, {
          espaceId,
          nom: nomEspace.get(espaceId) ?? "?",
          statut,
          expert: false,
          niveau: statut === "gratuit" ? niveauDe(points, niveaux(espaceId)).libelle : null,
          avancement: null,
        });
      });

    // L'acces payant l'emporte sur l'adhesion gratuite du meme espace.
    (acces ?? [])
      .filter((a) => a.profil_id === p.id && a.actif)
      .forEach((a) => {
        const espaceId = a.espace_id as string;
        const total = nbSectionsParEspace.get(espaceId) ?? 0;
        const faites = terminees.get(p.id as string)?.get(espaceId) ?? 0;
        pastilles.set(espaceId, {
          espaceId,
          nom: nomEspace.get(espaceId) ?? "?",
          statut: "payant",
          expert: !!a.est_expert,
          niveau: niveauDe(points, niveaux(espaceId)).libelle,
          avancement: total > 0 ? Math.round((faites / total) * 100) : null,
        });
      });

    return {
      id: p.id as string,
      pseudo: p.pseudo as string,
      email: emailParId.get(p.id as string) ?? "",
      role: p.role as string,
      points,
      creeLe: p.created_at as string,
      pastilles: [...pastilles.values()],
      derniereActivite: derniereActivite.get(p.id as string) ?? null,
    };
  });

  const cherche = normaliser(q.trim());
  const filtrees = lignes.filter((l) => {
    const pastilles = espaceFiltre ? l.pastilles.filter((x) => x.espaceId === espaceFiltre) : l.pastilles;
    if (statutFiltre === "sans") {
      if (pastilles.length > 0) return false;
    } else if (statutFiltre) {
      if (!pastilles.some((x) => x.statut === statutFiltre)) return false;
    } else if (espaceFiltre && pastilles.length === 0) {
      return false;
    }
    return !cherche || normaliser(l.pseudo).includes(cherche) || normaliser(l.email).includes(cherche);
  });

  const nbPages = Math.max(1, Math.ceil(filtrees.length / PAR_PAGE));
  const page = Math.min(nbPages, Math.max(1, parseInt(pageBrute, 10) || 1));
  const visibles = filtrees.slice((page - 1) * PAR_PAGE, page * PAR_PAGE);

  const lien = (p: number) => {
    const params = new URLSearchParams();
    if (espaceFiltre) params.set("espace", espaceFiltre);
    if (statutFiltre) params.set("statut", statutFiltre);
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/admin/eleves?${s}` : "/admin/eleves";
  };

  const champ =
    "rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--sarcelle)]";

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin pseudo={profil?.pseudo ?? ""} />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Élèves</h1>
      <p className="mt-1 text-[13px] text-[var(--texte-mute)]">
        {filtrees.length} membre{filtrees.length !== 1 ? "s" : ""}
        {filtrees.length !== lignes.length ? ` sur ${lignes.length}` : ""}. Lecture seule : les actions restent dans le tableau de bord.
      </p>

      <form method="get" className="mt-5 flex flex-wrap items-center gap-2.5">
        <input name="q" defaultValue={q} placeholder="Pseudo ou email" aria-label="Rechercher" className={`${champ} min-w-full sm:min-w-0 sm:max-w-xs sm:flex-1`} />
        <select name="espace" defaultValue={espaceFiltre} aria-label="Espace" className={champ}>
          <option value="">Tous les espaces</option>
          {(espaces ?? []).map((e) => (
            <option key={e.id as string} value={e.id as string}>
              {e.nom as string}
            </option>
          ))}
        </select>
        <select name="statut" defaultValue={statutFiltre} aria-label="Statut" className={champ}>
          <option value="">Tous les statuts</option>
          <option value="payant">Payant</option>
          <option value="gratuit">Gratuit approuvé</option>
          <option value="attente">En attente</option>
          <option value="refuse">Refusé</option>
          <option value="sans">Sans espace</option>
        </select>
        <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-4 py-1.5 text-[12.5px] font-bold text-white">
          Filtrer
        </button>
        {(q || espaceFiltre || statutFiltre) && (
          <Link href="/admin/eleves" className="text-[12px] font-bold text-[var(--texte-mute)] underline">
            Réinitialiser
          </Link>
        )}
      </form>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
        <table className="w-full min-w-[720px] text-left text-[12px]">
          <thead>
            <tr className="font-mono text-[10px] uppercase tracking-wide text-[var(--texte-mute)]">
              <th className="px-4 py-3">Membre</th>
              <th className="px-4 py-3">Inscrit le</th>
              <th className="px-4 py-3">Espaces</th>
              <th className="px-4 py-3 text-right">Points</th>
              <th className="px-4 py-3">Dernière activité</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((l) => (
              <tr key={l.id} className="border-t border-[var(--ligne)] align-top">
                <td className="px-4 py-3">
                  <div className="font-bold">
                    {l.pseudo}
                    {l.role === "admin" && (
                      <span className="ml-1.5 rounded-[5px] bg-[var(--encre)] px-1.5 py-px font-mono text-[9.5px] text-[var(--sur-encre)]">
                        admin
                      </span>
                    )}
                  </div>
                  {l.email && <div className="text-[11px] text-[var(--texte-mute)]">{l.email}</div>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">
                  {new Date(l.creeLe).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  {l.pastilles.length === 0 ? (
                    <span className="text-[var(--texte-mute)]">Aucun</span>
                  ) : (
                    <ul className="flex flex-col gap-1.5">
                      {l.pastilles.map((x) => (
                        <li key={x.espaceId} className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold">{x.nom}</span>
                          <span className={`rounded-[5px] px-1.5 py-px font-mono text-[9.5px] font-bold ${STYLE_STATUT[x.statut]}`}>
                            {LIBELLE_STATUT[x.statut]}
                          </span>
                          {x.expert && (
                            <span className="rounded-[5px] bg-[rgba(255,122,77,0.14)] px-1.5 py-px font-mono text-[9.5px] font-bold text-[var(--corail-texte)]">
                              expert
                            </span>
                          )}
                          {x.niveau && <span className="text-[11px] text-[var(--texte-mute)]">{x.niveau}</span>}
                          {x.avancement !== null && (
                            <span className="font-mono text-[10.5px] font-bold text-[var(--sarcelle)]">{x.avancement}%</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold">{l.points}</td>
                <td className="whitespace-nowrap px-4 py-3 text-[var(--texte-mute)]">
                  {l.derniereActivite ? new Date(l.derniereActivite).toLocaleDateString("fr-FR") : "Aucune"}
                </td>
              </tr>
            ))}
            {visibles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--texte-mute)]">
                  Aucun membre ne correspond à ces filtres.
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
