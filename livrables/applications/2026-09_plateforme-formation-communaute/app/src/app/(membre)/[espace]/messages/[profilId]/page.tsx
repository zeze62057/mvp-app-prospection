import { notFound, redirect } from "next/navigation";
import { contexteMembre } from "@/lib/contexte-membre";
import { urlsAvatars } from "@/lib/avatars";
import { tempsEcoule } from "@/lib/temps";
import type { MessagePrive } from "@/types/membre";
import { EnTeteMembre } from "@/components/navigation/EnTeteMembre";
import { Avatar } from "@/components/communaute/fil/Avatar";
import { FormulaireMessage } from "@/components/messages/FormulaireMessage";
import { RafraichirEnDirect } from "@/components/navigation/RafraichirEnDirect";

const LIMITE_MESSAGES = 200;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ espace: string; profilId: string }>;
}) {
  const { espace: slug, profilId } = await params;
  // L'identifiant vient de l'URL et entre dans un filtre : on n'accepte qu'un UUID.
  if (!UUID.test(profilId)) notFound();
  const { supabase, espace, userId, estMembre } = await contexteMembre(slug);
  if (profilId === userId) redirect(`/${espace.slug}/messages`);
  if (!estMembre) redirect(`/${espace.slug}/communaute`);

  // Le profil de l'interlocuteur n'est lisible que s'il partage un espace avec nous.
  const { data: autre } = await supabase
    .from("profils")
    .select("id, pseudo, avatar_path")
    .eq("id", profilId)
    .maybeSingle();
  if (!autre) notFound();

  const { data: autreMembre } = await supabase.rpc("est_membre_espace", {
    p_profil: profilId,
    p_espace: espace.id,
  });

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("espace_id", espace.id)
    .or(
      `and(expediteur_id.eq.${userId},destinataire_id.eq.${profilId}),and(expediteur_id.eq.${profilId},destinataire_id.eq.${userId})`
    )
    .order("created_at", { ascending: false })
    .limit(LIMITE_MESSAGES)
    .returns<MessagePrive[]>();
  const messages = [...(data ?? [])].reverse();

  // Ouvrir la conversation marque comme lus les messages recus et leur notification.
  if (messages.some((m) => m.destinataire_id === userId && !m.lu_at)) {
    await supabase
      .from("messages")
      .update({ lu_at: new Date().toISOString() })
      .eq("espace_id", espace.id)
      .eq("expediteur_id", profilId)
      .eq("destinataire_id", userId)
      .is("lu_at", null);
  }
  await supabase
    .from("notifications")
    .update({ lu: true })
    .eq("type", "message")
    .eq("acteur_id", profilId)
    .eq("espace_id", espace.id)
    .eq("lu", false);

  const photos = await urlsAvatars([autre as { id: string; avatar_path: string | null }]);

  return (
    <div className="min-h-screen bg-[var(--fond)] text-[var(--texte)]">
      <EnTeteMembre
        espaceSlug={espace.slug}
        espaceNom={espace.nom}
        titre={autre.pseudo}
        retour={{ href: `/${espace.slug}/messages`, libelle: "← Messages" }}
      />
      <RafraichirEnDirect table="messages" filtre={`destinataire_id=eq.${userId}`} nom={`conversation-${userId}-${profilId}`} />
      <div className="mx-auto flex max-w-xl flex-col gap-4 p-5 sm:p-7">
        <div className="flex items-center gap-3">
          <Avatar id={autre.id} pseudo={autre.pseudo} taille={44} urlPhoto={photos.get(autre.id) ?? null} />
          <div>
            <h1 className="font-display text-[18px] font-extrabold">{autre.pseudo}</h1>
            <p className="font-mono text-[10.5px] text-[var(--texte-mute)]">
              Conversation privée : visible de vous deux seulement
            </p>
          </div>
        </div>

        <ul className="flex flex-col gap-2">
          {messages.map((m) => {
            const moi = m.expediteur_id === userId;
            return (
              <li key={m.id} className={`flex ${moi ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${
                    moi
                      ? "rounded-br-md bg-[var(--encre)] text-[var(--sur-encre)]"
                      : "rounded-bl-md border border-[var(--ligne)] bg-[var(--fond-carte)]"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-[13.5px] leading-[1.5]">{m.contenu}</p>
                  <p className={`mt-1 font-mono text-[9.5px] ${moi ? "text-[var(--sur-encre-mute)]" : "text-[var(--texte-mute)]"}`}>
                    {tempsEcoule(m.created_at)}
                    {moi && m.lu_at ? " · lu" : ""}
                  </p>
                </div>
              </li>
            );
          })}
          {messages.length === 0 && (
            <p className="rounded-[14px] border border-dashed border-[var(--ligne)] p-6 text-center text-sm text-[var(--texte-mute)]">
              Aucun message pour l&apos;instant. Écris le premier.
            </p>
          )}
        </ul>

        {autreMembre === true ? (
          <FormulaireMessage espaceSlug={espace.slug} destinataireId={profilId} />
        ) : (
          <p className="rounded-lg border border-[var(--ligne)] p-3 text-[12.5px] text-[var(--texte-mute)]">
            {autre.pseudo} n&apos;est pas membre de {espace.nom} : tu ne peux pas lui écrire ici.
          </p>
        )}
      </div>
    </div>
  );
}
