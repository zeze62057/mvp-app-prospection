"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { inscription, connexion } from "@/app/(membre)/[espace]/communaute/actions";
import { couleurAvatar } from "@/lib/avatar";

const etatInitial = { erreur: null };

export type StatsConnexion = {
  membres: number | null;
  avatars: string[];
  modules: number;
  prochaine: { titre: string; date: string } | null;
};

// Ecran de connexion plein ecran, deux volets comme la capture de reference. Recouvre la page qui
// l'affiche (fixed) : les six pages qui l'utilisent n'ont pas a changer de structure. Les connexions
// Google, Microsoft, LinkedIn et le mot de passe oublie n'existent pas dans la plateforme : ils sont
// affiches desactives, jamais actifs. Les cartes flottantes n'affichent que des chiffres reels.
const ATOUTS = [
  { titre: "Une formation pas à pas", texte: "Des modules dans l'ordre, à ton rythme.", couleur: "#5fc7b8" },
  { titre: "Une communauté d'entraide", texte: "Pose tes questions, avance avec les autres.", couleur: "#ff7a4d" },
  { titre: "Des masterclass en direct", texte: "Des rendez-vous pour passer à l'action.", couleur: "#5fc7b8" },
];

const CHAMP =
  "w-full rounded-xl border border-[rgba(234,245,242,0.16)] bg-[rgba(234,245,242,0.04)] py-3 pl-11 pr-4 text-[14px] text-[var(--sur-encre)] placeholder:text-[rgba(234,245,242,0.4)] focus:border-[var(--sarcelle-light)] focus:outline-none";
const VERRE =
  "rounded-2xl border border-[rgba(234,245,242,0.22)] bg-[rgba(11,38,34,0.6)] shadow-[0_18px_40px_rgba(0,0,0,0.35)] backdrop-blur-md";

function Icone({ d }: { d: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 fill-none stroke-[rgba(234,245,242,0.6)] stroke-[1.8]" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

function Marque({ taille = 36 }: { taille?: number }) {
  return (
    <span
      aria-hidden
      className="flex flex-shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-[#5fc7b8] to-[#ff7a4d] font-display font-bold text-[#0b2622]"
      style={{ width: taille, height: taille, fontSize: taille * 0.5 }}
    >
      V
    </span>
  );
}

export function FormulaireAuth({
  espaceSlug,
  espaceNom,
  stats,
}: {
  espaceSlug: string;
  espaceNom?: string;
  stats?: StatsConnexion;
}) {
  const [mode, setMode] = useState<"connexion" | "inscription">("inscription");
  const [voir, setVoir] = useState(false);
  const [etatInscription, actionInscription] = useActionState(inscription, etatInitial);
  const [etatConnexion, actionConnexion] = useActionState(connexion, etatInitial);

  const etat = mode === "inscription" ? etatInscription : etatConnexion;
  const insc = mode === "inscription";
  const nbMembres = stats?.membres ?? null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#061412] text-[var(--sur-encre)]">
      <div className="grid min-h-full grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* Volet visuel */}
        <section
          className="relative overflow-hidden px-6 py-8 sm:px-12 lg:sticky lg:top-0 lg:h-screen lg:self-start xl:px-14 xl:py-12"
          style={{
            background:
              "radial-gradient(circle at 20% 5%, rgba(95,199,184,0.26), transparent 42%), radial-gradient(circle at 85% 95%, rgba(255,122,77,0.22), transparent 45%), linear-gradient(170deg, #0f302b, #061412)",
          }}
        >
          <Link href={`/${espaceSlug}`} className="flex items-center gap-3">
            <Marque />
            <span>
              <span className="font-display block text-lg font-semibold leading-tight">Vivier Academies</span>
              <span className="block text-[11px] text-[var(--sur-encre-mute)]">Le vivier des talents IA francophones</span>
            </span>
          </Link>

          <h1 className="font-display mt-8 max-w-md text-[36px] font-semibold leading-[1.06] tracking-tight sm:text-[48px] xl:mt-14 xl:text-[58px]">
            {insc ? "Rejoins la communauté" : "Content de te revoir"}
            <span className="block bg-gradient-to-r from-[#5fc7b8] via-[#8fdccf] to-[#ff9068] bg-clip-text text-transparent">
              {espaceNom ?? "Vivier Academies"}.
            </span>
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[var(--sur-encre-mute)]">
            Un seul compte pour la formation, la communauté et les masterclass, en temps réel.
          </p>

          <ul className="mt-8 flex max-w-[280px] flex-col gap-5 xl:relative xl:z-10">
            {ATOUTS.map((a) => (
              <li key={a.titre} className="flex items-start gap-3.5">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold"
                  style={{ borderColor: a.couleur, color: a.couleur }}
                >
                  ✓
                </span>
                <div>
                  <div className="text-[14px] font-bold">{a.titre}</div>
                  <div className="text-[12.5px] text-[var(--sur-encre-mute)]">{a.texte}</div>
                </div>
              </li>
            ))}
          </ul>

          {/* Petit ecran : signature seule. */}
          <div className={`${VERRE} mt-10 flex items-center gap-3 px-4 py-3 xl:hidden`}>
            <Image src="/zeze-bilivogui.jpg" alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover object-top" />
            <div className="text-xs leading-snug">
              <b className="block text-[13px]">Zézé Bilivogui</b>
              <span className="text-[var(--sur-encre-mute)]">Fondateur{espaceNom ? ` de ${espaceNom}` : ""}</span>
            </div>
          </div>

          {/* Grand ecran : portrait coupe en bas comme la capture, cartes de verre autour. */}
          <div className="absolute bottom-0 right-12 hidden w-[340px] xl:block">
            <div aria-hidden className="absolute -inset-x-6 bottom-0 top-10 rounded-[40px] bg-gradient-to-br from-[#5fc7b8] to-[#ff7a4d] opacity-35 blur-3xl" />
            <Image
              src="/zeze-bilivogui.jpg"
              alt="Zézé Bilivogui"
              width={340}
              height={453}
              priority
              className="relative h-[470px] w-[340px] rounded-t-[36px] border border-b-0 border-[rgba(234,245,242,0.3)] object-cover object-top shadow-[0_30px_70px_rgba(0,0,0,0.5)]"
            />
            <div className={`${VERRE} absolute bottom-6 left-6 right-6 px-4 py-3`}>
              <b className="block text-[13px]">Zézé Bilivogui</b>
              <span className="text-xs text-[var(--sur-encre-mute)]">Fondateur{espaceNom ? ` de ${espaceNom}` : ""}</span>
            </div>

            {nbMembres !== null && (
              <div className={`${VERRE} absolute -right-10 top-6 w-[170px] px-4 py-3.5`}>
                <div className="text-[11.5px] font-semibold text-[var(--sur-encre-mute)]">Communauté</div>
                <div className="font-display mt-0.5 text-[30px] font-bold leading-none">{nbMembres}</div>
                <div className="mt-1 text-[11.5px] font-bold text-[var(--sarcelle-light)]">
                  membre{nbMembres !== 1 ? "s" : ""}
                </div>
              </div>
            )}
            {(stats?.modules ?? 0) > 0 && (
              <div className={`${VERRE} absolute -right-10 top-[150px] w-[150px] px-4 py-3.5`}>
                <div className="text-[11.5px] font-semibold text-[var(--sur-encre-mute)]">Formation</div>
                <div className="font-display mt-0.5 text-[30px] font-bold leading-none">{stats?.modules}</div>
                <div className="mt-1 text-[11.5px] font-bold text-[var(--corail)]">
                  module{(stats?.modules ?? 0) !== 1 ? "s" : ""}
                </div>
              </div>
            )}
            {stats?.prochaine && (
              <div className={`${VERRE} absolute -left-10 bottom-28 flex w-[230px] items-center gap-3 px-4 py-3`}>
                <span aria-hidden className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#5fc7b8] text-sm font-bold text-[#0b2622]">
                  ✓
                </span>
                <div className="min-w-0 text-[11.5px] leading-snug">
                  <b className="block truncate text-[12.5px]">{stats.prochaine.titre}</b>
                  <span className="text-[var(--sur-encre-mute)]">Prochaine masterclass · {stats.prochaine.date}</span>
                </div>
              </div>
            )}
          </div>

          {/* Mot manuscrit et flèche, comme la capture. */}
          <div className="absolute bottom-36 left-14 hidden -rotate-6 items-end gap-2 xl:flex">
            <span className="font-display text-[22px] italic leading-tight text-[var(--sur-encre)]">
              Ton parcours
              <br />
              commence ici.
            </span>
            <svg aria-hidden viewBox="0 0 60 30" className="h-8 w-16 fill-none stroke-[var(--sur-encre)] stroke-[1.6]" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 22c14-2 28-6 48-14M42 4l9 4-5 8" />
            </svg>
          </div>

          {/* Preuve sociale reelle : nombre de membres et pastilles de couleur, pas de faux visages. */}
          {nbMembres !== null && nbMembres > 0 && (
            <div className="mt-8 flex items-center gap-3 xl:absolute xl:bottom-10 xl:left-14 xl:mt-0">
              <div className="flex">
                {(stats?.avatars ?? []).slice(0, 4).map((id, i) => (
                  <span
                    key={id}
                    aria-hidden
                    className="h-9 w-9 rounded-full border-2 border-[#0f302b]"
                    style={{ background: couleurAvatar(id), marginLeft: i === 0 ? 0 : -10 }}
                  />
                ))}
              </div>
              <div className="text-xs leading-snug">
                <b className="block text-[13px]">
                  {nbMembres} membre{nbMembres !== 1 ? "s" : ""}
                </b>
                <span className="text-[var(--sur-encre-mute)]">dans la communauté</span>
              </div>
            </div>
          )}
        </section>

        {/* Volet formulaire */}
        <section className="flex items-center justify-center bg-[#050f0d] px-4 py-10 sm:px-10">
          <div className="w-full max-w-[440px] rounded-3xl border border-[rgba(234,245,242,0.14)] bg-[rgba(234,245,242,0.03)] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)] sm:p-9">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-3">
                <Marque taille={38} />
                <span className="font-display text-[24px] font-semibold">Vivier Academies</span>
              </div>
              <p className="mt-2 text-[13px] text-[var(--sur-encre-mute)]">
                {espaceNom ? `Connecte-toi à ton espace ${espaceNom}` : "Connecte-toi à ton espace"}
              </p>
            </div>

            <h2 className="font-display mt-8 text-[24px] font-bold">{insc ? "Crée ton compte" : "Bon retour !"}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--sur-encre-mute)]">
              {insc ? "Un compte pour demander l'accès à la communauté et suivre ta formation." : "Accède à ton compte et continue ta formation."}
            </p>

            <form action={insc ? actionInscription : actionConnexion} className="mt-6 flex flex-col gap-4">
              <input type="hidden" name="espace_slug" value={espaceSlug} />
              {insc && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="auth-prenom" className="mb-1.5 block text-[13px] font-bold">
                      Prénom
                    </label>
                    <div className="relative">
                      <Icone d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
                      <input id="auth-prenom" name="prenom" placeholder="Ton prénom" required autoComplete="given-name" className={CHAMP} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="auth-nom" className="mb-1.5 block text-[13px] font-bold">
                      Nom
                    </label>
                    <div className="relative">
                      <Icone d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
                      <input id="auth-nom" name="nom" placeholder="Ton nom" required autoComplete="family-name" className={CHAMP} />
                    </div>
                  </div>
                </div>
              )}
              {insc && (
                <div>
                  <label htmlFor="auth-pseudo" className="mb-1.5 block text-[13px] font-bold">
                    Pseudo
                  </label>
                  <div className="relative">
                    <Icone d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0" />
                    <input id="auth-pseudo" name="pseudo" placeholder="Ton pseudo" required className={CHAMP} />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="auth-email" className="mb-1.5 block text-[13px] font-bold">
                  Email
                </label>
                <div className="relative">
                  <Icone d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />
                  <input id="auth-email" type="email" name="email" placeholder="ton@email.com" required autoComplete={insc ? "email" : "username"} className={CHAMP} />
                </div>
              </div>
              {insc && (
                <div>
                  <label htmlFor="auth-tel" className="mb-1.5 block text-[13px] font-bold">
                    Téléphone / WhatsApp
                  </label>
                  <div className="relative">
                    <Icone d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 14l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
                    <input id="auth-tel" type="tel" name="telephone" placeholder="+224 6XX XX XX XX" required autoComplete="tel" className={CHAMP} />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="auth-mdp" className="mb-1.5 block text-[13px] font-bold">
                  Mot de passe
                </label>
                <div className="relative">
                  <Icone d="M6 11h12v9H6v-9Zm2 0V8a4 4 0 0 1 8 0v3" />
                  <input
                    id="auth-mdp"
                    type={voir ? "text" : "password"}
                    name="mot_de_passe"
                    placeholder="Ton mot de passe"
                    required
                    minLength={6}
                    autoComplete={insc ? "new-password" : "current-password"}
                    className={`${CHAMP} pr-16`}
                  />
                  <button
                    type="button"
                    onClick={() => setVoir((v) => !v)}
                    aria-label={voir ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[rgba(234,245,242,0.6)]"
                  >
                    {voir ? "Masquer" : "Voir"}
                  </button>
                </div>
                {!insc && (
                  <span title="Bientôt disponible" className="mt-2 block cursor-not-allowed text-right text-[11.5px] font-semibold text-[rgba(143,220,207,0.5)]">
                    Mot de passe oublié ? · bientôt
                  </span>
                )}
              </div>
              {insc && (
                <div>
                  <label htmlFor="auth-conf" className="mb-1.5 block text-[13px] font-bold">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Icone d="M6 11h12v9H6v-9Zm2 0V8a4 4 0 0 1 8 0v3" />
                    <input id="auth-conf" type={voir ? "text" : "password"} name="confirmation" placeholder="Répète ton mot de passe" required minLength={6} autoComplete="new-password" className={CHAMP} />
                  </div>
                </div>
              )}
              {etat.erreur && (
                <p role="alert" className="rounded-lg bg-[rgba(255,122,77,0.14)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--corail)]">
                  {etat.erreur}
                </p>
              )}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2b8c82] via-[#5fc7b8] to-[#8fdccf] px-4 py-3.5 text-[14.5px] font-extrabold text-[#0b2622] shadow-[0_10px_28px_rgba(43,140,130,0.45)] transition-transform hover:-translate-y-0.5"
              >
                {insc ? "Créer mon compte" : "Se connecter"}
                <span aria-hidden>→</span>
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[12px] text-[rgba(234,245,242,0.5)]">
              <span className="h-px flex-1 bg-[rgba(234,245,242,0.14)]" />
              ou
              <span className="h-px flex-1 bg-[rgba(234,245,242,0.14)]" />
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                { nom: "Google", g: "G", style: "bg-[rgba(255,255,255,0.88)] text-[#1c2b28] opacity-60" },
                { nom: "Microsoft", g: "M", style: "border border-[rgba(234,245,242,0.18)] text-[rgba(234,245,242,0.5)]" },
                { nom: "LinkedIn", g: "in", style: "border border-[rgba(234,245,242,0.18)] text-[rgba(234,245,242,0.5)] sm:col-span-2" },
              ].map((f) => (
                <button
                  key={f.nom}
                  type="button"
                  disabled
                  title="Bientôt disponible"
                  className={`flex cursor-not-allowed items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-[12.5px] font-semibold ${f.style}`}
                >
                  <span aria-hidden className="flex h-5 w-5 items-center justify-center rounded bg-[rgba(128,128,128,0.25)] text-[10px] font-extrabold">
                    {f.g}
                  </span>
                  Continuer avec {f.nom}
                  <span className="font-mono text-[10px] font-normal">bientôt</span>
                </button>
              ))}
            </div>

            <p className="mt-7 text-center text-[13px] text-[var(--sur-encre-mute)]">
              {insc ? "Tu as déjà un compte ?" : "Tu n'as pas encore de compte ?"}
              <button
                type="button"
                onClick={() => setMode(insc ? "connexion" : "inscription")}
                className="mt-1 block w-full text-[13.5px] font-bold text-[var(--sarcelle-light)]"
              >
                {insc ? "Se connecter →" : "Créer un compte →"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
