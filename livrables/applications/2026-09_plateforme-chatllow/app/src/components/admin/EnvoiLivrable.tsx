"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { preparerEnvoi, enregistrerLivrable } from "@/app/admin/actions";
import { CATEGORIES_LIVRABLE, EXTENSIONS_AUTORISEES } from "@/lib/admin-constantes";

const CHAMP = "w-full rounded-xl border border-[var(--ligne)] bg-[var(--fond)] px-3.5 py-2.5 text-[13.5px] focus:border-[var(--indigo)] focus:outline-none";

// Envoi d'un document : le serveur valide et donne un lien temporaire, le navigateur envoie le fichier
// directement au stockage prive, puis le serveur verifie sa reception avant d'enregistrer la ligne.
export function EnvoiLivrable({ clientId }: { clientId: string }) {
  const router = useRouter();
  const formulaire = useRef<HTMLFormElement>(null);
  const [etat, setEtat] = useState<"repos" | "envoi">("repos");
  const [erreur, setErreur] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const fichier = fd.get("fichier") as File | null;
    if (!fichier || fichier.size === 0) {
      setErreur("Choisissez un fichier.");
      return;
    }
    setEtat("envoi");
    setErreur(null);
    setOk(false);
    try {
      const prep = await preparerEnvoi(clientId, fichier.name, fichier.size);
      if (prep.erreur || !prep.chemin || !prep.jeton) throw new Error(prep.erreur ?? "Envoi impossible.");
      const stockage = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { persistSession: false },
      });
      const { error: erreurEnvoi } = await stockage.storage.from("chatllow-livrables").uploadToSignedUrl(prep.chemin, prep.jeton, fichier);
      if (erreurEnvoi) throw new Error("Le fichier n'a pas pu être envoyé. Réessayez.");
      const res = await enregistrerLivrable({
        clientId,
        categorie: String(fd.get("categorie") ?? ""),
        titre: String(fd.get("titre") ?? ""),
        description: String(fd.get("description") ?? ""),
        chemin: prep.chemin,
      });
      if (res.erreur) throw new Error(res.erreur);
      formulaire.current?.reset();
      setOk(true);
      router.refresh();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setEtat("repos");
    }
  }

  return (
    <form ref={formulaire} onSubmit={envoyer} className="grid gap-3 rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-5 sm:grid-cols-2">
      <div>
        <label htmlFor="ev-titre" className="mb-1 block text-[12px] font-semibold">Titre du document</label>
        <input id="ev-titre" name="titre" required maxLength={200} className={CHAMP} />
      </div>
      <div>
        <label htmlFor="ev-categorie" className="mb-1 block text-[12px] font-semibold">Rubrique</label>
        <select id="ev-categorie" name="categorie" className={CHAMP} defaultValue="analyse">
          {CATEGORIES_LIVRABLE.map((c) => (
            <option key={c.id} value={c.id}>{c.libelle}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ev-desc" className="mb-1 block text-[12px] font-semibold">Description (facultatif)</label>
        <input id="ev-desc" name="description" maxLength={600} className={CHAMP} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="ev-fichier" className="mb-1 block text-[12px] font-semibold">
          Fichier ({EXTENSIONS_AUTORISEES.join(", ")} · 50 Mo maximum)
        </label>
        <input id="ev-fichier" name="fichier" type="file" required accept={EXTENSIONS_AUTORISEES.map((x) => `.${x}`).join(",")} className="text-[13px]" />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={etat === "envoi"} className="rounded-full bg-[var(--encre)] px-5 py-2.5 text-[13px] font-semibold text-[var(--fond)] disabled:opacity-60">
          {etat === "envoi" ? "Envoi en cours…" : "Ajouter le document →"}
        </button>
        {erreur && <p role="alert" className="mt-3 rounded-lg bg-[rgba(255,107,107,0.14)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--rouge-texte)]">{erreur}</p>}
        {ok && <p role="status" className="mt-3 rounded-lg bg-[rgba(34,160,110,0.14)] px-3.5 py-2 text-[12.5px] font-semibold text-[var(--vert-texte)]">Document ajouté.</p>}
      </div>
    </form>
  );
}
