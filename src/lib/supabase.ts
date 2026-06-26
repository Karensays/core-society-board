import { createClient } from "@supabase/supabase-js";

// Statuts valides de board_todos (CLAUDE.md section 4)
export type TodoStatus = "todo" | "inprogress" | "urgent" | "done";

export interface Todo {
  id: string;
  text: string;
  status: TodoStatus;
  due_date: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client Supabase navigateur — app privée, accès via la clé anon (CLAUDE.md sections 4 & 5).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
