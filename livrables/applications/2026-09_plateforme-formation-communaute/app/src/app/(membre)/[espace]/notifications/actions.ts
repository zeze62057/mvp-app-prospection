"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Ouvre une notification : la marque lue puis renvoie vers son contenu. Le lien est
// reconstruit cote serveur a partir du type de la notification, jamais recu tel quel.
export async function ouvrirNotification(espaceSlug: string, notificationId: string) {
  const supabase = await createClient();
  const { data: notif } = await supabase
    .from("notifications")
    .select("id, type, post_id, acteur_id")
    .eq("id", notificationId)
    .maybeSingle();
  if (!notif) redirect(`/${espaceSlug}/notifications`);

  await supabase.from("notifications").update({ lu: true }).eq("id", notif.id);
  revalidatePath(`/${espaceSlug}`, "layout");

  if (notif.type === "message") redirect(`/${espaceSlug}/messages/${notif.acteur_id}`);
  // Une demande d'acces se traite dans l'admin (la page refuse un non-admin) ; une demande acceptee
  // ramene au fil de la communaute.
  if (notif.type === "demande_adhesion") redirect("/admin");
  if (notif.type === "adhesion_approuvee") redirect(`/${espaceSlug}/communaute`);
  if (notif.post_id) redirect(`/${espaceSlug}/post/${notif.post_id}`);
  redirect(`/${espaceSlug}/notifications`);
}

export async function toutesLues(espaceSlug: string, espaceId: string) {
  const supabase = await createClient();
  await supabase.from("notifications").update({ lu: true }).eq("espace_id", espaceId).eq("lu", false);
  revalidatePath(`/${espaceSlug}`, "layout");
}
