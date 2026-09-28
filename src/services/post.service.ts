import { postRepository } from "../repositories/post.repository.js";
import { PostItem } from "../types/post.types.js";
import { HttpError } from "../errors/http-error.js";

// Business-logic layer: validation and rules live here, not in controllers or the repository
export const postService = {
  async getAllPosts(): Promise<PostItem[]> {
    return postRepository.findAll();
  },

  async getPost(id: string): Promise<PostItem> {
    const post = await postRepository.findById(id);

    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    return post;
  },

  async createPost(
    title: unknown,
    excerpt: unknown,
    content: unknown,
  ): Promise<PostItem> {
    if (typeof title !== "string" || !title.trim()) {
      throw new HttpError(400, "Title is required");
    }

    if (typeof excerpt !== "string" || !excerpt.trim()) {
      throw new HttpError(400, "Excerpt is required");
    }

    return postRepository.create({
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: typeof content === "string" ? content : "",
    });
  },

  async deletePost(id: string): Promise<void> {
    await postRepository.remove(id);
  },
};
