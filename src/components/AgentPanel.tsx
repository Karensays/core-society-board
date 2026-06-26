"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AGENT_COLORS } from "@/lib/agents";

export interface AgentPanelProps {
  code: string;
  name: string;
  role: string;
  mode: "solo" | "reunion";
  onClose: () => void;
  /** "full" : remplit son conteneur (vue Agents) · "overlay" : slide-over absolu */
  variant?: "full" | "overlay";
}

type Msg = { role: "user" | "assistant"; content: string };

export function AgentPanel({
  code,
  name,
  role,
  mode,
  onClose,
  variant = "full",
}: AgentPanelProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const color = AGENT_COLORS[code] ?? "#1C42BD";
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentCode: code, messages: next, mode }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: data.content ?? data.error ?? "Erreur.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Erreur réseau." },
      ]);
    } finally {
      setLoading(false);
    }
  }

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
      <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-3">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] text-[9px] font-[700] text-card"
          style={{ backgroundColor: color }}
        >
          {code}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-[600] text-ink">{name}</p>
          <p className="truncate text-[9px] font-[400] text-[#aaa]">{role}</p>
        </div>
        <span className="rounded-[4px] bg-blue-light px-1.5 py-0.5 text-[8px] font-[600] uppercase tracking-[0.08em] text-blue">
          {mode === "reunion" ? "Réunion" : "Solo"}
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

      {/* Messages */}
      <div className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-3">
        {messages.length === 0 && !loading && (
          <p className="text-[10px] font-[400] text-muted-light">
            Pose ta question à {name}.
          </p>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div
                className="max-w-[85%] px-2.5 py-1.5 text-[11px] font-[400] text-card"
                style={{ background: "#1C42BD", borderRadius: "7px 0 7px 7px" }}
              >
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <div
                className="max-w-[85%] px-2.5 py-1.5 text-[11px] font-[400] text-ink"
                style={{ background: "#f5f5f3", borderRadius: "0 7px 7px 7px" }}
              >
                {m.content}
              </div>
            </div>
          ),
        )}

        {loading && (
          <div className="flex justify-start">
            <div
              className="px-2.5 py-1.5 text-[13px] font-[700] text-muted-light"
              style={{ background: "#f5f5f3", borderRadius: "0 7px 7px 7px" }}
            >
              <span className="animate-pulse">…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={send}
        className="flex items-center gap-2 border-t border-border px-3 py-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message…"
          className="min-w-0 flex-1 rounded-[6px] border border-border-strong bg-card px-2.5 py-1.5 text-[11px] font-[400] text-ink outline-none placeholder:text-muted-light focus:border-blue"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-[6px] bg-blue px-3 py-1.5 text-[10px] font-[600] text-card transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          Envoyer
        </button>
      </form>
    </aside>
  );
}
