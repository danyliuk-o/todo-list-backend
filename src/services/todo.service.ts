import { todoRepository } from "../repositories/todo.repository.js";
import { TodoItem } from "../types/todo.types.js";
import { HttpError } from "../errors/http-error.js";

// Business-logic layer: validation and rules live here, not in controllers or the repository
export const todoService = {
  getAllTodos(): TodoItem[] {
    return todoRepository.findAll();
  },

  createTodo(title: unknown): TodoItem {
    if (typeof title !== "string" || !title.trim()) {
      throw new HttpError(400, "Title is required");
    }

    return todoRepository.create(title);
  },

  setCompleted(id: string, completed: unknown): TodoItem {
    const todo = todoRepository.findById(id);

    if (!todo) {
      throw new HttpError(404, "Todo not found");
    }

    if (typeof completed === "boolean") {
      return todoRepository.updateCompleted(id, completed) as TodoItem;
    }

    return todo;
  },

  deleteTodo(id: string): void {
    todoRepository.remove(id);
  },
};
