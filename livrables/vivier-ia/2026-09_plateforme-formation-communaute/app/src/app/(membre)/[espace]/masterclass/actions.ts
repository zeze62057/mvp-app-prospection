"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sInscrire(espaceSlug: string, masterclassId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase
    .from("inscriptions_masterclass")
    .insert({ masterclass_id: masterclassId, profil_id: userData.user.id });

  revalidatePath(`/${espaceSlug}/masterclass`);
}

export async function seDesinscrire(espaceSlug: string, masterclassId: string) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return;

  await supabase
    .from("inscriptions_masterclass")
    .delete()
    .eq("masterclass_id", masterclassId)
    .eq("profil_id", userData.user.id);

  revalidatePath(`/${espaceSlug}/masterclass`);
}
