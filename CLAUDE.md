# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — run the dev server (nodemon + ts-node/esm, watches `src/`, serves on port 5000).
- No build, lint, or test scripts are configured yet (`npm test` is a placeholder that exits with an error).

## Architecture

This is a minimal Express 5 API written in TypeScript, currently a single file: `src/index.ts`. It uses native ESM (`"type": "module"` in package.json, `module`/`moduleResolution: NodeNext` in tsconfig) and is run directly via `ts-node/esm` rather than compiled — `tsc` output would go to `./dist` per tsconfig but there is no build step wired up yet.

Routes are defined inline on the `app` instance (no router/controller/service layering yet):
- `GET /api/todos`
- `POST /api/todos`
- `DELETE /api/todos/:id`

State is held in memory (no database).
