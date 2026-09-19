"use client";

import { useRef, useState } from "react";

type SectionPourAdmin = { id: string; titre: string; video_path: string | null };
type ModulePourAdmin = {
  id: string;
  titre: string;
  espace_id: string;
  sections: SectionPourAdmin[];
};
type EspacePourAdmin = { id: string; nom: string };

type Etat = "idle" | "enregistrement" | "pret" | "envoi" | "envoye" | "erreur";

export function EnregistrementVideo({
  espaces,
  modules,
}: {
  espaces: EspacePourAdmin[];
  modules: ModulePourAdmin[];
}) {
  const [sectionId, setSectionId] = useState("");
  const [etat, setEtat] = useState<Etat>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const fichierPretRef = useRef<Blob | null>(null);

  function arreterStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function demarrerEnregistrement() {
    setMessage(null);
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setEtat("erreur");
      setMessage("Ce navigateur ne supporte pas la capture d'ecran.");
      return;
    }

    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });
    streamRef.current = stream;
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      fichierPretRef.current = blob;
      setPreviewUrl(URL.createObjectURL(blob));
      setEtat("pret");
      arreterStream();
    };

    // L'utilisateur peut arreter le partage depuis le controle natif du
    // navigateur plutot que notre bouton : on doit s'arreter proprement aussi.
    stream.getVideoTracks()[0].addEventListener("ended", () => {
      if (recorder.state !== "inactive") recorder.stop();
    });

    mediaRecorderRef.current = recorder;
    recorder.start();
    setEtat("enregistrement");
  }

  function arreterEnregistrement() {
    mediaRecorderRef.current?.stop();
  }

  async function uploader() {
    const fichier = fichierPretRef.current;
    if (!sectionId || !fichier) return;
    setEtat("envoi");
    setMessage(null);

    const reponse = await fetch(`/api/admin/video/${sectionId}`, {
      method: "POST",
      headers: { "Content-Type": fichier.type || "video/webm" },
      body: fichier,
    });

    if (!reponse.ok) {
      const corps = await reponse.json().catch(() => null);
      setEtat("erreur");
      setMessage(corps?.erreur ?? "Echec de l'upload.");
      return;
    }

    setEtat("envoye");
    setMessage("Video enregistree et rattachee a la section.");
  }

  function choisirFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0];
    if (!fichier) return;
    setMessage(null);
    fichierPretRef.current = fichier;
    setPreviewUrl(URL.createObjectURL(fichier));
    setEtat("pret");
  }

  function recommencer() {
    setPreviewUrl(null);
    chunksRef.current = [];
    fichierPretRef.current = null;
    setEtat("idle");
    setMessage(null);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--ligne)] bg-[var(--fond-carte)] p-4">
      <div className="flex flex-col gap-1">
        <label className="text-xs text-[var(--texte-mute)]">Section cible</label>
        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
          disabled={etat === "enregistrement" || etat === "envoi"}
          className="rounded-lg border border-[var(--ligne)] px-3 py-1.5 text-sm"
        >
          <option value="">Choisir une section...</option>
          {espaces.map((espace) => (
            <optgroup key={espace.id} label={espace.nom}>
              {modules
                .filter((m) => m.espace_id === espace.id)
                .map((m) =>
                  m.sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {m.titre} — {s.titre}
                      {s.video_path ? " (deja une video)" : ""}
                    </option>
                  ))
                )}
            </optgroup>
          ))}
        </select>
      </div>

      {etat === "idle" && (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={demarrerEnregistrement}
            disabled={!sectionId}
            className="self-start rounded-lg bg-[var(--corail)] px-4 py-2 text-xs font-bold text-[var(--encre)] disabled:opacity-40"
          >
            Demarrer l&apos;enregistrement d&apos;ecran
          </button>
          <span className="text-xs text-[var(--texte-mute)]">ou</span>
          <label
            className={`text-xs font-bold underline ${
              sectionId ? "cursor-pointer text-[var(--sarcelle)]" : "cursor-not-allowed text-[var(--texte-mute)]"
            }`}
          >
            choisir un fichier video existant
            <input
              type="file"
              accept="video/*"
              disabled={!sectionId}
              onChange={choisirFichier}
              className="hidden"
            />
          </label>
        </div>
      )}

      {etat === "enregistrement" && (
        <button
          type="button"
          onClick={arreterEnregistrement}
          className="self-start rounded-lg bg-[var(--encre)] px-4 py-2 text-xs font-bold text-[var(--sur-encre)]"
        >
          ● Arreter l&apos;enregistrement
        </button>
      )}

      {previewUrl && (etat === "pret" || etat === "envoi" || etat === "envoye" || etat === "erreur") && (
        <div className="flex flex-col gap-3">
          <video src={previewUrl} controls className="w-full max-w-md rounded-lg" />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={uploader}
              disabled={etat === "envoi" || etat === "envoye"}
              className="rounded-lg bg-[var(--sarcelle)] px-4 py-2 text-xs font-bold text-white disabled:opacity-40"
            >
              {etat === "envoi" ? "Envoi..." : "Uploader cette video"}
            </button>
            <button
              type="button"
              onClick={recommencer}
              className="rounded-lg border border-[var(--ligne)] px-4 py-2 text-xs font-medium"
            >
              Recommencer
            </button>
          </div>
        </div>
      )}

      {message && (
        <p
          className={`text-xs ${etat === "erreur" ? "text-[var(--corail)]" : "text-[var(--sarcelle)]"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
