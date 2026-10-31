import { beforeEach, describe, expect, it, vi } from "vitest";

// Replace the repository with fakes so these tests never touch the database.
// vi.mock is hoisted above the imports, so the service receives the fake module.
vi.mock("../repositories/todo.repository.js", () => ({
  todoRepository: {
    findAll: vi.fn(),
    create: vi.fn(),
    updateCompleted: vi.fn(),
    remove: vi.fn(),
  },
}));

import { todoRepository } from "../repositories/todo.repository.js";
import { todoService } from "./todo.service.js";
import { HttpError } from "../errors/http-error.js";

const VALID_ID = "c19452ea-933b-45ee-a99d-b75b4d1912af";

// Clear call history between tests so one test can't affect another
beforeEach(() => {
  vi.clearAllMocks();
});

describe("getAllTodos", () => {
  it("returns all todos when no search is given", async () => {
    vi.mocked(todoRepository.findAll).mockResolvedValue([]);

    await todoService.getAllTodos();

    expect(todoRepository.findAll).toHaveBeenCalledWith(undefined);
  });

  it("trims the search text before passing it on", async () => {
    vi.mocked(todoRepository.findAll).mockResolvedValue([]);

    await todoService.getAllTodos("  milk  ");

    expect(todoRepository.findAll).toHaveBeenCalledWith("milk");
  });

  it("rejects a non-string search with 400", async () => {
    await expect(todoService.getAllTodos(["a", "b"])).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(todoRepository.findAll).not.toHaveBeenCalled();
  });
});

describe("createTodo", () => {
  it.each([undefined, "", "   ", 42])("rejects title %j with 400", async (title) => {
    await expect(todoService.createTodo(title)).rejects.toBeInstanceOf(HttpError);
    expect(todoRepository.create).not.toHaveBeenCalled();
  });

  it("creates a todo for a valid title", async () => {
    const todo = { id: VALID_ID, title: "Buy milk", completed: false };
    vi.mocked(todoRepository.create).mockResolvedValue(todo);

    await expect(todoService.createTodo("Buy milk")).resolves.toEqual(todo);
    expect(todoRepository.create).toHaveBeenCalledWith("Buy milk");
  });
});

describe("setCompleted", () => {
  it("rejects a malformed id with 400 before touching the repository", async () => {
    await expect(todoService.setCompleted("abc", true)).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(todoRepository.updateCompleted).not.toHaveBeenCalled();
  });

  it("rejects a non-boolean completed with 400", async () => {
    await expect(
      todoService.setCompleted(VALID_ID, "yes"),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(todoRepository.updateCompleted).not.toHaveBeenCalled();
  });

  it("throws 404 when the todo does not exist", async () => {
    vi.mocked(todoRepository.updateCompleted).mockResolvedValue(undefined);

    await expect(
      todoService.setCompleted(VALID_ID, true),
    ).rejects.toMatchObject({ statusCode: 404 });
  });

  it("returns the updated todo", async () => {
    const todo = { id: VALID_ID, title: "Buy milk", completed: true };
    vi.mocked(todoRepository.updateCompleted).mockResolvedValue(todo);

    await expect(todoService.setCompleted(VALID_ID, true)).resolves.toEqual(todo);
    expect(todoRepository.updateCompleted).toHaveBeenCalledWith(VALID_ID, true);
  });
});

describe("deleteTodo", () => {
  it("rejects a malformed id with 400 before touching the repository", async () => {
    await expect(todoService.deleteTodo("abc")).rejects.toMatchObject({
      statusCode: 400,
    });
    expect(todoRepository.remove).not.toHaveBeenCalled();
  });

  it("deletes by a valid id", async () => {
    vi.mocked(todoRepository.remove).mockResolvedValue(undefined);

    await todoService.deleteTodo(VALID_ID);

    expect(todoRepository.remove).toHaveBeenCalledWith(VALID_ID);
  });
});
