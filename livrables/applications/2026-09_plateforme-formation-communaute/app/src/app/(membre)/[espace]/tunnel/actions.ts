"use server";

import { createClient } from "@/lib/supabase/server";
import { getEspaceParSlug } from "@/lib/espaces";

type EtatPaiement = { erreur: string | null; checkoutUrl: string | null };

// Cree la trace du paiement puis demande a n8n d'ouvrir une session Chariow.
// n8n est seul a parler a l'API Chariow (voir CADRAGE.md section 6) : ce
// fichier ne connait jamais de cle secrete Chariow, seulement l'URL du
// webhook n8n (une fois ce workflow construit).
export async function initierPaiement(
  _etat: EtatPaiement,
  formData: FormData
): Promise<EtatPaiement> {
  const espaceSlug = String(formData.get("espace_slug") ?? "");
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim();

  if (!prenom || !nom || !telephone) {
    return { erreur: "Prenom, nom et telephone sont requis pour payer.", checkoutUrl: null };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { erreur: "Non connecte.", checkoutUrl: null };

  const espace = await getEspaceParSlug(espaceSlug);
  if (!espace) return { erreur: "Espace introuvable.", checkoutUrl: null };

  // Garde AVANT l'insert : sans webhook n8n configure, on ne cree pas de ligne
  // "en_attente" orpheline (source des paiements fantomes, voir CADRAGE §10).
  const urlWebhookN8n = process.env.N8N_WEBHOOK_CREER_PAIEMENT_URL;
  if (!urlWebhookN8n) {
    return {
      erreur:
        "Le paiement en ligne n'est pas encore disponible. Reessaie plus tard ou contacte le formateur.",
      checkoutUrl: null,
    };
  }

  const { data: paiement, error } = await supabase
    .from("paiements")
    .insert({
      profil_id: userData.user.id,
      espace_id: espace.id,
      montant: espace.prix,
      devise: espace.devise,
    })
    .select()
    .single();

  if (error) {
    console.error("tunnel: echec creation paiement", error);
    return { erreur: "Impossible de preparer le paiement. Reessaie.", checkoutUrl: null };
  }

  try {
    const reponse = await fetch(urlWebhookN8n, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paiement_id: paiement.id,
        profil_id: userData.user.id,
        espace_id: espace.id,
        email: userData.user.email,
        first_name: prenom,
        last_name: nom,
        phone_number: telephone,
        phone_country_code: "GN",
        montant: espace.prix,
        devise: espace.devise,
      }),
    });

    if (!reponse.ok) {
      return { erreur: "Le service de paiement n'a pas repondu correctement.", checkoutUrl: null };
    }

    const { checkout_url } = await reponse.json();
    if (!checkout_url) {
      return { erreur: "Aucun lien de paiement recu.", checkoutUrl: null };
    }

    return { erreur: null, checkoutUrl: checkout_url };
  } catch {
    return { erreur: "Impossible de joindre le service de paiement.", checkoutUrl: null };
  }
}
