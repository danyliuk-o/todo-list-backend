import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";

// Routing layer: maps HTTP verbs + paths to controller methods, no logic of its own
export const todoRouter = Router();

todoRouter.get("/", todoController.getAll);
todoRouter.post("/", todoController.create);
todoRouter.patch("/:id", todoController.updateCompleted);
todoRouter.delete("/:id", todoController.remove);
