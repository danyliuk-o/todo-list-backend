import { todoRepository } from "../repositories/todo.repository.js";
import { TodoItem } from "../types/todo.types.js";
import { HttpError } from "../errors/http-error.js";

// Business-logic layer: validation and rules live here, not in controllers or the repository
export const todoService = {
  async getAllTodos(): Promise<TodoItem[]> {
    return todoRepository.findAll();
  },

  async createTodo(title: unknown): Promise<TodoItem> {
    if (typeof title !== "string" || !title.trim()) {
      throw new HttpError(400, "Title is required");
    }

    return todoRepository.create(title);
  },

  async setCompleted(id: string, completed: unknown): Promise<TodoItem> {
    const todo = await todoRepository.findById(id);

    if (!todo) {
      throw new HttpError(404, "Todo not found");
    }

    if (typeof completed === "boolean") {
      return (await todoRepository.updateCompleted(id, completed)) as TodoItem;
    }

    return todo;
  },

  async deleteTodo(id: string): Promise<void> {
    await todoRepository.remove(id);
  },
};
