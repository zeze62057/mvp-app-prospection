import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Recoit la confirmation de paiement envoyee par n8n (voir CADRAGE.md
// section 6). n8n capte l'evenement Chariow "successful.sale", verifie sa
// signature, puis appelle cette route pour activer le compte de l'eleve.
// Cette route ne parle jamais directement a l'API Chariow.

type CorpsWebhook = {
  paiement_id: string;
  statut: "confirme" | "echoue";
  reference_chariow?: string;
};

export async function POST(request: Request) {
  const secretRecu = request.headers.get("x-webhook-secret");
  if (!process.env.WEBHOOK_PAIEMENT_SECRET || secretRecu !== process.env.WEBHOOK_PAIEMENT_SECRET) {
    return NextResponse.json({ erreur: "Non autorise" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as CorpsWebhook | null;
  if (!body?.paiement_id || !body.statut) {
    return NextResponse.json({ erreur: "Corps invalide" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: paiement, error: erreurLecture } = await admin
    .from("paiements")
    .select("*")
    .eq("id", body.paiement_id)
    .maybeSingle();

  if (erreurLecture || !paiement) {
    return NextResponse.json({ erreur: "Paiement introuvable" }, { status: 404 });
  }

  await admin
    .from("paiements")
    .update({
      statut: body.statut,
      reference_chariow: body.reference_chariow ?? null,
      confirme_at: body.statut === "confirme" ? new Date().toISOString() : null,
    })
    .eq("id", body.paiement_id);

  if (body.statut === "confirme") {
    await admin
      .from("acces_payant")
      .upsert(
        { profil_id: paiement.profil_id, espace_id: paiement.espace_id, actif: true },
        { onConflict: "profil_id,espace_id" }
      );
  }

  return NextResponse.json({ recu: true }, { status: 200 });
}
