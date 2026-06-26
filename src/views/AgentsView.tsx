"use client";

import { useState } from "react";
import { Wand2, Users, Bot } from "lucide-react";
import { AGENTS, type Agent } from "@/data/agents";
import { AGENT_COLORS } from "@/lib/agents";
import { AgentPanel } from "@/components/AgentPanel";
import { ReunionPanel } from "@/components/ReunionPanel";

// Chief of Staff en premier, puis les autres.
const ORDERED: Agent[] = [
  ...AGENTS.filter((a) => a.code === "CoS"),
  ...AGENTS.filter((a) => a.code !== "CoS"),
];

const REUNION_DEFAULT = ["CEO", "COO", "CFO"];

type Chat =
  | { kind: "empty" }
  | { kind: "solo"; code: string }
  | { kind: "reunion-setup" }
  | { kind: "reunion"; agents: string[]; initialQuestion: string };

export function AgentsView() {
  const [chat, setChat] = useState<Chat>({ kind: "empty" });
  const [selected, setSelected] = useState<string[]>(REUNION_DEFAULT);
  const [theme, setTheme] = useState("");

  const reunionMode = chat.kind === "reunion-setup" || chat.kind === "reunion";
  const cosActive = chat.kind === "solo" && chat.code === "CoS";

  function toggleParticipant(code: string) {
    setSelected((s) =>
      s.includes(code) ? s.filter((c) => c !== code) : [...s, code],
    );
  }

  function launchReunion() {
    if (selected.length === 0 || !theme.trim()) return;
    setChat({ kind: "reunion", agents: selected, initialQuestion: theme.trim() });
    setTheme("");
  }

  const soloAgent =
    chat.kind === "solo" ? AGENTS.find((a) => a.code === chat.code) : null;

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* ── Colonne gauche : sélecteur ── */}
      <div
        style={{
          width: "240px",
          flexShrink: 0,
          overflowY: "auto",
          padding: "20px 16px",
          background: "#ffffff",
          borderRight: "1px solid #e4e4e0",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Comment démarrer ? */}
        <div>
          <p className="mb-2.5 text-[9px] font-[700] uppercase tracking-[0.14em] text-blue">
            Comment démarrer ?
          </p>

          {/* Card 1 — Via la Chief of Staff */}
          <PathCard
            icon={<Wand2 size={13} strokeWidth={2} />}
            title="Via la Chief of Staff"
            desc="Elle t'aide à prioriser et oriente vers les bons agents."
            tag="→ Recommandé si tu ne sais pas"
            active={cosActive}
            onClick={() => setChat({ kind: "solo", code: "CoS" })}
          />

          <div style={{ height: "8px" }} />

          {/* Card 2 — Réunion directe */}
          <PathCard
            icon={<Users size={13} strokeWidth={2} />}
            title="Réunion directe"
            desc="Réunis plusieurs agents autour d'une question."
            tag="→ Tu choisis les participants"
            active={reunionMode}
            onClick={() => setChat({ kind: "reunion-setup" })}
          />
        </div>

        {/* Ou parle à un agent seul */}
        <div>
          <p className="mb-2.5 text-[9px] font-[700] uppercase tracking-[0.14em] text-blue">
            Ou parle à un agent seul
          </p>
          {ORDERED.map((agent) => {
            const isCos = agent.code === "CoS";
            const active = chat.kind === "solo" && chat.code === agent.code;
            const highlight = active || isCos;
            return (
              <button
                key={agent.code}
                type="button"
                onClick={() => setChat({ kind: "solo", code: agent.code })}
                className={`mb-1.5 flex w-full items-center gap-2.5 rounded-[8px] border px-2.5 py-2 text-left transition-colors ${
                  highlight
                    ? "border-[#1C42BD] bg-[#eff4ff]"
                    : "border-[#e4e4e0] bg-white hover:border-[#1C42BD] hover:bg-[#f0f4ff]"
                }`}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] text-[9px] font-[700] text-card"
                  style={{ backgroundColor: AGENT_COLORS[agent.code] }}
                >
                  {agent.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-[600] text-ink">
                    {agent.name}
                  </span>
                  <span className="block truncate text-[9px] font-[400] text-[#aaa]">
                    {agent.role}
                  </span>
                </span>
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      agent.status === "warning" ? "#f59e0b" : "#22c55e",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Colonne droite : chat ── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          height: "100%",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          background: "#f8f8f6",
        }}
      >
        {chat.kind === "empty" && (
          <div className="flex h-full flex-col items-center justify-center">
            <Bot size={36} strokeWidth={1.5} color="#e0e0dc" />
            <p
              className="text-[13px] font-[300] italic text-[#ccc]"
              style={{ marginTop: "10px" }}
            >
              Choisis un agent ou lance une réunion
            </p>
          </div>
        )}

        {chat.kind === "solo" && soloAgent && (
          <AgentPanel
            key={soloAgent.code}
            code={soloAgent.code}
            name={soloAgent.name}
            role={soloAgent.role}
            mode="solo"
            variant="full"
            onClose={() => setChat({ kind: "empty" })}
          />
        )}

        {chat.kind === "reunion-setup" && (
          <div className="mx-auto w-full max-w-[520px] p-6">
            <p className="text-[14px] font-[700] text-ink">Nouvelle réunion</p>

            {/* Sélecteur de participants */}
            <p className="mt-4 text-[9px] font-[700] uppercase tracking-[0.14em] text-blue">
              Participants
            </p>
            <div className="mt-2 flex flex-col gap-1.5">
              {AGENTS.map((agent) => {
                const checked = selected.includes(agent.code);
                return (
                  <label
                    key={agent.code}
                    className="flex cursor-pointer items-center gap-2 rounded-[8px] border border-[#e4e4e0] bg-white px-2.5 py-1.5"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleParticipant(agent.code)}
                      className="accent-[#1C42BD]"
                    />
                    <span
                      className="flex h-5 w-5 items-center justify-center rounded-[4px] text-[7px] font-[700] text-card"
                      style={{ backgroundColor: AGENT_COLORS[agent.code] }}
                    >
                      {agent.code}
                    </span>
                    <span className="text-[11px] font-[500] text-ink">
                      {agent.name}
                    </span>
                    <span className="text-[9px] font-[400] text-[#aaa]">
                      {agent.role}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Pills sélectionnés */}
            <p className="mt-4 text-[9px] font-[700] uppercase tracking-[0.14em] text-blue">
              Participants sélectionnés
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {selected.length === 0 && (
                <span className="text-[10px] font-[400] text-muted-light">
                  Aucun
                </span>
              )}
              {selected.map((code) => (
                <span
                  key={code}
                  className="flex items-center gap-1 rounded-[4px] px-1.5 py-0.5 text-[9px] font-[600]"
                  style={{ color: AGENT_COLORS[code], background: "#f0f0ec" }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: AGENT_COLORS[code] }}
                  />
                  {code}
                </span>
              ))}
            </div>

            {/* Thématique */}
            <p className="mt-4 text-[9px] font-[700] uppercase tracking-[0.14em] text-blue">
              Thématique ou question de départ
            </p>
            <textarea
              rows={3}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex : Comment atteindre l'objectif de 9 000€ de CA ce mois-ci ?"
              className="mt-2 w-full resize-none rounded-[8px] border-[1.5px] border-[#e4e4e0] bg-white px-2.5 py-2 text-[11px] font-[400] text-ink outline-none placeholder:text-muted-light focus:border-blue"
            />

            <button
              type="button"
              onClick={launchReunion}
              disabled={selected.length === 0 || !theme.trim()}
              className="mt-4 rounded-[8px] bg-blue px-4 py-2 text-[11px] font-[600] text-card transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Lancer la réunion →
            </button>
          </div>
        )}

        {chat.kind === "reunion" && (
          <ReunionPanel
            agents={chat.agents}
            initialQuestion={chat.initialQuestion}
            variant="full"
            onClose={() => setChat({ kind: "empty" })}
          />
        )}
      </div>
    </div>
  );
}

/* Carte "chemin de démarrage" — header + body, état actif bleu */
function PathCard({
  icon,
  title,
  desc,
  tag,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tag: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-[10px] text-left"
      style={{
        border: `1px solid ${active ? "#1C42BD" : "#e4e4e0"}`,
        cursor: "pointer",
      }}
    >
      <div
        className="flex items-center gap-2"
        style={{
          padding: "10px 12px",
          background: active ? "#1C42BD" : "#f8f8f6",
          borderBottom: `1px solid ${active ? "#1C42BD" : "#e4e4e0"}`,
          color: active ? "#ffffff" : "#1a1a1a",
        }}
      >
        {icon}
        <span className="text-[11px] font-[700]">{title}</span>
      </div>
      <div style={{ padding: "10px 12px" }}>
        <p
          className="text-[10px] font-[400]"
          style={{ color: "#888", lineHeight: 1.6 }}
        >
          {desc}
        </p>
        <p
          className="text-[9px] font-[600] text-blue"
          style={{ marginTop: "6px" }}
        >
          {tag}
        </p>
      </div>
    </button>
  );
}
