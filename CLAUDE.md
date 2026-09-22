# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server (`tsx watch`, watches `src/`, serves on port 4000).
- No build, lint, or test scripts are configured yet (`npm test` is a placeholder that exits with an error).
- Uses `tsx` (not `ts-node`) to run TypeScript directly, since the installed `typescript@7` (the new native rewrite) isn't yet supported by `ts-node`'s internals.
- Port is 4000, not 5000 — port 5000 is taken by macOS's AirPlay Receiver (Control Center) on this machine; `app.listen(5000, ...)` would either crash with `EADDRINUSE` or silently not receive real traffic.

## Architecture

This is a minimal Express 5 API written in TypeScript, currently a single file: `src/index.ts`. It uses native ESM (`"type": "module"` in package.json, `module`/`moduleResolution: NodeNext` in tsconfig) and is run directly via `tsx` rather than compiled — `tsc` output would go to `./dist` per tsconfig but there is no build step wired up yet.

Routes are defined inline on the `app` instance (no router/controller/service layering yet):
- `GET /api/todos`
- `POST /api/todos` — requires `title` in the body, 400 if missing
- `PATCH /api/todos/:id` — updates `completed`, 404 if the id doesn't exist
- `DELETE /api/todos/:id`

State is held in a module-level `let todos: TodoItem[]` array — in memory only, resets on every server restart, no database.
