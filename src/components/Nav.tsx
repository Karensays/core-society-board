"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Bot,
  Activity,
  ExternalLink,
  type LucideIcon,
} from "lucide-react";

export type ViewId = "cockpit" | "agents" | "system" | "access";

export interface NavProps {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}

const TABS: { id: ViewId; label: string; icon: LucideIcon; badge?: string }[] = [
  { id: "cockpit", label: "Cockpit", icon: LayoutDashboard },
  { id: "agents", label: "Agents", icon: Bot, badge: "5" },
  { id: "system", label: "Système", icon: Activity },
  { id: "access", label: "Accès", icon: ExternalLink },
];

export function Nav({ activeView, onViewChange }: NavProps) {
  // Date calculée après montage pour éviter tout mismatch d'hydratation
  // (fuseau serveur vs navigateur).
  const [date, setDate] = useState<{ weekday: string; rest: string } | null>(
    null,
  );
  useEffect(() => {
    const d = new Date();
    setDate({
      weekday: new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(d),
      rest: new Intl.DateTimeFormat("fr-FR", {
        day: "numeric",
        month: "long",
      }).format(d),
    });
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-11 items-center justify-between bg-card px-4"
      style={{ boxShadow: "0 1px 0 #e4e4e0" }}
    >
      {/* Gauche — logo */}
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-[700] text-blue">core society</span>
        <span
          className="text-[8px] font-[700] text-white"
          style={{
            background: "#1C42BD",
            padding: "2px 7px",
            borderRadius: "4px",
          }}
        >
          board
        </span>
      </div>

      {/* Centre — onglets pills */}
      <nav className="flex flex-1 items-center justify-center gap-1 px-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeView === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onViewChange(tab.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-[20px] px-3.5 py-1.5 text-[11px] transition-all duration-150 ${
                active
                  ? "bg-blue font-[600] text-white"
                  : "bg-transparent font-[500] text-[#999] hover:bg-[#f0f0ec]"
              }`}
            >
              <Icon size={13} strokeWidth={2} />
              {tab.label}
              {tab.badge && (
                <span
                  className="rounded-[6px] px-1 text-[8px] font-[700] text-white"
                  style={{
                    background: active ? "rgba(255,255,255,0.25)" : "#1C42BD",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Droite — date */}
      <div className="min-w-[120px] text-right text-[10px]">
        {date && (
          <>
            <span className="font-[600] capitalize text-[#555]">
              {date.weekday}
            </span>{" "}
            <span className="font-[400] text-[#bbb]">{date.rest}</span>
          </>
        )}
      </div>
    </header>
  );
}
