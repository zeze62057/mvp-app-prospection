import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEspaceParSlug } from "@/lib/espaces";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { BoutonPayer } from "@/components/tunnel/BoutonPayer";
import { TexteRiche } from "@/lib/texte-riche";
import { tempsEcoule } from "@/lib/temps";
import { chargerPostsFil } from "@/lib/fil";
import { couleurAvatar } from "@/lib/avatar";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { TexteAvecMentions } from "@/components/communaute/fil/TexteAvecMentions";
import { IconePouce } from "@/components/communaute/fil/CartePost";

// Visuels fournis par Zezé : public/vitrines/<slug>/<nom>.jpg (hero, eco-1..3, comp-1..6, banniere).
// Une image absente laisse le degrade en dessous : aucun trou, aucun test de fichier a faire.
const FONDS = [
  "radial-gradient(circle at 25% 20%, rgba(95,199,184,0.55), transparent 55%), linear-gradient(135deg, #16443c, #0b2622)",
  "radial-gradient(circle at 75% 25%, rgba(255,122,77,0.45), transparent 55%), linear-gradient(135deg, #0b2622, #16443c)",
  "radial-gradient(circle at 50% 80%, rgba(95,199,184,0.4), transparent 60%), radial-gradient(circle at 80% 15%, rgba(255,122,77,0.3), transparent 50%), linear-gradient(135deg, #113832, #0b2622)",
];

function Visuel({
  slug,
  nom,
  i = 0,
  className = "",
  children,
}: {
  slug: string;
  nom: string;
  i?: number;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(/vitrines/${slug}/${nom}.jpg), ${FONDS[i % FONDS.length]}` }}
    >
      {children}
    </div>
  );
}

export default async function VitrinePage({
  params,
}: {
  params: Promise<{ espace: string }>;
}) {
  const { espace: slug } = await params;
  const espace = await getEspaceParSlug(slug);
  if (!espace) notFound();

  const c = espace.contenu_vitrine ?? {};
  const admin = createAdminClient();

  // Visiteur connecte ? Son acces payant decide de ce que montre le bloc d'acces : le formulaire de
  // paiement existant (BoutonPayer, reutilise tel quel) pour un eleve pas encore debloque, un lien vers
  // la formation pour un eleve deja debloque, le bouton vers la page de paiement pour un visiteur.
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data: acces } = userData.user
    ? await supabase
        .from("acces_payant")
        .select("actif")
        .eq("profil_id", userData.user.id)
        .eq("espace_id", espace.id)
        .maybeSingle()
    : { data: null };
  const connecte = !!userData.user;
  const dejaDebloque = !!acces?.actif;

  const debutMois = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)).toISOString();
  const maintenant = new Date().toISOString();

  const [
    { count: nbMembres },
    { data: modulesData },
    { data: avisPourMoyenne },
    { data: temoignages },
    { count: nbDiscussionsMois },
    { count: nbMasterclassAvenir },
    { data: prochainesMasterclasses },
  ] = await Promise.all([
    admin.from("adhesions").select("*", { count: "exact", head: true }).eq("espace_id", espace.id).eq("statut", "approuve"),
    admin.from("modules").select("id, sections(id)").eq("espace_id", espace.id),
    admin.from("temoignages").select("note").eq("espace_id", espace.id).eq("autorise_partage", true),
    admin
      .from("temoignages")
      .select("id, note, texte, profils(pseudo)")
      .eq("espace_id", espace.id)
      .eq("autorise_partage", true)
      .order("note", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("espace_id", espace.id).eq("statut", "publie").gte("created_at", debutMois),
    admin.from("masterclasses").select("*", { count: "exact", head: true }).eq("espace_id", espace.id).gte("date_heure", maintenant),
    admin
      .from("masterclasses")
      .select("id, titre, date_heure")
      .eq("espace_id", espace.id)
      .gte("date_heure", maintenant)
      .order("date_heure")
      .limit(1),
  ]);

  const nbModulesDisponibles = (modulesData ?? []).filter(
    (m) => ((m as unknown as { sections: unknown[] }).sections ?? []).length > 0
  ).length;

  const noteMoyenne =
    avisPourMoyenne && avisPourMoyenne.length > 0
      ? avisPourMoyenne.reduce((total, a) => total + a.note, 0) / avisPourMoyenne.length
      : null;

  const prochaineMasterclass = (prochainesMasterclasses ?? [])[0] as
    | { id: string; titre: string; date_heure: string }
    | undefined;

  // Apercu public : vrais posts et vrai classement, lus avec le client admin car un
  // visiteur non connecte n'a pas de session RLS. Affichage strictement en lecture
  // seule (pas de like/commentaire cliquable, pas de lien vers une page reservee aux
  // membres) : ces actions echoueraient reellement pour quelqu'un de pas encore inscrit.
  const [derniersPosts, { data: statsRpc }] = await Promise.all([
    chargerPostsFil({ supabase: admin, espaceId: espace.id, userId: "", zone: "gratuite", limite: 3 }),
    admin.rpc("stats_communaute", { p_espace: espace.id }),
  ]);
  const classement = (statsRpc as { classement?: { id: string; pseudo: string; points: number }[] } | null)
    ?.classement ?? [];

  // Entrees du menu : seulement celles dont la section existe et s'affiche.
  const menu = [
    { href: "#accueil", libelle: "Accueil" },
    ...(c.parcours_titre ? [{ href: "#parcours", libelle: "Parcours" }] : []),
    ...(c.competences && c.competences.length > 0 ? [{ href: "#programme", libelle: "Programme" }] : []),
    { href: "#communaute", libelle: "Communauté" },
    ...(temoignages && temoignages.length > 0 ? [{ href: "#temoignages", libelle: "Témoignages" }] : []),
    { href: "#acces", libelle: "Accès" },
    ...(c.faq && c.faq.length > 0 ? [{ href: "#faq", libelle: "FAQ" }] : []),
  ];

  return (
    <div className="bg-[var(--fond)] text-[var(--texte)]">
      {/* Menu : uniquement les entrees dont la section s'affiche reellement. */}
      <header className="sticky top-0 z-20 border-b border-[var(--ligne)] bg-[rgba(242,247,245,0.92)] backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-6 py-4 sm:px-16">
          <Link href="#accueil" className="font-display text-lg font-semibold">
            Vivier Academies
          </Link>
          <nav aria-label="Sections de la page" className="hidden items-center gap-6 text-[13px] font-semibold text-[var(--texte-mute)] md:flex">
            {menu.map((m) => (
              <a key={m.href} href={m.href} className="hover:text-[var(--texte)]">
                {m.libelle}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href={`/${espace.slug}/communaute`}
              className="hidden text-[13px] font-semibold text-[var(--texte-mute)] hover:text-[var(--texte)] sm:block"
            >
              Se connecter
            </Link>
            <Link
              href={`/${espace.slug}/communaute`}
              className="rounded-full bg-[var(--encre)] px-4 py-2 text-[12.5px] font-bold text-[var(--sur-encre)]"
            >
              Rejoindre
            </Link>
          </div>
        </div>
      </header>

      {/* Hero sombre, comme la capture : lueurs sarcelle et corail de la charte, visuel a droite. */}
      <div
        id="accueil"
        className="relative flex scroll-mt-20 flex-col gap-14 overflow-hidden bg-[var(--encre)] px-6 pb-24 pt-10 text-[var(--sur-encre)] sm:px-16 lg:flex-row lg:items-center lg:gap-16"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 0%, rgba(95,199,184,0.28), transparent 45%), radial-gradient(circle at 95% 100%, rgba(255,122,77,0.22), transparent 45%)",
        }}
      >
        <div className="flex-1 pt-4">
          {c.hero_kicker && (
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(95,199,184,0.35)] bg-[rgba(95,199,184,0.12)] py-1.5 pl-2.5 pr-3 font-mono text-xs tracking-wide text-[var(--sarcelle-light)]">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--corail)]" />
              {c.hero_kicker}
            </div>
          )}
          {c.hero_titre && (
            <h1 className="font-display mb-5 max-w-xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl [&_em]:bg-gradient-to-r [&_em]:from-[#5fc7b8] [&_em]:to-[#ff9068] [&_em]:bg-clip-text [&_em]:not-italic [&_em]:text-transparent">
              <TexteRiche texte={c.hero_titre} />
            </h1>
          )}
          {c.hero_sous_titre && (
            <p className="mb-8 max-w-md text-[16.5px] leading-relaxed text-[var(--sur-encre-mute)]">
              {c.hero_sous_titre}
            </p>
          )}

          <div className="mb-3.5 flex flex-wrap items-center gap-4">
            <Link
              href={`/${espace.slug}/communaute`}
              className="rounded-[10px] bg-[var(--corail)] px-6 py-4 text-[14.5px] font-bold text-[var(--encre)] shadow-[0_10px_28px_rgba(255,122,77,0.35)] transition-transform hover:-translate-y-0.5"
            >
              Rejoindre la communauté gratuite
            </Link>
            <button
              type="button"
              disabled
              title="Bientôt disponible"
              className="cursor-not-allowed rounded-[10px] border border-[rgba(234,245,242,0.3)] bg-transparent px-6 py-4 text-[14.5px] font-bold text-[var(--sur-encre-mute)] opacity-70"
            >
              Voir la présentation
              <span className="ml-2 font-mono text-[10px] font-normal">bientôt</span>
            </button>
            <span className="text-xs text-[var(--sur-encre-mute)]">
              Sur approbation — réponse sous 24h
            </span>
          </div>

          <div className="mt-8 flex max-w-md items-center gap-3 border-t border-[rgba(234,245,242,0.14)] pt-5">
            <Image
              src="/zeze-bilivogui.jpg"
              alt="Zézé Bilivogui"
              width={44}
              height={44}
              className="h-11 w-11 flex-shrink-0 rounded-full object-cover"
            />
            <div className="text-xs leading-snug">
              <b className="font-bold text-[var(--sur-encre)]">Zézé Bilivogui</b>
              <span className="block text-[var(--sur-encre-mute)]">Fondateur de {espace.nom}</span>
            </div>
          </div>
        </div>

        <div className="w-full flex-shrink-0 lg:w-[460px]">
          <div className="relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl border border-[rgba(234,245,242,0.14)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
            <Visuel slug={espace.slug} nom="hero" className="absolute inset-0" />
          {c.terminal_lignes && c.terminal_lignes.length > 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-[rgba(11,38,34,0.88)] shadow-[0_30px_70px_rgba(0,0,0,0.35)] backdrop-blur">
              <div className="flex items-center gap-2 bg-[var(--encre-2)] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--corail)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--sarcelle-light)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[rgba(234,245,242,0.3)]" />
                {c.terminal_titre && (
                  <span className="ml-1.5 font-mono text-xs text-[var(--sur-encre-mute)]">
                    {c.terminal_titre}
                  </span>
                )}
              </div>
              <div className="px-5 py-6 font-mono text-[12.5px] leading-[1.85] text-[var(--sur-encre)]">
                {c.terminal_lignes.map((ligne, i) => (
                  <div key={i} className={i === 0 ? "" : "mt-2.5 opacity-90"}>
                    {i === 0 ? (
                      <>
                        <span className="text-[var(--sarcelle-light)]">❯</span> {ligne}
                      </>
                    ) : (
                      ligne
                    )}
                  </div>
                ))}
                {c.terminal_lien && (
                  <div className="mt-2.5">
                    → <span className="text-[var(--corail)]">{c.terminal_lien}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Bande de stats reelles, un seul bloc avec separateurs comme la capture. "En ligne maintenant"
          est omis : aucun suivi de presence n'existe dans l'app. Les modules disponibles remplacent
          "heures de contenu", qu'aucune donnee ne fournit. */}
      <div className="relative z-10 mx-6 -mt-10 mb-16 grid grid-cols-2 gap-y-5 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] px-4 py-5 shadow-[0_20px_50px_rgba(17,56,50,0.14)] sm:mx-16 sm:px-8 lg:grid-cols-[repeat(auto-fit,minmax(0,1fr))] lg:divide-x lg:divide-[var(--ligne)]">
        {[
          ...(espace.afficher_compteur_public !== false ? [{ n: String(nbMembres ?? 0), l: "membres actifs" }] : []),
          { n: String(nbModulesDisponibles), l: `module${nbModulesDisponibles !== 1 ? "s" : ""} disponible${nbModulesDisponibles !== 1 ? "s" : ""}` },
          { n: String(nbDiscussionsMois ?? 0), l: `discussion${(nbDiscussionsMois ?? 0) !== 1 ? "s" : ""} ce mois` },
          { n: String(nbMasterclassAvenir ?? 0), l: `événement${(nbMasterclassAvenir ?? 0) !== 1 ? "s" : ""} à venir` },
          ...(noteMoyenne !== null ? [{ n: `${noteMoyenne.toFixed(1)}/5`, l: "satisfaction des membres" }] : []),
        ].map((s) => (
          <div key={s.l} className="px-4 text-center">
            <div className="font-display text-2xl font-extrabold text-[var(--sarcelle)]">{s.n}</div>
            <div className="mt-0.5 text-xs text-[var(--texte-mute)]">{s.l}</div>
          </div>
        ))}
      </div>

      {prochaineMasterclass && (
        <div className="mx-6 mb-16 flex flex-col items-start gap-4 rounded-[20px] bg-[var(--encre)] p-6 text-[var(--sur-encre)] sm:mx-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1.5 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-light)]">
              prochain événement
            </p>
            <p className="font-display text-[17px] font-bold">{prochaineMasterclass.titre}</p>
            <p className="mt-1 text-[12.5px] text-[var(--sur-encre-mute)]">
              {new Date(prochaineMasterclass.date_heure).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}{" "}
              ·{" "}
              {new Date(prochaineMasterclass.date_heure).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Africa/Conakry",
              })}{" "}
              · En ligne
            </p>
          </div>
          <Link
            href={`/${espace.slug}/communaute`}
            className="whitespace-nowrap rounded-[10px] bg-[var(--corail)] px-6 py-3 text-[13.5px] font-extrabold text-[var(--encre)]"
          >
            S&apos;inscrire →
          </Link>
        </div>
      )}

      {/* La carte communaute (colonne de droite) est toujours utile, meme sans posts ni
          classement a montrer : ce bloc n'est donc plus conditionne a leur presence. */}
      <section id="communaute" className="scroll-mt-20 bg-[var(--encre)] px-6 py-16 text-[var(--sur-encre)] sm:px-16">
        <p className="mb-2.5 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-light)]">communauté</p>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          {derniersPosts.length > 0 && (
            <div>
              <h2 className="font-display mb-6 text-2xl font-semibold sm:text-[29px]">
                Les dernières discussions
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {derniersPosts.map((item) => (
                  <div key={item.post.id} className="rounded-2xl border border-[rgba(234,245,242,0.14)] bg-[rgba(234,245,242,0.06)] p-5">
                    <div className="mb-2.5 flex items-center gap-2.5">
                      <Avatar id={item.auteur.id} pseudo={item.auteur.pseudo} taille={30} urlPhoto={item.auteur.avatarUrl} />
                      <div className="min-w-0">
                        <div className="truncate text-[12.5px] font-bold">{item.auteur.pseudo}</div>
                        <div className="font-mono text-[10px] text-[var(--sur-encre-mute)]">{tempsEcoule(item.post.created_at)}</div>
                      </div>
                    </div>
                    {item.post.titre && (
                      <h3 className="font-display mb-1.5 text-[14.5px] font-bold leading-snug">{item.post.titre}</h3>
                    )}
                    <p className="line-clamp-3 text-[12.5px] leading-relaxed text-[var(--sur-encre-mute)]">
                      <TexteAvecMentions texte={item.post.contenu} />
                    </p>
                    <div className="mt-3.5 flex items-center gap-3 border-t border-[rgba(234,245,242,0.14)] pt-3 text-[11.5px] text-[var(--sur-encre-mute)]">
                      <span className="flex items-center gap-1.5 font-bold">
                        <IconePouce plein={false} />
                        {item.nbReactions}
                      </span>
                      <span>{item.nbCommentaires} commentaire{item.nbCommentaires !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={`flex flex-col gap-4 ${derniersPosts.length === 0 ? "lg:col-span-2 lg:max-w-sm" : ""}`}>
            <div className="rounded-2xl border border-[rgba(234,245,242,0.14)] bg-[rgba(234,245,242,0.06)] p-5">
              <div className="font-display mb-1 text-[14.5px] font-bold">{espace.nom}</div>
              {espace.tagline && (
                <p className="mb-3.5 text-[11.5px] leading-relaxed text-[var(--sur-encre-mute)]">{espace.tagline}</p>
              )}
              <div className="mb-3.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-[var(--sur-encre-mute)]">
                {espace.afficher_compteur_public !== false && (
                  <span>
                    👥 <b className="text-[var(--sur-encre)]">{nbMembres ?? 0}</b> membres
                  </span>
                )}
                {noteMoyenne !== null && (
                  <span>
                    ★ <b className="text-[var(--sur-encre)]">{noteMoyenne.toFixed(1)}/5</b>
                  </span>
                )}
              </div>
              <Link
                href={`/${espace.slug}/communaute`}
                className="block w-full rounded-[9px] bg-[var(--corail)] px-4 py-2.5 text-center text-[12.5px] font-bold text-[var(--encre)]"
              >
                Rejoindre la communauté →
              </Link>
            </div>

            {classement.length > 0 && (
              <div className="rounded-2xl border border-[rgba(234,245,242,0.14)] bg-[rgba(234,245,242,0.06)] p-5">
                <div className="font-display mb-3.5 text-[14px] font-bold">Membres actifs</div>
                {classement.slice(0, 5).map((m, i) => (
                  <div key={m.id} className="flex items-center gap-2.5 py-1.5">
                    <span className="w-4 shrink-0 font-mono text-[11px] font-bold text-[var(--sur-encre-mute)]">{i + 1}</span>
                    <div className="h-7 w-7 flex-shrink-0 rounded-full" style={{ background: couleurAvatar(m.id) }} />
                    <span className="flex-1 truncate text-xs font-bold">{m.pseudo}</span>
                    <span className="font-mono text-[11px] font-bold text-[var(--corail)]">{m.points} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {c.competences && c.competences.length > 0 && (
        <div id="programme" className="scroll-mt-20 px-6 py-16 sm:px-16">
          <p className="mb-2.5 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-texte)]">
            au programme
          </p>
          <h2 className="font-display mb-8 max-w-xl text-2xl font-semibold sm:text-[29px]">
            {c.competences_titre}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {c.competences.map((competence, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] shadow-[0_10px_30px_rgba(17,56,50,0.07)]">
                <Visuel slug={espace.slug} nom={`comp-${i + 1}`} i={i} className="flex h-28 items-end p-3">
                  <span className="rounded-md bg-[rgba(11,38,34,0.7)] px-2 py-0.5 font-mono text-[11px] font-bold text-[var(--sarcelle-light)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Visuel>
                <p className="p-5 text-[13.5px] leading-relaxed text-[var(--texte)]">{competence}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {c.parcours_titre && (
        <section id="parcours" className="scroll-mt-20 px-6 py-16 sm:px-16">
          <p className="mb-2.5 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-texte)]">
            le parcours
          </p>
          <h2 className="font-display mb-11 max-w-xl text-2xl font-semibold sm:text-[29px]">
            {c.parcours_titre}
          </h2>
          <ol className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              { titre: "Communauté gratuite", texte: c.parcours_etape1 },
              { titre: "Formation complète", texte: c.parcours_etape2 },
              { titre: "Communauté payante", texte: c.parcours_etape3 },
            ].map((etape, i) => (
              <li key={etape.titre} className="overflow-hidden rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] shadow-[0_10px_30px_rgba(17,56,50,0.07)]">
                <Visuel slug={espace.slug} nom={`eco-${i + 1}`} i={i} className="flex h-40 items-start p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--corail)] font-mono text-[13px] font-bold text-[var(--encre)]">
                    {i + 1}
                  </span>
                </Visuel>
                <div className="p-5">
                  <p className="font-display mb-2 text-base font-bold">{etape.titre}</p>
                  <p className="text-[13.5px] leading-relaxed text-[var(--texte-mute)]">{etape.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(c.fondateur_lede || (c.fondateur_paragraphes && c.fondateur_paragraphes.length > 0)) && (
        <div className="flex flex-col gap-10 px-6 py-16 sm:px-16 lg:flex-row lg:items-center lg:gap-14">
          <div className="relative h-[300px] flex-shrink-0 lg:w-[340px]">
            {c.fondateur_tag && (
              <div className="absolute -top-3.5 left-6 z-10 -rotate-3 rounded-lg bg-[var(--corail)] px-3 py-1.5 font-mono text-xs font-bold text-[var(--encre)]">
                {c.fondateur_tag}
              </div>
            )}
            <div className="absolute left-0 top-2.5 z-[2] h-[240px] w-[200px] overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(17,56,50,0.14)]">
              <Image
                src="/zeze-bilivogui.jpg"
                alt={`Zézé Bilivogui, fondateur de ${espace.nom}`}
                width={200}
                height={240}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            {c.fondateur_legende && (
              <div className="absolute bottom-0 right-0 z-[1] flex h-[130px] w-[160px] items-center justify-center rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-3.5 text-center font-mono text-xs text-[var(--texte-mute)] shadow-[0_18px_40px_rgba(17,56,50,0.14)]">
                <span>
                  {c.fondateur_legende.split("\n").map((ligne, i) => (
                    <span key={i}>
                      {i > 0 && <br />}
                      {ligne}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <p className="mb-2.5 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-texte)]">
              le fondateur
            </p>
            {c.fondateur_lede && (
              <p className="mb-4 text-lg font-semibold text-[var(--texte)]">{c.fondateur_lede}</p>
            )}
            {(c.fondateur_paragraphes ?? []).map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-relaxed text-[var(--texte-mute)]">
                <TexteRiche texte={p} />
              </p>
            ))}
          </div>
        </div>
      )}

      {temoignages && temoignages.length > 0 && (
        <div id="temoignages" className="scroll-mt-20 px-6 py-16 sm:px-16">
          <p className="mb-2.5 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-texte)]">
            preuve, pas promesse
          </p>
          <h2 className="font-display mb-8 max-w-xl text-2xl font-semibold sm:text-[29px]">
            Ce que dit la communauté
          </h2>
          <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-3">
            {temoignages.map((t) => (
              <div key={t.id} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="h-[30px] w-[30px] flex-shrink-0 rounded-full bg-[var(--sarcelle)]" />
                  <span className="text-[12.5px] font-bold">
                    {(t.profils as unknown as { pseudo: string } | null)?.pseudo ?? "Membre"}
                  </span>
                </div>
                <div
                  role="img"
                  aria-label={`Note : ${t.note} sur 5`}
                  className="mb-3 font-mono text-xs text-[var(--corail-texte)]"
                >
                  {"★".repeat(t.note)}
                  <span className="text-[var(--ligne)]">{"★".repeat(5 - t.note)}</span>
                </div>
                <p className="text-[13px] leading-relaxed text-[var(--texte)]">{t.texte}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acces : remplace le bloc Tarifs de la capture de reference. Paiement en une fois, sur la page
          tunnel existante (inchangee) ; aucun abonnement, aucun prix mensuel ou annuel. */}
      <section id="acces" className="scroll-mt-20 px-6 py-16 sm:px-16">
        <div className="mx-auto max-w-xl rounded-[20px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-8 shadow-[0_24px_60px_rgba(17,56,50,0.12)]">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-texte)]">formation complète</p>
          <h2 className="font-display text-2xl font-semibold">{espace.nom}</h2>
          {espace.tagline && <p className="mt-1.5 text-[13.5px] text-[var(--texte-mute)]">{espace.tagline}</p>}
          <p className="font-display mt-5 text-4xl font-extrabold text-[var(--sarcelle)]">
            {espace.prix.toLocaleString("fr-FR")}
            <span className="ml-1.5 font-mono text-sm font-normal text-[var(--texte-mute)]">{espace.devise}</span>
          </p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-[var(--texte-mute)]">paiement unique</p>
          {c.parcours_etape2 && (
            <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--texte-mute)]">{c.parcours_etape2}</p>
          )}
          {dejaDebloque ? (
            <Link
              href={`/${espace.slug}/communaute-payante`}
              className="mt-6 block w-full rounded-[11px] bg-[var(--encre)] px-5 py-4 text-center text-[14.5px] font-extrabold text-[var(--sur-encre)]"
            >
              Tu as déjà accès : ouvrir la formation
            </Link>
          ) : connecte ? (
            <div className="mt-6">
              <BoutonPayer espaceSlug={espace.slug} montant={espace.prix} devise={espace.devise} />
            </div>
          ) : (
            <>
              <Link
                href={`/${espace.slug}/tunnel`}
                className="mt-6 block w-full rounded-[11px] bg-[var(--encre)] px-5 py-4 text-center text-[14.5px] font-extrabold text-[var(--sur-encre)] transition-transform hover:-translate-y-0.5"
              >
                Débloquer la formation
              </Link>
              <p className="mt-2.5 text-center text-[11.5px] text-[var(--texte-mute)]">
                Il faut un compte : tu te connectes ou tu en crées un, puis tu arrives sur le paiement.
              </p>
            </>
          )}
        </div>
      </section>

      {c.faq && c.faq.length > 0 && (
        <div id="faq" className="scroll-mt-20 px-6 py-16 sm:px-16">
          <p className="mb-2.5 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-texte)]">
            questions fréquentes
          </p>
          <h2 className="font-display mb-8 max-w-xl text-2xl font-semibold sm:text-[29px]">
            Ce que tu te demandes probablement
          </h2>
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {c.faq.map((item, i) => (
              <details
                key={i}
                className="rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5 [&[open]>summary]:mb-2.5"
              >
                <summary className="cursor-pointer text-[14.5px] font-bold text-[var(--texte)]">
                  {item.question}
                </summary>
                <p className="text-[13.5px] leading-relaxed text-[var(--texte-mute)]">
                  {item.reponse.replace("{{prix}}", `${espace.prix.toLocaleString("fr-FR")} ${espace.devise}`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}

      {c.offre_texte && (
        <Visuel
          slug={espace.slug}
          nom="banniere"
          i={2}
          className="mx-6 mb-16 flex flex-col items-start gap-5 rounded-[20px] p-8 text-[var(--sur-encre)] sm:mx-16 sm:flex-row sm:items-center sm:justify-between sm:p-10"
        >
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[var(--corail)]">
              offre de lancement · places limitées
            </p>
            <p className="font-display max-w-lg text-[21px] font-bold [&_em]:text-[var(--sarcelle-light)]">
              <TexteRiche texte={c.offre_texte} />
            </p>
          </div>
          <Link
            href={`/${espace.slug}/communaute`}
            className="whitespace-nowrap rounded-[10px] bg-[var(--corail)] px-6 py-3.5 text-[13.5px] font-extrabold text-[var(--encre)]"
          >
            Rejoindre maintenant
          </Link>
        </Visuel>
      )}

      <footer className="flex flex-col gap-4 bg-[var(--encre)] px-6 py-8 text-[var(--sur-encre)] sm:flex-row sm:items-center sm:justify-between sm:px-16">
        <div>
          <span className="font-display text-[15px] font-semibold">Vivier Academies</span>
          <span className="mt-1 block font-mono text-xs text-[var(--sur-encre-mute)]">le vivier des talents ia francophones</span>
        </div>
        <nav aria-label="Liens du pied de page" className="flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] font-semibold text-[var(--sur-encre-mute)]">
          {menu.map((m) => (
            <a key={m.href} href={m.href} className="hover:text-[var(--sur-encre)]">
              {m.libelle}
            </a>
          ))}
          <Link href={`/${espace.slug}/communaute`} className="hover:text-[var(--sur-encre)]">
            Se connecter
          </Link>
        </nav>
      </footer>
    </div>
  );
}
