import { MarqueChatllow } from "@/components/MarqueChatllow";
import { Icone } from "@/components/Icone";

// Apercu du futur assistant IA : interface complete, mais AUCUNE reponse reelle. La conversation est un
// exemple etiquete comme tel ; la saisie est desactivee. Aucun service d'IA externe n'est appele.
const QUESTION =
  "Je souhaite intégrer l'IA dans mon service client pour améliorer la réactivité et la qualité des réponses. Quels sont les premiers étapes à suivre ?";
const ETAPES = [
  { t: "Définir vos objectifs", d: "Clarifiez les attentes : réduction des délais de réponse, automatisation des FAQ, assistance 24/7, amélioration de la satisfaction client, etc." },
  { t: "Identifier les cas d'usage prioritaires", d: "Commencez par des cas simples et à fort impact (ex. : FAQ, suivi de commande, prise de rendez-vous)." },
  { t: "Choisir les bons outils", d: "Selon vos besoins, vous pouvez utiliser des solutions comme : chatbots IA (ex. : ChatGPT, Claude, Copilot…), plateformes de service client (ex. : Zendesk, Intercom, etc.)." },
  { t: "Former vos équipes", d: "L'IA est un outil, mais l'humain reste essentiel. Formez vos équipes pour qu'elles puissent l'utiliser efficacement et garder la main sur la relation client." },
  { t: "Mesurer et ajuster", d: "Suivez des indicateurs comme le temps de réponse, le taux de résolution et la satisfaction client (CSAT)." },
];

export function ApercuChat({ initiales }: { initiales: string }) {
  return (
    <section className="flex flex-col rounded-2xl border border-[var(--ligne)] bg-[var(--fond-carte)]">
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        <p className="rounded-lg bg-[var(--indigo-soft)] px-3.5 py-2 text-center text-[12px] font-semibold text-[oklch(45%_0.19_250)]">
          Exemple de conversation. L&apos;assistant IA arrive bientôt.
        </p>

        <div className="flex items-start justify-end gap-3">
          <div className="max-w-[78%] rounded-2xl rounded-tr-md bg-[var(--indigo-soft)] px-4 py-3 text-[13.5px] leading-relaxed">{QUESTION}</div>
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--encre)] text-[11px] font-bold text-white">{initiales}</span>
        </div>

        <div className="flex items-start gap-3">
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--indigo-soft)]">
            <MarqueChatllow taille={20} />
          </span>
          <div className="min-w-0 max-w-[88%]">
            <p className="mb-1 font-[family-name:var(--font-mono)] text-[10.5px] font-semibold">Chatllow IA</p>
            <div className="rounded-2xl rounded-tl-md bg-[rgba(20,22,31,0.04)] px-4 py-3.5 text-[13.5px] leading-relaxed">
              <p>
                Excellente initiative ! L&apos;IA peut effectivement <b className="font-semibold">transformer</b> votre service client en améliorant la réactivité, la qualité des réponses et la satisfaction de vos clients. Voici les étapes clés pour démarrer :
              </p>
              <ol className="my-3 flex list-none flex-col gap-3 pl-0 [counter-reset:etape]">
                {ETAPES.map((e) => (
                  <li
                    key={e.t}
                    className="relative pl-9 [counter-increment:etape] before:absolute before:left-0 before:top-0 before:flex before:h-6 before:w-6 before:items-center before:justify-center before:rounded-full before:bg-[var(--indigo)] before:text-[11px] before:font-bold before:text-white before:content-[counter(etape)]"
                  >
                    <b className="block font-semibold">{e.t}</b>
                    <span className="text-[13px] text-[var(--texte-mute)]">{e.d}</span>
                  </li>
                ))}
              </ol>
              <blockquote className="mt-3 rounded-xl border border-[oklch(82%_0.07_250)] bg-[var(--indigo-soft)] px-4 py-3 text-[12.5px] leading-relaxed">
                <span className="mb-1 block text-[11.5px] font-bold text-[oklch(45%_0.19_250)]">Chatllow IA</span>
                Pour aller plus loin, je peux vous proposer une analyse personnalisée de votre service client et un plan d&apos;action sur mesure. Souhaitez-vous que je prépare cela ?
              </blockquote>
            </div>
            <div className="mt-2 flex flex-wrap gap-2" aria-hidden>
              {["Copier", "Télécharger la synthèse", "Voir le plan d'action"].map((b) => (
                <span key={b} className="rounded-full border border-[var(--ligne)] px-3.5 py-1 text-[11.5px] font-semibold text-[var(--texte-mute)] opacity-70">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--ligne)] p-3.5">
        <Icone nom="trombone" className="ml-1 h-[18px] w-[18px] text-[var(--texte-mute)] opacity-50" />
        <input
          disabled
          placeholder="Écrivez votre message ici… (bientôt disponible)"
          aria-label="Message à l'assistant (bientôt disponible)"
          className="min-w-0 flex-1 cursor-not-allowed bg-transparent px-2 py-2 text-[13.5px] placeholder:text-[var(--texte-mute)]"
        />
        <button type="button" disabled title="Bientôt disponible" aria-label="Envoyer (bientôt disponible)" className="flex h-10 w-10 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-[var(--indigo)] text-[#0b1020] opacity-40">
          <Icone nom="envoyer" />
        </button>
      </div>
    </section>
  );
}
