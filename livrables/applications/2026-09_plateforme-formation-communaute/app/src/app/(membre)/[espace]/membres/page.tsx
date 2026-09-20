import Link from "next/link";
import { contexteMembre } from "@/lib/contexte-membre";
import { lireAnnuaire } from "@/lib/annuaire";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { AnnuaireMembres } from "@/components/membres/AnnuaireMembres";

export default async function MembresPage({ params }: { params: Promise<{ espace: string }> }) {
  const { espace: slug } = await params;
  const { supabase, espace, userId, estMembre } = await contexteMembre(slug);

  const entete = (
    <EnTeteMembre
      espaceSlug={espace.slug}
      espaceNom={espace.nom}
      titre="Membres"
      retour={{ href: `/${espace.slug}/communaute`, libelle: "← Retour au fil" }}
    />
  );

  if (!estMembre) {
    return (
      <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
        {entete}
        <div className="mx-auto max-w-xl p-7 text-center">
          <p className="text-sm text-[var(--texte-mute)]">
            L&apos;annuaire est réservé aux membres de {espace.nom}.
          </p>
          <Link
            href={`/${espace.slug}/communaute`}
            className="mt-4 inline-block font-mono text-[13px] font-bold text-[var(--sarcelle)]"
          >
            Rejoindre la communauté →
          </Link>
        </div>
      </div>
    );
  }

  const initial = await lireAnnuaire(supabase, espace.id);

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      {entete}
      <div className="mx-auto max-w-3xl p-5 sm:p-7">
        <h1 className="font-display mb-4 text-[23px] font-extrabold tracking-tight">Membres</h1>
        <AnnuaireMembres espaceSlug={espace.slug} userId={userId} initial={initial} />
      </div>
    </div>
  );
}
