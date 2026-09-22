import { Request, Response } from "express";
import { todoService } from "../services/todo.service.js";

// Controller layer: translates HTTP requests/responses to/from service calls.
// Errors thrown here (including rejected promises — Express 5 forwards those
// automatically) are caught by Express and forwarded to the error-handling middleware.
export const todoController = {
  async getAll(_req: Request, res: Response) {
    res.json(await todoService.getAllTodos());
  },

  async create(req: Request, res: Response) {
    const todo = await todoService.createTodo(req.body.title);
    res.status(201).json(todo);
  },

  async updateCompleted(req: Request, res: Response) {
    const id = req.params.id as string;
    const todo = await todoService.setCompleted(id, req.body.completed);
    res.json(todo);
  },

  async remove(req: Request, res: Response) {
    const id = req.params.id as string;
    await todoService.deleteTodo(id);
    res.json({ message: "Todo deleted" });
  },
};
