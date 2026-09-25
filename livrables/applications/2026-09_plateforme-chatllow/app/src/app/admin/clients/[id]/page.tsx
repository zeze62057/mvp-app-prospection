import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-chatllow";
import { CATEGORIES_LIVRABLE, STATUTS_PROJET } from "@/lib/admin-constantes";
import { CoqueAdmin } from "@/components/admin/CoqueAdmin";
import { BoutonReinitialiser } from "@/components/admin/BoutonReinitialiser";
import { EnvoiLivrable } from "@/components/admin/EnvoiLivrable";
import { ajouterProjet, modifierProjet, supprimerProjet, supprimerLivrable, supprimerClient } from "../../actions";

export const metadata = { title: "Fiche client — Administration Chatllow" };

const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
const taille = (o: number | null) => (o == null ? "" : o < 1_000_000 ? `${Math.max(1, Math.round(o / 1000))} Ko` : `${(o / 1_000_000).toFixed(1).replace(".", ",")} Mo`);
const CARTE = "rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5";
const CHAMP = "rounded-xl border border-[var(--ligne)] bg-[var(--fond)] px-3 py-2 text-[13px] focus:border-[var(--indigo)] focus:outline-none";

export default async function FicheClient({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; erreur?: string }>;
}) {
  await verifierAdmin();
  const { id } = await params;
  const { ok, erreur } = await searchParams;
  const admin = createAdminClient();

  const { data: client } = await admin.from("chatllow_clients").select("profil_id, entreprise, contact, created_at").eq("profil_id", id).maybeSingle();
  if (!client) notFound();
  const [{ data: projets }, { data: livrables }, { data: utilisateur }] = await Promise.all([
    admin.from("chatllow_projets").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    admin.from("chatllow_livrables").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    admin.auth.admin.getUserById(id),
  ]);
  const email = utilisateur?.user?.email ?? "";
  const libelleCategorie = (c: string) => CATEGORIES_LIVRABLE.find((x) => x.id === c)?.libelle ?? c;

  return (
    <CoqueAdmin section="clients" titre={client.entreprise} sousTitre={`${client.contact} · ${email} · client depuis le ${date(client.created_at)}`} ok={ok} erreur={erreur}>
      <Link href="/admin/clients" className="-mt-2 mb-4 inline-block text-[12.5px] font-semibold text-[oklch(45%_0.19_250)]">← Tous les clients</Link>

      <section className={CARTE}>
        <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Accès</h2>
        <p className="mt-1 text-[12.5px] text-[var(--texte-mute)]">Connexion sur l&apos;espace client avec l&apos;adresse {email}.</p>
        <div className="mt-3">
          <BoutonReinitialiser clientId={id} email={email} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Projets ({(projets ?? []).length})</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {(projets ?? []).map((p) => (
            <li key={p.id} className={CARTE}>
              <div className="font-[family-name:var(--font-display)] text-[15px] font-semibold">{p.titre}</div>
              {p.description && <p className="mt-0.5 text-[12.5px] text-[var(--texte-mute)]">{p.description}</p>}
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <form action={modifierProjet} className="flex flex-wrap items-end gap-3">
                  <input type="hidden" name="projet_id" value={p.id} />
                  <input type="hidden" name="client_id" value={id} />
                  <label className="text-[11.5px] font-semibold">
                    Statut
                    <select name="statut" defaultValue={p.statut} className={`${CHAMP} mt-1 block`}>
                      {STATUTS_PROJET.map((s) => (
                        <option key={s.id} value={s.id}>{s.libelle}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-[11.5px] font-semibold">
                    Avancement (%)
                    <input name="avancement" type="number" min={0} max={100} step={1} defaultValue={p.avancement} className={`${CHAMP} mt-1 block w-24`} />
                  </label>
                  <button type="submit" className="rounded-full bg-[var(--encre)] px-4 py-2 text-[12.5px] font-semibold text-[var(--fond)]">Enregistrer</button>
                </form>
                <form action={supprimerProjet}>
                  <input type="hidden" name="projet_id" value={p.id} />
                  <input type="hidden" name="client_id" value={id} />
                  <button type="submit" className="rounded-full border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-semibold text-[#b53a3a]">Supprimer</button>
                </form>
              </div>
            </li>
          ))}
          {(projets ?? []).length === 0 && <li className="text-[13px] text-[var(--texte-mute)]">Aucun projet.</li>}
        </ul>

        <form action={ajouterProjet} className={`${CARTE} mt-4 grid gap-3 sm:grid-cols-2`}>
          <input type="hidden" name="client_id" value={id} />
          <h3 className="font-[family-name:var(--font-display)] text-[14px] font-semibold sm:col-span-2">Ajouter un projet</h3>
          <label className="text-[12px] font-semibold sm:col-span-2">
            Titre
            <input name="titre" required maxLength={200} className={`${CHAMP} mt-1 block w-full`} />
          </label>
          <label className="text-[12px] font-semibold sm:col-span-2">
            Description (facultatif)
            <input name="description" maxLength={600} className={`${CHAMP} mt-1 block w-full`} />
          </label>
          <label className="text-[12px] font-semibold">
            Statut
            <select name="statut" defaultValue="en_cours" className={`${CHAMP} mt-1 block w-full`}>
              {STATUTS_PROJET.map((s) => (
                <option key={s.id} value={s.id}>{s.libelle}</option>
              ))}
            </select>
          </label>
          <label className="text-[12px] font-semibold">
            Avancement (%)
            <input name="avancement" type="number" min={0} max={100} step={1} defaultValue={0} className={`${CHAMP} mt-1 block w-full`} />
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className="rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13px] font-semibold text-[var(--fond)]">Ajouter le projet →</button>
          </div>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="font-[family-name:var(--font-display)] text-[16px] font-semibold">Documents ({(livrables ?? []).length})</h2>
        <ul className="mt-3 flex flex-col gap-3">
          {(livrables ?? []).map((l) => (
            <li key={l.id} className={`${CARTE} flex flex-wrap items-center gap-3`}>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-semibold">{l.titre}</div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--texte-mute)]">
                  {libelleCategorie(l.categorie)} · {date(l.created_at)}
                  {taille(l.taille_octets) && ` · ${taille(l.taille_octets)}`}
                  {!l.fichier_path && " · sans fichier"}
                </div>
              </div>
              {l.fichier_path && (
                <a href={`/admin/documents/${l.id}`} className="rounded-full border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-semibold hover:bg-[var(--indigo-soft)]">
                  Télécharger
                </a>
              )}
              <form action={supprimerLivrable}>
                <input type="hidden" name="livrable_id" value={l.id} />
                <input type="hidden" name="client_id" value={id} />
                <button type="submit" className="rounded-full border border-[var(--ligne)] px-4 py-2 text-[12.5px] font-semibold text-[#b53a3a]">Supprimer</button>
              </form>
            </li>
          ))}
          {(livrables ?? []).length === 0 && <li className="text-[13px] text-[var(--texte-mute)]">Aucun document.</li>}
        </ul>
        <div className="mt-4">
          <EnvoiLivrable clientId={id} />
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-[rgba(255,107,107,0.4)] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold text-[#b53a3a]">Zone sensible</h2>
        <p className="mt-1 max-w-xl text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
          Supprimer ce client efface ses projets, ses documents et ses fichiers. S&apos;il a un compte partagé avec Vivier Academies, seul son accès Chatllow est retiré et son compte est conservé.
        </p>
        <form action={supprimerClient} className="mt-3 flex flex-wrap items-end gap-3">
          <input type="hidden" name="client_id" value={id} />
          <label className="text-[12px] font-semibold">
            Pour confirmer, tapez « {client.entreprise} »
            <input name="confirmation" required autoComplete="off" className={`${CHAMP} mt-1 block w-64`} />
          </label>
          <button type="submit" className="rounded-full bg-[#b53a3a] px-5 py-2.5 text-[13px] font-semibold text-white">Supprimer le client</button>
        </form>
      </section>
    </CoqueAdmin>
  );
}
