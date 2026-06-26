import { AGENTS } from "@/data/agents";
import { TOOLS } from "@/data/tools";

// Aside — colonne droite 210px, sticky sous la TopBar (CLAUDE.md section 3).
// Base structurelle V1 : les composants détaillés (AgentRow, AlertCard, ToolRow)
// seront étoffés dans une session ultérieure.

const STATUS_DOT: Record<string, string> = {
  online: "bg-success",
  warning: "bg-warning",
  offline: "bg-urgent",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[9px] font-[600] uppercase tracking-[0.12em] text-muted-light">
      {children}
    </p>
  );
}

export function Aside() {
  return (
    <aside className="sticky top-9 hidden w-[210px] shrink-0 self-start border-l border-border bg-card p-4 md:block">
      {/* Équipe IA */}
      <SectionLabel>Équipe IA</SectionLabel>
      <ul className="mb-6 flex flex-col gap-1.5">
        {AGENTS.map((agent) => (
          <li
            key={agent.code}
            className="flex items-center gap-2 rounded-agent px-1 py-1"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[agent.status]}`}
            />
            <span className="text-[11px] font-[500] text-ink">{agent.name}</span>
            <span className="ml-auto text-[9px] font-[600] uppercase tracking-[0.08em] text-muted-light">
              {agent.code}
            </span>
          </li>
        ))}
      </ul>

      {/* Alertes */}
      <SectionLabel>Alertes</SectionLabel>
      <p className="mb-6 text-[11px] font-[400] text-muted">Aucune alerte.</p>

      {/* Santé outils */}
      <SectionLabel>Santé outils</SectionLabel>
      <ul className="mb-6 flex flex-col gap-1.5">
        {TOOLS.map((tool) => (
          <li key={tool.name} className="flex items-center gap-2 px-1 py-1">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOT[tool.status]}`}
            />
            <span className="text-[11px] font-[500] text-ink">{tool.name}</span>
          </li>
        ))}
      </ul>

      {/* Accès rapide */}
      <SectionLabel>Accès rapide</SectionLabel>
      <p className="text-[11px] font-[400] text-muted">—</p>
    </aside>
  );
}
