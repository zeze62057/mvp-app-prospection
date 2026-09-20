import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Nombre de notifications non lues d'un espace, pour le badge de la barre de
// navigation (interrogee toutes les 30 secondes). Le RLS ne renvoie que les
// notifications du membre connecte.
export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ nb: 0 });

  const espaceId = new URL(request.url).searchParams.get("espace");
  let requete = supabase.from("notifications").select("*", { count: "exact", head: true }).eq("lu", false);
  if (espaceId) requete = requete.eq("espace_id", espaceId);

  const { count } = await requete;
  return NextResponse.json({ nb: count ?? 0 });
}
