import { Greeting } from "@/components/Greeting";
import { KPISection } from "@/components/KPISection";
import { MiniBarChart } from "@/components/MiniBarChart";
import { TodoSection } from "@/components/TodoSection";
import { AlertCard } from "@/components/Aside/AlertCard";
import { ToolRow } from "@/components/Aside/ToolRow";
import { TOOLS } from "@/data/tools";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-[9px] font-[700] uppercase tracking-[0.14em] text-blue">
      {children}
    </p>
  );
}

export function CockpitView() {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Colonne principale (scroll interne) */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 20px 20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <Greeting />
        <KPISection />

        {/* CTA — Dashboard financier */}
        <div
          style={{
            background: "white",
            border: "1px solid #e4e4e0",
            borderRadius: "10px",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#1a1a1a" }}>
              Dashboard financier complet
            </div>
            <div style={{ fontSize: "10px", color: "#aaa", marginTop: "2px" }}>
              Transactions BRED · Dépenses · Projections juin 2025
            </div>
          </div>
          <a
            href="https://compta.coresociety.fr"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#1C42BD",
              color: "white",
              fontSize: "11px",
              fontWeight: 600,
              padding: "7px 14px",
              borderRadius: "6px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Voir le dashboard →
          </a>
        </div>

        <MiniBarChart />
        <TodoSection />
      </main>

      {/* Aside — Alertes + Santé des outils */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          overflowY: "auto",
          padding: "18px 16px",
          background: "#fafaf8",
          borderLeft: "1px solid #e4e4e0",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div>
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
        </div>

        <div>
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
        </div>
      </aside>
    </div>
  );
}
