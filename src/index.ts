import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Описуємо структуру нашого завдання
type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
};

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

app.delete("/api/todos/:id", (req: Request, res: Response) => {
  const id = req.params.id as string;
  todos = todos.filter((todo) => todo.id !== id);
  res.json({ message: "Завдання видалено" });
});

app.listen(PORT, () => {
  console.log(`[server]: Сервер запущено на http://localhost:${PORT}`);
});
