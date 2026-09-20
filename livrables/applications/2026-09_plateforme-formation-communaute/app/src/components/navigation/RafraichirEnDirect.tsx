"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clientTempsReel } from "@/lib/supabase/client";

// Rafraichit la page des qu'une ligne est inseree dans une table (Supabase Realtime,
// migration 0031). Le RLS s'applique aux evenements : le membre ne recoit que ceux des
// lignes qu'il a le droit de lire. Sans rien a afficher, le composant ne rend rien.
export function RafraichirEnDirect({
  table,
  filtre,
  nom,
}: {
  table: string;
  filtre: string; // ex : "destinataire_id=eq.<uuid>"
  nom: string; // nom unique du canal
}) {
  const router = useRouter();

  useEffect(() => {
    let actif = true;
    let fermer = () => {};
    // clientTempsReel donne d'abord le jeton du membre a la connexion temps reel : sans lui,
    // aucun evenement n'arrive (le RLS traite la connexion comme anonyme).
    void clientTempsReel().then((supabase) => {
      if (!actif) return;
      const canal = supabase
        .channel(nom)
        .on("postgres_changes", { event: "INSERT", schema: "public", table, filter: filtre }, () => {
          router.refresh();
        })
        .subscribe();
      fermer = () => void supabase.removeChannel(canal);
    });
    return () => {
      actif = false;
      fermer();
    };
  }, [table, filtre, nom, router]);

  return null;
}
