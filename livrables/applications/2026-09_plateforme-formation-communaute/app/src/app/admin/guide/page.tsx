import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BarreHautAdmin } from "@/components/admin/BarreHautAdmin";

// Guide de l'espace admin : une entree par section reelle du menu, avec ce qu'elle permet de faire
// et ce qu'elle ne fait volontairement pas. A mettre a jour quand une section change de role.
const SECTIONS: { titre: string; href: string; texte: string }[] = [
  {
    titre: "Tableau de bord",
    href: "/admin",
    texte:
      "Vue d'ensemble : élèves, formations, cours publiés, revenus, courbe des demandes d'adhésion, répartition par formation, derniers inscrits et paiements. Le sélecteur de période change les chiffres et la courbe. La cloche compte ce qui attend ton action.",
  },
  {
    titre: "Élèves",
    href: "/admin/eleves",
    texte:
      "Tous les membres avec leur email, leurs espaces (gratuit, en attente, payant, Expert), leur niveau, leur avancement et leur dernière activité. Recherche et filtres. Lecture seule.",
  },
  {
    titre: "Formateurs",
    href: "/admin/formateurs",
    texte: "Les Experts : membres payants approuvés comme Expert d'un espace. Les candidatures se traitent dans le tableau de bord.",
  },
  {
    titre: "Administrateurs",
    href: "/admin/administrateurs",
    texte:
      "Les comptes qui ont les droits admin, avec leur dernière connexion. Lecture seule : ce rôle se donne uniquement depuis la base de données, jamais depuis l'interface.",
  },
  {
    titre: "Inscriptions, candidatures et accès manuel",
    href: "/admin#inscriptions",
    texte:
      "Approuver ou refuser les demandes d'accès à la communauté gratuite (avec les réponses aux questions d'adhésion), approuver les candidatures Expert, et accorder à la main un accès payant en filet de sécurité.",
  },
  {
    titre: "Catalogue, cours, masterclass, RDV, ressources",
    href: "/admin#catalogue-formations",
    texte:
      "Créer une formation, enregistrer la vidéo d'une section, planifier des masterclass et des créneaux d'appel découverte, ajouter des ressources réservées aux élèves payants.",
  },
  {
    titre: "Évaluations, badges, niveaux",
    href: "/admin#devoirs",
    texte:
      "Créer des devoirs, noter les remises sur 20, attribuer des badges à la main, régler les niveaux (points requis, masterclass réservée à un niveau).",
  },
  {
    titre: "Modération",
    href: "/admin#signalements",
    texte:
      "Les signalements ouverts. Pour un message privé, tu ne vois que l'extrait copié au moment du signalement, jamais la conversation, et tu ne peux pas le supprimer d'ici.",
  },
  {
    titre: "Paiements",
    href: "/admin/paiements",
    texte:
      "Tous les paiements avec leur statut et leur référence Chariow. Lecture seule : seul le webhook appelé par n8n confirme un paiement, après vérification chez Chariow.",
  },
  {
    titre: "Messages",
    href: "/admin/messages",
    texte:
      "Chiffres de la messagerie privée uniquement (messages, conversations, part de lus). Aucun contenu et aucun nom : une conversation n'est lisible que par ses deux participants.",
  },
  {
    titre: "Notifications",
    href: "/admin/notifications",
    texte: "La liste de tout ce qui attend une action de ta part, avec un lien direct vers l'endroit où la traiter.",
  },
  {
    titre: "Rapports",
    href: "/admin/rapports",
    texte:
      "Inscriptions, accès payants, revenus, conversion, activité et avancement sur une période, comparés à la période précédente quand elle a des données.",
  },
  {
    titre: "Paramètres et personnalisation",
    href: "/admin#parametres-generaux",
    texte:
      "Réglages de chaque communauté (période d'activité, compteur public, message d'accueil), bannière, page À propos, catégories du fil, questions d'adhésion.",
  },
];

export default async function GuidePage() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/vivier-ia/communaute");

  const { data: profil } = await supabase
    .from("profils")
    .select("role, pseudo")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (profil?.role !== "admin") {
    return (
      <main className="p-16">
        <p className="text-sm text-[var(--texte-mute)]">Cette page est reservee aux admins.</p>
      </main>
    );
  }

  return (
    <main className="min-w-0 flex-1 p-4 md:p-16">
      <BarreHautAdmin pseudo={profil?.pseudo ?? ""} />

      <Link href="/admin" className="mb-2 block text-[12px] font-bold text-[var(--sarcelle)] md:hidden">
        ← Tableau de bord
      </Link>
      <h1 className="font-display text-[26px] font-semibold">Guide de l&apos;administration</h1>
      <p className="mt-1 max-w-2xl text-[13px] text-[var(--texte-mute)]">
        À quoi sert chaque section du menu, et ce qu&apos;elle ne fait volontairement pas.
      </p>

      <ul className="mt-6 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
        {SECTIONS.map((s) => (
          <li key={s.titre} className="rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5">
            <div className="font-display text-[14px] font-bold">{s.titre}</div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">{s.texte}</p>
            <Link href={s.href} className="mt-3 inline-block text-[12px] font-bold text-[var(--sarcelle)]">
              Ouvrir →
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
