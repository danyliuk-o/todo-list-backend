import { existsSync } from "node:fs";

// Loads .env into process.env before anything else runs.
// Must be imported first in index.ts — ES module imports execute in the
// order they're written, so this has to come before importing ./app.js
// (which eventually reads process.env when creating the Supabase client).
if (existsSync(".env")) {
  process.loadEnvFile();
}
