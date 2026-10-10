"use client";

// Page d'erreur globale : sans elle, une erreur serveur affichait la page
// generique de Next.js, hors charte et en anglais.
export default function ErreurGlobale({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--fond)] px-6 text-center">
      <h1 className="font-display text-2xl font-extrabold text-[var(--encre)]">
        Une erreur est survenue
      </h1>
      <p className="max-w-md text-sm text-[var(--texte-mute)]">
        Quelque chose n&apos;a pas fonctionné. Réessaie, et si le problème
        persiste, contacte le formateur.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-lg bg-[var(--sarcelle)] px-4 py-2 text-xs font-bold text-white"
      >
        Réessayer
      </button>
    </main>
  );
}
