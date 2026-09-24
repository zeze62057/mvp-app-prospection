"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { inscription, connexion } from "@/app/(membre)/[espace]/communaute/actions";

const etatInitial = { erreur: null };

// Ecran de connexion plein ecran, deux volets comme la capture de reference. Recouvre la page qui
// l'affiche (fixed) : les six pages qui utilisent ce composant n'ont pas a changer de structure.
// Les connexions Google, Microsoft, LinkedIn et le mot de passe oublie n'existent pas dans la
// plateforme : ils sont affiches desactives, jamais actifs.
const ATOUTS = [
  { titre: "Une formation pas à pas", texte: "Des modules dans l'ordre, à ton rythme.", couleur: "#5fc7b8" },
  { titre: "Une communauté d'entraide", texte: "Pose tes questions, avance avec les autres.", couleur: "#ff7a4d" },
  { titre: "Des masterclass en direct", texte: "Des rendez-vous pour passer à l'action.", couleur: "#5fc7b8" },
];

const CHAMP =
  "w-full rounded-xl border border-[rgba(234,245,242,0.18)] bg-[rgba(234,245,242,0.05)] py-3 pl-11 pr-4 text-[14px] text-[var(--sur-encre)] placeholder:text-[rgba(234,245,242,0.4)] focus:border-[var(--sarcelle-light)] focus:outline-none";

function Icone({ d }: { d: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 fill-none stroke-[rgba(234,245,242,0.6)] stroke-[1.8]" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function FormulaireAuth({ espaceSlug, espaceNom }: { espaceSlug: string; espaceNom?: string }) {
  const [mode, setMode] = useState<"connexion" | "inscription">("inscription");
  const [voir, setVoir] = useState(false);
  const [etatInscription, actionInscription] = useActionState(inscription, etatInitial);
  const [etatConnexion, actionConnexion] = useActionState(connexion, etatInitial);

  const etat = mode === "inscription" ? etatInscription : etatConnexion;
  const insc = mode === "inscription";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0b2622] text-[var(--sur-encre)]">
      <div className="grid min-h-full grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
        {/* Volet visuel */}
        <section
          className="relative overflow-hidden px-6 py-8 sm:px-12 lg:px-14 lg:py-12"
          style={{
            background:
              "radial-gradient(circle at 15% 10%, rgba(95,199,184,0.28), transparent 45%), radial-gradient(circle at 90% 90%, rgba(255,122,77,0.22), transparent 45%), linear-gradient(160deg, #16443c, #0b2622)",
          }}
        >
          <Link href={`/${espaceSlug}`} className="font-display text-lg font-semibold">
            Vivier Academies
          </Link>
          <p className="mt-1 font-mono text-[11px] text-[var(--sur-encre-mute)]">le vivier des talents ia francophones</p>

          <h1 className="font-display mt-8 max-w-md text-[32px] font-semibold leading-[1.1] tracking-tight sm:text-[44px] lg:mt-14">
            {insc ? "Rejoins la communauté" : "Content de te revoir"}
            <span className="block bg-gradient-to-r from-[#5fc7b8] to-[#ff9068] bg-clip-text text-transparent">
              {espaceNom ?? "Vivier Academies"}.
            </span>
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--sur-encre-mute)]">
            Un seul compte pour la formation, la communauté et les masterclass.
          </p>

          <ul className="mt-8 flex max-w-xs flex-col gap-5 lg:relative lg:z-10">
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

          {/* Portrait du fondateur, cadre lumineux : la photo vient du projet, aucun visage generique. */}
          <div className="mt-10 flex items-center gap-3.5 lg:absolute lg:bottom-12 lg:right-14 lg:mt-0 lg:flex-col lg:items-end">
            <div className="relative hidden lg:block">
              <div aria-hidden className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-[#5fc7b8] to-[#ff7a4d] opacity-40 blur-2xl" />
              <Image
                src="/zeze-bilivogui.jpg"
                alt="Zézé Bilivogui"
                width={250}
                height={333}
                priority
                className="relative h-[333px] w-[250px] rounded-3xl border border-[rgba(234,245,242,0.3)] object-cover object-top shadow-[0_30px_70px_rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[rgba(234,245,242,0.2)] bg-[rgba(11,38,34,0.7)] px-4 py-3 backdrop-blur lg:-mt-10 lg:relative">
              <Image src="/zeze-bilivogui.jpg" alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover object-top lg:hidden" />
              <div className="text-xs leading-snug">
                <b className="block text-[13px]">Zézé Bilivogui</b>
                <span className="text-[var(--sur-encre-mute)]">Fondateur{espaceNom ? ` de ${espaceNom}` : ""}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Volet formulaire */}
        <section className="flex items-center justify-center bg-[#08201c] px-4 py-10 sm:px-10">
          <div className="w-full max-w-[440px] rounded-3xl border border-[rgba(234,245,242,0.14)] bg-[rgba(234,245,242,0.03)] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-9">
            <div className="text-center">
              <div className="font-display text-[22px] font-semibold">Vivier Academies</div>
              <p className="mt-1 text-[13px] text-[var(--sur-encre-mute)]">
                {espaceNom ? `Ton espace ${espaceNom}` : "Ton espace"}
              </p>
            </div>

            <h2 className="font-display mt-8 text-[24px] font-bold">{insc ? "Crée ton compte" : "Bon retour !"}</h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--sur-encre-mute)]">
              {insc ? "Un compte pour demander l'accès à la communauté et suivre ta formation." : "Accède à ton compte et continue ta formation."}
            </p>

            <form action={insc ? actionInscription : actionConnexion} className="mt-6 flex flex-col gap-4">
              <input type="hidden" name="espace_slug" value={espaceSlug} />
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
                  <input id="auth-email" type="email" name="email" placeholder="ton@email.com" required className={CHAMP} />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="auth-mdp" className="text-[13px] font-bold">
                    Mot de passe
                  </label>
                  <span title="Bientôt disponible" className="cursor-not-allowed text-[11.5px] font-semibold text-[rgba(234,245,242,0.4)]">
                    Mot de passe oublié ? · bientôt
                  </span>
                </div>
                <div className="relative">
                  <Icone d="M6 11h12v9H6v-9Zm2 0V8a4 4 0 0 1 8 0v3" />
                  <input
                    id="auth-mdp"
                    type={voir ? "text" : "password"}
                    name="mot_de_passe"
                    placeholder="Ton mot de passe"
                    required
                    minLength={6}
                    className={`${CHAMP} pr-12`}
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
              </div>
              {etat.erreur && (
                <p role="alert" className="rounded-lg bg-[rgba(255,122,77,0.14)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--corail)]">
                  {etat.erreur}
                </p>
              )}
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#2b8c82] to-[#5fc7b8] px-4 py-3.5 text-[14.5px] font-extrabold text-[#0b2622] shadow-[0_10px_28px_rgba(43,140,130,0.4)] transition-transform hover:-translate-y-0.5"
              >
                {insc ? "Créer mon compte" : "Se connecter"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-[12px] text-[rgba(234,245,242,0.5)]">
              <span className="h-px flex-1 bg-[rgba(234,245,242,0.14)]" />
              ou
              <span className="h-px flex-1 bg-[rgba(234,245,242,0.14)]" />
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {["Google", "Microsoft", "LinkedIn"].map((f, i) => (
                <button
                  key={f}
                  type="button"
                  disabled
                  title="Bientôt disponible"
                  className={`cursor-not-allowed rounded-xl border border-[rgba(234,245,242,0.18)] px-3 py-2.5 text-[12.5px] font-semibold text-[rgba(234,245,242,0.5)] ${i === 2 ? "sm:col-span-2" : ""}`}
                >
                  Continuer avec {f}
                  <span className="ml-1.5 font-mono text-[10px] font-normal">bientôt</span>
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
