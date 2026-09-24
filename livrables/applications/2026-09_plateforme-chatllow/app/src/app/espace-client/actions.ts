"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Nouvelle conversation : archive le fil du client connecte. Les messages restent en base et comptent
// toujours dans la limite quotidienne (un client ne peut pas la remettre a zero en effacant son fil).
export async function nouvelleConversation() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;
  const { data: client } = await supabase.from("chatllow_clients").select("profil_id").maybeSingle();
  if (!client) return;

  await createAdminClient().from("chatllow_messages").update({ archive: true }).eq("client_id", client.profil_id).eq("archive", false);
  revalidatePath("/espace-client");
}
