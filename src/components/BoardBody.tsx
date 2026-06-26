"use client";

import { useState } from "react";
import { Nav, type ViewId } from "@/components/Nav";

export interface BoardBodyProps {
  cockpit: React.ReactNode;
  agents: React.ReactNode;
  system: React.ReactNode;
  access: React.ReactNode;
}

export function BoardBody({ cockpit, agents, system, access }: BoardBodyProps) {
  const [activeView, setActiveView] = useState<ViewId>("cockpit");

  return (
    <>
      <Nav activeView={activeView} onViewChange={setActiveView} />

      {/* Zone sous la nav fixe (44px) — hauteur fixe, scroll délégué aux vues */}
      <div
        style={{
          marginTop: "44px",
          height: "calc(100vh - 44px)",
          overflow: "hidden",
        }}
      >
        {activeView === "cockpit" && cockpit}
        {activeView === "agents" && agents}
        {activeView === "system" && system}
        {activeView === "access" && access}
      </div>
    </>
  );
}
