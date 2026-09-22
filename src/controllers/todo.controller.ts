import { Request, Response } from "express";
import { todoService } from "../services/todo.service.js";

// Controller layer: translates HTTP requests/responses to/from service calls.
// Errors thrown here are caught by Express and forwarded to the error-handling middleware.
export const todoController = {
  getAll(_req: Request, res: Response) {
    res.json(todoService.getAllTodos());
  },

  create(req: Request, res: Response) {
    const todo = todoService.createTodo(req.body.title);
    res.status(201).json(todo);
  },

  updateCompleted(req: Request, res: Response) {
    const id = req.params.id as string;
    const todo = todoService.setCompleted(id, req.body.completed);
    res.json(todo);
  },

  remove(req: Request, res: Response) {
    const id = req.params.id as string;
    todoService.deleteTodo(id);
    res.json({ message: "Todo deleted" });
  },
};
