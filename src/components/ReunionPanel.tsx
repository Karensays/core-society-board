"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus } from "lucide-react";
import { AGENT_COLORS } from "@/lib/agents";
import { AGENTS } from "@/data/agents";

export interface ReunionPanelProps {
  agents: string[]; // codes des participants initiaux
  onClose: () => void;
  variant?: "full" | "overlay";
  initialQuestion?: string;
}

type AgentMsg = { agent: string; content: string };
type Turn = { question: string; messages: AgentMsg[]; synthesis: string };

function nameFor(code: string): string {
  return AGENTS.find((a) => a.code === code)?.name ?? code;
}

export function ReunionPanel({
  agents,
  onClose,
  variant = "full",
  initialQuestion,
}: ReunionPanelProps) {
  const [participants, setParticipants] = useState<string[]>(agents);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns, loading]);

  async function run(question: string) {
    if (!question.trim() || loading) return;
    setPending(question);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/reunion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, agents: participants }),
      });
      const data = await res.json();
      setTurns((t) => [
        ...t,
        {
          question,
          messages: data.messages ?? [],
          synthesis: data.synthesis ?? data.error ?? "Erreur.",
        },
      ]);
    } catch {
      setTurns((t) => [
        ...t,
        { question, messages: [], synthesis: "Erreur réseau." },
      ]);
    } finally {
      setPending(null);
      setLoading(false);
    }
  }

  // Lance automatiquement la question de départ (réunion directe).
  useEffect(() => {
    if (initialQuestion && !started.current) {
      started.current = true;
      run(initialQuestion);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addParticipant() {
    const next = AGENTS.find((a) => !participants.includes(a.code));
    if (next) setParticipants((p) => [...p, next.code]);
  }

  const allAdded = participants.length >= AGENTS.length;

  return (
    <aside
      className={
        variant === "overlay"
          ? "absolute bottom-0 right-0 top-0 z-40 flex w-[280px] flex-col bg-card"
          : "flex h-full w-full flex-col bg-card"
      }
      style={
        variant === "overlay" ? { borderLeft: "2px solid #1C42BD" } : undefined
      }
    >
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <p className="flex-1 text-[12px] font-[600] text-ink">
            Réunion stratégique
          </p>
          <span className="rounded-[4px] bg-[#fef2f2] px-1.5 py-0.5 text-[8px] font-[600] uppercase tracking-[0.08em] text-[#dc2626]">
            ● En cours
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="text-muted transition-colors hover:text-ink"
          >
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Participants */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {participants.map((code) => (
            <span
              key={code}
              className="flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[9px] font-[600]"
              style={{
                color: AGENT_COLORS[code] ?? "#1C42BD",
                background: "#f5f5f3",
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: AGENT_COLORS[code] ?? "#1C42BD" }}
              />
              {code}
            </span>
          ))}
          {!allAdded && (
            <button
              type="button"
              onClick={addParticipant}
              className="flex items-center gap-0.5 rounded-[4px] border border-border-strong px-1.5 py-0.5 text-[9px] font-[600] text-muted transition-colors hover:border-blue hover:text-blue"
            >
              <Plus size={9} strokeWidth={2.5} />
              Ajouter
            </button>
          )}
        </div>
      </div>

      {/* Fil de réunion */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
        {turns.length === 0 && !loading && (
          <p className="text-[10px] font-[400] text-muted-light">
            Pose une question à l&apos;équipe. La Chief of Staff orchestrera le
            débat puis synthétisera.
          </p>
        )}

        {turns.map((turn, ti) => (
          <div key={ti} className="space-y-2.5">
            <p className="text-[11px] font-[600] text-ink">— {turn.question}</p>

            {turn.messages.map((m, mi) => (
              <div key={mi} className="flex gap-2">
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] text-[8px] font-[700] text-card"
                  style={{ backgroundColor: AGENT_COLORS[m.agent] ?? "#1C42BD" }}
                >
                  {m.agent}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[9px] font-[600]"
                    style={{ color: AGENT_COLORS[m.agent] ?? "#1C42BD" }}
                  >
                    {nameFor(m.agent)}
                  </p>
                  <p className="max-w-[640px] text-[11px] font-[400] text-ink">
                    {m.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Synthèse CoS */}
            <div
              className="max-w-[680px]"
              style={{
                background: "#fffbeb",
                borderLeft: "3px solid #f59e0b",
                borderRadius: "0 5px 5px 0",
                padding: "8px 10px",
              }}
            >
              <p className="text-[9px] font-[700] text-[#92400e]">
                Synthèse Chief of Staff
              </p>
              <p className="mt-1 text-[10px] font-[400] text-[#78350f]">
                {turn.synthesis}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="space-y-2">
            {pending && (
              <p className="text-[11px] font-[600] text-ink">— {pending}</p>
            )}
            <p className="text-[10px] font-[400] text-muted-light">
              <span className="animate-pulse">
                Chief of Staff rédige la synthèse…
              </span>
            </p>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input — relance via CoS */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(input.trim());
        }}
        className="flex items-center gap-2 border-t border-border px-4 py-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nouveau tour (via CoS)…"
          className="min-w-0 flex-1 rounded-[6px] border border-border-strong bg-card px-2.5 py-1.5 text-[11px] font-[400] text-ink outline-none placeholder:text-muted-light focus:border-blue"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-[6px] bg-blue px-3 py-1.5 text-[10px] font-[600] text-card transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Lancer
        </button>
      </form>
    </aside>
  );
}
