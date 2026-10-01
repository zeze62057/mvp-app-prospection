// Rendu Markdown des lecons : partage entre la page eleve et l'apercu de l'editeur admin.
// Composant sans etat ni hook, utilisable cote serveur comme cote client.
import type { Components } from "react-markdown";
import { isValidElement } from "react";
import { PromptPret, type GenreBloc } from "./PromptPret";

const LANGAGES_TERMINAL = ["bash", "sh", "shell", "zsh", "powershell", "ps1", "cmd", "terminal", "console"];

function genreDuBloc(children: React.ReactNode): GenreBloc {
  const props = isValidElement(children) ? (children.props as { className?: string }) : undefined;
  const langage = /language-([\w-]+)/.exec(props?.className ?? "")?.[1]?.toLowerCase();
  if (langage === "prompt") return "prompt";
  if (langage === "claude") return "claude";
  if (langage && LANGAGES_TERMINAL.includes(langage)) return "terminal";
  return "texte";
}

export const composants: Components = {
  h2: ({ children }) => (
    <h2 className="font-display mb-4 mt-12 flex items-center gap-3 text-[22px] font-extrabold tracking-tight">
      <span aria-hidden="true" className="h-6 w-1.5 shrink-0 rounded-full bg-[var(--corail)]" />
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="font-display mb-3 mt-9 flex items-center gap-2.5 text-[18px] font-extrabold tracking-tight">
      <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--sarcelle)]" />
      {children}
    </h3>
  ),
  h4: ({ children }) => <h4 className="mb-2 mt-5 text-[15px] font-bold">{children}</h4>,
  p: ({ children }) => <p className="mb-4 text-[15.5px] leading-[1.8] text-[var(--texte)]">{children}</p>,
  ul: ({ children }) => <ul className="mb-5 ml-5 list-disc space-y-2 text-[15.5px] leading-[1.75] marker:text-[var(--corail)]">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-[15px] leading-[1.7]">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-[var(--texte)]">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-6 rounded-2xl border border-[var(--corail)]/40 border-l-[6px] border-l-[var(--corail)] bg-[var(--fond-carte)] px-5 py-4 text-[14.5px] leading-relaxed shadow-[0_3px_12px_rgba(0,0,0,0.06)] [&>p]:mb-2 [&>p]:text-[14.5px] [&>p]:text-[var(--texte)] [&>p:last-child]:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-8 border-[var(--ligne)]" />,
  // Le type de carte vient du langage annonce apres les trois accents graves : prompt, bash, powershell...
  pre: ({ children }) => <PromptPret genre={genreDuBloc(children)}>{children}</PromptPret>,
  code: ({ children }) => <code className="font-mono text-[12.5px]">{children}</code>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--sarcelle)] underline">
      {children}
    </a>
  ),
};
