"use client";

// Menu lateral de l'espace admin, ancre sur les sections reelles de la meme
// page (pas de sous-pages separees). Trois etats par entree, selon la regle du
// cadrage : active (la section existe), desactivee "Bientot disponible" (une
// vraie donnee existe mais aucune page dediee), ou absente du menu si rien de
// reel n'y correspond (Formateurs, Notifications admin : aucun concept dans
// la plateforme, ni ignorees discretement ni inventees).
type Entree = { libelle: string; href?: string };

export const GROUPES: { titre: string; entrees: Entree[] }[] = [
  {
    titre: "Utilisateurs",
    entrees: [
      { libelle: "Élèves" },
      { libelle: "Inscriptions", href: "#inscriptions" },
      { libelle: "Candidatures Expert", href: "#candidatures-expert" },
      { libelle: "Accès payant manuel", href: "#acces-payant-manuel" },
      { libelle: "Administrateurs" },
    ],
  },
  {
    titre: "Formations",
    entrees: [
      { libelle: "Catalogue des formations", href: "#catalogue-formations" },
      { libelle: "Cours", href: "#cours" },
      { libelle: "Masterclass", href: "#masterclass" },
      { libelle: "RDV", href: "#rdv" },
      { libelle: "Ressources", href: "#ressources" },
      { libelle: "Évaluations (devoirs)", href: "#devoirs" },
      { libelle: "Badges", href: "#badges" },
      { libelle: "Niveaux", href: "#niveaux" },
      { libelle: "Statistiques par formation", href: "#statistiques-communaute" },
    ],
  },
  {
    titre: "Gestion",
    entrees: [
      { libelle: "Catégories", href: "#categories" },
      { libelle: "Questions d'adhésion", href: "#questions-adhesion" },
      { libelle: "Modération", href: "#signalements" },
      { libelle: "Contenu", href: "#contenu" },
      { libelle: "Paiements" },
      { libelle: "Rapports" },
      { libelle: "Messages" },
    ],
  },
  {
    titre: "Paramètres",
    entrees: [
      { libelle: "Paramètres généraux", href: "#parametres-generaux" },
      { libelle: "Personnalisation", href: "#personnalisation" },
    ],
  },
];

export function MenuAdmin() {
  const classeLien =
    "block rounded-lg px-3 py-1.5 text-[12.5px] font-bold text-[var(--sur-encre-mute)] hover:bg-[rgba(255,255,255,0.08)] hover:text-[var(--sur-encre)]";

  return (
    <nav
      aria-label="Menu admin"
      className="sticky top-0 hidden h-screen w-60 flex-shrink-0 flex-col overflow-y-auto bg-[var(--encre)] p-4 text-[var(--sur-encre)] md:flex"
    >
      <a href="#tableau-de-bord" className="mb-4 block rounded-lg bg-[var(--sarcelle)] px-3 py-2 text-[13px] font-bold text-[var(--sur-encre)]">
        Tableau de bord
      </a>
      {GROUPES.map((groupe) => (
        <div key={groupe.titre} className="mb-4">
          <div className="mb-1.5 px-3 font-mono text-[10px] font-bold uppercase tracking-wide text-[var(--sur-encre-mute)] opacity-70">
            {groupe.titre}
          </div>
          <div className="flex flex-col gap-0.5">
            {groupe.entrees.map((e) =>
              e.href ? (
                <a key={e.libelle} href={e.href} className={classeLien}>
                  {e.libelle}
                </a>
              ) : (
                <span
                  key={e.libelle}
                  title="Bientôt disponible"
                  className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-1.5 text-[12.5px] font-bold text-[var(--sur-encre-mute)] opacity-40"
                >
                  {e.libelle}
                  <span className="font-mono text-[8.5px]">bientôt</span>
                </span>
              )
            )}
          </div>
        </div>
      ))}
    </nav>
  );
}
