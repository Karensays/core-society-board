"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { TodoStatus } from "@/lib/supabase";

export interface TodoItemProps {
  id: string;
  text: string;
  status: TodoStatus;
  dueDate?: string | null;
  onCheck: (id: string) => void;
  onStatusChange: (id: string, status: TodoStatus) => void;
}

// Options de statut (réutilisées par le formulaire d'ajout)
export const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: "todo", label: "à faire" },
  { value: "inprogress", label: "en cours" },
  { value: "urgent", label: "urgent" },
  { value: "done", label: "terminé" },
];

// Tags statut inline (CLAUDE.md section 4 + brief session 3)
const STATUS_TAG: Record<
  Exclude<TodoStatus, "todo">,
  { bg: string; color: string; label: string }
> = {
  urgent: { bg: "#fef2f2", color: "#dc2626", label: "urgent" },
  inprogress: { bg: "#eff6ff", color: "#1C42BD", label: "en cours" },
  done: { bg: "#f0fdf4", color: "#16a34a", label: "terminé" },
};

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

export function TodoItem({
  id,
  text,
  status,
  dueDate,
  onCheck,
  onStatusChange,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const isDone = status === "done";
  const tag = status !== "todo" ? STATUS_TAG[status] : null;

  return (
    <div className="flex items-start gap-2.5 border-b border-[#f0f0ec] py-2.5">
      {/* Checkbox */}
      <button
        type="button"
        onClick={() => onCheck(id)}
        aria-label="Marquer comme terminé"
        className="mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors"
        style={{
          borderColor: isDone ? "#1C42BD" : "#d0d0cc",
          backgroundColor: isDone ? "#1C42BD" : "transparent",
        }}
      >
        {isDone && <Check size={11} strokeWidth={3} color="#ffffff" />}
      </button>

      {/* Contenu */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={
              isDone
                ? "text-[12px] font-[400] text-[#bbb] line-through"
                : "text-[12px] font-[500] text-ink"
            }
          >
            {text}
          </span>

          {tag && (
            <span
              className="rounded-[4px] px-1.5 py-0.5 text-[9px] font-[700] tracking-[0.03em]"
              style={{ backgroundColor: tag.bg, color: tag.color }}
            >
              {tag.label}
            </span>
          )}

          {dueDate && (
            <span className="rounded-[4px] border border-border px-1.5 py-0.5 text-[9px] font-[400] text-muted-light">
              Échéance : {formatDate(dueDate)}
            </span>
          )}
        </div>

        {/* Changer statut */}
        <div className="mt-1">
          {editing ? (
            <select
              autoFocus
              value={status}
              onChange={(e) => {
                onStatusChange(id, e.target.value as TodoStatus);
                setEditing(false);
              }}
              onBlur={() => setEditing(false)}
              className="rounded-[4px] border border-border-strong bg-card px-1.5 py-1 text-[9px] font-[500] text-ink outline-none focus:border-blue"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-[9px] font-[500] text-muted-light transition-colors hover:text-blue"
            >
              → changer statut
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
