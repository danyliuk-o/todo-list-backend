import { Request, Response } from "express";
import { postService } from "../services/post.service.js";

// Controller layer: translates HTTP requests/responses to/from service calls.
// Rejected promises are forwarded by Express 5 to the error-handling middleware.
export const postController = {
  async getAll(_req: Request, res: Response) {
    res.json(await postService.getAllPosts());
  },

  async getOne(req: Request, res: Response) {
    const id = req.params.id as string;
    res.json(await postService.getPost(id));
  },

  async create(req: Request, res: Response) {
    const { title, excerpt, content } = req.body;
    const post = await postService.createPost(title, excerpt, content);
    res.status(201).json(post);
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await postService.deletePost(id);
    res.json({ message: "Post deleted" });
  },
};
