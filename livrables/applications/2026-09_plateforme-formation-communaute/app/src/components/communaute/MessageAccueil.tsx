import { createClient } from "@/lib/supabase/server";

// Message d'accueil et regles d'un espace, redige par l'admin (voir
// CADRAGE.md section 9 et migration 0024). Lu avec le client de l'utilisateur :
// la policy de messages_accueil reserve la lecture aux membres de l'espace, un
// visiteur ou un non-membre n'obtient rien et le composant n'affiche rien.
export async function MessageAccueil({ espaceId }: { espaceId: string }) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages_accueil")
    .select("texte")
    .eq("espace_id", espaceId)
    .maybeSingle();

  if (!data?.texte) return null;

  return (
    <div className="mb-[18px] rounded-[14px] border border-[var(--ligne)] bg-[var(--fond-carte)] px-6 py-5">
      <p className="font-mono text-[10px] uppercase tracking-wide text-[var(--sarcelle)]">
        bienvenue et regles
      </p>
      <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed">{data.texte}</p>
    </div>
  );
}
