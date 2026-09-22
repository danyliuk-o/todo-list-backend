import "./env.js";
import { app } from "./app.js";

// Entry point: start the server
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`[server]: Server running on http://localhost:${PORT}`);
});
