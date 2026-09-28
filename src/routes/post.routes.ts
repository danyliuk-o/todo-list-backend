import { Router } from "express";
import { postController } from "../controllers/post.controller.js";

// Routing layer: maps HTTP verbs + paths to controller methods, no logic of its own
export const postRouter = Router();

postRouter.get("/", postController.getAll);
postRouter.get("/:id", postController.getOne);
postRouter.post("/", postController.create);
postRouter.delete("/:id", postController.remove);
