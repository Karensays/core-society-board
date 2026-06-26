"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase, type Todo, type TodoStatus } from "@/lib/supabase";
import { TodoItem } from "./TodoItem";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] font-[600] uppercase tracking-[0.12em] text-muted-light">
      {children}
    </span>
  );
}

export function TodoSection() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("board_todos")
        .select("*")
        .order("position", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Erreur de chargement des todos :", error.message);
        return;
      }
      setTodos((data as Todo[]) ?? []);
    } catch (err) {
      console.error("Erreur réseau lors du chargement des todos :", err);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleCheck = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase
          .from("board_todos")
          .update({ status: "done", updated_at: new Date().toISOString() })
          .eq("id", id);

        if (error) {
          console.error("Erreur lors du check :", error.message);
          return;
        }
        fetchTodos();
      } catch (err) {
        console.error("Erreur réseau lors du check :", err);
      }
    },
    [fetchTodos],
  );

  const handleStatusChange = useCallback(
    async (id: string, status: TodoStatus) => {
      try {
        const { error } = await supabase
          .from("board_todos")
          .update({ status, updated_at: new Date().toISOString() })
          .eq("id", id);

        if (error) {
          console.error("Erreur lors du changement de statut :", error.message);
          return;
        }
        fetchTodos();
      } catch (err) {
        console.error("Erreur réseau lors du changement de statut :", err);
      }
    },
    [fetchTodos],
  );

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const text = data.get("text") as string;
    const due_date = (data.get("due_date") as string) || null;
    const status = data.get("status") as TodoStatus;

    if (!text.trim()) return;

    try {
      await supabase.from("board_todos").insert({
        text: text.trim(),
        status,
        due_date: due_date || null,
        position: todos.length,
      });
      form.reset();
      await fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const pending = todos.filter((t) => t.status !== "done").length;

  return (
    <section className="rounded-card border border-border bg-card px-4 py-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <SectionLabel>To-do</SectionLabel>
        <span className="rounded-[4px] bg-blue-light px-1.5 py-0.5 text-[9px] font-[700] text-blue">
          {pending} en attente
        </span>
      </div>

      {/* Liste */}
      <div className="mt-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            status={todo.status}
            dueDate={todo.due_date}
            onCheck={handleCheck}
            onStatusChange={handleStatusChange}
          />
        ))}
        {todos.length === 0 && (
          <p className="py-2.5 text-[11px] font-[400] text-muted">
            Aucune tâche pour le moment.
          </p>
        )}
      </div>

      {/* Formulaire d'ajout — toujours visible, FormData natif */}
      <form
        onSubmit={handleAdd}
        style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #f0f0ec" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="text"
            name="text"
            placeholder="Nouvelle tâche..."
            required
            style={{
              width: "100%",
              fontSize: "11px",
              padding: "7px 10px",
              border: "1px solid #e8e8e4",
              borderRadius: "6px",
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
              <label
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#bbb",
                  letterSpacing: "0.08em",
                }}
              >
                Date d&apos;échéance
              </label>
              <input
                type="date"
                name="due_date"
                style={{
                  fontSize: "11px",
                  padding: "6px 8px",
                  border: "1px solid #e8e8e4",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
              <label
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#bbb",
                  letterSpacing: "0.08em",
                }}
              >
                Statut
              </label>
              <select
                name="status"
                style={{
                  fontSize: "11px",
                  padding: "6px 8px",
                  border: "1px solid #e8e8e4",
                  borderRadius: "6px",
                  fontFamily: "inherit",
                }}
              >
                <option value="todo">À faire</option>
                <option value="inprogress">En cours</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              fontSize: "11px",
              fontWeight: 600,
              color: "#ffffff",
              background: "#1C42BD",
              border: "none",
              borderRadius: "6px",
              padding: "7px 14px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Ajouter
          </button>
        </div>
      </form>
    </section>
  );
}
