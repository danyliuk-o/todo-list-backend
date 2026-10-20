# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server (`tsx watch`, watches `src/`, serves on port 4000).
- No build, lint, or test scripts are configured yet (`npm test` is a placeholder that exits with an error).
- Uses `tsx` (not `ts-node`) to run TypeScript directly, since the installed `typescript@7` (the new native rewrite) isn't yet supported by `ts-node`'s internals.
- Port is 4000, not 5000 — port 5000 is taken by macOS's AirPlay Receiver (Control Center) on this machine; `app.listen(5000, ...)` would either crash with `EADDRINUSE` or silently not receive real traffic.
- `post.repository.ts` still uses the Supabase client (`lib/supabaseClient.ts`), so `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are still required for it. Only `todos` has moved to raw SQL.
- Requires `DATABASE_URL` in a `.env` file (copy `.env.example`; get the Postgres connection string from the Supabase project's Connect dialog — use the Session/Transaction **pooler** string, the direct host is IPv6-only). `src/lib/db.ts` throws a clear error at startup if it's missing — don't remove that check.
- The `todos` table's schema (id/title/completed/created_at) is documented only in this file; `migrations/` currently holds just `001_create_posts.sql`.

## Architecture

This is a minimal Express 5 API written in TypeScript. It uses native ESM (`"type": "module"` in package.json, `module`/`moduleResolution: NodeNext` in tsconfig, so relative imports need explicit `.js` extensions) and is run directly via `tsx` rather than compiled — `tsc` output would go to `./dist` per tsconfig but there is no build step wired up yet.

`src/env.ts` loads `.env` via Node's built-in `process.loadEnvFile()` (Node 22+, no `dotenv` dependency needed) and must stay the *first* import in `index.ts` — ESM imports execute in the order they're written, and everything downstream (via `app.js` → ... → `supabaseClient.js`) reads `process.env` at module-load time.

The `todos` resource is split into layers under `src/`:
- `routes/todo.routes.ts` — maps HTTP verbs + paths to controller methods, no logic of its own
- `controllers/todo.controller.ts` — translates HTTP req/res to/from service calls (all `async`); thrown errors and rejected promises bubble up to Express 5's built-in async error handling
- `services/todo.service.ts` — validation and business rules (e.g. `title` required, 404 on unknown id)
- `repositories/todo.repository.ts` — the only layer that talks to the database; plain SQL via `pool.query` with `$1, $2…` placeholders (never string-concatenate user input into SQL)
- `lib/db.ts` — creates the `pg` connection `Pool` from `DATABASE_URL`; used only by the repository layer
- `types/todo.types.ts` — the `TodoItem` shape
- `errors/http-error.ts` — `HttpError` (status code + message) thrown by the service layer
- `middleware/error-handler.ts` — centralized handler, registered last in `app.ts`, that maps `HttpError` to its status code and anything else to a 500
- `app.ts` — builds the Express app, wires middleware/routes/error-handler; `index.ts` imports `./env.js` first, then `./app.js`, then calls `.listen(PORT)`

Routes:
- `GET /api/todos` — optional `?search=text` filters by title (case-insensitive `ILIKE`)
- `POST /api/todos` — requires `title` in the body, 400 if missing
- `PATCH /api/todos/:id` — updates `completed`, 404 if the id doesn't exist
- `DELETE /api/todos/:id`

State lives in Supabase Postgres (table `todos`: `id uuid pk default gen_random_uuid()`, `title text`, `completed boolean default false`, `created_at timestamptz default now()`), accessed with raw SQL over a direct Postgres connection (`DATABASE_URL`). That connection logs in as the database user from the connection string, which bypasses Row Level Security like the old `service_role` key did — keep it server-side only.

When adding a second resource, mirror this same layering (routes → controller → service → repository) rather than putting logic directly on the `app` instance.
