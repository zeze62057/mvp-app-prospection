import { NextResponse } from "next/server";
import { QUESTIONS } from "@/lib/diagnostic-questions";

export async function POST(request: Request) {
  const url = process.env.N8N_WEBHOOK_DIAGNOSTIC_URL;
  if (!url) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const { email, reponses, piloteRecommande } = (await request.json()) as {
    email: string;
    reponses: string[];
    piloteRecommande: string;
  };

  const resume = QUESTIONS.map(
    (q, i) => `${q.question} ${reponses[i] ?? "(sans réponse)"}`
  ).join("\n");

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, piloteRecommande, resume }),
    });
  } catch {
    // Notification best-effort : le lead est déjà sauvegardé en base,
    // un échec de notification ne doit jamais bloquer le visiteur.
  }

  return NextResponse.json({ ok: true });
}
