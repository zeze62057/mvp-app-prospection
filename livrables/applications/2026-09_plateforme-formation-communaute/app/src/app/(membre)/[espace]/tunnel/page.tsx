import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BoutonPayer } from "@/components/tunnel/BoutonPayer";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { urlsAvatars } from "@/lib/avatars";
import { lienWhatsApp } from "@/lib/whatsapp";
import type { AccesPayant } from "@/types/membre";

const AVANTAGES = [
  "Tous les modules débloqués",
  "Page de progression personnelle",
  "Communauté payante avec exercices",
  "Accès immédiat après paiement",
];

// Page de paiement : presentation seulement. Le paiement lui-meme (action initierPaiement, Chariow,
// webhook) n'est pas touche. Un seul moyen est propose, le seul qui existe. Ni code promo, ni TVA, ni
// autre moyen de paiement : aucune de ces fonctions n'existe.
export default async function TunnelPage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect(`/${espace.slug}/communaute`);

  const { data: acces } = await supabase
    .from("acces_payant")
    .select("*")
    .eq("profil_id", userData.user.id)
    .eq("espace_id", espace.id)
    .maybeSingle<AccesPayant>();

  if (acces?.actif) {
    return (
      <main className="mx-auto max-w-md p-16 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-[var(--sarcelle)]">
          tunnel de paiement — {espace.nom}
        </p>
        <h1 className="font-display mt-4 text-3xl font-semibold">Déjà débloqué</h1>
        <p className="mt-4 text-sm text-[var(--texte-mute)]">
          Tu as déjà accès à la formation complète {espace.nom}.
        </p>
        <Link
          href={`/${espace.slug}/communaute-payante`}
          className="mt-8 inline-block rounded-[9px] bg-[var(--encre)] px-5 py-2.5 text-sm font-bold text-[var(--sur-encre)]"
        >
          Voir la communauté payante
        </Link>
      </main>
    );
  }

  // Infos saisies a l'inscription (lecture de sa propre ligne) et contenu reel de la formation.
  const admin = createAdminClient();
  const [{ data: contact }, { data: modules }, { data: moi }, { count: nbNotifs }] = await Promise.all([
    supabase.from("profils_contact").select("prenom, nom, telephone").eq("profil_id", userData.user.id).maybeSingle(),
    admin.from("modules").select("id, sections(id)").eq("espace_id", espace.id),
    supabase.from("profils").select("id, pseudo, avatar_path").eq("id", userData.user.id).maybeSingle(),
    supabase.from("notifications").select("*", { count: "exact", head: true }).eq("lu", false).eq("espace_id", espace.id),
  ]);
  const photos = await urlsAvatars(moi ? [moi as { id: string; avatar_path: string | null }] : []);
  const pseudo = (moi?.pseudo as string | undefined) ?? "Moi";
  const lienAide = lienWhatsApp(espace.whatsapp_support, espace.whatsapp_message, espace.nom, pseudo);
  const modulesAvecContenu = (modules ?? []).filter(
    (m) => ((m as unknown as { sections: unknown[] }).sections ?? []).length > 0
  );
  const nbModules = modulesAvecContenu.length;
  const nbLecons = modulesAvecContenu.reduce((t, m) => t + ((m as unknown as { sections: unknown[] }).sections ?? []).length, 0);
  const prix = `${espace.prix.toLocaleString("fr-FR")} ${espace.devise}`;
  const visuel = `url(/vitrines/${espace.slug}/hero.jpg) center/cover no-repeat, radial-gradient(circle at 25% 20%, rgba(95,199,184,0.55), transparent 55%), radial-gradient(circle at 80% 90%, rgba(255,122,77,0.4), transparent 50%), linear-gradient(135deg, #16443c, #0b2622)`;

  const etapes = [
    { n: 1, t: "Paiement", actif: true },
    { n: 2, t: "Confirmation", actif: false },
    { n: 3, t: "Accès à la formation", actif: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--fond)]">
      {/* Barre du haut : recherche dans la communaute, notifications, compte. */}
      <header className="flex items-center gap-3 border-b border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-3 sm:px-8">
        <form action={`/${espace.slug}/communaute`} className="min-w-0 flex-1">
          <input
            name="q"
            placeholder="Rechercher dans la communauté…"
            aria-label="Rechercher"
            className="w-full max-w-xl rounded-full border border-[var(--ligne)] bg-[var(--fond)] px-5 py-2.5 text-[13px] focus:border-[var(--sarcelle)] focus:outline-none"
          />
        </form>
        <Link href={`/${espace.slug}/notifications`} aria-label="Notifications" className="relative flex h-9 w-9 items-center justify-center rounded-full text-[18px] hover:bg-[var(--fond)]">
          🔔
          {(nbNotifs ?? 0) > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--corail)] px-1 font-mono text-[9.5px] font-bold text-[var(--encre)]">
              {nbNotifs}
            </span>
          )}
        </Link>
        <Link href={`/${espace.slug}/profil`} className="flex items-center gap-2.5">
          <Avatar id={userData.user.id} pseudo={pseudo} taille={34} urlPhoto={photos.get(userData.user.id) ?? null} />
          <span className="hidden text-[12.5px] font-bold sm:block">{pseudo}</span>
        </Link>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8">
        <Link href={`/${espace.slug}`} className="text-[12.5px] font-bold text-[var(--sarcelle-texte)]">
          ← Retour à la formation
        </Link>

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="flex min-w-0 flex-col gap-5">
            {/* En-tete de la formation */}
            <section className="flex flex-col gap-5 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 sm:flex-row sm:items-center">
              <div aria-hidden className="h-36 flex-shrink-0 rounded-xl sm:w-44" style={{ background: visuel }} />
              <div className="min-w-0">
                <span className="rounded-full bg-[rgba(43,140,130,0.12)] px-3 py-1 font-mono text-[11px] font-bold text-[var(--sarcelle-texte)]">
                  Formation complète
                </span>
                <h1 className="font-display mt-2.5 text-[22px] font-semibold leading-snug">{espace.nom}</h1>
                {espace.tagline && <p className="mt-1.5 text-[13.5px] text-[var(--texte-mute)]">{espace.tagline}</p>}
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[12px] font-semibold text-[var(--texte-mute)]">
                  {nbModules > 0 && (
                    <span>
                      {nbModules} module{nbModules !== 1 ? "s" : ""}
                    </span>
                  )}
                  {nbLecons > 0 && (
                    <span>
                      {nbLecons} leçon{nbLecons !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span>Accès immédiat après paiement</span>
                </div>
              </div>
            </section>

            {/* Etapes + paiement */}
            <section className="overflow-hidden rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
              <ol className="flex items-center gap-3 border-b border-[var(--ligne)] px-5 py-4 text-[12.5px] sm:gap-4 sm:px-8">
                {etapes.map((e, i) => (
                  <li key={e.n} className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px] font-bold ${
                        e.actif ? "bg-[var(--sarcelle)] text-white" : "bg-[rgba(43,140,130,0.12)] text-[var(--texte-mute)]"
                      }`}
                    >
                      {e.n}
                    </span>
                    <span className={`${e.actif ? "font-bold" : "text-[var(--texte-mute)]"} ${e.actif ? "" : "hidden sm:inline"}`}>{e.t}</span>
                    {i < etapes.length - 1 && <span aria-hidden className="ml-1 hidden h-px w-8 bg-[var(--ligne)] sm:block" />}
                  </li>
                ))}
              </ol>

              <div className="px-5 py-6 sm:px-8">
                <h2 className="font-display text-[18px] font-bold">Choisis ton mode de paiement</h2>

                <div className="mt-4 flex flex-col gap-2.5">
                  <div className="flex items-center gap-4 rounded-xl border-2 border-[var(--sarcelle)] bg-[rgba(43,140,130,0.06)] p-4">
                    <span aria-hidden className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-[var(--sarcelle)]">
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--sarcelle)]" />
                    </span>
                    <span aria-hidden className="text-[22px]">📱</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-bold">Mobile Money</div>
                      <p className="text-[12px] text-[var(--texte-mute)]">
                        Orange Money, MTN Money ou autre moyen disponible, sur la page de paiement sécurisée.
                      </p>
                    </div>
                  </div>
                  {/* Les autres moyens n'existent pas encore : affiches desactives, jamais selectionnables. */}
                  {[
                    { i: "💳", t: "Carte bancaire", d: "Visa, Mastercard" },
                    { i: "🅿️", t: "PayPal", d: "Avec ton compte PayPal" },
                    { i: "🍎", t: "Apple Pay", d: "Sur appareil compatible" },
                    { i: "🏦", t: "Virement bancaire", d: "Instructions après la commande" },
                  ].map((m) => (
                    <div
                      key={m.t}
                      title="Bientôt disponible"
                      className="flex cursor-not-allowed items-center gap-4 rounded-xl border border-[var(--ligne)] p-4 opacity-55"
                    >
                      <span aria-hidden className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-[var(--ligne)]" />
                      <span aria-hidden className="text-[22px]">{m.i}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-bold">{m.t}</div>
                        <p className="text-[12px] text-[var(--texte-mute)]">{m.d}</p>
                      </div>
                      <span className="font-mono text-[10.5px] font-bold text-[var(--texte-mute)]">bientôt</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-display mb-3 mt-7 text-[15px] font-bold">Tes informations</h3>
                <BoutonPayer
                  espaceSlug={espace.slug}
                  montant={espace.prix}
                  devise={espace.devise}
                  boutonExterne
                  defauts={contact ? { prenom: contact.prenom as string, nom: contact.nom as string, telephone: contact.telephone as string } : undefined}
                />

                <div className="mt-6 flex items-start gap-3.5 rounded-xl bg-[rgba(43,140,130,0.08)] p-4">
                  <span aria-hidden className="text-[20px] leading-none">🔒</span>
                  <div>
                    <div className="text-[13px] font-bold">Paiement sécurisé</div>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--texte-mute)]">
                      Tu es redirigé vers la page de paiement de Chariow. Tu ne saisis jamais tes codes de paiement sur cette
                      plateforme, et ton accès s&apos;ouvre dès que le paiement est confirmé.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4 sm:px-6">
              <span aria-hidden className="text-[24px]">🛟</span>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-bold">Besoin d&apos;aide ?</div>
                <p className="text-[12px] text-[var(--texte-mute)]">
                  {lienAide ? "Tu n'arrives pas à payer ? Écris-nous sur WhatsApp, on t'aide à finaliser." : "Une question sur ton paiement ? Le contact arrive bientôt."}
                </p>
              </div>
              {lienAide ? (
                <a
                  href={lienAide}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#25d366] px-4 py-2 text-[12px] font-extrabold text-[#0b2622]"
                >
                  Contacter sur WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Bientôt disponible"
                  className="cursor-not-allowed rounded-full border border-[var(--ligne)] px-4 py-2 text-[12px] font-bold text-[var(--texte-mute)] opacity-70"
                >
                  Contacter le support · bientôt
                </button>
              )}
            </div>
          </div>

          {/* Recapitulatif */}
          <aside className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-6 lg:sticky lg:top-6">
            <h2 className="font-display text-[19px] font-semibold">Récapitulatif de ta commande</h2>

            <div className="mt-5 flex items-center gap-3.5">
              <div aria-hidden className="h-16 w-20 flex-shrink-0 rounded-lg" style={{ background: visuel }} />
              <div className="min-w-0">
                <div className="text-[13.5px] font-bold leading-snug">{espace.nom}</div>
                <span className="mt-1 inline-block rounded-full bg-[rgba(43,140,130,0.12)] px-2.5 py-0.5 font-mono text-[10.5px] font-bold text-[var(--sarcelle-texte)]">
                  Formation complète
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[var(--ligne)] pt-4 text-[13px]">
              <span className="text-[var(--texte-mute)]">Prix de la formation</span>
              <span className="font-bold">{prix}</span>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-[var(--ligne)] pt-4">
              <span className="font-display text-[15px] font-bold">Total à payer</span>
              <span className="text-right">
                <span className="font-display block text-[26px] font-extrabold leading-none text-[var(--sarcelle)]">{prix}</span>
                <span className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">paiement unique</span>
              </span>
            </div>

            <h3 className="font-display mt-7 text-[14px] font-bold">Les avantages inclus</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {AVANTAGES.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-[13px]">
                  <span aria-hidden className="font-bold text-[var(--sarcelle)]">✓</span>
                  {a}
                </li>
              ))}
            </ul>

            <button
              type="submit"
              form="form-paiement"
              className="mt-6 w-full rounded-[11px] bg-[var(--sarcelle)] py-4 text-[14.5px] font-extrabold text-white shadow-[0_10px_24px_rgba(43,140,130,0.35)] transition-transform hover:-translate-y-0.5"
            >
              🔒 Payer {prix}
            </button>
            <p className="mt-3 text-center text-[11.5px] text-[var(--texte-mute)]">Paiement sécurisé par Chariow</p>

            <div
              className="mt-6 overflow-hidden rounded-xl p-5 text-[var(--sur-encre)]"
              style={{
                background:
                  "radial-gradient(circle at 85% 10%, rgba(255,122,77,0.45), transparent 50%), linear-gradient(135deg, #16443c, #0b2622)",
              }}
            >
              <div className="font-display text-[16px] font-bold">Un doute ?</div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--sur-encre-mute)]">Pose ta question avant de payer.</p>
              {lienAide ? (
                <a
                  href={lienAide}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3.5 block w-full rounded-lg bg-[#25d366] py-2.5 text-center text-[12.5px] font-extrabold text-[#0b2622]"
                >
                  Nous écrire sur WhatsApp
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Bientôt disponible"
                  className="mt-3.5 w-full cursor-not-allowed rounded-lg bg-[rgba(234,245,242,0.9)] py-2.5 text-[12.5px] font-bold text-[#0b2622] opacity-70"
                >
                  Nous contacter · bientôt
                </button>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
