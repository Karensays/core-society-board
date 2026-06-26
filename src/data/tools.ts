// Outils monitorés — données statiques V1 (CLAUDE.md section 9)

export type ToolStatus = "online" | "warning" | "offline";

export interface Tool {
  name: string;
  status: ToolStatus;
}

export const TOOLS: Tool[] = [
  { name: "Bsport", status: "online" },
  { name: "ClassPass", status: "online" },
  { name: "Egym Wellpass", status: "online" },
  { name: "Dashboard finances", status: "warning" },
  { name: "MMA platform", status: "online" },
  { name: "Instagram", status: "online" },
  { name: "Swello", status: "online" },
];
