import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifierAdmin } from "@/lib/admin-chatllow";
import { CoqueAdmin } from "@/components/admin/CoqueAdmin";

export const metadata = { title: "Administration — Chatllow" };

const date = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

export default async function AdminAccueil() {
  await verifierAdmin();
  const admin = createAdminClient();
  const [{ count: nbClients }, { count: nbProjets }, { count: nbDocs }, { count: nbDiag }, { count: nbRdv }, { data: diag }, { data: rdv }] = await Promise.all([
    admin.from("chatllow_clients").select("*", { count: "exact", head: true }),
    admin.from("chatllow_projets").select("*", { count: "exact", head: true }),
    admin.from("chatllow_livrables").select("*", { count: "exact", head: true }),
    admin.from("chatllow_diagnostics").select("*", { count: "exact", head: true }),
    admin.from("chatllow_rdv").select("*", { count: "exact", head: true }),
    admin.from("chatllow_diagnostics").select("id, email, pilote_recommande, created_at").order("created_at", { ascending: false }).limit(5),
    admin.from("chatllow_rdv").select("id, email, jour, heure, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  const chiffres = [
    { n: nbClients ?? 0, l: "clients", href: "/admin/clients" },
    { n: nbProjets ?? 0, l: "projets", href: "/admin/clients" },
    { n: nbDocs ?? 0, l: "documents livrés", href: "/admin/clients" },
    { n: nbDiag ?? 0, l: "diagnostics reçus", href: "/admin/diagnostics" },
    { n: nbRdv ?? 0, l: "demandes de rendez-vous", href: "/admin/rendez-vous" },
  ];
  const carte = "rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5";

  return (
    <CoqueAdmin section="accueil" titre="Administration" sousTitre="Vue d'ensemble de l'activité du cabinet.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {chiffres.map((c) => (
          <Link key={c.l} href={c.href} className={`${carte} hover:bg-[var(--indigo-soft)]`}>
            <div className="font-[family-name:var(--font-display)] text-[28px] font-semibold leading-none">{c.n}</div>
            <div className="mt-2 text-[12px] text-[var(--texte-mute)]">{c.l}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className={carte}>
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Derniers diagnostics</h2>
            <Link href="/admin/diagnostics" className="text-[12px] font-semibold text-[oklch(45%_0.19_250)]">Voir tout →</Link>
          </div>
          {(diag ?? []).length === 0 ? (
            <p className="mt-4 text-[13px] text-[var(--texte-mute)]">Aucun diagnostic reçu pour l&apos;instant.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--ligne)]">
              {(diag ?? []).map((d) => (
                <li key={d.id} className="py-2.5 text-[13px]">
                  <div className="font-semibold">{d.email}</div>
                  <div className="text-[12px] text-[var(--texte-mute)]">{date(d.created_at)} · {d.pilote_recommande ?? "sans pilote"}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={carte}>
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-display)] text-[15px] font-semibold">Derniers rendez-vous demandés</h2>
            <Link href="/admin/rendez-vous" className="text-[12px] font-semibold text-[oklch(45%_0.19_250)]">Voir tout →</Link>
          </div>
          {(rdv ?? []).length === 0 ? (
            <p className="mt-4 text-[13px] text-[var(--texte-mute)]">Aucune demande pour l&apos;instant.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--ligne)]">
              {(rdv ?? []).map((r) => (
                <li key={r.id} className="py-2.5 text-[13px]">
                  <div className="font-semibold">{r.email}</div>
                  <div className="text-[12px] text-[var(--texte-mute)]">{r.jour} à {r.heure} · demandé le {date(r.created_at)}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </CoqueAdmin>
  );
}
