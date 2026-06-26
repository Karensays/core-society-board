import { ExternalLink } from "lucide-react";
import { AGENTS } from "@/data/agents";
import { TOOLS } from "@/data/tools";
import { AgentRow } from "./AgentRow";
import { AlertCard } from "./AlertCard";
import { ToolRow } from "./ToolRow";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[9px] font-[600] uppercase tracking-[0.12em] text-[#bbb]">
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#e8e8e4", margin: "14px 0" }} />;
}

const QUICK_LINKS = [
  { label: "Bsport", href: "https://backoffice.bsport.io" },
  { label: "MMA platform", href: "https://core-society-mma.vercel.app" },
  { label: "Dashboard finances", href: "https://compta.coresociety.fr" },
  { label: "Instagram", href: "https://instagram.com/coresociety_fr" },
  { label: "coresociety.fr", href: "https://coresociety.fr" },
];

export function Aside() {
  return (
    <aside className="sticky top-9 w-[210px] shrink-0 self-start border-l border-border bg-card p-4">
      {/* Bloc 1 — Équipe IA */}
      <SectionLabel>Équipe IA</SectionLabel>
      <div className="flex flex-col gap-0.5">
        {AGENTS.map((agent, i) => (
          <AgentRow
            key={agent.code}
            code={agent.code}
            name={agent.name}
            role={agent.role}
            status={agent.status as "online" | "warning"}
            active={i === 0}
          />
        ))}
      </div>

      <Divider />

      {/* Bloc 2 — Alertes */}
      <SectionLabel>Alertes</SectionLabel>
      <div className="flex flex-col gap-2">
        <AlertCard
          type="warning"
          title="CFO · Attention"
          body="Relevé BRED mai non importé. Données juin partielles."
        />
        <AlertCard
          type="info"
          title="COO · Prochain cours"
          body="09:00 aujourd'hui · 3 places restantes"
        />
      </div>

      <Divider />

      {/* Bloc 3 — Santé des outils */}
      <SectionLabel>Santé des outils</SectionLabel>
      <div>
        {TOOLS.map((tool, i) => (
          <ToolRow
            key={tool.name}
            name={tool.name}
            status={tool.status as "online" | "warning"}
            last={i === TOOLS.length - 1}
          />
        ))}
      </div>

      <Divider />

      {/* Bloc 4 — Accès rapide */}
      <SectionLabel>Accès rapide</SectionLabel>
      <div className="flex flex-col gap-2">
        {QUICK_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-[500] text-[#1C42BD] transition-opacity hover:opacity-70"
          >
            <ExternalLink size={11} strokeWidth={2} />
            {link.label}
          </a>
        ))}
      </div>
    </aside>
  );
}
