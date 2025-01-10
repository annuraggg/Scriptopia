import "dotenv/config";
import app from "./config/init.js";
import logger from "./utils/logger.js";

const port = parseInt(process.env.PORT!);

app.get("/health", (c) => {
  return c.json({ status: "ok", version: process.env.VERSION });
});

app.get("/*", (c) => {
  return c.json({ status: "Not Found", code: 404 }, 404);
});

// inform

logger.info(`Server is running on port ${port}`);
