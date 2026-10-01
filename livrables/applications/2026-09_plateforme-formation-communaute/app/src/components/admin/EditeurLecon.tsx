"use client";

import { useActionState, useRef, useState } from "react";
import Markdown from "react-markdown";
import { enregistrerLecon } from "@/app/admin/programme/actions";
import { composants } from "@/components/formation/composants-lecon";
import { BLOCS_LECON, gabaritLecon, resteDesCrochets } from "@/lib/gabarit-lecon";

const etatInitial = { erreur: null as string | null, succes: false };

// Editeur d'une lecon : texte Markdown et apercu avec le meme rendu que la page eleve.
export function EditeurLecon({
  sectionId,
  titre,
  contenu,
}: {
  sectionId: string;
  titre: string;
  contenu: string;
}) {
  const [etat, action, enCours] = useActionState(enregistrerLecon, etatInitial);
  // Leçon vide (section toute neuve) : le modèle complet est proposé. Il n'est enregistré qu'au clic sur
  // « Enregistrer la leçon », donc jamais visible des élèves tant que l'admin ne l'a pas validé.
  const modeleCharge = contenu.trim() === "";
  const [texte, setTexte] = useState(modeleCharge ? gabaritLecon(titre) : contenu);
  const zone = useRef<HTMLTextAreaElement>(null);
  const [onglet, setOnglet] = useState<"editer" | "apercu">("editer");

  function inserer(bloc: string) {
    setOnglet("editer");
    setTexte((t) => t.trimEnd() + bloc);
    // Place la vue sur le bloc ajouté, en bas du texte.
    setTimeout(() => {
      const z = zone.current;
      if (z) {
        z.focus();
        z.scrollTop = z.scrollHeight;
      }
    }, 0);
  }

  const boutonBloc =
    "rounded-lg border border-[var(--sarcelle)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--sarcelle)] hover:bg-[var(--sarcelle)] hover:text-white";

  const classeOnglet = (actif: boolean) =>
    `rounded-lg px-3 py-1.5 text-[12px] font-bold ${actif ? "bg-[var(--sarcelle)] text-white" : "border border-[var(--ligne)] text-[var(--texte-mute)]"}`;

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="section_id" value={sectionId} />
      <div className="flex flex-col gap-1">
        <label htmlFor="titre-lecon" className="text-xs text-[var(--texte-mute)]">
          Titre de la section
        </label>
        <input
          id="titre-lecon"
          name="titre"
          defaultValue={titre}
          required
          minLength={2}
          maxLength={120}
          className="rounded-lg border border-[var(--ligne)] px-3 py-2 text-sm"
        />
      </div>

      {modeleCharge && (
        <p className="rounded-lg bg-[rgba(43,140,130,0.12)] px-4 py-2.5 text-[12.5px] font-bold text-[var(--sarcelle-texte)]">
          Modèle prérempli : remplace les parties entre crochets, puis clique « Enregistrer la leçon ». Tant que tu
          n&apos;as pas enregistré, les élèves ne voient rien.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Ajouter un bloc">
        <span className="text-[11.5px] font-bold text-[var(--texte-mute)]">Ajouter :</span>
        <button type="button" onClick={() => inserer(BLOCS_LECON.chapitre)} className={boutonBloc}>
          + Chapitre
        </button>
        <button type="button" onClick={() => inserer(BLOCS_LECON.prompt)} className={boutonBloc}>
          + Prompt à copier
        </button>
        <button type="button" onClick={() => inserer(BLOCS_LECON.commande)} className={boutonBloc}>
          + Commande
        </button>
        <button type="button" onClick={() => inserer(BLOCS_LECON.commandeClaude)} className={boutonBloc}>
          + Commande Claude Code
        </button>
        <button type="button" onClick={() => inserer(BLOCS_LECON.modele)} className={boutonBloc}>
          + Modèle de fichier
        </button>
        <button type="button" onClick={() => inserer(BLOCS_LECON.pointsCles)} className={boutonBloc}>
          + Points clés
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setOnglet("editer")} className={classeOnglet(onglet === "editer")}>
          Écrire
        </button>
        <button type="button" onClick={() => setOnglet("apercu")} className={classeOnglet(onglet === "apercu")}>
          Aperçu
        </button>
        <span className="ml-auto font-mono text-[10.5px] text-[var(--texte-mute)]">
          {texte.trim() ? texte.trim().split(/\s+/).length : 0} mots
        </span>
      </div>

      {/* Le champ reste dans le formulaire meme quand l'apercu est affiche. */}
      <textarea
        ref={zone}
        name="contenu"
        value={texte}
        onChange={(e) => setTexte(e.target.value)}
        maxLength={100000}
        spellCheck
        placeholder={"## Titre d'un chapitre\n\nUn paragraphe...\n\n- une puce\n- une autre"}
        className={`min-h-[420px] rounded-lg border border-[var(--ligne)] px-3 py-2 font-mono text-[12.5px] leading-relaxed ${onglet === "editer" ? "" : "hidden"}`}
      />
      {onglet === "apercu" && (
        <div className="min-h-[420px] rounded-lg border border-[var(--ligne)] bg-[var(--fond)] p-5">
          {texte.trim() ? (
            <Markdown components={composants}>{texte}</Markdown>
          ) : (
            <p className="text-sm text-[var(--texte-mute)]">Rien à afficher : la leçon est vide.</p>
          )}
        </div>
      )}

      {resteDesCrochets(texte) && (
        <p role="status" className="text-[12px] font-bold text-[var(--corail-texte)]">
          Il reste des parties entre crochets à remplir (elles commencent par une majuscule). Relis avant d&apos;enregistrer.
        </p>
      )}

      <p className="text-[11px] text-[var(--texte-mute)]">
        Markdown : <code>##</code> titre, <code>**gras**</code>, listes avec <code>-</code>, blocs de code avec trois
        apostrophes inversées. Le HTML n&apos;est pas interprété.
      </p>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={enCours}
          className="rounded-lg bg-[var(--sarcelle)] px-4 py-2 text-xs font-bold text-white disabled:opacity-60"
        >
          {enCours ? "Enregistrement..." : "Enregistrer la leçon"}
        </button>
        {etat.erreur && <span className="text-xs text-[var(--corail)]">{etat.erreur}</span>}
        {etat.succes && <span className="text-xs text-[var(--sarcelle)]">Leçon enregistrée.</span>}
      </div>
    </form>
  );
}
