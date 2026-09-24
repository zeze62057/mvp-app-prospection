"use client";

import { useRouter } from "next/navigation";

export const EVENEMENT_MESSAGE = "chatllow:message";

// Bouton qui lance une question dans le chat. Sur la page Chat, il envoie directement a la conversation
// deja affichee ; ailleurs, il ouvre la page Chat avec la question, envoyee une seule fois a l'arrivee.
export function BoutonSujet({
  texte,
  surChat,
  className,
  children,
  titre,
}: {
  texte: string;
  surChat: boolean;
  className?: string;
  children: React.ReactNode;
  titre?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      title={titre}
      className={className}
      onClick={() => {
        if (surChat) window.dispatchEvent(new CustomEvent(EVENEMENT_MESSAGE, { detail: texte }));
        else router.push(`/espace-client?section=chat&sujet=${encodeURIComponent(texte)}`);
      }}
    >
      {children}
    </button>
  );
}
