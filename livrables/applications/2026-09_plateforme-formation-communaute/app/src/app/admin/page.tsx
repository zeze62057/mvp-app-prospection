// Panneau admin : modification des prix par espace, creation d'un nouvel
// espace en libre-service (voir CADRAGE.md section 6 et 7). A proteger par
// une verification de role admin des que l'authentification est branchee.

export default function AdminPage() {
  return (
    <main className="p-16">
      <p className="font-mono text-xs uppercase tracking-wide text-[var(--corail)]">
        administration
      </p>
      <h1 className="font-display mt-4 text-3xl font-semibold">
        Panneau admin
      </h1>
      <p className="mt-8 text-sm text-[var(--texte-mute)]">
        Placeholder — prix modifiables par espace, bouton &quot;creer une
        nouvelle formation&quot;.
      </p>
    </main>
  );
}
