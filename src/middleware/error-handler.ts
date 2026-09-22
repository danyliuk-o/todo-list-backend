import { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/http-error.js";

// Centralized error handler: converts thrown HttpErrors to their status code,
// and anything unexpected to a generic 500.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
