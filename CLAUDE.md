# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server (`tsx watch`, watches `src/`, serves on port 4000).
- No build, lint, or test scripts are configured yet (`npm test` is a placeholder that exits with an error).
- Uses `tsx` (not `ts-node`) to run TypeScript directly, since the installed `typescript@7` (the new native rewrite) isn't yet supported by `ts-node`'s internals.
- Port is 4000, not 5000 — port 5000 is taken by macOS's AirPlay Receiver (Control Center) on this machine; `app.listen(5000, ...)` would either crash with `EADDRINUSE` or silently not receive real traffic.

## Architecture

This is a minimal Express 5 API written in TypeScript. It uses native ESM (`"type": "module"` in package.json, `module`/`moduleResolution: NodeNext` in tsconfig, so relative imports need explicit `.js` extensions) and is run directly via `tsx` rather than compiled — `tsc` output would go to `./dist` per tsconfig but there is no build step wired up yet.

The `todos` resource is split into layers under `src/`:
- `routes/todo.routes.ts` — maps HTTP verbs + paths to controller methods, no logic of its own
- `controllers/todo.controller.ts` — translates HTTP req/res to/from service calls; thrown errors bubble up to Express
- `services/todo.service.ts` — validation and business rules (e.g. `title` required, 404 on unknown id)
- `repositories/todo.repository.ts` — the only layer that touches the in-memory store directly
- `types/todo.types.ts` — the `TodoItem` shape
- `errors/http-error.ts` — `HttpError` (status code + message) thrown by the service layer
- `middleware/error-handler.ts` — centralized handler, registered last in `app.ts`, that maps `HttpError` to its status code and anything else to a 500
- `app.ts` — builds the Express app, wires middleware/routes/error-handler; `index.ts` just imports it and calls `.listen(PORT)`

Routes:
- `GET /api/todos`
- `POST /api/todos` — requires `title` in the body, 400 if missing
- `PATCH /api/todos/:id` — updates `completed`, 404 if the id doesn't exist
- `DELETE /api/todos/:id`

State is held in a module-level `let todos: TodoItem[]` array inside the repository — in memory only, resets on every server restart, no database.

When adding a second resource, mirror this same layering (routes → controller → service → repository) rather than putting logic directly on the `app` instance.
