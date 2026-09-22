import { TodoItem } from "../types/todo.types.js";

// In-memory "database" — resets on every server restart
let todos: TodoItem[] = [];

// Data-access layer: only layer allowed to touch the `todos` array directly
export const todoRepository = {
  findAll(): TodoItem[] {
    return todos;
  },

  findById(id: string): TodoItem | undefined {
    return todos.find((todo) => todo.id === id);
  },

  create(title: string): TodoItem {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      title,
      completed: false,
    };

    todos.push(newTodo);
    return newTodo;
  },

  updateCompleted(id: string, completed: boolean): TodoItem | undefined {
    const todo = todoRepository.findById(id);

    if (todo) {
      todo.completed = completed;
    }

    return todo;
  },

  remove(id: string): void {
    todos = todos.filter((todo) => todo.id !== id);
  },
};
