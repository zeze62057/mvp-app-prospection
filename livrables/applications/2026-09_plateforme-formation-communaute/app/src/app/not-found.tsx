import Link from "next/link";

// Page introuvable globale, dans la charte (remplace la 404 generique de Next).
export default function Introuvable() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--fond)] px-6 text-center">
      <h1 className="font-display text-2xl font-extrabold text-[var(--encre)]">
        Page introuvable
      </h1>
      <p className="max-w-md text-sm text-[var(--texte-mute)]">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[var(--sarcelle)] px-4 py-2 text-xs font-bold text-white"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
