import Link from "next/link";
import { getContexteAdmin } from "@/lib/admin-contexte";
import { RechercheAdmin } from "./RechercheAdmin";
import { AvatarAdmin } from "./AvatarAdmin";

// Barre du haut de toutes les pages admin : recherche, cloche des elements en attente (le meme
// nombre que le badge du menu) et puce utilisateur avec un petit menu. Composant serveur : le
// contexte vient de `getContexteAdmin`, la recherche seule est un composant client.
export async function BarreHautAdmin() {
  const moi = await getContexteAdmin();
  if (!moi) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <RechercheAdmin />

      <Link
        href="/admin/notifications"
        aria-label={`${moi.nbAttente} élément${moi.nbAttente !== 1 ? "s" : ""} en attente`}
        title={moi.nbAttente > 0 ? `${moi.nbAttente} en attente de ton action` : "Rien en attente"}
        className="relative rounded-full border border-[var(--ligne)] bg-[var(--fond-carte)] px-3 py-2 text-[14px]"
      >
        🔔
        {moi.nbAttente > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-[var(--corail)] px-1.5 font-mono text-[10px] font-bold text-[var(--encre)]">
            {moi.nbAttente}
          </span>
        )}
      </Link>

      <details className="relative">
        <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-full border border-[var(--ligne)] bg-[var(--fond-carte)] py-1 pl-1 pr-3 [&::-webkit-details-marker]:hidden">
          <AvatarAdmin id={moi.id} pseudo={moi.pseudo} url={moi.avatarUrl} />
          <span className="leading-tight">
            <span className="block text-[12.5px] font-bold">{moi.pseudo || "Admin"}</span>
            <span className="block font-mono text-[10px] text-[var(--texte-mute)]">Administrateur</span>
          </span>
          <span aria-hidden className="text-[10px] text-[var(--texte-mute)]">
            ▾
          </span>
        </summary>
        <div className="absolute right-0 z-10 mt-2 flex w-52 flex-col rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-1.5 text-[12.5px] font-bold shadow-lg">
          <Link href="/admin#parametres-generaux" className="rounded-lg px-3 py-2 hover:bg-[var(--fond)]">
            Paramètres généraux
          </Link>
          <Link href="/admin/guide" className="rounded-lg px-3 py-2 hover:bg-[var(--fond)]">
            Guide de l&apos;admin
          </Link>
          <Link href="/vivier-ia/communaute" className="rounded-lg px-3 py-2 hover:bg-[var(--fond)]">
            Voir la communauté
          </Link>
        </div>
      </details>
    </div>
  );
}
