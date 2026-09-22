import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Описуємо структуру нашого завдання
type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

// "База даних" в оперативній пам'яті — скидається при кожному перезапуску сервера
let todos: TodoItem[] = [];

app.get("/api/todos", (req: Request, res: Response) => {
  res.json(todos);
});

app.post("/api/todos", (req: Request, res: Response) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  const newTodo: TodoItem = {
    id: Date.now().toString(),
    title: title,
    completed: false,
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { completed } = req.body;

  const todo = todos.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).json({ error: "Todo not found" });
    return;
  }

  if (typeof completed === "boolean") {
    todo.completed = completed;
  }

  res.json(todo);
});

app.delete("/api/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  todos = todos.filter((todo) => todo.id !== id);
  res.json({ message: "Завдання видалено" });
});

app.listen(PORT, () => {
  console.log(`[server]: Сервер запущено на http://localhost:${PORT}`);
});
