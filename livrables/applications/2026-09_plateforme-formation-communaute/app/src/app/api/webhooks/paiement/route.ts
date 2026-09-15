import { NextResponse } from "next/server";

// Recoit la confirmation de paiement Mobile Money envoyee par n8n (voir
// CADRAGE.md section 6). n8n capte le paiement Orange/MTN, verifie qu'il est
// valide, puis appelle cette route pour activer le compte de l'eleve. Cette
// route ne parle jamais directement a l'API Mobile Money, uniquement a n8n.

export async function POST(request: Request) {
  // TODO une fois le modele de donnees pret :
  // 1. Verifier un secret partage avec n8n (header d'authentification)
  // 2. Lire { espaceSlug, email, montant, reference } dans le corps
  // 3. Activer le compte eleve dans Supabase pour cet espace
  // 4. Repondre 200 pour que n8n considere l'activation reussie

  const body = await request.json().catch(() => null);

  return NextResponse.json(
    { recu: true, todo: "activation reelle pas encore branchee", body },
    { status: 200 }
  );
}
