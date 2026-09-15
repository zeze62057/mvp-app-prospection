import type { Espace } from "@/types/espace";
import { createClient } from "@/lib/supabase/server";

export async function getEspaceParSlug(slug: string): Promise<Espace | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("espaces")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
}
