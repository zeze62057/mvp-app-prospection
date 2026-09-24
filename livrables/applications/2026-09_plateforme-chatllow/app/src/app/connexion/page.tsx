import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MarqueChatllow } from "@/components/MarqueChatllow";
import { FormulaireConnexion } from "./FormulaireConnexion";

export const metadata = { title: "Connexion — Espace client Chatllow" };

const POINTS = [
  { titre: "Le suivi de vos projets", texte: "Où en est chaque mission, étape par étape." },
  { titre: "Vos livrables, en lieu sûr", texte: "Stratégies, analyses et documents, accessibles à vous seul." },
  { titre: "Un interlocuteur identifié", texte: "Le fondateur du cabinet, joignable en un clic." },
];

export default async function ConnexionPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/espace-client");

  return (
    <div className="grid min-h-screen grid-cols-1 bg-[#0d0f16] text-white lg:grid-cols-[1.1fr_1fr]">
      <section
        className="relative flex flex-col justify-between overflow-hidden px-6 py-8 sm:px-14 sm:py-12"
        style={{
          background:
            "radial-gradient(circle at 15% 10%, oklch(62% 0.19 250 / 0.35), transparent 45%), radial-gradient(circle at 90% 95%, oklch(62% 0.19 290 / 0.25), transparent 45%), linear-gradient(170deg, #1a1f33, #0d0f16)",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <MarqueChatllow taille={30} sombre />
          <span className="font-[family-name:var(--font-display)] text-[19px] font-semibold">Chatllow</span>
        </Link>

        <div className="my-12 lg:my-0">
          <h1 className="font-[family-name:var(--font-display)] max-w-md text-[36px] font-semibold leading-[1.08] tracking-tight sm:text-[50px]">
            Votre espace <span className="accent-italic text-[1.1em]">client</span>.
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[rgba(255,255,255,0.65)]">
            Un accès sécurisé, réservé aux clients du cabinet, pour suivre vos missions et retrouver vos livrables.
          </p>
          <ul className="mt-9 flex max-w-sm flex-col gap-5">
            {POINTS.map((p) => (
              <li key={p.titre} className="flex items-start gap-3.5">
                <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[var(--indigo)] text-[12px] font-bold text-[var(--indigo)]">
                  ✓
                </span>
                <div>
                  <div className="text-[14px] font-semibold">{p.titre}</div>
                  <div className="text-[12.5px] text-[rgba(255,255,255,0.6)]">{p.texte}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-[family-name:var(--font-mono)] text-[11px] text-[rgba(255,255,255,0.45)]">
          Vos échanges et documents restent confidentiels.
        </p>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-10">
        <div className="w-full max-w-[420px] rounded-3xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <MarqueChatllow taille={28} sombre />
            <span className="font-[family-name:var(--font-display)] text-[20px] font-semibold">Chatllow</span>
          </div>
          <h2 className="font-[family-name:var(--font-display)] mt-7 text-[24px] font-semibold">Bon retour</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[rgba(255,255,255,0.6)]">
            Connectez-vous pour accéder à votre espace.
          </p>
          <FormulaireConnexion />
          <p className="mt-7 text-center text-[12.5px] leading-relaxed text-[rgba(255,255,255,0.55)]">
            L&apos;accès est ouvert par le cabinet à ses clients. Pas encore d&apos;accès ?{" "}
            <Link href="/rdv" className="font-semibold text-[var(--indigo)]">
              Prendre rendez-vous →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
