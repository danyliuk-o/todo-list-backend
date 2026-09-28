import express from "express";
import cors from "cors";
import { todoRouter } from "./routes/todo.routes.js";
import { postRouter } from "./routes/post.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

// App setup: Express instance, global middleware, and route mounting
export const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRouter);
app.use("/api/posts", postRouter);

// Must be registered last: catches errors thrown by any route/controller above
app.use(errorHandler);
