import { supabase } from "../lib/supabaseClient.js";
import { PostItem } from "../types/post.types.js";

// Data-access layer: only layer allowed to talk to Supabase directly
export const postRepository = {
  async findAll(): Promise<PostItem[]> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async findById(id: string): Promise<PostItem | undefined> {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ?? undefined;
  },

  async create(
    post: Pick<PostItem, "title" | "excerpt" | "content">,
  ): Promise<PostItem> {
    const { data, error } = await supabase
      .from("posts")
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
  },
};
