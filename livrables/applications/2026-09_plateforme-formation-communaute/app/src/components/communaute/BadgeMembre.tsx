import { niveauDepuisPoints } from "@/types/membre";

// Badge d'un membre : Expert (statut visible de tous les membres de l'espace), sinon
// Admin, sinon son niveau. Utilise dans le fil, l'annuaire et le profil.
export function BadgeMembre({
  estExpert,
  role,
  points,
}: {
  estExpert: boolean;
  role: "membre" | "admin";
  points: number;
}) {
  if (estExpert) {
    return (
      <span className="rounded-[5px] bg-[var(--corail)] px-1.5 py-px font-mono text-[9.5px] font-bold text-[var(--encre)]">
        ★ Expert
      </span>
    );
  }
  return (
    <span className="rounded-[5px] bg-[rgba(43,140,130,0.1)] px-1.5 py-px font-mono text-[9.5px] text-[var(--sarcelle)]">
      {role === "admin" ? "Admin" : niveauDepuisPoints(points)}
    </span>
  );
}
