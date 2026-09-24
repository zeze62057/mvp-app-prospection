import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";
import { EditeurLecon } from "@/components/admin/EditeurLecon";
import {
  creerModule,
  renommerModule,
  deplacerModule,
  supprimerModule,
  creerSection,
  deplacerSection,
  supprimerSection,
} from "./actions";

type Section = { id: string; ordre: number; titre: string; video_path: string | null; contenu: string | null };
type Module = { id: string; ordre: number; titre: string; sections: Section[] };

const champ =
  "rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-1.5 text-[12.5px] outline-none focus:border-[var(--sarcelle)]";
const boutonFleche =
  "rounded-md border border-[var(--ligne)] px-2 py-0.5 text-[11px] font-bold text-[var(--texte-mute)] hover:border-[var(--sarcelle)] disabled:opacity-30";

// Gestion du programme d'un espace : modules, sections et texte des lecons. Rien de destructif sans
// confirmation, et la suppression est refusee si des eleves ont deja avance dans la partie visee.
export default async function ProgrammePage({
  searchParams,
}: {
  searchParams: Promise<{ espace?: string; section?: string; ok?: string; erreur?: string }>;
}) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase.from("profils").select("role").eq("id", userData.user.id).maybeSingle();
  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">Cette page est reservee aux admins.</p>
      </main>
    );
  }

  const { espace: espaceParam = "", section: sectionParam = "", ok, erreur } = await searchParams;
  const admin = createAdminClient();
  const { data: espaces } = await admin.from("espaces").select("id, nom, slug").order("nom");
  const espace = (espaces ?? []).find((e) => e.id === espaceParam) ?? (espaces ?? [])[0];

  const { data: brut } = espace
    ? await admin
        .from("modules")
        .select("id, ordre, titre, sections(id, ordre, titre, video_path, contenu)")
        .eq("espace_id", espace.id)
        .order("ordre")
    : { data: [] };
  const modules: Module[] = (brut ?? []).map((m) => ({
    id: m.id as string,
    ordre: m.ordre as number,
    titre: m.titre as string,
    sections: [...((m.sections as Section[] | null) ?? [])].sort((a, b) => a.ordre - b.ordre),
  }));

  const enEdition = modules.flatMap((m) => m.sections).find((s) => s.id === sectionParam);
  const mots = (s: Section) => (s.contenu?.trim() ? s.contenu.trim().split(/\s+/).length : 0);
  const lien = (id: string, section?: string) =>
    `/admin/programme?espace=${id}${section ? `&section=${section}` : ""}`;

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Programme</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        Crée, renomme, réordonne et supprime les modules et les sections d&apos;une formation, et écris le texte des
        leçons. Un module ou une section où des élèves ont déjà avancé ne peut pas être supprimé.
      </p>

      {ok && (
        <p role="status" className="mt-4 rounded-lg bg-[rgba(43,140,130,0.12)] px-4 py-2.5 text-[12.5px] font-bold text-[var(--sarcelle-texte)]">
          {ok}
        </p>
      )}
      {erreur && (
        <p role="alert" className="mt-4 rounded-lg bg-[rgba(255,122,77,0.14)] px-4 py-2.5 text-[12.5px] font-bold text-[var(--corail-texte)]">
          {erreur}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {(espaces ?? []).map((e) => (
          <Link
            key={e.id as string}
            href={lien(e.id as string)}
            className={`rounded-full px-4 py-1.5 text-[12.5px] font-bold ${
              e.id === espace?.id
                ? "bg-[var(--sarcelle)] text-white"
                : "border border-[var(--ligne)] bg-[var(--fond-carte)] text-[var(--texte-mute)]"
            }`}
          >
            {e.nom as string}
          </Link>
        ))}
      </div>

      {!espace && <p className="mt-6 text-sm text-[var(--texte-mute)]">Aucun espace.</p>}

      {enEdition && espace && (
        <section id="edition" className="mt-6 rounded-2xl border border-[var(--sarcelle)] bg-[var(--fond-carte)] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-display text-[16px] font-bold">Modifier la leçon</h2>
            <Link href={lien(espace.id as string)} className="text-[12px] font-bold text-[var(--texte-mute)] underline">
              Fermer
            </Link>
          </div>
          <EditeurLecon key={enEdition.id} sectionId={enEdition.id} titre={enEdition.titre} contenu={enEdition.contenu ?? ""} />
        </section>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {modules.map((m, i) => (
          <section key={m.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="flex flex-wrap items-center gap-2">
              <form action={renommerModule} className="flex min-w-0 flex-1 items-center gap-2">
                <input type="hidden" name="module_id" value={m.id} />
                <input type="hidden" name="espace_id" value={espace!.id as string} />
                <input name="titre" defaultValue={m.titre} required minLength={2} maxLength={120} aria-label="Titre du module" className={`${champ} min-w-0 flex-1 font-bold`} />
                <button type="submit" className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-[11.5px] font-bold">
                  Renommer
                </button>
              </form>
              <form action={deplacerModule} className="flex gap-1">
                <input type="hidden" name="module_id" value={m.id} />
                <input type="hidden" name="espace_id" value={espace!.id as string} />
                <button name="sens" value="haut" disabled={i === 0} aria-label="Monter le module" className={boutonFleche}>▲</button>
                <button name="sens" value="bas" disabled={i === modules.length - 1} aria-label="Descendre le module" className={boutonFleche}>▼</button>
              </form>
            </div>

            <ul className="mt-4 flex flex-col divide-y divide-[var(--ligne)]">
              {m.sections.map((s, j) => (
                <li key={s.id} className="flex flex-wrap items-center gap-2 py-2.5">
                  <span className="min-w-0 flex-1 text-[13px] font-bold">{s.titre}</span>
                  <span className="font-mono text-[10.5px] text-[var(--texte-mute)]">
                    {mots(s) > 0 ? `${mots(s)} mots` : "leçon vide"}
                    {s.video_path ? " · vidéo" : ""}
                  </span>
                  <Link href={`${lien(espace!.id as string, s.id)}#edition`} className="rounded-lg bg-[var(--sarcelle)] px-3 py-1 text-[11.5px] font-bold text-white">
                    Modifier
                  </Link>
                  <form action={deplacerSection} className="flex gap-1">
                    <input type="hidden" name="section_id" value={s.id} />
                    <input type="hidden" name="espace_id" value={espace!.id as string} />
                    <button name="sens" value="haut" disabled={j === 0} aria-label="Monter la section" className={boutonFleche}>▲</button>
                    <button name="sens" value="bas" disabled={j === m.sections.length - 1} aria-label="Descendre la section" className={boutonFleche}>▼</button>
                  </form>
                  <details className="relative">
                    <summary className="cursor-pointer list-none rounded-md border border-[var(--ligne)] px-2 py-0.5 text-[11px] font-bold text-[var(--corail-texte)] [&::-webkit-details-marker]:hidden">
                      Supprimer
                    </summary>
                    <form action={supprimerSection} className="absolute right-0 z-10 mt-1 w-56 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-3 shadow-lg">
                      <input type="hidden" name="section_id" value={s.id} />
                      <input type="hidden" name="espace_id" value={espace!.id as string} />
                      <p className="text-[11.5px]">Supprimer définitivement « {s.titre} » ?</p>
                      <button type="submit" className="mt-2 rounded-lg bg-[var(--corail)] px-3 py-1 text-[11.5px] font-bold text-[var(--encre)]">
                        Oui, supprimer
                      </button>
                    </form>
                  </details>
                </li>
              ))}
              {m.sections.length === 0 && <li className="py-2.5 text-[12.5px] text-[var(--texte-mute)]">Aucune section.</li>}
            </ul>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <form action={creerSection} className="flex min-w-0 flex-1 items-center gap-2">
                <input type="hidden" name="module_id" value={m.id} />
                <input type="hidden" name="espace_id" value={espace!.id as string} />
                <input name="titre" required minLength={2} maxLength={120} placeholder="Titre de la nouvelle section" aria-label="Titre de la nouvelle section" className={`${champ} min-w-0 flex-1`} />
                <button type="submit" className="rounded-lg bg-[var(--sarcelle)] px-3 py-1.5 text-[11.5px] font-bold text-white">
                  Ajouter une section
                </button>
              </form>
              <details className="relative">
                <summary className="cursor-pointer list-none text-[11.5px] font-bold text-[var(--corail-texte)] [&::-webkit-details-marker]:hidden">
                  Supprimer le module
                </summary>
                <form action={supprimerModule} className="absolute right-0 z-10 mt-1 w-64 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-3 shadow-lg">
                  <input type="hidden" name="module_id" value={m.id} />
                  <input type="hidden" name="espace_id" value={espace!.id as string} />
                  <p className="text-[11.5px]">Supprimer « {m.titre} » et ses {m.sections.length} section(s), définitivement ?</p>
                  <button type="submit" className="mt-2 rounded-lg bg-[var(--corail)] px-3 py-1 text-[11.5px] font-bold text-[var(--encre)]">
                    Oui, supprimer
                  </button>
                </form>
              </details>
            </div>
          </section>
        ))}
        {espace && modules.length === 0 && <p className="text-sm text-[var(--texte-mute)]">Aucun module pour cette formation.</p>}
      </div>

      {espace && (
        <form action={creerModule} className="mt-6 flex max-w-xl flex-wrap items-center gap-2 rounded-2xl border border-dashed border-[var(--ligne)] p-4">
          <input type="hidden" name="espace_id" value={espace.id as string} />
          <input name="titre" required minLength={2} maxLength={120} placeholder="Titre du nouveau module" aria-label="Titre du nouveau module" className={`${champ} min-w-0 flex-1`} />
          <button type="submit" className="rounded-lg bg-[var(--corail)] px-4 py-1.5 text-[12px] font-bold text-[var(--encre)]">
            Ajouter un module
          </button>
        </form>
      )}
    </main>
  );
}
