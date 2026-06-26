import { AGENTS } from "@/data/agents";
import { TOOLS } from "@/data/tools";
import { AGENT_COLORS } from "@/lib/agents";

// Horodatages de synchro statiques (V1)
const SYNC: Record<string, string> = {
  CEO: "il y a 2 min",
  COO: "il y a 4 min",
  CFO: "il y a 38 min",
  CoS: "il y a 1 min",
  PA: "il y a 6 min",
};

const TOOL_NOTES: Record<string, string> = {
  "Dashboard finances": "Relevé BRED mai manquant",
};

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] font-[700] uppercase text-blue"
      style={{ letterSpacing: "0.14em", marginBottom: "14px" }}
    >
      {children}
    </p>
  );
}

function StatusText({ warning }: { warning: boolean }) {
  return (
    <span
      className="text-[9px] font-[700]"
      style={{ color: warning ? "#d97706" : "#16a34a" }}
    >
      {warning ? "ATTENTION" : "EN LIGNE"}
    </span>
  );
}

export function SystemView() {
  return (
    <div style={{ height: "100%", overflowY: "auto", padding: "24px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}
      >
        {/* Équipe IA */}
        <div className="cs-card" style={{ padding: "18px" }}>
          <CardLabel>Équipe IA</CardLabel>
          {AGENTS.map((agent, i) => {
            const warning = agent.status === "warning";
            return (
              <div
                key={agent.code}
                className="flex items-center gap-2.5"
                style={{
                  padding: "8px 0",
                  borderBottom:
                    i === AGENTS.length - 1 ? "none" : "1px solid #f0f0ec",
                }}
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] text-[8px] font-[700] text-card"
                  style={{ backgroundColor: AGENT_COLORS[agent.code] }}
                >
                  {agent.code}
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-[600] text-ink">
                    {agent.name}
                  </span>
                  <span className="block text-[9px] font-[400] text-[#aaa]">
                    {agent.role}
                  </span>
                </span>
                <span className="ml-auto flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        backgroundColor: warning ? "#f59e0b" : "#22c55e",
                      }}
                    />
                    <StatusText warning={warning} />
                  </span>
                  <span className="text-[9px] font-[400] text-[#ccc]">
                    synchro {SYNC[agent.code] ?? "—"}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Outils connectés */}
        <div className="cs-card" style={{ padding: "18px" }}>
          <CardLabel>Outils connectés</CardLabel>
          {TOOLS.map((tool, i) => {
            const warning = tool.status === "warning";
            const note = TOOL_NOTES[tool.name];
            return (
              <div
                key={tool.name}
                className="flex items-center justify-between"
                style={{
                  padding: "7px 0",
                  borderBottom:
                    i === TOOLS.length - 1 ? "none" : "1px solid #f0f0ec",
                }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: warning ? "#f59e0b" : "#22c55e" }}
                  />
                  <span className="min-w-0">
                    <span className="block text-[11px] font-[500] text-[#555]">
                      {tool.name}
                    </span>
                    {note && (
                      <span className="block text-[9px] font-[400] text-[#d97706]">
                        {note}
                      </span>
                    )}
                  </span>
                </span>
                <span
                  className="text-[9px] font-[700]"
                  style={{
                    padding: "2px 8px",
                    borderRadius: "4px",
                    background: warning ? "#fffbeb" : "#f0fdf4",
                    color: warning ? "#d97706" : "#16a34a",
                  }}
                >
                  {warning ? "ATTENTION" : "EN LIGNE"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Alertes actives — pleine largeur */}
        <div
          className="cs-card"
          style={{ padding: "18px", gridColumn: "span 2" }}
        >
          <CardLabel>Alertes actives</CardLabel>
          <div style={{ display: "flex", gap: "12px" }}>
            <div
              style={{
                flex: 1,
                borderLeft: "3px solid #f59e0b",
                borderRadius: "0 8px 8px 0",
                padding: "12px 14px",
                background: "#fffbeb",
              }}
            >
              <p className="text-[11px] font-[700] text-[#92400e]">
                CFO · Attention
              </p>
              <p className="mt-1 text-[10px] font-[400] text-[#78350f]">
                Relevé BRED mai non importé. Données juin partielles.
              </p>
            </div>
            <div
              style={{
                flex: 1,
                borderLeft: "3px solid #1C42BD",
                borderRadius: "0 8px 8px 0",
                padding: "12px 14px",
                background: "#eff4ff",
              }}
            >
              <p className="text-[11px] font-[700] text-blue">
                COO · Prochain cours
              </p>
              <p className="mt-1 text-[10px] font-[400] text-[#3b5bdb]">
                09:00 aujourd&apos;hui · 3 places restantes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
