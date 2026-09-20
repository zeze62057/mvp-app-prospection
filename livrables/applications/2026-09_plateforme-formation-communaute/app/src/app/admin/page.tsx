import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  approuverAdhesion,
  refuserAdhesion,
  approuverExpert,
  refuserExpert,
  publierContenu,
  supprimerBrouillonContenu,
} from "./actions";
import { FormulaireAccesPayant } from "@/components/admin/FormulaireAccesPayant";
import { LignePrixEspace } from "@/components/admin/LignePrixEspace";
import { FormulaireCreationEspace } from "@/components/admin/FormulaireCreationEspace";
import { getStatsEspace } from "@/lib/stats-communaute";
import { CarteStatsEspace } from "@/components/admin/CarteStatsEspace";
import { FormulaireParametresCommunaute } from "@/components/admin/FormulaireParametresCommunaute";
import { GestionCategories } from "@/components/admin/GestionCategories";
import { EnregistrementVideo } from "@/components/admin/EnregistrementVideo";
import { FormulaireLienRessource } from "@/components/admin/FormulaireLienRessource";
import { FormulaireFichierRessource } from "@/components/admin/FormulaireFichierRessource";
import { FormulaireMasterclass } from "@/components/admin/FormulaireMasterclass";
import { FormulaireCreneauRdv } from "@/components/admin/FormulaireCreneauRdv";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase
    .from("profils")
    .select("role")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">
          Cette page est reservee aux admins.
        </p>
      </main>
    );
  }

  const admin = createAdminClient();
  const { data: demandes } = await admin
    .from("adhesions")
    .select("id, statut, created_at, profils(pseudo), espaces(nom)")
    .eq("statut", "en_attente")
    .order("created_at", { ascending: true });

  const { data: candidaturesExpert } = await admin
    .from("candidatures_expert")
    .select("id, profil_id, espace_id, created_at, profils(pseudo), espaces(nom)")
    .eq("statut", "en_attente")
    .order("created_at", { ascending: true });

  // select("*") plutot qu'une liste de colonnes : reste fonctionnel meme si la
  // migration 0024 (reglages de communaute) n'est pas encore appliquee.
  const { data: espaces } = await admin
    .from("espaces")
    .select("*")
    .order("nom", { ascending: true });

  const statsParEspace = await Promise.all(
    (espaces ?? []).map(async (e) => ({ espace: e, stats: await getStatsEspace(e) }))
  );

  // Categories du fil (migration 0026) : absentes tant qu'elle n'est pas appliquee.
  const { data: categoriesFil } = await admin
    .from("categories_posts")
    .select("id, espace_id, libelle, emoji")
    .order("ordre")
    .order("created_at");

  const { data: messagesAccueil } = await admin
    .from("messages_accueil")
    .select("espace_id, texte");
  const messageParEspace = new Map(
    (messagesAccueil ?? []).map((m) => [m.espace_id as string, m.texte as string])
  );

  const { data: masterclasses } = await admin
    .from("masterclasses")
    .select("id, titre, date_heure")
    .order("date_heure", { ascending: false });

  const inscritsParMasterclass = await Promise.all(
    (masterclasses ?? []).map(async (m) => {
      const { data: inscriptions } = await admin
        .from("inscriptions_masterclass")
        .select("profils(pseudo)")
        .eq("masterclass_id", m.id);
      return { masterclass: m, inscrits: inscriptions ?? [] };
    })
  );

  const { data: brouillonsContenu } = await admin
    .from("contenus")
    .select("id, titre, corps, created_at, espaces(nom)")
    .eq("statut", "brouillon")
    .order("created_at", { ascending: false });

  const { data: creneauxRdv } = await admin
    .from("creneaux_rdv")
    .select("id, date_heure, reserve_par, profils(pseudo)")
    .order("date_heure", { ascending: false });

  const { data: modules } = await admin
    .from("modules")
    .select("id, titre, espace_id, ordre, sections(id, titre, ordre, video_path)")
    .order("ordre");
  const modulesTries = (modules ?? []).map((m) => ({
    ...m,
    sections: [...(m.sections ?? [])].sort((a, b) => a.ordre - b.ordre),
  }));

  return (
    <main className="p-16">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--corail)]">
        administration
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold">
        Demandes d&apos;acces en attente
      </h1>

      <ul className="mt-8 flex flex-col gap-3">
        {(demandes ?? []).map((demande) => (
          <li
            key={demande.id}
            className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
          >
            <div>
              <p className="text-sm font-medium">
                {(demande.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}
              </p>
              <p className="text-xs text-[var(--texte-mute)]">
                {(demande.espaces as unknown as { nom: string } | null)?.nom ?? "?"}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={approuverAdhesion.bind(null, demande.id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
                >
                  Approuver
                </button>
              </form>
              <form action={refuserAdhesion.bind(null, demande.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-xs font-medium"
                >
                  Refuser
                </button>
              </form>
            </div>
          </li>
        ))}
        {(demandes ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">
            Aucune demande en attente.
          </p>
        )}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Candidatures Expert en attente
      </h2>
      <ul className="mt-6 flex flex-col gap-3">
        {(candidaturesExpert ?? []).map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4"
          >
            <div>
              <p className="text-sm font-medium">
                {(c.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}
              </p>
              <p className="text-xs text-[var(--texte-mute)]">
                {(c.espaces as unknown as { nom: string } | null)?.nom ?? "?"}
              </p>
            </div>
            <div className="flex gap-2">
              <form action={approuverExpert.bind(null, c.id, c.profil_id, c.espace_id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--corail)] px-3 py-1.5 text-xs font-medium text-[var(--encre)]"
                >
                  Approuver
                </button>
              </form>
              <form action={refuserExpert.bind(null, c.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-xs font-medium"
                >
                  Refuser
                </button>
              </form>
            </div>
          </li>
        ))}
        {(candidaturesExpert ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">
            Aucune candidature en attente.
          </p>
        )}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Statistiques de communaute
      </h2>
      <ul className="mt-6 flex flex-col gap-3">
        {statsParEspace.map(({ espace: e, stats }) => (
          <CarteStatsEspace key={e.id} nom={e.nom} devise={e.devise} stats={stats} />
        ))}
        {statsParEspace.length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun espace pour l&apos;instant.</p>
        )}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Reglages de communaute
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Propres a chaque espace. Le message d&apos;accueil n&apos;est visible que des membres
        de l&apos;espace, jamais du public.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <FormulaireParametresCommunaute
            key={e.id}
            espace={{
              id: e.id,
              nom: e.nom,
              periode_activite_jours: e.periode_activite_jours ?? 7,
              afficher_compteur_public: e.afficher_compteur_public ?? true,
            }}
            messageAccueil={messageParEspace.get(e.id) ?? ""}
          />
        ))}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Catégories du fil
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Les pastilles au-dessus du fil de chaque communauté. Supprimer une catégorie ne
        supprime aucun post : ils passent simplement en « sans catégorie ».
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <GestionCategories
            key={e.id}
            espace={{ id: e.id, nom: e.nom }}
            categories={(categoriesFil ?? []).filter((c) => c.espace_id === e.id)}
          />
        ))}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Prix des formations
      </h2>
      <ul className="mt-6 flex flex-col gap-3">
        {(espaces ?? []).map((e) => (
          <LignePrixEspace key={e.id} espace={e} />
        ))}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Acces payant manuel (filet de securite)
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Le tunnel Mobile Money via Chariow est le chemin normal. N&apos;utilise
        ce formulaire que si un eleve a paye autrement, ou si le tunnel
        automatique est indisponible.
      </p>
      <div className="mt-6">
        <FormulaireAccesPayant espaces={espaces ?? []} />
      </div>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Creer une nouvelle formation
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Cree seulement l&apos;espace (nom, tagline, prix). Le contenu de cours
        (modules et sections) reste a ajouter separement.
      </p>
      <div className="mt-6">
        <FormulaireCreationEspace />
      </div>

      <ul className="mt-6 flex flex-col gap-2">
        {(espaces ?? []).map((e) => (
          <li key={e.id} className="text-sm text-[var(--texte-mute)]">
            {e.nom} —{" "}
            <Link href={`/${e.slug}`} className="text-[var(--sarcelle)] underline">
              /{e.slug}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Ressources (outils et fichiers)
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Reserve a la formation payante, pas a la communaute gratuite.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        <FormulaireLienRessource espaces={espaces ?? []} />
        <FormulaireFichierRessource espaces={espaces ?? []} />
      </div>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Masterclass (communaute gratuite)
      </h2>
      <div className="mt-6">
        <FormulaireMasterclass espaces={espaces ?? []} />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {inscritsParMasterclass.map(({ masterclass: m, inscrits }) => (
          <li key={m.id} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <p className="text-sm font-medium">
              {m.titre} —{" "}
              <span className="text-xs text-[var(--texte-mute)]">
                {new Date(m.date_heure).toLocaleString("fr-FR")}
              </span>
            </p>
            <p className="mt-1 text-xs text-[var(--texte-mute)]">
              {inscrits.length === 0
                ? "Aucun inscrit."
                : inscrits
                    .map((i) => (i.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?")
                    .join(", ")}
            </p>
          </li>
        ))}
        {inscritsParMasterclass.length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucune masterclass creee.</p>
        )}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Brouillons de contenu
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Rediges par le skill de veille, invisibles des membres tant qu&apos;ils ne sont pas publies ici.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {(brouillonsContenu ?? []).map((b) => (
          <li key={b.id} className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <p className="text-xs text-[var(--texte-mute)]">
              {(b.espaces as unknown as { nom: string } | null)?.nom ?? "?"} —{" "}
              {new Date(b.created_at).toLocaleDateString("fr-FR")}
            </p>
            <p className="font-display mt-1 text-sm font-bold">{b.titre}</p>
            <p className="mt-2 whitespace-pre-wrap text-xs text-[var(--texte-mute)]">{b.corps}</p>
            <div className="mt-3 flex gap-2">
              <form action={publierContenu.bind(null, b.id)}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-xs font-medium text-white"
                >
                  Publier
                </button>
              </form>
              <form action={supprimerBrouillonContenu.bind(null, b.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-xs font-medium"
                >
                  Supprimer
                </button>
              </form>
            </div>
          </li>
        ))}
        {(brouillonsContenu ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun brouillon en attente.</p>
        )}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        RDV (appel decouverte, communaute gratuite)
      </h2>
      <div className="mt-6">
        <FormulaireCreneauRdv espaces={espaces ?? []} />
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {(creneauxRdv ?? []).map((c) => (
          <li key={c.id} className="flex items-center justify-between rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
            <span className="text-sm">{new Date(c.date_heure).toLocaleString("fr-FR")}</span>
            <span className="text-xs text-[var(--texte-mute)]">
              {c.reserve_par
                ? `Reserve par ${(c.profils as unknown as { pseudo: string } | null)?.pseudo ?? "?"}`
                : "Libre"}
            </span>
          </li>
        ))}
        {(creneauxRdv ?? []).length === 0 && (
          <p className="text-sm text-[var(--texte-mute)]">Aucun creneau cree.</p>
        )}
      </ul>

      <h2 className="font-display mt-16 text-2xl font-semibold">
        Enregistrer une video de cours
      </h2>
      <p className="mt-2 text-sm text-[var(--texte-mute)]">
        Capture d&apos;ecran rattachee directement a une section. Le
        navigateur va demander la permission de partager ton ecran.
      </p>
      <div className="mt-6">
        <EnregistrementVideo espaces={espaces ?? []} modules={modulesTries} />
      </div>
    </main>
  );
}
