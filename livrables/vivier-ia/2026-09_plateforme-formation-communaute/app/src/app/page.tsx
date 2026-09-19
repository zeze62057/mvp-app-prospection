import { redirect } from "next/navigation";

// Racine du site : redirige vers l'espace par defaut. A revoir si un jour un
// vrai selecteur d'espaces (Vivier IA / Batisseur Pro) est necessaire a "/".
export default function RootPage() {
  redirect("/vivier-ia");
}
