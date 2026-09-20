import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";
import { construireIcs, type EvenementCalendrier } from "@/lib/calendrier";

// Fichier .ics d'un evenement auquel la personne participe (masterclass inscrite, RDV reserve).
// Tout passe par le client de l'utilisateur : le RLS ne renvoie que ce qu'il peut lire, et on exige
// en plus sa participation, car le lien de rejoindre ne doit pas fuiter vers un simple curieux.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const slug = params.get("espace") ?? "";
  const type = params.get("type");
  const id = params.get("id") ?? "";
  if ((type !== "masterclass" && type !== "rdv") || !UUID.test(id)) {
    return NextResponse.json({ erreur: "Demande invalide." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ erreur: "Non connecté." }, { status: 401 });

  const espace = await getEspaceParSlug(slug);
  if (!espace) return NextResponse.json({ erreur: "Espace introuvable." }, { status: 404 });

  let evenement: EvenementCalendrier | null = null;

  if (type === "masterclass") {
    const { data: m } = await supabase
      .from("masterclasses")
      .select("id, titre, description, date_heure, lien")
      .eq("id", id)
      .eq("espace_id", espace.id)
      .maybeSingle();
    if (m) {
      const { data: inscription } = await supabase
        .from("inscriptions_masterclass")
        .select("id")
        .eq("masterclass_id", id)
        .eq("profil_id", userData.user.id)
        .maybeSingle();
      if (inscription) {
        evenement = {
          id: m.id,
          type: "masterclass",
          titre: m.titre,
          debut: m.date_heure,
          description: m.description ?? "",
          statut: "inscrit",
          lien: m.lien,
          page: `/${espace.slug}/masterclass`,
        };
      }
    }
  } else {
    const { data: c } = await supabase
      .from("creneaux_rdv")
      .select("id, date_heure, lien")
      .eq("id", id)
      .eq("espace_id", espace.id)
      .eq("reserve_par", userData.user.id)
      .maybeSingle();
    if (c) {
      evenement = {
        id: c.id,
        type: "rdv",
        titre: "Appel découverte 1:1",
        debut: c.date_heure,
        description: "",
        statut: "reserve",
        lien: c.lien,
        page: `/${espace.slug}/rdv`,
      };
    }
  }

  // Meme reponse qu'il n'existe pas ou qu'on n'y participe pas : on ne confirme rien.
  if (!evenement) return NextResponse.json({ erreur: "Événement introuvable." }, { status: 404 });

  return new NextResponse(construireIcs(evenement), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${type}-${id.slice(0, 8)}.ics"`,
      "Cache-Control": "private, no-store",
    },
  });
}
