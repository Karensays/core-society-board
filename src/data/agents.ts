// Agents IA — données statiques V1 (CLAUDE.md section 8)

export type AgentStatus = "online" | "warning" | "offline";

export interface Agent {
  code: string;
  name: string;
  role: string;
  status: AgentStatus;
}

export const AGENTS: Agent[] = [
  { code: "CEO", name: "Stratège", role: "Vision · Priorités", status: "online" },
  { code: "COO", name: "Opérateur", role: "Planning · Ops", status: "online" },
  { code: "CFO", name: "Financier", role: "Tréso · BRED", status: "warning" },
  { code: "CoS", name: "Chief of Staff", role: "Coordination", status: "online" },
  { code: "PA", name: "Assistante", role: "Agenda · Relances", status: "online" },
];
