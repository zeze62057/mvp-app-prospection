"use client";

import { useRouter } from "next/navigation";

// Selecteur de periode du tableau de bord : un seul menu deroulant qui recharge la page a chaque
// choix, avec les dates reelles de la periode affichees ("Du 25 aout au 24 sept.").
export function SelecteurPeriode({
  periode,
  options,
  dates,
}: {
  periode: string;
  options: { valeur: string; libelle: string }[];
  dates: string;
}) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2.5 rounded-lg border border-[var(--ligne)] bg-[var(--fond-carte)] px-3.5 py-2">
      <span aria-hidden>📅</span>
      <span className="flex flex-col leading-tight">
        <span className="text-[12px] font-bold">{dates}</span>
        <select
          value={periode}
          aria-label="Période"
          onChange={(e) => router.push(`/admin?periode=${e.target.value}`)}
          className="-ml-0.5 bg-transparent font-mono text-[10.5px] text-[var(--texte-mute)] outline-none"
        >
          {options.map((o) => (
            <option key={o.valeur} value={o.valeur}>
              {o.libelle}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
