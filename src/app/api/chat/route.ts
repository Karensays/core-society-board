import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { AGENT_PROMPTS } from "@/lib/agents";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const { agentCode, messages, mode } = (await req.json()) as {
    agentCode: string;
    messages: ChatMessage[];
    mode: "solo" | "reunion";
  };

  const baseSystem = AGENT_PROMPTS[agentCode];
  if (!baseSystem) {
    return NextResponse.json({ error: "Agent inconnu" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY manquante côté serveur." },
      { status: 500 },
    );
  }

  const system =
    mode === "reunion"
      ? `${baseSystem}\n\n(Tu participes à une réunion stratégique orchestrée par la Chief of Staff.)`
      : baseSystem;

  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const content = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    return NextResponse.json({ content });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("Erreur /api/chat :", detail, err);
    return NextResponse.json(
      { error: `Erreur lors de l'appel à l'agent : ${detail}` },
      { status: 500 },
    );
  }
}
