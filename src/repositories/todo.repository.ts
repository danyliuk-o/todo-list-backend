import { pool } from "../lib/db.js";
import { TodoItem } from "../types/todo.types.js";

// Data-access layer: only layer allowed to talk to the database directly.
// Values are always passed via $1, $2... placeholders (never concatenated into
// the SQL string) so user input can't change the meaning of a query.
const COLUMNS = "id, title, completed, created_at";

export const todoRepository = {
  async findAll(search?: string): Promise<TodoItem[]> {
    if (search) {
      // ILIKE = case-insensitive LIKE; % matches any characters around the term.
      // \, % and _ are LIKE wildcards, so escape them to search for them literally.
      const escaped = search.replace(/[\\%_]/g, "\\$&");
      const { rows } = await pool.query<TodoItem>(
        `SELECT ${COLUMNS} FROM todos WHERE title ILIKE $1 ORDER BY created_at`,
        [`%${escaped}%`],
      );
      return rows;
    }

    const { rows } = await pool.query<TodoItem>(
      `SELECT ${COLUMNS} FROM todos ORDER BY created_at`,
    );
    return rows;
  },

  async findById(id: string): Promise<TodoItem | undefined> {
    const { rows } = await pool.query<TodoItem>(
      `SELECT ${COLUMNS} FROM todos WHERE id = $1`,
      [id],
    );
    return rows[0];
  },

  async create(title: string): Promise<TodoItem> {
    const { rows } = await pool.query<TodoItem>(
      `INSERT INTO todos (title) VALUES ($1) RETURNING ${COLUMNS}`,
      [title],
    );
    return rows[0]!;
  },

  async updateCompleted(
    id: string,
    completed: boolean,
  ): Promise<TodoItem | undefined> {
    const { rows } = await pool.query<TodoItem>(
      `UPDATE todos SET completed = $1 WHERE id = $2 RETURNING ${COLUMNS}`,
      [completed, id],
    );
    return rows[0];
  },

  async remove(id: string): Promise<void> {
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
  },
};
