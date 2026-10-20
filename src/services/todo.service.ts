import { todoRepository } from "../repositories/todo.repository.js";
import { TodoItem } from "../types/todo.types.js";
import { HttpError } from "../errors/http-error.js";

// The id column is a Postgres uuid; any other string makes the database throw
// (which would surface as a 500), so reject it here as a client error instead.
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function assertValidId(id: string): void {
  if (!UUID_PATTERN.test(id)) {
    throw new HttpError(400, "Invalid todo id");
  }
}

// Business-logic layer: validation and rules live here, not in controllers or the repository
export const todoService = {
  async getAllTodos(search?: unknown): Promise<TodoItem[]> {
    if (search !== undefined && typeof search !== "string") {
      throw new HttpError(400, "Search must be a string");
    }

    return todoRepository.findAll(search?.trim());
  },

  async createTodo(title: unknown): Promise<TodoItem> {
    if (typeof title !== "string" || !title.trim()) {
      throw new HttpError(400, "Title is required");
    }

    return todoRepository.create(title);
  },

  async setCompleted(id: string, completed: unknown): Promise<TodoItem> {
    assertValidId(id);

    if (typeof completed !== "boolean") {
      throw new HttpError(400, "Completed must be a boolean");
    }

    // The update itself reports a missing row (repository returns undefined),
    // so there's no separate existence check to race against.
    const todo = await todoRepository.updateCompleted(id, completed);

    if (!todo) {
      throw new HttpError(404, "Todo not found");
    }

    return todo;
  },

  async deleteTodo(id: string): Promise<void> {
    assertValidId(id);

    await todoRepository.remove(id);
  },
};
