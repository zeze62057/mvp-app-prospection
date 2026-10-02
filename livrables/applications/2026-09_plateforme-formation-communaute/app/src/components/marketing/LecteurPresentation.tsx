"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { formaterTemps, type VideoVitrine } from "@/lib/video-vitrine";

// Partie « présentation » de la vitrine : le lecteur (vignette avec la photo du formateur, la vidéo ne se charge
// qu'au clic) et le sommaire cliquable des parties de la vidéo, qui suit la lecture.
export function LecteurPresentation({ video, lienRejoindre }: { video: VideoVitrine; lienRejoindre: string }) {
  const lecteur = useRef<HTMLVideoElement>(null);
  const aller = useRef<number | null>(null);
  const [lance, setLance] = useState(false);
  const [erreur, setErreur] = useState(false);
  const [actif, setActif] = useState(0);

  // Chapitre en cours : le dernier dont l'instant est passé.
  function suivre(t: number) {
    let i = 0;
    video.chapitres.forEach((c, k) => {
      if (t >= c.t - 0.3) i = k;
    });
    setActif(i);
  }

  function ouvrirChapitre(i: number) {
    const t = video.chapitres[i].t;
    setActif(i);
    setErreur(false);
    if (lecteur.current) {
      lecteur.current.currentTime = t;
      void lecteur.current.play();
    } else {
      aller.current = t; // la vidéo n'est pas encore chargée : on se placera dessus dès qu'elle l'est
      setLance(true);
    }
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] lg:gap-12">
      <div>
        {/* Halo derrière le lecteur */}
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,rgba(95,199,184,0.45),transparent_60%),radial-gradient(circle_at_85%_90%,rgba(255,122,77,0.4),transparent_55%)] opacity-70 blur-2xl" />
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-[rgba(234,245,242,0.2)] bg-[var(--encre)] shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            {lance && !erreur ? (
              <video
                ref={lecteur}
                src={video.src}
                poster={video.vignette}
                controls
                autoPlay
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                onLoadedMetadata={(e) => {
                  if (aller.current !== null) {
                    e.currentTarget.currentTime = aller.current;
                    aller.current = null;
                  }
                }}
                onTimeUpdate={(e) => suivre(e.currentTarget.currentTime)}
                onError={() => setErreur(true)}
                className="h-full w-full bg-black"
              >
                {/* Les légendes sont déjà incrustées dans l'image : la piste reste disponible (menu du lecteur) mais éteinte
                    par défaut, sinon deux textes se superposent. */}
                <track kind="subtitles" srcLang="fr" label="Français" src={video.sousTitres} />
              </video>
            ) : (
              <button
                type="button"
                onClick={() => setLance(true)}
                aria-label={`Lancer la vidéo : ${video.titre}, ${video.duree}`}
                className="group absolute inset-0 block h-full w-full cursor-pointer"
              >
                <Image
                  src={video.vignette}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 bg-[rgba(11,38,34,0)] transition-colors group-hover:bg-[rgba(11,38,34,0.1)]" />
                {/* Anneau pulsant autour du bouton dessiné sur la vignette */}
                <span aria-hidden="true" className="absolute left-[62.5%] top-[76.5%] h-[13.5%] w-[25%] animate-pulse rounded-full ring-4 ring-[rgba(255,122,77,0.55)]" />
                <span className="sr-only">Lancer la vidéo</span>
              </button>
            )}
            {erreur && (
              <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[rgba(11,38,34,0.92)] p-6 text-center text-[var(--sur-encre)]">
                <p className="font-display text-lg font-semibold">La vidéo ne s&apos;est pas chargée.</p>
                <button
                  type="button"
                  onClick={() => setErreur(false)}
                  className="rounded-[10px] bg-[var(--corail)] px-5 py-2.5 text-sm font-bold text-[var(--encre)]"
                >
                  Réessayer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <aside aria-label="Sommaire de la vidéo" className="rounded-3xl border border-[rgba(234,245,242,0.16)] bg-[rgba(234,245,242,0.05)] p-5 backdrop-blur sm:p-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-wide text-[var(--sarcelle-light)]">Dans cette vidéo</p>
        <ol className="flex flex-col gap-1">
          {video.chapitres.map((c, i) => (
            <li key={c.t}>
              <button
                type="button"
                onClick={() => ouvrirChapitre(i)}
                aria-current={lance && actif === i ? "true" : undefined}
                className={`group flex w-full items-center gap-3.5 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  lance && actif === i
                    ? "bg-[var(--sarcelle)] text-white"
                    : "text-[var(--sur-encre)] hover:bg-[rgba(234,245,242,0.1)]"
                }`}
              >
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-[12px] font-bold ${
                    lance && actif === i ? "bg-white text-[var(--sarcelle-texte)]" : "bg-[rgba(234,245,242,0.12)] text-[var(--sarcelle-light)]"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1 text-[14.5px] font-semibold leading-snug">{c.titre}</span>
                <span className={`font-mono text-[11.5px] ${lance && actif === i ? "text-white" : "text-[var(--sur-encre-mute)]"}`}>{formaterTemps(c.t)}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-6 border-t border-[rgba(234,245,242,0.14)] pt-5">
          <Link
            href={lienRejoindre}
            className="block rounded-[10px] bg-[var(--corail)] px-6 py-3.5 text-center text-[14.5px] font-extrabold text-[var(--encre)] shadow-[0_10px_28px_rgba(255,122,77,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Rejoindre la communauté gratuite
          </Link>
          <p className="mt-2.5 text-center text-xs text-[var(--sur-encre-mute)]">Sur approbation, sans engagement.</p>
        </div>
      </aside>
    </div>
  );
}
