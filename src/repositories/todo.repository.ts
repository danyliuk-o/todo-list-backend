import { supabase } from "../lib/supabaseClient.js";
import { TodoItem } from "../types/todo.types.js";

// Data-access layer: only layer allowed to talk to Supabase directly
export const todoRepository = {
  async findAll(): Promise<TodoItem[]> {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at");

    if (error) throw error;
    return data;
  },

  async findById(id: string): Promise<TodoItem | undefined> {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ?? undefined;
  },

  async create(title: string): Promise<TodoItem> {
    const { data, error } = await supabase
      .from("todos")
      .insert({ title })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCompleted(
    id: string,
    completed: boolean,
  ): Promise<TodoItem | undefined> {
    const { data, error } = await supabase
      .from("todos")
      .update({ completed })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data ?? undefined;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) throw error;
  },
};
