import { contexteMembre } from "@/lib/contexte-membre";
import { urlsAvatars } from "@/lib/avatars";
import { tempsEcoule } from "@/lib/temps";
import type { NotificationMembre } from "@/types/membre";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { ouvrirNotification, toutesLues } from "./actions";

const TEXTE: Record<NotificationMembre["type"], string> = {
  like: "a aimé ton post",
  commentaire: "a commenté ton post",
  message: "t'a envoyé un message",
};

export default async function NotificationsPage({ params }: { params: Promise<{ espace: string }> }) {
  const { espace: slug } = await params;
  const { supabase, espace } = await contexteMembre(slug);

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("espace_id", espace.id)
    .order("created_at", { ascending: false })
    .limit(50)
    .returns<NotificationMembre[]>();
  const notifications = data ?? [];

  const acteurIds = [...new Set(notifications.map((n) => n.acteur_id))];
  const postIds = [...new Set(notifications.map((n) => n.post_id).filter((id): id is string => !!id))];
  const [{ data: profils }, { data: posts }] = await Promise.all([
    acteurIds.length
      ? supabase.from("profils").select("id, pseudo, avatar_path").in("id", acteurIds)
      : Promise.resolve({ data: [] as { id: string; pseudo: string; avatar_path: string | null }[] }),
    postIds.length
      ? supabase.from("posts").select("id, titre, contenu").in("id", postIds)
      : Promise.resolve({ data: [] as { id: string; titre: string | null; contenu: string }[] }),
  ]);
  const photos = await urlsAvatars((profils ?? []) as { id: string; avatar_path: string | null }[]);
  const pseudos = new Map((profils ?? []).map((p) => [p.id, p.pseudo]));
  const extraits = new Map(
    (posts ?? []).map((p) => [p.id, (p.titre || p.contenu).slice(0, 70) + ((p.titre || p.contenu).length > 70 ? "…" : "")])
  );
  const nbNonLues = notifications.filter((n) => !n.lu).length;

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <EnTeteMembre
        espaceSlug={espace.slug}
        espaceNom={espace.nom}
        titre="Notifications"
        retour={{ href: `/${espace.slug}/communaute`, libelle: "← Retour au fil" }}
      />
      <div className="mx-auto max-w-xl p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-[23px] font-extrabold tracking-tight">Notifications</h1>
          {nbNonLues > 0 && (
            <form action={toutesLues.bind(null, espace.slug, espace.id)}>
              <button type="submit" className="text-[12.5px] font-bold text-[var(--sarcelle)] underline">
                Tout marquer comme lu
              </button>
            </form>
          )}
        </div>

        <ul className="flex flex-col gap-2">
          {notifications.map((n) => {
            const pseudo = pseudos.get(n.acteur_id) ?? "Un membre";
            const extrait = n.post_id ? extraits.get(n.post_id) : null;
            return (
              <li key={n.id}>
                <form action={ouvrirNotification.bind(null, espace.slug, n.id)}>
                  <button
                    type="submit"
                    className={`flex w-full items-start gap-3 rounded-[14px] border p-4 text-left ${
                      n.lu
                        ? "border-[var(--ligne)] bg-[var(--fond-carte)]"
                        : "border-[rgba(43,140,130,0.4)] bg-[rgba(43,140,130,0.07)]"
                    }`}
                  >
                    <Avatar id={n.acteur_id} pseudo={pseudo} taille={36} urlPhoto={photos.get(n.acteur_id) ?? null} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px]">
                        <b>{pseudo}</b> {TEXTE[n.type]}
                      </span>
                      {extrait && (
                        <span className="mt-0.5 block truncate text-[12px] text-[var(--texte-mute)]">« {extrait} »</span>
                      )}
                      <span className="mt-1 block font-mono text-[10.5px] text-[var(--texte-mute)]">
                        {tempsEcoule(n.created_at)}
                      </span>
                    </span>
                    {!n.lu && <span aria-label="Non lue" className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[var(--corail)]" />}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
        {notifications.length === 0 && (
          <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
            Aucune notification pour l&apos;instant. Tu en recevras quand quelqu&apos;un aimera ou commentera tes posts,
            ou t&apos;écrira.
          </p>
        )}
      </div>
    </div>
  );
}
