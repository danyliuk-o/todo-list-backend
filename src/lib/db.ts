import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing DATABASE_URL — fill it in in .env (see .env.example)."
  );
}

// One shared pool of Postgres connections, reused across requests.
// Supabase requires SSL; its pooler certificate isn't in Node's trust store,
// hence rejectUnauthorized: false.
export const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});
