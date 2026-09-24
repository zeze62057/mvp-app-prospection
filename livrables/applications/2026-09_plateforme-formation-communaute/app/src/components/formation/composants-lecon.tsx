// Rendu Markdown des lecons : partage entre la page eleve et l'apercu de l'editeur admin.
// Composant sans etat ni hook, utilisable cote serveur comme cote client.
import type { Components } from "react-markdown";

export const composants: Components = {
  h2: ({ children }) => <h2 className="font-display mb-3 mt-10 text-[20px] font-bold tracking-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="font-display mb-2 mt-7 text-[16.5px] font-bold">{children}</h3>,
  h4: ({ children }) => <h4 className="mb-2 mt-5 text-[15px] font-bold">{children}</h4>,
  p: ({ children }) => <p className="mb-4 text-[15px] leading-[1.75] text-[var(--texte)]">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 ml-5 list-disc space-y-1.5 text-[15px] leading-[1.7]">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-[15px] leading-[1.7]">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-[var(--texte)]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-xl border-l-4 border-[var(--sarcelle)] bg-[var(--fond-carte)] px-5 py-3 text-[14px] leading-relaxed text-[var(--texte-mute)] [&>p]:mb-2 [&>p]:text-[14px] [&>p]:text-[var(--texte-mute)] [&>p:last-child]:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-[var(--ligne)]" />,
  pre: ({ children }) => (
    <pre className="my-5 overflow-x-auto whitespace-pre-wrap rounded-xl bg-[var(--encre)] p-4 font-mono text-[12.5px] leading-relaxed text-[var(--sur-encre)]">
      {children}
    </pre>
  ),
  code: ({ children }) => <code className="font-mono text-[12.5px]">{children}</code>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--sarcelle)] underline">
      {children}
    </a>
  ),
};
