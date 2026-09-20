import Link from "next/link";
import { contexteMembre } from "@/lib/contexte-membre";
import { urlsAvatars } from "@/lib/avatars";
import { tempsEcoule } from "@/lib/temps";
import type { MessagePrive } from "@/types/membre";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { RechercheMembre } from "@/components/messages/RechercheMembre";
import { RafraichirEnDirect } from "@/components/navigation/RafraichirEnDirect";

const LIMITE_MESSAGES = 300;

export default async function MessagesPage({ params }: { params: Promise<{ espace: string }> }) {
  const { espace: slug } = await params;
  const { supabase, espace, userId } = await contexteMembre(slug);

  // Le RLS ne renvoie que les messages dont on est l'expediteur ou le destinataire.
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("espace_id", espace.id)
    .order("created_at", { ascending: false })
    .limit(LIMITE_MESSAGES)
    .returns<MessagePrive[]>();
  const messages = data ?? [];

  // Une conversation par interlocuteur : le dernier message et le nombre de non lus.
  const conversations = new Map<string, { dernier: MessagePrive; nonLus: number }>();
  for (const m of messages) {
    const autre = m.expediteur_id === userId ? m.destinataire_id : m.expediteur_id;
    const c = conversations.get(autre) ?? { dernier: m, nonLus: 0 };
    if (m.destinataire_id === userId && !m.lu_at) c.nonLus += 1;
    conversations.set(autre, c);
  }

  const ids = [...conversations.keys()];
  const { data: profils } = ids.length
    ? await supabase.from("profils").select("id, pseudo, avatar_path").in("id", ids)
    : { data: [] as { id: string; pseudo: string; avatar_path: string | null }[] };
  const photos = await urlsAvatars((profils ?? []) as { id: string; avatar_path: string | null }[]);
  const pseudos = new Map((profils ?? []).map((p) => [p.id, p.pseudo]));

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <EnTeteMembre
        espaceSlug={espace.slug}
        espaceNom={espace.nom}
        titre="Messages"
        retour={{ href: `/${espace.slug}/communaute`, libelle: "← Retour au fil" }}
      />
      <div className="mx-auto max-w-xl p-5 sm:p-7">
        <RafraichirEnDirect table="messages" filtre={`destinataire_id=eq.${userId}`} nom={`liste-messages-${userId}`} />
        <h1 className="font-display mb-4 text-[23px] font-extrabold tracking-tight">Messages</h1>

        <RechercheMembre espaceSlug={espace.slug} />

        <ul className="flex flex-col gap-2">
          {[...conversations.entries()].map(([autreId, c]) => {
            const pseudo = pseudos.get(autreId) ?? "Membre";
            const moi = c.dernier.expediteur_id === userId;
            return (
              <li key={autreId}>
                <Link
                  href={`/${espace.slug}/messages/${autreId}`}
                  className={`flex items-center gap-3 rounded-[14px] border p-4 ${
                    c.nonLus > 0
                      ? "border-[rgba(43,140,130,0.4)] bg-[rgba(43,140,130,0.07)]"
                      : "border-[var(--ligne)] bg-[var(--fond-carte)]"
                  }`}
                >
                  <Avatar id={autreId} pseudo={pseudo} taille={40} urlPhoto={photos.get(autreId) ?? null} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <b className="text-[13.5px]">{pseudo}</b>
                      <span className="font-mono text-[10.5px] text-[var(--texte-mute)]">
                        {tempsEcoule(c.dernier.created_at)}
                      </span>
                    </span>
                    <span className="block truncate text-[12.5px] text-[var(--texte-mute)]">
                      {moi ? "Toi : " : ""}
                      {c.dernier.contenu}
                    </span>
                  </span>
                  {c.nonLus > 0 && (
                    <span className="flex h-5 min-w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--corail)] px-1.5 font-mono text-[10px] font-bold text-[var(--encre)]">
                      {c.nonLus}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        {conversations.size === 0 && (
          <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
            Aucune conversation. Cherche un membre ci-dessus, ou clique sur « ✉ Écrire » sous l&apos;un de ses
            posts. Tes messages ne sont lisibles que par vous deux.
          </p>
        )}
      </div>
    </div>
  );
}
