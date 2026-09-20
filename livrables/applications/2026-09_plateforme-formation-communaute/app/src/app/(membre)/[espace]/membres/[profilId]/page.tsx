import Link from "next/link";
import { notFound } from "next/navigation";
import { contexteMembre } from "@/lib/contexte-membre";
import { lireProfilMembre } from "@/lib/annuaire";
import { chargerPostsFil } from "@/lib/fil";
import { niveauDepuisPoints } from "@/types/membre";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { BadgeMembre } from "@/components/communaute/BadgeMembre";
import { CartePost } from "@/components/communaute/fil/CartePost";

const NB_POSTS_PROFIL = 10;

function depuisQuand(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default async function ProfilMembrePage({
  params,
}: {
  params: Promise<{ espace: string; profilId: string }>;
}) {
  const { espace: slug, profilId } = await params;
  const { supabase, espace, userId, moi, estMembre } = await contexteMembre(slug);

  const entete = (
    <EnTeteMembre
      espaceSlug={espace.slug}
      espaceNom={espace.nom}
      titre="Profil"
      retour={{ href: `/${espace.slug}/membres`, libelle: "← Membres" }}
    />
  );

  if (!estMembre) {
    return (
      <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
        {entete}
        <div className="mx-auto max-w-xl p-7 text-center">
          <p className="text-sm text-[var(--texte-mute)]">
            Les profils sont réservés aux membres de {espace.nom}.
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

  // Aucun profil : identifiant invalide, personne qui n'est pas membre de cet espace.
  const membre = await lireProfilMembre(supabase, espace.id, profilId);
  if (!membre) notFound();

  // Le RLS ne renvoie que les posts que je peux lire (une zone payante reste fermee a un
  // membre gratuit).
  const posts = await chargerPostsFil({
    supabase,
    espaceId: espace.id,
    userId,
    auteurId: membre.id,
    limite: NB_POSTS_PROFIL,
  });

  const cestMoi = membre.id === userId;
  const arrivee = depuisQuand(membre.membreDepuis);

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      {entete}
      <div className="mx-auto max-w-2xl p-5 sm:p-7">
        <section className="mb-6 rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] p-6">
          <div className="flex items-center gap-4">
            <Avatar id={membre.id} pseudo={membre.pseudo} taille={72} urlPhoto={membre.avatarUrl} />
            <div className="min-w-0 flex-1">
              <h1 className="font-display break-words text-[22px] font-extrabold leading-tight tracking-tight">
                {membre.pseudo}
              </h1>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <BadgeMembre estExpert={membre.estExpert} role={membre.role} points={membre.points} />
                {cestMoi && <span className="font-mono text-[10.5px] text-[var(--texte-mute)]">(toi)</span>}
              </div>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--ligne)] pt-4">
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Niveau</dt>
              <dd className="mt-0.5 text-[13.5px] font-bold">
                {membre.role === "admin" ? "Admin" : niveauDepuisPoints(membre.points)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">Points</dt>
              <dd className="mt-0.5 text-[13.5px] font-bold">{membre.points}</dd>
            </div>
            {arrivee && (
              <div className="col-span-2">
                <dt className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--texte-mute)]">
                  Dans {espace.nom} depuis
                </dt>
                <dd className="mt-0.5 text-[13.5px] font-bold">{arrivee}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5">
            {cestMoi ? (
              <Link
                href={`/${espace.slug}/profil`}
                className="inline-block rounded-[9px] border border-[var(--ligne)] px-4 py-2.5 text-[13px] font-bold text-[var(--sarcelle)]"
              >
                Modifier mon profil
              </Link>
            ) : (
              <Link
                href={`/${espace.slug}/messages/${membre.id}`}
                className="inline-block rounded-[9px] bg-[var(--corail)] px-5 py-2.5 text-[13px] font-extrabold text-[var(--encre)]"
              >
                ✉ Écrire à {membre.pseudo}
              </Link>
            )}
          </div>
        </section>

        <h2 className="font-display mb-3 text-[16px] font-bold">
          {cestMoi ? "Mes derniers posts" : `Derniers posts de ${membre.pseudo}`}
        </h2>
        {posts.length === 0 ? (
          <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
            Aucun post visible pour l&apos;instant.
          </p>
        ) : (
          posts.map((item) => (
            <CartePost
              key={item.post.id}
              espaceSlug={espace.slug}
              retour={`/${espace.slug}/membres/${membre.id}`}
              item={item}
              estAdmin={moi?.role === "admin"}
              userId={userId}
            />
          ))
        )}
      </div>
    </div>
  );
}
