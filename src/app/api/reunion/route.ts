import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AGENT_PROMPTS } from "@/lib/agents";

export const runtime = "nodejs";

function extractText(response: Anthropic.Message): string {
  return response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
}

export async function POST(req: Request) {
  const { question, agents } = (await req.json()) as {
    question: string;
    agents: string[];
  };

  if (!question?.trim() || !Array.isArray(agents) || agents.length === 0) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY manquante côté serveur." },
      { status: 500 },
    );
  }

  const client = new Anthropic({ apiKey });

  try {
    const messages: { agent: string; content: string }[] = [];
    let context = "";

    // 1. Chaque agent répond séquentiellement, en voyant les réponses précédentes.
    for (const code of agents) {
      const system = AGENT_PROMPTS[code];
      if (!system) continue;

      const userContent = context
        ? `Question posée en réunion stratégique :\n"${question}"\n\nRéponses des autres agents jusqu'ici :\n${context}\nDonne ton point de vue (3-5 phrases), en tenant compte de ce qui a déjà été dit.`
        : `Question posée en réunion stratégique :\n"${question}"\n\nDonne ton point de vue (3-5 phrases).`;

      const resp = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        system,
        messages: [{ role: "user", content: userContent }],
      });

      const text = extractText(resp);
      messages.push({ agent: code, content: text });
      context += `\n[${code}] ${text}\n`;
    }

    // 2. La Chief of Staff synthétise le débat.
    const synthResp = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: AGENT_PROMPTS.CoS,
      messages: [
        {
          role: "user",
          content: `En tant que Chief of Staff, synthétise le débat ci-dessous en une recommandation claire et actionnable pour Karen (concis, priorités en tête).\n\nQuestion : "${question}"\n\nDébat :${context}`,
        },
      ],
    });

    const synthesis = extractText(synthResp);

    return NextResponse.json({ messages, synthesis });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("Erreur /api/reunion :", detail, err);
    return NextResponse.json(
      { error: `Erreur lors de la réunion : ${detail}` },
      { status: 500 },
    );
  }
}
