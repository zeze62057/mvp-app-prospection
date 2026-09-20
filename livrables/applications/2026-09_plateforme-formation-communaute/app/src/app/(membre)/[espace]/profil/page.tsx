import { contexteMembre } from "@/lib/contexte-membre";
import { urlsAvatars } from "@/lib/avatars";
import { niveauDepuisPoints } from "@/types/membre";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { FormulaireProfil } from "@/components/profil/FormulaireProfil";
import { FormulaireInfosProfil } from "@/components/profil/FormulaireInfosProfil";
import { deconnexion } from "../communaute/actions";

export default async function ProfilPage({ params }: { params: Promise<{ espace: string }> }) {
  const { espace: slug } = await params;
  const { espace, userId, moi } = await contexteMembre(slug);

  const photos = await urlsAvatars(moi ? [moi as { id: string; avatar_path: string | null }] : []);

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <EnTeteMembre
        espaceSlug={espace.slug}
        espaceNom={espace.nom}
        titre="Mon profil"
        retour={{ href: `/${espace.slug}/communaute`, libelle: "← Retour au fil" }}
      />
      <div className="mx-auto flex max-w-xl flex-col gap-5 p-5 sm:p-7">
        <div>
          <h1 className="font-display text-[23px] font-extrabold tracking-tight">{moi?.pseudo ?? "Mon profil"}</h1>
          <p className="mt-1 font-mono text-[12px] text-[var(--texte-mute)]">
            {moi?.role === "admin" ? "Admin" : niveauDepuisPoints(moi?.points ?? 0)} · {moi?.points ?? 0} point
            {(moi?.points ?? 0) > 1 ? "s" : ""}
          </p>
        </div>

        <FormulaireProfil
          espaceSlug={espace.slug}
          userId={userId}
          pseudo={moi?.pseudo ?? ""}
          avatarUrl={photos.get(userId) ?? null}
        />

        <FormulaireInfosProfil
          espaceSlug={espace.slug}
          bio={moi?.bio ?? ""}
          ville={moi?.ville ?? ""}
          lien={moi?.lien ?? ""}
        />

        <form action={deconnexion.bind(null, espace.slug)}>
          <button type="submit" className="shrink-0 whitespace-nowrap text-xs text-[var(--texte-mute)] underline">
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
