"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { MarqueChatllow } from "@/components/MarqueChatllow";
import { Icone } from "@/components/Icone";
import { EVENEMENT_MESSAGE } from "./BoutonSujet";
import { LONGUEUR_MAX_MESSAGE } from "@/lib/assistant-public";

export type MessageChat = { id: string; role: "user" | "assistant"; contenu: string; created_at: string };

const heure = (iso: string) => new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

// Rendu des reponses : etapes numerotees en pastilles rondes, comme la capture de reference.
const MARKDOWN = {
  p: (props: React.ComponentProps<"p">) => <p className="mb-2.5 last:mb-0" {...props} />,
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="my-3 flex list-none flex-col gap-3 pl-0 [counter-reset:etape]" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => (
    <li
      className="relative list-none pl-9 [counter-increment:etape] before:absolute before:left-0 before:top-0 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:bg-[var(--indigo)] before:text-[11px] before:font-bold before:text-white before:content-[counter(etape)]"
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<"ul">) => <ul className="my-2 list-disc pl-5" {...props} />,
  blockquote: ({ children, ...props }: React.ComponentProps<"blockquote">) => (
    <blockquote className="mt-3 rounded-xl border border-[oklch(82%_0.07_250)] bg-[var(--indigo-soft)] px-4 py-3 text-[12.5px] leading-relaxed [&>p]:mb-0" {...props}>
      <span className="mb-1 block text-[11.5px] font-bold text-[oklch(45%_0.19_250)]">Chatllow IA</span>
      {children}
    </blockquote>
  ),
  strong: (props: React.ComponentProps<"strong">) => <strong className="font-semibold text-[var(--texte)]" {...props} />,
};

export function Chat({
  initial,
  disponible,
  initiales,
  sujetInitial,
  limite,
}: {
  initial: MessageChat[];
  disponible: boolean;
  initiales: string;
  sujetInitial?: string;
  limite: number;
}) {
  const [messages, setMessages] = useState<MessageChat[]>(initial);
  const [saisie, setSaisie] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [copie, setCopie] = useState<string | null>(null);
  const fin = useRef<HTMLDivElement>(null);
  const dejaLance = useRef(false);
  const occupe = useRef(false);

  useEffect(() => {
    fin.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  const envoyer = useCallback(
    async (texte: string) => {
      const message = texte.trim();
      if (!message || occupe.current) return;
      if (message.length > LONGUEUR_MAX_MESSAGE) {
        setErreur(`Message trop long (${LONGUEUR_MAX_MESSAGE} caractères maximum).`);
        return;
      }
      occupe.current = true;
      setEnCours(true);
      setErreur(null);
      const horodatage = new Date().toISOString();
      const idReponse = `tmp-${horodatage}`;
      setMessages((m) => [
        ...m,
        { id: `u-${horodatage}`, role: "user", contenu: message, created_at: horodatage },
        { id: idReponse, role: "assistant", contenu: "", created_at: horodatage },
      ]);
      setSaisie("");
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message }),
        });
        if (!res.ok || !res.body) {
          const corps = await res.json().catch(() => null);
          throw new Error(corps?.erreur ?? "L'assistant n'a pas pu répondre. Réessayez.");
        }
        const lecteur = res.body.getReader();
        const decodeur = new TextDecoder();
        let cumul = "";
        for (;;) {
          const { done, value } = await lecteur.read();
          if (done) break;
          cumul += decodeur.decode(value, { stream: true });
          setMessages((m) => m.map((x) => (x.id === idReponse ? { ...x, contenu: cumul } : x)));
        }
      } catch (e) {
        setErreur(e instanceof Error ? e.message : "L'assistant n'a pas pu répondre. Réessayez.");
        // On retire la bulle de reponse restee vide.
        setMessages((m) => m.filter((x) => !(x.id === idReponse && x.contenu === "")));
      } finally {
        occupe.current = false;
        setEnCours(false);
      }
    },
    []
  );

  // Question envoyee depuis un autre endroit de la page (suggestions, pastilles, expertises).
  useEffect(() => {
    const ecouteur = (e: Event) => void envoyer((e as CustomEvent<string>).detail);
    window.addEventListener(EVENEMENT_MESSAGE, ecouteur);
    return () => window.removeEventListener(EVENEMENT_MESSAGE, ecouteur);
  }, [envoyer]);

  // Question arrivee par l'adresse (?sujet=...) : envoyee une seule fois, puis retiree de l'adresse.
  useEffect(() => {
    if (sujetInitial && disponible && !dejaLance.current) {
      dejaLance.current = true;
      window.history.replaceState(null, "", "/espace-client?section=chat");
      void envoyer(sujetInitial);
    }
  }, [sujetInitial, disponible, envoyer]);

  const copier = async (m: MessageChat) => {
    try {
      await navigator.clipboard.writeText(m.contenu);
      setCopie(m.id);
      setTimeout(() => setCopie(null), 1800);
    } catch {
      setErreur("Copie impossible sur cet appareil.");
    }
  };

  const telecharger = (m: MessageChat) => {
    const blob = new Blob([`Synthèse Chatllow\n\n${m.contenu}\n`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `synthese-chatllow-${new Date(m.created_at).toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const derniere = [...messages].reverse().find((m) => m.role === "assistant" && m.contenu)?.id;

  return (
    <section className="flex flex-col rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
      <div className="flex max-h-[560px] min-h-[260px] flex-col gap-5 overflow-y-auto p-5 sm:p-6">
        {messages.length === 0 && (
          <div className="m-auto max-w-sm py-8 text-center">
            <span aria-hidden className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--indigo-soft)]">
              <MarqueChatllow taille={26} />
            </span>
            <p className="font-[family-name:var(--font-display)] mt-4 text-[16px] font-semibold">
              {disponible ? "Posez votre première question" : "L'assistant est en cours de configuration"}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--texte-mute)]">
              {disponible
                ? "Utilisez le champ ci-dessous, une suggestion à droite ou l'un des domaines du menu."
                : "Il sera disponible très prochainement. En attendant, vos projets et livrables sont dans le menu."}
            </p>
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex items-start justify-end gap-3">
              <div className="max-w-[78%]">
                <p className="mb-1 text-right font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--texte-mute)]">{heure(m.created_at)}</p>
                <div className="whitespace-pre-wrap rounded-2xl rounded-tr-md bg-[var(--indigo-soft)] px-4 py-3 text-[13.5px] leading-relaxed">{m.contenu}</div>
              </div>
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--encre)] text-[11px] font-bold text-white">{initiales}</span>
            </div>
          ) : (
            <div key={m.id} className="flex items-start gap-3">
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--indigo-soft)]">
                <MarqueChatllow taille={20} />
              </span>
              <div className="min-w-0 max-w-[88%]">
                <p className="mb-1 font-[family-name:var(--font-mono)] text-[10.5px] text-[var(--texte-mute)]">
                  <b className="font-semibold text-[var(--texte)]">Chatllow IA</b> · {heure(m.created_at)}
                </p>
                <div className="rounded-2xl rounded-tl-md bg-[rgba(20,22,31,0.04)] px-4 py-3.5 text-[13.5px] leading-relaxed">
                  {m.contenu ? (
                    <ReactMarkdown components={MARKDOWN}>{m.contenu}</ReactMarkdown>
                  ) : (
                    <span className="inline-flex gap-1" aria-label="L'assistant rédige sa réponse">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--indigo)]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--indigo)] [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--indigo)] [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
                {m.contenu && !(enCours && m.id === messages[messages.length - 1]?.id) && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" onClick={() => copier(m)} className="rounded-full border border-[var(--ligne)] px-3.5 py-1 text-[11.5px] font-semibold hover:bg-[var(--indigo-soft)]">
                      {copie === m.id ? "Copié ✓" : "Copier"}
                    </button>
                    <button type="button" onClick={() => telecharger(m)} className="rounded-full border border-[var(--ligne)] px-3.5 py-1 text-[11.5px] font-semibold hover:bg-[var(--indigo-soft)]">
                      Télécharger la synthèse
                    </button>
                    {m.id === derniere && !enCours && disponible && (
                      <button
                        type="button"
                        onClick={() => void envoyer("Établissez le plan d'action détaillé à partir de votre réponse précédente : étapes, responsables, indicateurs et délais indicatifs.")}
                        className="rounded-full border border-[var(--ligne)] px-3.5 py-1 text-[11.5px] font-semibold hover:bg-[var(--indigo-soft)]"
                      >
                        Voir le plan d&apos;action
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        )}
        <div ref={fin} />
      </div>

      {erreur && (
        <p role="alert" className="mx-5 mb-2 rounded-lg bg-[rgba(255,107,107,0.12)] px-3.5 py-2 text-[12.5px] font-semibold text-[#b53a3a]">
          {erreur}
        </p>
      )}

      <form
        className="flex items-end gap-3 border-t border-[var(--ligne)] p-3.5"
        onSubmit={(e) => {
          e.preventDefault();
          void envoyer(saisie);
        }}
      >
        <button type="button" disabled title="Bientôt disponible" aria-label="Joindre un fichier (bientôt disponible)" className="mb-2 hidden cursor-not-allowed text-[var(--texte-mute)] opacity-50 sm:block">
          <Icone nom="trombone" />
        </button>
        <textarea
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void envoyer(saisie);
            }
          }}
          rows={1}
          maxLength={LONGUEUR_MAX_MESSAGE}
          disabled={!disponible || enCours}
          placeholder={disponible ? "Écrivez votre message ici…" : "Assistant en cours de configuration…"}
          aria-label="Votre message à l'assistant"
          className="max-h-32 min-h-[40px] min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-[13.5px] placeholder:text-[var(--texte-mute)] focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!disponible || enCours || !saisie.trim()}
          aria-label="Envoyer"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--indigo)] text-[#0b1020] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icone nom="envoyer" className="h-[18px] w-[18px]" />
        </button>
      </form>
      <p className="border-t border-[var(--ligne)] px-5 py-2.5 text-[10.5px] leading-relaxed text-[var(--texte-mute)]">
        Les messages sont traités par un service d&apos;IA. Évitez d&apos;y saisir des données personnelles ou secrètes. Limite : {limite} messages par jour.
      </p>
    </section>
  );
}
